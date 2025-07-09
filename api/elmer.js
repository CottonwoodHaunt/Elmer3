import { Readable } from 'stream';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'No question provided' });
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await openaiResponse.json();
    const reply = data.choices?.[0]?.message?.content || "Elmer got spooked... no response.";

    res.status(200).json({ message: reply });
  } catch (error) {
    console.error("Elmer error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}