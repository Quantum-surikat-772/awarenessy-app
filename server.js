const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("AWARENESSY Emissary Server is alive");
});

const BOT_TOKEN = process.env.BOT_TOKEN;

async function sendTelegramMessage(chatId, text) {
  if (!BOT_TOKEN) {
    throw new Error("BOT_TOKEN is not configured");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    }
  );

  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Telegram error: ${data.description}`);
  }

  return data;
}

const TEST_CHAT_ID = process.env.TEST_CHAT_ID;

app.get("/test-message", async (req, res) => {
  try {
    await sendTelegramMessage(
      TEST_CHAT_ID,
      "👁 Послание Эмиссара\n\nНа мгновение обрати внимание: где ты сейчас?"
    );

    res.send("Послание Эмиссара отправлено.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка отправки: " + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`AWARENESSY server running on port ${PORT}`);
});
