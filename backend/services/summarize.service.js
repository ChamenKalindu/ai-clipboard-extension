import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptPath = path.join(__dirname, "../prompt/content_summarizer.txt"); // adjust ../ if needed
const template = fs.readFileSync(promptPath, "utf-8");

const token = process.env.OPENAI_API_KEY;
const endpoint = "https://models.github.ai/inference";
const model = "gpt-4o";
const client = new OpenAI({ baseURL: endpoint, apiKey: token });

export const summarizeService = {
    async summarize(text) {
        const prompt = template.replace("{{text}}", text);

        try {
            const response = await client.chat.completions.create({
              model: model,
              messages: [
                {
                  role: "system",
                  content: "You summarize text into clear bullet points",
                },
                { role: "user", content: prompt },
              ],
            });

            const summary = response.choices[0].message.content;

            return summary;
        } catch (error) {
            console.log(error);
            throw error;
        }
        
    }
}
