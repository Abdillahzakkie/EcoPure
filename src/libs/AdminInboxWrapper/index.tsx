"use client";
import { useState } from "react";
import { Empty, Failure, StatusPill } from "@/components";
import { useAdminBookings } from "@/hooks";
import type { TBookingStatus } from "@/types";
import {
	FilterBtnStyled,
	FiltersStyled,
	HeadStyled,
	KindTagStyled,
	ListStyled,
	RowMainStyled,
	RowMetaStyled,
	RowStyled,
} from "./styled";

const FILTERS: { label: string; value: TBookingStatus | "all" }[] = [
	{ label: "All", value: "all" },
	{ label: "Pending", value: "pending" },
	{ label: "Confirmed", value: "confirmed" },
	{ label: "Completed", value: "completed" },
	{ label: "Declined", value: "declined" },
	{ label: "Cancelled", value: "cancelled" },
];

const SERVICE_LABELS: Record<string, string> = {
	"home-cleaning": "Home cleaning",
	"office-cleaning": "Office cleaning",
	"deep-cleaning": "Deep cleaning",
	"end-of-tenancy": "End of tenancy",
	"move-in-cleaning": "Move-in cleaning",
	"one-off": "One-off",
};

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// The requests inbox: every quote and booking, newest first, with status filters.
export default function AdminInboxWrapper() {
	const [filter, setFilter] = useState<TBookingStatus | "all">("all");
	const { bookings, error, isLoading } = useAdminBookings(filter === "all" ? {} : { status: filter });

	return (
		<>
			<HeadStyled>
				<h1>Requests</h1>
				<p>Quotes and bookings, newest first. Open one to confirm, decline, or complete it.</p>
			</HeadStyled>

			<FiltersStyled>
				{FILTERS.map((item) => (
					<FilterBtnStyled
						key={item.value}
						type="button"
						$on={filter === item.value}
						onClick={() => setFilter(item.value)}
					>
						{item.label}
					</FilterBtnStyled>
				))}
			</FiltersStyled>

			{error && <Failure title="Could not load requests" description="Refresh the page to try again." />}

			{!error && !isLoading && bookings.length === 0 && (
				<Empty
					title="No requests here yet"
					description="New quote and booking requests from the site appear here as they arrive."
				/>
			)}

			<ListStyled>
				{bookings.map((booking) => (
					<RowStyled key={booking.id} href={`/admin/bookings/${booking.id}`}>
						<RowMainStyled>
							<strong>{booking.name}</strong>
							<span>
								{SERVICE_LABELS[booking.serviceSlug] ?? booking.serviceSlug} · {booking.postcode} ·{" "}
								{formatDate(booking.createdAt)}
							</span>
						</RowMainStyled>
						<RowMetaStyled>
							<KindTagStyled>{booking.kind}</KindTagStyled>
							<StatusPill status={booking.status} />
						</RowMetaStyled>
					</RowStyled>
				))}
			</ListStyled>
		</>
	);
}
