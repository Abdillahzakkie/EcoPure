import { Badge, Button, Icon } from "@/components";
import HeroQuoteForm from "@/libs/HeroQuoteForm";
import {
	BlobStyled,
	BulletsStyled,
	CopyStyled,
	CtasStyled,
	FormColStyled,
	HeroBandStyled,
	InnerStyled,
	LeadStyled,
	TitleStyled,
} from "./styled";

const BULLETS = ["Free, no-obligation quote", "One-off or regular visits", "Eco-friendly products"];

// The home hero: the static left column (badge, headline, lead, CTAs, bullets)
// and the interactive quote form on the right. The headline is two-tone — ink
// then brand green — matching the approved artboard.
export default function HomeHero() {
	return (
		<HeroBandStyled>
			<BlobStyled aria-hidden="true">
				<span />
				<span />
				<span />
				<span />
				<span />
			</BlobStyled>
			<InnerStyled>
				<CopyStyled>
					<Badge tone="mint">
						<Icon name="leaf" size={16} /> Eco-friendly cleaning for homes and offices
					</Badge>
					<TitleStyled>
						Spotless spaces, <em>naturally.</em>
					</TitleStyled>
					<LeadStyled>
						EcoPure brings careful, eco-friendly cleaning to your home or workplace. Flexible visits,
						friendly teams and a free quote in minutes.
					</LeadStyled>
					<CtasStyled>
						<Button as="a" href="/book" size="lg">
							Get a free quote
							<Icon name="arrow-right" size={18} />
						</Button>
						<Button as="a" href="/services" size="lg" variant="outline">
							See our services
						</Button>
					</CtasStyled>
					<BulletsStyled>
						{BULLETS.map((bullet) => (
							<li key={bullet}>
								<Icon name="check" size={18} />
								{bullet}
							</li>
						))}
					</BulletsStyled>
				</CopyStyled>
				<FormColStyled>
					<HeroQuoteForm />
				</FormColStyled>
			</InnerStyled>
		</HeroBandStyled>
	);
}
