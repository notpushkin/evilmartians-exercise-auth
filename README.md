# Exercise for EvilMartians

> Try to create a convenient and beautiful authentication form (via email and password) on a SPA framework — but without UI component library. You need to think about sending email/password to a server, but you can skip building the server by mocking `fetch()`. Deploy the example on GitHub Pages, and send a link to the final interface and sources.


## Architecture notes

- **SvelteKit with static adapter.** The exercise explicitly calls for a SPA application, but I went with a config that pre-renders multiple pages instead. A “true” SPA should be possible [with a few tweaks][sveltekit-spa], but it doesn’t bring any benefits here.

- **Simple HTML5 validation**, which seems enough for simple forms like this one. Validation messages are displayed as custom elements matching the application style.

- **Request mocking** with [Mock Service Worker][msw]. It might be an overkill for such a simple case, but it’s more useful on real world projects (e.g. for local development or running E2E tests).

- **`localStorage` for saving the token.** Cookies would probably be more appropriate (Lucia Auth has [a nice guide][lucia-cookies] on implementing that in full stack JS apps), and it should be possible to mock it with MSW, but it’s rather pointless with the pre-rendered application, and it’s too much of a pain to set it up with SvelteKit in this configuration. I suppose it’s not the point of the exercise, so I’ve decided to leave it as is.

[sveltekit-spa]: https://svelte.dev/docs/kit/adapter-static#spa-mode-add-fallback-page
[msw]: https://mswjs.io/
[lucia-cookies]: https://lucia-auth.com/sessions/cookies/
