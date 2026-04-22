// IMPACT MATCH - 詳情頁面

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const seId = urlParams.get('id');
    
    if (!seId) {
        document.getElementById('se-name').textContent = '找不到社企';
        return;
    }
    
    const se = socialEnterprises.find(s => s.id === seId);
    
    if (!se) {
        document.getElementById('se-name').textContent = '找不到社企';
        return;
    }
    
    // 填充資料
    document.getElementById('se-name').textContent = se.name;
    document.getElementById('se-name-en').textContent = se.nameEn;
    document.getElementById('se-year').textContent = se.year || '-';
    document.getElementById('se-category').textContent = se.category || '-';
    document.getElementById('se-districts').textContent = se.districts ? se.districts.join(', ') : '-';
    document.getElementById('se-languages').textContent = se.languages ? se.languages.join(', ') : '-';
    document.getElementById('se-mission').textContent = se.mission || '-';
    document.getElementById('se-target').textContent = se.targetGroup || '-';
    
    // 徽章
    if (se.seeMarkLevel) {
        document.getElementById('se-badge').textContent = 'SEE Mark ' + se.seeMarkLevel;
        document.getElementById('se-badge').style.display = 'inline-block';
    } else {
        document.getElementById('se-badge').style.display = 'none';
    }
    
    // 標籤
    const tagsContainer = document.getElementById('se-tags');
    let tagsHtml = '';
    
    if (se.serviceTags) {
        se.serviceTags.forEach(t => {
            tagsHtml += `<span class="tag tag-blue">${t}</span>`;
        });
    }
    if (se.impactTags) {
        se.impactTags.forEach(t => {
            tagsHtml += `<span class="tag tag-purple">${t}</span>`;
        });
    }
    if (se.enterpriseTags) {
        se.enterpriseTags.forEach(t => {
            tagsHtml += `<span class="tag tag-orange">${t}</span>`;
        });
    }
    tagsContainer.innerHTML = tagsHtml || '暫無標籤';
    
    // 產品服務
    const productsList = document.getElementById('se-products');
    if (se.productsServices) {
        productsList.innerHTML = se.productsServices.map(p => `<li>${p}</li>`).join('');
    } else {
        productsList.innerHTML = '<li>暫無資料</li>';
    }
    
    // ESG 方案
    const esgList = document.getElementById('se-esg');
    if (se.esgPlans) {
        esgList.innerHTML = se.esgPlans.map(e => `<li>${e}</li>`).join('');
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
    if (se.phone) contactInfo.push('電話: ' + se.phone);
    if (se.email) contactInfo.push('電郵: ' + se.email);
    contactSpan.textContent = contactInfo.length > 0 ? contactInfo.join(' | ') : '請參閱官方網站';
    
    // 更新頁面標題
    document.title = `${se.name} — IMPACT MATCH`;
});
