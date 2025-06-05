export const newUserEmailTemplate = ({
  name,
  email,
  setPasswordLink,
}: {
  name: string;
  email: string;
  setPasswordLink: string;
}): string => {
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Welcome to Ibuka</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #F8F8F8;
            margin: 0;
            padding: 0;
          }
          .container {
            background-color: #FFFFFF;
            max-width: 600px;
            margin: 40px auto;
            border: 1px solid #eee;
            border-radius: 8px;
            overflow: hidden;
          }
          .header {
            background-color: #000000;
            color: #FFFFFF;
            padding: 24px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .body {
            padding: 24px;
            color: #000000;
          }
          .body h2 {
            margin-top: 0;
            font-size: 20px;
          }
          .body p {
            font-size: 16px;
            line-height: 1.5;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            margin-top: 20px;
            background-color: #000000;
            color: #FFFFFF;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          }
          .footer {
            background-color: #F8F8F8;
            text-align: center;
            font-size: 12px;
            color: #888;
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Ibuka</h1>
          </div>
          <div class="body">
            <h2>Hello ${name},</h2>
            <p>An account has been created for you by the Ibuka administrator using this email: <strong>${email}</strong>.</p>
            <p>To start using your account, please set your password using the button below:</p>
            <a href="${setPasswordLink}" class="btn">Set Your Password</a>
            <p>If you were not expecting this email, you can safely ignore it.</p>
            <p>We look forward to having you onboard!<br /><strong>The Ibuka Team</strong></p>
          </div>
          <div class="footer">
            &copy; ${currentYear} Ibuka. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
}
