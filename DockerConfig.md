# Docker / PostgreSQL setup (HabitForge)

This repo runs **one ASP.NET Core host** (`AuthAPI.Presentation`) that serves both:
- **Auth API** (users, JWT, refresh, OTP, Google OAuth)
- **Habit API** (habits + AI endpoints) via `AddApplicationPart(...)`

The backend uses **two EF Core DbContexts**:
- `UserDbContext` (Auth) → `ConnectionStrings:DefaultConnection`
- `HabitDbContext` (Habits) → `ConnectionStrings:HabitConnection`

You can point both contexts to the **same** Postgres database, or (recommended) use **two databases** on the same Postgres server.

---

## 1) Start PostgreSQL via Docker

Run container:

    docker run -d --name HabitForgeDb ^
      -e POSTGRES_USER=admin ^
      -e POSTGRES_PASSWORD="habit123!" ^
      -e POSTGRES_DB=UserDb ^
      -p 5432:5432 ^
      -v habitforge_pg_data:/var/lib/postgresql/data ^
      postgres:15-alpine

Create Habit DB once:

    docker exec -it HabitForgeDb psql -U admin -c "CREATE DATABASE \"HabitDb\";"

Default ports:
- Postgres: `localhost:5432`

---

## 2) Connection strings

Backend config is in `backend/AuthAPI/appsettings.json`:

    "ConnectionStrings": {
      "DefaultConnection": "Host=localhost;Port=5432;Database=UserDb;Username=admin;Password=habit123!",
      "HabitConnection":   "Host=localhost;Port=5432;Database=HabitDb;Username=admin;Password=habit123!"
    }

If you prefer environment variables, create `backend/.env` (DotNetEnv loads it) and set:

    ConnectionStrings__DefaultConnection=Host=localhost;Port=5432;Database=UserDb;Username=admin;Password=habit123!
    ConnectionStrings__HabitConnection=Host=localhost;Port=5432;Database=HabitDb;Username=admin;Password=habit123!

For AI (Hugging Face), set at least:

    HuggingFace__ApiKey=hf_...

> Do NOT commit real secrets. Keep `backend/.env` local only.

---

## 3) EF Core migrations

Run from `backend/`:

### Auth DB (UserDbContext)

dotnet ef database update \
  --project ./AuthAPI.Infrastructure/AuthAPI.Infrastructure.csproj \
  --startup-project ./AuthAPI/AuthAPI.Presentation.csproj \
  --context UserDbContext

### Habit DB (HabitDbContext)

dotnet ef database update \
  --project ./Habit.Infrastructure/Habit.Infrastructure.csproj \
  --startup-project ./AuthAPI/AuthAPI.Presentation.csproj \
  --context HabitDbContext

---

## 4) Useful Postgres CLI commands (psql)

Open psql inside the container:

    docker exec -it HabitForgePg psql -U admin -d UserDb

Switch DB in psql:

    \c "HabitDb"

List tables:

    \dt

---

## 5) Stop / reset database

Stop:

    docker stop HabitForgePg

Start again:

    docker start HabitForgePg

Reset (WARNING: deletes all DB data):

    docker rm -f HabitForgePg
    docker volume rm habitforge_pg_data