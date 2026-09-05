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

// ===== ПРОТОТИП АВТОМАТИЧЕСКОГО ЭМИССАРА =====

const emissaryMessages = [
  "👁 Послание Эмиссара\n\nНа мгновение обрати внимание: где ты сейчас?",
  "👁 Послание Эмиссара\n\nЧто сейчас находится в центре твоего внимания?",
  "👁 Послание Эмиссара\n\nПосмотри на свои руки. Что изменилось в твоём восприятии?",
  "👁 Послание Эмиссара\n\nЗаметь пространство вокруг себя. Где сейчас находится Я?",
  "👁 Послание Эмиссара\n\nЧто ты слышишь прямо сейчас?"
];

function randomDelay() {
  const min = 30 * 60 * 1000; // 30 минут
  const max = 60 * 60 * 1000; // 60 минут

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Первое автоматическое Послание тоже ждёт случайный интервал.
let nextMessageTime = Date.now() + randomDelay();

app.get("/tick", async (req, res) => {
  try {
    const now = Date.now();

    if (now < nextMessageTime) {
      return res.send("Эмиссар присутствует в пространстве. Пока тишина.");
    }

    const message =
      emissaryMessages[
        Math.floor(Math.random() * emissaryMessages.length)
      ];

    await sendTelegramMessage(TEST_CHAT_ID, message);

    // После каждого Послания назначаем новый случайный момент.
    nextMessageTime = now + randomDelay();

    res.send("Эмиссар решил отправить Послание.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка Эмиссара: " + error.message);
  }
});

// ==========================================

app.listen(PORT, () => {
  console.log(`AWARENESSY server running on port ${PORT}`);
});
