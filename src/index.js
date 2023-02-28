import "dotenv/config"
import { Client, IntentsBitField, messageLink } from "discord.js"
import { ChatGPTUnofficialProxyAPI } from "chatgpt"
import { start } from "repl"

async function call(input) {
    const api = new ChatGPTUnofficialProxyAPI({
        accessToken: process.env.ACCESS_TOKEN,
        /*https://web-production-2d62.up.railway.app/*/
        apiReverseProxyUrl: "https://gpt.pawan.krd/backend-api/conversation	",
        debug: false,
    })

    const res = await api.sendMessage(input)
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

    if (msg.content.includes(";ask")) {
        const prompt = msg.content.replace(";ask ", "")
        console.log(prompt)
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
})

client.login(process.env.TOKEN)
