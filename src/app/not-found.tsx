import Link from "next/link";
import type { ReactNode } from "react";

// The 404 page. It sits outside the (site) group, so it renders without the
// header and footer; it links back to safe ground.
export default function NotFound(): ReactNode {
	return (
		<main
			style={{
				minHeight: "70dvh",
				display: "grid",
				placeItems: "center",
				textAlign: "center",
				padding: "48px 24px",
			}}
		>
			<div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", maxWidth: "48ch" }}>
				<p
					style={{
						margin: 0,
						fontWeight: 700,
						letterSpacing: "0.12em",
						textTransform: "uppercase",
						color: "var(--ep-brand)",
						fontSize: "var(--ep-fs-sm)",
					}}
				>
					Page not found
				</p>
				<h1 style={{ margin: 0, fontSize: "var(--ep-fs-xl)" }}>We cannot find that page</h1>
				<p style={{ margin: 0, color: "var(--ep-muted)", lineHeight: 1.6 }}>
					The page may have moved. Head back to the home page or request a free quote.
				</p>
				<div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
					<Link
						href="/"
						style={{
							display: "inline-flex",
							alignItems: "center",
							height: 48,
							padding: "0 22px",
							borderRadius: "var(--ep-radius-pill)",
							background: "var(--ep-brand)",
							color: "var(--ep-brand-ink)",
							fontWeight: 700,
							textDecoration: "none",
						}}
					>
						Back to home
					</Link>
					<Link
						href="/book"
						style={{
							display: "inline-flex",
							alignItems: "center",
							height: 48,
							padding: "0 22px",
							borderRadius: "var(--ep-radius-pill)",
							border: "1.5px solid var(--ep-brand)",
							color: "var(--ep-brand)",
							fontWeight: 700,
							textDecoration: "none",
						}}
					>
						Get a free quote
					</Link>
				</div>
			</div>
		</main>
	);
}
