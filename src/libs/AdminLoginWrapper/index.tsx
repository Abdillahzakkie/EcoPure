"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button, Field, FieldError, Icon, Input, Label } from "@/components";
import { api } from "@/constants";
import { BrandStyled, CardStyled, FormStyled, PageStyled } from "./styled";

// The admin sign-in form. Posts to /api/admin/session; on success it navigates to
// the originally requested page (the `next` query param) or the inbox. The error
// is generic — it never reveals which field was wrong.
export default function AdminLoginWrapper() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setBusy(true);
		try {
			await api().post("/api/admin/session", { email, password });
			const next = searchParams.get("next");
			router.replace(next?.startsWith("/admin") ? next : "/admin");
			router.refresh();
		} catch {
			setError("Wrong email or password.");
			setBusy(false);
		}
	}

	return (
		<PageStyled>
			<CardStyled>
				<BrandStyled>
					<Icon name="leaf" size={24} />
					<strong>EcoPure Admin</strong>
				</BrandStyled>
				<FormStyled onSubmit={onSubmit} noValidate>
					{error && <FieldError>{error}</FieldError>}
					<Field>
						<Label htmlFor="email" required>
							Email
						</Label>
						<Input
							id="email"
							type="email"
							autoComplete="username"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
						/>
					</Field>
					<Field>
						<Label htmlFor="password" required>
							Password
						</Label>
						<Input
							id="password"
							type="password"
							autoComplete="current-password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
						/>
					</Field>
					<Button type="submit" block disabled={busy}>
						{busy ? "Signing in…" : "Sign in"}
					</Button>
				</FormStyled>
			</CardStyled>
		</PageStyled>
	);
}
