import type { SVGProps } from "react";

export type TIconName =
	| "check"
	| "arrow-right"
	| "phone"
	| "leaf"
	| "plus"
	| "minus"
	| "close"
	| "chevron-left"
	| "chevron-right"
	| "star"
	| "alert"
	| "home"
	| "office"
	| "deep"
	| "tenancy"
	| "movein"
	| "oneoff"
	| "calendar"
	| "logout"
	| "inbox"
	| "sliders"
	| "menu"
	| "edit";

// Inline, single-colour SVG glyphs that inherit `currentColor`. Decorative by
// default (aria-hidden); pass a title for a meaningful icon. Paths are drawn on a
// 24×24 grid with a 2px stroke to match the artboard's line weight.
const PATHS: Record<TIconName, React.ReactNode> = {
	check: <path d="M20 6 9 17l-5-5" />,
	"arrow-right": (
		<>
			<path d="M5 12h14" />
			<path d="m13 6 6 6-6 6" />
		</>
	),
	phone: (
		<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
	),
	leaf: (
		<>
			<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
			<path d="M2 21c0-3 1.85-5.36 5.08-6" />
		</>
	),
	plus: (
		<>
			<path d="M12 5v14" />
			<path d="M5 12h14" />
		</>
	),
	minus: <path d="M5 12h14" />,
	close: (
		<>
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</>
	),
	"chevron-left": <path d="m15 18-6-6 6-6" />,
	"chevron-right": <path d="m9 18 6-6-6-6" />,
	star: <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2Z" />,
	alert: (
		<>
			<path d="M12 9v4" />
			<path d="M12 17h.01" />
			<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
		</>
	),
	home: (
		<>
			<path d="M3 9.5 12 3l9 6.5" />
			<path d="M5 10v10h14V10" />
			<path d="M9 20v-6h6v6" />
		</>
	),
	office: (
		<>
			<path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
			<path d="M16 9h2a2 2 0 0 1 2 2v10" />
			<path d="M8 7h2M8 11h2M8 15h2" />
			<path d="M2 21h20" />
		</>
	),
	deep: (
		<>
			<path d="M7 20h10" />
			<path d="M10 20v-6h4v6" />
			<path d="m12 14 1.5-8a2.5 2.5 0 0 0-5 0" />
			<path d="M9 7h6" />
		</>
	),
	tenancy: (
		<>
			<path d="M3 10 12 3l9 7" />
			<path d="M5 10v10h14V10" />
			<path d="m9 15 2 2 4-4" />
		</>
	),
	movein: (
		<>
			<path d="M3 9.5 12 3l9 6.5" />
			<path d="M5 10v10h14V10" />
			<path d="M12 20v-6" />
			<path d="m9 17 3-3 3 3" />
		</>
	),
	oneoff: (
		<>
			<path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
			<path d="m6 6 2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
		</>
	),
	calendar: (
		<>
			<path d="M8 2v4M16 2v4" />
			<rect x="3" y="5" width="18" height="16" rx="2" />
			<path d="M3 10h18" />
		</>
	),
	logout: (
		<>
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
			<path d="m16 17 5-5-5-5" />
			<path d="M21 12H9" />
		</>
	),
	inbox: (
		<>
			<path d="M22 12h-6l-2 3h-4l-2-3H2" />
			<path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1Z" />
		</>
	),
	sliders: (
		<>
			<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
			<path d="M1 14h6M9 8h6M17 16h6" />
		</>
	),
	edit: (
		<>
			<path d="M12 20h9" />
			<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
		</>
	),
	menu: (
		<>
			<path d="M4 6h16" />
			<path d="M4 12h16" />
			<path d="M4 18h16" />
		</>
	),
};

interface IIconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
	name: TIconName;
	size?: number;
	title?: string;
}

export default function Icon({ name, size = 20, title, ...rest }: IIconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			role={title ? "img" : "presentation"}
			aria-hidden={title ? undefined : true}
			aria-label={title}
			focusable="false"
			{...rest}
		>
			{title && <title>{title}</title>}
			{PATHS[name]}
		</svg>
	);
}
