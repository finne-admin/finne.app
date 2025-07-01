#!/bin/bash

# Nombre del commit a aplicar (por defecto HEAD)
COMMIT=${1:-HEAD}

# Lista de ramas destino
BRANCHES=("anestudio" "stn")

# Guardar la rama actual
CURRENT_BRANCH=$(git branch --show-current)

# Aplicar el commit a cada rama
for BR in "${BRANCHES[@]}"; do
  echo "⏳ Aplicando commit $COMMIT en rama $BR..."
  git checkout $BR || { echo "❌ No se pudo cambiar a $BR"; exit 1; }
  git cherry-pick $COMMIT || {
    if grep -q "cherry-pick is now empty" <<< "$(git status)"; then
      echo "⚠️ Commit vacío en $BR, se omite."
      git cherry-pick --skip
    else
      echo "❌ Error real al aplicar cherry-pick en $BR"
      git cherry-pick --abort
      exit 1
    fi
  }
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