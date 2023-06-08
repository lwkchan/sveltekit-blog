export const handle = async ({ event, resolve }) => {
	const newTheme = event.url.searchParams.get('theme');
	const cookieTheme = event.cookies.get('theme');
	const theme = newTheme ? newTheme : cookieTheme;

	if (theme) {
		return await resolve(event, {
			transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
		});
	}

	return await resolve(event);
};
