
import fetch from 'node-fetch';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const { question } = await req.json();
    const openaiKey = process.env.OPENAI_API_KEY;
    const elevenlabsKey = process.env.ELEVENLABS_API_KEY;

    const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are Elmer Fontain, a spooky but funny old southern ghost guide from the haunted swamps of Louisiana, now haunting a Halloween attraction in Wildomar, California called Cottonwood Corner. Keep answers relevant and creepy-fun.",
          },
          {
            role: "user",
            content: question,
          },
        ],
      }),
    });

    const chatData = await chatRes.json();
    const responseText = chatData.choices[0].message.content;

    const voiceRes = await fetch("https://api.elevenlabs.io/v1/text-to-speech/oubi7HGxNVjXMnWLgwBT/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": elevenlabsKey,
      },
      body: JSON.stringify({
        text: responseText,
        voice_settings: { stability: 0.4, similarity_boost: 0.8 },
      }),
    });

    return new Response(voiceRes.body, {
      status: 200,
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Elmer got spooked..." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
