import type { Metadata } from "next";
import { Button, Empty, PageHero, Section } from "@/components";
import ManageWrapper from "@/libs/ManageWrapper";
import { getBookingByToken } from "@/server/services/bookings";

export const metadata: Metadata = {
	title: "Manage your request",
	robots: { index: false },
};

// Dynamic and token-gated: the page reads the signed token from the query string
// and loads exactly one booking. An invalid or revoked token shows a recovery
// state rather than an error.
export const dynamic = "force-dynamic";

interface ISearch {
	searchParams: Promise<{ token?: string }>;
}

export default async function ManagePage({ searchParams }: ISearch) {
	const { token } = await searchParams;

	let booking = null;
	try {
		if (token) booking = await getBookingByToken(token);
	} catch {
		booking = null;
	}

	return (
		<>
			<PageHero eyebrow="Your request" title="Manage your request" />
			<Section>
				{booking && token ? (
					<ManageWrapper booking={booking} token={token} />
				) : (
					<Empty
						title="This link is no longer valid"
						description="The link may have expired, or the request was cancelled. Request a new quote and we will email you a fresh link."
					>
						<Button as="a" href="/book">
							Request a free quote
						</Button>
					</Empty>
				)}
			</Section>
		</>
	);
}
