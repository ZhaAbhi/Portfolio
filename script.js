// VS Code Portfolio Interactive Features

class VSCodePortfolio {
    constructor() {
        this.currentTheme = 'dark';
        this.openTabs = new Set(['about']);
        this.activeTab = 'about';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupThemeToggle();
        this.setupCommandPalette();
        this.setupContactForm();
        this.setupKeyboardShortcuts();
        this.typewriterEffect();
    }

    setupEventListeners() {
        // File explorer interactions
        document.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = e.currentTarget.getAttribute('onclick').match(/'([^']+)'/g);
                if (tab && tab.length >= 2) {
                    const tabId = tab[0].replace(/'/g, '');
                    const fileName = tab[1].replace(/'/g, '');
                    this.openTab(tabId, fileName);
                }
            });
        });

        // Tab close functionality
        document.querySelectorAll('.tab-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tabId = e.target.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.closeTab(tabId);
            });
        });

        // Mobile sidebar toggle
        this.setupMobileSidebar();
    }

    setupMobileSidebar() {
        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.sidebar');
            const content = document.querySelector('.content-area');
            
            content.addEventListener('click', () => {
                sidebar.classList.remove('show');
            });
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        
        themeToggle.addEventListener('click', () => {
            if (this.currentTheme === 'dark') {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                this.currentTheme = 'light';
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                this.currentTheme = 'dark';
            }
            
            // Save theme preference
            localStorage.setItem('vscode-theme', this.currentTheme);
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('vscode-theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            if (savedTheme === 'light') {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        }
    }

    setupCommandPalette() {
        const commandPalette = document.getElementById('commandPalette');
        const commandInput = document.getElementById('commandInput');
        const commandResults = document.getElementById('commandResults');
        
        // Open command palette
        window.openCommandPalette = () => {
            commandPalette.classList.add('show');
            commandInput.focus();
        };

        // Close command palette
        const closeCommandPalette = () => {
            commandPalette.classList.remove('show');
            commandInput.value = '';
        };

        // Filter commands
        commandInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const items = commandResults.querySelectorAll('.command-item');
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        // Handle escape key
        commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeCommandPalette();
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!commandPalette.contains(e.target) && !e.target.closest('.command-palette-trigger')) {
                closeCommandPalette();
            }
        });
    }

    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmission(new FormData(contactForm));
            });
        }
    }

    handleContactSubmission(formData) {
        const button = document.querySelector('.terminal-button');
        const originalText = button.innerHTML;
        
        // Show loading state
        button.classList.add('loading');
        button.innerHTML = '<span class="prompt">$</span> <span class="command">sending</span> <span class="flag">--please-wait</span>';
        
        // Simulate API call
        setTimeout(() => {
            button.classList.remove('loading');
            button.innerHTML = '<span class="prompt">$</span> <span class="command">sent</span> <span class="flag">--success</span>';
            button.style.borderColor = '#6a9955';
            
            // Create success message
            this.showTerminalMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            document.getElementById('contactForm').reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.borderColor = '';
            }, 3000);
        }, 2000);
    }

    showTerminalMessage(message, type = 'info') {
        const terminalContent = document.querySelector('.terminal-content');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'terminal-line';
        
        const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
        const color = type === 'success' ? '#6a9955' : type === 'error' ? '#f44747' : '#007acc';
        
        messageDiv.innerHTML = `
            <span class="prompt" style="color: ${color}">$</span>
            <span style="color: ${color}">${icon} ${message}</span>
        `;
        
        terminalContent.appendChild(messageDiv);
        messageDiv.scrollIntoView({ behavior: 'smooth' });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + P for command palette
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                openCommandPalette();
            }
            
            // Ctrl/Cmd + Shift + P for command palette
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                openCommandPalette();
            }
            
            // Ctrl/Cmd + W to close tab
            if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
                e.preventDefault();
                this.closeActiveTab();
            }
            
            // Ctrl/Cmd + T for theme toggle
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                document.getElementById('themeToggle').click();
            }
        });
    }

    openTab(tabId, fileName) {
        // Update file explorer active state
        document.querySelectorAll('.file-item').forEach(item => {
            item.classList.remove('active');
        });
        event.currentTarget.classList.add('active');

        // Add to open tabs if not already open
        this.openTabs.add(tabId);
        this.activeTab = tabId;

        // Create or update tab
        this.updateTabBar();
        
        // Show content
        this.showTabContent(tabId);
        
        // Add fade-in animation
        const content = document.getElementById(`${tabId}-content`);
        if (content) {
            content.classList.add('fade-in');
            setTimeout(() => content.classList.remove('fade-in'), 300);
        }
    }

    closeTab(tabId) {
        if (this.openTabs.size <= 1) return; // Keep at least one tab open
        
        this.openTabs.delete(tabId);
        
        // If closing active tab, switch to another tab
        if (this.activeTab === tabId) {
            this.activeTab = Array.from(this.openTabs)[0];
        }
        
        this.updateTabBar();
        this.showTabContent(this.activeTab);
    }

    closeActiveTab() {
        this.closeTab(this.activeTab);
    }

    updateTabBar() {
        const tabBar = document.querySelector('.tab-bar');
        const tabConfig = {
            'about': { icon: 'fab fa-markdown', name: 'README.md' },
            'skills': { icon: 'fas fa-code', name: 'skills.json' },
            'projects': { icon: 'fab fa-js-square', name: 'projects.ts' },
            'experience': { icon: 'fab fa-python', name: 'experience.py' },
            'contact': { icon: 'fab fa-html5', name: 'contact.html' }
        };

        tabBar.innerHTML = '';
        
        Array.from(this.openTabs).forEach(tabId => {
            const config = tabConfig[tabId];
            const tab = document.createElement('div');
            tab.className = `tab ${tabId === this.activeTab ? 'active' : ''}`;
            tab.dataset.tab = tabId;
            tab.innerHTML = `
                <i class="${config.icon}"></i>
                <span>${config.name}</span>
                <button class="tab-close" onclick="portfolio.closeTab('${tabId}')">×</button>
            `;
            
            tab.addEventListener('click', (e) => {
                if (!e.target.classList.contains('tab-close')) {
                    this.switchToTab(tabId);
                }
            });
            
            tabBar.appendChild(tab);
        });
    }

    switchToTab(tabId) {
        this.activeTab = tabId;
        this.updateTabBar();
        this.showTabContent(tabId);
    }

    showTabContent(tabId) {
        // Hide all content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Show active content
        const activeContent = document.getElementById(`${tabId}-content`);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }

    typewriterEffect() {
        const terminalLines = document.querySelectorAll('.terminal-line');
        
        terminalLines.forEach((line, index) => {
            line.style.opacity = '0';
            setTimeout(() => {
                line.style.opacity = '1';
                line.classList.add('slide-in');
            }, index * 100);
        });
    }
}

