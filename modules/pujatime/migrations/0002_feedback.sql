-- 설정의 "운영자에게 의견 보내기". 메일이 실패해도 관리자 화면에서 볼 수 있게 저장
CREATE TABLE feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at INTEGER NOT NULL,
  text TEXT NOT NULL,
  contact TEXT,
  lang TEXT,
  ip_hash TEXT NOT NULL,      -- 도배 방지용 해시. IP 원문은 저장하지 않음
  mailed INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_feedback_ip ON feedback(ip_hash, at);
