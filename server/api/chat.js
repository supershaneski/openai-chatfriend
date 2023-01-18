import { Configuration, OpenAIApi } from "openai"

const config = useRuntimeConfig()

const configuration = new Configuration({
    apiKey: config.openaiApiKey,
})

const openai = new OpenAIApi(configuration)

let chatData = ''

// Prompt description
function getPromptDescription(id) {
    
    let desc = ''

    switch(id) {
        case 'JPN1':
            desc = 'Chat with AI Friend where your AI Friend respond in cheerful, young lady, Japanese.\n\n'
            break;
        case 'ENG2':
            desc = 'Chat with AI Friend where your AI Friend respond in Shakespearean, old English.\n\n'
            break;
        case 'US3':
            desc = 'Chat with AI Friend where your AI Friend respond in cheerful, valley girl, American English.\n\n'
            break;
        case 'FIL4':
            desc = 'Chat with AI Friend where your AI Friend respond in cheerful, Taglish.\n\n'
            break;
        default:
    }

    return desc
}

export default defineEventHandler(async (event) => {

    const { message, bot, reset } = await readBody(event)

    // reset chat data
    if(reset === true) {
        chatData = ''
    }

    let prompt = getPromptDescription(bot)

    chatData += '\n'
    chatData += `You: ${message}`

    prompt += chatData

    // check token count
    const tokenPrompt = parseInt(prompt.length / 4) // we are making simple assumption that 4 chars = 1 token
    if(tokenPrompt > 1800) {

        /*
        The actual maximum number of tokens is around 2048 (new models support 4096).
        But I do not plan to hit it but put the ceiling a bit much lower then remove
        old messages after it is reached to continue chatting.
        */

        console.log("maximum!", tokenPrompt)
        
        // remove several lines from stored data
        let tmpData = chatData.split("\n").filter((d, i) => i > 20)
        chatData = tmpData.join("\n")

    }
    
    let reply = ''

    try {

        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.5,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
            stop:["You:"]
        })
    
        reply = completion.data.choices[0].text.split('AI Friend:')[1].trim()
        
    } catch(error) {

        console.log(error)

    }
    
    if(reply) {

        chatData += `\n`
        chatData += `AI Friend: ${reply}`

    }

    return {
        text: reply,
    }


})