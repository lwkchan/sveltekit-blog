<script>
	/** @type {import('./$types').PageData} */ export let data;
</script>

<h1>Blog</h1>

<ul>
	{#each data.blogposts as blogpost}
		<li><a href={`/blog/${blogpost}`}>{blogpost}</a></li>
	{/each}
</ul>
