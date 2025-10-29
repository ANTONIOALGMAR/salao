const nodemailer = require('nodemailer');

// Em produção, exigir credenciais reais; em dev, permitir defaults controlados
if (
  process.env.NODE_ENV === 'production' &&
  (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD)
) {
  throw new Error('Configuração de email ausente em produção (EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD)');
}

// Configuração do transporte de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password',
  },
});

/**
 * Envia um email
 * @param {string} to - Endereço de email do destinatário
 * @param {string} subject - Assunto do email
 * @param {string} text - Conteúdo do email em texto simples
 * @param {string} html - Conteúdo do email em HTML
 * @returns {Promise} - Promessa com o resultado do envio
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Salão de Beleza <noreply@salaodebeleza.com>',
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email enviado: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
};

/**
 * Envia um lembrete de agendamento
 * @param {Object} appointment - Objeto de agendamento
 * @param {Object} client - Objeto do cliente
 * @param {Object} service - Objeto do serviço
 * @param {Object} employee - Objeto do funcionário
 * @returns {Promise} - Promessa com o resultado do envio
 */
const sendAppointmentReminder = async (appointment, client, service, employee) => {
  const subject = 'Lembrete de Agendamento - Salão de Beleza';
  
  // Formatando a data para exibição
  const appointmentDate = new Date(appointment.date).toLocaleDateString('pt-BR');
  
  const text = `
    Olá ${client.name},

    Este é um lembrete do seu agendamento no Salão de Beleza.

    Serviço: ${service.name}
    Profissional: ${employee.name}
    Data: ${appointmentDate}
    Horário: ${appointment.startTime}

    Caso precise reagendar ou cancelar, entre em contato conosco.

    Atenciosamente,
    Equipe do Salão de Beleza
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d35400;">Lembrete de Agendamento</h2>
      <p>Olá <strong>${client.name}</strong>,</p>
      <p>Este é um lembrete do seu agendamento no Salão de Beleza.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Serviço:</strong> ${service.name}</p>
        <p><strong>Profissional:</strong> ${employee.name}</p>
        <p><strong>Data:</strong> ${appointmentDate}</p>
        <p><strong>Horário:</strong> ${appointment.startTime}</p>
      </div>
      
      <p>Caso precise reagendar ou cancelar, entre em contato conosco.</p>
      
      <p>Atenciosamente,<br>
      Equipe do Salão de Beleza</p>
      
      <div style="margin-top: 30px; font-size: 12px; color: #777;">
        <p>Este é um email automático, por favor não responda.</p>
      </div>
    </div>
  `;

  return sendEmail(client.email, subject, text, html);
};

/**
 * Envia uma confirmação de agendamento
 * @param {Object} appointment - Objeto de agendamento
 * @param {Object} client - Objeto do cliente
 * @param {Object} service - Objeto do serviço
 * @param {Object} employee - Objeto do funcionário
 * @returns {Promise} - Promessa com o resultado do envio
 */
const sendAppointmentConfirmation = async (appointment, client, service, employee) => {
  const subject = 'Confirmação de Agendamento - Salão de Beleza';
  
  // Formatando a data para exibição
  const appointmentDate = new Date(appointment.date).toLocaleDateString('pt-BR');
  
  const text = `
    Olá ${client.name},

    Seu agendamento foi confirmado com sucesso!

    Serviço: ${service.name}
    Profissional: ${employee.name}
    Data: ${appointmentDate}
    Horário: ${appointment.startTime}

    Estamos ansiosos para recebê-lo(a)!

    Atenciosamente,
    Equipe do Salão de Beleza
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #27ae60;">Agendamento Confirmado!</h2>
      <p>Olá <strong>${client.name}</strong>,</p>
      <p>Seu agendamento foi confirmado com sucesso!</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Serviço:</strong> ${service.name}</p>
        <p><strong>Profissional:</strong> ${employee.name}</p>
        <p><strong>Data:</strong> ${appointmentDate}</p>
        <p><strong>Horário:</strong> ${appointment.startTime}</p>
      </div>
      
      <p>Estamos ansiosos para recebê-lo(a)!</p>
      
      <p>Atenciosamente,<br>
      Equipe do Salão de Beleza</p>
      
      <div style="margin-top: 30px; font-size: 12px; color: #777;">
        <p>Este é um email automático, por favor não responda.</p>
      </div>
    </div>
  `;

  return sendEmail(client.email, subject, text, html);
};

module.exports = {
  sendEmail,
  sendAppointmentReminder,
  sendAppointmentConfirmation,
};