const { Client, GatewayIntentBits, Partials } = require('discord.js');
const admin = require('firebase-admin');

// Carrega as credenciais do Firebase
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Cliente configurado com todas as partições e intents necessários para leitura total
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.once('ready', () => {
    console.log(`[OK] Bot online e escutando como ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    // Linha de diagnóstico: imprime no seu terminal tudo o que o bot enxerga em tempo real
    console.log(`[MONITOR] Mensagem de ${message.author.tag}: "${message.content}"`);

    if (message.author.bot) return;

    if (message.content.startsWith('!responder')) {
        const partes = message.content.trim().split(/\s+/);
        const clienteId = partes[1]; 
        const resposta = partes.slice(2).join(' '); 

        if (!clienteId || !resposta) {
            return message.reply("❌ **Formato incorreto!** Use: `!responder cli_xxxxxxxxx Sua resposta aqui`");
        }

        try {
            await db.collection("chats").doc(clienteId).collection("historico").add({
                remetente: 'suporte',
                texto: resposta,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });

            await message.react('✅');
            console.log(`[SUCESSO] Resposta enviada ao Firestore para o cliente: ${clienteId}`);
        } catch (error) {
            console.error("[ERRO FIREBASE]:", error);
            message.reply("❌ Erro ao tentar salvar a resposta no banco de dados.");
        }
    }
});

// Seu Token Configurado
client.login('MTU0OTYyNTc4NjcxMjA2NDEwMA.GoDWcy.yjS368--NIvysU_aBO655fj65l41vc4lr4shrg');
