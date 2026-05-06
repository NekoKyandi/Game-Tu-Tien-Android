
// ----- CẤU TRÚC LƯU TRỮ HỆ THỐNG (CHỈ KHAI BÁO 1 LẦN) -----
let fs, path, ipcRenderer, saveFilePath;

// 1. Hàm kiểm tra điều kiện hiện Pop-up
function checkSectPopup() {
    const modal = document.getElementById('sect-modal');
    if (!modal) return; // Phòng trường hợp element chưa load

    // ĐIỬU KIỆN: Cảnh giới >= 1 (Luyện Khí) Vì Tông môn vẫn là mặc định ("" hoặc "Tán Tu")
    const isReadyForSect = player.canhGioiIndex >= 1 && 
                           (player.tongMon === "" || player.tongMon === "Tán Tu");

    if (isReadyForSect) {
        modal.style.display = 'flex';
    } else {
        modal.style.display = 'none';
    }
}

// 2. Hàm gia nhập Tông môn
function joinSect(sectName) {
    // 1. Cập nhật dữ liệu trong code
    player.tongMon = sectName; 
    
    // 2. Cập nhật hiển thị chữ "Tông Môn" trên màn hình nhân vật
    const tongMonDisplay = document.getElementById('tong-mon');
    if (tongMonDisplay) {
        tongMonDisplay.innerText = sectName;
    }
    if (isReadyForSect) {
        modal.style.display = 'flex';
    } else {
        modal.style.display = 'none';
    }
    
    // 3. Lưu vào bộ nhớ để khi load lại trang không bị mất
    saveGame();
    updateUI(); // Cập nhật lại giao diện để hiển thị tông môn mới
    // 4. Ghi nhật ký hành trình
    logAction(`Cung hỉ! Đạo hữu đã chính thức gia nhập ${sectName}.`, "system");

}

// 3. Khởi chạy khi vào game
window.onload = function() {
    // Đảm bảo dữ liệu player đã được load từ save trước khi check
    // loadGame(); 
    checkSectPopup();
};

function switchTab(tabName, buttonEl) {
    // 1. Ẩn tất cả các tab
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // 2. Hiện tab được chọn
    if (tabName === 'character') {
        document.getElementById('character-tab').classList.add('active');
    } else {
        document.getElementById('inventory-tab').classList.add('active');
    }

    if (buttonEl) buttonEl.classList.add('active');
}

try {
    // Kiểm tra xem có đang chạy trong Electron không
    fs = require('fs');
    path = require('path');
    ipcRenderer = require('electron').ipcRenderer;

    // Lấy đường dẫn từ main.js
    const userDataPath = ipcRenderer.sendSync('get-path-user-data');
    saveFilePath = path.join(userDataPath, 'savegame.json');
} catch (e) {
    console.warn("Môi trường trình duyệt: Tắt tính năng lưu file hệ thống.");
}

// Đại Cảnh Giới & Tỷ lệ đột phá Đại Bình Cảnh
const dsCanhGioi = [
    { name: "Phàm Nhân", maxLevel: 1, rate: 100 },
    { name: "Luyện Khí Kỳ", maxLevel: 9, rate: 30 },
    { name: "Trúc Cơ Kỳ", maxLevel: 9, rate: 30 },
    { name: "Kim Đan Kỳ", maxLevel: 9, rate: 10 },
    { name: "Nguyên Anh Kỳ", maxLevel: 9, rate: 5 },
    { name: "Hóa Thần Kỳ", maxLevel: 9, rate: 1 }
];

const trangBiType = ["Phàm", "Linh", "Pháp", "Tiên"];

// Scale Map khổng lồ theo cảnh giới
const dsBanDo = [
    { id: 0, name: "Ngoại Ô Thôn Làng", minRealm: 0, mobName: ["Lợn Rừng", "Sói Xám"], eAtk: 15, eDef: 2, eHp: 50, expMin: 15, expMax: 25, ltMin: 2, ltMax: 5, dropRate: 0.1 },
    { id: 1, name: "Yêu Thú Sâm Lâm", minRealm: 1, mobName: ["Huyết Mãng", "Yêu Hồ"], eAtk: 100, eDef: 30, eHp: 800, expMin: 100, expMax: 150, ltMin: 15, ltMax: 30, dropRate: 0.1 },
    { id: 2, name: "Vạn Cốt Cốc", minRealm: 2, mobName: ["Khung Cốt Lính", "Oán Hồn"], eAtk: 800, eDef: 250, eHp: 8000, expMin: 800, expMax: 1200, ltMin: 150, ltMax: 300, dropRate: 0.1 },
    { id: 3, name: "Huyết Hải Bí Cảnh", minRealm: 3, mobName: ["Huyết Ma", "Giao Long"], eAtk: 6000, eDef: 2000, eHp: 80000, expMin: 5000, expMax: 10000, ltMin: 1000, ltMax: 2500, dropRate: 0.1 },
    { id: 4, name: "Hư Không Liệt Thổ", minRealm: 4, mobName: ["Hư Không Cự Thú", "Ma Vương"], eAtk: 50000, eDef: 15000, eHp: 1000000, expMin: 50000, expMax: 120000, ltMin: 15000, ltMax: 30000, dropRate: 0.1 }
];

const itemPrices = { "Hồi Huyết Đan": 20, "Phá Cảnh Đan": 100, "Thảo Dược": 5, "Khoáng Thạch": 8, "Tài Liệu Yêu Thú": 15 };

const dbCongPhap = {
    "Hỏa Cầu Thuật": { mult: 1.5, mpCost: 150 },
    "Thanh Phong Kiếm Quyết": { mult: 2, mpCost: 200 },
    "Lôi Ấn": { mult: 2.8, mpCost: 280 },
    "Cửu Hà Kiếm Quyết": { mult: 2, mpCost: 200 },
    "Thiên Lôi Dẫn": { mult: 3, mpCost: 350 },
    "Phá Thiên Nhất Kích": { mult: 5, mpCost: 600 }
};

function getCongPhapInfo(skillName) {
    return dbCongPhap[skillName] || { mult: 1.5, mpCost: 10 };
}

let defaultPlayer = {
    canhGioiIndex: 0,
    tieuCanhGioi: 1, // Tầng 1 đến 9
    tuVi: 0, maxTuVi: 100,
    khiHuyet: 100,
    maxKhiHuyet: 100,
    linhLuc: 50,
    maxLinhLuc: 50,
    tanCongCoBan: 10,
    phongThuCoBan: 5,
    linhThach: 50,
    tongMon: "",
    buffDotPha: 0,
    buffTuKhi: 0,
    buaChu: 0,
    veBiCanh: 3,
    luyenTheLevel: 0,
    currentMap: 0, 
    currentQuest: null,
    congPhapHocDuoc: [],
    trangBiCongPhap: "",
    inventory: { "Thảo Dược": 0, "Khoáng Thạch": 0, "Tài Liệu Yêu Thú": 0, "Túi Trữ Vật": 0 },
    trangBi: {
        vuKhi: { name: "Kiếm Rỉ", level: 0, base: 5, tier: 0 },
        phapY: { name: "Vải Thô", level: 0, base: 2, tier: 0 },
        phapBao: { name: "Bùa Hộ Mệnh", level: 0, base: 20, tier: 0 }
    }
};

