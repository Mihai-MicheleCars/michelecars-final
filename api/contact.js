/* Vercel Serverless Function - Contact Form Handler

   Sends an email notification and optionally a WhatsApp message
   when a user submits the contact/booking form.

   Environment variables needed in Vercel:
   - SMTP_HOST (e.g. smtp.gmail.com)
   - SMTP_PORT (e.g. 587)
   - SMTP_USER (your email)
   - SMTP_PASS (app password)
   - NOTIFY_EMAIL (email to receive notifications, e.g. mihailescuamihai_ii@yahoo.com)
*/

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, email, service, details } = req.body;

    // Basic validation
    if (!name || !phone) {
      return res.status(400).json({ error: 'Numele si telefonul sunt obligatorii.' });
    }

    // Sanitize inputs
    const sanitize = (str) => String(str || '').replace(/[<>]/g, '').trim().slice(0, 500);
    const data = {
      name: sanitize(name),
      phone: sanitize(phone),
      email: sanitize(email),
      service: sanitize(service),
      details: sanitize(details)
    };

    // Build email content
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

    // Try to send email if SMTP is configured
    const smtpHost = process.env.SMTP_HOST;
    if (smtpHost) {
      // Dynamic import to avoid issues when nodemailer isn't installed
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.default.createTransport({
          host: smtpHost,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_PORT === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        await transporter.sendMail({
          from: `"Michele Cars Website" <${process.env.SMTP_USER}>`,
          to: process.env.NOTIFY_EMAIL || 'mihailescuamihai_ii@yahoo.com',
          subject,
          text: body
        });
      } catch (emailErr) {
        console.error('Email send failed:', emailErr.message);
        // Don't fail the request, just log
      }
    } else {
      // No SMTP configured - just log
      console.log('--- NEW BOOKING ---');
      console.log(body);
      console.log('--- END ---');
    }

    return res.status(200).json({ success: true, message: 'Programare primita cu succes!' });

  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ error: 'Eroare server. Va rugam incercati din nou.' });
  }
}
