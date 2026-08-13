import { Resend } from "resend";

const from = process.env.EMAIL_FROM || "TradeLands <onboarding@resend.dev>";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) {
  const resend = getResend();
  const recipients = Array.isArray(to) ? to : [to];

  if (!resend) {
    console.info("[email:dev]", { to: recipients, subject, text: text || html });
    return { ok: true as const, id: "dev-log" };
  }

  const { data, error } = await resend.emails.send({
    from,
    to: recipients,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("[email:error]", error);
    return { ok: false as const, error };
  }
  return { ok: true as const, id: data?.id };
}

export function otpEmailHtml(code: string) {
  return `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h1 style="font-size:20px;margin:0 0 12px">Verify your email</h1>
      <p style="color:#555;margin:0 0 16px">Your TradeLands verification code is:</p>
      <p style="font-size:32px;letter-spacing:6px;font-weight:700;margin:0 0 16px">${code}</p>
      <p style="color:#777;font-size:13px;margin:0">This code expires in 10 minutes.</p>
    </div>
  `;
}

export function siteVisitRequestedHtml(opts: {
  name: string;
  project: string;
  date: string;
  time: string;
}) {
  return `
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h1 style="font-size:20px;margin:0 0 12px">Site visit request received</h1>
      <p style="color:#555">Hi ${opts.name}, we received your request for <strong>${opts.project}</strong>.</p>
      <p style="color:#555">Preferred slot: <strong>${opts.date}</strong> at <strong>${opts.time}</strong>.</p>
      <p style="color:#555">Our desk will confirm shortly.</p>
      <p style="color:#999;font-size:13px;margin-top:24px">TradeLands.IND</p>
    </div>
  `;
}

export function siteVisitConfirmedHtml(opts: {
  name: string;
  project: string;
  date: string;
  time: string;
}) {
  return `
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h1 style="font-size:20px;margin:0 0 12px">Your site visit is confirmed</h1>
      <p style="color:#555">Hi ${opts.name}, your visit to <strong>${opts.project}</strong> is confirmed.</p>
      <p style="color:#555">When: <strong>${opts.date}</strong> at <strong>${opts.time}</strong>.</p>
      <p style="color:#555">We look forward to showing you the land.</p>
      <p style="color:#999;font-size:13px;margin-top:24px">TradeLands.IND</p>
    </div>
  `;
}

export function staffVisitAlertHtml(opts: {
  name: string;
  phone: string;
  email?: string;
  project: string;
  date: string;
  time: string;
}) {
  return `
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h1 style="font-size:20px;margin:0 0 12px">New site visit request</h1>
      <p><strong>${opts.name}</strong> requested a visit to <strong>${opts.project}</strong>.</p>
      <ul>
        <li>Phone: ${opts.phone}</li>
        <li>Email: ${opts.email || "—"}</li>
        <li>Slot: ${opts.date} ${opts.time}</li>
      </ul>
    </div>
  `;
}
