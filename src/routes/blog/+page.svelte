<script>
	/** @type {import('./$types').PageData} */ export let data;
</script>

<h1>Blog</h1>

<ul>
	{#each data.blogposts as { date, title, slug }}
		<li><a href={`/blog/${slug}`}>{title}</a></li>
	{/each}
</ul>
