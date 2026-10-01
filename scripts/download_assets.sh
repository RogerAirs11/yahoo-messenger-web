#!/bin/bash
# Download real Yahoo Messenger assets from alexpreli/yahoo-emoticons-discord
set -e
TOKEN="${GH_TOKEN:?set GH_TOKEN}"
AUTH="Authorization: token $TOKEN"
BASE="https://api.github.com/repos/alexpreli/yahoo-emoticons-discord/contents/assets"
RAW="https://raw.githubusercontent.com/alexpreli/yahoo-emoticons-discord/main/assets"
PUB=/home/z/my-project/public/assets

mkdir -p $PUB/emoticons $PUB/audibles

echo "== 1. Emoticon GIFs (119) =="
curl -s --max-time 60 -H "$AUTH" "$BASE/yahoo-emoticons" > /tmp/emo.json
node -e "
const fs=require('fs');
const items=JSON.parse(fs.readFileSync('/tmp/emo.json','utf8'));
console.log(items.length+' emoticon files listed');
fs.writeFileSync('/tmp/emo_urls.txt', items.map(i=>i.name).join('\n'));
"

count=0
while read -r name; do
  if [ ! -s "$PUB/emoticons/$name" ]; then
    curl -s --max-time 30 -o "$PUB/emoticons/$name" "$RAW/yahoo-emoticons/$name" && count=$((count+1))
  fi
done < /tmp/emo_urls.txt
echo "downloaded $count new emoticons; total on disk: $(ls $PUB/emoticons | wc -l)"

echo "== 2. Emoticon symbol list (xlsx) =="
curl -s --max-time 30 -o /home/z/my-project/scripts/yahoo-emoticons-list.xlsx "$BASE/yahoo-emoticons-list.xlsx" -L "$RAW/yahoo-emoticons-list.xlsx" || true
curl -s --max-time 30 -L -o /home/z/my-project/scripts/yahoo-emoticons-list.xlsx "$RAW/yahoo-emoticons-list.xlsx" && echo "xlsx saved ($(stat -c%s /home/z/my-project/scripts/yahoo-emoticons-list.xlsx) bytes)"

echo "== 3. Audible MP4s (13 categories) =="
for cat in flirt football goodbyes halloween happy-tree-friends hello insults losing madonna music siedler taunt winning; do
  mkdir -p "$PUB/audibles/$cat"
  curl -s --max-time 60 -H "$AUTH" "$BASE/yahoo-audibles/$cat" > /tmp/aud_$cat.json
  node -e "
const fs=require('fs');
try {
  const items=JSON.parse(fs.readFileSync('/tmp/aud_$cat.json','utf8'));
  const names=Array.isArray(items)?items.map(i=>i.name):[];
  fs.writeFileSync('/tmp/aud_$cat.txt', names.join('\n'));
} catch(e){ fs.writeFileSync('/tmp/aud_$cat.txt',''); }
"
  while read -r name; do
    [ -z "$name" ] && continue
    if [ ! -s "$PUB/audibles/$cat/$name" ]; then
      curl -s --max-time 60 -o "$PUB/audibles/$cat/$name" "$RAW/yahoo-audibles/$cat/$name" || true
    fi
  done < /tmp/aud_$cat.txt
  echo "  $cat: $(ls $PUB/audibles/$cat | wc -l) files"
done

echo "== DONE =="
echo "Emoticons: $(ls $PUB/emoticons | wc -l)"
du -sh $PUB/audibles
