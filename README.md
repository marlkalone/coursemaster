# Course Master

Este projeto consiste em um sistema de gerenciamento de cursos, permitindo:
- Cadastro de usuários
- Cadastro de cursos
- Matrícula de usuários em cursos
- Consultas de usuários, cursos e matrículas

Foi desenvolvido com **NestJS** e **Prisma**, usando **PostgreSQL** como banco de dados. Opcionalmente, pode ser executado com **Docker** para simplificar a configuração do ambiente.

---

# Índice

1. [Requisitos de Ambiente](#requisitos-de-ambiente)  
2. [Instruções para Execução](#instruções-para-execução)  
   1. [Execução via Docker Compose](#execução-via-docker-compose)  
   2. [Execução Manual (Sem Docker Compose)](#execução-manual-sem-docker-compose)  
   3. [Rodando Testes](#rodando-testes)  
3. [Estrutura de Pastas](#estrutura-de-pastas)  
4. [Descrição das Rotas da API](#descrição-das-rotas-da-api)  
   1. [Documentação via Swagger](#documentação-via-swagger)  
   2. [Export do Postman](#export-do-postman)  
   3. [Endpoints Principais](#endpoints-principais)  
5. [Tratamento de Erros](#tratamento-de-erros)  
6. [Escolhas Técnicas](#escolhas-técnicas)  
   1. [NestJS](#1-nestjs)  
   2. [Prisma](#2-prisma)  
   3. [PostgreSQL](#3-postgresql)  
   4. [Docker](#4-docker)  
   5. [Swagger](#5-swagger)  
   6. [Estrutura de Projeto](#6-estrutura-de-projeto)  
   7. [Testes Unitários](#7-testes-unitários)  
   8. [Gerenciamento de Respostas (Formato Padrão)](#8-gerenciamento-de-respostas-formato-padrão)  
   9. [Segurança de Dados](#9-segurança-de-dados)  
   10. [Resumo](#10-resumo)

---

# 📋 Requisitos de Ambiente

- **Node.js** v18+  
- **npm** ou **yarn**  
- **PostgreSQL** 13+ (caso não utilize o Docker Compose)  
- **Docker** e **docker-compose** (caso vá utilizar a orquestração via contêiner)

---

# 🔧 Instruções para Execução

## Execução via Docker Compose

Caso queira rodar tudo (banco de dados e API) via contêineres Docker:

  ### **1**. Instale Docker e docker-compose em sua máquina (caso ainda não tenha).

  ### **2**. No diretório do projeto, rode:
  ```bash
  docker-compose up --build
  ```

  Isso fará o build da imagem da API (usando o Dockerfile presente) e subirá dois contêineres:
  - db (baseado em postgres:15)
  - api (nossa aplicação NestJS)
  ### **3**. Após isso, rode o seguinte comando para aplicar as migrations no container:
  ```bash
  docker-compose exec api npx prisma migrate dev
  ```
  ### **4**. A aplicação NestJS, por padrão, ficará disponível em http://localhost:3000.
  ### **5**. Para parar a execução:
  ```bash
  docker-compose down
  ```

### Observação:
No docker-compose.yml, a variável de ambiente DATABASE_URL já foi configurada como: 
```bash
postgresql://admin:admin@db:5432/coursemaster.
```
O serviço db mapeia a porta 5432 local para 5432 do contêiner, e a api mapeia 3000 local para 3000 do contêiner.

---

## Execução manual (Sem Docker Compose)
Se você não quiser usar Docker Compose e preferir rodar o projeto manualmente:

**1. Crie um banco de dados no PostgreSQL (por exemplo, **coursemaster**).**

**2. Configurar .env**

Crie um arquivo .env na raiz contendo:
```bash
DATABASE_URL="postgresql://<seu-usuario>:<sua-senha>@localhost:5432/<nome-do-banco>"
```

**3. Certifique-se de que o serviço do PostgreSQL está rodando localmente ou remotamente, conforme configurado. Você pode verificar em alguma ferramenta visual, como PGAdmin, ou pelo comando a seguir:**

```bash
psql -U <usuario> -h <host> -p <porta>
```

**4. Instalação de Dependências**

No diretório raiz do projeto, rode:
```bash
npm install
```
ou

```bash
yarn install
```

**5. Executar Migrations**
```bash
npx prisma migrate dev --name "init"
```
Isso cria as tabelas no banco de dados.

**6. Rodar a aplicação**

Modo desenvolvimento (com live reload):
```bash
npm run dev
```
Modo produção (após build):
```bash
npm run build
npm run start:prod
```

A API estará acessível, por padrão, em http://localhost:3000.


## ⚙️ Rodando Testes
Para rodar todos os testes unitários, use:

```bash
npm run test
```
Você também pode rodar um teste específico passando o caminho:

```bash
npm run test user.service.spec.ts
```
Para verificar a cobertura dos testes rode o comando:

```bash
npm run test:cov
```

**Caso esteja utilizando docker-compose adicione o comando a seguir antes de cada um:**

```bash
docker-compose exec api
```

Por exemplo:

```bash
docker-compose exec api npm run test
```

## 📦 Estrutura de Pastas
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
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```
## **Descrição das rotas da API**

### **Documentação**

A documentação do swagger estará disponível no endpoint 

```bash
http://localhost:3000/docs
```

Nela será possível:
- Visualizar todos os endpoints
- Testar cada rota diretamente
- Ver esquemas e exemplos de request/response

**Observação:** É necessário enviar o cabeçalho timezone (por exemplo, "America/Sao_Paulo") para ajustar as datas retornadas.

### Export do Postman
- Caso deseje utilizar o Postman, será disponibilizado um arquivo de workspace exportado com as rotas prontas. Você pode importá-lo no seu Postman e testar rapidamente cada endpoint, passando os cabeçalhos (timezone, por exemplo) e body JSON necessários.

### **POST /users**
#### **Descrição: Cria um novo usuário com nome, email, senha e registra o horário de criação.**

**Exemplo de cabeçalho:**
```json
Headers: { "timezone": "America/Sao_Paulo" }
```

**Body:**
```json
{
  "name": "User de Teste",
  "email": "user@example.com",
  "password": "123456"
}
```
**Exemplo de Resposta:**
```json
{
    "message": "Operação realizada com sucesso.",
    "statusCode": 201,
    "data": {
        "id": 1,
        "email": "user@gmail.com",
        "name": "User de Teste",
        "created_at": "2025-01-16T15:03:30-03:00"
    }
}
```

### **GET /users/:id**
Descrição: Retorna o usuário, com datas ajustadas ao fuso horário.

Exemplo de requisição:
```bash
GET /users/1
Headers: { "timezone": "America/Sao_Paulo" }
```
**Exemplo de Resposta:**
```json
{
  "message": "Operação realizada com sucesso.",
  "statusCode": 200,
  "data": {
    "id": 1,
    "email": "user@gmail.com",
    "name": "Usuário de Teste",
    "created_at": "2025-01-17T08:22:20-03:00",
    "enrollments": []
  }
}
```

OU

```json
{
  "message": "Operação realizada com sucesso.",
  "statusCode": 200,
  "data": {
    "id": 1,
    "email": "user@gmail.com",
    "name": "Usuário de Teste",
    "created_at": "2025-01-17T08:22:20-03:00",
    "enrollments": [
      {
        "id": 1,
        "user_id": 1,
        "course_id": 2,
        "enrolled_at": "2025-01-17T08:22:20-03:00",
        "course": [
          {
            "id": 1,
            "title": "Nodejs Avançado",
            "description": "Este curso avançado explora tópicos complexos do Node.js, como escalabilidade, clusters, streams...",
            "hours": 60,
            "created_at": "2025-01-17T08:22:20-03:00"
          }
        ]
      }
    ]
  }
}
```

### **POST /courses**
Descrição: Cria um novo curso com título, descrição, horas e registra o horário de criação.

**Exemplo de requisição:**
```json
Headers: { "timezone": "America/Sao_Paulo" }
```

**Body:**
```json
{
  "title": "Node.js Avançado",
  "description": "Tópicos avançados de Node",
  "hours": 60
}
```

**Exemplo de Resposta:**
```json
{
  "id": 2,
  "title": "Node.js Avançado",
  "description": "Tópicos avançados de Node",
  "hours": 60,
  "created_at": "2025-01-16T09:40:18-03:00"
}
```

### **GET /courses**
Lista todos os cursos.

**Exemplo de requisição:**
```bash
GET /courses
Headers: { "timezone": "America/Sao_Paulo" }
```

**Exemplo de Resposta:**
```json
[
  {
    "id": 2,
    "title": "Node.js Avançado",
    "description": "Tópicos avançados de Node",
    "hours": 60,
    "created_at": "2025-01-16T09:40:18-03:00"
  }
]
```

### **POST /enrollments**
Matricula um usuário em um curso.

**Exemplo de Requisição:**
```json
{
  "user_id": 1,
  "course_id": 2
}

```

**Exemplo de Resposta:**
```json
{
  "message": "Operação realizada com sucesso.",
  "statusCode": 201,
  "data": {
    "id": 4,
    "enrolled_at": "2025-01-17T10:23:10-03:00",
    "user": {
      "id": 2,
      "name": "Usuário Teste",
      "email": "teste2@gmail.com",
      "created_at": "2025-01-17T08:18:22-03:00"
    },
    "course": {
      "id": 2,
      "title": "Nodejs Basico",
      "description": "Este curso avançado explora tópicos complexos do Node.js, como escalabilidade, clusters, streams, balanceamento de carga e otimização de desempenho.",
      "hours": 60,
      "created_at": "2025-01-17T10:18:03-03:00"
    }
  }
}
```

### **GET /enrollments/:user_id**
Lista os cursos de um usuário, ajustando as datas de matrícula para o fuso horário do cliente.

**Exemplo de Requisição:**
```bash
GET /enrollments/:user_id
Headers: { "timezone": "America/Sao_Paulo" }
```

**Exemplo de Resposta:**
```json
{
  "message": "Operação realizada com sucesso.",
  "statusCode": 200,
  "data": [
    {
      "id": 4,
      "enrolled_at": "2025-01-17T10:23:10-03:00",
      "user": {
        "id": 2,
        "name": "Usuário Teste",
        "email": "teste2@gmail.com",
        "created_at": "2025-01-17T08:18:22-03:00"
      },
      "course": {
        "id": 2,
        "title": "Nodejs Basico",
        "description": "Este curso avançado explora tópicos complexos do Node.js, como escalabilidade, clusters, streams, balanceamento de carga e otimização de desempenho.",
        "hours": 60,
        "created_at": "2025-01-17T10:18:03-03:00"
      }
    }
  ]
}
```

## **Tratamento de Erros**
### Para padronizar a forma como erros são retornados, utilizamos:

- HTTP status codes apropriados (ex.: 404 para “não encontrado”, 400 para “solicitação inválida”, etc.)
- Objeto JSON com campos que indicam a natureza do erro.

Exemplos:

1. Erro de rota inexistente:

```json
{
  "message": "Cannot POST /userss",
  "error": "Not Found",
  "statusCode": 404
}
```

2. Usuário não encontrado:

```json
{
  "message": "Usuário com ID 9 não encontrado",
  "statusCode": 404,
  "data": null
}
```

3. Validação de input (se o DTO não corresponder ao esperado, por exemplo):

```json
{
  "message": "Validation failed",
  "statusCode": 400,
  "data": {
    "errors": [
      "email must be a valid email",
      "password is required"
    ]
  }
}
```

**De forma geral, o TransformInterceptor usado neste projeto padroniza a mensagem e statusCode, enquanto erros lançados por NestJS (ex.: HttpException) podem trazer mais detalhes em message ou error.**


## 🛠️ **Escolhas Técnicas**
### 1. **NestJS**
- Optei pelo NestJS porque ele já me provou ser excelente em projetos de médio e grande porte. Sua arquitetura modular não só organiza melhor o código, mas também facilita a manutenção e a expansão do projeto ao longo do tempo. Gosto de como o NestJS aproveita TypeScript e injeta dependências de forma ordenada, permitindo que cada módulo (users, courses, enrollment, etc.) fique bem isolado, tornando o desenvolvimento fluido e seguro.


### 2. **Prisma**
- Para a camada de acesso a dados, escolhi o Prisma por uma razão simples: ele tem sido o ORM de maior crescimento no ecossistema Node.js e oferece uma experiência de desenvolvimento muito fluida. Ele me dá mais segurança (type-safety) e um fluxo de trabalho otimizado para lidar com migrações e consultas. Além disso, a integração do Prisma com o NestJS e o PostgreSQL é praticamente sem costura, tornando o desenvolvimento ainda mais ágil.

### 3. **PostgreSQL**
- Já trabalhei com diferentes bancos de dados, mas o PostgreSQL se destaca pela robustez e performance. Ele lida muito bem com projetos grandes e pequenos, permitindo que eu escale sem grandes dores de cabeça quando o sistema crescer. Além disso, a escolha do Postgres foi indicada pelo teste técnico e, pessoalmente, acho uma ótima decisão: ele é confiável e cheio de funcionalidades interessantes.

### 4. **Docker**
- Gosto de Docker porque ele simplifica bastante o processo de subir o ambiente completo, especialmente quando alguém novo clona o repositório. Foi feita a containerização tanto do banco de dados quanto da API em si. Assim, basta um comando como docker-compose up --build para ter tudo rodando em um ambiente novo, independentemente de sistema operacional ou configurações locais. Isso reduz a dificuldade no onboarding de novos desenvolvedores e garante que a aplicação rode da mesma forma em produção e no ambiente de desenvolvimento.

### 5. **Swagger**
- Para documentar a API, utilizei o Swagger (através do @nestjs/swagger). Já passei por situações em que a falta de documentação atrasava projetos e criava confusões. Com o Swagger, além de ter documentação viva (que atualiza conforme o código evolui), também consigo testar cada endpoint diretamente em um painel web, o que poupa tempo para mim e para quem usar a API no futuro.

### 4. **Estrutura de Projeto**
- Dividi o código em módulos (users, courses, enrollment) dentro de src/core. Cada módulo tem seu próprio controller, service, DTOs e testes, deixando as responsabilidades bem claras. O diretório src/prisma abriga a configuração do PrismaService, que conecta o NestJS ao banco de dados, e em src/utils ficam utilidades e interceptors como o TransformInterceptor (responsável por padronizar a estrutura das respostas). Assim, a organização é intuitiva: se alguém precisar mexer na lógica de “enrollment”, encontra tudo referente a matrículas num só lugar.
### 5. **Testes Unitários**
- Sempre defendo que testes unitários ajudam a detectar problemas cedo e documentam o comportamento esperado do código. Por isso, usei o Jest — que considero prático e muito difundido na comunidade JavaScript/TypeScript. Montei mocks do PrismaService para que não precisemos de um banco real durante os testes (torna o CI/CD mais rápido e confiável). Os testes cobrem os fluxos principais, como criação e listagem de usuários e cursos, além de matrículas. Dessa forma, se algo quebrar, eu sei rapidamente onde está o problema.
### 6. **Gerenciamento de Respostas (Formato Padrão)**
Para manter consistência e facilitar o consumo pelo front-end, criei um interceptor global (o TransformInterceptor) que padroniza todas as respostas num formato JSON comum, com campos como message, statusCode e data. Gosto dessa abordagem porque elimina surpresas para quem consome a API e deixa claro onde o payload de fato está. Se há um erro (ex.: usuário não encontrado), o formato também se mantém — muda apenas o statusCode e a message. Essa previsibilidade ajuda muito em integrações com front-ends ou serviços de terceiros.

Formato Padrão de Resposta:

```json

{
  "message": "Mensagem descritiva sobre o resultado da operação.",
  "statusCode": 200,
  "data": {}
}
```

No caso de um erro de rotas:

```json
{
    "message": "Cannot POST /userss",
    "error": "Not Found",
    "statusCode": 404
}
```

Ou um erro referente a um id de usuário não encontrado:

```json
{
    "message": "Usuário com o ID 9 não encontrado",
    "statusCode": 404,
    "data": null
}
```

- **message**: Mensagem descritiva sobre o resultado da operação.
- **statusCode**: Código HTTP da resposta.
- **data**: Dados retornados pelo endpoint, ou null em caso de erro.


### 7. **Segurança de Dados:**

**Proteção de Dados Sensíveis:**

Mesmo sem uma autenticação completa implementada neste projeto, preocupo-me em não vazar informações sensíveis, como o hash de senha. Assim, em cada rota que retorna dados do usuário, garante-se que o password seja removido ou nunca seja incluído no objeto de resposta. Esse cuidado é importante para evitar exposições indevidas e mantém o projeto alinhado às boas práticas de segurança.

Algumas medidas tomadas são:

    - Filtragem de Dados: O campo password é explicitamente excluído nos serviços.
    - Intercepção Global: O TransformInterceptor formata as respostas e não inclui informações não autorizadas.

- **Exemplo:**
Mesmo que o usuário seja retornado na resposta, o campo password nunca será incluído:

  ```json
  {
    "id": 1,
    "name": "Usuário Teste",
    "email": "teste@gmail.com",
    "created_at": "2025-01-16T09:40:18-03:00"
  }
  ```

### 8. **Resumo** 
Em resumo, todos esses pontos refletem minhas preferências pessoais e experiências práticas com projetos de tamanho variado. Gosto de NestJS pela modularidade, de Prisma pela produtividade e de Docker pela previsibilidade na hora de subir o ambiente. O Swagger não só documenta, mas também serve como uma ferramenta interativa. E, por fim, a forma como tratei cada aspecto de estrutura e segurança de dados se baseia em princípios que me ajudam a manter o projeto limpo, coerente e sustentável ao longo do tempo.