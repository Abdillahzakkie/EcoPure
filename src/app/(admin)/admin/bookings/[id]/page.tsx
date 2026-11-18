import { notFound } from "next/navigation";
import AdminBookingWrapper from "@/libs/AdminBookingWrapper";
import { ServiceError } from "@/server/errors";
import { getBookingForAdmin } from "@/server/services/bookings";

interface IParams {
	params: Promise<{ id: string }>;
}

export default async function AdminBookingPage({ params }: IParams) {
	const { id } = await params;
	try {
		const booking = await getBookingForAdmin(id);
		return <AdminBookingWrapper booking={booking} />;
	} catch (error) {
		if (error instanceof ServiceError && error.status === 404) notFound();
		throw error;
	}
}
