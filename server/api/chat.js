import { Configuration, OpenAIApi } from "openai"

const config = useRuntimeConfig()

const configuration = new Configuration({
    apiKey: config.openaiApiKey,
})

const openai = new OpenAIApi(configuration)

let chatData = ''

export default defineEventHandler(async (event) => {

    const { message } = await readBody(event)

    let prompt = `Chat with AI Girlfriend where your AI Girlfriend respond in Japanese.\n\n`

    prompt += chatData + `\n`
    prompt += `You: ${message}`

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 60,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
        stop:["You:"]
    })

    let reply = completion.data.choices[0].text.split('AI Girlfriend:')[1].trim()
    
    chatData += '\n'
    chatData += `You: ${message}` + `\n`
    chatData += `AI Girlfriend: ${reply}`

    return {
        text: reply,
        data: completion.data.choices,
        length: completion.data.choices.length,
    }


})