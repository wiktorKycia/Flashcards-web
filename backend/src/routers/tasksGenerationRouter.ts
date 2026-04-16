import OpenAI from "openai";
import dotenv from "dotenv"
dotenv.config({path: '.env.app'})

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1-nano";

const system_message = "Your job is to create tasks for english setbooks." + 
"You will be given a word. You have to create a sentence, that would normally contain that word. " +
"Replace the word with a gap, so the student will have to guess it. " +
"For example: The given word is \"downhill\". " + 
"The sentence should then look something like: \"The punctuality of the train service has been going _____ since the beginning of this year.\" ." +
"Second example: The given word is \"unjustified\". " +
"The ouput sentence: \"Her anger at his comment was completely ________, given the explanation he had offered.\" ." +
"You can think of any sentence, that was only the example. Remember that your answer should contain only the sentence with the gap marked as underscores."

const user_message = "overcome"

async function sendAIRequest(systemMessage: string, userMessage: Record<string, any>) {
    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const response = await client.chat.completions.create({
        messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: JSON.stringify(userMessage) }
        ],
        model: model
    })

    const content = response.choices?.[0]?.message?.content

    if (!content) {
        throw new Error("AI returned empty response")
    }

    return content
}

