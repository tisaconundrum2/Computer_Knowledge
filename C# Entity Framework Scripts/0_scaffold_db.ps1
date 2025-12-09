Set-Location -Path $PWD\DataAccess.PostgresEntityFramework
$DBName = Read-Host "Enter the database name (e.g., MyDatabase)"

# Run the EF scaffold command with the connection string as a flag
# Use the following command to scaffold the database with the specified connection string
# "Host=localhost;Database=my_database;Port=5432;Username=postgres;Password=password" `
dotnet ef dbcontext scaffold `
    Name=${DBName}Context `
    Npgsql.EntityFrameworkCore.PostgreSQL `
    --context ${DBName}Context `
    --output-dir Models/${DBName} `
    --force