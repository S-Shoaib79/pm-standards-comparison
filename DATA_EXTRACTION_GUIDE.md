# Data Extraction Guide

This guide will help you extract and add more content from your PM standards PDFs to the application.

## 📋 Quick Reference

The application uses `references.json` to store all data. You'll add content in three main sections:

1. **Repository Items**: Individual topics/sections from standards
2. **Comparisons**: Side-by-side topic comparisons
3. **Insights**: Similarities, differences, and unique elements

## 🔍 How to Extract Content from Your PDFs

### Step 1: Open Your PDFs
You have these files in your directory:
- `PM uniqueness .pdf` - Contains unique elements analysis
- `PM_standards_comparison.pdf` - Contains comparison data
- The actual standard PDFs (PMBOK, PRINCE2, ISO)

### Step 2: Extract Repository Items

For each important topic in the standards, create a repository entry:

```json
{
  "id": "pmbok-topic-name",
  "standard": "pmbok",
  "title": "Clear Topic Title",
  "content": "1-2 sentence description of what this section covers",
  "page": 123,
  "keywords": ["keyword1", "keyword2", "keyword3"]
}
```

**Example Process:**
1. Open PMBOK 7 PDF
2. Find a major section (e.g., "Team Performance Domain" on page 93)
3. Read the introduction/summary
4. Create the JSON entry with:
   - Unique ID: `pmbok-team-1`
   - Title: "Team Performance Domain"
   - Content: Summary paragraph
   - Page number: 93
   - Keywords: ["team", "collaboration", "leadership", "performance"]

### Step 3: Extract Comparisons

For each topic you want to compare (e.g., Risk, Stakeholder, Quality):

```json
"topic-name": {
  "pmbok": {
    "title": "How PMBOK refers to this",
    "description": "PMBOK's approach to this topic",
    "page": 145,
    "keyPoints": [
      "Key point 1",
      "Key point 2",
      "Key point 3"
    ]
  },
  "prince2": {
    "title": "How PRINCE2 refers to this",
    "description": "PRINCE2's approach to this topic",
    "page": 123,
    "keyPoints": [
      "Key point 1",
      "Key point 2"
    ]
  },
  "iso": {
    "standard": "iso21502",
    "title": "How ISO refers to this",
    "description": "ISO's approach to this topic",
    "page": 78,
    "keyPoints": [
      "Key point 1",
      "Key point 2"
    ]
  },
  "analysis": {
    "similarities": [
      "What all three have in common",
      "Another similarity"
    ],
    "differences": [
      "How they differ",
      "Another difference"
    ],
    "recommendations": [
      "When to use which approach",
      "Best practices from multiple standards"
    ]
  }
}
```

**Example Process:**
1. Choose a topic (e.g., "Procurement")
2. Find relevant sections in each standard:
   - PMBOK 7: Search for "Procurement" or "Acquisition"
   - PRINCE2: Look in relevant Theme or Process
   - ISO 21502: Find Procurement process
3. For each standard, note:
   - Title used for this topic
   - Main description/approach
   - Page number
   - 3-5 key points
4. Analyze:
   - What do all three say that's similar?
   - How do they differ?
   - What recommendations can you make?

### Step 4: Extract Insights

#### Similarities
Find common practices across all standards:

```json
{
  "topic": "Common Practice Name",
  "description": "Explanation of what all standards agree on",
  "references": [
    { "standard": "pmbok", "page": 73 },
    { "standard": "prince2", "page": 95 },
    { "standard": "iso21502", "page": 30 }
  ]
}
```

#### Differences
Find where standards diverge:

```json
{
  "topic": "Area of Difference",
  "standards": [
    { "standard": "pmbok", "approach": "PMBOK's approach", "page": 25 },
    { "standard": "prince2", "approach": "PRINCE2's approach", "page": 45 },
    { "standard": "iso21500", "approach": "ISO's approach", "page": 15 }
  ]
}
```

#### Unique Elements
Find what's unique to each standard:

```json
{
  "standard": "pmbok",
  "topic": "Unique Feature Name",
  "description": "What makes this unique to this standard",
  "page": 10
}
```

## 🎯 Using Your Existing PDFs

### From `PM_standards_comparison.pdf`

This PDF likely contains:
- Side-by-side comparisons of topics
- Analysis of similarities and differences
- Page references to source standards

