const { GoogleGenerativeAI } = require("@google/generative-ai");

// Hardcoded for debugging purposes as the env file parsing failed in standalone script
const API_KEY = "AIzaSyAS4gq7bnVBkdYH0wp8cHgiexal959dhOs";

const genAI = new GoogleGenerativeAI(API_KEY);

async function checkModels() {
    const candidates = [
        "gemini-1.5-flash",
        "gemini-pro",
        "gemini-1.0-pro",
        "gemini-1.5-pro",
        "gemini-1.5-flash-latest",
        "gemini-pro-vision" // Just in case
    ];

    console.log("Starting Model Check...");

    for (const modelName of candidates) {
        process.stdout.write(`Testing ${modelName} ... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say Hello");
            const response = await result.response;
            console.log(`✅ SUCCESS! (Response: ${response.text().trim()})`);
            // We found a working one!
            console.log(`\nRECOMMENDATION: Use '${modelName}'`);
            return;
        } catch (error) {
            let msg = error.message;
            if (error.status) msg = `Status ${error.status}`;
            if (msg.includes("404")) msg = "404 Not Found (Model not available)";
            console.log(`❌ FAILED: ${msg}`);
        }
    }
}

checkModels();
