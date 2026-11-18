import type { ReactNode } from "react";
import Notice from "@/components/Notice";

interface ISuccessProps {
	title: string;
	description?: ReactNode;
	children?: ReactNode;
}

// A real success state: confirms what happened and offers a next step.
export default function Success({ title, description, children }: ISuccessProps) {
	return (
		<Notice tone="success" title={title} description={description}>
			{children}
		</Notice>
	);
}
