import { summarizeService } from "../services/summarize.service.js";

export const summarizeController = {
    async summarizeText(req, res) {
        const { text } = req.body;
        
        try {
            const summary = await summarizeService.summarize(text);
            res.send({ summary });
        } catch(error) {
            console.log(error);
            res.status(500).json('Failed to summarize text');
        }
    }
}