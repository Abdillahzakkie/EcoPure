import { describe, expect, it } from "vitest";
import { escapeHtml, safeJsonForScript } from "./html";

describe("escapeHtml", () => {
	it("escapes the HTML metacharacters", () => {
		expect(escapeHtml(`<img src=x onerror="alert('x')">&`)).toBe(
			"&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;&amp;",
		);
	});

	it("leaves plain text unchanged", () => {
		expect(escapeHtml("Jane Smith, AB1 2CD")).toBe("Jane Smith, AB1 2CD");
	});
});

describe("safeJsonForScript", () => {
	it("escapes a </script> breakout attempt", () => {
		const out = safeJsonForScript({ name: "</script><script>alert(1)</script>" });
		expect(out).not.toContain("</script>");
		expect(out).toContain("\\u003c/script\\u003e");
	});

	it("round-trips to the original value through JSON.parse", () => {
		const value = { a: "x</script>y", b: "a & b < c > d" };
		expect(JSON.parse(safeJsonForScript(value))).toEqual(value);
	});

	it("escapes the JS line separators", () => {
		expect(safeJsonForScript("a\u2028b")).toContain("\\u2028");
	});
});
