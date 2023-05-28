import { onMount } from 'svelte';
import { writable } from 'svelte/store';

// Set up our MediaQueryList

// Initial theme config from current state
export const themeStore = () => {
	const store = writable('light');
	onMount(() => {
		const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
		if (prefersDarkMode) {
			store.update(() => 'dark');
		}
	});

	store.subscribe((theme) => {
		if (typeof window !== 'undefined') {
			document.body.setAttribute('data-theme', theme);
		}
	});

	return store;
};
