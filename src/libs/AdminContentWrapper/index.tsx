"use client";
import { useState } from "react";
import { Button, Empty, Failure, Field, Icon, Input, Label } from "@/components";
import { createContentItem, deleteContentItem, updateContentItem, useContentList } from "@/hooks";
import type { IContentRecord } from "@/server/services/content";
import {
	ActionsStyled,
	FieldsStyled,
	HeadStyled,
	ItemCardStyled,
	ItemTopStyled,
	SavedStyled,
	SectionBoxStyled,
	TabStyled,
	TabsStyled,
} from "./styled";

type TFieldSpec = { key: string; label: string; area?: boolean; number?: boolean };

const TABS: { type: string; label: string }[] = [
	{ type: "service", label: "Services" },
	{ type: "review", label: "Reviews" },
	{ type: "faq", label: "FAQ" },
	{ type: "step", label: "Steps" },
	{ type: "reason", label: "Reasons" },
	{ type: "gallery", label: "Gallery" },
	{ type: "settings", label: "Settings" },
	{ type: "legal", label: "Legal" },
];

const SPECS: Record<string, TFieldSpec[]> = {
	service: [
		{ key: "title", label: "Title" },
		{ key: "blurb", label: "Card blurb", area: true },
		{ key: "body", label: "Long copy", area: true },
		{ key: "icon", label: "Icon key (home, office, deep, tenancy, movein, oneoff)" },
	],
	review: [
		{ key: "author", label: "Customer name" },
		{ key: "context", label: "Context (for example, Home clean)" },
		{ key: "quote", label: "Review", area: true },
		{ key: "rating", label: "Rating (1–5)", number: true },
	],
	faq: [
		{ key: "question", label: "Question" },
		{ key: "answer", label: "Answer", area: true },
	],
	step: [
		{ key: "title", label: "Title" },
		{ key: "detail", label: "Detail", area: true },
	],
	reason: [
		{ key: "title", label: "Title" },
		{ key: "detail", label: "Detail", area: true },
	],
	gallery: [
		{ key: "title", label: "Title" },
		{ key: "caption", label: "Caption", area: true },
		{ key: "image", label: "Illustration key or image URL" },
	],
	settings: [
		{ key: "phone", label: "Phone" },
		{ key: "email", label: "Email" },
		{ key: "serviceArea", label: "Service area" },
		{ key: "addressNote", label: "Address note (optional)" },
	],
};

// The CMS editor. Each tab edits one content type; a save validates the type's
// schema on the server, writes the document, and revalidates the public pages.
export default function AdminContentWrapper() {
	const [type, setType] = useState("service");

	return (
		<>
			<HeadStyled>
				<h1>Content</h1>
				<p>Edit the words on the public site. Changes go live within moments of saving.</p>
			</HeadStyled>
			<TabsStyled>
				{TABS.map((tab) => (
					<TabStyled key={tab.type} type="button" $on={type === tab.type} onClick={() => setType(tab.type)}>
						{tab.label}
					</TabStyled>
				))}
			</TabsStyled>

			{type === "legal" ? <LegalEditor /> : <ListEditor type={type} />}
		</>
	);
}

// The generic editor for a content type backed by a field spec. Reviews add and
// delete; other types edit in place. Settings is a single document.
function ListEditor({ type }: { type: string }) {
	const { items, error, isLoading, mutate } = useContentList(type);
	const specs = SPECS[type] ?? [];
	const canAdd = type === "review";
	const canDelete = type === "review";
	const [adding, setAdding] = useState(false);

	async function onAdd(data: Record<string, unknown>) {
		await createContentItem(type, { slug: `${type}-${Date.now()}`, data, order: items.length });
		setAdding(false);
		await mutate();
	}

	if (error) return <Failure title="Could not load content" description="Refresh the page to try again." />;
	if (isLoading) return <p style={{ color: "var(--ep-muted)" }}>Loading…</p>;

	return (
		<>
			{items.length === 0 && !adding && (
				<Empty
					title={`No ${type} content yet`}
					description={canAdd ? "Add the first item below." : "Run the seed to load the starter content."}
				/>
			)}

			{items.map((item) => (
				<ItemCard
					key={item.id}
					type={type}
					item={item}
					specs={specs}
					canDelete={canDelete}
					canPublish={type === "review"}
					onChanged={mutate}
				/>
			))}

			{canAdd &&
				(adding ? (
					<ItemCard
						type={type}
						specs={specs}
						isNew
						canPublish
						onCreate={onAdd}
						onCancel={() => setAdding(false)}
						onChanged={mutate}
					/>
				) : (
					<Button onClick={() => setAdding(true)}>
						<Icon name="plus" size={16} />
						Add review
					</Button>
				))}
		</>
	);
}

