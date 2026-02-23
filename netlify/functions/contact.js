const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    let payload;
    const bodyContent = event.isBase64Encoded 
      ? Buffer.from(event.body, 'base64').toString() 
      : event.body;

    try {
      payload = JSON.parse(bodyContent);
    } catch (e) {
      const params = new URLSearchParams(bodyContent);
      payload = Object.fromEntries(params);
    }

    // Această parte va pune în mail tot ce scrie clientul
    const formDetails = Object.entries(payload)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const transporter = nodemailer.createTransport({
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true, 
      auth: {
        user: "mihailescuamihai_ii@yahoo.com", 
        pass: "zqbelhcwnpomkvpo"
      },
    });

    await transporter.sendMail({
      from: '"Michele Cars Website" <mihailescuamihai_ii@yahoo.com>',
      to: 'mihailescuamihai_ii@yahoo.com',
      subject: `[Michele Cars] Mesaj nou formular`,
      text: `Ai primit un mesaj nou:\n\n${formDetails}\n\nData: ${new Date().toLocaleString('ro-RO')}`,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Succes!" }),
    };
  } catch (error) {
    console.error("Eroare:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};