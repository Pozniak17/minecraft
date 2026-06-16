# Деплой на Hetzner (VPS, Ubuntu) через SSH

Покрокова інструкція для цього проєкту (Next.js 16, React 19, npm).
Один раз робиш **первинне налаштування** (розділи 1–8), далі оновлюєш у одну команду через `deploy.sh` (розділ 9).

> Усе нижче виконується **на сервері** через SSH, якщо не вказано інше.
> Заміни плейсхолдери: `<SERVER_IP>`, `<your-domain.com>`, `<git-repo-url>`.

---

## 0. Під’єднатися до сервера

З власного комп’ютера:

```bash
ssh root@<SERVER_IP>
```

(Пароль/ключ Hetzner надсилає на пошту при створенні сервера.)

---

## 1. Базова безпека: окремий користувач + фаєрвол

Працювати постійно під `root` не варто.

```bash
# створити користувача (задай пароль)
adduser deploy
usermod -aG sudo deploy

# фаєрвол: лишаємо тільки SSH, HTTP, HTTPS
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable
```

Далі заходь під новим користувачем:

```bash
ssh deploy@<SERVER_IP>
```

> Рекомендовано налаштувати вхід по SSH-ключу замість пароля (`ssh-copy-id deploy@<SERVER_IP>` з твого комп’ютера).

---

## 2. Встановити Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# перевірка
node -v   # очікуємо v20.x
npm -v
```

---

## 3. Встановити pm2, nginx, certbot

```bash
# pm2 — тримає додаток живим і піднімає після ребуту
sudo npm install -g pm2

# nginx — приймає трафік на 80/443 і віддає на наш Next (localhost:3000)
sudo apt-get install -y nginx

# certbot — безкоштовний HTTPS (Let's Encrypt)
sudo apt-get install -y certbot python3-certbot-nginx
```

---

## 4. Забрати код

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone <git-repo-url> minecraft
cd minecraft
```

> Якщо репозиторій приватний — налаштуй deploy key або заходь по HTTPS-токену.

---

## 5. Створити `.env.local` на сервері (КРИТИЧНО)

Файл `.env.local` **не їде з git** (він у `.gitignore`), тож його треба створити вручну:

```bash
cd /var/www/minecraft
nano .env.local
```

Вміст (підстав реальні значення):

```env
SEON_LICENSE_KEY=345aa55a-72f5-4824-8a64-e877d1f3026e
SEON_MERCHANT_ID=frontstore_reg
# за потреби перевизначити бекенд:
# BACKEND_API_URL=https://api.minecraftsgame.com/api/v1
```

> Без `SEON_LICENSE_KEY` антифрод просто вимкнеться (fail-open: реєстрація працюватиме, але без перевірки на ботів).

---

## 6. Збірка та перший запуск

```bash
cd /var/www/minecraft
npm ci            # чиста установка залежностей за package-lock.json
npm run build     # продакшн-білд (HMR не використовується, баг Turbopack з dev тут не виникає)

# запустити через pm2 (next start слухає порт 3000)
pm2 start npm --name minecraft -- start
pm2 save                       # запам’ятати список процесів
pm2 startup                    # вивести команду автозапуску після ребуту — виконай те, що підкаже
```

Перевірка локально на сервері:

```bash
curl -I http://localhost:3000   # очікуємо HTTP/1.1 200
```

---

## 7. Nginx як reverse proxy

```bash
sudo nano /etc/nginx/sites-available/minecraft
```

Вміст:

```nginx
server {
    listen 80;
    server_name <your-domain.com> www.<your-domain.com>;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

> `X-Forwarded-For` тут важливий — саме з нього наш роут `/api/auth/register` бере IP користувача для перевірки в SEON.

Увімкнути сайт і перезавантажити nginx:

```bash
sudo ln -s /etc/nginx/sites-available/minecraft /etc/nginx/sites-enabled/
sudo nginx -t          # перевірка конфігу
sudo systemctl reload nginx
```

---

## 8. HTTPS (SSL)

Спочатку наведи A-запис домену на `<SERVER_IP>` у DNS. Коли резолвиться — постав сертифікат:

```bash
sudo certbot --nginx -d <your-domain.com> -d www.<your-domain.com>
```

Certbot сам пропише HTTPS у nginx і налаштує автопродовження.

---

## 9. Оновлення (щоразу після змін у коді)

Деплой-скрипт уже в репозиторії — `deploy.sh`. Просто:

```bash
cd /var/www/minecraft
./deploy.sh
```

Він зробить: `git pull` → `npm ci` → `npm run build` → `pm2 reload`.

Перший раз зроби його виконуваним:

```bash
chmod +x deploy.sh
```

---

## Шпаргалка по командах

```bash
pm2 status                 # стан додатка
pm2 logs minecraft         # логи (помилки, запити)
pm2 reload minecraft       # перезапуск без даунтайму
pm2 restart minecraft      # повний перезапуск
sudo systemctl reload nginx
sudo certbot renew --dry-run   # перевірка автопродовження SSL
```

## Часті проблеми

- **502 Bad Gateway** — додаток не запущений або впав. Дивись `pm2 logs minecraft`.
- **Зміни env не підхопились** — після правки `.env.local` зроби `pm2 reload minecraft --update-env`.
- **Реєстрація не блокує ботів** — перевір, що `SEON_LICENSE_KEY` є у `.env.local` на сервері.
