#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM node:18 as node
ARG NPM_RUN='publish-dev'
WORKDIR /app
COPY  src/Wangle.Web.Host .
RUN yarn install
RUN yarn run $NPM_RUN

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build


WORKDIR /src
COPY  src/Wangle.Web.Host/Wangle.Web.Host.csproj  Wangle.Web.Host/
COPY  src/Wangle.Web.Core/Wangle.Web.Core.csproj  Wangle.Web.Core/
COPY  src/Wangle.Application/Wangle.Application.csproj  Wangle.Application/
COPY  src/Wangle.Core/Wangle.Core.csproj  Wangle.Core/
COPY  src/Wangle.EntityFrameworkCore/Wangle.EntityFrameworkCore.csproj  Wangle.EntityFrameworkCore/


RUN dotnet restore "Wangle.Web.Host/Wangle.Web.Host.csproj"
COPY /src .

WORKDIR /src/Wangle.Web.Host
RUN dotnet build "Wangle.Web.Host.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Wangle.Web.Host.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=node /app/wwwroot/dist /app/wwwroot/
ENTRYPOINT ["dotnet", "Wangle.Web.Host.dll"]