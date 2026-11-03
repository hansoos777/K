-- 익명 사용 통계. 이름, 기도, 일기, 사진, IP는 저장하지 않음.
CREATE TABLE devices (
  id TEXT PRIMARY KEY,        -- 앱이 만든 무작위 번호
  first_day TEXT NOT NULL,
  last_at INTEGER NOT NULL,
  country TEXT,
  lang TEXT,
  deity TEXT
);
CREATE INDEX idx_devices_first ON devices(first_day);
CREATE INDEX idx_devices_last ON devices(last_at);

CREATE TABLE visits (
  day TEXT NOT NULL,
  device TEXT NOT NULL,
  PRIMARY KEY (day, device)
);

CREATE TABLE counters (
  day TEXT NOT NULL,
  key TEXT NOT NULL,
  n INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, key)
);

-- 관리자 비밀번호 오입력 차단. IP 원문이 아니라 해시만 보관
CREATE TABLE admin_fails (
  ip_hash TEXT PRIMARY KEY,
  n INTEGER NOT NULL,
  until INTEGER NOT NULL
);
