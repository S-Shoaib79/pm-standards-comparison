# PM Standards Comparison Tool

A comprehensive web application for exploring, comparing, and analyzing project management standards including **PMBOK 7**, **PRINCE2**, and **ISO 21500/21502**.

## 🎯 Features

### 1. **Standards Repository** 📚
- Search and browse full content across all PM standards
- Filter by specific standard (PMBOK, PRINCE2, ISO)
- Deep linking to exact pages in PDF documents
- Keyword-based organization and search
- Direct access to source material

### 2. **Comparison Engine** ⚖️
- Side-by-side comparison of standards by topic
- Topics include: Risk Management, Stakeholder Engagement, Planning, Quality, Governance, and more
- Deep links to exact sections in each standard
- Analysis of similarities, differences, and recommendations
- Evidence-based comparisons with page references

### 3. **Insights Dashboard** 💡
- **Common Practices**: Discover similarities across all standards
- **Key Differences**: Understand unique approaches and terminologies
- **Unique Elements**: Explore what makes each standard distinctive
- **Coverage Map**: Visual representation of topic coverage across standards
- All insights linked to source documents with page numbers

### 4. **Process Generator** 🔧
- Generate tailored project processes for specific scenarios
- Customize by:
  - Project type (Software, Construction, R&D, etc.)
  - Project size (Small, Medium, Large)
  - Organizational maturity
  - Focus areas (Risk, Stakeholder, Quality, Agile, etc.)
- Evidence-based recommendations with references to standards
- Exportable and printable process documentation

## 📖 Standards Covered

### PMBOK 7 (Project Management Body of Knowledge)
- Principle-based approach with 12 principles
- 8 Performance Domains
- Integrated agile and adaptive methods
- Focus on value delivery and outcomes

### PRINCE2 (PRojects IN Controlled Environments)
- Structured methodology with 7 principles, 7 themes, 7 processes
- Product-based planning approach
- Strong governance with Project Board
- Management by exception

### ISO 21500 & 21502
- International standards for project management
- ISO 21500: High-level concepts and context
- ISO 21502: Detailed process guidance
- Aligned with ISO quality and risk management standards

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for local development) or simply open `index.html`

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd pm-standards-tool
   ```

2. **Ensure PDF files are in the root directory**
   The following PDF files should be present:
   - `A Guide to the Project Management Body of Knowledge (PMBOK® Guide) – Seventh Edition and The Standard for.pdf`
   - `Managing Successful Projects with PRINCE2® -- Andy Murray -- 7, 2023 -- PeopleCert International Limited.pdf`
   - `ISO 21500-2021_ Project, programme and portfolio management - Context and concepts.pdf`
   - `ISO 21502-2020_ Project, programme and portfolio management - Guidance on project management.pdf`

3. **Open the application**
   - **Option 1**: Double-click `index.html` to open in your default browser
   - **Option 2**: Use a local web server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js (with npx)
     npx http-server
     ```
   - Navigate to `http://localhost:8000`

## 💻 Usage

### Searching Standards
1. Navigate to the **Standards Repository** tab
2. Use the search box to find specific topics (e.g., "risk management")
3. Filter by specific standard using the filter chips
4. Click "Open in PDF" to view the exact page in the source document

### Comparing Standards
1. Go to the **Comparison Engine** tab
2. Select a topic from the dropdown (e.g., "Risk Management")
3. View side-by-side comparison of how each standard approaches the topic
4. Click page references to open exact sections in PDFs
5. Review analysis of similarities, differences, and recommendations

### Exploring Insights
1. Visit the **Insights Dashboard** tab
2. Explore:
   - **Common Practices**: What all standards agree on
   - **Key Differences**: How standards differ in approach
   - **Unique Elements**: What each standard uniquely offers
3. View the **Coverage Map** to see topic coverage across standards
4. Click any reference to open the source document

### Generating Tailored Processes
1. Open the **Process Generator** tab
2. Select your project characteristics:
   - Project type
   - Project size
   - Organizational maturity
   - Key focus areas
3. Click **Generate Tailored Process**
4. Review the customized process with phases, activities, and deliverables
5. All recommendations include references to relevant standards
6. Export or print the generated process

