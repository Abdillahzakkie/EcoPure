import Empty from "@/components/Empty";
import Grid from "@/components/Grid";
import Quote from "@/components/Quote";
import type { TReviewPublic } from "@/types";

// Render the reviews grid, or an honest empty state until the owner adds a real
// review in the admin. Never ship placeholder quotes as if they were real.
export default function Reviews({ reviews }: { reviews: TReviewPublic[] }) {
	if (reviews.length === 0) {
		return (
			<Empty
				title="No reviews yet"
				description="Reviews from real customers appear here. Add the first from the admin."
			/>
		);
	}
	return (
		<Grid min={300}>
			{reviews.map((review) => (
				<Quote
					key={review.id}
					quote={review.quote}
					author={review.author}
					context={review.context}
					rating={review.rating}
				/>
			))}
		</Grid>
	);
}