let player = JSON.parse(JSON.stringify(defaultPlayer));
let autoInterval = null; 
let currentAutoMode = null; 
let passiveCultivationInterval = null;
let currentLogTab = 'all';


let activeEnemy = null; 

function normalizePlayer(savedPlayer = {}) {
    const merged = {
        ...defaultPlayer,
        ...savedPlayer,
        inventory: { ...defaultPlayer.inventory, ...normalizeInventoryKeys(savedPlayer.inventory || {}) },
        trangBi: {
            vuKhi: { ...defaultPlayer.trangBi.vuKhi, ...((savedPlayer.trangBi || {}).vuKhi || {}), name: defaultPlayer.trangBi.vuKhi.name },
            phapY: { ...defaultPlayer.trangBi.phapY, ...((savedPlayer.trangBi || {}).phapY || {}), name: defaultPlayer.trangBi.phapY.name },
            phapBao: { ...defaultPlayer.trangBi.phapBao, ...((savedPlayer.trangBi || {}).phapBao || {}), name: defaultPlayer.trangBi.phapBao.name }
        }
    };

    if (!Array.isArray(merged.congPhapHocDuoc)) merged.congPhapHocDuoc = [];
    merged.congPhapHocDuoc = merged.congPhapHocDuoc.map(normalizeVietnameseText).filter(sp => dbCongPhap[sp]);
    merged.tongMon = normalizeVietnameseText(merged.tongMon || "");
    merged.trangBiCongPhap = normalizeVietnameseText(merged.trangBiCongPhap || "");
    if (!merged.trangBiCongPhap || !dbCongPhap[merged.trangBiCongPhap]) merged.trangBiCongPhap = "";
    return merged;
}

function normalizeVietnameseText(value) {
    const legacyTextMap = {
        "Tán Tu": "Tán Tu",
        "Kiếm Tông": "Kiếm Tông",
        "Dược Cốc": "Dược Cốc",
        "Ma Tông": "Ma Tông",
        "Hồi Huyết Đan": "Hồi Huyết Đan",
        "Phá Cảnh Đan": "Phá Cảnh Đan",
        "Thảo Dược": "Thảo Dược",
        "Khoáng Thạch": "Khoáng Thạch",
        "Tài Liệu Yêu Thú": "Tài Liệu Yêu Thú",
        "Túi Trữ Vật": "Túi Trữ Vật",
        "Thiên Đạo Kết Tinh": "Thiên Đạo Kết Tinh"
    };
    return legacyTextMap[value] || value;
}

function normalizeInventoryKeys(inventory) {
    return Object.entries(inventory).reduce((result, [key, value]) => {
        const fixedKey = normalizeVietnameseText(key);
        result[fixedKey] = (result[fixedKey] || 0) + value;
        return result;
    }, {});
}

window.onload = function() {
    if (!document.getElementById('game-container')) return;

    loadGame();
    if(!player.currentQuest) generateQuest();
    updateUI();
    addLog("Hệ thống khởi động. Nhục thân tuy phàm, Đạo tâm bất diệt!", "system");
    setInterval(() => { saveGame(false); updateUI(); }, 30000); 
    passiveCultivationInterval = setInterval(passiveTuLuyen, 3000); // 3s nhận Tu vi 1 lần
};

// ----- CÁC HìM TÍNH TOÁN CHỈ SỐ -----
function getTongAtk() {
    let atk = player.tanCongCoBan + player.trangBi.vuKhi.base + (player.trangBi.vuKhi.level * (player.canhGioiIndex+1) * 5);
    if(player.tongMon === "Kiếm Tông") atk *= 1.2; // Kiếm tông +20%
    return Math.floor(atk);
}
function getTongDef() {
    let def = player.phongThuCoBan + player.trangBi.phapY.base + (player.trangBi.phapY.level * (player.canhGioiIndex+1) * 3);
    def += (player.luyenTheLevel * 20); 
    return Math.floor(def);
}
function getTongMaxHP() {
    let hp = player.maxKhiHuyet + player.trangBi.phapBao.base + (player.trangBi.phapBao.level * (player.canhGioiIndex+1) * 20);
    hp += (player.luyenTheLevel * 200); 
    return Math.floor(hp);
}

function getChienLuc() {
    return (getTongAtk() * 2) + (getTongDef() * 3) + getTongMaxHP();
}

// ----- UI & RENDER -----
function updateBar(idBar, idText, current, max) {
    if (!max || max <= 0) {
        document.getElementById(idBar).style.width = "0%";
        document.getElementById(idText).innerText = "0 / 0";
        return;
    }

    let percent = (current / max) * 100;
    if(percent > 100) percent = 100;
    document.getElementById(idBar).style.width = percent + "%";
    
    // Format số lớn
    let textCur = current > 10000 ? (current/1000).toFixed(1) + 'k' : Math.floor(current);
    let textMax = max > 10000 ? (max/1000).toFixed(1) + 'k' : max;
    document.getElementById(idText).innerText = `${textCur} / ${textMax}`;
}

function renderMaps() {
    const mapSelect = document.getElementById('map-selection');
    mapSelect.innerHTML = "";
    dsBanDo.forEach(map => {
        if(player.canhGioiIndex >= map.minRealm) {
            let selected = (player.currentMap === map.id) ? "selected" : "";
            mapSelect.innerHTML += `<option value="${map.id}" ${selected}>🗺️ ${map.name} (Yêu cầu: ${dsCanhGioi[map.minRealm].name})</option>`;
        }
    });
}

function renderSkills() {
    const select = document.getElementById('skill-selection');
    if (!select) return;
    select.innerHTML = `<option value="">[Đánh Thường]</option>`;
    player.congPhapHocDuoc.forEach(sp => {
        let selected = (player.trangBiCongPhap === sp) ? "selected" : "";
        let info = getCongPhapInfo(sp);
        select.innerHTML += `<option value="${sp}" ${selected}>${sp} (Dmg x${info.mult}, tốn ${info.mpCost}MP)</option>`;
    });
}

function changeMap() {
    player.currentMap = parseInt(document.getElementById('map-selection').value); 
    activeEnemy = null; // Đổi map thì reset quái đang đánh
    updateEnemyUI();
}
function equipSkill() {
    player.trangBiCongPhap = document.getElementById('skill-selection').value;
    saveGame(false);
    updateUI();
}

