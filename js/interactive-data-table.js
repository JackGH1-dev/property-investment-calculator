/**
 * Interactive Data Table System - Phase 2 Implementation
 * ProjectionLab-Style Advanced Data Display
 */

class InteractiveDataTable {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.options = {
            sortable: true,
            filterable: true,
            exportable: true,
            pagination: true,
            pageSize: 10,
            responsive: true,
            selectable: false,
            theme: 'projectionlab',
            ...options
        };
        
        this.data = [];
        this.columns = [];
        this.currentPage = 1;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.filters = {};
        this.selectedRows = new Set();
        
        this.perfMonitor = window.performanceMonitor || null;
        this.init();
    }

    /**
     * Initialize the data table
     */
    init() {
        if (!this.container) {
            console.error(`Container with id "${this.containerId}" not found`);
            return;
        }

        this.setupContainer();
        this.render();
        this.attachEventListeners();
        
        if (this.perfMonitor) {
            this.perfMonitor.trackEvent('data_table_initialized', {
                containerId: this.containerId,
                features: Object.keys(this.options).filter(key => this.options[key])
            });
        }
    }

    /**
     * Setup the table container structure
     */
    setupContainer() {
        this.container.className = `interactive-table ${this.options.theme}`;
        this.container.innerHTML = `
            <div class="table-header">
                <div class="table-title"></div>
                <div class="table-controls">
                    ${this.options.filterable ? '<input type="text" class="table-search" placeholder="Search...">' : ''}
                    ${this.options.exportable ? '<button class="export-btn">📊 Export</button>' : ''}
                </div>
            </div>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead></thead>
                    <tbody></tbody>
                </table>
            </div>
            ${this.options.pagination ? '<div class="table-pagination"></div>' : ''}
        `;
    }

    /**
     * Set table data and columns
     */
    setData(data, columns) {
        this.data = data;
        this.columns = columns;
        this.render();
        
        if (this.perfMonitor) {
            this.perfMonitor.trackEvent('table_data_updated', {
                rows: data.length,
                columns: columns.length
            });
        }
    }

    /**
     * Render the complete table
     */
    render() {
        this.renderHeader();
        this.renderBody();
        this.renderPagination();
        this.updateRowNumbers();
    }

    /**
     * Render table header
     */
    renderHeader() {
        const thead = this.container.querySelector('thead');
        if (!thead || !this.columns.length) return;

        const headerRow = document.createElement('tr');
        
        this.columns.forEach(column => {
            const th = document.createElement('th');
            th.className = 'sortable';
            th.innerHTML = `
                <div class="header-content">
                    <span class="column-title">${column.title}</span>
                    ${this.options.sortable ? '<span class="sort-icon">⇅</span>' : ''}
                </div>
            `;
            
            if (this.options.sortable) {
                th.addEventListener('click', () => this.handleSort(column.key));
            }
            
            // Add sort indicators
            if (this.sortColumn === column.key) {
                th.classList.add('sorted');
                const sortIcon = th.querySelector('.sort-icon');
                sortIcon.textContent = this.sortDirection === 'asc' ? '↑' : '↓';
                sortIcon.classList.add('active');
            }
            
            headerRow.appendChild(th);
        });
        
        thead.innerHTML = '';
        thead.appendChild(headerRow);
    }

    /**
     * Render table body
     */
    renderBody() {
        const tbody = this.container.querySelector('tbody');
        if (!tbody) return;

        const processedData = this.getProcessedData();
        const paginatedData = this.options.pagination ? 
            this.getPaginatedData(processedData) : processedData;

        tbody.innerHTML = '';
        
        paginatedData.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.className = 'data-row';
            tr.dataset.rowIndex = index;
            
            // Add selection support
            if (this.options.selectable) {
                tr.addEventListener('click', () => this.handleRowSelection(tr, row));
            }
            
            this.columns.forEach(column => {
                const td = document.createElement('td');
                td.className = `cell-${column.key}`;
                
                // Format cell content based on column type
                const cellContent = this.formatCellContent(row[column.key], column);
                td.innerHTML = cellContent;
                
                // Add cell-specific classes
                if (column.className) {
                    td.classList.add(column.className);
                }
                
                tr.appendChild(td);
            });
            
            tbody.appendChild(tr);
        });

        // Add empty state if no data
        if (paginatedData.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.className = 'empty-row';
            emptyRow.innerHTML = `
                <td colspan="${this.columns.length}" class="empty-cell">
                    <div class="empty-state">
                        <span class="empty-icon">📊</span>
                        <span class="empty-text">No data available</span>
                    </div>
                </td>
            `;
            tbody.appendChild(emptyRow);
        }
    }

    /**
     * Format cell content based on column configuration
     */
    formatCellContent(value, column) {
        if (value === null || value === undefined) {
            return '<span class="null-value">—</span>';
        }

        switch (column.type) {
            case 'currency':
                return `<span class="currency-value">$${Number(value).toLocaleString()}</span>`;
            
            case 'percentage':
                return `<span class="percentage-value">${Number(value).toFixed(1)}%</span>`;
            
            case 'number':
                return `<span class="number-value">${Number(value).toLocaleString()}</span>`;
            
            case 'date':
                const date = new Date(value);
                return `<span class="date-value">${date.toLocaleDateString()}</span>`;
            
            case 'status':
                const statusClass = value.toLowerCase().replace(/\s+/g, '-');
                return `<span class="status-badge status-${statusClass}">${value}</span>`;
            
            case 'progress':
                const percentage = Math.min(100, Math.max(0, value));
                return `
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                        <span class="progress-text">${percentage}%</span>
                    </div>
                `;
            
            case 'change':
                const changeClass = value >= 0 ? 'positive' : 'negative';
                const changeIcon = value >= 0 ? '↗' : '↘';
                return `<span class="change-value ${changeClass}">${changeIcon} ${Math.abs(value)}%</span>`;
            
            default:
                if (column.render && typeof column.render === 'function') {
                    return column.render(value);
                }
                return String(value);
        }
    }

    /**
     * Handle column sorting
     */
    handleSort(columnKey) {
        if (this.sortColumn === columnKey) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = columnKey;
            this.sortDirection = 'asc';
        }
        
        this.currentPage = 1; // Reset to first page
        this.render();
        
        if (this.perfMonitor) {
            this.perfMonitor.trackEvent('table_sorted', {
                column: columnKey,
                direction: this.sortDirection
            });
        }
    }

    /**
     * Handle row selection
     */
    handleRowSelection(row, data) {
        const rowIndex = row.dataset.rowIndex;
        
        if (this.selectedRows.has(rowIndex)) {
            this.selectedRows.delete(rowIndex);
            row.classList.remove('selected');
        } else {
            this.selectedRows.add(rowIndex);
            row.classList.add('selected');
        }
        
        // Emit selection event
        this.container.dispatchEvent(new CustomEvent('rowSelectionChanged', {
            detail: {
                selectedRows: Array.from(this.selectedRows),
                selectedData: this.getSelectedData()
            }
        }));
    }

    /**
     * Get processed data (sorted and filtered)
     */
    getProcessedData() {
        let processedData = [...this.data];

        // Apply filters
        if (this.options.filterable && Object.keys(this.filters).length > 0) {
            processedData = processedData.filter(row => {
                return Object.entries(this.filters).every(([key, value]) => {
                    if (!value) return true;
                    const cellValue = String(row[key]).toLowerCase();
                    return cellValue.includes(value.toLowerCase());
                });
            });
        }

        // Apply sorting
        if (this.sortColumn) {
            processedData.sort((a, b) => {
                let aVal = a[this.sortColumn];
                let bVal = b[this.sortColumn];
                
                // Handle null/undefined values
                if (aVal === null || aVal === undefined) aVal = '';
                if (bVal === null || bVal === undefined) bVal = '';
                
                // Convert to comparable format
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }
                
                if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return processedData;
    }

    /**
     * Get paginated data
     */
    getPaginatedData(data) {
        if (!this.options.pagination) return data;
        
        const startIndex = (this.currentPage - 1) * this.options.pageSize;
        const endIndex = startIndex + this.options.pageSize;
        
        return data.slice(startIndex, endIndex);
    }

    /**
     * Render pagination controls
     */
    renderPagination() {
        if (!this.options.pagination) return;

        const paginationContainer = this.container.querySelector('.table-pagination');
        const processedData = this.getProcessedData();
        const totalPages = Math.ceil(processedData.length / this.options.pageSize);
        
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'flex';
        paginationContainer.innerHTML = `
            <div class="pagination-info">
                Showing ${((this.currentPage - 1) * this.options.pageSize) + 1}-${Math.min(this.currentPage * this.options.pageSize, processedData.length)} of ${processedData.length}
            </div>
            <div class="pagination-controls">
                <button class="page-btn prev-btn" ${this.currentPage === 1 ? 'disabled' : ''}>‹ Previous</button>
                ${this.generatePageButtons(totalPages)}
                <button class="page-btn next-btn" ${this.currentPage === totalPages ? 'disabled' : ''}>Next ›</button>
            </div>
        `;
    }

    /**
     * Generate pagination buttons
     */
    generatePageButtons(totalPages) {
        let buttons = '';
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            buttons += `
                <button class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }
        
        return buttons;
    }

    /**
     * Update row numbers for accessibility
     */
    updateRowNumbers() {
        const rows = this.container.querySelectorAll('tbody tr:not(.empty-row)');
        rows.forEach((row, index) => {
            row.setAttribute('aria-rowindex', index + 2); // +2 for header row
        });
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Search functionality
        const searchInput = this.container.querySelector('.table-search');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
        }

        // Export functionality
        const exportBtn = this.container.querySelector('.export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        // Pagination controls
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('page-btn')) {
                e.preventDefault();
                
                if (e.target.classList.contains('prev-btn')) {
                    this.goToPage(this.currentPage - 1);
                } else if (e.target.classList.contains('next-btn')) {
                    this.goToPage(this.currentPage + 1);
                } else if (e.target.dataset.page) {
                    this.goToPage(parseInt(e.target.dataset.page));
                }
            }
        });
    }

    /**
     * Handle search functionality
     */
    handleSearch(query) {
        this.filters = {};
        
        if (query) {
            // Global search across all columns
            this.filters._global = query;
        }
        
        this.currentPage = 1;
        this.render();
        
        if (this.perfMonitor) {
            this.perfMonitor.trackEvent('table_searched', { query: query.length });
        }
    }

    /**
     * Go to specific page
     */
    goToPage(page) {
        const processedData = this.getProcessedData();
        const totalPages = Math.ceil(processedData.length / this.options.pageSize);
        
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderBody();
        this.renderPagination();
    }

    /**
     * Export data functionality
     */
    exportData() {
        const processedData = this.getProcessedData();
        const csv = this.convertToCSV(processedData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.containerId}-export.csv`;
        link.click();
        
        window.URL.revokeObjectURL(url);
        
        if (this.perfMonitor) {
            this.perfMonitor.trackEvent('table_exported', {
                rows: processedData.length,
                format: 'csv'
            });
        }
    }

    /**
     * Convert data to CSV format
     */
    convertToCSV(data) {
        if (!data.length) return '';
        
        const headers = this.columns.map(col => col.title).join(',');
        const rows = data.map(row => 
            this.columns.map(col => {
                let value = row[col.key];
                if (value === null || value === undefined) value = '';
                // Escape commas and quotes
                if (typeof value === 'string') {
                    value = '"' + value.replace(/"/g, '""') + '"';
                }
                return value;
            }).join(',')
        );
        
        return [headers, ...rows].join('\n');
    }

    /**
     * Get selected data
     */
    getSelectedData() {
        const processedData = this.getProcessedData();
        return Array.from(this.selectedRows).map(index => 
            processedData[parseInt(index)]
        ).filter(Boolean);
    }

    /**
     * Refresh table data
     */
    refresh() {
        this.render();
    }

    /**
     * Destroy table and cleanup
     */
    destroy() {
        this.container.innerHTML = '';
        this.container.className = '';
    }
}

// CSS for the interactive table (will be injected)
const tableCSS = `
.interactive-table {
    font-family: 'Inter', sans-serif;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-light, #e5e7eb);
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: var(--surface-secondary, #f9fafb);
    border-bottom: 1px solid var(--border-light, #e5e7eb);
}

.table-controls {
    display: flex;
    gap: 12px;
    align-items: center;
}

.table-search {
    padding: 8px 12px;
    border: 1px solid var(--border-light, #e5e7eb);
    border-radius: 6px;
    font-size: 14px;
    min-width: 200px;
}

.export-btn {
    padding: 8px 16px;
    background: var(--primary-500, #3b82f6);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.export-btn:hover {
    background: var(--primary-600, #2563eb);
}

.table-wrapper {
    overflow-x: auto;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table th {
    background: var(--surface-secondary, #f9fafb);
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    border-bottom: 1px solid var(--border-light, #e5e7eb);
    cursor: pointer;
    user-select: none;
}

.data-table th:hover {
    background: var(--hover-overlay, rgba(59, 130, 246, 0.05));
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sort-icon {
    opacity: 0.5;
    font-size: 12px;
}

.sort-icon.active {
    opacity: 1;
    color: var(--primary-500, #3b82f6);
}

.data-table td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-light, #e5e7eb);
}

.data-row:hover {
    background: var(--hover-overlay, rgba(59, 130, 246, 0.05));
}

.data-row.selected {
    background: rgba(59, 130, 246, 0.1);
}

.currency-value {
    color: var(--text-primary, #111827);
    font-weight: 500;
}

.percentage-value {
    color: var(--text-secondary, #6b7280);
}

.status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}

.change-value.positive {
    color: var(--success-500, #10b981);
}

.change-value.negative {
    color: var(--error-500, #ef4444);
}

.progress-bar {
    width: 100px;
    height: 20px;
    background: var(--surface-secondary, #f9fafb);
    border-radius: 10px;
    position: relative;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--primary-500, #3b82f6);
    border-radius: 10px;
    transition: width 0.3s ease;
}

.progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 11px;
    font-weight: 500;
    color: var(--text-primary, #111827);
}

.table-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: var(--surface-secondary, #f9fafb);
    border-top: 1px solid var(--border-light, #e5e7eb);
}

.pagination-controls {
    display: flex;
    gap: 8px;
}

.page-btn {
    padding: 6px 12px;
    border: 1px solid var(--border-light, #e5e7eb);
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
    background: var(--hover-overlay, rgba(59, 130, 246, 0.05));
}

.page-btn.active {
    background: var(--primary-500, #3b82f6);
    color: white;
    border-color: var(--primary-500, #3b82f6);
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary, #6b7280);
}

.empty-icon {
    font-size: 24px;
    display: block;
    margin-bottom: 8px;
}

@media (max-width: 768px) {
    .table-header {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
    }
    
    .table-search {
        min-width: auto;
    }
    
    .table-pagination {
        flex-direction: column;
        gap: 12px;
        text-align: center;
    }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = tableCSS;
document.head.appendChild(style);

// Export for global use
window.InteractiveDataTable = InteractiveDataTable;

console.log('🎯 Interactive Data Table System loaded - ProjectionLab Style');