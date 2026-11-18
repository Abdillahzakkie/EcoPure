import Icon from "@/components/Icon";
import { CheckStyled, ReasonStyled, TextStyled, TitleStyled } from "./styled";

interface IReasonItemProps {
	title: string;
	detail: string;
}

export default function ReasonItem({ title, detail }: IReasonItemProps) {
	return (
		<ReasonStyled>
			<CheckStyled aria-hidden="true">
				<Icon name="check" size={18} />
			</CheckStyled>
			<div>
				<TitleStyled>{title}</TitleStyled>
				<TextStyled>{detail}</TextStyled>
			</div>
		</ReasonStyled>
	);
}
