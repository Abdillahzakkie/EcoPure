import Icon from "@/components/Icon";
import { QuoteByStyled, QuoteStyled, QuoteTextStyled, StarsStyled } from "./styled";

interface IQuoteProps {
	quote: string;
	author: string;
	context?: string;
	rating?: number;
}

// A customer review. Stars are decorative; the rating is announced in text for a
// screen reader.
export default function Quote({ quote, author, context, rating = 5 }: IQuoteProps) {
	const stars = Math.max(1, Math.min(5, rating));
	return (
		<QuoteStyled>
			<StarsStyled role="img" aria-label={`${stars} out of 5 stars`}>
				{Array.from({ length: stars }, (_, i) => (
					<Icon key={i} name="star" size={18} fill="currentColor" stroke="none" />
				))}
			</StarsStyled>
			<QuoteTextStyled>{quote}</QuoteTextStyled>
			<QuoteByStyled>
				<strong>{author}</strong>
				{context ? ` · ${context}` : null}
			</QuoteByStyled>
		</QuoteStyled>
	);
}
