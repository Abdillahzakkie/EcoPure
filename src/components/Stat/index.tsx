import { StatLabelStyled, StatStyled, StatValueStyled } from "./styled";

interface IStatProps {
	value: string;
	label: string;
}

export default function Stat({ value, label }: IStatProps) {
	return (
		<StatStyled>
			<StatValueStyled>{value}</StatValueStyled>
			<StatLabelStyled>{label}</StatLabelStyled>
		</StatStyled>
	);
}
