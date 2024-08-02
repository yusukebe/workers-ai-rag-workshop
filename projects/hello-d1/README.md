```bash
npm exec wrangler d1 create database-d1-hello-world
npm exec wrangler d1 execute database-d1-hello-world -- --command "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL)"
```
