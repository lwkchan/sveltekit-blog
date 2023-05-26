import { error } from '@sveltejs/kit';

const slugFromPath = (/** @type {string} */ path) =>
	path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const modules = import.meta.glob(`/src/blogposts/*.{md,svx}`);

	/** @type any */
	let match = {};
	for (const [path, resolver] of Object.entries(modules)) {
		console.log(`🚀 ~ file: +page.js:13 ~ load ~ resolver:`, resolver);
		console.log(`🚀 ~ file: +page.js:13 ~ load ~ path:`, path);
		if (slugFromPath(path) === params.slug) {
			match = { path, resolver };
			console.log(`🚀 ~ file: +page.js:17 ~ load ~ match:`, match);
			break;
		}
	}

	console.log(`🚀 ~ file: +page.js:20 ~ load ~ match:`, match);
	const post = await match.resolver();

	if (!post) {
		throw error(404); // Couldn't resolve the post
	}

	return {
		component: post.default,
		frontmatter: post.metadata
	};
}

export const ssr = true;
