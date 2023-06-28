import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer, MessageBody, ConnectedSocket
} from "@nestjs/websockets";
import { Server } from "socket.io";
import * as WebSocket from "ws";
import * as os from "os";

@WebSocketGateway(4000, { cors: true })
export class DeviceGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage("device")
  handleDeviceInfo(@ConnectedSocket() client: WebSocket, @MessageBody() data: string) {

    const dealMem = (mem) => {
      let G, M, KB;
      (mem > (1 << 30)) && (G = (mem / (1 << 30)).toFixed(2));
      (mem > (1 << 20)) && (mem < (1 << 30)) && (M = (mem / (1 << 20)).toFixed(2));
      (mem > (1 << 10)) && (mem > (1 << 20)) && (KB = (mem / (1 << 10)).toFixed(2));
      return G > 0 ? G + "G" : M > 0 ? M + "M" : KB > 0 ? KB + "KB" : mem + "B";
    };

    setInterval(() => {
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const cpus = os.cpus();
      let useCpu;
      cpus.forEach((cpu, idx, arr) => {
        const times = cpu.times;
        useCpu = ((1 - times.idle / (times.idle + times.user + times.nice + times.sys + times.irq)) * 100).toFixed(2) + "%";
      });
      client.emit("device", [
        { name: "总内存", num_value: dealMem(totalMem) },
        { name: "空闲内存", num_value: dealMem(freeMem) },
        { name: "CPU", num_value: useCpu }
      ]);
    }, 1000);
    return data;
  }
}
