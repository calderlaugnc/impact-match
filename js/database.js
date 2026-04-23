// IMPACT MATCH - 資料庫（從 Supabase 讀取）
const SUPABASE_URL = 'https://silnlhygactdnmbffocc.supabase.co';
const API_KEY = 'sb_publishable_cN0NUBNGOHZNLrAVuKr_Ww_ni7iG-AA';

// 從 Supabase 獲取所有社企
async function getSocialEnterprises() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/social_enterprises?select=*&order=id.asc`, {
            headers: {
                'apikey': API_KEY,
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('獲取社企資料失敗:', error);
        return [];
    }
}

// 根據 ID 獲取單一社企
async function getSocialEnterpriseById(id) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/social_enterprises?id=eq.${id}&select=*`, {
            headers: {
                'apikey': API_KEY,
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('獲取社企詳情失敗:', error);
        return null;
    }
}

// 搜索社企（本地過濾）
async function searchSocialEnterprises(keyword, category) {
    const enterprises = await getSocialEnterprises();
    
    return enterprises.filter(se => {
        // 關鍵字匹配
        const keywordMatch = !keyword || 
            se.name.toLowerCase().includes(keyword.toLowerCase()) ||
            (se.name_en && se.name_en.toLowerCase().includes(keyword.toLowerCase())) ||
            se.mission.toLowerCase().includes(keyword.toLowerCase()) ||
            se.category.toLowerCase().includes(keyword.toLowerCase()) ||
            (se.service_tags && se.service_tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))) ||
            (se.impact_tags && se.impact_tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))) ||
            (se.products_services && se.products_services.some(ps => ps.toLowerCase().includes(keyword.toLowerCase())));
        
        // 類別匹配
        const categoryMatch = !category || category === 'all' || se.category === category;
        
        return keywordMatch && categoryMatch;
    });
}

// 提交企業需求到 Supabase
async function submitRequest(requestData) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/requests`, {
            method: 'POST',
            headers: {
                'apikey': API_KEY,
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return { success: true };
    } catch (error) {
        console.error('提交需求失敗:', error);
        return { success: false, error: error.message };
    }
}

// 保存配對結果
async function saveMatch(matchData) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/matches`, {
            method: 'POST',
            headers: {
                'apikey': API_KEY,
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(matchData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return { success: true };
    } catch (error) {
        console.error('保存配對結果失敗:', error);
        return { success: false, error: error.message };
    }
}

// 測試連接
async function testConnection() {
    const data = await getSocialEnterprises();
    console.log(`已連接 Supabase，共 ${data.length} 間社企`);
    return data.length > 0;
}
