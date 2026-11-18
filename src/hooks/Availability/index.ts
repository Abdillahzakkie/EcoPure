import useSWR from "swr";
import { fetcher } from "@/constants";
import type { IOpenWindow } from "@/types";

interface IAvailabilityResponse {
	windows: IOpenWindow[];
}

// Read the derived open windows for the booking form. Revalidates on focus so a
// window that fills up stops being offered.
export function useAvailability(enabled: boolean) {
	const { data, error, isLoading } = useSWR<IAvailabilityResponse>(enabled ? "/api/availability" : null, fetcher);
	return { windows: data?.windows ?? [], error, isLoading };
}
