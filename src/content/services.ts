import type { IService } from "@/server/validators/content";

// The six services. The blurb is the card copy from the approved artboard; the
// body is the long copy for /services/[slug]. Live copy is edited in the admin;
// these seed a fresh database. Icon keys map to the ServiceCard illustrations.
export const SERVICES_SEED: IService[] = [
	{
		slug: "home-cleaning",
		title: "Home cleaning",
		blurb: "Weekly, fortnightly or monthly visits that keep your home fresh, tidy and welcoming.",
		icon: "home",
		body: "A regular clean keeps your home feeling cared for without the weekend scrub. Your team works to a checklist you agree up front, so the same jobs get done every visit: kitchens and bathrooms, floors, surfaces and the touches that make a room feel reset.\n\nChoose weekly, fortnightly or monthly visits, and change the frequency whenever your routine does. Every visit uses eco-friendly products that are kinder to your family and the planet.",
	},
	{
		slug: "office-cleaning",
		title: "Office cleaning",
		blurb: "Reliable out-of-hours or daytime cleaning that gives your team a healthier place to work.",
		icon: "office",
		body: "A clean workplace is a healthier one. EcoPure cleans offices out of hours or during the day, around the way your team works, with a consistent routine for desks, kitchens, washrooms and shared spaces.\n\nYou get the same reliable team each visit and a point of contact who knows your space. Tell us your access arrangements and we fit the clean around them.",
	},
	{
		slug: "deep-cleaning",
		title: "Deep cleaning",
		blurb: "A top-to-bottom reset for kitchens, bathrooms and the corners that regular cleans skip.",
		icon: "deep",
		body: "A deep clean reaches the places a weekly visit does not: inside the oven, behind appliances, limescale on taps and tiles, skirting boards and door frames. It is the reset a home or office needs a few times a year.\n\nTell us what matters most and we agree a checklist before we start, so you know exactly what the visit covers.",
	},
	{
		slug: "end-of-tenancy",
		title: "End of tenancy",
		blurb: "A thorough clean to help you hand back the keys with confidence.",
		icon: "tenancy",
		body: "Moving out is busy enough without the final clean. EcoPure works through the property room by room so it is ready for the next tenant and the check-out inspection: kitchen, bathrooms, floors, windows inside, and the fittings landlords look at closely.\n\nTell us the inventory or agent requirements and we clean to meet them.",
	},
	{
		slug: "move-in-cleaning",
		title: "Move-in cleaning",
		blurb: "Start fresh in a new place, cleaned and ready before the boxes arrive.",
		icon: "movein",
		body: "A new home feels more like yours once it has been cleaned the way you would clean it. We clean the empty property before you move in, so the first thing you unpack into is a fresh, healthy space.\n\nBook it for the day before your move and arrive to a home that is ready for you.",
	},
	{
		slug: "one-off",
		title: "One-off and occasional",
		blurb: "Spring cleans, party clean-ups or a single visit when you simply need a hand.",
		icon: "oneoff",
		body: "Sometimes you need one clean, not a routine. A spring refresh, the morning after a gathering, or a hand before guests arrive: book a single visit and tell us what you would like us to focus on.\n\nThere is no commitment and no regular schedule unless you want one.",
	},
];
