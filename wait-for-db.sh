# Aguardar o banco de dados estar pronto
until pg_isready -h db -p 5432 -U admin; do
  echo "Aguardando o banco de dados iniciar..."
  sleep 2
done

echo "Banco de dados pronto. Iniciando a aplicação..."
exec "$@"