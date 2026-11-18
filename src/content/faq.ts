import type { IFaq } from "@/server/validators/content";

// Starter questions from the approved artboard. The owner edits the answers in
// the admin to add real service areas, access and pricing detail.
export const FAQ_SEED: IFaq[] = [
	{
		question: "Which areas do you cover?",
		answer: "Enter your postcode in the quote form and we will confirm whether we can visit you. [Add your service areas here.]",
	},
	{
		question: "Do I need to be home during the clean?",
		answer: "Not necessarily. Many customers arrange access in advance and come home to a fresh space. [Add your key and access policy.]",
	},
	{
		question: "What cleaning products do you use?",
		answer: "We use eco-friendly products that are kinder to people and the planet. [Add the brands or product details you use.]",
	},
	{
		question: "How much does cleaning cost?",
		answer: "Every space is different, so we provide a free quote based on the size of your property or office and how often you would like us. [Add pricing guidance if you wish.]",
	},
	{
		question: "Can I change or cancel a visit?",
		answer: "Yes, let us know as early as you can. You can also manage a booking from the link in your confirmation email. [Add your rescheduling and cancellation terms.]",
	},
];
