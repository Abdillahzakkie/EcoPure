import type { CSSProperties } from "react";

export type TIllustration = "living" | "windows" | "bucket" | "leaf" | "room-dirty" | "room-clean";

// Flat, on-brand SVG scenes that stand in for owner-uploaded photos until real
// ones are added in the admin. Decorative (aria-hidden); the card copy carries
// the meaning. Drawn on a 320×220 grid in the EcoPure palette.
const SCENES: Record<TIllustration, React.ReactNode> = {
	living: (
		<>
			<rect x="34" y="40" width="70" height="60" rx="6" fill="#DFF1E6" stroke="#9DC9AE" strokeWidth="3" />
			<circle cx="69" cy="60" r="9" fill="#FFC93C" />
			<path d="M46 86h46l-13-16-9 9-6-5-18 12Z" fill="#037B40" />
			<rect x="120" y="58" width="56" height="34" rx="5" fill="#FFFFFF" stroke="#9DC9AE" strokeWidth="3" />
			<path d="M128 84h40l-12-14-8 7-5-4-15 11Z" fill="#0F3D26" />
			<circle cx="137" cy="70" r="5" fill="#FFC93C" />
			<rect x="60" y="120" width="150" height="34" rx="16" fill="#1E9A57" />
			<rect x="66" y="112" width="42" height="24" rx="10" fill="#037B40" />
			<rect x="150" y="112" width="42" height="24" rx="10" fill="#037B40" />
			<rect x="70" y="150" width="10" height="22" rx="3" fill="#0F3D26" />
			<rect x="190" y="150" width="10" height="22" rx="3" fill="#0F3D26" />
			<rect x="246" y="96" width="24" height="58" rx="10" fill="#C8873E" />
			<path d="M258 96c-8-16 2-30 10-34-2 12 4 20 0 34Z" fill="#037B40" />
			<path d="M258 96c6-14 18-18 24-18-6 8-8 16-24 18Z" fill="#1E9A57" />
			<path d="M236 24l3 7 7 .6-5 5 1.5 7-6.5-3.7-6.5 3.7 1.5-7-5-5 7-.6Z" fill="#FFC93C" />
		</>
	),
	windows: (
		<>
			<rect x="60" y="24" width="200" height="150" rx="8" fill="#CFE6F6" stroke="#9DC9AE" strokeWidth="4" />
			<rect x="155" y="24" width="10" height="150" fill="#FFFFFF" />
			<rect x="60" y="94" width="200" height="10" fill="#FFFFFF" />
			<path d="M60 140q50-26 100-10t100-6v50H60Z" fill="#8FCBA6" />
			<path d="M60 150q50-18 100-6t100-10v40H60Z" fill="#037B40" />
			<ellipse cx="110" cy="56" rx="20" ry="9" fill="#FFFFFF" />
			<ellipse cx="206" cy="60" rx="24" ry="10" fill="#FFFFFF" />
			<path d="M100 120l2.5 6 6 .5-4.5 4 1.3 6-5.3-3.2-5.3 3.2 1.3-6-4.5-4 6-.5Z" fill="#FFC93C" />
			<path d="M210 118l2.5 6 6 .5-4.5 4 1.3 6-5.3-3.2-5.3 3.2 1.3-6-4.5-4 6-.5Z" fill="#FFC93C" />
		</>
	),
	bucket: (
		<>
			<path d="M96 70h110l-10 92a10 10 0 0 1-10 9h-60a10 10 0 0 1-10-9Z" fill="#037B40" />
			<ellipse cx="151" cy="70" rx="55" ry="14" fill="#1E9A57" />
			<ellipse cx="151" cy="70" rx="42" ry="9" fill="#BBE0CB" />
			<path d="M100 74c0-18 102-18 102 0" fill="none" stroke="#1E9A57" strokeWidth="5" strokeLinecap="round" />
			<path d="M176 60 206 26" stroke="#0F3D26" strokeWidth="6" strokeLinecap="round" />
			<path d="M200 20h16l-4 16h-8Z" fill="#8FCBA6" />
			<path d="M205 20h8v-8h-8Z" fill="#0F3D26" />
			<path d="M151 150c-9-14 3-24 9-28-2 10 3 16-9 28Z" fill="#FFFFFF" />
			<circle cx="120" cy="54" r="6" fill="#DFF1E6" />
			<circle cx="185" cy="50" r="5" fill="#DFF1E6" />
			<path d="M236 60l2.5 6 6 .5-4.5 4 1.3 6-5.3-3.2-5.3 3.2 1.3-6-4.5-4 6-.5Z" fill="#FFC93C" />
		</>
	),
	leaf: (
		<>
			<circle cx="250" cy="60" r="60" fill="#1E9A57" opacity="0.5" />
			<circle cx="60" cy="170" r="70" fill="#1E9A57" opacity="0.5" />
			<path d="M150 40c40-10 70 6 84 24-30 18-56 14-70 2-10-8-14-16-14-26Z" fill="#FFFFFF" />
			<path d="M120 60c-6 44 14 74 44 96-6-40-20-64-44-96Z" fill="#FFFFFF" />
			<path d="M120 60c24 32 38 56 44 96-30-22-50-52-44-96Z" fill="#EAF6EE" />
			<circle cx="196" cy="70" r="12" fill="#FFFFFF" />
			<circle cx="214" cy="58" r="7" fill="#FFFFFF" />
			<circle cx="182" cy="56" r="5" fill="#FFFFFF" />
		</>
	),
	"room-dirty": (
		<>
			<rect x="0" y="0" width="320" height="220" fill="#EDE7DA" />
			<rect x="0" y="120" width="320" height="100" fill="#9DAE8E" />
			<rect x="30" y="120" width="120" height="100" fill="#6E7F5E" />
			<rect x="60" y="150" width="8" height="30" fill="#E7E0D0" />
			<rect x="110" y="150" width="8" height="30" fill="#E7E0D0" />
			<rect x="196" y="40" width="40" height="56" rx="6" fill="#B98A4E" />
			<path d="M216 40c-6-14 2-24 8-28-2 10 3 16-8 28Z" fill="#5E7A4E" />
			<circle cx="150" cy="70" r="6" fill="#B5A98B" />
			<circle cx="180" cy="90" r="4" fill="#B5A98B" />
			<circle cx="90" cy="60" r="5" fill="#B5A98B" />
			<path d="M240 30l2 5 5 .4-3.8 3.4 1 5-4.2-2.7-4.2 2.7 1-5-3.8-3.4 5-.4Z" fill="#E2C23A" />
		</>
	),
	"room-clean": (
		<>
			<rect x="0" y="0" width="320" height="220" fill="#F4FAF6" />
			<rect x="0" y="120" width="320" height="100" fill="#FFFFFF" />
			<rect x="30" y="120" width="120" height="100" fill="#037B40" />
			<rect x="60" y="150" width="8" height="30" fill="#EAF6EE" />
			<rect x="110" y="150" width="8" height="30" fill="#EAF6EE" />
			<rect x="196" y="40" width="40" height="56" rx="6" fill="#C8873E" />
			<path d="M216 40c-6-14 2-24 8-28-2 10 3 16-8 28Z" fill="#037B40" />
			<path d="M60 40l2.5 6 6 .5-4.5 4 1.3 6-5.3-3.2-5.3 3.2 1.3-6-4.5-4 6-.5Z" fill="#FFC93C" />
			<path d="M150 54l2 5 5 .4-3.8 3.4 1 5-4.2-2.7-4.2 2.7 1-5-3.8-3.4 5-.4Z" fill="#FFC93C" />
		</>
	),
};

interface IIllustrationProps {
	name: TIllustration;
	style?: CSSProperties;
	className?: string;
}

export default function Illustration({ name, style, className }: IIllustrationProps) {
	return (
		<svg
			viewBox="0 0 320 220"
			width="100%"
			height="100%"
			preserveAspectRatio="xMidYMid slice"
			role="presentation"
			aria-hidden="true"
			focusable="false"
			style={style}
			className={className}
		>
			{SCENES[name]}
		</svg>
	);
}
