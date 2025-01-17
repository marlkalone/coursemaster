FROM node:18

# Instalar PostgreSQL
RUN apt-get update && apt-get install -y \
  postgresql postgresql-contrib && \
  rm -rf /var/lib/apt/lists/*

# Configurar PostgreSQL
USER postgres
RUN /etc/init.d/postgresql start && \
  psql --command "CREATE USER admin WITH PASSWORD 'admin';" && \
  createdb -O admin coursemaster

# Configurar a API
USER root
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 5432 3000

CMD service postgresql start && npm run dev
