import { slugFromPath } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export async function load() {
	/**
	 * @type {Object.<string, function>}
	 */
	const modules = import.meta.glob(`/src/blogposts/*.{md,svx}`);

	/** @type Array.<{date: string, title: string, slug: string}>} */
	let blogposts = [];
	for (const [path, resolve] of Object.entries(modules)) {
		const slug = slugFromPath(path);
		if (slug) {
			const markdown = await resolve();

			blogposts.push({
				date: markdown.metadata.date,
				title: markdown.metadata.title,
				slug
			});
		}
	}

	blogposts = blogposts.sort((a, b) => {
		const aDate = new Date(a.date);
		const bDate = new Date(b.date);
		return aDate.getTime() - bDate.getTime();
	});

	return {
		blogposts
	};
}
