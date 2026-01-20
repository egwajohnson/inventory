export const accountTemplate = (data: { firstName: string; email: string }) => {
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
          color: #4CAF50;
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
          background-color: #4CAF50;
          color: #fff;
          padding: 12px 25px;
          border-radius: 6px;
          text-decoration: none;
          margin-top: 20px;
          font-weight: bold;
        }
        .btn:hover {
          background-color: #45a049;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="checkmark">&#10004;</div>
        <h2>Welcome, ${data.firstName}!</h2>
        <p>Your account has been successfully created.</p>
        <p>Email: <strong>${data.email}</strong></p>
        <p>You can now log in and start using your account.</p>
        <a href="https://egwaj.com/login" class="btn">Go to Login</a>
      </div>
    </body>
  </html>
  `;
};
