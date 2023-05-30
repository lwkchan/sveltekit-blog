<script>
	import '$lib/styles/app.css';

	import { themeStore } from '$lib/themeStore';

	const theme = themeStore();

	const changeTheme = () => {
		theme.update((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
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
		<a class="margin-left-l" href="/blog/">Blog</a>
	</nav>
	<button
		on:click={changeTheme}
		type="button"
		aria-label="Toggle"
		class="button button-square button-icon display-block"
		class:button-black={$theme === 'light'}
		class:button-border={$theme === 'light'}
	>
		<i aria-hidden class="ri-sun-fill" />
	</button>
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
</style>
