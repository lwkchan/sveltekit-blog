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

<header class="container max-width-l display-flex flex-justify-center">
	<nav class="padding-vertical-l display-flex flex-justify-center" aria-label="primary">
		<a href="/">
			<p class="font-size-xl no-margin">
				<strong>Laura Chan</strong>
			</p>
			<p class="no-margin">Front-end Engineer</p>
		</a>
		<a class="margin-left-l" data-sveltekit-preload-code="viewport" href="/blog/">Blog</a>
	</nav>
	<form method="POST" use:enhance={submitUpdateTheme}>
		<!-- When dark -->
		<button
			formaction="/?/setTheme&theme=light"
			aria-label="Toggle theme"
			id="light-button"
			class="button button-square button-icon display-block"
		>
			<i aria-hidden class="ri-sun-fill" />
		</button>

		<!-- When light -->
		<button
			formaction="/?/setTheme&theme=dark"
			aria-label="Toggle theme"
			class="button button-square button-icon display-block button-black button-border"
			id="dark-button"
		>
			<i class="ri-moon-fill" />
		</button>
	</form>
</header>
<main class="container max-width-l padding-bottom-xl">
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
