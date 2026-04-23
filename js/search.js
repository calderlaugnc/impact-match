// IMPACT MATCH - 搜尋功能

// 搜尋函數（從 Supabase 獲取資料）
async function search() {
    const category = document.getElementById('category').value;
    const budget = document.getElementById('budget').value;
    const event = document.getElementById('event').value;
    const details = document.getElementById('details').value.toLowerCase();
    
    if (!category && !details && !event) {
        alert('請至少選擇一個需求類別或填寫詳細說明');
        return;
    }
    
    // 從 Supabase 獲取所有社企
    const socialEnterprises = await getSocialEnterprises();
    
    // 匹配算法
    let results = socialEnterprises.map(se => {
        let score = 0;
        let matchedReasons = [];
        
        // 類別匹配
        if (category && se.service_tags && se.service_tags.includes(category)) {
            score += 30;
            matchedReasons.push(`類別匹配: ${category}`);
        }
        if (category && se.impact_tags && se.impact_tags.some(t => t.includes(category))) {
            score += 15;
        }
        
        // 活動類型匹配
        const eventKeywords = {
            '節慶': ['禮品', '節慶', '中秋', '新年', '月餅', '曲奇'],
            '團隊': ['工作坊', '培訓', '團隊', '活動'],
            '家庭': ['家庭', '兒童', '親子'],
            '志願': ['志願', '服務', '捐贈', '公益'],
            '培訓': ['培訓', '工作坊', '課程'],
            '採購': ['禮品', '採購', '零售']
        };
        
        if (event && eventKeywords[event]) {
            const keywords = eventKeywords[event];
            const hasMatch = (se.products_services && se.products_services.some(p => keywords.some(k => p.includes(k))));
            if (hasMatch) {
                score += 20;
                matchedReasons.push(`活動類型匹配: ${event}`);
            }
        }
        
        // 關鍵詞匹配
        if (details) {
            const detailWords = details.split(/[\s,，。、]+/).filter(w => w.length > 1);
            let keywordMatches = 0;
            
            detailWords.forEach(word => {
                if (se.products_services && se.products_services.some(p => p.includes(word))) keywordMatches++;
                if (se.mission && se.mission.includes(word)) keywordMatches++;
                if (se.service_tags && se.service_tags.some(t => t.includes(word))) keywordMatches++;
                if (se.impact_tags && se.impact_tags.some(t => t.includes(word))) keywordMatches++;
            });
            
            if (keywordMatches > 0) {
                score += Math.min(keywordMatches * 10, 40);
                matchedReasons.push(`關鍵詞匹配`);
            }
        }
        
        // 企業方案標籤匹配
        if (se.enterprise_tags) {
            const enterpriseKeywords = ['ESG', 'CSR', '企業', '員工', '活動', '培訓'];
            enterpriseKeywords.forEach(k => {
                if (details.includes(k.toLowerCase()) && se.enterprise_tags.some(t => t.includes(k))) {
                    score += 5;
                }
            });
        }
        
        return { ...se, score, matchedReasons };
    });
    
    // 篩選和排序
    results = results.filter(se => se.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10);
    
    // 顯示結果
    displayResults(results);
}

function displayResults(results) {
    const resultsSection = document.getElementById('results');
    const resultsList = document.getElementById('results-list');
    const resultsCount = document.getElementById('results-count');
    
    resultsSection.classList.remove('hidden');
    resultsCount.textContent = `${results.length} 間社企`;
    
    if (results.length === 0) {
        resultsList.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <p>沒有找到匹配的社企</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">請嘗試調整搜索條件</p>
            </div>
        `;
        return;
    }
    
    resultsList.innerHTML = results.map(se => `
        <div class="result-card">
            <div class="result-header">
                <div class="result-name">
                    ${se.name} <span>| ${se.name_en || ''}</span>
                </div>
                <span class="match-score">${se.score}% 匹配</span>
            </div>
            <div class="result-mission">🎯 ${se.mission}</div>
            <div class="result-tags">
                ${se.service_tags ? se.service_tags.slice(0, 3).map(t => `<span class="tag tag-blue">${t}</span>`).join('') : ''}
                ${se.impact_tags ? se.impact_tags.slice(0, 2).map(t => `<span class="tag tag-purple">${t}</span>`).join('') : ''}
            </div>
            <div class="result-esg">
                <div class="result-esg-title">💡 ESG/CSR 合作方案</div>
                <ul>
                    ${se.esg_plans ? se.esg_plans.slice(0, 3).map(e => `<li>${e}</li>`).join('') : ''}
                </ul>
            </div>
            <div style="margin-top: 15px;">
                <a href="detail.html?id=${se.id}" class="btn btn-outline" style="padding: 8px 16px; font-size: 0.9rem;">查看詳情 →</a>
            </div>
        </div>
    `).join('');
    
    // 滾動到結果區域
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// URL 參數處理
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        document.getElementById('category').value = categoryParam;
        search();
    }
});
