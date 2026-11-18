import type { IGallery } from "@/server/validators/content";

// The gallery cards. The image key names a built-in illustration until the owner
// uploads a real job photo through the admin. Copy from the approved artboard.
export const GALLERY_SEED: IGallery[] = [
	{ title: "Living spaces", caption: "Fresh, tidy rooms that feel good to come home to.", image: "living" },
	{ title: "Streak-free shine", caption: "Glass, mirrors and surfaces left sparkling clean.", image: "windows" },
	{ title: "Gentle on the planet", caption: "Eco-friendly products and thoughtful routines.", image: "bucket" },
];
