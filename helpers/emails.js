import nodemailer from 'nodemailer';


const emailRegistro = async(datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const {email,nombre, token} = datos

      // Enviar email

      await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `
        <p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>
        
        <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3333}/auth/confirmar/${token}">Confirmar Cuenta</a> </p>
        
        <p>Si no creaste esta cuenta, ignora este mensaje</p>
        `
      })

}

const emailOlvidePass = async(datos) => {
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const {email,nombre, token} = datos

    // Enviar email

    await transport.sendMail({
      from: 'BienesRaices.com',
      to: email,
      subject: 'Reestablece tu contraseña en BienesRaices.com',
      text: 'Reestablece tu contraseña en BienesRaices.com',
      html: `
      <p>Hola ${nombre}, has solicitado reestablecer tu contraseña en BienesRaices.com</p>
      
      <p>Sigue el siguiente enlace para generar una contraseña nueva:
      <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3333}/auth/forget-password/${token}">Reestablecer contraseña</a> </p>
      
      <p>Si no solicitaste cambio de contraseña, ignora este mensaje</p>
      `
    })

}

export {
  emailRegistro,
  emailOlvidePass
};

