# How to Update with Real PDF Data

Super simple! When you have real PDFs, just replace the mock data.

## Step 1: Look at the current mock data

File: `frontend/src/services/mockRAGService.js`

```javascript
const mockPDFs = {
  "solar_guide.pdf": {
    name: "Solar Installation Guide",
    topic: "solar",
    pages: [
      {
        page: 1,
        content: "Solar panels convert sunlight..."
      },
      ...
    ]
  }
}
```

## Step 2: Replace with your content

Just copy-paste your PDF text in the same format:

```javascript
const mockPDFs = {
  "your_pdf_name.pdf": {
    name: "Your PDF Title",
    topic: "your_topic",  // solar, battery, energy, etc
    pages: [
      {
        page: 1,
        content: "Your PDF text here..."
      },
      {
        page: 2,
        content: "More text..."
      }
    ]
  }
}
```

## Example: Add a new PDF

```javascript
const mockPDFs = {
  // ... existing PDFs ...
  
  "new_guide.pdf": {
    name: "New Guide Title",
    topic: "troubleshooting",
    pages: [
      {
        page: 1,
        content: "Content from page 1 of your PDF"
      },
      {
        page: 2,
        content: "Content from page 2 of your PDF"
      },
      {
        page: 3,
        content: "Content from page 3 of your PDF"
      }
    ]
  }
}
```

## That's it!

- No code changes needed
- The search function stays the same
- RAGChatBot.js stays the same
- Just swap the data!

## Later: Real Backend (Optional)

If you want to use ChromaDB backend instead:

1. Replace `mockRAGService.js` with API calls
2. RAGChatBot.js doesn't change - still calls searchPDFs()
3. Backend handles embedding/searching
4. Frontend stays simple!

## Structure Template

```javascript
const mockPDFs = {
  "filename.pdf": {
    name: "Display Name",
    topic: "category",  // Pick one: solar, battery, energy, troubleshooting, faq
    pages: [
      {
        page: PAGE_NUMBER,
        content: "TEXT FROM THAT PAGE"
      }
    ]
  }
}
```

Keep it simple, keep it organized, keep it easy to understand! 📚
