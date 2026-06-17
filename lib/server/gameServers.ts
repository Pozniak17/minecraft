// Конфіг ігрових Minecraft-серверів (окремий бекенд на порту 7000).
// Токен статичний і має лишатися ТІЛЬКИ на сервері — ніколи не віддаємо в браузер.

export const GAME_SERVERS = {
  luckysurvival: { name: 'LuckySurvival', ip: '188.245.202.194' },
  minewars: { name: 'MineWars', ip: '94.130.231.109' },
  calmsky: { name: 'CalmSky', ip: '195.201.115.31' },
} as const;

export type GameServerKey = keyof typeof GAME_SERVERS;

export const GAME_API_PORT = 7000;

// Токен береться ТІЛЬКИ з оточення (.env.local на сервері). Без нього запит до
// ігрового API не пройде і сервер показуватиметься offline — це навмисно.
export const GAME_API_TOKEN = process.env.GAME_API_TOKEN ?? '';

// Боти не показуються в моніторингу — за ТЗ додаємо зміщення до кількості онлайн.
export const ONLINE_BOT_OFFSET = 30;
