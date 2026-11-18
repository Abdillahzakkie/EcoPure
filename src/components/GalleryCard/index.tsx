import Image from "next/image";
import Illustration, { type TIllustration } from "@/components/Illustration";
import { BodyStyled, CaptionStyled, CardStyled, MediaStyled, TitleStyled } from "./styled";

interface IGalleryCardProps {
	title: string;
	caption: string;
	// A built-in illustration key, or an ImageKit URL once a real photo is added.
	image?: string;
}

const ILLUSTRATIONS = new Set<TIllustration>(["living", "windows", "bucket", "leaf", "room-dirty", "room-clean"]);

export default function GalleryCard({ title, caption, image }: IGalleryCardProps) {
	const isUrl = Boolean(image && /^https?:\/\//.test(image));
	const illustration = (image && ILLUSTRATIONS.has(image as TIllustration) ? image : "living") as TIllustration;
	return (
		<CardStyled>
			<MediaStyled>
				{isUrl && image ? (
					<Image src={image} alt={title} width={640} height={400} />
				) : (
					<Illustration name={illustration} />
				)}
			</MediaStyled>
			<BodyStyled>
				<TitleStyled>{title}</TitleStyled>
				<CaptionStyled>{caption}</CaptionStyled>
			</BodyStyled>
		</CardStyled>
	);
}
