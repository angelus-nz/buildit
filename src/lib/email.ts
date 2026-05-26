interface SendMessageEmailParams {
  toEmail: string;
  toName: string;
  fromName: string;
  subject: string;
  content: string;
  conversationId: string;
}

export async function sendMessageEmail(params: SendMessageEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "BuildIt <notifications@buildit.nz>",
      to: [params.toEmail],
      subject: `New message from ${params.fromName}: ${params.subject}`,
      html: `
        <p>Hi ${params.toName},</p>
        <p><strong>${params.fromName}</strong> sent you a message about <em>${params.subject}</em>:</p>
        <blockquote style="border-left:3px solid #e5e7eb;padding-left:1rem;color:#374151;">
          ${params.content.replace(/\n/g, "<br/>")}
        </blockquote>
        <p><a href="${appUrl}/messages/${params.conversationId}">Reply in BuildIt →</a></p>
      `,
    }),
  });
}

interface SendInquiryEmailParams {
  toEmail: string;
  toName: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  message: string;
}

export async function sendInquiryNotification(params: SendInquiryEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping inquiry email notification");
    return;
  }

  const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "BuildIt <notifications@buildit.nz>",
      to: [params.toEmail],
      subject: `New inquiry: ${params.subject}`,
      html: `
        <p>Hi ${params.toName},</p>
        <p>You have a new inquiry from <strong>${params.fromName}</strong> (${params.fromEmail}):</p>
        <blockquote style="border-left:3px solid #e5e7eb;padding-left:1rem;color:#374151;">
          <strong>${params.subject}</strong><br/>
          ${params.message.replace(/\n/g, "<br/>")}
        </blockquote>
        <p><a href="${appUrl}/dashboard/inbox">View in your inbox →</a></p>
      `,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Resend email failed:", res.status, text);
  }
}
