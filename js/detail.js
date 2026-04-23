// IMPACT MATCH - 詳情頁面

document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const seId = urlParams.get('id');
    
    if (!seId) {
        document.getElementById('se-name').textContent = '找不到社企';
        return;
    }
    
    // 從 Supabase 獲取社企資料
    const se = await getSocialEnterpriseById(seId);
    
    if (!se) {
        document.getElementById('se-name').textContent = '找不到社企';
        return;
    }
    
    // 填充資料
    document.getElementById('se-name').textContent = se.name;
    document.getElementById('se-name-en').textContent = se.name_en || '-';
    document.getElementById('se-year').textContent = se.year || '-';
    document.getElementById('se-category').textContent = se.category || '-';
    document.getElementById('se-districts').textContent = se.districts ? se.districts.join(', ') : '-';
    document.getElementById('se-languages').textContent = se.languages ? se.languages.join(', ') : '-';
    document.getElementById('se-mission').textContent = se.mission || '-';
    document.getElementById('se-target').textContent = se.target_group || '-';
    
    // 徽章
    if (se.see_mark_level) {
        document.getElementById('se-badge').textContent = 'SEE Mark ' + se.see_mark_level;
        document.getElementById('se-badge').style.display = 'inline-block';
    } else {
        document.getElementById('se-badge').style.display = 'none';
    }
    
    // 標籤
    const tagsContainer = document.getElementById('se-tags');
    let tagsHtml = '';
    
    if (se.service_tags) {
        se.service_tags.forEach(t => {
            tagsHtml += `<span class="tag tag-blue">${t}</span>`;
        });
    }
    if (se.impact_tags) {
        se.impact_tags.forEach(t => {
            tagsHtml += `<span class="tag tag-purple">${t}</span>`;
        });
    }
    if (se.enterprise_tags) {
        se.enterprise_tags.forEach(t => {
            tagsHtml += `<span class="tag tag-orange">${t}</span>`;
        });
    }
    tagsContainer.innerHTML = tagsHtml || '暫無標籤';
    
    // 產品服務
    const productsList = document.getElementById('se-products');
    if (se.products_services) {
        productsList.innerHTML = se.products_services.map(p => `<li>${p}</li>`).join('');
    } else {
        productsList.innerHTML = '<li>暫無資料</li>';
    }
    
    // ESG 方案
    const esgList = document.getElementById('se-esg');
    if (se.esg_plans) {
        esgList.innerHTML = se.esg_plans.map(e => `<li>${e}</li>`).join('');
    } else {
        esgList.innerHTML = '<li>暫無資料</li>';
    }
    
    // 網站
    const websiteSpan = document.getElementById('se-website');
    if (se.website) {
        websiteSpan.innerHTML = `<a href="${se.website}" target="_blank">${se.website}</a>`;
    } else {
        websiteSpan.textContent = '暫無資料';
    }
    
    // 聯絡方式
    const contactSpan = document.getElementById('se-contact');
    let contactInfo = [];
    if (se.email) contactInfo.push('電郵: ' + se.email);
    if (se.facebook) contactInfo.push('Facebook: ' + se.facebook);
    if (se.instagram) contactInfo.push('Instagram: ' + se.instagram);
    contactSpan.innerHTML = contactInfo.length > 0 ? contactInfo.join(' | ') : '請參閱官方網站';
    
    // 更新頁面標題
    document.title = `${se.name} — IMPACT MATCH`;
});
