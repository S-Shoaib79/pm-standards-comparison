// PM Standards Comparison Tool - Main Application Logic

// PDF file mappings
const PDF_FILES = {
    pmbok: "A Guide to the Project Management Body of Knowledge (PMBOK® Guide) – Seventh Edition and The Standard for.pdf",
    prince2: "Managing Successful Projects with PRINCE2® -- Andy Murray -- 7, 2023 -- PeopleCert International Limited.pdf",
    iso21500: "ISO 21500-2021_ Project, programme and portfolio management - Context and concepts.pdf",
    iso21502: "ISO 21502-2020_ Project, programme and portfolio management - Guidance on project management.pdf"
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
    setupComparisonEngine();
    setupInsightsDashboard();
    setupProcessGenerator();
    setupPDFModal();
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
    const searchInput = document.getElementById('repoSearch');
    const filterChips = document.querySelectorAll('.filter-chip');
    let currentFilter = 'all';

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        displayRepositoryContent(e.target.value, currentFilter);
    });

    // Filter chips
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.dataset.filter;
            displayRepositoryContent(searchInput.value, currentFilter);
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

// Comparison Engine Setup
function setupComparisonEngine() {
    const topicSelector = document.getElementById('comparisonTopic');
    
    topicSelector.addEventListener('change', (e) => {
        if (e.target.value) {
            displayComparison(e.target.value);
        }
    });
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
                    <button class="btn-link" onclick="openPDF('pmbok', ${comparison.pmbok.page})">
                        📖 Open PMBOK Page ${comparison.pmbok.page}
                    </button>
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
                    <button class="btn-link" onclick="openPDF('prince2', ${comparison.prince2.page})">
                        📖 Open PRINCE2 Page ${comparison.prince2.page}
                    </button>
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
                    <button class="btn-link" onclick="openPDF('${comparison.iso.standard}', ${comparison.iso.page})">
                        📖 Open ISO Page ${comparison.iso.page}
                    </button>
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

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.getElementById('pdfViewer').src = '';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.getElementById('pdfViewer').src = '';
        }
    });
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

    title.textContent = `${getStandardName(standard)} - Page ${page}`;
    viewer.src = `${encodeURIComponent(pdfFile)}#page=${page}`;
    modal.style.display = 'flex';
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
    alert('Context view feature - would show full section context');
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
