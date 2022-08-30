#!/bin/bash
cd "${0%/*}"
for filename in *; do
  if [[ -f "$filename" ]]; then
    base=${filename%.*}
    ext=${filename#$base.}
    mkdir -p "${ext}"
    if [ "$filename" != "organizeFiles.sh" ]; then
      mv "$filename" "${ext}"
    fi
  fi
done
