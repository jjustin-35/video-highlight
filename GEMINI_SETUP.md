# Gemini AI 集成設置指南

## 概述

這個項目現在支持使用 Google Gemini AI 來自動生成視頻逐字稿和重點標記。系統會自動檢測是否配置了 Gemini AI，如果沒有配置則會回退到模擬 AI 數據。

## 設置步驟

### 1. 獲取 Gemini API Key

1. 前往 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登錄您的 Google 帳戶
3. 創建新的 API 密鑰
4. 複製 API 密鑰

### 2. 配置環境變數

在項目根目錄創建 `.env.local` 文件：

```bash
# Gemini AI Configuration
GEMINI_API_KEY=your_api_key_here

# Optional: 指定使用的模型 (默認: gemini-1.5-flash)
GEMINI_MODEL=gemini-1.5-flash
```

### 3. 重啟開發服務器

```bash
yarn dev
```

## 功能特性

### 自動回退機制

- 如果沒有配置 Gemini API 密鑰，系統會自動使用模擬數據
- 對於演示視頻 (`demo.mp4`)，總是使用模擬數據以確保一致的演示體驗
- 如果 Gemini API 調用失敗，會自動回退到模擬數據

### 支持的視頻格式

- MP4
- WebM
- MOV
- AVI
- 其他瀏覽器支持的視頻格式

### 文件大小限制

- 最大文件大小：100MB
- 建議使用壓縮後的視頻以獲得更快的處理速度

## AI 生成的數據格式

Gemini AI 會生成符合以下 TypeScript 接口的數據：

```typescript
interface TranscriptSection {
  title: string;
  sentences: TranscriptSentence[];
}

interface TranscriptSentence {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  isHighlight: boolean;
}
```

## 使用方式

1. **上傳視頻**: 拖拽視頻文件到上傳區域或點擊選擇文件
2. **AI 處理**: 系統會自動使用 Gemini AI 分析視頻並生成逐字稿
3. **重點標記**: AI 會自動識別並標記重要的句子
4. **編輯調整**: 您可以手動選擇或取消選擇句子作為重點
5. **預覽播放**: 在時間軸上查看選中的重點片段

## 故障排除

### API 密鑰錯誤
- 檢查 `.env.local` 文件中的 `GEMINI_API_KEY` 是否正確
- 確保 API 密鑰有效且有足夠的配額

### 處理失敗
- 檢查視頻文件大小是否超過 100MB
- 確保視頻格式受支持
- 查看瀏覽器控制台的錯誤信息

### 性能優化
- 使用較小的視頻文件可以獲得更快的處理速度
- 建議視頻時長不超過 30 分鐘以獲得最佳效果

## API 端點

### POST `/api/process-video`
處理上傳的視頻文件並返回逐字稿數據。

**請求格式**: `multipart/form-data`
- `video`: 視頻文件

**響應格式**: JSON
```json
{
  "sections": [...],
  "duration": 123,
  "suggestedHighlights": [...]
}
```

### GET `/api/process-video`
健康檢查端點，返回系統狀態。

**響應格式**: JSON
```json
{
  "status": "ok",
  "geminiConfigured": true,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 開發注意事項

- Gemini AI 處理可能需要較長時間，特別是對於大型視頻文件
- 系統包含完整的錯誤處理和回退機制
- 所有 AI 相關的配置都集中在 `lib/config/gemini.ts` 中
- 可以通過 `isRealAI` 狀態變數檢查當前是否使用真實 AI 