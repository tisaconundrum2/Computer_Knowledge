Set-Location -Path $PWD\DataAccess.PostgresEntityFramework

# Set the connection string as an environment variable
$env:ConnectionStrings__MyDatabaseContext = "Host=localhost;Database=my_database;Port=5432;Username=postgres;Password=password;Search Path=public;"

# Run the EF database update command
dotnet ef database update --context MyDatabaseContext