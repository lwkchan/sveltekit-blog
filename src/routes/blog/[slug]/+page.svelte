<script>
	/** @type {import('./$types').PageData} */
	export let data;
	$: component = data.component;

	/**
	 * @param {string} dateString
	 */
	const getLocaleDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString();
	};
</script>

<svelte:head>
	<title>Laura Chan | {data.frontmatter.title}</title>
</svelte:head>

<h1>{data.frontmatter.title}</h1>
<p>
	<small>
		<time datetime={data.frontmatter.date}>{getLocaleDate(data.frontmatter.date)}</time>
	</small>
</p>

<svelte:component this={component} />

<nav class="margin-top-l">
	<a href="/blog/">← Blog index</a>
</nav>
