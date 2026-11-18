import type { Metadata } from "next";
import { Suspense } from "react";
import { Container, PageHero, Section } from "@/components";
import BookingWrapper from "@/libs/BookingWrapper";

export const metadata: Metadata = {
	title: "Get a free quote",
	description:
		"Request a free quote or book an eco-friendly clean for your home or office. No payment needed — you pay the cleaner after the visit.",
};

// The primary CTA target. A static shell around the client request form; the
// form reads availability and posts to /api/bookings.
export default function BookPage() {
	return (
		<>
			<PageHero
				eyebrow="Free quote"
				title="Tell us about your space"
				lead="Request a free quote or book a visit. We reply quickly, and there is no payment to make here — you pay the cleaner after the visit."
			/>
			<Section>
				<Container>
					<Suspense fallback={null}>
						<BookingWrapper />
					</Suspense>
				</Container>
			</Section>
		</>
	);
}
