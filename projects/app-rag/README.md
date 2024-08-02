D1:

```bash
npm exec wrangler d1 create database-rag-app
npm exec wrangler d1 execute database-rag-app -- --remote --command "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL)"
```

Vectorize:

```bash
npm exec wrangler vectorize create index-vectorize-rag-app -- --dimensions=768 --metric=cosine
```
