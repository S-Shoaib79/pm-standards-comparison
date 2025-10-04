# PDF Page Offset Configuration Guide

## 📄 What Are Page Offsets?

Page offsets account for the difference between:
- **Reference Page**: The page number cited in the standard (e.g., "Page 5")
- **PDF Page**: The actual page in the PDF file where that content appears

Example: PMBOK reference "Page 1" might be at PDF page 30 (after cover, copyright, table of contents, etc.)

---

## 🔧 Current Configuration

Located in `app.js` (lines 13-18):

```javascript
const PDF_PAGE_OFFSETS = {
    pmbok: 30,      // PMBOK content page 1 is at PDF page 30
    prince2: 20,    // PRINCE2 content page 1 is at PDF page 20
    iso21500: 12,   // ISO 21500 typically has ~12 pages of front matter
    iso21502: 12    // ISO 21502 typically has ~12 pages of front matter
};
```

---

## 🔍 How to Find the Correct Offset

### Method 1: Manual Check

1. **Open the PDF** in a PDF reader
2. **Find a known reference** from your data (e.g., "Page 5")
3. **Navigate to that content** in the PDF
4. **Note the PDF page number** shown in the reader
5. **Calculate offset**: `PDF Page - Reference Page = Offset`

**Example:**
- Reference says "Page 5"
- You find that content at PDF page 35
- Offset = 35 - 5 = **30**

### Method 2: Find "Page 1"

1. **Open the PDF**
2. **Look for where main content "Page 1" appears**
   - Skip: Cover, Copyright, Foreword, Table of Contents
   - Find: First page of actual content/Chapter 1
3. **Note the PDF page number**
4. **Offset = PDF Page Number - 1**

**Example:**
- Content "Page 1" appears at PDF page 31
- Offset = 31 - 1 = **30**

---

## ✅ Verify Your Offsets

### Test Each Standard:

1. **PMBOK 7**
   - Open: `A Guide to the Project Management Body of Knowledge...pdf`
   - Find: Content page 1 or page 7 (12 Principles section)
   - Should be at PDF page: Reference Page + 30
   - ✅ Verified: Content page 18 → PDF page 48

2. **PRINCE2**
   - Open: `Managing Successful Projects with PRINCE2...pdf`
   - Find: Content page 1 or page 4 (Five Elements)
   - Should be at PDF page: Reference Page + 20
   - ✅ Verified: Content page 35 → PDF page 55

3. **ISO 21500**
   - Open: `ISO 21500-2021...pdf`
   - Find: Content page 5 or page 8
   - Should be at PDF page: Reference Page + 12
   - ⚠️ **VERIFY THIS**: May need adjustment

4. **ISO 21502**
   - Open: `ISO 21502-2020...pdf`
   - Find: Content page 9 or page 18
   - Should be at PDF page: Reference Page + 12
   - ⚠️ **VERIFY THIS**: May need adjustment

---

## 🔄 How to Adjust Offsets

If you find the offsets are wrong:

### Step 1: Determine Correct Offset
Use methods above to find correct value

### Step 2: Update app.js
Edit lines 13-18:

```javascript
const PDF_PAGE_OFFSETS = {
    pmbok: 30,        // ← Change this number
    prince2: 20,      // ← Change this number
    iso21500: 15,     // ← Change this number (example)
    iso21502: 14      // ← Change this number (example)
};
```

### Step 3: Test Locally
1. Refresh your browser (http://localhost:8000)
2. Click a page reference
3. Verify PDF opens at correct page

### Step 4: Push Changes
```powershell
git add app.js
git commit -m "Updated PDF page offsets"
git push origin main
```

---

## 📊 Common Offset Values

| Standard Type | Typical Offset | Reason |
|---------------|----------------|---------|
| PMBOK | 25-35 pages | Cover, copyright, foreword, TOC, introduction |
| PRINCE2 | 15-25 pages | Cover, contents, introduction |
| ISO Standards | 10-15 pages | Cover, copyright, foreword, scope |
| Academic Papers | 0-5 pages | Minimal front matter |

---

## 🧪 Quick Test

After setting offsets, test with these known references:

### PMBOK
- Reference Page 7 (12 Principles) → Should show principles
- Reference Page 25 (Team Domain) → Should show team content
- Reference Page 93 (Uncertainty) → Should show risk/uncertainty

### PRINCE2
- Reference Page 4 (Five Elements) → Should show elements
- Reference Page 76 (Governance) → Should show governance layers
- Reference Page 214 (Processes) → Should show process journey

### ISO 21502
- Reference Page 9 (Governance) → Should show governance
- Reference Page 18 (Integrated Practices) → Should show practices
- Reference Page 41 (Societal Change) → Should show change management

---

## 💡 Pro Tips

1. **PDF Reader Page Numbers**: Most PDF readers show page numbers in bottom corner
2. **Bookmarks**: Check PDF bookmarks to find major sections
3. **Search**: Use Ctrl+F to search for specific content
4. **Table of Contents**: Look at TOC to see where content starts
5. **Save Time**: Test with 2-3 references, not every single one

---

## 🆘 Troubleshooting

### Problem: PDF opens at wrong page

**Solution 1**: Verify offset calculation
- Open PDF manually
- Find the content
- Recalculate offset

**Solution 2**: Check standard identifier
- Ensure `references.json` uses correct standard ID
- Must match keys in `PDF_PAGE_OFFSETS`

**Solution 3**: Clear browser cache
- Hard refresh: Ctrl+F5
- Clear cache and reload

---

## 📝 Current Status

| Standard | Offset | Status | Last Verified |
|----------|--------|--------|---------------|
| PMBOK | 30 | ✅ Confirmed | 2025-10-04 |
| PRINCE2 | 20 | ✅ Confirmed | 2025-10-04 |
| ISO 21500 | 12 | ⚠️ Estimated | - |
| ISO 21502 | 12 | ⚠️ Estimated | - |

**Action Needed**: Verify ISO standard offsets by testing actual page references.

---

## 🎯 Next Steps

1. ✅ Test PMBOK offset (confirmed: 30)
2. ✅ Test PRINCE2 offset (confirmed: 20)
3. ⏳ Test ISO 21500 offset
4. ⏳ Test ISO 21502 offset
5. ⏳ Update this document with verified values
6. ⏳ Push final configuration

---

**Need Help?** Just open any PDF and compare one reference to find the offset!