function updateUI() {
    player = normalizePlayer(player);
    let major = dsCanhGioi[player.canhGioiIndex];
    let realmStr = major.name;
    if(major.maxLevel > 1) realmStr += ` - Tầng ${player.tieuCanhGioi}`;
    document.getElementById('canh-gioi').innerText = realmStr;
    
    let maxHP = getTongMaxHP();
    if(player.khiHuyet > maxHP) player.khiHuyet = maxHP;

    updateBar('bar-exp', 'text-exp', player.tuVi, player.maxTuVi);
    updateBar('bar-hp', 'text-hp', player.khiHuyet, maxHP);
    updateBar('bar-mp', 'text-mp', player.linhLuc, player.maxLinhLuc);

    document.getElementById('chien-luc').innerText = getChienLuc().toLocaleString();
    document.getElementById('tan-cong').innerText = getTongAtk().toLocaleString();
    document.getElementById('phong-thu').innerText = getTongDef().toLocaleString();
    document.getElementById('linh-thach').innerText = player.linhThach.toLocaleString()
    document.getElementById('luyen-the-lv').innerText = player.luyenTheLevel;
    document.getElementById('so-ve-bicong').innerText = player.veBiCanh;;

    let isMajorBreak = (player.tieuCanhGioi === major.maxLevel);
    document.getElementById('ty-le-dot-pha').innerText = (player.canhGioiIndex >= dsCanhGioi.length-1 && isMajorBreak) ? "MAX" : `${isMajorBreak ? major.rate : 70}% (+${player.buffDotPha.toFixed(1)}%)`;
    document.getElementById('so-bua-chu').innerText = player.buaChu;
    document.getElementById('buff-tu-khi').innerText = player.buffTuKhi + " lượt";
    document.getElementById('tong-mon').innerText = player.tongMon || "Tán Tu";


    let sectDiv = document.getElementById('sect-selection');
    let canChooseSect = player.canhGioiIndex >= 1 && (player.tongMon === "" || player.tongMon === "Tán Tu");
    if (sectDiv) sectDiv.style.display = canChooseSect ? "grid" : "none";

    document.getElementById('btn-dot-pha').disabled = !(player.tuVi >= player.maxTuVi);
    let modalLinhThach = document.getElementById('modal-linh-thach');
    if(modalLinhThach) modalLinhThach.innerText = player.linhThach.toLocaleString();


    renderQuest();
    renderMaps();
    renderSkills();
    renderInventory();
    renderEquipment();
}

function updateEnemyUI() {
    let panel = document.getElementById('enemy-panel');
    panel.style.display = 'block';
    if(!activeEnemy) {
        document.getElementById('enemy-name').innerText = "ĐANG TÌM MỤC TIÊU...";
        document.getElementById('enemy-name').style.color = "#fca5a5"; // Màu
        document.getElementById('enemy-stats').innerText = `ATK: 0 | DEF: 0`;
        
        // Cập nhật thanh máu về 0/0
        updateBar('bar-enemy-hp', 'text-enemy-hp', 0, 0);
        
    } else {
        panel.style.display = 'block';
        document.getElementById('enemy-name').innerText = activeEnemy.name + (activeEnemy.isBoss ? " [BOSS]" : "");
        document.getElementById('enemy-name').style.color = activeEnemy.isBoss ? "#d946ef" : (activeEnemy.isPK ? "#fb923c" : "#fca5a5");
        document.getElementById('enemy-stats').innerText = `ATK: ${activeEnemy.atk.toLocaleString()} | DEF: ${activeEnemy.def.toLocaleString()}`;
        updateBar('bar-enemy-hp', 'text-enemy-hp', activeEnemy.hp, activeEnemy.maxHp);
    }
}

function renderQuest() {
    if(!player.currentQuest) return;
    let q = player.currentQuest;
    let progress = player.inventory[q.item] || 0;
    let color = progress >= q.req ? "#4ade80" : "#e0e0e0";
    document.getElementById('quest-desc').innerHTML = `Thu thập: <b>${q.item}</b> <span style="color:${color}">(${progress}/${q.req})</span>`;
    document.getElementById('quest-reward').innerText = `Thưởng: ${q.reward.toLocaleString()} 💎`;
}

function renderEquipment() {
    const list = document.getElementById('trang-bi-list');
    list.innerHTML = "";
    const equips = [ { key: 'vuKhi', stat: 'ATK' }, { key: 'phapY', stat: 'DEF' }, { key: 'phapBao', stat: 'HP' } ];

    equips.forEach(eq => {
        let item = player.trangBi[eq.key];
        let cost = (item.level + 1) * 300 * (player.canhGioiIndex + 1); // Cost scale theo cảnh giới
        list.innerHTML += `
            <div class="box-item flex-between">
                <div>
                    <div class="tier-${item.tier}" style="font-weight:bold;">[${trangBiType[item.tier]}] ${item.name} +${item.level}</div>
                </div>
                <button class="btn-upgrade" onclick="upgradeEquip('${eq.key}', ${cost})">Tế Luyện (${cost}💎)</button>
            </div>
        `;
    });
}

function renderInventory() {
    const invList = document.getElementById('inventory-list');
    invList.innerHTML = ""; 
    for (let item in player.inventory) {
        if (player.inventory[item] > 0) {
            let btnHtml = "";
            if (itemPrices[item]) btnHtml += `<button class="btn-upgrade" style="margin-left:5px;" onclick="sellItem('${item}')">Bán</button>`;
            if (item === "Hồi Huyết Đan" || item === "Phá Cảnh Đan" || item === "Túi Trữ Vật") {
                btnHtml += `<button class="btn-upgrade" style="margin-left:5px; background:#1e3a8a;" onclick="useItem('${item}')">Dùng</button>`;
            }
            
            invList.innerHTML += `
                <div class="box-item flex-between">
                    <span>${item} <b style="color:#fde047">x${player.inventory[item]}</b></span>
                    <div>${btnHtml}</div>
                </div>
            `;
        }
    }
}

// ----- LOGIC UI BỔ SUNG -----
function switchLogTab(tab) {
    currentLogTab = tab;
    document.getElementById('tab-all').classList.remove('active'); document.getElementById('tab-sys').classList.remove('active'); document.getElementById('tab-cmb').classList.remove('active');
    if(tab==='all') document.getElementById('tab-all').classList.add('active');
    else if(tab==='system') document.getElementById('tab-sys').classList.add('active');
    else if(tab==='combat') document.getElementById('tab-cmb').classList.add('active');
    
    const logs = document.querySelectorAll('.log-entry');
    logs.forEach(log => {
        if (tab === 'all') log.style.display = 'block';
        else if (tab === 'system') log.style.display = log.classList.contains('log-sys') ? 'block' : 'none';
        else if (tab === 'combat') log.style.display = log.classList.contains('log-cmb') ? 'block' : 'none';
    });
}

function addLog(message, tabType = "system", colorClass = "log-system") {
    const logBox = document.getElementById('log-box');
    let displayType = (currentLogTab === 'all' || currentLogTab === tabType) ? 'block' : 'none';
    let tabClass = tabType === 'system' ? 'log-sys' : 'log-cmb';
    logBox.innerHTML += `<div class="log-entry ${tabClass} ${colorClass}" style="display:${displayType}">[${new Date().toLocaleTimeString()}] ${message}</div>`;
    logBox.scrollTop = logBox.scrollHeight;
}

