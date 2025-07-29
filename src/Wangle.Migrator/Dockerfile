#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/Wangle.Migrator/Wangle.Migrator.csproj", "src/Wangle.Migrator/"]
COPY ["src/Wangle.EntityFrameworkCore/Wangle.EntityFrameworkCore.csproj", "src/Wangle.EntityFrameworkCore/"]
COPY ["src/Wangle.Core/Wangle.Core.csproj", "src/Wangle.Core/"]
RUN dotnet restore "src/Wangle.Migrator/Wangle.Migrator.csproj"
COPY . .
WORKDIR "/src/src/Wangle.Migrator"
RUN dotnet build "Wangle.Migrator.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Wangle.Migrator.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Wangle.Migrator.dll", "-s"]
