import type { ILegal } from "@/server/validators/content";

// Starter legal pages. The owner replaces the bracketed placeholders with real
// policy text in the admin. Slugs match the routes /privacy and /terms.
export const PRIVACY_SEED: ILegal = {
	title: "Privacy policy",
	updated: "2026",
	sections: [
		{
			heading: "What we collect",
			body: "When you request a quote or booking, we collect the details you enter: your name, contact details, postcode, and what you tell us about your space. We use them only to reply to your request and arrange your clean. [Replace this with your full privacy policy.]",
		},
		{
			heading: "How we use it",
			body: "We use your details to prepare your quote, confirm or decline a booking, and keep in touch about your visits. We do not sell your information. [Add your lawful basis and retention period.]",
		},
		{
			heading: "Your choices",
			body: "You can ask us to update or delete your details at any time. Contact us using the details in the footer. [Add how to make a request and who to contact.]",
		},
	],
};

export const TERMS_SEED: ILegal = {
	title: "Terms of service",
	updated: "2026",
	sections: [
		{
			heading: "Quotes and bookings",
			body: "A quote is an estimate based on the details you give us. A booking request is confirmed by us before it is scheduled; you receive an email either way. No payment is taken on this site. [Replace this with your full terms.]",
		},
		{
			heading: "Payment",
			body: "You pay the cleaner directly after the visit, by the method you agree with us. [Add your accepted payment methods and timing.]",
		},
		{
			heading: "Changes and cancellations",
			body: "You can reschedule or cancel a booking from the link in your confirmation email, or by contacting us. [Add your notice period and any charges.]",
		},
	],
};