function openShop() { document.getElementById('shop-modal').style.display = 'flex'; updateUI(); }
function closeShop() { document.getElementById('shop-modal').style.display = 'none'; }
function closeShopOutside(event) { if (event.target.id === 'shop-modal') closeShop(); }


// ----- LOGIC GAME (NHIỆM VỤ & CHẾ TẠO) -----
function generateQuest() {
    const reqs = [
        { item: "Thảo Dược", min: 10, max: 30, rwMult: 8 },
        { item: "Khoáng Thạch", min: 5, max: 20, rwMult: 12 },
        { item: "Tài Liệu Yêu Thú", min: 5, max: 15, rwMult: 20 }
    ];
    let type = reqs[Math.floor(Math.random() * reqs.length)];
    let amount = Math.floor(Math.random() * (type.max - type.min + 1)) + type.min;
    let baseReward = amount * type.rwMult * (player.canhGioiIndex + 1); // Scale phần thưởng
    
    player.currentQuest = { item: type.item, req: amount, reward: baseReward };
    updateUI();
}

function refreshQuest() {
    if(player.linhThach >= 50) {
        player.linhThach -= 50;
        generateQuest();
        addLog("Đã hối lộ trưởng lão để đổi nhiệm vụ mới.", "log-system");
    } else addLog("Không đủ 50 Linh Thạch để đổi nhiệm vụ!", "log-combat");
}

function submitQuest() {
    let q = player.currentQuest;
    if(player.inventory[q.item] >= q.req) {
        player.inventory[q.item] -= q.req;
        player.linhThach += q.reward;
        addLog(`Hoàn thành nhiệm vụ! Nhận được ${q.reward} Linh Thạch.`, "system", "log-gain");
        generateQuest();
    } else {
        addLog(`Chưa thu thập đủ ${q.req} ${q.item}!`, "system", "log-combat");
    }
}

function craftItem(itemName) {
    if (itemName === 'Hồi Huyết Đan') {
        if (itemName === 'Hồi Huyết Đan' && (player.inventory["Thảo Dược"]||0) >= 2) {
        player.inventory["Thảo Dược"] -= 2; player.inventory["Hồi Huyết Đan"] = (player.inventory["Hồi Huyết Đan"]||0) + 1;
        addLog("Luyện thành công Hồi Huyết Đan.", "system");
        } else addLog("Thiếu Thảo Dược để luyện đan!", "log-combat");
    } else if (itemName === 'Phá Cảnh Đan' && (player.inventory["Thảo Dược"]||0) >= 5 && (player.inventory["Khoáng Thạch"]||0) >= 2) {
        player.inventory["Thảo Dược"] -= 5; player.inventory["Khoáng Thạch"] -= 2; player.inventory["Phá Cảnh Đan"] = (player.inventory["Phá Cảnh Đan"]||0) + 1;
        addLog("Luyện thành công Phá Cảnh Đan.", "system");
    } else addLog("Thiếu nguyên liệu luyện đan!", "system", "log-combat");
    updateUI();
}

function sellItem(itemName) {
    if (player.inventory[itemName] > 0 && itemPrices[itemName]) {
        let qty = player.inventory[itemName];
        let earned = qty * itemPrices[itemName];
        player.inventory[itemName] = 0; // Bán hết một lần cho nhanh
        player.linhThach += earned;
        addLog(`Giao dịch thành công, bán ${qty} ${itemName} thu được ${earned} 💎.`, "log-system");
        updateUI();
    }
}

function useItem(itemName) {
    if (player.inventory[itemName] > 0) {
        player.inventory[itemName]--;
        if (itemName === "Hồi Huyết Đan") {
            let heal = Math.floor(getTongMaxHP() * 0.4);
            player.khiHuyet = Math.min(getTongMaxHP(), player.khiHuyet + heal); // Không vượt quá Max HP
            addLog(`Nuốt Hồi Huyết Đan, khôi phục ${heal} HP.`, "system", "log-gain");
        } 
        else if (itemName === "Phá Cảnh Đan") {
            // Tính toán lại tỷ lệ hiện tại ngay lúc này
            let major = dsCanhGioi[player.canhGioiIndex];
            let isMajorBreak = (player.tieuCanhGioi === major.maxLevel);
            let tiLeHienTai = (isMajorBreak ? major.rate : 90) + player.buffDotPha;

            if (tiLeHienTai < 100) {
                player.buffDotPha += 1;
                addLog("Tỷ lệ đột phá tăng thêm 1%.", "system", "log-gain");
            } else {
                addLog("Tỷ lệ đột phá đã đạt cực hạn (100%), không cần dùng thêm!", "system", "log-warning");
                // Hoàn trả lại đan dược nếu đã 100%
                player.inventory[itemName]++; 
            }
            updateUI(); // Gọi hàm cập nhật chung
            renderInventory();
            saveGame();
        }
        else if (itemName === "Túi Trữ Vật") {
            let lt = Math.floor(Math.random() * 500) + 100 * (player.canhGioiIndex+1); player.linhThach += lt;
            let ore = Math.floor(Math.random() * 10) + 5;
            player.inventory["Khoáng Thạch"] = (player.inventory["Khoáng Thạch"]||0) + ore;
            addLog(`Mở Túi Trữ Vật cướp được, nhận ${lt} 💎 và ${ore} Khoáng Thạch!`, "system", "log-kyngo");
        }
        else if (itemName.startsWith("Bí Kíp - ")) {
            let skillName = itemName.replace("Bí Kíp - ", "");
            if(!player.congPhapHocDuoc.includes(skillName)) {
                player.congPhapHocDuoc.push(skillName);
                if (!player.trangBiCongPhap) player.trangBiCongPhap = skillName;
                addLog(`Tuyệt học! Lĩnh ngộ [${skillName}]. Đã có thể trang bị trong mục Công Pháp.`, "system", "log-kyngo");
            } else addLog("Đã học công pháp này rồi.", "system");
            saveGame(false);
        }
        updateUI();
    }
}

function upgradeEquip(slot, cost) {
    if (player.linhThach >= cost) {
        player.linhThach -= cost;
        player.trangBi[slot].level++;
        addLog(`Tế luyện thành công ${player.trangBi[slot].name} lên +${player.trangBi[slot].level}.`, "log-gain");
        updateUI();
    } else { addLog("Linh thạch khô kiệt, không thể tế luyện!", "log-combat"); }
}

function joinSect(sectName) {
    player.tongMon = sectName;
    addLog(`Bạn đã bái nhập ${sectName}. Vận mệnh thay đổi từ đây!`, "log-system");
    updateUI();
    checkSectPopup();
    saveGame(false);
}

