const welcomeEmailTemplate = (name, email) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Bazaar.com</title>
</head>

<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">

  <!-- Email Preview Text -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    Welcome to Bazaar.com! Your account has been created successfully.
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:30px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#BA0E11;padding:35px;">
              <h1 style="color:#ffffff;margin:0;">
                🛒 Bazaar.com
              </h1>

              <p style="color:#dbeafe;margin-top:10px;font-size:16px;">
                Buy. Sell. Discover.
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:40px 35px;">

              <h2 style="color:#111827;margin-top:0;">
                Hello ${name}, 👋
              </h2>

              <p style="color:#4b5563;line-height:1.7;font-size:16px;">
                Welcome to <strong>Bazaar.com</strong>! Your account has been successfully created.
              </p>

              <p style="color:#4b5563;line-height:1.7;font-size:16px;">
                We're excited to have you join our growing marketplace community where you can buy amazing products and sell your own items with ease.
              </p>

              <!-- Account Info -->
              <div style="background:#e68e8a; padding:15px;border-radius:8px;margin:25px 0;">
                <p style="margin:0;color:#1e3a8a;">
                  <strong>Registered Email:</strong><br>
                  ${email}
                </p>
              </div>

              <!-- Features -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:25px 0;background:#f9fafb;border-radius:10px;">
                <tr>
                  <td style="padding:20px;">

                    <h3 style="margin-top:0;color:#111827;">
                      What you can do now
                    </h3>

                    <p style="margin:10px 0;color:#374151;">
                       Browse and discover products
                    </p>

                    <p style="margin:10px 0;color:#374151;">
                       List your own products for sale
                    </p>

                    <p style="margin:10px 0;color:#374151;">
                        Save products to your favorites
                    </p>

                    <p style="margin:10px 0;color:#374151;">
                      🔒 Enjoy a secure marketplace experience
                    </p>

                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" align="center" style="margin:30px auto;">
                <tr>
                  <td align="center" bgcolor="#BA0E11" style="border-radius:8px;">
                    <a
                      href="https://bazaaaaar.netlify.app/"
                      style="
                        display:inline-block;
                        padding:14px 30px;
                        color:#ffffff;
                        text-decoration:none;
                        font-weight:bold;
                        font-size:16px;
                      "
                    >
                      Start Shopping & Selling →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <div style="margin-top:25px;padding:15px;background:#fff7ed;border-left:4px solid #f59e0b;">
                <p style="margin:0;color:#92400e;">
                  <strong>Security Notice</strong><br>
                  If you did not create this account, please contact our support team immediately.
                </p>
              </div>

              <p style="margin-top:25px;color:#6b7280;font-size:14px;">
                Thank you for choosing Bazaar.com ❤️
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f9fafb;padding:25px;color:#6b7280;font-size:13px;">
              © 2026 Bazaar.com • Connecting Buyers & Sellers Everywhere
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

module.exports = welcomeEmailTemplate;
