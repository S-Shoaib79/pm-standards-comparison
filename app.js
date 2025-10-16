// PM Standards Comparison Tool - Main Application Logic

// PDF file mappings
const PDF_FILES = {
    pmbok: "A Guide to the Project Management Body of Knowledge (PMBOK® Guide) – Seventh Edition and The Standard for.pdf",
    prince2: "Managing Successful Projects with PRINCE2® -- Andy Murray -- 7, 2023 -- PeopleCert International Limited.pdf",
    iso21500: "ISO 21500-2021_ Project, programme and portfolio management - Context and concepts.pdf",
    iso21502: "ISO 21502-2020_ Project, programme and portfolio management - Guidance on project management.pdf"
};

// PDF page offsets: Add this number to reference page to get actual PDF page
// To find offset: Open PDF, find where "Page 1" of content appears, subtract 1 from PDF page number
const PDF_PAGE_OFFSETS = {
    pmbok: 0,      // PMBOK content page 1 is at PDF page 30
    prince2: 0,    // PRINCE2 content page 1 is at PDF page 20
    iso21500: 0,    // ISO 21500 pages already correctly mapped
    iso21502: 0     // ISO 21502 pages already correctly mapped
};

// Data structure for standards content
let standardsData = {
    repository: [],
    comparisons: {},
    insights: {
        similarities: [],
        differences: [],
        unique: []
    }
};

// Load data on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    initializeApp();
});

// Initialize application
function initializeApp() {
    setupTabNavigation();
    setupRepositoryView();
    setupPDFLibrary();
    setupComparisonEngine();
    setupUniquenessAnalysis();
    setupInsightsDashboard();
    setupTailoredProcesses();
    setupProcessGenerator();
    setupPDFModal();
    loadBookmarkCounts();
}

// Tab Navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Load all data from JSON file
async function loadData() {
    try {
        const response = await fetch('references.json');
        const data = await response.json();
        standardsData = data;
    } catch (error) {
        console.error('Error loading data:', error);
        // Load with default data if file doesn't exist
        loadDefaultData();
    }
}

// Repository View Setup
function setupRepositoryView() {
    const filterChips = document.querySelectorAll('.filter-chip');
    let currentFilter = 'all';

    // Filter chips
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.dataset.filter;
            displayRepositoryContent('', currentFilter);
        });
    });

    // Initial display
    displayRepositoryContent('', 'all');
}

function displayRepositoryContent(searchTerm = '', filter = 'all') {
    const container = document.getElementById('repositoryContent');
    let items = standardsData.repository || [];

    // Apply filter
    if (filter !== 'all') {
        items = items.filter(item => item.standard === filter);
    }

    // Apply search
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        items = items.filter(item => 
            item.title.toLowerCase().includes(term) ||
            item.content.toLowerCase().includes(term) ||
            item.keywords.some(k => k.toLowerCase().includes(term))
        );
    }

    if (items.length === 0) {
        container.innerHTML = '<div class="no-results">No results found. Try a different search term or filter.</div>';
        return;
    }

    // Display items
    let html = '';
    items.forEach(item => {
        html += `
            <div class="standard-card" data-standard="${item.standard}">
                <div class="standard-badge ${item.standard}">${getStandardName(item.standard)}</div>
                <h3>${item.title}</h3>
                <p class="standard-content">${item.content}</p>
                <div class="standard-meta">
                    <span class="page-ref">📄 Page ${item.page}</span>
                    <div class="standard-keywords">
                        ${item.keywords.map(k => `<span class="keyword-tag">${k}</span>`).join('')}
                    </div>
                </div>
                <div class="standard-actions">
                    <button class="btn-link" onclick="openPDF('${item.standard}', ${item.page})">
                        📖 Open in PDF
                    </button>
                    <button class="btn-link secondary" onclick="viewContext('${item.id}')">
                        🔍 View Context
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// PDF Library Setup
function setupPDFLibrary() {
    const openBookButtons = document.querySelectorAll('.open-book-btn');
    
    openBookButtons.forEach(button => {
        button.addEventListener('click', () => {
            const standard = button.dataset.standard;
            openBookFromLibrary(standard);
        });
    });
}

function openBookFromLibrary(standard) {
    const lastPage = getLastReadPage(standard);
    const page = lastPage || 1;
    openPDF(standard, page);
}

// Bookmark Management
let currentStandard = null;
let currentPage = 1;

function getBookmarks(standard) {
    const bookmarks = localStorage.getItem(`bookmarks_${standard}`);
    return bookmarks ? JSON.parse(bookmarks) : [];
}

function saveBookmark(standard, page, note = '') {
    const bookmarks = getBookmarks(standard);
    const existing = bookmarks.find(b => b.page === page);
    
    if (!existing) {
        bookmarks.push({
            page: page,
            note: note,
            timestamp: new Date().toISOString()
        });
        bookmarks.sort((a, b) => a.page - b.page);
        localStorage.setItem(`bookmarks_${standard}`, JSON.stringify(bookmarks));
        updateBookmarkButton(true);
        loadBookmarks(standard);
        loadBookmarkCounts();
        return true;
    }
    return false;
}

function removeBookmark(standard, page) {
    const bookmarks = getBookmarks(standard);
    const filtered = bookmarks.filter(b => b.page !== page);
    localStorage.setItem(`bookmarks_${standard}`, JSON.stringify(filtered));
    updateBookmarkButton(false);
    loadBookmarks(standard);
    loadBookmarkCounts();
}

function isPageBookmarked(standard, page) {
    const bookmarks = getBookmarks(standard);
    return bookmarks.some(b => b.page === page);
}

function getLastReadPage(standard) {
    const lastPage = localStorage.getItem(`lastPage_${standard}`);
    return lastPage ? parseInt(lastPage) : null;
}

function saveLastReadPage(standard, page) {
    localStorage.setItem(`lastPage_${standard}`, page.toString());
}

function loadBookmarks(standard) {
    const bookmarks = getBookmarks(standard);
    const bookmarksList = document.getElementById('bookmarksList');
    
    if (bookmarks.length === 0) {
        bookmarksList.innerHTML = '<p class="no-bookmarks">No bookmarks yet. Click the bookmark button to save pages.</p>';
        return;
    }
    
    let html = '';
    bookmarks.forEach(bookmark => {
        html += `
            <div class="bookmark-item" data-page="${bookmark.page}">
                <div class="bookmark-page">Page ${bookmark.page}</div>
                <div class="bookmark-actions">
                    <button class="bookmark-go-btn" onclick="goToBookmarkPage(${bookmark.page})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                    <button class="bookmark-delete-btn" onclick="deleteBookmark('${standard}', ${bookmark.page})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    });
    
    bookmarksList.innerHTML = html;
}

