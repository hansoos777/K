# 홈 메인 비주얼(새벽 산·안개·호수) 그리기: 특정 종교 상징 없이 모든 신앙을 아우르는 풍경. 사용: python3 scripts/hero-dawn.py
import numpy as np
from PIL import Image, ImageFilter
W, H = 2400, 1100
rng = np.random.default_rng(7)
y = np.linspace(0, 1, H)[:, None]
x = np.linspace(0, 1, W)[None, :]
def mix(a, b, t):
    a, b = np.array(a, float), np.array(b, float)
    return a + (b - a) * t[..., None]
# 하늘: 위는 차분한 회백색, 지평선으로 갈수록 따뜻한 새벽빛
sky = mix((226, 223, 216), (246, 233, 212), np.clip(y / 0.62, 0, 1) ** 1.4 * np.ones_like(x))
# 해 빛 번짐 (오른쪽 조금 위)
sx, sy = 0.64, 0.42
d = np.sqrt(((x - sx) * W / H) ** 2 + (y - sy) ** 2)
glow = np.exp(-(d / 0.2) ** 2)

sun = np.exp(-(d / 0.035) ** 6)
sky = sky + (np.array((255, 236, 200)) - sky) * glow[..., None] * 0.9
sky = sky + (np.array((255, 248, 232)) - sky) * sun[..., None]
img = sky.copy()
horizon = 0.77
def ridge(base, amp, freq, seed, rough):
    r = np.random.default_rng(seed)
    t = np.linspace(0, 1, W)
    h = np.zeros(W)
    for k in range(1, 7):
        h += np.sin(t * np.pi * freq * k * (0.9 + r.random() * 0.3) + r.random() * 6) * amp / (k ** rough)
    h += np.convolve(r.normal(0, amp * 0.06, W), np.ones(25) / 25, mode='same')
    return base - h
# 먼 산부터 가까운 산까지 (멀수록 옅게 = 대기 원근)
layers = [
    (0.50, 0.13, 1.1, 11, 1.25, (205, 202, 195)),
    (0.57, 0.12, 1.6, 12, 1.2, (183, 182, 175)),
    (0.63, 0.10, 2.2, 13, 1.15, (152, 156, 150)),
    (0.69, 0.08, 2.9, 14, 1.1, (115, 124, 119)),
    (0.74, 0.05, 3.8, 15, 1.05, (78, 88, 84)),
]
yy = np.arange(H)[:, None] / H
for i, (base, amp, freq, seed, rough, col) in enumerate(layers):
    top = ridge(base, amp, freq, seed, rough)[None, :]
    mask = (yy > top) & (yy < horizon)
    # 산 아래쪽은 안개로 옅어짐
    fade = np.clip((yy - top) / 0.08, 0, 1)
    c = mix(col, (238, 230, 216), np.clip((yy - top) / 0.18, 0, 1) * 0.28)
    img = np.where(mask[..., None], c, img)
    # 층 사이 안개 띠
    mist = np.exp(-((yy - (top + 0.03)) / 0.025) ** 2) * (yy < horizon)
    img = img + (np.array((246, 240, 230)) - img) * (mist[..., None] * 0.3)
# 호수: 위 풍경을 뒤집어 옅게 비춤 + 잔물결
above = img[int((2 * horizon - 1) * H) if False else 0: int(horizon * H)][::-1]
lake_h = H - int(horizon * H)
refl = above[:lake_h]
if refl.shape[0] < lake_h:
    refl = np.vstack([refl, np.repeat(refl[-1:], lake_h - refl.shape[0], 0)])
ly = np.linspace(0, 1, lake_h)[:, None]
water = refl * 0.62 + np.array((236, 230, 220)) * 0.38
water = water * (1 - ly[..., None] * 0.12)
ripple = (np.sin(np.arange(lake_h)[:, None] * 0.9 + rng.random((1, W)) * 0.5) * 0.5 + 0.5) * (rng.random((lake_h, W)) > 0.985)
water = water + ripple[..., None] * 14
img[int(horizon * H):] = water
# 수면 위 해 반사 줄기
rx = np.exp(-((x - sx) * W / H / 0.05) ** 2)
streak = rx * (yy > horizon) * np.exp(-((yy - horizon) / 0.25))
img = img + (np.array((255, 244, 222)) - img) * (streak[..., None] * 0.5)
out = Image.fromarray(np.clip(img, 0, 255).astype('uint8'))
# 부드럽게 + 아주 옅은 필름 입자
out = out.filter(ImageFilter.GaussianBlur(0.7))
noise = (rng.normal(0, 2.2, (H, W, 1))).repeat(3, 2)
out = Image.fromarray(np.clip(np.array(out, float) + noise, 0, 255).astype('uint8'))
out.save('/home/user/K/public/photos/hero_dawn.webp', 'WEBP', quality=82, method=6)
pass
print('ok', out.size)
