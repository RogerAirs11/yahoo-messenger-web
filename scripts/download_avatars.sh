#!/bin/bash
# Download realistic profile photos from randomuser.me (real photos, free to use)
set -e
DIR=/home/z/my-project/public/assets/avatars
mkdir -p $DIR
i=0
for g in men women; do
  for n in $(seq 10 45); do
    f="$DIR/${g}-${n}.jpg"
    if [ ! -s "$f" ]; then
      curl -s --max-time 20 -o "$f" "https://randomuser.me/api/portraits/${g}/${n}.jpg" || true
    fi
  done
done
echo "avatars downloaded: $(ls $DIR | wc -l)"
ls -la $DIR | head -5
# verify all are valid JPEGs
bad=0
for f in $DIR/*.jpg; do
  head -c2 "$f" | od -An -tx1 | grep -q "ff d8" || { echo "BAD: $f"; rm -f "$f"; bad=$((bad+1)); }
done
echo "bad removed: $bad; final count: $(ls $DIR | wc -l)"
