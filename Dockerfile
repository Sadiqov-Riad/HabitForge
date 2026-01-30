FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore ./AuthAPI.sln
RUN dotnet publish ./AuthAPI/AuthAPI.Presentation.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app/publish/ ./
COPY ./start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Railway sets PORT; we bind to it in start.sh
EXPOSE 8080
ENTRYPOINT ["/app/start.sh"]
