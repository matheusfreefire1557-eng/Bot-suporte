const { Client, GatewayIntentBits } = require('discord.js');
const admin = require('firebase-admin');

// Inicializa o Firebase Admin com a chave de segurança local
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Inicializa o Bot do Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Bot conectado com sucesso como ${client.user.tag}!`);
});

// Exemplo de escuta de mensagens do Discord para salvar no Firestore (se precisar)
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    // Exemplo de como você pode salvar uma mensagem no Firestore na coleção 'chats'
    await db.collection('chats').add({
      texto: message.content,
      autor: message.author.tag,
      criadoEm: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Mensagem salva no Firestore com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar no Firestore:', error);
  }
});

// Insira o token do seu bot abaixo entre as aspas
client.login('COLE_SEU_TOKEN_DO_DISCORD_AQUI');