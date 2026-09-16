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

client.once('ready', () => {
  console.log(`Bot online como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!responder')) {
    const args = message.content.split(' ');
    const clientId = args[1];
    const respostaTexto = args.slice(2).join(' ');

    if (!clientId || !respostaTexto) {
      return message.reply('Uso incorreto. Exemplo: !responder SEU_ID Olá cliente!');
    }

    try {
      await db.collection("chats").doc(clientId).collection("mensagens").add({
        remetente: "suporte",
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

client.login('MTU0OTYyNTc4NjcxMjA2NDEwMA.G60BF1.a5F4p_cfQElNv0kAerYaM_648SiAgufhtrs8T8');
