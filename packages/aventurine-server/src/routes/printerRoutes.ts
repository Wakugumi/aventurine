// src/routes/printerRoutes.ts

import express from "express";
import { PrinterService } from "../services/printerService";

const router = express.Router();

router.post("/raw", async (req, res) => {
  try {
    const { content } = req.body;
    await PrinterService.printRaw(content);
    res.send("Raw Print Success");
  } catch (err) {
    console.error(err);
    res.status(500).send("Raw Print Failed");
  }
});

router.post("/receipt", async (req, res) => {
  try {
    await PrinterService.printReceipt(req.body);
    res.send("Receipt Print Success");
  } catch (err) {
    console.error(err);
    res.status(500).send("Receipt Print Failed");
  }
});

export default router;
