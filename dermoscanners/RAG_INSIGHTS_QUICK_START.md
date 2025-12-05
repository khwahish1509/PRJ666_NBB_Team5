# RAG Insights - Quick Start Guide

## 🚀 Quick Start

### Test the RAG Service
```bash
node dermoscanners/server/test-rag-insights.js
```

### Start the Server
```bash
cd dermoscanners/server
npm run dev
```

### Start the Client
```bash
cd dermoscanners/client
npm run dev
```

---

## 📡 API Usage Examples

### 1. Analyze Image (with Insights)
```javascript
const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch('http://localhost:5001/api/ai/analyze', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data.insights.explanation);
```

### 2. Generate Insights Only
```javascript
const response = await fetch('http://localhost:5001/api/ai/insights', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    result: 'suspicious',
    confidence: 0.73
  })
});

const { data } = await response.json();
console.log(data.explanation);
```

### 3. Search Knowledge Base
```javascript
const response = await fetch(
  'http://localhost:5001/api/ai/knowledge/search?q=melanoma'
);

const { results } = await response.json();
console.log(results);
```

### 4. Get Prevention Guidelines
```javascript
const response = await fetch(
  'http://localhost:5001/api/ai/knowledge/prevention'
);

const { data } = await response.json();
console.log(data.sunProtection);
```

---

## 🔧 Using the RAG Service in Code

### Import the Service
```javascript
import { 
  generateInsights, 
  searchKnowledge, 
  getPreventionGuidelines,
  getRiskFactors 
} from './services/ragInsightsService.js';
```

### Generate Insights
```javascript
const insights = generateInsights('benign', 0.92);

console.log(insights.explanation);
console.log(insights.keyFindings);
console.log(insights.recommendations);
```

### Search Knowledge
```javascript
const results = searchKnowledge('melanoma skin cancer');

results.forEach(result => {
  console.log(`${result.lesion}: ${result.description}`);
});
```

---

## 🎨 Frontend Integration

### Import Components
```typescript
import InsightsCard, { Insight } from '../components/scan/InsightsCard';
```

### Display Insights
```tsx
{scanResult.insights && (
  <InsightsCard
    insights={scanResult.insights}
    result={scanResult.result}
  />
)}
```

---

## 📊 Insight Structure

```typescript
interface Insight {
  explanation: string;
  keyFindings: Array<{
    category: string;
    finding: string;
    confidence: string | null;
  }>;
  medicalContext: {
    lesionType: string;
    description: string;
    prevalence: string;
    riskLevel: string;
  } | null;
  recommendations: string[];
  warningSigns: {
    title: string;
    signs?: Array<{ letter: string; description: string }>;
    features?: Record<string, string>;
  } | null;
  confidenceLevel: string;
  disclaimer: string;
}
```

---

## 🧪 Testing Checklist

- [ ] Run test script: `node dermoscanners/server/test-rag-insights.js`
- [ ] Test benign result (confidence 0.9+)
- [ ] Test suspicious result (confidence 0.6-0.8)
- [ ] Test malignant result (confidence 0.7+)
- [ ] Test knowledge search
- [ ] Test prevention guidelines
- [ ] Test risk factors
- [ ] Verify UI displays insights correctly
- [ ] Check mobile responsiveness
- [ ] Verify insights save to database

---

## 🔍 Debugging Tips

### Check if Insights are Generated
```javascript
console.log('Insights:', scanResult.insights);
```

### Verify Knowledge Base Loaded
```javascript
import { getRiskFactors } from './services/ragInsightsService.js';
console.log(getRiskFactors());
```

### Test Individual Components
```bash
# Test RAG service
node dermoscanners/server/test-rag-insights.js

# Test AI endpoint
node dermoscanners/server/test-ai-endpoint.js
```

---

## 📝 Common Issues

### Issue: Insights not showing
**Solution**: Check that `insights` field is included in API response

### Issue: Knowledge base not found
**Solution**: Verify `server/data/skinLesionKnowledge.json` exists

### Issue: InsightsCard not rendering
**Solution**: Check that `insights` prop is not null/undefined

---

## 🎯 Key Files Reference

| File | Purpose |
|------|---------|
| `server/data/skinLesionKnowledge.json` | Medical knowledge base |
| `server/services/ragInsightsService.js` | RAG logic |
| `server/controllers/aiController.js` | API endpoints |
| `client/src/components/scan/InsightsCard.tsx` | UI component |
| `server/test-rag-insights.js` | Test suite |

---

## 💡 Tips

1. **Confidence Levels**:
   - 0.9+ = Very High
   - 0.75-0.89 = High
   - 0.6-0.74 = Moderate
   - <0.6 = Low

2. **Result Types**:
   - `benign` = Green theme, routine monitoring
   - `suspicious` = Yellow theme, ABCDE warnings
   - `malignant` = Red theme, urgent care

3. **Customization**:
   - Edit `skinLesionKnowledge.json` to add more lesion types
   - Modify `ragInsightsService.js` to change explanation logic
   - Update `InsightsCard.tsx` to change UI appearance

---

## 📚 Learn More

- See `ISSUE_64_RAG_INSIGHTS_IMPLEMENTATION.md` for full documentation
- Check `server/test-rag-insights.js` for usage examples
- Review `skinLesionKnowledge.json` for knowledge base structure

---

**Quick Links**:
- [Full Documentation](./ISSUE_64_RAG_INSIGHTS_IMPLEMENTATION.md)
- [Knowledge Base](./server/data/skinLesionKnowledge.json)
- [RAG Service](./server/services/ragInsightsService.js)
- [Test Script](./server/test-rag-insights.js)
