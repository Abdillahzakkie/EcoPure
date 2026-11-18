import type { ReactNode } from "react";
import Notice from "@/components/Notice";

interface IFailureProps {
	title: string;
	description?: ReactNode;
	children?: ReactNode;
}

// A real failure state: a human reason and a recovery button, never a dead end.
export default function Failure({ title, description, children }: IFailureProps) {
	return (
		<Notice tone="failure" title={title} description={description}>
			{children}
		</Notice>
	);
}
