import { Module } from "@nestjs/common";
import { TypeORMModule } from "./typeorm/typeorm.module";

@Module({
  imports: [TypeORMModule],
  exports: [TypeORMModule]
})
export class DatabaseModule { }
