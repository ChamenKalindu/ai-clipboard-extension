import express from "express";
import cors from "cors";
import dotenv from "dotenv"

dotenv.config();

import router from "./routes.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log("Server running on port " + PORT));



