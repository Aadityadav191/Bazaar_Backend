const resetPasswordTemplate = (name, resetLink) => {
  return `
  <div style="font-family:Arial;padding:20px;">
    <h2>Hello ${name},</h2>

    <p>You requested to reset your password for Bazaar.com.</p>

    <p>Click the button below to reset it:</p>

    <a href="${resetLink}"
       style="display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
      Reset Password
    </a>

    <p style="margin-top:20px;color:red;">
      This link will expire in 15 minutes.
    </p>
  </div>
  `;
};

module.exports = resetPasswordTemplate;