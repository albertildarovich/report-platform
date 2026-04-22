# Report Platform Prototype

Прототип платформы для асинхронной генерации отчётов с веб-интерфейсом.

## Обзор

Платформа позволяет быстро добавлять новые отчёты, запускать их генерацию асинхронно и получать результаты в различных форматах (XLSX, PDF). Реализованы два примера отчётов для демонстрации паттерна добавления.

## Технологии

- **Backend**: Node.js + TypeScript, Express, Prisma (PostgreSQL), Bull (Redis) для очередей
- **Frontend**: React + TypeScript, React Router, Axios
- **Инфраструктура**: Docker Compose (PostgreSQL, Redis, Nginx)
- **Мониторинг**: Bull Board для просмотра очередей

## Архитектура

Подробное описание архитектуры см. в [ARCHITECTURE.md](ARCHITECTURE.md).

## Быстрый старт

### Требования

- Docker и Docker Compose
- Node.js 20+ (опционально, для локальной разработки)

### Запуск полного стека (бэкенд + фронтенд в Docker)

1. Клонируйте репозиторий:
   ```bash
   git clone <repo-url>
   cd report-platform
   ```

2. Запустите все сервисы одной командой:
   ```bash
   docker-compose up --build
   ```

3. Откройте в браузере:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **Bull Board (очереди)**: http://localhost:3001/admin/queues

4. Для остановки:
   ```bash
   docker-compose down
   ```

### Разработка с бэкендом в Docker и фронтендом локально

Для более удобной разработки фронтенда можно запустить бэкенд и инфраструктуру (PostgreSQL, Redis) в Docker, а фронтенд — локально с hot‑reload.

1. Запустите бэкенд и инфраструктуру:
   ```bash
   docker-compose -f docker-compose.backend.yml up -d
   ```

2. Убедитесь, что бэкенд работает:
   ```bash
   curl http://localhost:3001/health
   # Должен вернуть {"status":"ok", ...}
   ```

3. Перейдите в папку фронтенда и установите зависимости (если ещё не установлены):
   ```bash
   cd frontend
   npm install
   ```

4. Запустите фронтенд локально:
   ```bash
   npm start
   ```
   Фронтенд будет доступен на http://localhost:3000 и автоматически подключится к бэкенду на localhost:3001.

5. Для остановки бэкенда и инфраструктуры:
   ```bash
   docker-compose -f docker-compose.backend.yml down
   ```

> **Примечание:** Фронтенд использует переменную окружения `REACT_APP_API_URL=http://localhost:3001/api`. Она уже настроена в файле `frontend/.env.local`. При необходимости вы можете изменить её.

## Использование

1. **Просмотр сгенерированных отчётов**: На главной странице "Reports" отображается таблица всех запусков генерации (история). Каждая строка содержит статус, время начала, завершения и кнопку скачивания.
2. **Запуск генерации нового отчёта**: Нажмите кнопку "+ New Report" в верхней панели, выберите шаблон отчёта из списка и нажмите "Generate". Запуск появится в таблице.
3. **Мониторинг выполнения**: Статус каждого запуска обновляется автоматически (PENDING → PROCESSING → COMPLETED/FAILED). Таблица обновляется каждые 5 секунд.
4. **Скачивание результата**: После завершения (статус COMPLETED) в строке запуска появится кнопка Download.

## API Endpoints

- `GET /api/report-templates` – список шаблонов отчётов
- `POST /api/report-templates/:id/generate` – запуск генерации отчёта из шаблона
- `GET /api/reports` – список сгенерированных отчётов
- `GET /api/reports/:id/status` – статус конкретного отчёта
- `GET /api/reports/:id/download` – скачивание результата

## Разработка

### Локальная разработка (без Docker)

1. Установите зависимости:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Запустите PostgreSQL и Redis (например, через Docker):
   ```bash
   docker run -d -p 5432:5432 -e POSTGRES_DB=reportdb -e POSTGRES_USER=reportuser -e POSTGRES_PASSWORD=reportpass postgres:15
   docker run -d -p 6379:6379 redis:7
   ```

3. Примените миграции Prisma:
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed
   ```

4. Запустите backend:
   ```bash
   npm run dev
   ```

5. В другом терминале запустите frontend:
   ```bash
   cd frontend
   npm start
   ```

### Добавление нового отчёта

Подробная инструкция для разработчика находится в [ARCHITECTURE.md](ARCHITECTURE.md#как-добавить-новый-отчёт).

## Лицензия

MIT