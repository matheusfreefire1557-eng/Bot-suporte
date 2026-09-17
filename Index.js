const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// Configuração do Servidor HTTP simples para o Render não derrubar o bot por timeout
const app = express();
app.get('/', (req, res) => {
    res.send('Bot do Discord rodando 100% online!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor HTTP rodando na porta ${PORT}`);
});

// Inicialização do Bot do Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Evento quando o bot estiver pronto
client.once('ready', () => {
    console.log(`Bot conectado com sucesso como: ${client.user.tag}`);
});

// Evento para ler as mensagens e responder ao comando !responder
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Comando: !responder <ID> <Texto>
    if (message.content.startsWith('!responder')) {
        const args = message.content.slice('!responder'.length).trim().split(/ +/);
        const idAtendimento = args.shift();
        const respostaTexto = args.join(' ');

        if (!idAtendimento || !respostaTexto) {
            return message.reply('Uso correto: `!responder <ID_CLIENTE> <Sua Resposta>`');
        }

        // Aqui você pode adicionar a lógica de integração com o banco ou enviar a confirmação
        message.reply(`✅ Comando recebido! ID do cliente: \`${idAtendimento}\` | Resposta: "${respostaTexto}"`);
    }
});

// Login do bot utilizando o token fornecido
const TOKEN = process.env.DISCORD_TOKEN || "MTU0OTYyNTc4NjcxMjA2NDEwMA.Gv1LtR.gwDuw6HyETksP4R6GSXJG2QhRirxYW1qPiTQrw";

client.login(TOKEN).catch(err => {
    console.error('Erro ao fazer login no Discord. Verifique se o token é válido ou se a Intent "Message Content" está ativada no Portal do Desenvolvedor:', err);
});
