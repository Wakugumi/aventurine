import { Printer } from "escpos";
import { SerialPort } from "serialport";

const PRINTER_PORT = "/dev/rfcomm0";
const BAUD_RATE = 9600;

export interface PrinterConfig {
  max_width: number;
  title: string;
  currency: "USD" | "IDR" | "JPY";
}

export interface PrinterHeader {
  /**
   * @type {string}
   * Transaction id
   */
  id: string;

  /**
   * @type {Date}
   * Transaction date
   */
  date: Date;
}

export interface PrinterBody {
  /**
   * @type {Record<string,any>}
   * Items of the transaction, accept JSON
   */
  items: Record<string, any>;

  /**
   * @type {number}
   * Total price of the transaction
   */
  total: number;
}

export class PrinterService {
  static printerConfig: PrinterConfig = {
    max_width: 32,
    title: "Receipt",
    currency: "USD",
  };

  static setConfig(config: PrinterConfig) {
    this.printerConfig = config;
  }

  /**
   * Returns a processed string for printing a line.
   * Adds a newline character at the end of the string.
   */
  static writeLine(content: string): string {
    return content + "\n";
  }

  /**
   * Write a separator with a text in the center as optional
   * e.g. ========= text ==========
   */
  static seperator(text?: string): string {
    const separator = "=";
    const thetext = text ? ` ${text} ` : "";
    const totalSeparators = this.printerConfig.max_width - thetext.length;

    if (totalSeparators <= 0) {
      return thetext.trim(); // If text is too long, return just the text
    }

    const half = Math.floor(totalSeparators / 2);
    const line =
      separator.repeat(half) +
      thetext +
      separator.repeat(totalSeparators - half);

    return this.writeLine(line);
  }

  static async printRaw(data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const port = new SerialPort({
        path: PRINTER_PORT,
        baudRate: BAUD_RATE,
      });

      port.write(data, (err) => {
        if (err) {
          console.error("Failed to write to printer:", err);
          return reject(err);
        }

        console.log("Data written to printer successfully");
        port.drain(() => {
          port.close();
          resolve();
        });
      });
    });
  }

  static async printReceipt(data: Record<string, any>): Promise<void> {
    const receiptContent = `

\n\n\n
${this.seperator(this.printerConfig.title)}
${Object.entries(data)
  .map(([key, value]) => `${key} : ${value}`)
  .join("\n")}
${this.seperator()}
\n\n\n`;

    await this.printRaw(receiptContent);
  }
}
