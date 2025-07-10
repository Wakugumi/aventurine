import express from "express";
import printerRoutes from "./routes/printerRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/printer", printerRoutes);

app.listen(PORT, () => {
  console.log(`POS Printer Server running at http://localhost:${PORT}`);
});