## 🗂️ File Structure

```
pm-standards-tool/
│
├── index.html              # Main application HTML
├── app.js                  # Application logic and data handling
├── styles.css              # Complete styling and responsive design
├── references.json         # Standards data, comparisons, and insights
├── README.md              # This file
│
└── [PDF Files]            # Standard documents (not included in repo)
    ├── PMBOK 7.pdf
    ├── PRINCE2.pdf
    ├── ISO 21500.pdf
    └── ISO 21502.pdf
```

## 📊 Data Structure

### references.json

The `references.json` file contains all the data for the application:

```json
{
  "repository": [
    {
      "id": "unique-id",
      "standard": "pmbok|prince2|iso21500|iso21502",
      "title": "Topic title",
      "content": "Description of the topic",
      "page": 123,
      "keywords": ["keyword1", "keyword2"]
    }
  ],
  "comparisons": {
    "topic-name": {
      "pmbok": { "title": "...", "description": "...", "page": 123, "keyPoints": [] },
      "prince2": { "title": "...", "description": "...", "page": 123, "keyPoints": [] },
      "iso": { "standard": "iso21502", "title": "...", "description": "...", "page": 123, "keyPoints": [] },
      "analysis": {
        "similarities": [],
        "differences": [],
        "recommendations": []
      }
    }
  },
  "insights": {
    "similarities": [],
    "differences": [],
    "unique": []
  }
}
```

## 🎨 Customization

### Adding New Comparisons
Edit `references.json` and add new topics to the `comparisons` object. Update the dropdown in `index.html`:

```html
<option value="your-topic">Your Topic Name</option>
```

### Adding Repository Items
Add new items to the `repository` array in `references.json` with:
- Unique ID
- Standard identifier
- Title and content
- Page number
- Relevant keywords

### Styling
Modify `styles.css` to customize:
- Color scheme (CSS variables in `:root`)
- Layout and spacing
- Typography
- Responsive breakpoints

## 🌐 Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px+)

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern layouts (Grid, Flexbox), animations, responsive design
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **JSON**: Data storage and configuration

### Key Features
- **No Dependencies**: Works without internet connection (except for loading PDFs)
- **Fast Performance**: Lightweight, optimized rendering
- **Accessible**: Semantic HTML, keyboard navigation
- **Printable**: Print-optimized CSS for generating reports

## 📄 PDF Deep Linking

The application uses PDF fragment syntax to open specific pages:
```
filename.pdf#page=123
```

This works in most modern browsers and PDF viewers.

## 🚧 Troubleshooting

### PDFs Not Opening
- Ensure PDF files are in the correct location (root directory)
- Check that filenames match exactly (including spaces and special characters)
- Some browsers may block PDF opening; check browser settings

### Search Not Working
- Clear browser cache
- Ensure `references.json` is valid JSON
- Check browser console for errors

### Styling Issues
- Hard refresh (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache
- Ensure `styles.css` is loading correctly

## 🤝 Contributing

To contribute:
1. Add more comparison topics
2. Enhance insights with deeper analysis
3. Add more repository items from the standards
4. Improve UI/UX
5. Add export functionality (PDF, Word, etc.)

## 📝 License

This tool is for educational and research purposes. The PM standards content belongs to their respective copyright holders:
- PMBOK Guide: Project Management Institute (PMI)
- PRINCE2: AXELOS/PeopleCert
- ISO Standards: International Organization for Standardization

## 👥 Target Audience

- **Project Managers**: Compare and choose appropriate standards
- **Students**: Learn and understand different PM frameworks
- **Researchers**: Analyze standards systematically
- **Organizations**: Select and tailor PM approaches
- **Instructors**: Teaching material for PM courses

## 🎓 Educational Value

This tool helps users:
- Understand similarities and differences between major PM standards
- Make informed decisions about which standard(s) to adopt
- Tailor project processes based on evidence from multiple standards
- Access source material quickly with deep linking
- Generate customized processes for specific scenarios

## 📞 Support

For issues, questions, or suggestions, please refer to the documentation or consult the source standards.

---

**Built with ❤️ for the Project Management Community**

