export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const systemPrompt = `
      Kamu adalah Chatbot BKPSDM Kabupaten Sumbawa.
      Jawablah hanya pertanyaan terkait pelayanan ASN, BKPSDM,
      dan prosedur administrasi kepegawaian. Jika di luar topik,
      jawab dengan sopan: "Maaf, saya hanya bisa membantu seputar pelayanan ASN dan BKPSDM."
      Gunakan bahasa Indonesia yang formal dan ramah.
    `;

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${OPENAI_API_KEY}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await completion.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