function phatDongKyNgo() {
    const cacKyNgo =[
        { txt: "Rơi xuống vách núi phát hiện hồ Linh Tuyền! Nhận lượng lớn Tu Vi.", act: () => { player.tuVi+= (player.maxTuVi * 0.2); }, type: "log-gain" },
        { txt: "TAI ƯƠNG: Vấp trúng Sát Trận thời cổ đại! Trọng thương nôn ra máu.", act: () => { player.khiHuyet=Math.floor(player.khiHuyet/2); }, type: "log-combat" },
        { txt: "Cơ duyên vạn năm! Tìm thấy 1 viên [Phá Cảnh Đan].", act: () => { player.inventory["Phá Cảnh Đan"] = (player.inventory["Phá Cảnh Đan"] || 0) + 1; }, type: "log-system" }
    ];
    let ev = cacKyNgo[Math.floor(Math.random() * cacKyNgo.length)];
    addLog(`✨[KỲ NGỘ] ${ev.txt}`, "log-kyngo");
    ev.act();
    updateUI();
}

// ----- CƠ CHẾ TU LUYỆN & CHIẾN ĐẤU -----

function useItem(itemName) {
    if (player.inventory[itemName] > 0) {
        player.inventory[itemName]--;
        if (itemName === "Hồi Huyết Đan") {
            let heal = Math.floor(getTongMaxHP() * 0.4);
            player.khiHuyet = Math.min(getTongMaxHP(), player.khiHuyet + heal); // Không vượt quá Max HP
            addLog(`Nuốt Hồi Huyết Đan, khôi phục ${heal} HP.`, "system", "log-gain");
        } 
        else if (itemName === "Phá Cảnh Đan") {
            // Tính toán lại tỷ lệ hiện tại ngay lúc này
            let major = dsCanhGioi[player.canhGioiIndex];
            let isMajorBreak = (player.tieuCanhGioi === major.maxLevel);
            let tiLeHienTai = (isMajorBreak ? major.rate : 90) + player.buffDotPha;

            if (tiLeHienTai < 100) {
                player.buffDotPha += 1;
                addLog("Tỷ lệ đột phá tăng thêm 1%.", "system", "log-gain");
            } else {
                addLog("Tỷ lệ đột phá đã đạt cực hạn (100%), không cần dùng thêm!", "system", "log-warning");
                // Hoàn trả lại đan dược nếu đã 100%
                player.inventory[itemName]++; 
            }
            updateUI(); // Gọi hàm cập nhật chung
            renderInventory();
            saveGame();
        }
        else if (itemName === "Túi Trữ Vật") {
            let lt = Math.floor(Math.random() * 500) + 100 * (player.canhGioiIndex+1); player.linhThach += lt;
            let ore = Math.floor(Math.random() * 10) + 5;
            player.inventory["Khoáng Thạch"] = (player.inventory["Khoáng Thạch"]||0) + ore;
            addLog(`Mở Túi Trữ Vật cướp được, nhận ${lt} 💎 và ${ore} Khoáng Thạch!`, "system", "log-kyngo");
        }
        else if (itemName.startsWith("Bí Kíp - ")) {
            let skillName = itemName.replace("Bí Kíp - ", "");
            if(!player.congPhapHocDuoc.includes(skillName)) {
                player.congPhapHocDuoc.push(skillName);
                if (!player.trangBiCongPhap) player.trangBiCongPhap = skillName;
                addLog(`Tuyệt học! Lĩnh ngộ [${skillName}]. Đã có thể trang bị trong mục Công Pháp.`, "system", "log-kyngo");
            } else addLog("Đã học công pháp này rồi.", "system");
            saveGame(false);
        }
        updateUI();
    }
}

function upgradeEquip(slot, cost) {
    if (player.linhThach >= cost) {
        player.linhThach -= cost; player.trangBi[slot].level++;
        addLog(`Tế luyện thành công ${player.trangBi[slot].name} lên +${player.trangBi[slot].level}.`, "system", "log-gain");
        if (player.trangBi[slot].level % 5 === 0 && player.trangBi[slot].tier < 3) {
            player.trangBi[slot].tier++;
            addLog(`Kỳ diệu! [${player.trangBi[slot].name}] đột phá thành ${trangBiType[player.trangBi[slot].tier]} Khí!`, "system", "log-kyngo");
        }
        updateUI();
    } else addLog("Linh thạch khô kiệt!", "system", "log-combat"); 
}

function upgradeLuyenThe() {
    let costLT = (player.luyenTheLevel + 1) * 200; let costDuoc = (player.luyenTheLevel + 1) * 5;
    if(player.linhThach >= costLT && (player.inventory["Thảo Dược"]||0) >= costDuoc) {
        player.linhThach -= costLT; player.inventory["Thảo Dược"] -= costDuoc; player.luyenTheLevel++;
        addLog(`Nhục thân rèn luyện đạt Cấp ${player.luyenTheLevel}. HP và DEF tăng vọt!`, "system", "log-gain"); updateUI();
    } else addLog(`Cần ${costLT}💎 và ${costDuoc} Thảo Dược!`, "system", "log-combat");
}


function buyShop(itemName, cost) {
    if(player.linhThach >= cost) {
        player.linhThach -= cost;
        if(itemName === "Thế Mạng Phù") player.buaChu++; if(itemName === "Tụ Khí Trận") player.buffTuKhi += 100; if(itemName === "Vé Bí Cảnh") player.veBiCanh++;
        updateUI(); addLog(`Mua thành công ${itemName}.`, "system", "log-system");
    } else addLog("Không đủ Linh Thạch!", "system", "log-combat");
}

function consumeTheMangPhu() {
    if ((player.buaChu || 0) > 0) {
        player.buaChu--;
        return true;
    }

    if ((player.inventory["Thế Mạng Phù"] || 0) > 0) {
        player.inventory["Thế Mạng Phù"]--;
        return true;
    }

    return false;
}

function handlePlayerDeath(tabType = "combat") {
    if (player.khiHuyet > 0) return false;

    if (consumeTheMangPhu()) {
        player.khiHuyet = 1;
        addLog("[Thế Mạng Phù] kích hoạt, tiêu hao 1 phù và hồi lại 1 Khí Huyết!", tabType, "log-kyngo");
        updateUI();
        saveGame(false);
        return true;
    }

    player.khiHuyet = 0;
    activeEnemy = null;
    if (currentAutoMode === 'lichluyen') toggleAuto();
    addLog("Khí huyết cạn kiệt. Bạn đã tử trận và được tự động đưa đi đầu thai!", tabType, "log-combat");
    updateUI();
    updateEnemyUI();
    setTimeout(() => resetGame(false), 1200);
    return true;
}

// ----- CƠ CHẾ CHIẾN ĐẤU THỜI GIAN THỰC MỚI -----
function passiveTuLuyen() {
    if(player.tuVi >= player.maxTuVi) return;

    // Tông môn Dược Cốc hồi thụ động
    if (player.tongMon === "Dược Cốc") { player.khiHuyet += 10; player.linhLuc += 5; }

    // Công thức: Cảnh giới càng cao, mỗi tầng càng x nhiều EXP
    let base = Math.floor(Math.random() * 10) + 5;
    let exp = base * (player.canhGioiIndex + 1) * player.tieuCanhGioi; 

    // Tụ Khí Trận buff
    if (player.buffTuKhi > 0) { exp *= 2; player.buffTuKhi--; }

    player.tuVi += exp; 
    xuLyTichLuyTuVi(); // Gọi hàm xử lý tích lũy
    
    // Log hiển thị thưa thớt để tránh spam
    if (Math.random() < 0.2) addLog(`[Thụ Động] Thiên địa linh khí nhập thể, Tu Vi +${exp}.`, "log-gain");
    updateUI();
}

