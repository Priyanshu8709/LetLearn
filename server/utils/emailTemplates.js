// ─── LetLearn Email Templates ─────────────────────────────────────────────────

const baseWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LetLearn</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#16161f;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3d5aff,#7c3aed);padding:32px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td style="background:rgba(255,255,255,0.15);border-radius:10px;padding:8px 12px;display:inline-block;">
                    <span style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">⚡ LetLearn</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);line-height:1.6;">
                You received this email because you have an account on LetLearn.<br/>
                © ${new Date().getFullYear()} LetLearn. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

// ── OTP Verification ──────────────────────────────────────────────────────────
exports.otpTemplate = (otp) => baseWrapper(`
  <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#ffffff;">Verify your email</h1>
  <p style="margin:0 0 32px;font-size:15px;color:rgba(255,255,255,0.5);line-height:1.6;">
    Use the one-time code below to complete your LetLearn account setup.
    This code expires in <strong style="color:#a5b4fc;">10 minutes</strong>.
  </p>

  <!-- OTP Box -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
    <tr>
      <td align="center">
        <div style="background:#1c1c28;border:1px solid rgba(99,102,241,0.35);border-radius:12px;padding:28px 40px;display:inline-block;">
          <span style="font-size:42px;font-weight:900;letter-spacing:12px;color:#818cf8;font-family:'Courier New',monospace;">${otp}</span>
        </div>
      </td>
    </tr>
  </table>

  <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.3);text-align:center;">
    If you didn't request this, you can safely ignore this email.
  </p>
`)

// ── Welcome ───────────────────────────────────────────────────────────────────
exports.welcomeTemplate = (firstname) => baseWrapper(`
  <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#ffffff;">Welcome, ${firstname}! 🎉</h1>
  <p style="margin:0 0 24px;font-size:15px;color:rgba(255,255,255,0.5);line-height:1.6;">
    Your LetLearn account is ready. Start exploring thousands of expert-led courses
    and track your progress as you level up your skills.
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
    <tr>
      <td>
        ${['Browse 1,200+ courses', 'Track your learning progress', 'Get certified upon completion', 'Learn at your own pace']
          .map(item => `
            <div style="display:flex;align-items:center;margin-bottom:12px;">
              <span style="color:#34d399;margin-right:10px;font-size:16px;">✓</span>
              <span style="font-size:14px;color:rgba(255,255,255,0.6);">${item}</span>
            </div>
          `).join('')}
      </td>
    </tr>
  </table>

  <table cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:linear-gradient(135deg,#3d5aff,#7c3aed);border-radius:10px;padding:1px;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/courses"
           style="display:inline-block;background:linear-gradient(135deg,#3d5aff,#7c3aed);color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          Explore Courses →
        </a>
      </td>
    </tr>
  </table>
`)

// ── Password Changed ──────────────────────────────────────────────────────────
exports.passwordChangedTemplate = (firstname) => baseWrapper(`
  <div style="text-align:center;margin-bottom:28px;">
    <div style="width:60px;height:60px;background:rgba(52,211,153,0.12);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin:0 auto 16px;">
      <span style="font-size:28px;">🔐</span>
    </div>
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#ffffff;">Password changed</h1>
    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.5);">Hi ${firstname}, your password was updated successfully.</p>
  </div>

  <div style="background:#1c1c28;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:20px;margin-bottom:28px;">
    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;">
      If you made this change, no further action is needed. If you did <strong style="color:#f87171;">not</strong> make
      this change, please reset your password immediately and contact support.
    </p>
  </div>

  <table cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#ef4444;border-radius:10px;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password"
           style="display:inline-block;background:#ef4444;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:10px;">
          Secure my account
        </a>
      </td>
    </tr>
  </table>
`)

// ── Password Reset Link ───────────────────────────────────────────────────────
exports.passwordResetTemplate = (firstname, resetLink) => baseWrapper(`
  <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#ffffff;">Reset your password</h1>
  <p style="margin:0 0 28px;font-size:15px;color:rgba(255,255,255,0.5);line-height:1.6;">
    Hi ${firstname}, we received a request to reset your LetLearn password.
    Click the button below to choose a new one. This link expires in <strong style="color:#a5b4fc;">1 hour</strong>.
  </p>

  <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
    <tr>
      <td style="background:linear-gradient(135deg,#3d5aff,#7c3aed);border-radius:10px;padding:1px;">
        <a href="${resetLink}"
           style="display:inline-block;background:linear-gradient(135deg,#3d5aff,#7c3aed);color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          Reset Password
        </a>
      </td>
    </tr>
  </table>

  <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);">
    Or copy this link: <span style="color:#818cf8;">${resetLink}</span>
  </p>
  <p style="margin:16px 0 0;font-size:12px;color:rgba(255,255,255,0.25);">
    If you didn't request a password reset, ignore this email — your password won't change.
  </p>
`)

// ── Course Enrollment Confirmation ───────────────────────────────────────────
exports.enrollmentTemplate = (firstname, courseName, courseId) => baseWrapper(`
  <div style="margin-bottom:24px;">
    <span style="display:inline-block;background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.25);border-radius:20px;padding:4px 14px;font-size:12px;font-weight:600;color:#34d399;margin-bottom:16px;">
      ✓ Enrollment Confirmed
    </span>
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#ffffff;">You're in, ${firstname}!</h1>
    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.5);">You're now enrolled in:</p>
  </div>

  <div style="background:#1c1c28;border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:20px;margin-bottom:28px;">
    <p style="margin:0;font-size:16px;font-weight:700;color:#818cf8;">📚 ${courseName}</p>
  </div>

  <p style="margin:0 0 24px;font-size:14px;color:rgba(255,255,255,0.45);line-height:1.7;">
    Head to your dashboard to start watching lessons, track your progress, and earn your certificate when you're done.
  </p>

  <table cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:linear-gradient(135deg,#3d5aff,#7c3aed);border-radius:10px;padding:1px;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/learn/${courseId}"
           style="display:inline-block;background:linear-gradient(135deg,#3d5aff,#7c3aed);color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          Start Learning →
        </a>
      </td>
    </tr>
  </table>
`)
