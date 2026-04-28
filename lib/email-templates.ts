/**
 * Email templates for the Coffee Geeks platform.
 * You can modify the content and design of the emails here.
 */

export const getWelcomeEmailTemplate = (name: string) => {
  const brandColor = "#4c000a"; // Background
  const accentColor = "#bedcf8"; // Text and Button BG
  const buttonTextColor = "#4c000a"; // Button Text

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido a Coffee Geeks</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: ${brandColor};
          color: ${accentColor};
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
          text-align: center;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 30px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .content {
          background-color: rgba(0, 0, 0, 0.2);
          padding: 40px;
          border-radius: 12px;
          border: 1px solid rgba(190, 220, 248, 0.1);
        }
        h1 {
          font-size: 24px;
          margin-bottom: 20px;
        }
        p {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 30px;
          opacity: 0.9;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background-color: ${accentColor};
          color: ${buttonTextColor} !important;
          text-decoration: none;
          border-radius: 50px;
          font-weight: bold;
          font-size: 16px;
          transition: transform 0.2s ease;
        }
        .footer {
          margin-top: 40px;
          font-size: 12px;
          opacity: 0.6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">COFFEE GEEKS</div>
        <div class="content">
          <h1>¡Hola, ${name}!</h1>
          <p>
            Estamos emocionados de tenerte en nuestra comunidad de amantes del café. 
            Tu registro ha sido exitoso y ya puedes empezar a explorar todo lo que tenemos para ti.
          </p>
          <a href="https://coffee-geeks.com/login" class="button">Ir a mi Perfil</a>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Coffee Geeks. Todos los derechos reservados.
        </div>
      </div>
    </body>
    </html>
  `;
};