function diBiCanh() {
    if(player.veBiCanh <= 0) { addLog("Không còn vé vào Bí Cảnh!", "system", "log-combat"); return; }
    if(player.khiHuyet <= 0) { handlePlayerDeath("system"); return; }
    
    player.veBiCanh--;
    let map = dsBanDo.find(m => m.id === player.currentMap);
    activeEnemy = {
        name: "Yêu Vương " + map.mobName[0], isBoss: true, isPK: false, mapInfo: map,
        hp: map.eHp * 10, maxHp: map.eHp * 10, atk: map.eAtk * 3, def: map.eDef * 2
    };
    addLog(`Cánh cửa Bí Cảnh mở ra... Phát hiện [${activeEnemy.name}]!`, "combat", "log-pk");
    updateEnemyUI();
}

function kiemTraKyNgo() {
    let tiLeKyNgo = 0.02; // 2% cơ hội kích hoạt kỳ ngộ mỗi khi di chuyển/tìm quái

    // Nếu không trúng tỷ lệ kỳ ngộ, trả về false để tiếp tục đánh quái
    if (Math.random() > tiLeKyNgo) return false;

    // Tung xúc xắc xem gặp sự kiện gì (0 đến 1)
    let rollEvent = Math.random();
    
    if (rollEvent < 0.03) {
        // 3% - Nhận Tu Vi (Linh Tuyền)
        let exp = Math.floor(player.maxTuVi * 0.02);
        player.tuVi += exp;
        addLog(`✨[KỲ NGỘ] Rơi xuống đáy vực không chết, phát hiện hồ Linh Tuyền! Nhận ${exp} Tu Vi.`, "system", "log-kyngo");
        // Nếu đạo hữu đã thêm hàm xuLyTichLuyTuVi() ở yêu cầu trước, hãy gọi nó ở đây:
        if (typeof xuLyTichLuyTuVi === "function") xuLyTichLuyTuVi();
        
    } else if (rollEvent < 0.05) {
        // 2% - Nhận Linh Thạch
        let lt = (player.canhGioiIndex + 1) * 100;
        player.linhThach += lt;
        addLog(`✨[KỲ NGỘ] Tìm thấy di tích của một vị Tán Tu tọa hóa, thu được ${lt} 💎!`, "system", "log-kyngo");
        
    } else if (rollEvent < 0.07) {
        // 20% - Nhận Vật Phẩm Dược/Khoáng
        let sl = Math.floor(Math.random() * 5) + 2;
        player.inventory["Thảo Dược"] = (player.inventory["Thảo Dược"] || 0) + sl;
        addLog(`✨[KỲ NGỘ] Lạc vào một góc tiên viên nứt nẻ, hái được ${sl} Thảo Dược!`, "system", "log-kyngo");
        
    } else if (rollEvent < 0.02) {
         //Cực Phẩm (Vé Bí Cảnh hoặc Phá Cảnh Đan)
         if (Math.random() < 0.5) {
             player.veBiCanh++;
             addLog(`✨[KỲ NGỘ] Đào được một tấm bia đá giấu 1 [Vé Bí Cảnh]!`, "system", "log-kyngo");
         } else {
             player.inventory["Phá Cảnh Đan"] = (player.inventory["Phá Cảnh Đan"] || 0) + 1;
             addLog(`✨[KỲ NGỘ] Lượm được bảo hạp sứt mẻ chứa 1 [Phá Cảnh Đan]!`, "system", "log-kyngo");
         }
         
    } else {
        // 15% - Ác Mộng (Mất máu)
        let matMau = Math.floor(player.khiHuyet * 0.1); // Mất 10% máu hiện tại
        if (matMau < 1) matMau = 1;
        player.khiHuyet -= matMau;
        addLog(`💀[ÁC MỘNG] Đạp trúng kịch độc xướng nha! Mất ${matMau} Khí Huyết.`, "combat", "log-combat");
        
        // Kiểm tra xem mất máu xong có chết không
        if (player.khiHuyet <= 0) handlePlayerDeath("combat");
    }
    
    updateUI();
    return true; // Trả về true báo hiệu đã xảy ra kỳ ngộ (không gặp quái nữa)
}

function lichLuyen() {
    if (player.khiHuyet <= 0) { 
        handlePlayerDeath("combat");
        return; 
    }

    // Nếu không có quái, thì Spawn
    if (!activeEnemy) {
        if(Math.random() < 0.1) { // 10% cơ hội gặp kỳ ngộ thay vì quái
        kiemTraKyNgo();
        return; // Nếu gặp kỳ ngộ thì mất 1 turn không đánh quái, chờ turn sau
        }
        let map = dsBanDo.find(m => m.id === player.currentMap);
        if(Math.random() < 0.01 && player.canhGioiIndex > 0) {
            activeEnemy = { name: "Tán Tu Ác Bá", isBoss: false, isPK: true, mapInfo: map, hp: map.eHp*3, maxHp: map.eHp*3, atk: map.eAtk*1.2, def: map.eDef*2.5 };
            addLog(`Phát hiện Tán Tu ngáng đường! Tiến vào chiến đấu!`, "combat", "log-pk");
        } else {
            let tenQuai = map.mobName[Math.floor(Math.random() * map.mobName.length)];
            activeEnemy = { name: tenQuai, isBoss: false, isPK: false, mapInfo: map, hp: map.eHp, maxHp: map.eHp, atk: map.eAtk, def: map.eDef };
            addLog(`Chạm trán [${tenQuai}]!`, "combat", "log-system");
        }
        updateEnemyUI();
    }

    // Tiến hành 1 Lượt đánh
    thucHienGiaoTranh();
}