interface IItemCardProps {
	type: string;
	specs: TFieldSpec[];
	item?: IContentRecord;
	isNew?: boolean;
	canDelete?: boolean;
	canPublish?: boolean;
	onChanged: () => void;
	onCreate?: (data: Record<string, unknown>) => Promise<void>;
	onCancel?: () => void;
}

function ItemCard({ type, specs, item, isNew, canDelete, canPublish, onChanged, onCreate, onCancel }: IItemCardProps) {
	const [values, setValues] = useState<Record<string, string>>(() => {
		const initial: Record<string, string> = {};
		for (const spec of specs) {
			const raw = item?.data?.[spec.key];
			initial[spec.key] = raw === undefined || raw === null ? "" : String(raw);
		}
		return initial;
	});
	const [published, setPublished] = useState(item?.published ?? true);
	const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
	const [message, setMessage] = useState<string | null>(null);

	function buildData(): Record<string, unknown> {
		const data: Record<string, unknown> = {};
		for (const spec of specs) {
			const value = values[spec.key]?.trim() ?? "";
			if (spec.number) {
				if (value) data[spec.key] = Number(value);
			} else if (value) {
				data[spec.key] = value;
			}
		}
		return data;
	}

	async function onSave() {
		setState("saving");
		setMessage(null);
		try {
			if (isNew && onCreate) {
				await onCreate(buildData());
			} else if (item) {
				await updateContentItem(type, item.id, { data: buildData(), published });
				await onChanged();
			}
			setState("saved");
			setTimeout(() => setState("idle"), 1800);
		} catch {
			setState("error");
			setMessage("Check the fields and try again.");
		}
	}

	async function onDelete() {
		if (!item) return;
		setState("saving");
		try {
			await deleteContentItem(type, item.id);
			await onChanged();
		} catch {
			setState("error");
			setMessage("Could not delete. Try again.");
		}
	}

	return (
		<ItemCardStyled>
			<ItemTopStyled>
				<strong>{isNew ? "New review" : values[specs[0]?.key] || item?.slug}</strong>
				{canPublish && (
					<label
						style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "var(--ep-fs-sm)" }}
					>
						<input
							type="checkbox"
							checked={published}
							onChange={(event) => setPublished(event.target.checked)}
							style={{ accentColor: "var(--ep-brand)" }}
						/>
						Published
					</label>
				)}
			</ItemTopStyled>

			<FieldsStyled>
				{specs.map((spec) => (
					<Field key={spec.key}>
						<Label htmlFor={`${item?.id ?? "new"}-${spec.key}`}>{spec.label}</Label>
						<Input
							id={`${item?.id ?? "new"}-${spec.key}`}
							multiline={spec.area}
							type={spec.number ? "number" : "text"}
							value={values[spec.key] ?? ""}
							onChange={(event) => setValues((prev) => ({ ...prev, [spec.key]: event.target.value }))}
						/>
					</Field>
				))}
			</FieldsStyled>

			{state === "error" && <Failure title="That didn't save" description={message ?? "Try again."} />}

			<ActionsStyled>
				<Button onClick={onSave} disabled={state === "saving"}>
					{state === "saving" ? "Saving…" : isNew ? "Add" : "Save"}
				</Button>
				{isNew && onCancel && (
					<Button variant="ghost" onClick={onCancel}>
						Cancel
					</Button>
				)}
				{canDelete && item && (
					<Button variant="ghost" onClick={onDelete} disabled={state === "saving"}>
						<Icon name="close" size={16} />
						Delete
					</Button>
				)}
				{state === "saved" && <SavedStyled>Saved</SavedStyled>}
			</ActionsStyled>
		</ItemCardStyled>
	);
}

