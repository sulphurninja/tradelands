import { Resend } from "resend";

const from = process.env.EMAIL_FROM || "TradeLands <onboarding@resend.dev>";

/** Desk inbox — receives confirmation copies of transactional mail. */
export const SALES_INBOX =
  process.env.SALES_EMAIL || "sales.tradelands@gmail.com";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function withSalesCopy(to: string | string[], bcc?: string | string[]) {
  const recipients = Array.isArray(to) ? [...to] : [to];
  const bccList = new Set<string>();
  for (const item of Array.isArray(bcc) ? bcc : bcc ? [bcc] : []) {
    if (item) bccList.add(item.toLowerCase());
  }
  bccList.add(SALES_INBOX.toLowerCase());
  // Don't BCC sales if they are already a primary recipient
  for (const r of recipients) bccList.delete(r.toLowerCase());
  return { to: recipients, bcc: [...bccList] };
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  bcc,
  copySales = false,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  bcc?: string | string[];
  /** When true, also BCC sales.tradelands@gmail.com */
  copySales?: boolean;
}) {
  const resend = getResend();
  const routed = copySales
    ? withSalesCopy(to, bcc)
    : {
        to: Array.isArray(to) ? to : [to],
        bcc: Array.isArray(bcc) ? bcc : bcc ? [bcc] : [],
      };

  if (!resend) {
    console.info("[email:dev]", {
      to: routed.to,
      bcc: routed.bcc,
      subject,
      text: text || html,
    });
    return { ok: true as const, id: "dev-log" };
  }

  const { data, error } = await resend.emails.send({
    from,
    to: routed.to,
    ...(routed.bcc.length ? { bcc: routed.bcc } : {}),
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

export function saleLandReceivedHtml(opts: {
  name: string;
  landSize: string;
  location: string;
  rate: string;
}) {
  return `
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h1 style="font-size:20px;margin:0 0 12px">We received your land listing</h1>
      <p style="color:#555">Hi ${opts.name}, thank you for submitting your parcel to TradeLands.</p>
      <ul style="color:#555;padding-left:18px">
        <li>Size: <strong>${opts.landSize}</strong></li>
        <li>Location: <strong>${opts.location}</strong></li>
        <li>Expected rate: <strong>${opts.rate}</strong></li>
      </ul>
      <p style="color:#555">A member of our team will contact you shortly.</p>
      <p style="color:#999;font-size:13px;margin-top:24px">TradeLands.IND</p>
    </div>
  `;
}

export function saleLandStaffAlertHtml(opts: {
  name: string;
  phone: string;
  email: string;
  landSize: string;
  location: string;
  rate: string;
}) {
  return `
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h1 style="font-size:20px;margin:0 0 12px">New sell-land submission</h1>
      <p><strong>${opts.name}</strong> submitted a parcel for sale.</p>
      <ul>
        <li>Phone: ${opts.phone}</li>
        <li>Email: ${opts.email}</li>
        <li>Size: ${opts.landSize}</li>
        <li>Location: ${opts.location}</li>
        <li>Rate: ${opts.rate}</li>
      </ul>
      <p style="color:#777;font-size:13px">Review in Admin → Sell Land</p>
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
