require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// 👉 HIER DEINE MAIL DATEN EINTRAGEN
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post("/send", async (req, res) => {
  const data = req.body;

  console.log("Anfrage eingegangen:");
  console.log(data);

  try {
    console.log("Versuche Mail zu senden...");

    await transporter.sendMail({
      from: `"Handy Rettung" <${process.env.EMAIL_USER}>`,
      to: "iserviceleipzig@gmail.com",
      subject: "Neue Terminanfrage",
      text: `
Standort: ${data.location}
Datum: ${data.date}
Uhrzeit: ${data.time}

Hersteller: ${data.brand}
Modell: ${data.model}
Reparatur: ${data.repair}

Farbe: ${data.color}
Weitere Defekte: ${data.extraDefects}

Name: ${data.name}
Email: ${data.email}
Telefon: ${data.phone}
      `
    });
    await transporter.sendMail({
  from: `"Handy Rettung" <${process.env.EMAIL_USER}>`,
  to: data.email,
  subject: "Deine Terminanfrage bei Handy Rettung",
  text: `
Hallo ${data.name},

vielen Dank für deine Terminanfrage bei Handy Rettung.

Wir haben deine Anfrage erhalten und melden uns schnellstmöglich bei dir zur Bestätigung.

Deine Anfrage:
-------------------------
Standort: ${data.location}
Datum: ${data.date}
Uhrzeit: ${data.time}

Gerät: ${data.brand} ${data.model}
Reparatur: ${data.repair}
-------------------------

Falls du noch Fragen hast, kannst du uns jederzeit antworten oder per WhatsApp kontaktieren.

Viele Grüße
Handy Rettung
www.handy-rettung.de
`
});

    console.log("Mail erfolgreich versendet.");
    res.json({ success: true });
  } catch (error) {
  console.error("Fehler beim Mailversand:");
  console.error(error);
  res.status(500).json({ success: false, error: String(error) });
}
});
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server läuft auf Port " + PORT);
});