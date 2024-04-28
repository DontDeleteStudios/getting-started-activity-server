import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
// import cors from "cors";

dotenv.config({ path: "./.env" }); // TODO: Remove denesting for PROD

const app = express();
const port = 3001;

// Allow express to parse JSON bodies
app.use(express.json());

// // CORS options
// const corsOptions = {
// 	origin: ["https://discordsays.com", "https://getting-started-activity-client.vercel.app", "http://localhost:3000", "http://localhost:5173"], // Replace with the allowed origins
// };
  
// Apply CORS middleware with options
// app.use(cors(corsOptions));

// Set CORS headers for all routes
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*"); // Update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	next();
})

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
	console.info("Health endpoint hit");
	res.json({ ok: true });
});

// Listen 
app.listen(port, () => {
	console.info(`Server listening on port: ${port}`);
});
