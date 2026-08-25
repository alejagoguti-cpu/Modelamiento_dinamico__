# Auto-installer RAPOT + Supabase
# Ejecuta esto en PowerShell y todo se hace automáticamente

Write-Host "🚀 Auto-instalador RAPOT + Supabase" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 1. Clonar repo
Write-Host "📥 Clonando repositorio..." -ForegroundColor Yellow
git clone https://github.com/alejagoguti-cpu/Modelamiento_dinamico__.git
cd Modelamiento_dinamico__

# 2. Iniciar servidor HTTP
Write-Host "🌐 Iniciando servidor HTTP en puerto 8888..." -ForegroundColor Yellow
$pythonProcess = Start-Process python -ArgumentList "-m http.server 8888" -PassThru -WindowStyle Minimized

# 3. Esperar a que inicie
Start-Sleep -Seconds 3

# 4. Abrir navegador
Write-Host "🌐 Abriendo navegador..." -ForegroundColor Green
Start-Process "http://localhost:8888/setup-supabase.html"

Write-Host ""
Write-Host "✅ Setup abierto en tu navegador" -ForegroundColor Green
Write-Host ""
Write-Host "Instrucciones:" -ForegroundColor Cyan
Write-Host "1. Haz click en '🧪 Probar Conexión'" -ForegroundColor Gray
Write-Host "2. Haz click en '▶️ Iniciar Migración'" -ForegroundColor Gray
Write-Host "3. Espera 2-3 minutos" -ForegroundColor Gray
Write-Host "4. ¡Listo! 🎉" -ForegroundColor Gray
Write-Host ""
Write-Host "El servidor seguirá corriendo. Presiona Ctrl+C cuando termines." -ForegroundColor Yellow
Write-Host ""

# Mantener abierto
Read-Host "Presiona Enter para terminar"
