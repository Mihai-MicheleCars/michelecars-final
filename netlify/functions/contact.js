const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const bodyContent = event.isBase64Encoded 
      ? Buffer.from(event.body, 'base64').toString() 
      : event.body;

    // Extragere curată a datelor (elimină WebKitFormBoundary)
    const extractField = (name) => {
      const regex = new RegExp(`name="${name}"\\s*\\r?\\n\\r?\\n([^\\r\\n]+)`, 'i');
      const match = bodyContent.match(regex);
      return match ? match[1].trim() : 'Nespecificat';
    };

    const dateClient = {
      nume: extractField('nume'),
      telefon: extractField('telefon'),
      email: extractField('email'),
      serviciu: extractField('serviciu'),
      detalii: extractField('detalii')
    };

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
      from: '"Michele Cars" <mihailescuamihai_ii@yahoo.com>',
      to: 'mihailescuamihai_ii@yahoo.com',
      subject: `[Programare Noua] ${dateClient.nume}`,
      text: `Date Programare:\n\n` +
            `Nume: ${dateClient.nume}\n` +
            `Telefon: ${dateClient.telefon}\n` +
            `Email: ${dateClient.email}\n` +
            `Serviciu: ${dateClient.serviciu}\n` +
            `Detalii: ${dateClient.detalii}\n\n` +
            `Data: ${new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' })}`,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Succes!" }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};