import { error } from '@sveltejs/kit';
import { slugFromPath } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const modules = import.meta.glob(`/src/blogposts/*.{md,svx}`);

	/** @type any */
	let match = {};
	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === params.slug) {
			match = { path, resolver };
			break;
		}
	}
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
