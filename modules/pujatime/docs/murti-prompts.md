# 실사 신상 만들기

순서: AI 이미지 → TRELLIS.2 → GLB → `public/models/<id>.glb`

1. 아래 문구로 이미지를 만듭니다. 머리부터 받침까지 전부 나오고 잘린 곳이 없어야 합니다.
2. https://huggingface.co/spaces/microsoft/TRELLIS.2 에 이미지를 넣고 GLB를 받습니다.
3. 파일 이름을 아래 표대로 바꿔 Claude에게 주면 용량을 줄여 앱에 넣습니다.

먼저 가네샤 하나만 시험하고, 품질이 괜찮으면 나머지 다섯을 만듭니다.

## 공통 문구

모든 프롬프트 끝에 붙입니다.

```
full body from top of crown to the base, centered, front view, polished antique gold metal sculpture, traditional Indian temple murti, solid single piece, even soft studio light, plain white background, no text, no people, no extra limbs
```

## 신별 문구

| 파일 | 프롬프트 |
|---|---|
| `ganesha.glb` | Lord Ganesha seated on a lotus base, elephant head with one broken tusk, four arms, holding a modak, axe, noose, one hand raised in blessing |
| `shiva.glb` | Lord Shiva seated in meditation on a base, crescent moon and coiled hair, third eye, serpent around the neck, holding a trident and damaru |
| `krishna.glb` | Lord Krishna standing with crossed legs playing a flute, peacock feather in his crown, garland, two arms |
| `lakshmi.glb` | Goddess Lakshmi seated on a lotus, four arms, two hands holding lotus flowers, one hand in blessing, one hand pouring coins, ornate crown |
| `vishnu.glb` | Lord Vishnu standing on a lotus base, four arms holding a conch, discus, mace and lotus, tall ornate crown |
| `durga.glb` | Goddess Durga seated on a lion, eight arms holding a trident, sword, conch, discus, bow and lotus, ornate crown, calm face |

## 확인할 것

- 팔 개수와 손에 든 물건이 맞는지 봅니다. 틀린 신상은 결례가 되므로 공개 전 전문가 검토를 받습니다.
- 얼굴이 뭉개지거나 팔이 더 생기면 다시 만듭니다. 앱에는 수정 없이 넣지 않습니다.
- TRELLIS.2 모델과 코드는 MIT 라이선스입니다. 입력 이미지를 만든 서비스의 상업 이용 조건은 별도로 확인합니다.
