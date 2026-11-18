import type { IStep } from "@/server/validators/content";

// The four how-it-works steps, in order. The number comes from the list order.
export const STEPS_SEED: IStep[] = [
	{ title: "Request a quote", detail: "Share your space and how often you would like us." },
	{ title: "Choose your time", detail: "Pick a day and time slot that fits around your routine." },
	{ title: "We clean, eco-style", detail: "Our team arrives with eco-friendly products and gets to work." },
	{ title: "Enjoy the fresh space", detail: "Relax in a clean place and rebook in a couple of clicks." },
];