**Extraction Strategy:**
1. Read through each comparison section
2. Extract the topic name
3. Copy relevant points for each standard
4. Note page references
5. Add to `comparisons` section in `references.json`

### From `PM uniqueness .pdf`

This PDF likely contains:
- Unique features of each standard
- What sets each standard apart

**Extraction Strategy:**
1. Read through each unique element
2. Note which standard it belongs to
3. Get the description
4. Find page reference in source standard
5. Add to `insights.unique` array in `references.json`

## 🛠️ Tools to Help

### PDF Text Extraction
If your PDFs are text-based (not scanned images):

**Windows:**
```powershell
# Using PowerShell to search PDFs
Select-String -Path "*.pdf" -Pattern "Risk Management"
```

**Online Tools:**
- PDFtk - Command line PDF toolkit
- Adobe Acrobat - Search across multiple PDFs
- PDF.js - Extract text programmatically

### Text Search in PDFs
1. Open PDF in browser or Adobe Reader
2. Use Ctrl+F (Cmd+F on Mac) to search
3. Find topics and note page numbers

## 📝 Template Workflow

### For Each Major Topic:

1. **Repository Entries** (15-30 min per topic)
   - [ ] Find section in PMBOK
   - [ ] Find section in PRINCE2
   - [ ] Find section in ISO
   - [ ] Create repository entry for each
   - [ ] Add to `references.json`

2. **Comparison** (30-45 min per topic)
   - [ ] Extract key points from each standard
   - [ ] Identify similarities
   - [ ] Identify differences
   - [ ] Write recommendations
   - [ ] Add to `comparisons` section

3. **Insights** (10-15 min per topic)
   - [ ] Identify if it's a similarity across all
   - [ ] Or if it's a difference
   - [ ] Or if it's unique to one standard
   - [ ] Add to appropriate `insights` section

## 🎨 Quality Tips

### Good Repository Entry
✅ Clear, concise title
✅ 1-2 sentence description (not too long)
✅ Accurate page number
✅ Relevant keywords (4-6 is good)
✅ Unique, descriptive ID

### Good Comparison
✅ Balanced coverage of all three standards
✅ Specific key points (not vague)
✅ Real analysis of similarities/differences
✅ Actionable recommendations
✅ Accurate page references

### Good Insight
✅ Clear, specific insight
✅ Well-explained description
✅ Accurate categorization (similarity/difference/unique)
✅ Page references for verification

## 🚀 Quick Start Checklist

- [ ] Open your PDFs side by side
- [ ] Start with a single topic (e.g., "Risk Management")
- [ ] Extract content from all three standards
- [ ] Create repository entries
- [ ] Create comparison
- [ ] Identify insights
- [ ] Add to `references.json`
- [ ] Test in the application
- [ ] Repeat for more topics

## 📊 Suggested Topics to Extract

### High Priority (most commonly compared)
1. Risk Management
2. Stakeholder Engagement
3. Quality Management
4. Planning/Scheduling
5. Cost Management
6. Scope Management
7. Resource Management
8. Communication
9. Procurement
10. Integration/Governance

### Medium Priority
11. Change Management
12. Configuration Management
13. Benefits Management
14. Organizational Change
15. Team Development

### Standard-Specific Topics
16. PMBOK: Value Delivery System, Performance Domains
17. PRINCE2: Product-Based Planning, Management by Exception, Business Case
18. ISO: Alignment with ISO 9001/31000, Portfolio Context

## 🔄 Continuous Improvement

As you use the application:
1. Note which comparisons are most useful
2. Add more detail to those areas
3. Identify gaps in coverage
4. Extract additional content
5. Refine existing entries for clarity

## 💡 Pro Tips

1. **Use consistent language**: Keep terminology consistent across entries
2. **Be specific**: Instead of "page 45-50", use the exact starting page
3. **Cross-reference**: If topics relate, mention it in descriptions
4. **Verify pages**: Always double-check page numbers are correct
5. **Keep it current**: Update if you get newer versions of standards

## 📞 Need Help?

If you're unsure about:
- Where a topic is covered in a standard
- How to categorize something
- Whether something is a similarity or difference

Just add what you can find, and refine later. The application is designed to grow over time!

---

**Happy Extracting! 🎯**

