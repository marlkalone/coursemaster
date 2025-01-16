# Course Master

Este projeto consiste em um sistema de gerenciamento de cursos, permitindo:
- Cadastro de usuários
- Cadastro de cursos
- Matrícula de usuários em cursos
- Consultas de usuários, cursos e matrículas

É implementado em **NestJS** e **Prisma** usando **PostgreSQL** como banco de dados e docker para execução (opcional).

---

## Índice

1. [Requisitos de Ambiente](#requisitos-de-ambiente)  
2. [Instruções para Execução](#instruções-para-execução)  
   1. [Execução via Docker Compose](#execução-via-docker-compose)  
   2. [Configuração Manual do Banco de Dados (Sem Docker Compose)](#configuração-manual-do-banco-de-dados-sem-docker-compose)  
   3. [Instalação de Dependências](#instalação-de-dependências)  
   4. [Executando o Projeto (Manual)](#executando-o-projeto-manual)  
   5. [Rodando Testes](#rodando-testes)  
3. [Estrutura de Pastas](#estrutura-de-pastas)  
4. [Descrição das APIs](#descrição-das-apis)  
   - [POST /users](#post-users)  
   - [GET /users](#get-users)  
   - [GET /usersid](#get-usersid)  
   - [POST /courses](#post-courses)  
   - [GET /courses](#get-courses)  
   - [POST /enrollments](#post-enrollments)  
   - [GET /enrollmentsuserId](#get-enrollmentsuserid)  
5. [Escolhas Técnicas](#escolhas-técnicas)

---

## Requisitos de Ambiente

- **Node.js** v18+  
- **npm** ou **yarn**  
- **PostgreSQL** 13+ (caso não utilize o Docker Compose)  
- **Docker** e **docker-compose** (caso vá utilizar a orquestração via contêiner)

---

## Instruções para Execução

### Execução via Docker Compose

Caso queira rodar tudo (banco de dados e API) via contêineres Docker:

1. **Instale** Docker e docker-compose em sua máquina (caso ainda não tenha).
2. No diretório do projeto, rode:
   ```bash
   docker-compose up --build
   ```

Isso fará o build da imagem da API (usando o Dockerfile presente) e subirá dois contêineres:
- db (baseado em postgres:15)
- api (nossa aplicação NestJS)
3. A aplicação NestJS, por padrão, ficará disponível em http://localhost:3000.
4. Para parar a execução:
```bash
docker-compose down
```

### Observação:
No docker-compose.yml, a variável de ambiente DATABASE_URL já foi configurada como postgresql://admin:admin@db:5432/coursemaster.
O serviço db mapeia a porta 5432 local para 5432 do contêiner, e a api mapeia 3000 local para 3000 do contêiner.

---

### Configuração Manual do Banco de Dados (Sem Docker Compose)
Se você não quiser usar Docker Compose e preferir configurar o PostgreSQL por conta própria:

1. Crie um banco de dados no PostgreSQL (por exemplo, **coursemaster**).
2. Ajuste a variável de ambiente DATABASE_URL no formato:
```bash
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<dbname>"
```

3. Certifique-se de que o serviço do PostgreSQL está rodando localmente ou remotamente, conforme configurado.

### Instalação de Dependências
No diretório raiz do projeto, rode:
```bash
npm install
```
ou

```bash
yarn install
```

### Executando o Projeto (Manual)
1. Configurar .env
Crie um arquivo .env na raiz contendo, no mínimo:
```bash
DATABASE_URL="postgresql://admin:admin@localhost:5432/coursemaster"
```

2. Executar Migrations
```bash
npx prisma migrate dev --name init
```
Isso cria (ou atualiza) as tabelas no banco de dados.

3. Rodar a aplicação

Modo desenvolvimento (com live reload):
```bash
npm run dev
```
Modo produção (após build):
```bash
npm run build
npm run start:prod
```

A API estará acessível (por padrão) em http://localhost:3000.

## Rodando Testes
Para rodar todos os testes unitários, use:

```bash
npm run test
```
Você também pode rodar um teste específico passando o caminho:

```bash
npm run test user.service.spec.ts
```

## Estrutura de Pastas
```
.
├── src
│   ├── core
│   │   ├── user
│   │   │   ├── dto
│   │   │   ├── entities
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── test
│   │   ├── course
│   │   │   ├── dto
│   │   │   ├── entities
│   │   │   ├── course.controller.ts
│   │   │   ├── course.service.ts
│   │   │   └── test
│   │   ├── enrollment
│   │   │   ├── dto
│   │   │   ├── entities
│   │   │   ├── enrollment.controller.ts
│   │   │   ├── enrollment.service.ts
│   │   │   └── test
│   ├── prisma
│   │   └── prisma.service.ts
│   ├── utils
│   │   └── convertDateToTimeZone.ts
│   └── main.ts
├── prisma
│   └── schema.prisma
├── test (opcional: se preferir agrupar testes num só lugar)
├── Dockerfile (opcional)
├── docker-compose.yml (opcional)
├── package.json
├── tsconfig.json
└── README.md
```
## Descrição das rotas da API
É possível enviar o cabeçalho timezone (por exemplo, "America/Sao_Paulo") para ajustar as datas retornadas.

### **POST /users**
Descrição: Cria um novo usuário com nome, email, senha e registra o horário de criação.
Body:
```json
{
  "name": "Karl Malone",
  "email": "karl@example.com",
  "password": "123456"
}
```
**Exemplo de Resposta (201 Created):**
```json
{
  "usuario": 1,
  "email": "karl@example.com",
  "criado_em": "2025-01-16T09:40:18-03:00"
}
```

### **GET /users**
Descrição: Retorna todos os usuários cadastrados, com datas ajustadas ao fuso horário.

Exemplo de requisição:
```json
GET /users/1
Headers: { "timezone": "America/Sao_Paulo" }
```
Exemplo de Resposta (200 OK):
```json
[
  {
    "id": 1,
    "name": "Karl Malone",
    "email": "karl@example.com",
    "password": "$2b$10$...",
    "created_at": "2025-01-16T09:40:18-03:00"
  }
]
```