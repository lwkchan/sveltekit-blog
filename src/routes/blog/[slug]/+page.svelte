<script>
	/** @type {import('./$types').PageData} */ export let data;

	$: component = data.component;
</script>

<h1>{data}</h1>
<div>{@html JSON.stringify(data)}</div>

<div class="prose">
	<svelte:component this={component} />
</div>
