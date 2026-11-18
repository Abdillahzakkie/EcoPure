"use client";
import { useState } from "react";
import Icon from "@/components/Icon";
import Illustration, { type TIllustration } from "@/components/Illustration";
import {
	ClipStyled,
	FrameStyled,
	HandleStyled,
	KnobStyled,
	LayerStyled,
	NoteStyled,
	RangeStyled,
	TagStyled,
} from "./styled";

interface IBeforeAfterProps {
	before?: TIllustration;
	after?: TIllustration;
	beforeLabel?: string;
	afterLabel?: string;
	note?: string;
}

// A drag-to-compare slider. The range input carries the real control, so the
// widget works with a keyboard (arrow keys) and a screen reader; the pointer
// just moves the same value. No auto-animation, so reduced-motion needs no
// special case here.
export default function BeforeAfter({
	before = "room-dirty",
	after = "room-clean",
	beforeLabel = "BEFORE",
	afterLabel = "AFTER",
	note,
}: IBeforeAfterProps) {
	const [pos, setPos] = useState(50);

	return (
		<div>
			<FrameStyled>
				<LayerStyled aria-hidden="true">
					<Illustration name={after} />
				</LayerStyled>
				<ClipStyled $pos={pos} aria-hidden="true">
					<LayerStyled>
						<Illustration name={before} />
					</LayerStyled>
				</ClipStyled>
				<TagStyled $side="left" aria-hidden="true">
					{beforeLabel}
				</TagStyled>
				<TagStyled $side="right" aria-hidden="true">
					{afterLabel}
				</TagStyled>
				<RangeStyled
					type="range"
					min={0}
					max={100}
					value={pos}
					aria-label="Reveal more of the after image"
					onChange={(event) => setPos(Number(event.target.value))}
				/>
				<HandleStyled $pos={pos} aria-hidden="true">
					<KnobStyled>
						<Icon name="chevron-left" size={16} />
						<Icon name="chevron-right" size={16} />
					</KnobStyled>
				</HandleStyled>
			</FrameStyled>
			{note && <NoteStyled>{note}</NoteStyled>}
		</div>
	);
}
