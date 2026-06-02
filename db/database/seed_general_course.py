import pandas as pd
import sqlite3
import os

# 1. 設定路徑與檔案
# 透過程式所在檔案的絕對路徑來反推
current_dir = os.path.dirname(os.path.abspath(__file__))
folder_path = os.path.join(current_dir, "..", "data", "通識")

files = [
    "1101通識.xlsx", "1102通識.xlsx", "1111通識.xlsx", "1112通識.xlsx", 
    "1121通識.xlsx", "1122通識.xlsx", "1131通識.xlsx", "1132通識.xlsx", 
    "1141通識.xlsx", "1142通識.xlsx"
]

all_data = []

# 2. 讀取 Excel
for f in files:
    full_path = os.path.join(folder_path, f)
    if os.path.exists(full_path):
        # 使用 dtype=str 避免開頭的 0 消失
        df = pd.read_excel(full_path, dtype=str)
        
        # 統一欄位名稱轉小寫
        df.columns = [str(c).lower().strip() for c in df.columns]
        
        # 擴充映射字典，確保不同 Excel 的學期欄位都能抓到
        rename_dict = {
            '學期': 'semester',
            'semester': 'semester',
            'course name': 'course_name',
            '課程名稱': 'course_name',
            '科目名稱': 'course_name',
            '核通': 'is_core',
            '核心': 'is_core',
            '課程代碼': 'code',
            '課程編號': 'code',
            '科目代碼': 'code',
            '學分': 'credit',
            'type': 'type',
            '類別': 'type'
        }
        df = df.rename(columns=rename_dict)
        all_data.append(df)
    else:
        print(f"找不到檔案：{full_path}")

# 3. 手動新增的核心通識資料(直接寫入通識xlsx，這裡就不再重複新增)
# 4. 整合與清洗
if all_data:
    combined_df = pd.concat(all_data, ignore_index=True)
    
    # 定義最終需要的欄位
    target_columns = ['semester', 'code', 'course_name', 'type', 'credit', 'is_core']
    
    # 補齊可能缺失的欄位
    for col in target_columns:
        if col not in combined_df.columns:
            combined_df[col] = None

    # 過濾欄位
    combined_df = combined_df[target_columns]

    # 【配合組員決策】：直接使用 Excel 合併後的資料，不再 concat 手動資料
    final_df = combined_df.copy()
    
    # 【關鍵修正】
    # 1. 將 'semester' 加入重複判斷，這樣 1141 的課跟 1142 的課都會保留
    # 2. 如果 code 很多 None，加入 'semester' 判斷也能防止多個手動核心通識被刪除
    final_df = final_df.drop_duplicates(subset=['semester', 'code', 'course_name'], keep='first')
    
    # 額外處理：如果沒有 semester 的資料，填入 "Unknown" 避免之後查詢出錯
    final_df['semester'] = final_df['semester'].fillna('Unknown')

    # 5. 寫入資料庫
    conn = sqlite3.connect('curriculum.db')
    cursor = conn.cursor()
    
    # 砍掉舊表重新寫入
    cursor.execute("DROP TABLE IF EXISTS general_courses")
    
    final_df.to_sql('general_courses', conn, if_exists='replace', index=False)
    conn.commit()
    conn.close()
    
    print(f"成功處理 {len(all_data)} 個檔案，1142 及其他學期重複課程已正確保留。")
else:
    print("沒有讀取到任何資料。")