import { error } from '@sveltejs/kit';
import { slugFromPath } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const modules = import.meta.glob(`/src/blogposts/*.{md,svx}`);

	/**
	 * @callback Resolver
	 * @returns {Promise.<any>}
	 */
	/**
	 * @type {{path?: string, resolver?: Resolver}}
	 */
	let match = {};
	const entries = Object.entries(modules);
	for (const [path, resolver] of entries) {
		if (slugFromPath(path) === params.slug) {
			match = { path, resolver };
			break;
		}
	}
	const post = match.resolver && (await match.resolver());

	if (!post) {
		throw error(404); // Couldn't resolve the post
	}

	return {
		component: post.default,
		frontmatter: post.metadata
	};
}

export const ssr = true;
