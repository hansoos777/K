#!/usr/bin/env sh
# PujaTime 원본(기본 ../pujatime)을 modules/pujatime 로 다시 복사. 키·앱 빌드 파일은 뺀다.
# 복사 뒤 modules/pujatime/ORUVIA_PATCHES.md 의 두 곳을 다시 적용할 것.
set -e
SRC=${1:-../pujatime}
cd "$SRC"
git ls-files | grep -vE '^(android|ios|mockups|scripts/murti)/' | grep -vE '\.(jks|keystore)$|keystore\.properties|(^|/)\.env' > /tmp/pt-files.txt
cd - >/dev/null
mkdir -p modules/pujatime
(cd "$SRC" && tar cf - -T /tmp/pt-files.txt) | (cd modules/pujatime && tar xf -)
echo "synced from $SRC — re-apply ORUVIA_PATCHES.md"
