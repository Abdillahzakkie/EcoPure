import Icon from "@/components/Icon";
import { PanelStyled } from "./styled";

// The decorative brand panel: a white leaf on a green gradient, used beside the
// why-EcoPure copy.
export default function LeafPanel() {
	return (
		<PanelStyled aria-hidden="true">
			<span />
			<span />
			<span />
			<span />
			<Icon name="leaf" size={200} />
		</PanelStyled>
	);
}
