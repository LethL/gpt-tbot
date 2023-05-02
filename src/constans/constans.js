import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const roles = {
  ASSISTANT: 'assistant',
  USER: 'user',
  SYSTEM: 'system',
};
