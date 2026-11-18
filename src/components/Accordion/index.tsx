"use client";
import { useId, useState } from "react";
import Icon from "@/components/Icon";
import { AccordionStyled, ItemStyled, MarkStyled, PanelStyled, TriggerStyled } from "./styled";

export interface IAccordionItem {
	id: string;
	question: string;
	answer: string;
}

interface IAccordionProps {
	items: IAccordionItem[];
	// The item open on first render; defaults to the first.
	defaultOpen?: number;
}

// An accessible FAQ accordion. Each trigger is a button with aria-expanded and
// aria-controls; the panel is region-labelled. The first item opens by default.
export default function Accordion({ items, defaultOpen = 0 }: IAccordionProps) {
	const [open, setOpen] = useState<number | null>(defaultOpen);
	const base = useId();

	return (
		<AccordionStyled>
			{items.map((item, index) => {
				const isOpen = open === index;
				const panelId = `${base}-panel-${index}`;
				const triggerId = `${base}-trigger-${index}`;
				return (
					<ItemStyled key={item.id}>
						<h3 style={{ margin: 0 }}>
							<TriggerStyled
								id={triggerId}
								type="button"
								aria-expanded={isOpen}
								aria-controls={panelId}
								onClick={() => setOpen(isOpen ? null : index)}
							>
								{item.question}
								<MarkStyled $open={isOpen} aria-hidden="true">
									<Icon name={isOpen ? "close" : "plus"} size={18} />
								</MarkStyled>
							</TriggerStyled>
						</h3>
						{isOpen && (
							<PanelStyled id={panelId} role="region" aria-labelledby={triggerId}>
								{item.answer}
							</PanelStyled>
						)}
					</ItemStyled>
				);
			})}
		</AccordionStyled>
	);
}
