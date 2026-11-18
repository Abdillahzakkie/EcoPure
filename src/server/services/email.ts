import "server-only";
import { Resend } from "resend";
import { config } from "@/server/config";
import type { TBookingKind, TBookingStatus } from "@/types";

let client: Resend | null = null;

function resend(): Resend {
	if (!client) client = new Resend(config.RESEND_API_KEY);
	return client;
}

interface IEmailMessage {
	to: string;
	subject: string;
	html: string;
}

// Send one transactional email. When email is disabled (placeholder key), log
// what the server would send and return ok, so local development and tests work
// without a Resend account. A caller never fails a request on a send error — it
// logs and moves on (ARCHITECTURE.md §9).
export async function sendEmail(message: IEmailMessage): Promise<{ ok: boolean }> {
	if (!config.emailEnabled) {
		console.info("[email] skipped (emailEnabled=false)", { to: message.to, subject: message.subject });
		return { ok: true };
	}
	try {
		const { error } = await resend().emails.send({
			from: config.EMAIL_FROM,
			to: message.to,
			subject: message.subject,
			html: message.html,
		});
		if (error) throw new Error(error.message);
		return { ok: true };
	} catch (error) {
		console.error("[email] send failed", { to: message.to, subject: message.subject, error });
		return { ok: false };
	}
}

const KIND_LABEL: Record<TBookingKind, string> = { quote: "quote request", booking: "booking request" };

function layout(body: string): string {
	return `<div style="font-family:Arial,Helvetica,sans-serif;color:#0F3D26;line-height:1.6;max-width:560px">
		<h2 style="color:#037B40;margin:0 0 12px">EcoPure Cleaning</h2>
		${body}
		<p style="color:#6E8578;font-size:13px;margin-top:24px">Eco-friendly cleaning for homes and offices.</p>
	</div>`;
}

export interface IBookingSummary {
	name: string;
	email?: string;
	phone?: string;
	kind: TBookingKind;
	propertyType: string;
	serviceSlug: string;
	frequency: string;
	postcode: string;
	notes?: string;
	preferredSlots?: { date: string; window: string }[];
}

// Tell the owner a new request arrived.
export async function notifyOwnerOfRequest(booking: IBookingSummary): Promise<{ ok: boolean }> {
	const lines = [
		`Type: ${KIND_LABEL[booking.kind]}`,
		`Name: ${booking.name}`,
		booking.email ? `Email: ${booking.email}` : null,
		booking.phone ? `Phone: ${booking.phone}` : null,
		`Property: ${booking.propertyType}`,
		`Service: ${booking.serviceSlug}`,
		`Frequency: ${booking.frequency}`,
		`Postcode: ${booking.postcode}`,
		booking.notes ? `Notes: ${booking.notes}` : null,
		booking.preferredSlots?.length
			? `Preferred times: ${booking.preferredSlots.map((s) => `${s.date} (${s.window})`).join(", ")}`
			: null,
	].filter(Boolean);
	return sendEmail({
		to: config.OWNER_NOTIFY_EMAIL,
		subject: `New ${KIND_LABEL[booking.kind]} from ${booking.name}`,
		html: layout(`<p>A new ${KIND_LABEL[booking.kind]} arrived:</p><p>${lines.join("<br>")}</p>`),
	});
}

// Confirm receipt to the customer, with the manage link.
export async function sendCustomerReceipt(booking: IBookingSummary, manageUrl: string): Promise<{ ok: boolean }> {
	if (!booking.email) return { ok: true };
	return sendEmail({
		to: booking.email,
		subject: "We have your request — EcoPure Cleaning",
		html: layout(
			`<p>Hi ${booking.name},</p>
			<p>Thanks for your ${KIND_LABEL[booking.kind]}. We have it and will reply shortly with your free quote.</p>
			<p>You can view or change your request any time:</p>
			<p><a href="${manageUrl}" style="color:#037B40;font-weight:bold">Manage your request</a></p>
			<p>No payment is needed now. You pay the cleaner after the visit.</p>`,
		),
	});
}

const STATUS_COPY: Record<string, { subject: string; body: string }> = {
	confirmed: {
		subject: "Your clean is confirmed — EcoPure Cleaning",
		body: "Good news — your booking is confirmed. The details are below.",
	},
	declined: {
		subject: "About your request — EcoPure Cleaning",
		body: "Thanks for your request. We are not able to take this one on, so we have declined it.",
	},
	completed: {
		subject: "Thanks from EcoPure Cleaning",
		body: "Your clean is complete. Thanks for choosing EcoPure — we would love to see you again.",
	},
};

// Tell the customer their request's status changed.
export async function sendCustomerStatus(
	booking: IBookingSummary,
	status: TBookingStatus,
	extras: { note?: string; priceNote?: string; slot?: string; manageUrl?: string },
): Promise<{ ok: boolean }> {
	if (!booking.email) return { ok: true };
	const copy = STATUS_COPY[status];
	if (!copy) return { ok: true };
	const bits = [
		`<p>Hi ${booking.name},</p>`,
		`<p>${copy.body}</p>`,
		extras.slot ? `<p><strong>Time:</strong> ${extras.slot}</p>` : "",
		extras.priceNote ? `<p><strong>Quote:</strong> ${extras.priceNote}</p>` : "",
		extras.note ? `<p>${extras.note}</p>` : "",
		extras.manageUrl
			? `<p><a href="${extras.manageUrl}" style="color:#037B40;font-weight:bold">View your request</a></p>`
			: "",
	];
	return sendEmail({ to: booking.email, subject: copy.subject, html: layout(bits.join("")) });
}

// Tell the owner a guest rescheduled or cancelled.
export async function notifyOwnerOfGuestChange(booking: IBookingSummary, change: string): Promise<{ ok: boolean }> {
	return sendEmail({
		to: config.OWNER_NOTIFY_EMAIL,
		subject: `${booking.name} ${change} their request`,
		html: layout(`<p>${booking.name} (${booking.postcode}) ${change} their ${KIND_LABEL[booking.kind]}.</p>`),
	});
}
