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
    user: "iservicecottbus@gmail.com",
    pass: "eciv arko hkdw hyyf"
  }
});

app.post("/send", async (req, res) => {
  const data = req.body;

  console.log("Anfrage eingegangen:");
  console.log(data);

  try {
    console.log("Versuche Mail zu senden...");

    await transporter.sendMail({
      from: '"Handy Rettung" <iservicecottbus@gmail.com>',
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