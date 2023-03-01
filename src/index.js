import "dotenv/config"
import { Client, IntentsBitField, messageLink } from "discord.js"
import { ChatGPTUnofficialProxyAPI } from "chatgpt"

async function call(input) {
    console.log("Calling API")
    const api = new ChatGPTUnofficialProxyAPI({
        accessToken: process.env.ACCESS_TOKEN,
        /*https://web-production-2d62.up.railway.app/*/
        apiReverseProxyUrl: "https://chat.duti.tech/api/conversation",
    })

    const res = await api.sendMessage(input)
    console.log(res.text)
    return res.text
}

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
})

client.on("ready", () => {
    console.log("hello it's discord GPT!!")
})

client.on("messageCreate", async (msg) => {
    if (msg.author.bot) {
        return
    }
    try {
        if (msg.content.includes(";ask")) {
            const prompt = msg.content.replace(";ask ", "")
            msg.reply("thinking....")
            const output = await call(prompt)
            if (output.length > 2000) {
                let startIndex = 0
                let endIndex = 2000
                while (startIndex < output.length) {
                    if (endIndex >= output.length) {
                        endIndex = output.length
                    }
                    msg.reply(output.substring(startIndex, endIndex))

                    startIndex += 2000
                    endIndex += 2000
                }
            } else {
                msg.reply(output)
            }
        }
    } catch (error) {
        console.log("Sorry something went wrong, you can try again!")
    }
})

client.login(process.env.TOKEN)
