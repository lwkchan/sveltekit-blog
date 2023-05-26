export const slugFromPath = (/** @type {string} */ path) =>
	path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;
