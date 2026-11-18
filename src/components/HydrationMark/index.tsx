"use client";
import { useEffect } from "react";

// Marks the document once React has hydrated on the client. It renders nothing.
// Tests wait for `html[data-hydrated]` so an interaction never races hydration;
// it is also a handy signal for progressive-enhancement checks.
export default function HydrationMark() {
	useEffect(() => {
		document.documentElement.setAttribute("data-hydrated", "true");
		return () => document.documentElement.removeAttribute("data-hydrated");
	}, []);
	return null;
}
