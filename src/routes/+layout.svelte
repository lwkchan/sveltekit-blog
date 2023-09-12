<script>
	import { enhance } from '$app/forms';
	import '$lib/styles/app.css';

	let theme =
		(typeof window === 'undefined' ? 'light' : document.body.getAttribute('data-theme')) || 'light';

	/** @type {import('./$types').SubmitFunction} */
	const submitUpdateTheme = ({ action }) => {
		const themeParam = action.searchParams.get('theme');

		if (themeParam) {
			theme = themeParam;
			document.body.setAttribute('data-theme', themeParam);
		}
	};
</script>

<!-- <svelte:body class="min-h-screen" /> -->

<div class="grid grid-rows-[auto,1fr,auto] min-h-screen p-4 gap-4">
	<header class="container mx-auto">
		<nav aria-label="primary">
			<a href="/">
				<p>
					<strong>Laura Chan</strong>
				</p>
				<p>Front-end Engineer</p>
			</a>
			<a data-sveltekit-preload-code="viewport" href="/blog/">Blog</a>
		</nav>
		<form method="POST" use:enhance={submitUpdateTheme}>
			<!-- When dark -->
			<button formaction="/?/setTheme&theme=light" aria-label="Toggle theme" id="light-button">
				<i aria-hidden />
			</button>

			<!-- When light -->
			<button formaction="/?/setTheme&theme=dark" aria-label="Toggle theme" id="dark-button">
				<i />
			</button>
		</form>
	</header>
	<main class="container my-0 mx-auto">
		<slot />
	</main>
	<footer class="footer items-center p-4 bg-neutral text-neutral-content">
		<aside class="items-center grid-flow-col">
			<p>Copyright © 2023 - All right reserved</p>
		</aside>
		<nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end" />
	</footer>
</div>
