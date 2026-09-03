const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("AWARENESSY Emissary Server is alive");
});

app.listen(PORT, () => {
  console.log(`AWARENESSY server running on port ${PORT}`);
});
