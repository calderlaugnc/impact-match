-- ========================================
-- IMPACT MATCH - Supabase 資料庫結構
-- 執行方式：Supabase Dashboard → SQL Editor → 貼上執行
-- ========================================

-- 1. 社企資料表
CREATE TABLE IF NOT EXISTS social_enterprises (
    id TEXT PRIMARY KEY,              -- SE-001, SE-002...
    name TEXT NOT NULL,               -- 中文名稱
    name_en TEXT,                     -- 英文名稱
    year INTEGER,                     -- 成立年份
    mission TEXT,                    -- 使命
    target_group TEXT,                -- 服務對象
    category TEXT,                    -- 類別
    service_tags TEXT[],              -- 服務標籤（陣列）
    impact_tags TEXT[],               -- 社會影響標籤
    enterprise_tags TEXT[],           -- 企業方案標籤
    products_services TEXT[],         -- 產品/服務列表
    esg_plans TEXT[],                 -- ESG方案
    website TEXT,
    email TEXT,
    facebook TEXT,
    instagram TEXT,
    location TEXT,
    districts TEXT[],
    sdgs TEXT[],
    see_mark_level TEXT,              -- SEE Mark 認證級別
    languages TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. 企業需求表
CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT,
    contact_name TEXT,
    contact_email TEXT NOT NULL,
    budget TEXT,                      -- e.g. "1-2萬", "5萬以下"
    timeline TEXT,                    -- e.g. "一個月內", "三個月"
    purpose TEXT,                    -- 採購目的
    target_group TEXT,               -- 想支持的群體
    event_type TEXT,                 -- 活動類型
    quantity TEXT,                   -- 數量/人數
    additional_notes TEXT,
    status TEXT DEFAULT 'pending',   -- pending, processed
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. 配對結果表
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
    enterprise_id TEXT REFERENCES social_enterprises(id),
    match_score INTEGER,              -- 匹配度 0-100
    match_reasons TEXT[],            -- 匹配原因
    recommended_plan TEXT,           -- 推薦方案
    notes TEXT,
    status TEXT DEFAULT 'pending',   -- pending, sent, accepted, rejected
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. 啟用 Row Level Security（RLS）— 讓 anon key 可以讀取
ALTER TABLE social_enterprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- 5. 設定讀取權限（公開讀取）
CREATE POLICY "Allow anonymous read social_enterprises" 
    ON social_enterprises FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read requests" 
    ON requests FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read matches" 
    ON matches FOR SELECT USING (true);

-- 6. 設定寫入權限（匿名可新增需求）
CREATE POLICY "Allow anonymous insert requests" 
    ON requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert matches" 
    ON matches FOR INSERT WITH CHECK (true);

-- 7. 啟用即時功能（實時更新 UI）
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE requests;

-- 完成！
SELECT 'IMPACT MATCH 資料庫結構已建立！' AS status;
