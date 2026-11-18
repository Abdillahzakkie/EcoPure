import { NextResponse } from "next/server";
import { createRule, listRules } from "@/server/services/availability";
import { availabilityRuleSchema } from "@/server/validators/availability";
import { errorResponse, guard } from "../_guard";

// GET the availability rules; POST a new rule.
export async function GET() {
	try {
		await guard();
		return NextResponse.json({ rules: await listRules() });
	} catch (error) {
		return errorResponse(error);
	}
}

export async function POST(request: Request) {
	try {
		await guard();
		const parsed = availabilityRuleSchema.safeParse(await request.json().catch(() => null));
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Check the rule and try again.", issues: parsed.error.flatten().fieldErrors },
				{ status: 400 },
			);
		}
		return NextResponse.json({ rule: await createRule(parsed.data) }, { status: 201 });
	} catch (error) {
		return errorResponse(error);
	}
}