function loadBookmarkCounts() {
    const standards = ['pmbok', 'prince2', 'iso21500', 'iso21502'];
    standards.forEach(standard => {
        const bookmarks = getBookmarks(standard);
        const countElement = document.querySelector(`.bookmark-count[data-standard="${standard}"]`);
        if (countElement) {
            const count = bookmarks.length;
            countElement.textContent = `${count} Bookmark${count !== 1 ? 's' : ''}`;
        }
    });
}

function updateBookmarkButton(isBookmarked) {
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    if (bookmarkBtn) {
        if (isBookmarked) {
            bookmarkBtn.classList.add('bookmarked');
            bookmarkBtn.title = 'Remove bookmark';
        } else {
            bookmarkBtn.classList.remove('bookmarked');
            bookmarkBtn.title = 'Bookmark this page';
        }
    }
}

window.goToBookmarkPage = function(page) {
    const viewer = document.getElementById('pdfViewer');
    const currentSrc = viewer.src;
    const baseUrl = currentSrc.split('#')[0];
    
    // Apply page offset to get actual PDF page number
    const offset = PDF_PAGE_OFFSETS[currentStandard] || 0;
    const actualPage = page + offset;
    
    viewer.src = `${baseUrl}#page=${actualPage}`;
    currentPage = page;
    updatePageNumber(page);
    updateBookmarkButton(isPageBookmarked(currentStandard, page));
    saveLastReadPage(currentStandard, page);
};

window.deleteBookmark = function(standard, page) {
    removeBookmark(standard, page);
};

// Comparison Engine Setup
function setupComparisonEngine() {
    const topicSelector = document.getElementById('comparisonTopic');
    
    topicSelector.addEventListener('change', (e) => {
        if (e.target.value) {
            displayComparison(e.target.value);
        }
    });
}

// Helper function to generate page buttons
function generatePageButtons(standard, page, standardName) {
    if (Array.isArray(page)) {
        return page.map((p, index) => 
            `<button class="btn-link" onclick="openPDF('${standard}', ${p})">
                📖 ${standardName} Page ${p}
            </button>`
        ).join('');
    } else {
        return `<button class="btn-link" onclick="openPDF('${standard}', ${page})">
            📖 Open ${standardName} Page ${page}
        </button>`;
    }
}

