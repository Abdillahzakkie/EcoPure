import type { IReview } from "@/server/validators/content";

// No real reviews exist yet. The public page renders a visible empty state until
// the owner adds the first real review in the admin. Never ship placeholder
// quotes as if they were real (ARCHITECTURE.md §8).
export const REVIEWS_SEED: IReview[] = [];
