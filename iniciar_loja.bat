@echo off
echo ==========================================
echo    Iniciando a Loja PowerSupps...
echo ==========================================

echo Iniciando o Banco de Dados (Backend)...
start cmd /k "cd backend && node index.js"

echo Iniciando o Site (Frontend)...
start cmd /k "cd frontend && npm run dev"

echo Tudo certo! O site vai abrir no seu navegador.
timeout /t 3
start http://localhost:5173
