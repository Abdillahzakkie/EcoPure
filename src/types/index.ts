import type { IFaq, IGallery, ILegal, IReason, IReview, IService, ISettings, IStep } from "@/server/validators/content";

// The public shape of a content record: the validated fields plus the stored id
// and order. Pages and the admin read these. A record from the seed uses a
// stable string id (the slug, or the index) so keys are stable before seeding.
type TWithMeta<T> = T & { id: string; order: number };

export type TServicePublic = TWithMeta<IService>;
export type TReviewPublic = TWithMeta<IReview> & { published: boolean };
export type TFaqPublic = TWithMeta<IFaq>;
export type TStepPublic = TWithMeta<IStep>;
export type TReasonPublic = TWithMeta<IReason>;
export type TGalleryPublic = TWithMeta<IGallery>;
export type TLegalPublic = ILegal;
export type TSettingsPublic = ISettings;

// A booking as the client reads it (guest manage, admin). Dates are ISO strings
// so the shape is serializable across the server/client boundary.
export interface IPreferredSlot {
	date: string;
	window: "morning" | "afternoon" | "evening";
}

export interface IConfirmedSlot {
	date: string;
	window: string;
	startTime?: string;
}

export type TBookingStatus = "pending" | "confirmed" | "declined" | "completed" | "cancelled";
export type TBookingKind = "quote" | "booking";

export interface IStatusEvent {
	status: string;
	at: string;
	by: "owner" | "customer" | "system";
	note?: string;
}

export interface IBookingPublic {
	id: string;
	kind: TBookingKind;
	name: string;
	email?: string;
	phone?: string;
	propertyType: "home" | "office";
	serviceSlug: string;
	frequency: "one-off" | "weekly" | "fortnightly" | "monthly";
	postcode: string;
	address?: string;
	notes?: string;
	preferredSlots?: IPreferredSlot[];
	status: TBookingStatus;
	confirmedSlot?: IConfirmedSlot;
	priceNote?: string;
	statusHistory: IStatusEvent[];
	source?: string;
	createdAt: string;
	updatedAt: string;
}

// An open window the booking form offers, derived from the availability rules.
export interface IOpenWindow {
	date: string;
	window: "morning" | "afternoon" | "evening";
	label: string;
}
