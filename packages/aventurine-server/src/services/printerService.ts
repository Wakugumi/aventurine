import { SerialPort } from "serialport";

const PRINTER_PORT = "/dev/rfcomm0";
const BAUD_RATE = 9600;

export class PrinterService {
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
========== Receipt ==========
${Object.entries(data)
  .map(([key, value]) => `${key} : ${value}`)
  .join("\n")}
=============================
\n\n\n`;

    await this.printRaw(receiptContent);
  }
}
