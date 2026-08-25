#!/bin/bash

# Setup automático RAPOT - Supabase
# Ejecuta esto en tu máquina con: bash setup.sh

echo "🚀 Setup RAPOT - Supabase"
echo "========================="
echo ""
echo "1️⃣ Abriendo navegador con setup interactivo..."
echo ""

cd "$(dirname "$0")"

# Iniciar servidor HTTP
python3 -m http.server 8888 > /dev/null 2>&1 &
SERVER_PID=$!

sleep 2

# Abrir en navegador (funciona en macOS, Linux y Windows)
if command -v xdg-open &> /dev/null; then
  xdg-open "http://localhost:8888/setup-supabase.html"
elif command -v open &> /dev/null; then
  open "http://localhost:8888/setup-supabase.html"
else
  echo "Abre en tu navegador: http://localhost:8888/setup-supabase.html"
fi

echo ""
echo "📋 Instrucciones:"
echo "1. Se abrirá un navegador con setup-supabase.html"
echo "2. Haz click en '🧪 Probar Conexión'"
echo "3. Haz click en '▶️ Iniciar Migración'"
echo "4. Espera 2-3 minutos mientras se cargan 825+ elementos"
echo "5. ¡Listo! Tu RAPOT estará en Supabase 🎉"
echo ""
echo "Presiona Ctrl+C cuando termines"

wait $SERVER_PID
