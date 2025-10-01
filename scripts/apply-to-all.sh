#!/bin/bash

# Nombre del commit a aplicar (por defecto HEAD)
COMMIT=${1:-HEAD}

# Lista de ramas destino
BRANCHES=("anestudio" "stn")

# Guardar la rama actual
CURRENT_BRANCH=$(git branch --show-current)

for BR in "${BRANCHES[@]}"; do
  echo "⏳ Aplicando commit $COMMIT en rama $BR..."
  git checkout $BR || { echo "❌ No se pudo cambiar a $BR"; exit 1; }

  git cherry-pick $COMMIT 2>&1 | tee cherry_output.txt
  if grep -q "The previous cherry-pick is now empty" cherry_output.txt; then
    echo "⚠️ Commit vacío en $BR, se omite con --skip."
    git cherry-pick --skip
  elif grep -q "error:" cherry_output.txt; then
    echo "❌ Error real al aplicar cherry-pick en $BR"
    git cherry-pick --abort
    rm cherry_output.txt
    exit 1
  fi
  rm cherry_output.txt

  git push origin $BR || { echo "❌ Error al hacer push en $BR"; exit 1; }
  echo "✅ Commit aplicado en $BR"
done

# Volver a la rama original
git checkout $CURRENT_BRANCH


# USO
# ./scripts/apply-to-all.sh HEAD
# ./scripts/apply-to-all.sh <commit-hash>

# USO BASH GIT
# bash scripts/apply-to-all.sh HEAD
# bash scripts/apply-to-all.sh <commit-hash>