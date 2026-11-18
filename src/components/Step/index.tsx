import { StepNumberStyled, StepStyled, StepTextStyled, StepTitleStyled } from "./styled";

interface IStepProps {
	number: number;
	title: string;
	detail: string;
}

export default function Step({ number, title, detail }: IStepProps) {
	return (
		<StepStyled>
			<StepNumberStyled aria-hidden="true">{number}</StepNumberStyled>
			<StepTitleStyled>{title}</StepTitleStyled>
			<StepTextStyled>{detail}</StepTextStyled>
		</StepStyled>
	);
}
