import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import config from 'config';

const bot = new Telegraf(config.get('TELEGRAMM_TOKEN'));

bot.on(message('voice'), async (context) => {
  try {
    const voiceFileLink = await context.telegram.getFileLink(context.message.voice.file_id);
    await context.reply(JSON.stringify(voiceFileLink));
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
