import { slugFromPath } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export async function load() {
	const modules = import.meta.glob(`/src/blogposts/*.{md,svx}`);

	/** @type string[] */
	let slugs = [];
	for (const [path] of Object.entries(modules)) {
		const slug = slugFromPath(path);
		if (slug) {
			slugs.push(slug);
		}
	}

	return {
		blogposts: slugs
	};
}
