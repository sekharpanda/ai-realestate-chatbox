import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

console.log(
  "GEMINI_API_KEY loaded in Next.js?",
  process.env.GEMINI_API_KEY ? "Yes" : "No"
);

// Recursively find "text" fields in Gemini responses
function findText(obj) {
  if (!obj) return null;
  if (typeof obj === "object") {
    for (const key of Object.keys(obj)) {
      if (key === "text" && typeof obj[key] === "string") {
        return obj[key];
      }
      const found = findText(obj[key]);
      if (found) return found;
    }
  }
  return null;
}

export async function POST(req) {
  try {
    // Parse request body safely
    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const message = body.message || "";
    if (!message) {
      return new Response(
        JSON.stringify({ error: "No message provided" }),
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing GEMINI_API_KEY" }),
        { status: 500 }
      );
    }

    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    // Call Gemini API (non-streaming mode for now)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
      }
    );

    const responseText = await response.text();
    console.log("🔎 Gemini raw full response:", responseText);

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: `Gemini request failed (${response.status})`,
          raw: responseText,
        }),
        { status: response.status }
      );
    }

    // Try parsing Gemini's JSON
    let reply = "No reply found";
    try {
      const data = JSON.parse(responseText);
      reply = findText(data) || JSON.stringify(data);
    } catch (err) {
      console.error("⚠️ Could not parse Gemini JSON:", err);
      reply = responseText;
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Gemini Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}




