import { Module } from "@nestjs/common";
import { DeviceGateway } from "./device.gateway";

@Module({
  providers: [DeviceGateway],
  exports: [DeviceGateway]
})
export class DeviceModule {
}
