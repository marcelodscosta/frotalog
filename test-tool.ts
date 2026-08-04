import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { env } from './src/env';

async function run() {
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-latest',
    tools: [{
        functionDeclarations: [{
            name: "getWeather",
            description: "Get the weather",
            parameters: {
                type: SchemaType.OBJECT,
                properties: {
                    location: { type: SchemaType.STRING, description: "Location" }
                }
            }
        }]
    }]
  });

  try {
    const chat = model.startChat({});
    console.log("sending prompt...");
    let result = await chat.sendMessage("What is the weather in Paris?");
    console.log("got response with calls?", result.response.functionCalls());

    const calls = result.response.functionCalls();
    if (calls && calls.length > 0) {
        // Option 1: use chat.sendMessage (which uses role='function')
        try {
            console.log("sending function response via chat.sendMessage...");
            await chat.sendMessage([{
                functionResponse: {
                    name: "getWeather",
                    response: { temperature: 25, condition: "Sunny" }
                }
            }]);
        } catch(e) {
            console.error("Option 1 failed:", e.message);
            // Option 2: use model.generateContent directly with role='user'
            try {
                console.log("sending function response via generateContent with role: 'user'...");
                let contents = await chat.getHistory();
                contents.push({
                    role: 'user',
                    parts: [{
                        functionResponse: {
                            name: "getWeather",
                            response: { temperature: 25, condition: "Sunny" }
                        }
                    }]
                });
                const res = await model.generateContent({ contents });
                console.log("Option 2 success:", res.response.text());
            } catch(e2) {
                console.error("Option 2 failed:", e2.message);
            }
        }
    }
  } catch(e) {
    console.error("Init failed:", e);
  }
}
run();
