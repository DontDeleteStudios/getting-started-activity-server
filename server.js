import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config({ path: "./.env" }); // TODO: Remove denesting for PROD

const app = express();
const port = 3001;

// Allow express to parse JSON bodies
app.use(express.json());

app.post("/api/token", async (req, res) => {
	console.info("API token endpoint hit");

	console.info("Fetch access token");
	// Exchange the code for an access_token
	const response = await fetch(`https://discord.com/api/oauth2/token`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			client_id: process.env.VITE_DISCORD_CLIENT_ID,
			client_secret: process.env.DISCORD_CLIENT_SECRET,
			grant_type: "authorization_code",
			code: req.body.code,
		}),
	});

	console.info("Extract token from response");
	// Retrieve the access_token from the response
	const { access_token } = await response.json();

	console.info("Return access token to our client");
	// Return the access_token to our client as { access_token: "..."}
	res.send({access_token});
});

// ENDPOINT: Health check
app.get("/health", (req, res) => {
	console.info("iHealth endpoint hit");
	console.log("lHealth endpoint hit");
	res.status(200).send("such health")
});

app.listen(port, () => {
	console.info(`Server listening on port: ${port}`);
	console.log(`Server listening at http://localhost:${port}`);
});
