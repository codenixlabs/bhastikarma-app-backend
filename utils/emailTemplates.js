export const otpTemplate = (otp) => {
    return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>OTP Verification Email</title>
      <style>
          body {
              background-color: #f4f7f6;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 16px;
              line-height: 1.6;
              color: #333333;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          }
          .header {
              background-color: #2E7D32; /* Deep Green Theme */
              padding: 30px 20px;
              text-align: center;
          }
          .header img {
              max-width: 150px;
              /* User to replace with actual logo URL from Cloudinary once uploaded */
          }
          .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 24px;
              font-weight: 600;
              letter-spacing: 1px;
          }
          .body {
              padding: 40px 30px;
              text-align: center;
          }
          .body h2 {
              color: #2E7D32;
              margin-top: 0;
              font-size: 22px;
          }
          .body p {
              font-size: 16px;
              color: #555555;
              margin-bottom: 30px;
          }
          .otp-code {
              display: inline-block;
              font-size: 32px;
              font-weight: bold;
              color: #2E7D32;
              background-color: #E8F5E9; /* Light green background */
              padding: 15px 30px;
              border-radius: 8px;
              letter-spacing: 4px;
              margin-bottom: 30px;
              border: 2px dashed #81C784;
          }
          .footer {
              background-color: #f9f9f9;
              padding: 20px;
              text-align: center;
              font-size: 13px;
              color: #888888;
              border-top: 1px solid #eeeeee;
          }
          .footer p {
              margin: 5px 0;
          }
          .footer a {
              color: #2E7D32;
              text-decoration: none;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <!-- App Logo -->
              <img src="https://res.cloudinary.com/ujwugepe/image/upload/v1789296689/image.png" alt="BhastiKarma Logo">
              <h1>BhastiKarma</h1>
          </div>
          <div class="body">
              <h2>Verify Your Identity</h2>
              <p>Hello,</p>
              <p>Thank you for registering/accessing the BhastiKarma App. Please use the following One-Time Password (OTP) to complete your verification process:</p>
              
              <div class="otp-code">${otp}</div>
              
              <p>This code is valid for <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} BhastiKarma App. All rights reserved.</p>
              <p>Need help? Contact our <a href="#">support team</a>.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};
