#!/usr/bin/env sh
set -e

# Railway provides PORT; default for local runs
: "${PORT:=8080}"
export ASPNETCORE_URLS="http://0.0.0.0:${PORT}"

exec dotnet AuthAPI.Presentation.dll
