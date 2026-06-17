#!/usr/bin/env bash
#
# Деплой/оновлення додатка на сервері (Hetzner VPS).
# Запускати НА СЕРВЕРІ з кореня проєкту:  ./deploy.sh
#
# Робить: git pull -> npm install -> npm run build -> pm2 reload
# Налаштування первинного оточення — див. DEPLOY.md
#
set -euo pipefail

APP_NAME="minecraftsgame"
BRANCH="${DEPLOY_BRANCH:-main}"

# Перейти в каталог скрипта (корінь проєкту), де б його не викликали
cd "$(dirname "$0")"

echo "==> [1/4] Забираю свіжий код (origin/$BRANCH)..."
git fetch origin "$BRANCH"
# Жорстко вирівнюємо до remote. УВАГА: локальні зміни на сервері будуть стерті.
git reset --hard "origin/$BRANCH"

echo "==> [2/4] Встановлюю залежності (npm install)..."
# npm install (а не npm ci): package-lock.json згенеровано на Windows і не містить
# Linux-специфічних optional-залежностей (напр. @emnapi/core), через що npm ci падає.
npm install --no-audit --no-fund

echo "==> [3/4] Збираю продакшн-білд..."
npm run build

echo "==> [4/4] Перезапускаю через pm2..."
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 reload "$APP_NAME" --update-env
else
  pm2 start npm --name "$APP_NAME" -- start
  pm2 save
fi

echo ""
echo "==> Готово. Стан:"
pm2 status "$APP_NAME"
