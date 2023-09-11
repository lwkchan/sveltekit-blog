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

<header>
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
<main>
	<slot />
</main>

<style>
	:global(body[data-theme='dark']) {
		--white: var(--light-100);

		--color: var(--white);
		--background: var(--dark);
		--body-background: var(--dark);
		--body-color: var(--white);

		--button-hover-background: var(--white);
		--button-hover-border-color: var(--white);
		--button-hover-box-shadow: var(--white);
		--button-active-background: var(--white);
		--button-active-border-color: var(--white);
		--button-active-box-shadow: var(--white);

		--code-color: var(--primary-100);
	}

	:global(body[data-theme='dark'] #dark-button) {
		display: none;
	}
	:global(body[data-theme='light'] #light-button, body[data-theme=''] #light-button) {
		display: none;
	}
</style>
