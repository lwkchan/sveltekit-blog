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

<svelte:head>
	<title>Laura Chan | Blog</title>
</svelte:head>
<h1>Blog</h1>

<ul>
	{#each data.blogposts as { date, title, slug }}
		<article>
			<h2>
				<a href={`/blog/${slug}`}>{title}</a>
			</h2>
			<p><time datetime={date}><small>{getLocaleDate(date)}</small></time></p>
		</article>
	{/each}
</ul>