function thucHienGiaoTranh() {
    if(!activeEnemy) return;

    let pAtk = getTongAtk(); let pDef = getTongDef();
    
    // Bạn đánh Quái
    let dungSkill = false; let pMult = 1;
    if(player.trangBiCongPhap) { 
        let sInfo = getCongPhapInfo(player.trangBiCongPhap);
        if(player.linhLuc >= sInfo.mpCost) {
            player.linhLuc -= sInfo.mpCost; pMult = sInfo.mult; dungSkill = true;
            addLog(`⚡Xuất chiêu [${player.trangBiCongPhap}] gây sát thương bạo kích!`, "combat", "log-skill");
        }
    }

    let dmgToQuai = (pAtk * pMult) - activeEnemy.def; if(dmgToQuai < 1) dmgToQuai = 1;
    activeEnemy.hp -= dmgToQuai;

    // Ma tông hút máu
    if(player.tongMon === "Ma Tông") { player.khiHuyet += Math.floor(dmgToQuai * 0.1); }

    // Quái đánh lại bạn
    if (activeEnemy.hp > 0) {
        let dmgToPlayer = activeEnemy.atk - pDef; if(dmgToPlayer < 1) dmgToPlayer = 1;
        player.khiHuyet -= dmgToPlayer;

        // Xử lý nếu bạn chết
        if (player.khiHuyet <= 0) {
            handlePlayerDeath("combat");
        }
    } else {
        // Quái CHẾT -> Nhận thưởng
        let map = activeEnemy.mapInfo;
        let expGot = activeEnemy.isBoss ? map.expMax*5 : (Math.floor(Math.random() * (map.expMax - map.expMin + 1)) + map.expMin);
        player.tuVi += expGot; 
        xuLyTichLuyTuVi(); // Gọi hàm xử lý tích lũy
        addLog(`Đã tiêu diệt [${activeEnemy.name}]. Nhận +${expGot} Tu Vi.`, "combat", "log-detail");
        
        // Xử lý Rớt Đồ
        if(activeEnemy.isPK) {
            const mapDropRate = activeEnemy.mapInfo.dropRate || 0.1;
            const randomValue = Math.random();
            if (randomValue < mapDropRate) {
            // Rơi Vé Bí Cảnh
            player.veBiCanh += 1;
            
            // Thông báo cho đạo hữu biết
            addLog(`Chúc mừng! Đạo hữu đã kết liễu [${activeEnemy.name}] và thu được 1 Vé Bí Cảnh.`);
            } else {
                addLog(`Đạo hữu đã tiêu diệt [${activeEnemy.name}] nhưng không tìm thấy vé bí cảnh.`);
            }
            player.inventory["Túi Trữ Vật"] = (player.inventory["Túi Trữ Vật"]||0) + 1; addLog(`Cướp được 1 [Túi Trữ Vật]!`, "system", "log-pk");
        } else if (activeEnemy.isBoss) {
            player.linhThach += map.ltMax * 5;
            if(Math.random() < 0.5) player.inventory["Thiên Đạo Kết Tinh"] = (player.inventory["Thiên Đạo Kết Tinh"]||0) + 1;
            if(Math.random() < 0.4) {
                let keys = Object.keys(dbCongPhap); let rngSkill = keys[Math.floor(Math.random() * keys.length)];
                player.inventory[`Bí Kíp - ${rngSkill}`] = (player.inventory[`Bí Kíp - ${rngSkill}`]||0) + 1;
                addLog(`Bí Cảnh rớt tuyệt học: [Bí Kíp - ${rngSkill}]!`, "system", "log-kyngo");
            }
        } else if (Math.random() < map.dropRate) { 
            let roll = Math.random();
            if(roll < 0.2) player.inventory["Thảo Dược"] = (player.inventory["Thảo Dược"]||0) + 1; 
            else if(roll < 0.3) player.inventory["Khoáng Thạch"] = (player.inventory["Khoáng Thạch"]||0) + 1; 
            else player.inventory["Tài Liệu Yêu Thú"] = (player.inventory["Tài Liệu Yêu Thú"]||0) + 1; 
            if(currentLogTab !== 'combat') addLog(`Thu thập được vật phẩm.`, "system", "log-system");
        }
        
        activeEnemy = null; // Xóa quái để lượt sau spawn con mới
    }
    saveGame();
    updateUI(); updateEnemyUI();
}

function nghiNgoi() {
    if (player.khiHuyet <= 0) {
        handlePlayerDeath("combat");
        return;
    }

    if (activeEnemy) {
        addLog("Đang giao chiến, không thể liệu thương!", "combat", "log-combat");
        return;
    }

    let maxHP = getTongMaxHP();
    if (player.khiHuyet === maxHP && player.linhLuc === player.maxLinhLuc) return;
    player.khiHuyet += Math.floor(maxHP * 0.4); // Hồi 40% mỗi lần bấm
    player.linhLuc += Math.floor(player.maxLinhLuc * 0.5); 
    if(player.khiHuyet > maxHP) player.khiHuyet = maxHP;
    if(player.linhLuc > player.maxLinhLuc) player.linhLuc = player.maxLinhLuc;
    addLog("Ngồi thiền vận công, khôi phục lượng lớn Khí Huyết và Linh Lực.", "combat", "log-system");
    updateUI();
}

// ĐỘT PHÁ - TRỌNG TÂM CỦA GAME

function xuLyTichLuyTuVi() {
    // Chỉ kích hoạt khi tu vi hiện tại đã vượt qua mức maxTuVi
    if (player.tuVi > player.maxTuVi) {
        let tichLuy = player.tuVi - player.maxTuVi;
        let muoiPhanTramMax = player.maxTuVi * 0.1; // 10% kinh nghiệm yêu cầu

        // Dùng vòng lặp while để xử lý trường hợp nhận được lượng exp khổng lồ cùng lúc (ví dụ ăn đan dược hoặc kỳ ngộ)
        while (tichLuy >= muoiPhanTramMax) {
            // Xóa đi phần tu vi tích lũy bằng đúng 10% maxTuVi
            player.tuVi -= muoiPhanTramMax;
            
            // Cộng 0.5% vào buff đột phá (dùng số thập phân)
            player.buffDotPha += 0.5;
            
            // Cập nhật lại lượng tích lũy sau khi trừ
            tichLuy = player.tuVi - player.maxTuVi;
            
            // Ghi log để người chơi biết
            addLog(`Căn cơ vững chắc! Nén tu vi dư thừa thành công, tỷ lệ đột phá tăng thêm 0.5%.`, "system", "log-gain");
        }
    }
}

