import useSWR from "swr";
import { api, fetcher } from "@/constants";
import type { IRulePublic } from "@/server/services/availability";
import type { IContentRecord } from "@/server/services/content";
import type { TAdminBookingAction } from "@/server/validators/admin";
import type { TAvailabilityRuleInput } from "@/server/validators/availability";
import type { IBookingPublic, TBookingStatus } from "@/types";

// --- Requests inbox ---

export function useAdminBookings(filter: { status?: TBookingStatus; kind?: string } = {}) {
	const query = new URLSearchParams();
	if (filter.status) query.set("status", filter.status);
	if (filter.kind) query.set("kind", filter.kind);
	const key = `/api/admin/bookings${query.toString() ? `?${query.toString()}` : ""}`;
	const { data, error, isLoading, mutate } = useSWR<{ bookings: IBookingPublic[] }>(key, fetcher);
	return { bookings: data?.bookings ?? [], error, isLoading, mutate };
}

export function useAdminBooking(id: string) {
	const { data, error, isLoading, mutate } = useSWR<{ booking: IBookingPublic }>(
		id ? `/api/admin/bookings/${id}` : null,
		fetcher,
	);
	return { booking: data?.booking, error, isLoading, mutate };
}

export function applyBookingAction(id: string, action: TAdminBookingAction) {
	return api()
		.patch<{ booking: IBookingPublic }>(`/api/admin/bookings/${id}`, action)
		.then((res) => res.data.booking);
}

// --- Availability ---

export function useAvailabilityRules() {
	const { data, error, isLoading, mutate } = useSWR<{ rules: IRulePublic[] }>("/api/admin/availability", fetcher);
	return { rules: data?.rules ?? [], error, isLoading, mutate };
}

export function createAvailabilityRule(input: TAvailabilityRuleInput) {
	return api().post("/api/admin/availability", input);
}

export function deleteAvailabilityRule(id: string) {
	return api().delete(`/api/admin/availability/${id}`);
}

// --- Content ---

export function useContentList(type: string) {
	const { data, error, isLoading, mutate } = useSWR<{ items: IContentRecord[] }>(
		`/api/admin/content/${type}`,
		fetcher,
	);
	return { items: data?.items ?? [], error, isLoading, mutate };
}

export function createContentItem(type: string, body: { slug: string; data: unknown; order?: number }) {
	return api().post(`/api/admin/content/${type}`, body);
}

export function updateContentItem(
	type: string,
	id: string,
	body: { data?: unknown; slug?: string; order?: number; published?: boolean },
) {
	return api().patch(`/api/admin/content/${type}/${id}`, body);
}

export function deleteContentItem(type: string, id: string) {
	return api().delete(`/api/admin/content/${type}/${id}`);
}

// Upload an image to ImageKit via the admin route; returns the hosted URL. Throws
// when upload is disabled (placeholder keys) so the caller can prompt for a URL.
export function uploadImage(file: File) {
	const form = new FormData();
	form.set("file", file);
	return api()
		.post<{ url: string }>("/api/admin/upload", form)
		.then((res) => res.data.url);
}
