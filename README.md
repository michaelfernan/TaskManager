# 📌 Projeto  — CRUD de Tarefas (Angular + NestJS + MongoDB + Docker)

Este projeto é um **teste técnico** completo com arquitetura full stack usando:

- **Frontend:** Angular 17 (SPA com formulários e componentes standalone)
- **Backend:** NestJS (REST + GraphQL + Swagger)
- **Banco de dados:** MongoDB (via TypeORM e Mongoose Driver)
- **Infraestrutura:** Docker + Docker Compose (um comando para subir tudo)

---

## 🚀 Subir o projeto com Docker

> Requer: [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/)

### 1️⃣ Clonar o repositório
```bash
git clone git@github.com:michaelfernan/TaskManager.git
cd TaskManager
```


```
⚙️ **Pré-requisitos**
- Docker instalado  
- Docker em execução (`docker ps` deve funcionar sem erro)

### 🚀 Subir os containers
```bash
docker compose up -d --build

```

### 3️⃣ Acessar os serviços
| Serviço | Porta | URL |
|----------|--------|-----|
| Frontend (Angular) | 4200 | http://localhost:4200 |
| GraphQL Playground | 3000 | http://localhost:3000/graphql |
| Swagger API Docs | 3000 |http://localhost:3000/api/docs#/ |
| Mongo Express | 8081 | http://localhost:8081 |

### 4️⃣ Encerrar containers
```bash
docker compose down
```

---

## ⚙️ Estrutura do projeto

```
.
├── docker-compose.yml
├── docker/
│   └── init-mongo.js
├── task/                  # Backend NestJS
│   ├── src/
│   │   ├── tasks/
│   │   │   ├── task.controller.ts
│   │   │   ├── task.dto.ts
│   │   │   ├── task.entity.ts
│   │   │   ├── task.resolver.ts
│   │   │   ├── task.service.ts
│   │   │   └── tasks.module.ts
│   │   └── common/mongo-id.scalar.ts
│   └── Dockerfile
└── frontend/              # Frontend Angular
    ├── src/app/
    │   ├── features/tasks/
    │   │   ├── task-list.component.*
    │   │   ├── task-form.component.*
    │   │   └── task.service.ts
    │   ├── core/toast.service.ts
    │   └── shared/toast/toast.component.*
    └── Dockerfile
```

---

## 🧩 Banco de dados (MongoDB)

O script de inicialização `docker/init-mongo.js`:
- Cria o banco `tizaa`
- Cria o usuário `tizaa_user` com senha `tizaa_pass`
- Cria a coleção `usermongooses` com índice único em `email`

Conexão padrão usada pelo backend:
```
mongodb://tizaa_user:tizaa_pass@mongodb:27017/tizaa
```

> ⚠️ Se precisar reinicializar o banco e rodar o script novamente:
```bash
docker compose down -v
docker compose up -d
```

---

## 🧪 Testes rápidos

### Criar tarefa (REST)
```bash
curl -X POST http://localhost:3000/tasks   -H "Content-Type: application/json"   -d '{"title":"Primeira tarefa","description":"Teste","priority":"HIGH"}'
```

### Listar tarefas
```bash
curl http://localhost:3000/tasks
```

### GraphQL exemplo
```graphql
mutation {
  createTask(input:{ title:"Tarefa GQL", description:"Exemplo", priority:MEDIUM }) {
    id title done createdAt
  }
}
```

---

## 🧠 Troubleshooting

- **Swagger 404** → verifique se `SwaggerModule.setup('api', app, document)` existe no `main.ts`
- **CORS** → habilite `app.enableCors({ origin: 'http://localhost:4200' })` no NestJS
- **Hot reload travando no Docker** → verifique `CHOKIDAR_USEPOLLING="true"` e `--poll 2000`
- **Init Mongo não roda** → use `docker compose down -v` para resetar volumes

---

## ✅ Checklist

| Item | Status |
|------|--------|
| Angular frontend funcional | ✅ |
| NestJS backend com CRUD | ✅ |
| GraphQL (Resolver + Schema) | ✅ |
| Swagger documentado | ✅ |
| MongoDB com TypeORM | ✅ |
| Docker Compose funcional | ✅ |
| Toasts e UX responsiva | ✅ |

---

**Autor:** Michael Fernandes  
**Cidade:** Petrópolis / RJ  
**Data:** Novembro 2025