function displayComparison(topic) {
    const container = document.getElementById('comparisonContent');
    const comparison = standardsData.comparisons[topic];

    if (!comparison) {
        container.innerHTML = '<div class="no-results">Comparison data not available for this topic.</div>';
        return;
    }

    let html = `
        <div class="comparison-grid">
            <div class="comparison-column pmbok">
                <div class="column-header">
                    <h3>PMBOK 7</h3>
                    <span class="standard-icon">📘</span>
                </div>
                <div class="comparison-content">
                    <h4>${comparison.pmbok.title}</h4>
                    <p>${comparison.pmbok.description}</p>
                    <div class="key-points">
                        <strong>Key Points:</strong>
                        <ul>
                            ${comparison.pmbok.keyPoints.map(p => `<li>${p}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="page-buttons">
                        ${generatePageButtons('pmbok', comparison.pmbok.page, 'PMBOK')}
                    </div>
                </div>
            </div>

            <div class="comparison-column prince2">
                <div class="column-header">
                    <h3>PRINCE2</h3>
                    <span class="standard-icon">📗</span>
                </div>
                <div class="comparison-content">
                    <h4>${comparison.prince2.title}</h4>
                    <p>${comparison.prince2.description}</p>
                    <div class="key-points">
                        <strong>Key Points:</strong>
                        <ul>
                            ${comparison.prince2.keyPoints.map(p => `<li>${p}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="page-buttons">
                        ${generatePageButtons('prince2', comparison.prince2.page, 'PRINCE2')}
                    </div>
                </div>
            </div>

            <div class="comparison-column iso">
                <div class="column-header">
                    <h3>ISO 21500/21502</h3>
                    <span class="standard-icon">📙</span>
                </div>
                <div class="comparison-content">
                    <h4>${comparison.iso.title}</h4>
                    <p>${comparison.iso.description}</p>
                    <div class="key-points">
                        <strong>Key Points:</strong>
                        <ul>
                            ${comparison.iso.keyPoints.map(p => `<li>${p}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="page-buttons">
                        ${generatePageButtons(comparison.iso.standard, comparison.iso.page, 'ISO')}
                    </div>
                </div>
            </div>
        </div>

        <div class="comparison-analysis">
            <div class="analysis-section similarities">
                <h4>🤝 Similarities</h4>
                <ul>
                    ${comparison.analysis.similarities.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
            <div class="analysis-section differences">
                <h4>🔄 Differences</h4>
                <ul>
                    ${comparison.analysis.differences.map(d => `<li>${d}</li>`).join('')}
                </ul>
            </div>
            <div class="analysis-section recommendations">
                <h4>💡 Recommendations</h4>
                <ul>
                    ${comparison.analysis.recommendations.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Uniqueness Analysis Setup
function setupUniquenessAnalysis() {
    displayUniquenessAnalysis();
}

function displayUniquenessAnalysis() {
    const unique = standardsData.insights.unique;
    
    // Group by standard
    const pmbokFeatures = unique.filter(item => item.standard === 'pmbok');
    const prince2Features = unique.filter(item => item.standard === 'prince2');
    const isoFeatures = unique.filter(item => item.standard === 'iso21500' || item.standard === 'iso21502');
    
    // Display PMBOK unique features
    displayStandardUniqueness('pmbokUnique', pmbokFeatures, 'pmbok');
    
    // Display PRINCE2 unique features
    displayStandardUniqueness('prince2Unique', prince2Features, 'prince2');
    
    // Display ISO unique features
    displayStandardUniqueness('isoUnique', isoFeatures, 'iso21500');
}

function displayStandardUniqueness(containerId, features, standard) {
    const container = document.getElementById(containerId);
    
    if (!features || features.length === 0) {
        container.innerHTML = '<p class="no-features">No unique features documented yet.</p>';
        return;
    }
    
    let html = '<ul class="uniqueness-list">';
    features.forEach(feature => {
        const pageButtons = Array.isArray(feature.page) 
            ? feature.page.map(p => 
                `<button class="ref-badge" onclick="openPDF('${feature.standard}', ${p})">
                    📖 ${getStandardName(feature.standard)} Page ${p}
                </button>`
              ).join('')
            : `<button class="ref-badge" onclick="openPDF('${feature.standard}', ${feature.page})">
                📖 ${getStandardName(feature.standard)} Page ${feature.page}
              </button>`;
        
        html += `
            <li class="uniqueness-item">
                <div class="uniqueness-item-header">
                    <span class="uniqueness-badge">⭐ UNIQUE</span>
                    <h4>${feature.topic}</h4>
                </div>
                <p class="uniqueness-description">${feature.description}</p>
                <div class="uniqueness-meta">
                    ${pageButtons}
                </div>
            </li>
        `;
    });
    html += '</ul>';
    
    container.innerHTML = html;
}

// Insights Dashboard Setup
function setupInsightsDashboard() {
    displaySimilarities();
    displayDifferences();
    displayUniqueElements();
    displayCoverageMap();
}

function displaySimilarities() {
    const container = document.getElementById('similaritiesContent');
    const similarities = standardsData.insights.similarities;

    let html = '<ul class="insight-list">';
    similarities.forEach(item => {
        html += `
            <li class="insight-item">
                <strong>${item.topic}</strong>
                <p>${item.description}</p>
                <div class="insight-refs">
                    ${item.references.map(ref => 
                        `<button class="ref-badge" onclick="openPDF('${ref.standard}', ${ref.page})">
                            ${getStandardName(ref.standard)} p.${ref.page}
                        </button>`
                    ).join('')}
                </div>
            </li>
        `;
    });
    html += '</ul>';
    container.innerHTML = html;
}

function displayDifferences() {
    const container = document.getElementById('differencesContent');
    const differences = standardsData.insights.differences;

    let html = '<ul class="insight-list">';
    differences.forEach(item => {
            html += `
            <li class="insight-item">
                <strong>${item.topic}</strong>
                <div class="difference-comparison">
                    ${item.standards.map(std => `
                        <div class="diff-item">
                            <span class="diff-badge ${std.standard}">${getStandardName(std.standard)}</span>
                            <p>${std.approach}</p>
                            <button class="ref-badge" onclick="openPDF('${std.standard}', ${std.page})">
                                p.${std.page}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </li>
        `;
    });
    html += '</ul>';
    container.innerHTML = html;
}

function displayUniqueElements() {
    const container = document.getElementById('uniqueContent');
    const unique = standardsData.insights.unique;

    let html = '<ul class="insight-list">';
    unique.forEach(item => {
        html += `
            <li class="insight-item unique-item">
                <div class="unique-badge ${item.standard}">${getStandardName(item.standard)} Unique</div>
                <strong>${item.topic}</strong>
                <p>${item.description}</p>
                <button class="ref-badge" onclick="openPDF('${item.standard}', ${item.page})">
                    Open ${getStandardName(item.standard)} p.${item.page}
                </button>
            </li>
        `;
    });
    html += '</ul>';
    container.innerHTML = html;
}

function displayCoverageMap() {
    const container = document.getElementById('coverageMap');
    const topics = ['Planning', 'Risk', 'Stakeholder', 'Quality', 'Resources', 'Communication', 'Procurement', 'Integration'];
    const standards = ['pmbok', 'prince2', 'iso21500', 'iso21502'];

    let html = '<div class="coverage-table"><table><thead><tr><th>Topic</th>';
    standards.forEach(std => {
        html += `<th>${getStandardName(std)}</th>`;
    });
    html += '</tr></thead><tbody>';

    topics.forEach(topic => {
        html += `<tr><td><strong>${topic}</strong></td>`;
        standards.forEach(std => {
            const coverage = getCoverageLevel(topic, std);
            html += `<td><div class="coverage-indicator ${coverage.level}" title="${coverage.description}"></div></td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    html += `
        <div class="coverage-legend">
            <span><div class="coverage-indicator comprehensive"></div> Comprehensive</span>
            <span><div class="coverage-indicator moderate"></div> Moderate</span>
            <span><div class="coverage-indicator basic"></div> Basic</span>
            <span><div class="coverage-indicator none"></div> Not Covered</span>
        </div>
    `;

    container.innerHTML = html;
}

// Tailored Processes Setup
function setupTailoredProcesses() {
    displayTailoredProcessCards();
}

function displayTailoredProcessCards() {
    const container = document.querySelector('.tailored-processes-grid');
    if (!container) return;
    
    const processes = standardsData.tailoredProcesses;
    if (!processes) return;
    
    let html = '';
    
    // Custom Software Development Process Card
    if (processes.customSoftwareDevelopment) {
        const process = processes.customSoftwareDevelopment;
        html += `
            <div class="process-scenario-card" onclick="showProcessDetail('customSoftwareDevelopment')">
                <div class="scenario-icon software-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                </div>
                <div class="scenario-content">
                    <h3>${process.title}</h3>
                    <p class="scenario-description">${process.context.description}</p>
                    <div class="scenario-tags">
                        <span class="tag">Duration: &lt;6 months</span>
                        <span class="tag">Team: &lt;7 members</span>
                        <span class="tag">Agile Approach</span>
                    </div>
                    <div class="scenario-stats">
                        <div class="stat">
                            <strong>${process.phases.length}</strong>
                            <span>Phases</span>
                        </div>
                        <div class="stat">
                            <strong>${process.roles.length}</strong>
                            <span>Key Roles</span>
                        </div>
                        <div class="stat">
                            <strong>${process.keyArtifacts.length}</strong>
                            <span>Artifacts</span>
                        </div>
                    </div>
                </div>
                <div class="scenario-footer">
                    <span class="view-details-btn">View Details →</span>
                </div>
            </div>
        `;
    }
    
    // Placeholder for future processes
    html += `
        <div class="process-scenario-card placeholder-card">
            <div class="scenario-icon placeholder-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
            </div>
            <div class="scenario-content">
                <h3>Innovative Product Development</h3>
                <p class="scenario-description">R&D-heavy, uncertain outcomes, ~1 year duration</p>
                <div class="scenario-tags">
                    <span class="tag">Duration: ~1 year</span>
                    <span class="tag">R&D Focus</span>
                    <span class="tag">Adaptive</span>
                </div>
            </div>
            <div class="scenario-footer placeholder-footer">
                <span>Coming Soon</span>
            </div>
        </div>
        
        <div class="process-scenario-card placeholder-card">
            <div class="scenario-icon placeholder-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
            </div>
            <div class="scenario-content">
                <h3>Large Government Project</h3>
                <p class="scenario-description">Civil, electrical, IT components, 2-year duration</p>
                <div class="scenario-tags">
                    <span class="tag">Duration: 2 years</span>
                    <span class="tag">Multi-component</span>
                    <span class="tag">Compliance Heavy</span>
                </div>
            </div>
            <div class="scenario-footer placeholder-footer">
                <span>Coming Soon</span>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

window.showProcessDetail = function(processKey) {
    const processData = standardsData.tailoredProcesses?.[processKey];
    if (!processData) return;
    
    // Hide the grid and show detail view
    const grid = document.querySelector('.tailored-processes-grid');
    const detailView = document.getElementById('processDetailView');
    
    grid.style.display = 'none';
    detailView.style.display = 'block';
    
    // Generate detailed view HTML
    detailView.innerHTML = generateProcessDetailHTML(processData);
    
    // Scroll to top
    window.scrollTo(0, 0);
};

window.backToProcessList = function() {
    const grid = document.querySelector('.tailored-processes-grid');
    const detailView = document.getElementById('processDetailView');
    
    grid.style.display = 'grid';
    detailView.style.display = 'none';
    
    // Scroll to top
    window.scrollTo(0, 0);
};

function generateProcessDetailHTML(processData) {
    let html = `
        <div class="process-detail-header">
            <button class="back-btn" onclick="backToProcessList()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Processes
            </button>
            <div class="export-actions">
                <button class="btn-secondary" onclick="exportProcessToPDF('${processData.title}')">Export to PDF</button>
            </div>
        </div>
        
        <div class="tailored-process-container">
            <div class="process-header">
                <h3>${processData.title}</h3>
                <p class="process-subtitle">A lightweight, evidence-based process tailored for your project needs</p>
            </div>
            
            <div class="process-context">
                <h4>Project Context</h4>
                <p>${processData.context.description}</p>
                
                <div class="context-characteristics">
                    <h5>Key Characteristics:</h5>
                    <ul>
                        ${processData.context.characteristics.map(char => `<li>${char}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="tailoring-rationale">
                    <h5>Tailoring Rationale:</h5>
                    <p>${processData.context.tailoringRationale}</p>
                </div>
            </div>
            
            ${generatePhasesHTML(processData)}
            ${generateRolesHTML(processData)}
            ${generateArtifactsHTML(processData)}
            ${generateTailoringDecisionsHTML(processData)}
            ${generateSuccessFactorsHTML(processData)}
        </div>
    `;
    
    return html;
}

function generatePhasesHTML(processData) {
    let html = `
        <div class="process-phases">
            <h3>Project Phases</h3>
    `;
    
    processData.phases.forEach((phase, index) => {
        html += `
            <div class="process-phase">
                <div class="phase-header">
                    <h4>Phase ${index + 1}: ${phase.name}</h4>
                    <span class="phase-duration">Duration: ${phase.duration}</span>
                </div>
                <p class="phase-objective"><strong>Objective:</strong> ${phase.objective}</p>
                
                <div class="phase-activities">
                    <strong>Key Activities:</strong>
                    <ul class="activities-list">
        `;
        
        phase.keyActivities.forEach(activity => {
            html += `
                <li class="activity-item">
                    <div class="activity-header">
                        <strong>${activity.activity}</strong>
                        ${activity.effort ? `<span class="effort-badge">${activity.effort}</span>` : ''}
                        ${activity.frequency ? `<span class="frequency-badge">${activity.frequency}</span>` : ''}
                    </div>
                    <p class="activity-description">${activity.description}</p>
                    <div class="activity-deliverables">
                        <strong>Deliverables:</strong> ${activity.deliverables.join(', ')}
                    </div>
                    <div class="activity-refs">
                        <strong>References:</strong>
                        ${activity.references.map(ref => 
                            `<button class="ref-badge detailed" onclick="openPDF('${ref.standard}', ${ref.page})" title="${ref.note}">
                                ${getStandardName(ref.standard)} p.${ref.page}
                            </button>`
                        ).join('')}
                    </div>
                </li>
            `;
        });
        
        html += `
                    </ul>
                </div>
        `;
        
        if (phase.decisionGate) {
            html += `
                <div class="decision-gate">
                    <h5>${phase.decisionGate.name}</h5>
                    <div class="gate-criteria">
                        <strong>Criteria:</strong>
                        <ul>
                            ${phase.decisionGate.criteria.map(criteria => `<li>${criteria}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="gate-refs">
                        ${phase.decisionGate.references.map(ref => 
                            `<button class="ref-badge" onclick="openPDF('${ref.standard}', ${ref.page})" title="${ref.note}">
                                ${getStandardName(ref.standard)} p.${ref.page}
                            </button>`
                        ).join('')}
                    </div>
                </div>
            `;
        }
        
        html += `
            </div>
        `;
    });
    
    html += `
        </div>
    `;
    
    return html;
}

function generateRolesHTML(processData) {
    let html = `
        <div class="process-roles">
            <h3>Project Roles</h3>
            <div class="roles-grid">
    `;
    
    processData.roles.forEach(role => {
        html += `
            <div class="role-card">
                <h4>${role.role}</h4>
                <p class="role-description">${role.description}</p>
                <div class="role-responsibilities">
                    <strong>Responsibilities:</strong>
                    <ul>
                        ${role.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                    </ul>
                </div>
                <p class="role-commitment"><strong>Time Commitment:</strong> ${role.commitment}</p>
                <div class="role-refs">
                    ${role.references.map(ref => 
                        `<button class="ref-badge small" onclick="openPDF('${ref.standard}', ${ref.page})" title="${ref.note}">
                            ${getStandardName(ref.standard)} p.${ref.page}
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

function generateArtifactsHTML(processData) {
    let html = `
        <div class="process-artifacts">
            <h3>Key Artifacts</h3>
            <div class="artifacts-grid">
    `;
    
    processData.keyArtifacts.forEach(artifact => {
        html += `
            <div class="artifact-card">
                <h4>${artifact.artifact}</h4>
                <p>${artifact.description}</p>
                <p class="artifact-owner"><strong>Owner:</strong> ${artifact.owner}</p>
                <div class="artifact-refs">
                    ${artifact.references.map(ref => 
                        `<button class="ref-badge small" onclick="openPDF('${ref.standard}', ${ref.page})" title="${ref.note}">
                            ${getStandardName(ref.standard)} p.${ref.page}
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

function generateTailoringDecisionsHTML(processData) {
    let html = `
        <div class="tailoring-decisions">
            <h3>Tailoring Decisions</h3>
            <div class="decisions-list">
    `;
    
    processData.tailoringDecisions.forEach(decision => {
        html += `
            <div class="decision-card">
                <h4>${decision.decision}</h4>
                <p><strong>Rationale:</strong> ${decision.rationale}</p>
                <p><strong>Tradeoffs:</strong> ${decision.tradeoffs}</p>
                <div class="decision-refs">
                    ${decision.references.map(ref => 
                        `<button class="ref-badge small" onclick="openPDF('${ref.standard}', ${ref.page})" title="${ref.note}">
                            ${getStandardName(ref.standard)} p.${ref.page}
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

function generateSuccessFactorsHTML(processData) {
    let html = `
        <div class="success-factors">
            <h3>Critical Success Factors</h3>
            <div class="factors-list">
    `;
    
    processData.successFactors.forEach(factor => {
        const importanceClass = factor.importance.toLowerCase().replace(/\s+/g, '-');
        html += `
            <div class="factor-card">
                <div class="factor-header">
                    <h4>${factor.factor}</h4>
                    <span class="importance-badge ${importanceClass}">${factor.importance}</span>
                </div>
                <p><strong>Mitigation:</strong> ${factor.mitigation}</p>
                <div class="factor-refs">
                    ${factor.references.map(ref => 
                        `<button class="ref-badge small" onclick="openPDF('${ref.standard}', ${ref.page})" title="${ref.note}">
                            ${getStandardName(ref.standard)} p.${ref.page}
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

// Process Generator Setup
function setupProcessGenerator() {
    const generateBtn = document.getElementById('generateProcess');
    
    generateBtn.addEventListener('click', () => {
        generateTailoredProcess();
    });
}

function generateTailoredProcess() {
    const projectType = document.getElementById('projectType').value;
    const projectSize = document.getElementById('projectSize').value;
    const maturity = document.getElementById('maturity').value;
    const focusAreas = Array.from(document.querySelectorAll('.checkbox-group input:checked')).map(cb => cb.value);

    const process = buildProcess(projectType, projectSize, maturity, focusAreas);
    
    const outputContainer = document.getElementById('processOutput');
    outputContainer.style.display = 'block';
    outputContainer.innerHTML = process;
    outputContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function displayTailoredProcess() {
    const processData = standardsData.tailoredProcesses?.customSoftwareDevelopment;
    if (!processData) return;
    
    const container = document.getElementById('processOutput');
    container.style.display = 'block';
    
    let html = `
        <div class="tailored-process-container">
            <div class="process-header">
                <h3>🎯 ${processData.title}</h3>
                <div class="process-context">
                    <p><strong>Context:</strong> ${processData.context.description}</p>
                    <div class="context-characteristics">
                        <strong>Characteristics:</strong>
                        <ul>
                            ${processData.context.characteristics.map(char => `<li>${char}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="tailoring-rationale">
                        <strong>Tailoring Rationale:</strong>
                        <p>${processData.context.tailoringRationale}</p>
                    </div>
                </div>
            </div>

            <div class="process-phases">
                <h3>📋 Project Phases</h3>
    `;
    
    // Display each phase
    processData.phases.forEach((phase, index) => {
        html += `
            <div class="process-phase">
                <div class="phase-header">
                    <h4>Phase ${index + 1}: ${phase.name}</h4>
                    <span class="phase-duration">⏱ Duration: ${phase.duration}</span>
                </div>
                <p class="phase-objective"><strong>Objective:</strong> ${phase.objective}</p>
                
                <div class="phase-activities">
                    <strong>Key Activities:</strong>
                    <ul class="activities-list">
        `;
        
        phase.keyActivities.forEach(activity => {
            html += `
                <li class="activity-item">
                    <div class="activity-header">
                        <strong>${activity.activity}</strong>
                        ${activity.effort ? `<span class="effort-badge">⏱ ${activity.effort}</span>` : ''}
                        ${activity.frequency ? `<span class="frequency-badge">🔄 ${activity.frequency}</span>` : ''}
                    </div>
                    <p class="activity-description">${activity.description}</p>
                    <div class="activity-deliverables">
                        <strong>Deliverables:</strong> ${activity.deliverables.join(', ')}
                    </div>
                    <div class="activity-refs">
                        <strong>References:</strong>
                        ${activity.references.map(ref => 
                            `<button class="ref-badge detailed" onclick="openPDF('${ref.standard}', ${ref.page})" title="${ref.note}">
                                📖 ${getStandardName(ref.standard)} p.${ref.page}
                            </button>`
                        ).join('')}
                    </div>
                </li>
            `;
        });
        
        html += `
                    </ul>
                </div>
        `;
        
        // Add decision gate if exists
        if (phase.decisionGate) {
            html += `
                <div class="decision-gate">
                    <h5>🚦 ${phase.decisionGate.name}</h5>
                    <div class="gate-criteria">
                        <strong>Criteria:</strong>
                        <ul>
                            ${phase.decisionGate.criteria.map(criteria => `<li>${criteria}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="gate-refs">
                        ${phase.decisionGate.references.map(ref => 
                            `<button class="ref-badge" onclick="openPDF('${ref.standard}', ${ref.page})" title="${ref.note}">
                                📖 ${getStandardName(ref.standard)} p.${ref.page}
                            </button>`
                        ).join('')}
                    </div>
                </div>
            `;
        }
        
        html += `
            </div>
        `;
    });
    
    html += `
            </div>
            
            <div class="process-roles">
                <h3>👥 Project Roles</h3>
                <div class="roles-grid">
    `;
    
    processData.roles.forEach(role => {
        html += `
            <div class="role-card">
                <h4>${role.role}</h4>
                <p class="role-description">${role.description}</p>
                <div class="role-responsibilities">
                    <strong>Responsibilities:</strong>
                    <ul>
                        ${role.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                    </ul>
                </div>
                <p class="role-commitment"><strong>Time Commitment:</strong> ${role.commitment}</p>
                <div class="role-refs">
                    ${role.references.map(ref => 
                        `<button class="ref-badge small" onclick="openPDF('${ref.standard}', ${ref.page})" title="${ref.note}">
                            📖 ${getStandardName(ref.standard)} p.${ref.page}
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
            
            <div class="process-artifacts">
                <h3>📄 Key Artifacts</h3>
                <div class="artifacts-grid">
    `;
    
    processData.keyArtifacts.forEach(artifact => {
        html += `
            <div class="artifact-card">
                <h4>${artifact.artifact}</h4>
                <p>${artifact.description}</p>
                <p class="artifact-owner"><strong>Owner:</strong> ${artifact.owner}</p>
                <div class="artifact-refs">
                    ${artifact.references.map(ref => 
                        `<button class="ref-badge small" onclick="openPDF('${ref.standard}', ${ref.page})" title="${ref.note}">
                            📖 ${getStandardName(ref.standard)} p.${ref.page}
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
            
            <div class="tailoring-decisions">
                <h3>⚙️ Tailoring Decisions</h3>
                <div class="decisions-list">
    `;
    
    processData.tailoringDecisions.forEach(decision => {
        html += `
            <div class="decision-card">
                <h4>${decision.decision}</h4>
                <p><strong>Rationale:</strong> ${decision.rationale}</p>
                <p><strong>Tradeoffs:</strong> ${decision.tradeoffs}</p>
                <div class="decision-refs">
                    ${decision.references.map(ref => 
                        `<button class="ref-badge small" onclick="openPDF('${ref.standard}', ${ref.page})" title="${ref.note}">
                            📖 ${getStandardName(ref.standard)} p.${ref.page}
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
            
            <div class="success-factors">
                <h3>⭐ Critical Success Factors</h3>
                <div class="factors-list">
    `;
    
    processData.successFactors.forEach(factor => {
        const importanceClass = factor.importance.toLowerCase().replace(/\s+/g, '-');
        html += `
            <div class="factor-card">
                <div class="factor-header">
                    <h4>${factor.factor}</h4>
                    <span class="importance-badge ${importanceClass}">${factor.importance}</span>
                </div>
                <p><strong>Mitigation:</strong> ${factor.mitigation}</p>
                <div class="factor-refs">
                    ${factor.references.map(ref => 
                        `<button class="ref-badge small" onclick="openPDF('${ref.standard}', ${ref.page})" title="${ref.note}">
                            📖 ${getStandardName(ref.standard)} p.${ref.page}
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
            
            <div class="process-footer">
                <button class="btn-primary" onclick="exportTailoredProcess()">📥 Export Process</button>
                <button class="btn-secondary" onclick="printProcess()">🖨️ Print</button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function exportTailoredProcess() {
    alert('Export feature - would generate PDF/Word document of the tailored process');
}

function buildProcess(type, size, maturity, focusAreas) {
    let html = `
        <div class="process-header">
            <h3>🎯 Tailored Process for ${type.charAt(0).toUpperCase() + type.slice(1)} Project</h3>
            <p class="process-meta">Size: ${size} • Maturity: ${maturity} • Focus Areas: ${focusAreas.join(', ')}</p>
        </div>

        <div class="process-phases">
    `;

    const phases = [
        {
            name: 'Initiation',
            activities: getInitiationActivities(type, size, focusAreas),
            deliverables: ['Project Charter', 'Stakeholder Register', 'Initial Risk Assessment']
        },
        {
            name: 'Planning',
            activities: getPlanningActivities(type, size, focusAreas),
            deliverables: ['Project Plan', 'Schedule', 'Budget', 'Risk Management Plan']
        },
        {
            name: 'Execution',
            activities: getExecutionActivities(type, size, focusAreas),
            deliverables: ['Status Reports', 'Deliverables', 'Change Requests']
        },
        {
            name: 'Monitoring & Control',
            activities: getMonitoringActivities(type, size, focusAreas),
            deliverables: ['Performance Reports', 'Updated Plans', 'Issue Log']
        },
        {
            name: 'Closure',
            activities: getClosureActivities(type, size, focusAreas),
            deliverables: ['Final Report', 'Lessons Learned', 'Archive']
        }
    ];

    phases.forEach(phase => {
        html += `
            <div class="process-phase">
                <h4>${phase.name}</h4>
                <div class="phase-content">
                    <div class="activities">
                        <strong>Activities:</strong>
                        <ul>
                            ${phase.activities.map(a => `
                                <li>
                                    ${a.description}
                                    <div class="activity-refs">
                                        ${a.references.map(ref => 
                                            `<button class="ref-badge small" onclick="openPDF('${ref.standard}', ${ref.page})">
                                                ${getStandardName(ref.standard)} p.${ref.page}
                                            </button>`
                                        ).join('')}
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="deliverables">
                        <strong>Key Deliverables:</strong>
                        <ul>
                            ${phase.deliverables.map(d => `<li>${d}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
        </div>
        <div class="process-footer">
            <button class="btn-primary" onclick="exportProcess()">📥 Export Process</button>
            <button class="btn-secondary" onclick="printProcess()">🖨️ Print</button>
        </div>
    `;

    return html;
}

// PDF Modal Functions
function setupPDFModal() {
    const modal = document.getElementById('pdfModal');
    const closeBtn = modal.querySelector('.modal-close');
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    const showBookmarksBtn = document.getElementById('showBookmarksBtn');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageNumberInput = document.getElementById('pageNumberInput');

    closeBtn.addEventListener('click', () => {
        closeModal();
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    bookmarkBtn.addEventListener('click', () => {
        if (!currentStandard) return;
        
        if (isPageBookmarked(currentStandard, currentPage)) {
            removeBookmark(currentStandard, currentPage);
        } else {
            saveBookmark(currentStandard, currentPage);
        }
    });

    showBookmarksBtn.addEventListener('click', () => {
        const sidebar = document.getElementById('bookmarksSidebar');
        sidebar.classList.toggle('active');
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        goToPage(currentPage + 1);
    });

    pageNumberInput.addEventListener('change', (e) => {
        const page = parseInt(e.target.value);
        if (page && page > 0) {
            goToPage(page);
        }
    });

    pageNumberInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const page = parseInt(e.target.value);
            if (page && page > 0) {
                goToPage(page);
            }
        }
    });
}

function closeModal() {
    const modal = document.getElementById('pdfModal');
    modal.style.display = 'none';
    document.getElementById('pdfViewer').src = '';
    const sidebar = document.getElementById('bookmarksSidebar');
    sidebar.classList.remove('active');
    
    if (currentStandard && currentPage) {
        saveLastReadPage(currentStandard, currentPage);
    }
}

function goToPage(page) {
    const viewer = document.getElementById('pdfViewer');
    const currentSrc = viewer.src;
    const baseUrl = currentSrc.split('#')[0];
    
    // Apply page offset to get actual PDF page number
    const offset = PDF_PAGE_OFFSETS[currentStandard] || 0;
    const actualPage = page + offset;
    
    viewer.src = `${baseUrl}#page=${actualPage}`;
    currentPage = page;
    updatePageNumber(page);
    updateBookmarkButton(isPageBookmarked(currentStandard, page));
    saveLastReadPage(currentStandard, page);
}

function updatePageNumber(page) {
    const pageNumberInput = document.getElementById('pageNumberInput');
    if (pageNumberInput) {
        pageNumberInput.value = page;
    }
}

function openPDF(standard, page) {
    const modal = document.getElementById('pdfModal');
    const viewer = document.getElementById('pdfViewer');
    const title = document.getElementById('modalTitle');

    const pdfFile = PDF_FILES[standard];
    if (!pdfFile) {
        alert('PDF file not found for this standard.');
        return;
    }

    // Apply page offset to get actual PDF page number
    const offset = PDF_PAGE_OFFSETS[standard] || 0;
    const actualPage = page + offset;

    // Set current standard and page
    currentStandard = standard;
    currentPage = page;

    // Update UI
    title.textContent = `${getStandardName(standard)}`;
    viewer.src = `${encodeURIComponent(pdfFile)}#page=${actualPage}`;
    updatePageNumber(page);
    updateBookmarkButton(isPageBookmarked(standard, page));
    loadBookmarks(standard);
    
    modal.style.display = 'flex';
    
    // Hide bookmarks sidebar initially
    const sidebar = document.getElementById('bookmarksSidebar');
    sidebar.classList.remove('active');
}

// Helper Functions
function getStandardName(standard) {
    const names = {
        pmbok: 'PMBOK 7',
        prince2: 'PRINCE2',
        iso21500: 'ISO 21500',
        iso21502: 'ISO 21502'
    };
    return names[standard] || standard;
}

function getCoverageLevel(topic, standard) {
    // This would be populated from actual data analysis
    const levels = ['comprehensive', 'moderate', 'basic', 'none'];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    return {
        level: randomLevel,
        description: `${randomLevel.charAt(0).toUpperCase() + randomLevel.slice(1)} coverage of ${topic}`
    };
}

function viewContext(itemId) {
    // Find the item in repository
    const item = standardsData.repository.find(i => i.id === itemId);
    if (!item) return;
    
    // Open PDF at the specific page
    openPDF(item.standard, item.page);
}

function exportProcess() {
    alert('Export feature - would generate PDF/Word document of the process');
}

function printProcess() {
    window.print();
}

// Activity Generation Functions
function getInitiationActivities(type, size, focusAreas) {
    return [
        {
            description: 'Define project objectives and success criteria',
            references: [
                { standard: 'pmbok', page: 25 },
                { standard: 'prince2', page: 45 }
            ]
        },
        {
            description: 'Identify and analyze key stakeholders',
            references: [
                { standard: 'pmbok', page: 73 },
                { standard: 'iso21502', page: 30 }
            ]
        },
        {
            description: 'Develop project charter and obtain authorization',
            references: [
                { standard: 'pmbok', page: 35 },
                { standard: 'iso21500', page: 12 }
            ]
        }
    ];
}

function getPlanningActivities(type, size, focusAreas) {
    const activities = [
        {
            description: 'Create detailed project scope statement',
            references: [
                { standard: 'pmbok', page: 50 },
                { standard: 'prince2', page: 67 }
            ]
        },
        {
            description: 'Develop Work Breakdown Structure (WBS)',
            references: [
                { standard: 'pmbok', page: 55 },
                { standard: 'iso21502', page: 45 }
            ]
        }
    ];

    if (focusAreas.includes('risk')) {
        activities.push({
            description: 'Conduct comprehensive risk identification and analysis',
            references: [
                { standard: 'pmbok', page: 145 },
                { standard: 'prince2', page: 123 },
                { standard: 'iso21502', page: 78 }
            ]
        });
    }

    return activities;
}

function getExecutionActivities(type, size, focusAreas) {
    return [
        {
            description: 'Acquire and develop project team',
            references: [
                { standard: 'pmbok', page: 98 },
                { standard: 'prince2', page: 89 }
            ]
        },
        {
            description: 'Manage stakeholder expectations and engagement',
            references: [
                { standard: 'pmbok', page: 75 },
                { standard: 'iso21502', page: 32 }
            ]
        },
        {
            description: 'Execute planned activities and produce deliverables',
            references: [
                { standard: 'prince2', page: 95 },
                { standard: 'iso21500', page: 28 }
            ]
        }
    ];
}

function getMonitoringActivities(type, size, focusAreas) {
    return [
        {
            description: 'Monitor project performance against baseline',
            references: [
                { standard: 'pmbok', page: 110 },
                { standard: 'iso21502', page: 52 }
            ]
        },
        {
            description: 'Manage changes to project scope, schedule, and budget',
            references: [
                { standard: 'pmbok', page: 118 },
                { standard: 'prince2', page: 145 }
            ]
        },
        {
            description: 'Track and respond to risks and issues',
            references: [
                { standard: 'pmbok', page: 150 },
                { standard: 'prince2', page: 130 }
            ]
        }
    ];
}

function getClosureActivities(type, size, focusAreas) {
    return [
        {
            description: 'Obtain formal acceptance of deliverables',
            references: [
                { standard: 'pmbok', page: 125 },
                { standard: 'prince2', page: 178 }
            ]
        },
        {
            description: 'Document lessons learned and best practices',
            references: [
                { standard: 'pmbok', page: 130 },
                { standard: 'iso21502', page: 88 }
            ]
        },
        {
            description: 'Release resources and close contracts',
            references: [
                { standard: 'prince2', page: 185 },
                { standard: 'iso21500', page: 42 }
            ]
        }
    ];
}

// Load default data structure
function loadDefaultData() {
    standardsData = {
        repository: [
            {
                id: 'pmbok-risk-1',
                standard: 'pmbok',
                title: 'Risk Management Overview',
                content: 'Project risk management includes the processes of conducting risk management planning, identification, analysis, response planning, and response implementation.',
                page: 145,
                keywords: ['risk', 'management', 'planning', 'analysis']
            },
            {
                id: 'prince2-risk-1',
                standard: 'prince2',
                title: 'Risk Theme',
                content: 'The Risk theme provides an approach to managing uncertainty throughout the project lifecycle.',
                page: 123,
                keywords: ['risk', 'uncertainty', 'theme', 'management']
            },
            {
                id: 'iso-risk-1',
                standard: 'iso21502',
                title: 'Risk Management Process',
                content: 'The risk process aims to identify, assess and manage threats and opportunities throughout the project.',
                page: 78,
                keywords: ['risk', 'process', 'threats', 'opportunities']
            }
        ],
        comparisons: {
            risk: {
                pmbok: {
                    title: 'Risk Management',
                    description: 'PMBOK 7 treats risk as both threats and opportunities, integrated across all project activities.',
                    page: 145,
                    keyPoints: [
                        'Individual project risks and overall project risk',
                        'Quantitative and qualitative analysis',
                        'Risk response strategies: escalate, avoid, transfer, mitigate, accept, exploit, share, enhance',
                        'Continuous risk monitoring'
                    ]
                },
                prince2: {
                    title: 'Risk Theme',
                    description: 'PRINCE2 approaches risk management as one of seven themes, with structured procedures.',
                    page: 123,
                    keyPoints: [
                        'Risk management strategy document',
                        'Risk register as key artifact',
                        'Risk budget and risk tolerance',
                        'Defined roles: Project Board, Project Manager, Team Manager'
                    ]
                },
                iso: {
                    standard: 'iso21502',
                    title: 'Risk Process',
                    description: 'ISO 21502 defines risk management as a continuous process throughout project lifecycle.',
                    page: 78,
                    keyPoints: [
                        'Context establishment',
                        'Risk assessment (identification, analysis, evaluation)',
                        'Risk treatment planning',
                        'Risk monitoring and review'
                    ]
                },
                analysis: {
                    similarities: [
                        'All three standards recognize risk as both threats and opportunities',
                        'Continuous monitoring and review emphasized by all',
                        'Risk identification and assessment are foundational steps'
                    ],
                    differences: [
                        'PMBOK provides most detailed quantitative analysis techniques',
                        'PRINCE2 has most structured governance with Risk Theme',
                        'ISO provides most generic framework applicable to any industry'
                    ],
                    recommendations: [
                        'Use PMBOK quantitative techniques for complex projects',
                        'Adopt PRINCE2 governance structure for organizational consistency',
                        'Apply ISO framework for international or multi-standard compliance'
                    ]
                }
            },
            stakeholder: {
                pmbok: {
                    title: 'Stakeholder Performance Domain',
                    description: 'PMBOK 7 emphasizes stakeholder engagement as a continuous activity across the project.',
                    page: 73,
                    keyPoints: [
                        'Stakeholder analysis and mapping',
                        'Engagement assessment matrix',
                        'Communication strategies tailored to stakeholder needs',
                        'Building effective relationships'
                    ]
                },
                prince2: {
                    title: 'Communication Management Approach',
                    description: 'PRINCE2 integrates stakeholder management within its communication framework.',
                    page: 95,
                    keyPoints: [
                        'Defined stakeholder roles (Executive, Senior User, Senior Supplier)',
                        'Communication Management Approach document',
                        'Regular stakeholder reviews',
                        'Product-based stakeholder engagement'
                    ]
                },
                iso: {
                    standard: 'iso21502',
                    title: 'Stakeholder Process',
                    description: 'ISO 21502 defines stakeholder management as identifying and engaging with interested parties.',
                    page: 30,
                    keyPoints: [
                        'Stakeholder identification and classification',
                        'Interest and influence analysis',
                        'Engagement planning',
                        'Managing stakeholder expectations'
                    ]
                },
                analysis: {
                    similarities: [
                        'All emphasize early stakeholder identification',
                        'Continuous engagement throughout project lifecycle',
                        'Analysis of stakeholder power and interest'
                    ],
                    differences: [
                        'PMBOK has most comprehensive engagement strategies',
                        'PRINCE2 has predefined stakeholder roles and responsibilities',
                        'ISO provides highest-level principles applicable across contexts'
                    ],
                    recommendations: [
                        'Use PMBOK engagement assessment matrix for complex stakeholder landscapes',
                        'Adopt PRINCE2 role definitions for governance clarity',
                        'Apply ISO principles for consistency in multi-project environments'
                    ]
                }
            }
        },
        insights: {
            similarities: [
                {
                    topic: 'Project Lifecycle Concept',
                    description: 'All three standards recognize that projects progress through distinct phases, though terminology differs.',
                    references: [
                        { standard: 'pmbok', page: 25 },
                        { standard: 'prince2', page: 12 },
                        { standard: 'iso21500', page: 8 }
                    ]
                },
                {
                    topic: 'Stakeholder Importance',
                    description: 'Universal agreement that stakeholder engagement is critical to project success.',
                    references: [
                        { standard: 'pmbok', page: 73 },
                        { standard: 'prince2', page: 95 },
                        { standard: 'iso21502', page: 30 }
                    ]
                },
                {
                    topic: 'Risk as Opportunity and Threat',
                    description: 'Modern view that risk includes both positive and negative uncertainties.',
                    references: [
                        { standard: 'pmbok', page: 145 },
                        { standard: 'prince2', page: 123 },
                        { standard: 'iso21502', page: 78 }
                    ]
                }
            ],
            differences: [
                {
                    topic: 'Structural Approach',
                    standards: [
                        { standard: 'pmbok', approach: 'Principle-based with 12 principles and 8 performance domains', page: 18 },
                        { standard: 'prince2', approach: 'Process-based with 7 principles, 7 themes, and 7 processes', page: 23 },
                        { standard: 'iso21500', approach: 'Subject groups with 39 processes organized into 5 process groups', page: 15 }
                    ]
                },
                {
                    topic: 'Terminology',
                    standards: [
                        { standard: 'pmbok', approach: 'Uses "Performance Domains" and "Tailoring"', page: 20 },
                        { standard: 'prince2', approach: 'Uses "Themes" and "Principles"', page: 18 },
                        { standard: 'iso21500', approach: 'Uses "Subject Groups" and "Process Groups"', page: 12 }
                    ]
                },
                {
                    topic: 'Governance Emphasis',
                    standards: [
                        { standard: 'pmbok', approach: 'Integrated within performance domains, less prescriptive', page: 35 },
                        { standard: 'prince2', approach: 'Heavy emphasis with defined Project Board and stage gates', page: 45 },
                        { standard: 'iso21502', approach: 'Moderate emphasis within governance process', page: 25 }
                    ]
                }
            ],
            unique: [
                {
                    standard: 'pmbok',
                    topic: 'Value Delivery System',
                    description: 'PMBOK 7 uniquely introduces the concept of portfolios, programs, and projects as an integrated value delivery system.',
                    page: 10
                },
                {
                    standard: 'prince2',
                    topic: 'Product-Based Planning',
                    description: 'PRINCE2\'s unique approach to planning focuses on products (deliverables) rather than activities.',
                    page: 156
                },
                {
                    standard: 'prince2',
                    topic: 'Management by Exception',
                    description: 'Principle that senior management is involved only when tolerances are exceeded.',
                    page: 35
                },
                {
                    standard: 'pmbok',
                    topic: 'Tailoring Guidance',
                    description: 'Extensive guidance on adapting the framework to different project contexts and methodologies.',
                    page: 178
                },
                {
                    standard: 'iso21500',
                    topic: 'International Consensus Standard',
                    description: 'ISO 21500 is unique as an internationally agreed-upon standard developed through ISO consensus process.',
                    page: 5
                },
                {
                    standard: 'pmbok',
                    topic: 'Agile Integration',
                    description: 'PMBOK 7 uniquely integrates agile and adaptive approaches throughout, not as separate methodology.',
                    page: 8
                }
            ]
        }
    };
}
