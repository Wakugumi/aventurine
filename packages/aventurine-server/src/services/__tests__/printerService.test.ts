import { PrinterService } from "../printerService";

// Mock serialport
jest.mock("serialport", () => {
  const mSerialPort = jest.fn().mockImplementation(() => ({
    write: jest.fn((data, callback) => callback && callback(null)),
    close: jest.fn((callback) => callback && callback(null)),
    drain: jest.fn((callback) => callback && callback(null)),
  }));
  return { SerialPort: mSerialPort };
});

import { SerialPort } from "serialport";

describe("PrinterService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send raw content to printer", async () => {
    const content = "Test Print";
    await PrinterService.printRaw(content);

    expect(SerialPort).toHaveBeenCalledWith({
      path: "/dev/rfcomm0",
      baudRate: 9600,
    });
    const mockPortInstance = (SerialPort as unknown as jest.Mock).mock
      .results[0].value;
    expect(mockPortInstance.write).toHaveBeenCalled();
  });

  it("should send receipt data to printer", async () => {
    const receipt = {
      orderId: 456,
      total: 25.75,
      items: ["Item A", "Item B"],
    };
    await PrinterService.printReceipt(receipt);

    expect(SerialPort).toHaveBeenCalledWith({
      path: "/dev/rfcomm0",
      baudRate: 9600,
    });
    const mockPortInstance = (SerialPort as unknown as jest.Mock).mock
      .results[0].value;
    expect(mockPortInstance.write).toHaveBeenCalled();

    const writtenData = (mockPortInstance.write as jest.Mock).mock.calls[0][0];
    expect(writtenData).toContain("orderId : 456");
    expect(writtenData).toContain("Item A");
    expect(writtenData).toContain("total : 25.75");
  }, 10000);
});
