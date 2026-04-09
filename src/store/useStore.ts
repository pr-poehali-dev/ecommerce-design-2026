import { useState, useCallback } from 'react';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  icon: string;
  description: string;
  features: string[];
  isNew?: boolean;
  isHit?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  orders: Order[];
}

export interface Order {
  id: string;
  date: string;
  items: { name: string; price: number; icon: string }[];
  total: number;
  status: 'completed' | 'processing';
}

export const PRODUCTS: Product[] = [
  {
    id: 1, name: 'Adobe Creative Cloud', category: 'Дизайн',
    price: 2490, oldPrice: 4990, rating: 4.9, reviews: 1284,
    badge: 'Хит', icon: '🎨', isHit: true,
    description: 'Полный пакет творческих инструментов Adobe. Photoshop, Illustrator, Premiere Pro и ещё 20+ приложений.',
    features: ['12 месяцев доступа', '100 ГБ облачного хранилища', 'Мгновенная активация', 'Все платформы'],
  },
  {
    id: 2, name: 'Microsoft Office 365', category: 'Офис',
    price: 1490, oldPrice: 2990, rating: 4.8, reviews: 3421,
    badge: 'Скидка 50%', icon: '📊', isHit: true,
    description: 'Word, Excel, PowerPoint, Outlook и Teams. Подписка на 1 год для 5 устройств.',
    features: ['5 устройств', '1 ТБ OneDrive', '12 месяцев', 'Авто-обновления'],
  },
  {
    id: 3, name: 'Антивирус Kaspersky', category: 'Безопасность',
    price: 890, oldPrice: 1790, rating: 4.7, reviews: 892,
    icon: '🛡️', isNew: true,
    description: 'Полная защита от вирусов, фишинга и онлайн-угроз. Kaspersky Total Security 2026.',
    features: ['3 устройства', '365 дней защиты', 'VPN включён', 'Менеджер паролей'],
  },
  {
    id: 4, name: 'Windows 11 Pro', category: 'Системы',
    price: 3290, oldPrice: 5990, rating: 4.9, reviews: 5672,
    badge: 'Лицензия', icon: '💻', isHit: true,
    description: 'Лицензионный ключ Windows 11 Professional. Вечная лицензия, мгновенная активация.',
    features: ['Вечная лицензия', '1 ПК', 'Обновления навсегда', 'Поддержка 24/7'],
  },
  {
    id: 5, name: 'Notion Pro (1 год)', category: 'Продуктивность',
    price: 1290, oldPrice: 2400, rating: 4.6, reviews: 445,
    icon: '📝', isNew: true,
    description: 'Умный органайзер и база знаний. Неограниченные страницы, командная работа.',
    features: ['ИИ-ассистент', 'Неограниченное хранилище', 'До 10 гостей', 'Все шаблоны'],
  },
  {
    id: 6, name: 'Figma Professional', category: 'Дизайн',
    price: 1890, oldPrice: 3600, rating: 4.8, reviews: 672,
    badge: 'Новинка', icon: '✏️', isNew: true,
    description: 'Профессиональный инструмент UI/UX дизайна. Прототипирование, командная работа.',
    features: ['Безлимитные проекты', '3 редактора', 'Dev Mode', 'Все плагины'],
  },
  {
    id: 7, name: 'Spotify Premium', category: 'Медиа',
    price: 490, oldPrice: 990, rating: 4.7, reviews: 2341,
    icon: '🎵',
    description: 'Музыка без рекламы, офлайн-режим, высокое качество звука. На 6 месяцев.',
    features: ['6 месяцев', 'Без рекламы', 'Офлайн-режим', 'HiFi качество'],
  },
  {
    id: 8, name: 'ChatGPT Plus', category: 'ИИ',
    price: 1990, rating: 4.9, reviews: 1876,
    badge: 'Популярное', icon: '🤖', isHit: true,
    description: 'GPT-4o, DALL-E 3, Sora и последние модели OpenAI. Подписка на 1 месяц.',
    features: ['GPT-4o', 'DALL-E 3 включён', 'Приоритетный доступ', '1 месяц'],
  },
];

export const CATEGORIES = [
  { name: 'Все', icon: '⚡', count: PRODUCTS.length },
  { name: 'Дизайн', icon: '🎨', count: 2 },
  { name: 'Офис', icon: '📊', count: 1 },
  { name: 'Безопасность', icon: '🛡️', count: 1 },
  { name: 'Системы', icon: '💻', count: 1 },
  { name: 'Продуктивность', icon: '📝', count: 1 },
  { name: 'Медиа', icon: '🎵', count: 1 },
  { name: 'ИИ', icon: '🤖', count: 1 },
];

export const MOCK_USER: User = {
  id: 1,
  name: 'Алексей Смирнов',
  email: 'a.smirnov@gmail.com',
  avatar: 'АС',
  orders: [
    {
      id: 'DS-2026-0042',
      date: '08 апреля 2026',
      items: [
        { name: 'Adobe Creative Cloud', price: 2490, icon: '🎨' },
        { name: 'ChatGPT Plus', price: 1990, icon: '🤖' },
      ],
      total: 4480,
      status: 'completed',
    },
    {
      id: 'DS-2026-0035',
      date: '02 апреля 2026',
      items: [
        { name: 'Microsoft Office 365', price: 1490, icon: '📊' },
      ],
      total: 1490,
      status: 'completed',
    },
    {
      id: 'DS-2026-0028',
      date: '25 марта 2026',
      items: [
        { name: 'Windows 11 Pro', price: 3290, icon: '💻' },
        { name: 'Антивирус Kaspersky', price: 890, icon: '🛡️' },
      ],
      total: 4180,
      status: 'completed',
    },
  ],
};

export function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU') + ' ₽';
}
