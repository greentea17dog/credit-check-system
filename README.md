# 畢業審判官 — 政大畢業學分檢核系統

🎓 專為國立政治大學學生設計的畢業學分檢核系統，自動解析全人系統成績單 JSON，比對必修、通識、選修、體育學分規則，即時回報畢業資格。支援一般生、雙主修、輔系等多種學習路徑。

## ✨ 核心功能

- 📊 **智能學分分析** — 自動解析全人系統成績單，精確計算各類學分
- 🎯 **畢業資格判定** — 即時回報是否符合畢業條件，缺漏課程一目了然
- 🔄 **多身份支援** — 一般生、雙主修、輔系生專用分析邏輯
- 📱 **現代化介面** — Next.js + Tailwind CSS 打造直觀操作體驗
- ⚡ **即時回饋** - 上傳即分析，無需等待

## 🏗️ 技術架構

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   Next.js 16    │◄──►│   FastAPI       │◄──►│   SQLite        │
│   React 19      │    │   Python 3.10+  │    │   curriculum.db │
│   Tailwind CSS  │    │   Uvicorn       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 專案結構

```
credit-check-system/
├── 🐍 backend/                 # Python 後端服務
│   ├── main.py                # FastAPI 主應用程式
│   ├── database.py            # SQLite 資料庫連線
│   ├── required.py            # 必修學分分析模組
│   ├── general.py             # 通識學分分析模組  
│   ├── pe_elective.py         # 體育/選修學分分析
│   ├── waiver.py              # 抵免課程分析
│   └── minor.py               # 輔系學分分析
├── 🗄️ db/                     # 資料庫相關
│   ├── data/                  # 原始資料檔案
│   └── database/              # 資料庫初始化腳本
├── ⚛️ frontend/               # React 前端應用
│   ├── app/                   # Next.js App Router
│   ├── components/            # React 元件庫
│   └── hooks/                 # 自定義 Hooks
├── 🧪 tests/                  # 測試檔案
├── 📋 pyproject.toml          # Python 專案設定
├── 📋 package.json            # Node.js 專案設定
└── 🚀 dev.sh                  # 開發環境啟動腳本
```

## 🚀 快速開始

### 📋 前置需求

- **Python 3.10+** 與 **uv** 套件管理器
- **Node.js 18+** 與 **pnpm** 套件管理器

### 🛠️ 一鍵啟動（推薦）

```bash
# 克隆專案
git clone <repository-url>
cd credit-check-system

# 一鍵啟動前後端服務
bash dev.sh
```

服務將自動啟動：
- 🐍 **Backend** → http://localhost:8000
- ⚛️ **Frontend** → http://localhost:3000

### 🔧 手動啟動

**後端服務**
```bash
# 安裝 Python 依賴
uv sync

# 啟動 FastAPI 服務
uv run uvicorn backend.main:app --reload --port 8000
```

**前端服務**
```bash
cd frontend
pnpm install
pnpm dev --port 3000
```

### ⚙️ 環境設定

```bash
# 複製環境變數範本
cp .env.example .env

# 預設設定（通常無需修改）
DB_PATH=db/database/curriculum.db
```

## 📡 API 文件

### 主要端點

| 方法 | 路徑 | 描述 |
|------|------|------|
| `GET` | `/` | 服務健康檢查 |
| `GET` | `/departments` | 獲取所有系所清單 |
| `GET` | `/departments/{dept_name}/courses?year=114` | 查詢指定系所必修課程 |
| `POST` | `/api/v1/analyze` | **核心功能** - 畢業學分分析 |

### 🔍 分析請求格式

```json
{
  "role": "general",
  "data": [ ...全人系統匯出的 JSON 陣列... ]
}
```

**身份參數說明：**
- `"general"` — 一般生
- `"dual"` — 雙主修／輔系生

### 📊 分析回應格式

```json
{
  "dept_name": "資訊科學系",
  "applicable_year": "112",
  "summary": {
    "total_credits_earned": 95,
    "required_credits_earned": 62,
    "required_credits_needed": 72,
    "pe_credits_earned": 4,
    "pe_credits_needed": 4,
    "general_credits_earned": 20,
    "general_credits_needed": 28,
    "elective_credits_earned": 9,
    "elective_credits_needed": 24
  },
  "required_courses": {
    "passed": ["計算機概論", "資料結構"],
    "missing": ["作業系統", "演算法"]
  },
  "general_education": {
    "credits_earned": 20,
    "credits_needed": 28,
    "passed": false,
    "by_category": { "人文": 6, "社會": 6, "自然": 2, "書院": 0, "國+英": 6 }
  },
  "physical_education": {
    "credits_earned": 4,
    "credits_needed": 4,
    "passed": true,
    "courses": ["體育（一）", "體育（二）", "體育（三）", "體育（四）"]
  },
  "elective": {
    "credits_earned": 9,
    "credits_needed": 24,
    "passed": false,
    "in_dept_credits": 6,
    "out_dept_credits": 3
  },
  "waiver": {
    "total_credits": 10,
    "course_count": 4,
    "by_category": { "語言通識（英文）": 6, "體育": 2, "通識（人文）": 2 },
    "courses": [ ... ]
  },
  "is_eligible_to_graduate": false
}
```

## 🗄️ 資料庫架構

### 核心資料表

| 資料表 | 用途 |
|--------|------|
| `departments` | 系所基本資訊與畢業門檻 |
| `required_courses` | 各系年度必修課程清單 |
| `course_schedules` | 課程建議開課學期 |
| `general_education_requirements` | 通識學分門檻設定 |
| `general_courses` | 通識課程分類資料 |
| `minor_departments` | 輔系課程結構 |

### 🛠️ 資料庫初始化

```bash
# 首次設定或重建資料庫
python db/database/init_db.py              # 建立資料表
python db/database/seed_db.py              # 匯入必修課程
python db/database/seed_general.py         # 匯入通識門檻
python db/database/seed_general_course.py  # 匯入通識課程
python db/database/seed_minor_db.py        # 匯入輔系資料
```

### 🔍 資料查詢

```bash
# 進入 SQLite 終端機
sqlite3 db/database/curriculum.db
```

```sql
-- 查詢所有系所
SELECT dept_name, applicable_year FROM departments ORDER BY applicable_year DESC;

-- 查詢特定系所必修課程
SELECT rc.name, rc.credits, rc.suggested_year
FROM required_courses rc
JOIN departments d ON rc.department_id = d.id
WHERE d.dept_name LIKE '資訊%' AND d.applicable_year = '114'
ORDER BY rc.suggested_year;
```

## 🧪 測試

```bash
# 安裝測試依賴
uv sync --all-groups

# 執行所有測試
uv run pytest tests/ -v

# 執行特定測試
uv run pytest tests/test_upload.py -v
```

## 🚀 部署

### 環境變數

生產環境需設定以下環境變數：

```bash
DB_PATH=/path/to/production/curriculum.db
PORT=8000
```

### Docker 部署

```dockerfile
# Dockerfile 範例
FROM python:3.10-slim
WORKDIR /app
COPY . .
RUN pip install uv
RUN uv sync
EXPOSE 8000
CMD ["uv", "run", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🤝 貢獻指南

1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request


