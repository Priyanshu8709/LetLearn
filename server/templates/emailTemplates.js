const brand = {
    name: process.env.EMAIL_FROM_NAME || "LetLearn",
    supportEmail: process.env.SUPPORT_EMAIL || process.env.EMAIL_FROM_EMAIL || "support@letlearn.com",
};

const escapeHtml = (value = "") =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

const baseTemplate = ({ title, preview, children }) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">
      ${escapeHtml(preview || title)}
    </span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="background:#111827;color:#ffffff;padding:22px 28px;font-size:22px;font-weight:700;">
                ${escapeHtml(brand.name)}
              </td>
            </tr>
            <tr>
              <td style="padding:30px 28px;">
                <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:#111827;">${escapeHtml(title)}</h1>
                ${children}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background:#f9fafb;color:#6b7280;font-size:13px;line-height:1.6;">
                Need help? Contact us at ${escapeHtml(brand.supportEmail)}.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const paragraph = (text) =>
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">${escapeHtml(text)}</p>`;

const button = (href, label) => `
<table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0;">
  <tr>
    <td style="border-radius:6px;background:#2563eb;">
      <a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 18px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;">
        ${escapeHtml(label)}
      </a>
    </td>
  </tr>
</table>`;

exports.otpEmail = ({ otp, expiresInMinutes = 5 }) =>
    baseTemplate({
        title: "Verify your email",
        preview: `Your ${brand.name} verification code is ${otp}.`,
        children: `
            ${paragraph("Use this verification code to finish creating your account.")}
            <div style="margin:22px 0;padding:18px 20px;background:#eef2ff;border:1px solid #c7d2fe;border-radius:8px;text-align:center;font-size:32px;letter-spacing:6px;font-weight:700;color:#1e3a8a;">
              ${escapeHtml(otp)}
            </div>
            ${paragraph(`This code expires in ${expiresInMinutes} minutes. If you did not request it, you can ignore this email.`)}
        `,
    });

exports.passwordResetEmail = ({ resetLink }) =>
    baseTemplate({
        title: "Reset your password",
        preview: "Use this link to reset your LetLearn password.",
        children: `
            ${paragraph("We received a request to reset your password. Use the button below to choose a new one.")}
            ${button(resetLink, "Reset password")}
            ${paragraph("This link expires in 1 hour. If you did not request a password reset, you can ignore this email.")}
            <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#6b7280;word-break:break-all;">${escapeHtml(resetLink)}</p>
        `,
    });

exports.passwordChangedEmail = () =>
    baseTemplate({
        title: "Password changed successfully",
        preview: "Your LetLearn password was changed.",
        children: `
            ${paragraph("Your password has been changed successfully.")}
            ${paragraph("If this was not you, please reset your password immediately and contact support.")}
        `,
    });
