"use client";
import { startAuthentication } from "@simplewebauthn/browser";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button, Field, FieldError, Icon, Input, Label } from "@/components";
import { api } from "@/constants";
import { BrandStyled, CardStyled, DividerStyled, FormStyled, HintStyled, PageStyled } from "./styled";

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

	function goNext() {
		const next = searchParams.get("next");
		router.replace(next?.startsWith("/admin") ? next : "/admin");
		router.refresh();
	}

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setBusy(true);
		try {
			await api().post("/api/admin/session", { email, password });
			goNext();
		} catch {
			setError("Wrong email or password.");
			setBusy(false);
		}
	}

	async function signInWithPasskey() {
		setError(null);
		setBusy(true);
		try {
			const optionsRes = await fetch("/api/auth/passkey/authenticate/options", { method: "POST" });
			const options = await optionsRes.json();
			const response = await startAuthentication({ optionsJSON: options });
			const verifyRes = await fetch("/api/auth/passkey/authenticate/verify", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ response }),
			});
			if (!verifyRes.ok) {
				setError("That passkey was not recognised. Try again, or use your email and password.");
				setBusy(false);
				return;
			}
			goNext();
		} catch {
			setError("Passkeys are not available on this device. Use your email and password instead.");
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

				<Button block size="lg" onClick={signInWithPasskey} disabled={busy}>
					{busy ? "Signing in…" : "Sign in with a passkey"}
				</Button>
				<HintStyled>
					A passkey signs you in with your fingerprint, face, or device PIN — no password to remember. Add one
					from the account page after you sign in.
				</HintStyled>

				<DividerStyled>
					<span>or use your password</span>
				</DividerStyled>

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
