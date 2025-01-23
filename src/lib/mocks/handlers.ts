import { http, HttpResponse, type RequestHandler } from "msw";

export const handlers: RequestHandler[] = [
	http.post("/api/auth", async ({ request }) => {
		const data = await request.formData();
		const email = data.get("email") as string;

		await new Promise((resolve) => setTimeout(resolve, 1000));

		switch (email.split("@", 1)[0]) {
			case "alice":
			case "bob":
				return HttpResponse.json({
					token: email,
				});

			case "slow":
				await new Promise((resolve) => setTimeout(resolve, 5000));
				return HttpResponse.json({
					token: email,
				});

			case "fail":
				return HttpResponse.error();
		}

		return HttpResponse.json({ error: "Wrong username or password. (try alice@x)" }, { status: 401 });
	}),
];
