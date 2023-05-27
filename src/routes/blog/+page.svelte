<script>
	/** @type {import('./$types').PageData} */ export let data;

	/**
	 * @param {string} dateString
	 */
	const getLocaleDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString();
	};
</script>

<h1>Blog</h1>

<ul>
	{#each data.blogposts as { date, title, slug }}
		<article class="margin-bottom-m">
			<h2>
				<a href={`/blog/${slug}`}>{title}</a>
			</h2>
			<p><time datetime={date}><small>{getLocaleDate(date)}</small></time></p>
		</article>
	{/each}
</ul>
