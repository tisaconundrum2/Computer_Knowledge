# All the coding things I've learned.

## Auth Individual Setup

```
$ dotnet new mvc -n "Project.Name" -o "Project.Name" --auth Individual
```

## Clear your cache damnit!

If you're getting errors saying a version of your project doesn't exist. Have you considered clearing your cache?

```
$ dotnet nuget locals all --clear
```

## Regex to capture content between two strings with newlines between

```
start(.*?\n)+?end
```

Captures something like this.

```
start

more content
and here as well
end
```

## Powershell Script for Scaffolding a DB C# EF

```
Set-Location -Path $PWD\DataAccess.PostgresEntityFramework
$DBName = Read-Host "Enter the database name (e.g., FetchitOrion)"

# Run the EF scaffold command with the connection string as a flag
# Use the following command to scaffold the database with the specified connection string
# "Host=localhost;Database=fetchit-orion;Port=5432;Username=postgres;Password=postgres" `
dotnet ef dbcontext scaffold `
    Name=${DBName}Context `
    Npgsql.EntityFrameworkCore.PostgreSQL `
    --context ${DBName}Context `
    --output-dir Models/${DBName} `
    --force
```

## Migrations Script C# EF

```
Set-Location -Path $PWD\DataAccess.PostgresEntityFramework
$DBName = Read-Host "Enter the database name (e.g., FetchitOrion)"

# Run the EF scaffold command with the connection string as a flag
# Use the following command to scaffold the database with the specified connection string
# "Host=localhost;Database=fetchit-orion;Port=5432;Username=postgres;Password=postgres" `
dotnet ef dbcontext scaffold `
    Name=${DBName}Context `
    Npgsql.EntityFrameworkCore.PostgreSQL `
    --context ${DBName}Context `
    --output-dir Models/${DBName} `
    --force
```

## Update DB C# EF

```
Set-Location -Path $PWD\DataAccess.PostgresEntityFramework

$env:ConnectionStrings__FetchitOrionContext = "Host=******;Database=******;Port=******;Username=******;Password=******;Search Path=******"

# Run the EF database update command
dotnet ef database update --context FetchitOrionContext
```
