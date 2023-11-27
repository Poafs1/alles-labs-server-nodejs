# Create dir inside container
docker exec -d alleslabs-postgres-db mkdir mockData

docker cp mock/pg/init.sql alleslabs-postgres-db:mockData/init.sql

docker exec -d alleslabs-postgres-db psql -U postgres -f ./mockData/init.sql
