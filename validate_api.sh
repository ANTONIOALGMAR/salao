#!/usr/bin/env bash

set -euo pipefail

# Comentário: Script de validação fim-a-fim da API com curl (sem persistir tokens em disco)
# Pré-requisitos: servidor backend rodando (http://localhost:5000), jq instalado

BASE=${BASE:-"http://localhost:5000"}
UNIQ=$(date +%s)
ADMIN_EMAIL=${ADMIN_EMAIL:-"admin+$UNIQ@example.com"}
EMP_EMAIL=${EMP_EMAIL:-"emp+$UNIQ@example.com"}
CLI_EMAIL=${CLI_EMAIL:-"cli+$UNIQ@example.com"}
VERBOSE=${VERBOSE:-0}

if ! command -v jq >/dev/null 2>&1; then
  echo "Erro: 'jq' não encontrado. Instale com 'brew install jq' (macOS) ou 'sudo apt-get install jq' (Linux)." >&2
  exit 1
fi

echo "==> Iniciando validação no endpoint: $BASE"

JAR=$(mktemp /tmp/salao_cookies.XXXXXX)
trap 'rm -f "$JAR" 2>/dev/null || true' EXIT

mask_and_print() {
  local json="$1"
  if [ "$VERBOSE" = "1" ]; then
    # Mascarar campos sensíveis comuns (token, password)
    echo "$json" | jq '. as $o | ($o.token? // null) as $t | if has("token") then .token = "***" else . end | (.. | objects | select(has("password")).password) |= "***"'
  fi
}

echo "\n[1] Registrar ADMIN"
HTTP_CODE=$(curl -sS -o admin_resp.json -w "%{http_code}" -X POST "$BASE/api/users" \
  -H "Content-Type: application/json" \
  -c "$JAR" \
  -d "{\"name\":\"Admin\",\"email\":\"$ADMIN_EMAIL\",\"password\":\"password123\",\"role\":\"admin\"}") || true
ADMIN_JSON=$(cat admin_resp.json)
if [ "$HTTP_CODE" != "201" ]; then
  MSG=$(echo "$ADMIN_JSON" | jq -r '.message // ""')
  if [ "$HTTP_CODE" = "400" ] && [ "$MSG" = "User already exists" ]; then
    echo "Admin já existe. Prosseguindo."
  else
    echo "Falha ao registrar admin. HTTP=$HTTP_CODE" >&2
    echo "$ADMIN_JSON" >&2
    exit 1
  fi
else
  ADMIN_ID=$(echo "$ADMIN_JSON" | jq -r '._id')
  echo "ADMIN_ID=$ADMIN_ID"
  mask_and_print "$ADMIN_JSON"
fi

echo "\n[2] Login ADMIN (renovar cookie)"
ADMIN_LOGIN_JSON=$(curl --fail -sS -X POST "$BASE/api/users/login" \
  -H "Content-Type: application/json" \
  -c "$JAR" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"password123\"}")
mask_and_print "$ADMIN_LOGIN_JSON"

echo "\n[3] Criar SERVIÇO (com cookie httpOnly)"
SERVICE_JSON=$(curl --fail -sS -X POST "$BASE/api/services" \
  -H "Content-Type: application/json" \
  -b "$JAR" \
  -d '{"name":"Corte","description":"Corte básico","price":50,"duration":30}')
SERVICE_ID=$(echo "$SERVICE_JSON" | jq -r '._id')
echo "SERVICE_ID=$SERVICE_ID"
mask_and_print "$SERVICE_JSON"

echo "\n[4] Listar SERVIÇOS (público)"
curl --fail -sS "$BASE/api/services" | jq '.[-3:]' >/dev/null

echo "\n[5] Criar EMPLOYEE e CLIENTE"
EMP_JSON=$(curl --fail -sS -X POST "$BASE/api/users" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Funcionario\",\"email\":\"$EMP_EMAIL\",\"password\":\"password123\",\"role\":\"employee\"}")
EMP_ID=$(echo "$EMP_JSON" | jq -r '._id')
echo "EMP_ID=$EMP_ID"
mask_and_print "$EMP_JSON"

CLI_JSON=$(curl --fail -sS -X POST "$BASE/api/users" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Cliente\",\"email\":\"$CLI_EMAIL\",\"password\":\"password123\",\"role\":\"client\"}")
CLI_ID=$(echo "$CLI_JSON" | jq -r '._id')
echo "CLI_ID=$CLI_ID"
mask_and_print "$CLI_JSON"

echo "\n[6] Login CLIENTE (obter cookie httpOnly)"
CLI_LOGIN_JSON=$(curl --fail -sS -X POST "$BASE/api/users/login" \
  -H "Content-Type: application/json" \
  -c "$JAR" \
  -d "{\"email\":\"$CLI_EMAIL\",\"password\":\"password123\"}")
mask_and_print "$CLI_LOGIN_JSON"

echo "\n[7] Criar AGENDAMENTO (cliente autenticado via cookie)"
if date -v+1d "+%F" >/dev/null 2>&1; then
  DATE=$(date -v+1d "+%F")
else
  DATE=$(date -d '+1 day' +%F)
fi
APPT_JSON=$(curl --fail -sS -X POST "$BASE/api/appointments" \
  -H "Content-Type: application/json" \
  -b "$JAR" \
  -d "{\"client\":\"$CLI_ID\",\"employee\":\"$EMP_ID\",\"service\":\"$SERVICE_ID\",\"date\":\"$DATE\",\"startTime\":\"10:00\"}")
APPT_ID=$(echo "$APPT_JSON" | jq -r '._id')
echo "APPT_ID=$APPT_ID"
mask_and_print "$APPT_JSON"

echo "\n[8] Buscar horários disponíveis (público)"
curl --fail -sS "$BASE/api/appointments/available/$EMP_ID/$DATE" | jq . >/dev/null

echo "\n[9] Atualizar agendamento (cliente, cookie) -> status=confirmed"
APPT_UPD_JSON=$(curl --fail -sS -X PUT "$BASE/api/appointments/$APPT_ID" \
  -H "Content-Type: application/json" \
  -b "$JAR" \
  -d '{"status":"confirmed"}')
mask_and_print "$APPT_UPD_JSON"

echo "\n[10] Listar agendamentos (aberto no código atual)"
curl --fail -sS "$BASE/api/appointments" | jq '.[-3:]' >/dev/null

echo "\n[11] Deletar SERVIÇO (admin, cookie)"
# Reautenticar como admin para garantir cookie admin ativo
curl --fail -sS -X POST "$BASE/api/users/login" \
  -H "Content-Type: application/json" \
  -c "$JAR" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"password123\"}" >/dev/null
SERVICE_DEL_JSON=$(curl --fail -sS -X DELETE "$BASE/api/services/$SERVICE_ID" -b "$JAR")
mask_and_print "$SERVICE_DEL_JSON"

echo "\n[12] Verificações de segurança: 401/403 esperados"
HTTP_USERS=$(curl -sS -o /dev/null -w "%{http_code}\n" "$BASE/api/users")
echo "/api/users sem auth => HTTP $HTTP_USERS (esperado 401)"

HTTP_CREATE_SERVICE=$(curl -sS -o /dev/null -w "%{http_code}\n" -X POST "$BASE/api/services" \
  -H "Content-Type: application/json" \
  -d '{"name":"X","description":"Y","price":1,"duration":10}')
echo "POST /api/services sem admin => HTTP $HTTP_CREATE_SERVICE (esperado 401/403)"

echo "\n==> Validação concluída. Tokens não foram gravados em disco."


