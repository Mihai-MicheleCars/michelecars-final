const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // REPARAȚIE: Această parte transformă datele "ciudate" în date citibile
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

    if (!name || !phone) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "Numele si telefonul sunt obligatorii." }) 
      };
    }

    const sanitize = (str) => String(str || '').replace(/[<>]/g, '').trim().slice(0, 500);
    const data = {
      name: sanitize(name),
      phone: sanitize(phone),
      email: sanitize(email),
      service: sanitize(service),
      details: sanitize(details)
    };

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
      subject: subject,
      text: body,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Email trimis cu succes!" }),
    };
  } catch (error) {
    console.error("Eroare trimitere:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};