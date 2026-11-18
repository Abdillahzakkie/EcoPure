import type { ReactNode } from "react";
import Icon from "@/components/Icon";
import { NoticeIconStyled, NoticeStyled, NoticeTextStyled, NoticeTitleStyled, type TNoticeTone } from "./styled";

interface INoticeProps {
	tone?: TNoticeTone;
	title: string;
	description?: ReactNode;
	children?: ReactNode;
}

// A feedback block with a human title, a reason, and an optional recovery action.
// Success and Failure are thin presets so a form shows a real success state and a
// real failure state with a human-written reason and a recovery button.
export default function Notice({ tone = "info", title, description, children }: INoticeProps) {
	return (
		<NoticeStyled $tone={tone}>
			<NoticeIconStyled $tone={tone}>
				<Icon name={tone === "failure" ? "alert" : "check"} size={22} />
			</NoticeIconStyled>
			<NoticeTitleStyled>{title}</NoticeTitleStyled>
			{description && <NoticeTextStyled>{description}</NoticeTextStyled>}
			{children}
		</NoticeStyled>
	);
}

export type { TNoticeTone };
