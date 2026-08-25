# Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["api/Bizim.pk.API.csproj", "api/"]
RUN dotnet restore "api/Bizim.pk.API.csproj"

# Copy everything else and build
COPY api/ api/
WORKDIR "/src/api"
RUN dotnet build "Bizim.pk.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Bizim.pk.API.csproj" -c Release -o /app/publish

# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose the port (Render automatically assigns a port and sets the PORT env var)
# Using 8080 is common, but Render will route HTTP traffic to whichever port we bind to.
ENV ASPNETCORE_URLS=http://+:${PORT:-8080}
EXPOSE 8080

ENTRYPOINT ["dotnet", "Bizim.pk.API.dll"]
