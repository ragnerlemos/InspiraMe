#!/bin/bash

TAG="InspiraMe — 22/01/2026 às 01h12"

echo "Criando etiqueta: $TAG"

git tag -a "$TAG" -m "$TAG"
git push origin "$TAG"

echo "Etiqueta criada e enviada com sucesso!"
