import axios from "axios";

export async function askBot(message) {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a neutral civic education assistant. Explain One Nation One Election factually. Avoid opinions. cite constitutional references where applicable."
        },
        {
          role: "user",
          content: message
        }
      ]
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      }
    }
  );

  return response.data.choices[0].message.content;
}
