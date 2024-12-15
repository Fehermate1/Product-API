import express from "express";
import cors from "cors";
import { initializeDB } from "./database.js";
import productsRouter from "./routes/products.js";
import { readFile } from "fs/promises";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/products", productsRouter);
const PORT = 3020;

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const startServer = async () => {
  await initializeDB();
  app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`));
};

startServer();