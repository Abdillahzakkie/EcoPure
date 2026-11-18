import type { TBookingStatus } from "@/types";
import { StatusPillStyled, type TStatusTone } from "./styled";

// A booking status as a word plus a colour, never colour alone. The map keeps
// the label human and the tone consistent across the admin and guest views.
const STATUS_META: Record<TBookingStatus, { label: string; tone: TStatusTone }> = {
	pending: { label: "Pending", tone: "pending" },
	confirmed: { label: "Confirmed", tone: "ok" },
	declined: { label: "Declined", tone: "danger" },
	completed: { label: "Completed", tone: "info" },
	cancelled: { label: "Cancelled", tone: "neutral" },
};

export default function StatusPill({ status }: { status: TBookingStatus }) {
	const meta = STATUS_META[status];
	return <StatusPillStyled $tone={meta.tone}>{meta.label}</StatusPillStyled>;
}

export type { TStatusTone };
