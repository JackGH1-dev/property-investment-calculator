// InvestQuest Chart Themes
// Professional, accessible, and Australian-focused color palette

const InvestQuestChartThemes = {
    // Default professional theme
    default: {
        colors: {
            // Primary brand colors (inspired by ProjectionLab)
            primary: '#1867C0',      // Deep blue - main brand color
            secondary: '#26A6A2',    // Teal - secondary brand color
            
            // Semantic colors
            success: '#10B981',      // Green - positive values, growth
            warning: '#F59E0B',      // Orange - warnings, attention needed  
            error: '#EF4444',        // Red - negative values, losses
            info: '#3B82F6',         // Blue - informational elements
            
            // Neutral colors
            neutral: '#6B7280',      // Gray - secondary text, borders
            muted: '#9CA3AF',        // Light gray - disabled, muted text
            background: '#FFFFFF',   // White - chart background
            surface: '#F8FAFC',      // Very light gray - card backgrounds
            
            // Chart-specific colors
            grid: '#E5E7EB',         // Light gray - grid lines
            axis: '#374151',         // Dark gray - axis lines and labels
            text: '#111827',         // Nearly black - primary text
            textSecondary: '#6B7280', // Gray - secondary text
            
            // Multi-series chart colors (accessible palette)
            series: [
                '#1867C0', // Primary blue
                '#26A6A2', // Teal
                '#10B981', // Green
                '#F59E0B', // Orange
                '#8B5CF6', // Purple
                '#EF4444', // Red
                '#EC4899', // Pink
                '#06B6D4'  // Cyan
            ],
            
            // Property-specific colors
            equity: '#10B981',       // Green - property equity growth
            cashflow: '#3B82F6',     // Blue - cash flow
            expenses: '#EF4444',     // Red - expenses, negative cash flow
            rental: '#26A6A2',       // Teal - rental income
            appreciation: '#1867C0', // Deep blue - capital appreciation
            
            // Australian market colors
            capital: '#1867C0',      // Blue - capital cities
            regional: '#26A6A2',     // Teal - regional areas
            national: '#10B981'      // Green - national average
        },
        
        typography: {
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: {
                title: '1.25rem',      // 20px - chart titles
                subtitle: '1rem',      // 16px - chart subtitles
                label: '0.875rem',     // 14px - axis labels, legends
                tick: '0.75rem',       // 12px - axis tick labels
                tooltip: '0.875rem',   // 14px - tooltip text
                annotation: '0.75rem'  // 12px - annotations, small text
            },
            fontWeight: {
                title: 600,            // Semi-bold for titles
                label: 500,            // Medium for labels
                text: 400,             // Regular for body text
                emphasis: 600          // Semi-bold for emphasis
            },
            lineHeight: {
                title: 1.2,
                body: 1.4,
                compact: 1.1
            }
        },
        
        spacing: {
            padding: 16,               // Standard padding
            margin: 20,                // Standard margin
            gap: 12,                   // Gap between elements
            strokeWidth: 2,            // Default line width
            pointRadius: 4,            // Default point size
            cornerRadius: 6            // Rounded corners
        },
        
        animation: {
            duration: 800,             // Standard animation duration (ms)
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth easing
            stagger: 100,              // Stagger delay between elements (ms)
            delay: 0                   // Initial delay
        },
        
        opacity: {
            default: 1.0,              // Full opacity
            hover: 0.8,                // Hover state
            inactive: 0.5,             // Inactive/disabled elements
            background: 0.1,           // Background elements
            gridLines: 0.3             // Grid lines
        },
        
        shadows: {
            tooltip: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            elevated: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }
    },

    // Professional theme for business users
    professional: {
        colors: {
            primary: '#0F172A',        // Darker, more conservative
            secondary: '#1E293B',
            success: '#059669',
            warning: '#D97706',
            error: '#DC2626',
            background: '#FFFFFF',
            surface: '#F1F5F9',
            text: '#0F172A',
            grid: '#CBD5E1',
            
            series: [
                '#0F172A', '#1E293B', '#059669', '#D97706',
                '#7C3AED', '#DC2626', '#BE185D', '#0891B2'
            ]
        },
        typography: {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: {
                title: '1.125rem',
                subtitle: '1rem',
                label: '0.875rem',
                tick: '0.75rem'
            }
        },
        spacing: {
            padding: 20,
            margin: 24,
            strokeWidth: 1.5
        },
        animation: {
            duration: 600,
            easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
        }
    },

    // Mobile-optimized theme
    mobile: {
        colors: {
            // Same color palette as default
            primary: '#1867C0',
            secondary: '#26A6A2',
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            background: '#FFFFFF',
            text: '#111827',
            grid: '#E5E7EB'
        },
        typography: {
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: {
                title: '1rem',         // Smaller for mobile
                subtitle: '0.875rem',
                label: '0.75rem',
                tick: '0.625rem',      // Smaller tick labels
                tooltip: '0.75rem'
            },
            fontWeight: {
                title: 600,
                label: 500,
                text: 400
            }
        },
        spacing: {
            padding: 12,               // Reduced padding for mobile
            margin: 16,                // Reduced margins
            gap: 8,                    // Smaller gaps
            strokeWidth: 2.5,          // Thicker lines for touch
            pointRadius: 6,            // Larger touch targets
            cornerRadius: 4
        },
        animation: {
            duration: 600,             // Faster animations on mobile
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            stagger: 75
        },
        opacity: {
            default: 1.0,
            hover: 0.7,                // More pronounced hover on mobile
            inactive: 0.4,
            gridLines: 0.2             // Lighter grid lines
        }
    },

    // High contrast theme for accessibility
    highContrast: {
        colors: {
            primary: '#000000',
            secondary: '#333333',
            success: '#006600',
            warning: '#FF6600',
            error: '#CC0000',
            background: '#FFFFFF',
            text: '#000000',
            grid: '#666666',
            
            series: [
                '#000000', '#333333', '#006600', '#FF6600',
                '#663399', '#CC0000', '#990066', '#006699'
            ]
        },
        typography: {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: {
                title: '1.25rem',
                subtitle: '1rem',
                label: '0.875rem',
                tick: '0.875rem'       // Larger for readability
            },
            fontWeight: {
                title: 700,            // Bolder for contrast
                label: 600,
                text: 500
            }
        },
        spacing: {
            strokeWidth: 3,            // Thicker lines for visibility
            pointRadius: 6
        },
        opacity: {
            gridLines: 0.5             // More visible grid lines
        }
    },

    // Dark mode theme
    dark: {
        colors: {
            primary: '#60A5FA',        // Lighter blue for dark backgrounds
            secondary: '#34D399',      // Light teal
            success: '#10B981',
            warning: '#FBBF24',
            error: '#F87171',
            background: '#1F2937',     // Dark gray background
            surface: '#374151',        // Darker surface
            text: '#F9FAFB',          // Light text
            textSecondary: '#D1D5DB',
            grid: '#4B5563',          // Medium gray grid
            axis: '#9CA3AF',
            
            series: [
                '#60A5FA', '#34D399', '#10B981', '#FBBF24',
                '#A78BFA', '#F87171', '#FB7185', '#22D3EE'
            ]
        },
        typography: {
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: {
                title: '1.25rem',
                subtitle: '1rem',
                label: '0.875rem',
                tick: '0.75rem'
            }
        },
        shadows: {
            tooltip: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
            card: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)'
        }
    },

    // Print-friendly theme
    print: {
        colors: {
            primary: '#000000',
            secondary: '#333333',
            success: '#666666',
            warning: '#666666',
            error: '#000000',
            background: '#FFFFFF',
            text: '#000000',
            grid: '#CCCCCC',
            
            // Grayscale series for print
            series: [
                '#000000', '#333333', '#666666', '#999999',
                '#AAAAAA', '#777777', '#555555', '#222222'
            ]
        },
        typography: {
            fontFamily: 'serif',
            fontSize: {
                title: '1.125rem',
                label: '0.875rem',
                tick: '0.75rem'
            }
        },
        spacing: {
            strokeWidth: 1.5
        },
        animation: {
            duration: 0               // No animations for print
        }
    }
};