// Folder toggle functionality
function toggleFolder(folderId) {
    const folderHeader = event.currentTarget;
    const folderContent = document.getElementById(`${folderId}-folder`);
    const folderIcon = folderHeader.querySelector('.folder-icon');
    
    if (folderContent.style.display === 'none') {
        folderContent.style.display = 'block';
        folderHeader.classList.remove('collapsed');
        folderIcon.style.transform = 'rotate(0deg)';
    } else {
        folderContent.style.display = 'none';
        folderHeader.classList.add('collapsed');
        folderIcon.style.transform = 'rotate(-90deg)';
    }
}

// Global functions for onclick handlers
function openTab(tabId, fileName) {
    portfolio.openTab(tabId, fileName);
}

function closeTab(tabId) {
    portfolio.closeTab(tabId);
}

function openCommandPalette() {
    const commandPalette = document.getElementById('commandPalette');
    const commandInput = document.getElementById('commandInput');
    commandPalette.classList.add('show');
    commandInput.focus();
}

// Initialize portfolio when DOM is loaded
let portfolio;
document.addEventListener('DOMContentLoaded', () => {
    portfolio = new VSCodePortfolio();
    
    // Add some dynamic status bar updates
    updateStatusBar();
    setInterval(updateStatusBar, 30000); // Update every 30 seconds
});

function updateStatusBar() {
    const statusItems = document.querySelectorAll('.status-item');
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Update the time-based status (if you want to add a clock)
    // statusItems[statusItems.length - 1].textContent = timeString;
}

