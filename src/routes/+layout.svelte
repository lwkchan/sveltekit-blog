<script>
	import '../app.postcss';
</script>

<header class="container max-width-l">
	<nav
		class="nav-inline padding-vertical-l display-flex justify-content-space-between"
		aria-label="primary"
	>
		<div>
			<a href="/"
				><p class="font-size-xl no-margin"><strong>Laura Chan</strong></p>
				<p class="no-margin">Front-end Engineer</p></a
			>
		</div>
		<ul class="display-flex flex-justify-center"><li><a href="/blog/">Blog</a></li></ul>
	</nav>
</header>
<main class="container max-width-l padding-bottom-xl">
	<slot />
</main>
