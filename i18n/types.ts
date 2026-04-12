export type Language = 'en' | 'zh';

export interface Translations {
  app: {
    title: string;
    description: string;
  };
  language: {
    switchTo: string;
    current: string;
    english: string;
    chinese: string;
  };
  nav: {
    home: string;
  };
}

export const en: Translations = {
  app: {
    title: 'DAO Payment',
    description: 'Web3 DAO Payment Application',
  },
  language: {
    switchTo: 'Switch Language',
    current: 'Current Language',
    english: 'English',
    chinese: '中文',
  },
  nav: {
    home: 'Home',
  },
};

export const zh: Translations = {
  app: {
    title: 'DAO 支付',
    description: 'Web3 DAO 支付应用',
  },
  language: {
    switchTo: '切换语言',
    current: '当前语言',
    english: '英文',
    chinese: '中文',
  },
  nav: {
    home: '首页',
  },
};
