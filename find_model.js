const { GoogleGenerativeAI } = require("@google/generative-ai");

// Hardcoded API Key to avoid env parsing issues in this standalone script
const API_KEY = "AIzaSyAS4gq7bnVBkdYH0wp8cHgiexal959dhOs";

const genAI = new GoogleGenerativeAI(API_KEY);

const candidates = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-flash-latest",
    "gemini-1.5-pro-latest",
    "gemini-pro",
    "gemini-1.0-pro"
];

async function findWorkingModel() {
    console.log("🔍 Testing models via SDK...");

    for (const modelName of candidates) {
        process.stdout.write(`Testing '${modelName}'... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say 'OK'");
            const response = await result.response;
            const text = response.text();

            if (text) {
                console.log(`✅ WORKS! Response: "${text.trim()}"`);
                console.log(`\n🎉 VICTORY! valid model found: "${modelName}"`);
                console.log("Please update route.ts with this model name.");
                return;
            }
        } catch (error) {
            console.log(`❌ Failed (${error.message.split(' ')[0]} ${error.status || ''})`);
        }
    }
    console.log("\n❌ NO WORKING MODEL FOUND via SDK. Check API Key or Billing.");
}

findWorkingModel();
