const forgotPasswordTemplate = (name, otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset</title>
</head>
<body style="margin:0; padding:0; background:#f4f6f9; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9; padding:40px 20px;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 5px 15px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#BA0E11; padding:30px;">
              <h1 style="margin:0; color:#ffffff; font-size:28px;">
                Password Reset
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 35px; color:#333333;">

              <h2 style="margin-top:0; font-size:24px;">
                Hello ${name},
              </h2>

              <p style="font-size:16px; line-height:1.7; color:#555555;">
                We received a request to reset the password for your account.
                Please use the One-Time Password (OTP) below to continue.
              </p>

              <!-- OTP Box -->
              <div style="
                background:#f8f9fb;
                border:2px dashed #BA0E11;
                border-radius:10px;
                padding:22px;
                text-align:center;
                margin:35px 0;
              ">
                <div style="font-size:14px; color:#777777; margin-bottom:10px;">
                  Your Verification Code
                </div>

                <div style="
                  font-size:36px;
                  font-weight:bold;
                  letter-spacing:10px;
                  color:#BA0E11;
                ">
                  ${otp}
                </div>
              </div>

              <p style="font-size:16px; line-height:1.7; color:#555555;">
                This OTP will expire in
                <strong style="color:#BA0E11;">15 minutes</strong>.
              </p>

              <p style="font-size:16px; line-height:1.7; color:#555555;">
                If you didn't request a password reset, you can safely ignore this email.
                Your password will remain unchanged.
              </p>

              <hr style="border:none; border-top:1px solid #eeeeee; margin:35px 0;">

              <p style="font-size:13px; color:#999999; line-height:1.6;">
                For security reasons, never share this code with anyone. Our team
                will never ask you for your verification code.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:#fafafa; padding:25px;">

              <p style="margin:0; color:#666666; font-size:14px;">
                © ${new Date().getFullYear()} Your Company. All rights reserved.
              </p>

              <p style="margin:10px 0 0; color:#999999; font-size:12px;">
                This is an automated email. Please do not reply.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};

module.exports = forgotPasswordTemplate;