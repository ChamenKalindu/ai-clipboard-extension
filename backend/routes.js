import { Router } from "express"

import { summarizeController } from "./controllers/summarize.controller.js";

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello from the backend!");
})

router.post("/api/summarize", summarizeController.summarizeText);

export default router;