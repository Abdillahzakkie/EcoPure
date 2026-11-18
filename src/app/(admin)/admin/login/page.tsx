import { Suspense } from "react";
import AdminLoginWrapper from "@/libs/AdminLoginWrapper";

export default function AdminLoginPage() {
	return (
		<Suspense fallback={null}>
			<AdminLoginWrapper />
		</Suspense>
	);
}
