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

<div class="prose mx-auto">
	<h1>{data.frontmatter.title}</h1>
	<p>
		<small>
			<time datetime={data.frontmatter.date}>{getLocaleDate(data.frontmatter.date)}</time>
		</small>
	</p>

	<svelte:component this={component} />
</div>

<nav>
	<a href="/blog/">← Blog index</a>
</nav>
