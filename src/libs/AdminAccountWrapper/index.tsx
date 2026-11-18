"use client";
import { startRegistration } from "@simplewebauthn/browser";
import { useState } from "react";
import useSWR from "swr";
import { Button, Empty, Failure, Icon, Success } from "@/components";
import { api, fetcher } from "@/constants";
import { CardStyled, HeadStyled, ListStyled } from "./styled";

interface IPasskey {
	id: string;
	deviceName: string;
	createdAt: string;
}

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// The admin account page: register and remove passkeys. A passkey is additive to
// the password login, so the owner can sign in with a fingerprint, face, or
// device PIN.
export default function AdminAccountWrapper() {
	const { data, isLoading, mutate } = useSWR<{ items: IPasskey[] }>("/api/admin/passkeys", fetcher);
	const passkeys = data?.items ?? [];
	const [busy, setBusy] = useState(false);
	const [notice, setNotice] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function addPasskey() {
		setBusy(true);
		setError(null);
		setNotice(null);
		try {
			const optionsRes = await fetch("/api/auth/passkey/register/options", { method: "POST" });
			if (!optionsRes.ok) throw new Error("options");
			const options = await optionsRes.json();
			const response = await startRegistration({ optionsJSON: options });
			const deviceName = `Passkey · ${new Date().toLocaleDateString("en-GB")}`;
			const verifyRes = await fetch("/api/auth/passkey/register/verify", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ response, deviceName }),
			});
			if (!verifyRes.ok) {
				const body = await verifyRes.json().catch(() => ({}));
				setError(
					body?.error === "Passkey already registered."
						? "This device already has a passkey."
						: "That didn't work. Try adding the passkey again.",
				);
				return;
			}
			setNotice("Passkey added. You can sign in with this device from now on.");
			await mutate();
		} catch {
			setError("Passkeys aren't available on this device or browser.");
		} finally {
			setBusy(false);
		}
	}

	async function removePasskey(id: string) {
		setBusy(true);
		setError(null);
		try {
			await api().delete(`/api/admin/passkeys/${id}`);
			await mutate();
		} catch {
			setError("Could not remove that passkey. Try again.");
		} finally {
			setBusy(false);
		}
	}

	return (
		<>
			<HeadStyled>
				<h1>Account</h1>
				<p>
					Add a passkey to sign in with your fingerprint, face, or device PIN. Your password still works too.
				</p>
			</HeadStyled>

			<CardStyled>
				<h2>Passkeys</h2>
				{notice && <Success title={notice} />}
				{error && <Failure title="Passkey problem" description={error} />}

				{!isLoading && passkeys.length === 0 && !notice && (
					<Empty
						title="No passkeys yet"
						description="Add one on this device to sign in without a password next time."
					/>
				)}

				{passkeys.length > 0 && (
					<ListStyled>
						{passkeys.map((passkey) => (
							<li key={passkey.id}>
								<div>
									<strong>{passkey.deviceName}</strong>
									<span>Added {formatDate(passkey.createdAt)}</span>
								</div>
								<Button variant="ghost" onClick={() => removePasskey(passkey.id)} disabled={busy}>
									<Icon name="close" size={16} />
									Remove
								</Button>
							</li>
						))}
					</ListStyled>
				)}

				<Button onClick={addPasskey} disabled={busy}>
					<Icon name="plus" size={16} />
					{busy ? "Working…" : "Add a passkey"}
				</Button>
			</CardStyled>
		</>
	);
}
