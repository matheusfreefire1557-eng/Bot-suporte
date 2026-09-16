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

client.login('{
  "type": "service_account",
  "project_id": "suporte-bot-d2d44",
  "private_key_id": "89ec965e54598c4ec7d1f831f31aeeff723db536",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCsndKTvu7WUE+X\n58dUICpYsEWRXeMC9wfZ8kgltDaGbyQfO3vtrxsnpt3reoRmZHONbpWmAkKqYaae\n/bHQoU47+TNoiNpKyAnRnKka4LBtvKKhfZlE3h5Bx0/XyzylEmELjveZKBeGfyTx\noTfuS/x9CWRqimtWQC3PJKd/PwRgbvLLOYAj/iiJJp4XRg5HaTYUHeqz2AjyVQz1\ndCeBsqev0QtiG86ijOtA+IL+NkdpKdbtN7Y63YOaIkaYCCdK6Rd+JGFJ5H15fIpI\nbQvwjmq/iBjp5QYSAgK55znK+LWYVPU0ceAEFSq/BrWGoj+KDlTgk71BKgWKsHSX\neXIz8tkFAgMBAAECgf8EJyT7RhbhqF5wZkA8tHIh0wSTo3pBQLveKzYRJoTMNzHE\nYAzm32ETgbA93QBeGS9/95etvg65ofFDM26ZkI2/1/8BuTHkYILzPG690+Q8NAH7\nd+0DtVRWevrq9i0oEVqVz4N269dH9ozyzuhVNkSc1MW+bVvtjpIXNVwA0M7y4Atw\nlLY5XuYeOZWEQb4pvPl1s5TmryjwpVwaLfKVYoxeqpkR3aSs+O5zA3QjNaY4Cd5W\nKFzs86kTgI81L5jk+a3ftRR2Ei44BrDFOyGmzs0/ER3H6vvg/aasx91GkSr/4lRH\nqufZagW4FhgcgKsFcD849Z+2dBZzF0VCckw7oVECgYEA1rsbJCAMWwRaLvHpYo/6\nQZzyahtB5I0DqCiT7s2IsfZX3gyQO8yNt4526dB/4KM6mRUzk/p4WbLyYqU5yI7K\nk/XGgXhm0CGEANCSXhIuZF3cSnv4OJdx5AfmMM5Z+g6rW6ix83U8SFwSo5r7+VaF\nx/21hUiqjCneCjwS36/hIPUCgYEAzcqpiPYfs4kZDUDCTM3zKLH7fjiEfbJYxTq2\neVfvlDp3r1NGQrTZr95cEXvyRdmFlioOu5pHIxJ+VCMtYgHXcEvm4VBpnYRH4FRj\nAhmUB+iMrCLRvGuN7j3QK3wqDNfLKtDXYfAUEM3n/l6m8SLTXZNwaX5B3cMzESnC\np2YAjdECgYEAtDGHcSVDuQ1J8KMoyoEv7Oebtdbx0K1VKEQFABySXWTwD3JThxr8\nwdBXkZZZ+VSA0/2qrr89R2iXZphoiRjqfod88SDshjPZ5iUg7rgrHiZ1ujuV7UeJ\nV2YZkVNYxjKRMfW6fyceU0qQiaKBWJd25IDPVu3H0J9BqS0IWZXqQhECgYA39ziZ\n/c1rRwqgFw+AUbYiSB0MG5S0lm8b3DbJ00ddeXUZIj2GYKae9Ir3WkzuABUbXH67\nOF7GQ/5FJXfvIm8TpCC6/+JpKxNdB7YRWSFv8SdonOOLKXjk5LybRt4stfcTws4A\nXYkndMf13onqJD11Qmac2fBRvgdCUKgWXGAkMQKBgQCBSc4fSoHFy1KayTj2pnf7\nyGG82+PhKmlBsLQNgDq9uaVbi/B3OAWvGRz1jF8BId6ucbicSnIU1LvrymNWckov\nwsb9cuiciK5qPP2vD7A/fj5QRofmcEOyaiTK/0OmjPiqI2bjt6lWR/5Qs5lZ3GP1\n3q8ML9IUW7uMbv1sBZzoDQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@suporte-bot-d2d44.iam.gserviceaccount.com",
  "client_id": "100758944265734242489",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40suporte-bot-d2d44.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}');
