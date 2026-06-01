(function() {
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const preciseCheck = document.getElementById('precise');
    const rowCountSpan = document.getElementById('rowCount');
    const dataStatus = document.getElementById('dataStatus');
    const csvUpload = document.getElementById('csvUpload');
    const uploadBtn = document.getElementById('uploadCsvBtn');

    let fullData = [];
    let dataLoaded = false;

    function renderTable(filterText = '') {
        if (!dataLoaded) {
            tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px;">请先上传或等待CSV加载完成。</td></tr>`;
            rowCountSpan.textContent = '0 项';
            return;
        }
        let filtered = fullData;
        if (filterText.trim() !== '') {
            const keyword = filterText.trim().toLowerCase();
            const isPrecise = preciseCheck.checked;
            filtered = fullData.filter(row => {
                const name = (row['名称'] || '').toLowerCase();
                const platform = (row['平台'] || '').toLowerCase();
                const type = (row['类型'] || '').toLowerCase();
                if (isPrecise) {
                    return name === keyword;
                } else {
                    return name.includes(keyword) || platform.includes(keyword) || type.includes(keyword);
                }
            });
        }
        rowCountSpan.textContent = `${filtered.length} 项`;
        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px;">没有匹配的资源</td></tr>`;
            return;
        }
        let html = '';
        filtered.forEach((row, idx) => {
            const link = row['下载链接'] || '';
            html += `<tr>
                <td>${idx+1}</td>
                <td>${row['名称'] || '-'}</td>
                <td>${row['平台'] || '-'}</td>
                <td>${row['类型'] || '-'}</td>
                <td>${link ? `<a href="${link}" target="_blank" class="table-link">${link}</a>` : '-'}</td>
                <td>${row['提取码'] || '-'}</td>
                <td>${row['激活码'] || '-'}</td>
                <td>${row['作弊码'] || '-'}</td>
                <td>${row['礼包码'] || '-'}</td>
            </tr>`;
        });
        tableBody.innerHTML = html;
    }

    function parseCSV(text) {
        const rows = [];
        let current = '', inQuotes = false;
        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (ch === '"') {
                if (inQuotes && text[i+1] === '"') { current += '"'; i++; }
                else inQuotes = !inQuotes;
            } else if (ch === ',' && !inQuotes) {
                rows.push(current); current = '';
            } else if ((ch === '\r' || ch === '\n') && !inQuotes) {
                if (ch === '\r' && text[i+1] === '\n') i++;
                rows.push(current);
                if (rows.length) processRow(rows);
                rows.length = 0; current = '';
            } else { current += ch; }
        }
        if (current) rows.push(current);
        if (rows.length) processRow(rows);
    }

    const csvHeaders = [];
    let headerProcessed = false;
    const tempData = [];

    function processRow(row) {
        if (!headerProcessed) {
            row.forEach(h => csvHeaders.push(h.trim()));
            headerProcessed = true;
            return;
        }
        const obj = {};
        csvHeaders.forEach((key, idx) => {
            let val = row[idx] || '';
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1).replace(/""/g, '"');
            obj[key] = val;
        });
        if (obj['名称']) tempData.push(obj);
    }

    function handleCSVText(text) {
        csvHeaders.length = 0;
        headerProcessed = false;
        tempData.length = 0;
        parseCSV(text);
        fullData = tempData;
        dataLoaded = true;
        dataStatus.textContent = `已加载 ${fullData.length} 条数据`;
        rowCountSpan.textContent = `${fullData.length} 项`;
        tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px;">数据已就绪，请输入关键词搜索。</td></tr>`;
    }

    function loadCSVFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => handleCSVText(e.target.result);
        reader.readAsText(file, 'UTF-8');
    }

    function autoLoadCSV() {
        fetch('./csv/资源表格.csv')
            .then(response => {
                if (!response.ok) throw new Error('文件不存在');
                return response.text();
            })
            .then(text => handleCSVText(text))
            .catch(() => {
                dataStatus.textContent = '自动加载失败，可手动上传';
                tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px;">自动加载失败，请点击“手动上传CSV”选择文件。</td></tr>`;
            });
    }

    uploadBtn.addEventListener('click', () => csvUpload.click());
    csvUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        loadCSVFile(file);
    });
    searchBtn.addEventListener('click', () => renderTable(searchInput.value));
    searchInput.addEventListener('keyup', (e) => { if(e.key==='Enter') renderTable(searchInput.value); });

    autoLoadCSV();

    window.init_page1 = function() {};
})();