// Utility functions for theme management
const ChartThemeUtils = {
    // Get color from theme with fallback
    getColor(theme, colorPath, fallback = '#000000') {
        const keys = colorPath.split('.');
        let value = theme;
        
        for (const key of keys) {
            value = value?.[key];
            if (value === undefined) break;
        }
        
        return value || fallback;
    },

    // Generate accessible color pairs
    getAccessiblePair(theme, backgroundKey = 'colors.background') {
        const background = this.getColor(theme, backgroundKey);
        const isLightBackground = this.isLightColor(background);
        
        return {
            background,
            text: isLightBackground ? theme.colors.text : theme.colors.background,
            contrast: isLightBackground ? 'light' : 'dark'
        };
    },

    // Check if color is light or dark
    isLightColor(hexColor) {
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Calculate relative luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5;
    },

    // Merge themes (for customization)
    mergeThemes(baseTheme, customizations) {
        return this.deepMerge({}, baseTheme, customizations);
    },

    // Deep merge utility
    deepMerge(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return this.deepMerge(target, ...sources);
    },

    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    },

    // Get theme based on system preferences
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const theme = { ...InvestQuestChartThemes.default };
            theme.animation.duration = 0;
            return theme;
        }
        return 'default';
    },

    // Get mobile theme based on screen size
    getMobileTheme() {
        return window.innerWidth <= 768 ? 'mobile' : 'default';
    }
};

// Export themes and utilities
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InvestQuestChartThemes, ChartThemeUtils };
} else {
    window.InvestQuestChartThemes = InvestQuestChartThemes;
    window.ChartThemeUtils = ChartThemeUtils;
}