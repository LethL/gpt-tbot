import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { code } from 'telegraf/format';
import config from 'config';
import { oggConverter } from './components/OggConverter/OggConverter.js';
import { openAi } from './components/OpenAi/OpenAi.js';
import { roles } from './constans/constans.js';

const bot = new Telegraf(config.get('TELEGRAMM_TOKEN'));

bot.on(message('voice'), async (context) => {
  try {
    await context.reply(code('Cообщение принял, жду ответ от сервера ...'));

    const voiceFileLink = await context.telegram.getFileLink(context.message.voice.file_id);
    const userId = String(context.message.from.id);
    const oggPath = await oggConverter.create(voiceFileLink.href, userId);
    const mp3Path = await oggConverter.toMp3(oggPath, userId);
    const text = await openAi.transcription(mp3Path);

    await context.reply(code(`Ваш запрос: ${text}`));

    const messages = [{ role: roles.USER, content: text }];
    const response = await openAi.chat(messages);

    await context.reply(response.content);
  } catch (e) {
    console.log('Error voice message', e.message);
  }
});

bot.command('start', async (context) => {
  await context.reply(JSON.stringify(context.message));
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
