const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  console.log("--- Functia contact a fost pornita ---");

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

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

    const { name, phone, email, service, details } = payload;
    console.log(`Date primite pentru: ${name}`);

    const transporter = nodemailer.createTransport({
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true, 
      auth: {
        user: "mihailescuamihai_ii@yahoo.com", 
        pass: "zqbelhcwnpomkvpo"
      },
    });

    // Construire mesaj
    const mailOptions = {
      from: '"Michele Cars Website" <mihailescuamihai_ii@yahoo.com>',
      to: 'mihailescuamihai_ii@yahoo.com',
      subject: `[Michele Cars] Programare noua: ${name || 'Client'}`,
      text: `Nume: ${name}\nTelefon: ${phone}\nEmail: ${email}\nServiciu: ${service}\nDetalii: ${details}`
    };

    console.log("Se incearca trimiterea e-mailului catre Yahoo...");
    
    // TRIMITERE EFECTIVA
    const info = await transporter.sendMail(mailOptions);
    
    console.log("Raspuns Yahoo confirmare:", info.messageId);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Succes! Email trimis." }),
    };

  } catch (error) {
    console.error("EROARE LA TRIMITERE:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};