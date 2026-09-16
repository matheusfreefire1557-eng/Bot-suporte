const { Client, GatewayIntentBits } = require('discord.js');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on('ready', () => {
  console.log(`Bot online como ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!responder')) {
    const args = message.content.split(' ');
    const clienteId = args[1];
    const respostaTexto = args.slice(2).join(' ');

    if (!clienteId || !respostaTexto) {
      return message.reply('Uso incorreto. Exemplo: `!responder cli_abc123 Olá!`');
    }

    try {
      await db.collection("chats").doc(clienteId).collection("historico").add({
        remetente: 'suporte',
        texto: respostaTexto,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      message.react('✅');
    } catch (error) {
      console.error("Erro:", error);
      message.reply('Erro ao enviar resposta.');
    }
  }
});

client.login('1549625786712064100');
