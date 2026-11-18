import { api } from "@/constants";
import type { TBookingRequest, TManageAction } from "@/server/validators";

// Submit a quote or booking request. Returns the POST promise; the caller maps
// success and failure to the UI state. The response carries the manage link.
export function useSubmitBooking() {
	return (input: TBookingRequest) => api().post("/api/bookings", input);
}

// Reschedule or cancel a booking as a guest, authorised by the manage token.
export function useManageBooking() {
	return (id: string, token: string, input: TManageAction) =>
		api().patch(`/api/bookings/${id}?token=${encodeURIComponent(token)}`, input);
}
