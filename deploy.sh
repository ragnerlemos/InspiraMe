#!/bin/bash
# Deploy automático do InspireMe no Vercel

# Token Vercel (certifique-se de ter exportado)
# export VERCEL_TOKEN=h9Cce58Zb60a3fYcJNBTAYFy

PROJECT_ID="prj_WtuQhwHhYMBXjKlVfuqmR3APOLA6"

echo "Iniciando deploy do projeto InspireMe..."
vercel --prod --token $VERCEL_TOKEN --yes --confirm
echo "Deploy concluído! Acesse sua aplicação em produção:"
echo "https://inspirame-68v64c3hf-ragner-lemos-teixeiras-projects.vercel.app"
