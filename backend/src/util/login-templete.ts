export const loginTemplate = (data: {
  firstName: string;
  email: string;
  loginTime: string;
}) => {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .container {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          max-width: 600px;
          margin: auto;
          text-align: center;
        }
        .checkmark {
          font-size: 48px;
          color: #2e6cf7;
          margin-bottom: 20px;
        }
        h2 {
          color: #333;
          margin-bottom: 10px;
        }
        p {
          color: #555;
          margin: 5px 0;
        }
        .btn {
          display: inline-block;
          background-color: #2e6cf7;
          color: #fff;
          padding: 12px 25px;
          border-radius: 6px;
          text-decoration: none;
          margin-top: 20px;
          font-weight: bold;
        }
        .btn:hover {
          background-color: #2656c3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="checkmark">&#128274;</div>
        <h2>Hello, ${data.firstName}!</h2>
        <p>Your account was just logged in successfully.</p>
        <p>Email: <strong>${data.email}</strong></p>
        <p>Login Time: <strong>${data.loginTime}</strong></p>
        <p>If this wasn’t you, please secure your account immediately.</p>
        <a href="https://yourapp.com/login" class="btn">Go to Account</a>
      </div>
    </body>
  </html>
  `;
};
