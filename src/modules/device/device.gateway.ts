import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer, MessageBody, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
} from "@nestjs/websockets";
import { Server } from "socket.io";
import * as WebSocket from "ws";
import * as os from "os";

@WebSocketGateway(4000, { cors: true })
export class DeviceGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private allNum = 0;

  /**
   * 初始化
   * @param server
   */
  afterInit(server: any): any {
    console.log("Navigation WebSocket 服务器初始化");
  }

  /**
   * 连接成功
   * @param client
   * @param args
   */
  handleConnection(client: any, ...args): any {
    this.allNum += 1;
    console.log(`有人进入，当前 Navigation 服务器人数：${this.allNum}`);
    this.server.emit("enter", {
      allNum: this.allNum
    });
  }

  /**
   * 断开连接
   * @param client
   */
  handleDisconnect(client: any): any {
    this.allNum -= 1;
    console.log(`有人离开，当前 Navigation 服务器人数：${this.allNum}`);
    this.server.emit("leave", {
      allNum: this.allNum
    });
  }

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
        { name: "CPU", num_value: useCpu },
        { name: "在线人数", num_value: this.allNum }
      ]);
    }, 1000);
    return data;
  }
}
