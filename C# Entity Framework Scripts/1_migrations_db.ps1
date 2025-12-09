Set-Location -Path $PWD\DataAccess.PostgresEntityFramework

# Run the EF migrations script command to generate a SQL script for the migrations
# Get the latest migration name using git SHA
$latestMigration = git rev-parse --short HEAD
dotnet ef migrations add $latestMigration `
    --context MyDatabaseContext `
    --output-dir Migrations/MyDatabase