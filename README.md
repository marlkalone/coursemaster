Gerenciamento de Cursos
Este projeto consiste em um sistema de gerenciamento de cursos, permitindo:

Cadastro de usuários
Cadastro de cursos
Matrícula de usuários em cursos
Consultas de usuários, cursos e matrículas
É implementado em NestJS e Prisma usando PostgreSQL como banco de dados e o date-fns-tz para manipulação de fusos horários.

Índice
Requisitos de Ambiente
Instruções de Execução
Configuração do Banco de Dados
Instalação de Dependências
Executando o Projeto
Rodando Testes
Estrutura de Pastas
Descrição das APIs
/users
/courses
/enrollments
Escolhas Técnicas
Requisitos de Ambiente
Node.js v18+
npm ou yarn
PostgreSQL 13+
(Opcional) Docker e docker-compose (caso queira rodar banco e/ou app via contêiner)
Instruções de Execução
Configuração do Banco de Dados
Crie um banco de dados no PostgreSQL (por exemplo, coursemaster).
Ajuste a variável de ambiente DATABASE_URL no formato:
bash
Copiar
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<dbname>"
(Opcional) Caso use Docker, você pode criar um serviço do Postgres via docker-compose.
Instalação de Dependências
No diretório raiz do projeto, rode:

bash
Copiar
npm install
ou

bash
Copiar
yarn
Executando o Projeto
Configurar .env
Crie um arquivo .env na raiz contendo, no mínimo:

env
Copiar
DATABASE_URL="postgresql://admin:admin@localhost:5432/coursemaster"
E demais variáveis que julgar necessárias.

Executar Migrations

bash
Copiar
npx prisma migrate dev --name init
Isso cria (ou atualiza) as tabelas no banco de dados.

Rodar a aplicação

Modo desenvolvimento (com live reload):
bash
Copiar
npm run start:dev
Modo produção (após build):
bash
Copiar
npm run build
npm run start:prod
A API estará acessível (por padrão) em http://localhost:3000.

Rodando Testes
Para rodar todos os testes unitários, use:

bash
Copiar
npm run test
Você também pode rodar um teste específico passando o caminho:

bash
Copiar
npm run test src/core/user/test/user.service.spec.ts
Estrutura de Pastas
Exemplo simplificado (alguns arquivos suprimidos para brevidade):

bash
Copiar
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
Descrição das APIs
Abaixo, listamos os principais endpoints do sistema, seguidos de exemplos de requisição e resposta.

Observação: Ajuste os URLs conforme suas rotas atuais (por exemplo, se estiver usando prefixo /api).

/users
POST /users

Descrição: Cria um novo usuário com nome, email, senha (hash) e registra o horário de criação.
Body (JSON):
json
Copiar
{
  "name": "Karl Malone",
  "email": "karl@example.com",
  "password": "123456"
}
Exemplo de Resposta (201 Created):
json
Copiar
{
  "usuario": 1,
  "email": "karl@example.com",
  "criado_em": "2025-01-16T09:40:18-03:00"
}
GET /users

Descrição: Retorna todos os usuários cadastrados, com datas ajustadas ao fuso horário (se informado via cabeçalho timezone).
Exemplo de Resposta (200 OK):
json
Copiar
[
  {
    "id": 1,
    "name": "Karl Malone",
    "email": "karl@example.com",
    "password": "$2b$10$...",
    "created_at": "2025-01-16T09:40:18-03:00"
  },
  ...
]
GET /users/:id

Descrição: Retorna informações de um usuário específico, incluindo horário de criação ajustado ao fuso horário.
Exemplo de Resposta (200 OK):
json
Copiar
{
  "id": 1,
  "name": "Karl Malone",
  "email": "karl@example.com",
  "password": "$2b$10$...",
  "created_at": "2025-01-16T09:40:18-03:00"
}
/courses
POST /courses

Descrição: Cria um novo curso com título, descrição, horas e registra o horário de criação.
Body (JSON):
json
Copiar
{
  "title": "Node.js Avançado",
  "description": "Tópicos avançados de Node",
  "hours": 60
}
Exemplo de Resposta (201 Created):
json
Copiar
{
  "id": 2,
  "title": "Node.js Avançado",
  "description": "Tópicos avançados de Node",
  "hours": 60,
  "created_at": "2025-01-16T09:40:18-03:00"
}
GET /courses

Descrição: Lista todos os cursos cadastrados, com datas ajustadas ao fuso horário.
Exemplo de Resposta (200 OK):
json
Copiar
[
  {
    "id": 2,
    "title": "Node.js Avançado",
    "description": "Tópicos avançados de Node",
    "hours": 60,
    "created_at": "2025-01-16T09:40:18-03:00"
  },
  ...
]
/enrollments
POST /enrollments

Descrição: Matricula um usuário em um curso, registrando a data e hora da operação.
Body (JSON):
json
Copiar
{
  "user_id": 1,
  "course_id": 2
}
Exemplo de Resposta (201 Created):
json
Copiar
{
  "id": 101,
  "user_id": 1,
  "course_id": 2,
  "enrolled_at": "2025-01-16T09:50:00-03:00"
}
GET /enrollments/:userId

Descrição: Lista os cursos de um usuário, mostrando as datas de matrícula ajustadas para o fuso horário do cliente.
Exemplo de Resposta (200 OK):
json
Copiar
[
  {
    "id": 1,
    "name": "Karl Malone",
    "email": "karl@example.com",
    "password": "...",
    "created_at": "2025-01-16T09:40:18-03:00",
    "enrollments": [
      {
        "id": 10,
        "user_id": 1,
        "course_id": 2,
        "enrolled_at": "2025-01-16T09:55:23-03:00",
        "course": {
          "id": 2,
          "title": "Node.js Avançado",
          "description": "Tópicos avançados de Node",
          "hours": 60,
          "created_at": "2025-01-16T09:40:18-03:00"
        }
      }
    ]
  }
]
Fuso Horário: Em algumas rotas, você pode enviar o cabeçalho timezone (por ex., America/Sao_Paulo) para que as datas retornem no offset correto. Caso não seja fornecido, a API pode usar UTC ou outro fallback.

Escolhas Técnicas
NestJS:

Escolhido por sua arquitetura modular, injeção de dependências integrada e facilidade de organização de código.
Prisma:

Para ORM e migrações de banco de dados.
Otimiza o desenvolvimento e facilita a manutenção do schema do PostgreSQL.
PostgreSQL:

Banco de dados SQL robusto, open-source, bem suportado.
Suporta recursos avançados e integra-se bem com o Prisma.
date-fns-tz:

Para manipulação de fusos horários de forma simples e declarativa.
Permite converter datas salvas em UTC para o fuso local do cliente.
Estrutura de Projeto:

src/core contendo módulos principais (users, courses, enrollment).
src/prisma contendo PrismaService.
src/utils para funções de utilidade, como manipulação de datas.
Testes unitários próximos aos módulos correspondentes ou na pasta test, garantindo isolamento e facilidade de manutenção.
Testes Unitários:

Utilização de Jest para testes.
Mocks do PrismaService para evitar dependência de banco real.
Cobertura dos principais fluxos (criar usuário, criar curso, criar matrícula, buscas, etc.).
Validação e Segurança (potencial / opcional):

Poderíamos usar class-validator para validar DTOs.
Para segurança (autenticação), poderíamos adicionar JWT ou Passport, mas isso não estava explicitamente requerido.