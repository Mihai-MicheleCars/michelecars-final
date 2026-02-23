const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  // Acceptăm doar cereri de tip POST (trimiteri de formular)
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, phone, email, service, details } = JSON.parse(event.body);

    // Validare de bază
    if (!name || !phone) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "Numele si telefonul sunt obligatorii." }) 
      };
    }

    // Curățare date (Sanitize)
    const sanitize = (str) => String(str || '').replace(/[<>]/g, '').trim().slice(0, 500);
    const data = {
      name: sanitize(name),
      phone: sanitize(phone),
      email: sanitize(email),
      service: sanitize(service),
      details: sanitize(details)
    };

    // Construire text email
    const subject = `[Michele Cars] Programare noua de la ${data.name}`;
    const body = [
      `Programare noua de pe site:`,
      ``,
      `Nume: ${data.name}`,
      `Telefon: ${data.phone}`,
      `Email: ${data.email || 'Nespecificat'}`,
      `Serviciu: ${data.service || 'Nespecificat'}`,
      `Detalii: ${data.details || 'Niciun detaliu'}`,
      ``,
      `Data: ${new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' })}`
    ].join('\n');

    // Configurare transport SMTP (pompa de mail)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Trimitere efectivă
    await transporter.sendMail({
      from: `"Michele Cars Website" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL || 'mihailescuamihai_ii@yahoo.com',
      subject: subject,
      text: body,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Programare primita cu succes!" }),
    };

  } catch (err) {
    console.error('Contact form error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Eroare server. Va rugam incercati din nou." }),
    };
  }
};