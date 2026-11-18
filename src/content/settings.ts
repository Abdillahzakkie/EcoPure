import type { ISettings } from "@/server/validators/content";

// Site settings (contact details shown in the footer and used in email). These
// stay as clear placeholder text until the owner fills them in the admin, so
// nothing fake ships as if it were real.
export const SETTINGS_SEED: ISettings = {
	phone: "[YOUR PHONE]",
	email: "[YOUR EMAIL]",
	serviceArea: "[YOUR SERVICE AREA]",
	addressNote: "",
};
