// Escape a string for safe interpolation into HTML text or an attribute value.
// Used for user-controlled values in transactional email bodies so a name, note,
// or other field can never inject markup.
export function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

// Characters that can terminate an inline <script>/HTML comment, plus the JS
// line separators (U+2028/U+2029) that are invalid in a script context. Built
// from a string so no literal separator character appears in this source file.
const SCRIPT_UNSAFE = new RegExp("[<>&\\u2028\\u2029]", "g");

// Serialize a value for embedding in an inline <script> tag. JSON.stringify alone
// does not escape `<`, so a value containing `</script>` would break out of the
// tag; this unicode-escapes the unsafe characters while keeping valid JSON.
export function safeJsonForScript(value: unknown): string {
	return JSON.stringify(value).replace(SCRIPT_UNSAFE, (ch) => `\\u${ch.charCodeAt(0).toString(16).padStart(4, "0")}`);
}
