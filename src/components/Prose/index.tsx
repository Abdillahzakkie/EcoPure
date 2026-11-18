import { ProseStyled } from "./styled";

// Render a block of copy, splitting paragraphs on blank lines. Used for the
// service long copy and legal pages.
export default function Prose({ text }: { text: string }) {
	const paragraphs = text
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter(Boolean);
	return (
		<ProseStyled>
			{paragraphs.map((paragraph, i) => (
				<p key={i}>{paragraph}</p>
			))}
		</ProseStyled>
	);
}
