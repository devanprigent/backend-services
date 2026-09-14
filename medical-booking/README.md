# Scheduling service

Empty scaffold for [../INTERVIEW_EXERCISE.md](../INTERVIEW_EXERCISE.md).

```powershell
cd medical-platform\scheduling-service
copy .env.example .env
npm install
npm run db:migrate
npm run dev
```

Set `DATABASE_URL` to your Postgres. `GET /health` should return `{ "status": "ok" }`.
