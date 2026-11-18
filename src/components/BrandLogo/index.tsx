import { BrandLinkStyled, MarkStyled, NameStyled, TagStyled, WordStyled } from "./styled";

interface IBrandLogoProps {
	// Use the light variant on the dark footer.
	light?: boolean;
	href?: string;
}

// The EcoPure wordmark: a leaf mark with sparkle plus the two-line name. The leaf
// fills with currentColor so the one component serves the header (green) and the
// footer (white).
export default function BrandLogo({ light, href = "/" }: IBrandLogoProps) {
	return (
		<BrandLinkStyled href={href} $light={light} aria-label="EcoPure Cleaning, home">
			<MarkStyled $light={light} aria-hidden="true">
				<svg width="38" height="38" viewBox="0 0 38 38" fill="none" focusable="false">
					<path
						d="M12 31C5 26 5 16 11.5 11.5 18 7 23 8 31 5c1 9-1 15-6 19-4 3.2-9 3.6-13 7Z"
						fill="currentColor"
					/>
					<path d="M9 33c1-6 5-10 12-13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
					<circle cx="27" cy="12" r="2.4" fill="var(--ep-accent)" />
					<path d="M31 7l.9 2.1 2.1.9-2.1.9L31 13l-.9-2.1-2.1-.9 2.1-.9Z" fill="var(--ep-accent)" />
				</svg>
			</MarkStyled>
			<WordStyled>
				<NameStyled>EcoPure</NameStyled>
				<TagStyled $light={light}>Cleaning</TagStyled>
			</WordStyled>
		</BrandLinkStyled>
	);
}
