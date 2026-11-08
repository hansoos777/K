#!/usr/bin/env python3
"""게임에 쓰인 글자만 남겨 글꼴을 작게 만든다(fonts/*.woff2).

글꼴을 사이트·앱 안에 직접 넣어서, 인터넷이 없거나 토스 앱 안에서도 같은 글씨가 나오게 한다.
화면 문구를 고치면 이 스크립트를 다시 돌려 주세요. 빠진 글자는 기기 기본 글꼴로 대신 나온다.

    pip install fonttools brotli
    python3 tools/subset_fonts.py <BlackHanSans.ttf> <Jua.ttf>

원본 TTF: https://fonts.google.com/specimen/Black+Han+Sans , https://fonts.google.com/specimen/Jua (SIL OFL 1.1)
"""
import sys
from pathlib import Path

from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
SOURCES = list((ROOT / 'js').glob('*.js')) + [ROOT / 'index.html', ROOT / 'style.css', ROOT / 'manifest.webmanifest', ROOT / 'tools' / 'store.html']
# 숫자·영문·문장부호는 늘 넣는다(점수, 콤보 등 코드에서 만들어지는 글자)
EXTRA = ''.join(chr(c) for c in range(0x20, 0x7F)) + '♥♡★☆…·×→←「」『』~!?%+-'


def used_chars() -> str:
    chars = set(EXTRA)
    for f in SOURCES:
        chars.update(f.read_text(encoding='utf-8'))
    return ''.join(sorted(c for c in chars if c.isprintable()))


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    text = used_chars()
    out = ROOT / 'fonts'
    out.mkdir(exist_ok=True)
    for src, name in [(sys.argv[1], 'blackhansans'), (sys.argv[2], 'jua')]:
        opts = subset.Options()
        opts.flavor = 'woff2'
        opts.layout_features = ['*']
        opts.name_IDs = ['*']
        opts.notdef_outline = True
        font = subset.load_font(src, opts)
        sub = subset.Subsetter(opts)
        sub.populate(text=text)
        sub.subset(font)
        dst = out / f'{name}.woff2'
        subset.save_font(font, str(dst), opts)
        print(f'{dst.relative_to(ROOT)}: {dst.stat().st_size // 1024} KB')
    print(f'글자 {len(text)}개')


if __name__ == '__main__':
    main()