// Handle responsive behavior
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.querySelector('.sidebar').classList.remove('show');
    }
});

// Add smooth scrolling for internal links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add loading states for external links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="http"]')) {
        const link = e.target;
        link.classList.add('loading');
        setTimeout(() => {
            link.classList.remove('loading');
        }, 1000);
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`VS Code Portfolio loaded in ${loadTime.toFixed(2)}ms`);
    });
}

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Portfolio error:', e.error);
    // Could send error reports to analytics service
});

// Analytics (placeholder for actual implementation)
function trackEvent(action, category = 'Portfolio', label = '') {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    console.log(`Analytics: ${category} - ${action} - ${label}`);
}

// Track user interactions
document.addEventListener('click', (e) => {
    if (e.target.matches('.file-item')) {
        trackEvent('file_opened', 'Navigation', e.target.textContent.trim());
    }
    
    if (e.target.matches('.social-link')) {
        trackEvent('social_click', 'Contact', e.target.textContent.trim());
    }
    
    if (e.target.matches('.theme-toggle')) {
        trackEvent('theme_toggle', 'UI', portfolio.currentTheme);
    }
});

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // Focus management for modals
    if (e.key === 'Tab') {
        const commandPalette = document.getElementById('commandPalette');
        if (commandPalette.classList.contains('show')) {
            const focusableElements = commandPalette.querySelectorAll('input, .command-item');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
});

// Add focus indicators for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-focus');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-focus');
});

// Easter eggs and fun interactions
let konami = [];
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konami.push(e.keyCode);
    konami = konami.slice(-konamiCode.length);
    
    if (konami.join(',') === konamiCode.join(',')) {
        // Easter egg: Matrix effect
        createMatrixEffect();
        trackEvent('konami_code', 'Easter Egg');
    }
});

function createMatrixEffect() {
    const matrix = document.createElement('div');
    matrix.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 9999;
        pointer-events: none;
        font-family: monospace;
        overflow: hidden;
    `;
    
    document.body.appendChild(matrix);
    
    // Create falling characters
    for (let i = 0; i < 100; i++) {
        const char = document.createElement('div');
        char.textContent = String.fromCharCode(Math.random() * 128);
        char.style.cssText = `
            position: absolute;
            top: -20px;
            left: ${Math.random() * 100}%;
            color: #00ff00;
            font-size: 14px;
            animation: fall ${Math.random() * 3 + 2}s linear infinite;
        `;
        matrix.appendChild(char);
    }
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Remove after 5 seconds
    setTimeout(() => {
        matrix.remove();
        style.remove();
    }, 5000);
}

// Console greeting for curious developers
console.log(`
%c
██╗   ██╗███████╗     ██████╗ ██████╗ ██████╗ ███████╗
██║   ██║██╔════╝    ██╔════╝██╔═══██╗██╔══██╗██╔════╝
██║   ██║███████╗    ██║     ██║   ██║██║  ██║█████╗  
╚██╗ ██╔╝╚════██║    ██║     ██║   ██║██║  ██║██╔══╝  
 ╚████╔╝ ███████║    ╚██████╗╚██████╔╝██████╔╝███████╗
  ╚═══╝  ╚══════╝     ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
                                                      
%c🎉 Welcome to Abhishek's VS Code Portfolio! 🎉

%cHey there, fellow developer! 👋

Thanks for checking out the source code. This portfolio is built with:
• Vanilla HTML, CSS, and JavaScript
• VS Code-inspired design system
• Responsive design principles
• Accessibility best practices
• Performance optimizations

Feel free to explore the code and let me know what you think!

%c📧 Contact: jhabhishek.developer@gmail.com
🔗 LinkedIn: https://www.linkedin.com/in/abhishekjha2023/
🐙 GitHub: https://github.com/ZhaAbhi

%cTip: Try the Konami code for a surprise! ↑↑↓↓←→←→BA
`, 
'color: #007acc; font-weight: bold;',
'color: #6a9955; font-size: 16px; font-weight: bold;',
'color: #d4d4d4; font-size: 14px;',
'color: #ce9178; font-size: 12px;',
'color: #c586c0; font-size: 10px; font-style: italic;'
);