function dotPha() {
    let major = dsCanhGioi[player.canhGioiIndex];
    let isMajorBreak = (player.tieuCanhGioi === major.maxLevel);
    
    let tl = isMajorBreak ? major.rate : 50; // Tỷ lệ
    tl += player.buffDotPha;
    player.buffDotPha = 0; 
    
    if (Math.random() * 100 <= tl) {
        // THìNH CÔNG
        if(isMajorBreak) {
            // Đột phá Đại Cảnh Giới: Scale KHỦNG
            let nextMajor = dsCanhGioi[player.canhGioiIndex + 1];
            if(!nextMajor) { return; }
            
            player.canhGioiIndex++; 
            player.tieuCanhGioi = 1;
            player.tuVi = 0;
            player.maxTuVi = Math.floor(player.maxTuVi * 5); // Cần gấp 5 exp
            
            // Cấp số nhân chỉ số x3
            player.tanCongCoBan *= 3; 
            player.phongThuCoBan *= 3;
            player.maxKhiHuyet *= 3; 
            player.maxLinhLuc *= 2;
            player.khiHuyet = getTongMaxHP(); 
            player.linhLuc = player.maxLinhLuc;
            
            addLog(`⚡Lôi kiếp giáng lâm! Chúc mừng độ kiếp thành công thăng cấp 【${nextMajor.name}】! Sức mạnh tăng vọt!`, "system", "log-kyngo");
        } else {
            // Đột phá Tiểu Cảnh Giới: Tuyến tính
            player.tieuCanhGioi++;
            player.tuVi = 0;
            player.maxTuVi = Math.floor(player.maxTuVi * 1.5);
            
            player.tanCongCoBan = Math.floor(player.tanCongCoBan * 1.15);
            player.phongThuCoBan = Math.floor(player.phongThuCoBan * 1.15);
            player.maxKhiHuyet = Math.floor(player.maxKhiHuyet * 1.15);
            player.maxLinhLuc = Math.floor(player.maxLinhLuc * 1.15);
            player.khiHuyet = getTongMaxHP();
            player.linhLuc = player.maxLinhLuc;
            
            addLog(`Đột phá bình cảnh, đạt tới Tầng ${player.tieuCanhGioi}!`, "system", "log-system");
        }
    } else {
        // THẤT BẠI
        if (player.buaChu > 0 && isMajorBreak) {
            player.buaChu--;
            addLog(`Đột phá đại bình cảnh thất bại! [Thế Mạng Phù] thay bạn chịu lôi kiếp, bảo toàn tu vi.`, "system");
        } else {
            if(isMajorBreak) {
                player.tuVi = 0; player.khiHuyet = 1; 
                addLog(`💥Độ kiếp THẤT BẠI! Lôi kiếp đánh trọng thương, tu vi tan biến, chỉ còn chút hơi tàn!`, "system", "log-combat");
            } else {
                player.tuVi = Math.floor(player.maxTuVi * 0.5); // Mất nửa thanh
                addLog(`Khí huyết đảo nghịch, đột phá thất bại, tổn thất một lượng tu vi!`, "system", "log-combat");
            }
        }
    }
    checkSectPopup();
    updateUI(); saveGame(false);
}

function toggleAuto() {
    let btnLichLuyen = document.getElementById('btn-auto-lich-luyen');
    if (currentAutoMode === 'lichluyen') {
        clearInterval(autoInterval); currentAutoMode = null;
        btnLichLuyen.innerText = "Treo Đánh Quái"; btnLichLuyen.classList.remove("btn-auto-combat");
        return;
    }
    currentAutoMode = 'lichluyen';
    btnLichLuyen.innerText = "Đang Treo"; btnLichLuyen.classList.add("btn-auto-combat");
    
    // Auto chém mỗi 0.5 giây (Tốc độ chiến đấu thật)
    autoInterval = setInterval(() => { 
        let maxHP = getTongMaxHP();
        if(player.khiHuyet <= 0) { handlePlayerDeath("combat"); }
        else if(activeEnemy) { lichLuyen(); }
        else if(player.khiHuyet < maxHP * 0.3 || player.linhLuc < player.maxLinhLuc * 0.2) { nghiNgoi(); } 
        else { lichLuyen(); } 
    }, 500); 
}

// ----- HỆ THỐNG LƯU / TẢI GAME (PHIÊN BẢN NSIS INSTALLER) -----

// --- KHAI BÁO BIẾN TOìN CỤC CHO LƯU GAME ---

try {
    // Chỉ nạp các thư viện này nếu đang chạy trong Electron
    fs = require('fs');
    path = require('path');
    const { ipcRenderer } = require('electron');
    
    const userDataPath = ipcRenderer.sendSync('get-path-user-data');
    saveFilePath = path.join(userDataPath, 'savegame.json');
} catch (e) {
    console.error("Đang chạy trên trình duyệt web thường, tính năng lưu file sẽ bị tắt.");
}

// --- HìM LƯU GAME AN TOìN ---
function saveGame(isManual = false) {
    // 1. Vẫn luôn lưu vào localStorage như cũ (để dự phòng)
    localStorage.setItem('tutien_v4_scale', JSON.stringify(player));

    // 2. Nếu có môi trường Electron thì mới lưu vào file
    if (fs && saveFilePath) {
        try {
            fs.writeFileSync(saveFilePath, JSON.stringify(player, null, 4), 'utf-8');
        } catch (err) {
            console.error("Ghi file thất bại:", err);
        }
    }

    if (isManual && typeof addLog === "function") {
        addLog("Đã dùng bí thuật khắc sâu thần thức (Lưu Game thành công).", "log-system");
    }
}

function loadGame() {
    // Ưu tiên đọc từ file trước
    if (fs && fs.existsSync(saveFilePath)) {
        const saved = fs.readFileSync(saveFilePath, 'utf-8');
        player = normalizePlayer(JSON.parse(saved));
    } else {
        // Nếu không có file thì đọc từ localStorage (cách cũ của bạn)
        let saved = localStorage.getItem('tutien_v4_scale');
        if (saved) player = normalizePlayer(JSON.parse(saved));
        else player = normalizePlayer(defaultPlayer);
    }
}
async function initVersion() {
    let version = "1.0.2";
    try {
        if (window.AndroidHost && window.AndroidHost.getVersionName) {
            version = window.AndroidHost.getVersionName();
        } else if (ipcRenderer && ipcRenderer.invoke) {
            version = await ipcRenderer.invoke('get-app-version');
        }
    } catch (error) {
        console.warn("Không thể lấy version runtime, dùng version mặc định.", error);
    }

    const versionElement = document.getElementById('version-display');
    if (versionElement) {
        versionElement.innerText = `Phiên bản: v${version}`;
    }
}

initVersion();

function resetGame(isConfirmed = true) {
    if (isConfirmed && !confirm("Luan hoi chuyen the?")) {
        return;
    }
    localStorage.removeItem('playerSect');
    localStorage.clear();
    location.reload();
}

const UPDATE_MANIFEST_URL = 'https://raw.githubusercontent.com/NekoKyandi/Game-Tu-Tien-Android/main/www/update.json';

function getCurrentVersionCode() {
    if (window.AndroidHost && window.AndroidHost.getVersionCode) {
        return Number(window.AndroidHost.getVersionCode()) || 1;
    }
    return 1;
}

async function checkAppUpdate() {
    try {
        if (!(window.AndroidHost && window.AndroidHost.startUpdate)) {
            return;
        }

        const response = await fetch(UPDATE_MANIFEST_URL, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const currentVersionCode = getCurrentVersionCode();

        if (Number(data.versionCode) > currentVersionCode && data.apkUrl) {
            showUpdatePopup(data.apkUrl, data.releaseNotes || "Co ban cap nhat moi.");
        }
    } catch (error) {
        console.error("Khong the kiem tra cap nhat:", error);
    }
}

function showUpdatePopup(url, notes) {
    let confirmUpdate = confirm("Phat hien ban cap nhat moi!\nNoi dung: " + notes + "\n\nBan co muon tai ve khong?");

    if (confirmUpdate) {
        if (window.AndroidHost && window.AndroidHost.startUpdate) {
            window.AndroidHost.startUpdate(url);
            alert("Dang tai ban cap nhat duoi nen, vui long cho...");
        } else {
            alert("Loi: Khong tim thay ket noi he thong Android!");
        }
    }
}

checkAppUpdate();
