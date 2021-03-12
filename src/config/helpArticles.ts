const KB_URL = 'https://support.mycrypto.com';

export enum KB_HELP_ARTICLE {
  HOW_TO_BACKUP = 'how-to/backup-restore/how-to-save-back-up-your-wallet'
}

export const getKBHelpArticle = (article: KB_HELP_ARTICLE) => `${KB_URL}/${article}`;