// The legal editor: privacy and terms, each a title plus heading/body sections.
function LegalEditor() {
	const { items, error, isLoading, mutate } = useContentList("legal");
	if (error) return <Failure title="Could not load legal pages" description="Refresh the page to try again." />;
	if (isLoading) return <p style={{ color: "var(--ep-muted)" }}>Loading…</p>;
	return (
		<>
			{items.map((item) => (
				<LegalCard key={item.id} item={item} onChanged={mutate} />
			))}
		</>
	);
}

interface ILegalData {
	title: string;
	updated?: string;
	sections: { heading: string; body: string }[];
}

function LegalCard({ item, onChanged }: { item: IContentRecord; onChanged: () => void }) {
	const data = item.data as unknown as ILegalData;
	const [title, setTitle] = useState(data.title ?? "");
	const [updated, setUpdated] = useState(data.updated ?? "");
	const [sections, setSections] = useState(data.sections ?? []);
	const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

	function setSection(index: number, key: "heading" | "body", value: string) {
		setSections((prev) => prev.map((section, i) => (i === index ? { ...section, [key]: value } : section)));
	}

	async function onSave() {
		setState("saving");
		try {
			await updateContentItem("legal", item.id, {
				data: { title, updated: updated || undefined, sections },
			});
			await onChanged();
			setState("saved");
			setTimeout(() => setState("idle"), 1800);
		} catch {
			setState("error");
		}
	}

	return (
		<ItemCardStyled>
			<ItemTopStyled>
				<strong style={{ textTransform: "capitalize" }}>{item.slug}</strong>
			</ItemTopStyled>
			<FieldsStyled>
				<Field>
					<Label htmlFor={`${item.id}-title`}>Title</Label>
					<Input id={`${item.id}-title`} value={title} onChange={(event) => setTitle(event.target.value)} />
				</Field>
				<Field>
					<Label htmlFor={`${item.id}-updated`}>Last updated</Label>
					<Input
						id={`${item.id}-updated`}
						value={updated}
						onChange={(event) => setUpdated(event.target.value)}
					/>
				</Field>
				{sections.map((section, index) => (
					<SectionBoxStyled key={index}>
						<Field>
							<Label htmlFor={`${item.id}-h-${index}`}>Heading</Label>
							<Input
								id={`${item.id}-h-${index}`}
								value={section.heading}
								onChange={(event) => setSection(index, "heading", event.target.value)}
							/>
						</Field>
						<Field>
							<Label htmlFor={`${item.id}-b-${index}`}>Body</Label>
							<Input
								id={`${item.id}-b-${index}`}
								multiline
								value={section.body}
								onChange={(event) => setSection(index, "body", event.target.value)}
							/>
						</Field>
						<Button
							variant="ghost"
							onClick={() => setSections((prev) => prev.filter((_, i) => i !== index))}
						>
							<Icon name="close" size={16} />
							Remove section
						</Button>
					</SectionBoxStyled>
				))}
			</FieldsStyled>
			{state === "error" && <Failure title="That didn't save" description="Check the fields and try again." />}
			<ActionsStyled>
				<Button onClick={onSave} disabled={state === "saving"}>
					{state === "saving" ? "Saving…" : "Save"}
				</Button>
				<Button variant="outline" onClick={() => setSections((prev) => [...prev, { heading: "", body: "" }])}>
					<Icon name="plus" size={16} />
					Add section
				</Button>
				{state === "saved" && <SavedStyled>Saved</SavedStyled>}
			</ActionsStyled>
		</ItemCardStyled>
	);
}
