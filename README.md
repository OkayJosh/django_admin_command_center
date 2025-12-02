# django-admin-command-center (MVP with Celery, React, DDD-ish)


- `backend/`: Django example project + `admin_command_center` reusable app
- `frontend/`: React + Vite admin UI that builds into the Django app's static files

## Quick start

1. Create and activate a virtualenv, then install backend deps:

   ```bash
   cd backend
   pip install -e .
   # or: pip install Django djangorestframework channels channels-redis celery redis
   ```

2. Run migrations and create a superuser:

   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

3. Start Redis (for Channels + Celery) and Celery worker:

   ```bash
   redis-server
   celery -A config worker -l INFO
   ```

4. Build the React frontend:

   ```bash
   cd ../frontend
   npm install
   npm run build
   ```

5. Run Django dev server:

   ```bash
   cd ../backend
   python manage.py runserver
   ```

6. Log in to Django admin as a staff user, ensure you are logged in on the same origin.

7. Open the React UI at `/static/admin_command_center/index.html` or integrate it into your admin.

## Notes

- Commands are auto-discovered on AppConfig.ready (best to also run discovery via a management command / cron).
- Executions are handled by a Celery task, which shells out to `python manage.py <command>`.
- Logs are persisted and streamed via WebSocket (`channels`).

The internal structure follows a simple hexagonal / DDD-ish split:

- `domain/` — value objects and domain concepts
- `application/` — services orchestrating use cases
- `infrastructure/` — discovery, executor, Celery tasks, WS integration
