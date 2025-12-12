const https = require('https');

const API_KEY = "AIzaSyAS4gq7bnVBkdYH0wp8cHgiexal959dhOs";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log("Querying API for available models...");

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            if (res.statusCode !== 200) {
                console.log(`Error: Status Code ${res.statusCode}`);
                console.log("Response:", data);
                return;
            }

            const json = JSON.parse(data);
            if (json.models) {
                console.log("✅ AVAILABLE MODELS:");
                json.models.forEach(m => {
                    console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
                });
            } else {
                console.log("No models found in response.");
                console.log(json);
            }
        } catch (e) {
            console.error("Error parsing JSON:", e);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
