declare module "escpos-serialport" {
  import { EventEmitter } from "events";
  interface SerialPortOptions {
    baudRate?: number;
    stopBits?: number;
    parity?: string;
    flowControl?: boolean;
  }

  export default class SerialPort extends EventEmitter {
    constructor(device: string, options?: SerialPortOptions);
    open(callback: (err: Error | null) => void): void;
    write(data: Buffer | string, callback?: (err?: Error) => void): void;
    close(callback?: (err?: Error) => void): void;
  }
}
