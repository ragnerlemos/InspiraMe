#!/bin/bash
# Script para salvar e enviar as alterações para o GitHub

echo "Adicionando todos os arquivos..."
git add .

# Cria um commit com data e hora
COMMIT_MESSAGE="Salvo em $(date +'%Y-%m-%d %H:%M:%S')"
echo "Criando commit com a mensagem: $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

echo "Enviando alterações para o repositório no GitHub..."
git push

echo "Versão salva no GitHub com sucesso!"
