// ~/frappe-bench/apps/safari_layout/safari_layout/public/js/role_navigation.js
// Safari Role-Based Navigation Controller
// Controls workspace visibility based on user roles

frappe.provide('safari.navigation');

safari.navigation = {
    
    // Define role-based workspace access rules
    workspace_rules: {
        // System Manager sees everything
        'System Manager': {
            visible: ['*'], // '*' means all workspaces
            hidden: []
        },
        
        // Excursion Manager specific access
        'Excursion Manager': {
            visible: [
                'Excursion Management',
                'Transport Management', 
                'Company Settings'
            ],
            hidden: [
                'Safari Operations',
                'Accommodation Management',
                'Parks Management',
                'Safari Packages',
                'Users',
                'Integrations Management'
            ]
        },
        
        // Excursion User limited access
        'Excursion User': {
            visible: [
                'Excursion Management',
                'Transport Management'
            ],
            hidden: [
                'Safari Operations',
                'Accommodation Management', 
                'Parks Management',
                'Safari Packages',
                'Company Settings',
                'Users',
                'Integrations Management'
            ]
        },
        
        // Excursion Guide limited access (can be same as User for now)
        'Excursion Guide': {
            visible: [
                'Excursion Management',
                'Transport Management'
            ],
            hidden: [
                'Safari Operations',
                'Accommodation Management', 
                'Parks Management',
                'Safari Packages',
                'Company Settings',
                'Users',
                'Integrations Management'
            ]
        },
        
        // Safari Manager full operational access
        'Safari Manager': {
            visible: [
                'Safari Operations',
                'Accommodation Management',
                'Parks Management', 
                'Safari Packages',
                'Excursion Management',
                'Transport Management',
                'Company Settings'
            ],
            hidden: [
                'Users',
                'Integrations Management'
            ]
        },
        
        // Safari User limited operational access
        'Safari User': {
            visible: [
                'Safari Operations',
                'Accommodation Management',
                'Parks Management',
                'Safari Packages'
            ],
            hidden: [
                'Excursion Management',
                'Transport Management',
                'Company Settings',
                'Users',
                'Integrations Management'
            ]
        },
        
        // Safari Guide minimal access
        'Safari Guide': {
            visible: [
                'Safari Operations'
            ],
            hidden: [
                'Accommodation Management',
                'Parks Management',
                'Safari Packages',
                'Excursion Management',
                'Transport Management',
                'Company Settings', 
                'Users',
                'Integrations Management'
            ]
        },
        
        // Safari Guest - minimal access (mostly read-only through other means)
        'Safari Guest': {
            visible: [],
            hidden: ['*'] // Hide all navigation items
        }
    },

    // Get current user's roles
    getCurrentUserRoles: function() {
        return frappe.user_roles || [];
    },

    // Check if user has any of the specified roles
    hasAnyRole: function(roles) {
        const userRoles = this.getCurrentUserRoles();
        return roles.some(role => userRoles.includes(role));
    },

    // Determine if workspace should be visible based on user roles
    shouldShowWorkspace: function(workspaceName) {
        const userRoles = this.getCurrentUserRoles();
        
        // System Manager can see everything
        if (userRoles.includes('System Manager')) {
            return true;
        }
        
        // Check each role the user has
        for (let role of userRoles) {
            const rules = this.workspace_rules[role];
            if (!rules) continue;
            
            // If this role allows all workspaces
            if (rules.visible.includes('*')) {
                // Check if it's specifically hidden
                return !rules.hidden.includes(workspaceName);
            }
            
            // If this role specifically allows this workspace
            if (rules.visible.includes(workspaceName)) {
                return true;
            }
        }
        
        // Default to hidden if no role explicitly allows it
        return false;
    },

    // Apply role-based filtering to sidebar navigation
    filterSidebarNavigation: function() {
        console.log('🦁 Applying role-based navigation filtering...');
        
        const userRoles = this.getCurrentUserRoles();
        console.log('🦁 Current user roles:', userRoles);
        
        // If user has System Manager role, show everything and exit
        if (userRoles.includes('System Manager')) {
            console.log('🦁 System Manager detected - showing all navigation');
            return;
        }
        
        // Wait for sidebar to be ready
        this.waitForSidebar(() => {
            this.hideForbiddenWorkspaces();
            this.hideSystemNavigation();
            
            // Ensure navbar user dropdown is always visible
            this.protectNavbarElements();
            
            // Also try to filter desktop icons/widgets
            setTimeout(() => {
                this.filterDesktopIcons();
            }, 1000);
        });
    },

    // Filter desktop icons and workspace widgets
    filterDesktopIcons: function() {
        console.log('🦁 Filtering desktop icons and widgets...');
        
        const workspacesToCheck = [
            'Safari Operations',
            'Accommodation Management', 
            'Parks Management',
            'Safari Packages',
            'Excursion Management',
            'Transport Management',
            'Company Settings',
            'Users',
            'Integrations Management'
        ];

        workspacesToCheck.forEach(workspaceName => {
            const shouldShow = this.shouldShowWorkspace(workspaceName);
            
            if (!shouldShow) {
                // Hide desktop widgets/shortcuts
                const desktopSelectors = [
                    `.widget[data-widget-name*="${workspaceName}"]`,
                    `.shortcut-widget-box[data-name*="${workspaceName}"]`,
                    `.desk-sidebar-item:contains("${workspaceName}")`,
                    `.widget-head:contains("${workspaceName}")`,
                    // Hide workspace cards on desktop
                    `.workspace-card:contains("${workspaceName}")`, 
                    `.desk-page .card:contains("${workspaceName}")`
                ];
                
                desktopSelectors.forEach(selector => {
                    try {
                        const elements = $(selector);
                        if (elements.length > 0) {
                            elements.closest('.widget, .card, .shortcut-widget-box, .desk-sidebar-item').hide();
                            console.log(`🦁 Hidden desktop widget for: ${workspaceName} (${elements.length} elements)`);
                        }
                    } catch (e) {
                        // Ignore selector errors
                    }
                });
            }
        });
    },

    // Wait for sidebar elements to be available
    waitForSidebar: function(callback, attempts = 0) {
        const maxAttempts = 50; // 5 seconds maximum wait
        
        if (attempts >= maxAttempts) {
            console.log('🦁 Sidebar wait timeout - proceeding anyway');
            console.log('🔍 Final DOM state check:');
            this.debugDOMState();
            callback();
            return;
        }

        // Check for various sidebar structures
        const sidebarSelectors = [
            '.layout-side-section',
            '.workspace-sidebar', 
            '.standard-sidebar',
            '.desk-sidebar',
            '.sidebar-item',
            '.workspace-item',
            '.nav-item'
        ];
        
        let sidebarExists = false;
        sidebarSelectors.forEach(selector => {
            const elements = $(selector);
            if (elements.length > 0) {
                console.log(`🔍 Found sidebar elements: ${selector} (${elements.length} elements)`);
                sidebarExists = true;
            }
        });

        if (sidebarExists) {
            console.log('🦁 Sidebar detected, proceeding with filtering');
            this.debugDOMState();
            callback();
        } else {
            if (attempts % 10 === 0) { // Log every second
                console.log(`🦁 Waiting for sidebar... attempt ${attempts}`);
            }
            setTimeout(() => {
                this.waitForSidebar(callback, attempts + 1);
            }, 100);
        }
    },

    // Debug the current DOM state
    debugDOMState: function() {
        console.log('🔍 Current DOM state:');
        console.log(`  Body classes: ${document.body.className}`);
        console.log(`  Sidebar containers found:`);
        
        const containers = [
            '.layout-side-section',
            '.workspace-sidebar',
            '.standard-sidebar', 
            '.desk-sidebar',
            '.sidebar',
            '#navbar-sidebar'
        ];
        
        containers.forEach(selector => {
            const elements = $(selector);
            console.log(`    ${selector}: ${elements.length} elements`);
        });
        
        console.log(`  Navigation elements found:`);
        const navElements = [
            '.sidebar-item',
            '.workspace-item',
            '.nav-item',
            '.widget',
            'a[href*="/app/"]'
        ];
        
        navElements.forEach(selector => {
            const elements = $(selector);
            console.log(`    ${selector}: ${elements.length} elements`);
            if (elements.length > 0 && elements.length < 15) {
                elements.each(function(i) {
                    const text = $(this).text().trim().substring(0, 30);
                    const href = $(this).attr('href') || 'no href';
                    console.log(`      ${i}: "${text}" - ${href}`);
                });
            }
        });
    },

    // Hide workspace navigation items based on rules
    hideForbiddenWorkspaces: function() {
        const workspacesToCheck = [
            'Safari Operations',
            'Accommodation Management', 
            'Parks Management',
            'Safari Packages',
            'Excursion Management',
            'Transport Management',
            'Company Settings',
            'Users',
            'Integrations Management'
        ];

        console.log('🦁 Checking workspaces for current user...');
        
        workspacesToCheck.forEach(workspaceName => {
            const shouldShow = this.shouldShowWorkspace(workspaceName);
            console.log(`🦁 Workspace "${workspaceName}": ${shouldShow ? 'SHOW' : 'HIDE'}`);
            
            if (!shouldShow) {
                this.hideWorkspaceNavigation(workspaceName);
            } else {
                // Ensure visible workspaces are shown
                this.showWorkspaceNavigation(workspaceName);
            }
        });
    },

    // Hide specific workspace navigation elements
    hideWorkspaceNavigation: function(workspaceName) {
        console.log(`🔍 Attempting to hide workspace: ${workspaceName}`);
        
        // Enhanced selectors for current ERPNext versions
        const workspaceSlug = workspaceName.toLowerCase().replace(/\s+/g, '-');
        const selectors = [
            // ERPNext v14/v15 workspace selectors
            `[data-name="${workspaceName}"]`,
            `[data-workspace="${workspaceName}"]`, 
            `[title="${workspaceName}"]`,
            `a[href*="${workspaceSlug}"]`,
            `a[href="/app/${workspaceSlug}"]`,
            `a[href*="/workspace/${workspaceSlug}"]`,
            // Text-based selectors
            `.sidebar-item-label:contains("${workspaceName}")`,
            `.workspace-item:contains("${workspaceName}")`,
            // Desktop icon selectors
            `.widget[data-widget-name*="${workspaceName}"]`,
            `.shortcut-widget-box[data-name*="${workspaceName}"]`,
            // General link selectors
            `a:contains("${workspaceName}")`,
            // Sidebar navigation
            `.standard-sidebar a:contains("${workspaceName}")`,
            `.desk-sidebar a:contains("${workspaceName}")`,
            // New workspace sidebar selectors
            '.sidebar-item-container a:contains("' + workspaceName + '")',
            '.workspace-sidebar a:contains("' + workspaceName + '")'
        ];

        let elementsFound = 0;
        selectors.forEach((selector, index) => {
            try {
                const elements = $(selector);
                console.log(`🔍 Selector ${index + 1}: "${selector}" found ${elements.length} elements`);
                
                if (elements.length > 0) {
                    // Try different parent containers
                    const parents = [
                        '.sidebar-item',
                        '.workspace-item', 
                        '.nav-item',
                        '.list-item',
                        '.widget',
                        '.shortcut-widget-box',
                        'li',
                        '.sidebar-item-container',
                        '.desk-sidebar-item'
                    ];
                    
                    elements.each(function() {
                        const $element = $(this);
                        let hidden = false;
                        
                        // Try to find and hide the appropriate parent
                        parents.forEach(parentSelector => {
                            const $parent = $element.closest(parentSelector);
                            if ($parent.length > 0 && !hidden) {
                                $parent.hide();
                                elementsFound++;
                                hidden = true;
                                console.log(`🦁 Hidden ${workspaceName} via parent: ${parentSelector}`);
                            }
                        });
                        
                        // If no parent found, hide the element directly
                        if (!hidden) {
                            $element.hide();
                            elementsFound++;
                            console.log(`🦁 Hidden ${workspaceName} directly`);
                        }
                    });
                }
            } catch (e) {
                console.log(`⚠️ Selector error for "${selector}":`, e.message);
            }
        });

        // Also hide workspace links in dropdown menus and other containers
        try {
            // Only target workspace-specific dropdowns, not all dropdown items
            $(`.workspace-link:contains("${workspaceName}")`).closest('li, .dropdown-item').hide();
            $('.workspace-dropdown .dropdown-item:contains("' + workspaceName + '")').hide();
            $('.sidebar .dropdown-item:contains("' + workspaceName + '")').hide();
        } catch (e) {
            console.log('⚠️ Dropdown hiding error:', e.message);
        }
        
        if (elementsFound === 0) {
            console.log(`⚠️ No elements found to hide for workspace: ${workspaceName}`);
            // Debug: Let's see what's actually in the DOM
            console.log('🔍 Available sidebar elements:');
            $('.sidebar-item, .workspace-item, .nav-item, .widget, a').each(function(i) {
                if (i < 10) { // Limit to first 10 for debugging
                    console.log(`  ${i}: ${this.tagName} - ${$(this).text().substring(0, 50)} - ${$(this).attr('href') || 'no href'}`);
                }
            });
        } else {
            console.log(`✅ Successfully hidden ${elementsFound} elements for: ${workspaceName}`);
        }
    },

    // Show specific workspace navigation elements (opposite of hide)
    showWorkspaceNavigation: function(workspaceName) {
        const selectors = [
            `[data-name="${workspaceName}"]`,
            `[title="${workspaceName}"]`,
            `a[href*="${workspaceName.toLowerCase().replace(/\s+/g, '-')}"]`,
            `.sidebar-item-label:contains("${workspaceName}")`,
            `.workspace-item[data-workspace="${workspaceName}"]`,
            `a[href="/app/${workspaceName.toLowerCase().replace(/\s+/g, '-')}"]`
        ];

        selectors.forEach(selector => {
            try {
                const elements = $(selector);
                if (elements.length > 0) {
                    // Show the parent navigation item
                    elements.closest('.sidebar-item, .workspace-item, .nav-item, li, .list-item').show();
                    console.log(`🦁 Shown navigation for: ${workspaceName} (${elements.length} elements)`);
                }
            } catch (e) {
                // Ignore selector errors
            }
        });

        // Also show workspace links in dropdown menus
        $(`.workspace-link:contains("${workspaceName}")`).closest('li, .dropdown-item').show();
    },

    // Hide system-level navigation for non-system managers
    hideSystemNavigation: function() {
        const userRoles = this.getCurrentUserRoles();
        
        if (!userRoles.includes('System Manager')) {
            // Hide Users navigation
            this.hideWorkspaceNavigation('Users');
            
            // Hide Integrations Management
            this.hideWorkspaceNavigation('Integrations Management');
            
            // Hide system setup items - only in sidebar/navigation areas
            $('.layout-side-section a[href*="/app/user"], .sidebar a[href*="/app/user"], .layout-side-section a[href*="/app/role"], .sidebar a[href*="/app/role"], .layout-side-section a[href*="/app/system-settings"], .sidebar a[href*="/app/system-settings"]')
                .closest('.sidebar-item, .nav-item, li').hide();
                
            console.log('🦁 Hidden system navigation items');
        }
    },

    // Protect navbar elements from being hidden by role-based navigation
    protectNavbarElements: function() {
        // Ensure navbar user dropdown and other critical navbar elements are not affected by our hiding
        const navbarSelectors = [
            '.dropdown-navbar-user',
            '.navbar-user-image',
            '.dropdown-help',
            '.navbar .dropdown',
            '.navbar .dropdown-menu',
            '#toolbar .dropdown',
            '.toolbar-user',
            '.navbar-nav'
        ];
        
        navbarSelectors.forEach(selector => {
            try {
                const elements = $(selector);
                if (elements.length > 0) {
                    // Only remove our hiding class, don't force display styles
                    elements.removeClass('safari-navigation-hidden');
                    // Remove any inline display:none that we might have accidentally applied
                    elements.each(function() {
                        const $el = $(this);
                        if ($el.css('display') === 'none' && !$el.hasClass('dropdown-menu')) {
                            // Only reset display if it's not a dropdown-menu (which should be hidden by default)
                            $el.css('display', '');
                        }
                    });
                    console.log(`🛡️ Protected navbar element: ${selector} (${elements.length} elements)`);
                }
            } catch (e) {
                // Ignore selector errors
            }
        });
        
        console.log('🛡️ Navbar elements protected from role-based hiding');
    },

    // Refresh navigation filtering (useful after role changes)
    refresh: function() {
        console.log('🦁 Refreshing role-based navigation...');
        
        // Show all items first
        $('.sidebar-item, .workspace-item, .nav-item, .list-item').show();
        
        // Re-apply filtering
        this.filterSidebarNavigation();
        
        // Always protect navbar elements after refresh
        this.protectNavbarElements();
    },

    // Initialize the role-based navigation system
    init: function() {
        console.log('🦁 Initializing role-based navigation system...');
        
        // Apply filtering immediately
        this.filterSidebarNavigation();
        
        // Intercept workspace creation and navigation functions
        this.interceptWorkspaceCreation();
        
        // Re-apply filtering when pages change
        $(document).on('page-change', () => {
            setTimeout(() => {
                this.filterSidebarNavigation();
            }, 500);
        });

        // Re-apply filtering when workspaces are refreshed
        if (frappe.workspace) {
            const originalRender = frappe.workspace.render;
            frappe.workspace.render = function() {
                const result = originalRender.apply(this, arguments);
                setTimeout(() => {
                    safari.navigation.filterSidebarNavigation();
                }, 300);
                return result;
            };
        }

        // Monitor for dynamic content changes with enhanced detection
        const observer = new MutationObserver((mutations) => {
            let shouldRefilter = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const addedElements = Array.from(mutation.addedNodes);
                    const hasNavigationElements = addedElements.some(node => {
                        if (node.nodeType !== 1) return false;
                        
                        // Check for workspace-related elements
                        const isWorkspaceElement = (
                            node.classList?.contains('sidebar-item') ||
                            node.classList?.contains('workspace-item') ||
                            node.classList?.contains('layout-side-section') ||
                            node.classList?.contains('desk-sidebar') ||
                            node.classList?.contains('widget') ||
                            node.querySelector?.('.sidebar-item, .workspace-item, .widget, a[href*="/app/"]') ||
                            (node.tagName === 'A' && node.href && node.href.includes('/app/'))
                        );
                        
                        // Check for text content that matches our workspaces
                        const textContent = node.textContent || '';
                        const hasWorkspaceText = [
                            'Safari Operations', 'Accommodation Management', 'Parks Management',
                            'Safari Packages', 'Excursion Management', 'Transport Management',
                            'Company Settings', 'Users', 'Integrations Management'
                        ].some(workspace => textContent.includes(workspace));
                        
                        return isWorkspaceElement || hasWorkspaceText;
                    });
                    
                    if (hasNavigationElements) {
                        console.log('🔍 Detected new navigation elements, re-filtering...');
                        shouldRefilter = true;
                    }
                }
            });
            
            if (shouldRefilter) {
                setTimeout(() => {
                    safari.navigation.filterSidebarNavigation();
                    // Always protect navbar after filtering
                    safari.navigation.protectNavbarElements();
                }, 200);
            }
        });

        // Start observing with enhanced options
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'data-name', 'data-workspace', 'href']
        });

        console.log('✅ Role-based navigation system initialized');
        
        // Ensure navbar is protected immediately after initialization
        setTimeout(() => {
            this.protectNavbarElements();
        }, 500);
        
        // Force workspace check after initialization
        setTimeout(() => {
            this.forceWorkspaceCheck();
        }, 2000);
    },

    // Intercept workspace and navigation creation functions
    interceptWorkspaceCreation: function() {
        console.log('🦁 Setting up workspace creation interceptor...');
        
        // Override frappe.workspace methods if available
        if (window.frappe && frappe.workspace) {
            // Intercept sidebar creation
            if (frappe.workspace.Workspace) {
                const originalMakeSidebar = frappe.workspace.Workspace.prototype.make_sidebar;
                if (originalMakeSidebar) {
                    frappe.workspace.Workspace.prototype.make_sidebar = function() {
                        const result = originalMakeSidebar.apply(this, arguments);
                        console.log('🔍 Workspace sidebar created, applying filters...');
                        setTimeout(() => {
                            safari.navigation.filterSidebarNavigation();
                        }, 100);
                        return result;
                    };
                }
            }
        }

        // Intercept jQuery append/prepend operations that might add navigation
        if (window.jQuery) {
            const originalAppend = jQuery.fn.append;
            const originalPrepend = jQuery.fn.prepend;
            const originalHtml = jQuery.fn.html;

            jQuery.fn.append = function() {
                const result = originalAppend.apply(this, arguments);
                this.each(function() {
                    if (this.classList && (
                        this.classList.contains('layout-side-section') ||
                        this.classList.contains('desk-sidebar') ||
                        this.classList.contains('sidebar') ||
                        this.querySelector && this.querySelector('a[href*="/app/"]')
                    )) {
                        setTimeout(() => {
                            safari.navigation.filterSidebarNavigation();
                        }, 50);
                    }
                });
                return result;
            };

            jQuery.fn.html = function(value) {
                const result = originalHtml.apply(this, arguments);
                if (arguments.length > 0 && typeof value === 'string') {
                    // Check if HTML contains workspace links
                    const hasWorkspaceLinks = [
                        'Safari Operations', 'Accommodation Management', 'Parks Management',
                        'Safari Packages', 'Excursion Management', 'Transport Management',
                        'Company Settings', 'Users', 'Integrations Management'
                    ].some(workspace => value.includes(workspace));
                    
                    if (hasWorkspaceLinks) {
                        console.log('🔍 HTML with workspace content added, filtering...');
                        setTimeout(() => {
                            safari.navigation.filterSidebarNavigation();
                        }, 50);
                    }
                }
                return result;
            };
        }

        console.log('✅ Workspace creation interceptor set up');
    },

    // Force workspace loading and filtering (for testing and manual trigger)
    forceWorkspaceCheck: function() {
        console.log('🦁 Forcing workspace check and filtering...');
        
        // Try to trigger workspace loading by navigating and checking
        setTimeout(() => {
            // Check if there's a way to programmatically load workspaces
            if (frappe.workspace && frappe.workspace.setup_workspaces) {
                frappe.workspace.setup_workspaces();
            }
            
            // Try to get available workspaces from backend
            if (frappe.call) {
                frappe.call({
                    method: 'frappe.desk.desktop.get_workspace_sidebar_items',
                    callback: (r) => {
                        if (r.message) {
                            console.log('🔍 Available workspaces from backend:', r.message);
                            // Re-apply filtering after getting workspace data
                            setTimeout(() => {
                                this.filterSidebarNavigation();
                            }, 500);
                        }
                    }
                });
            }
            
            // Skip desktop settings call that was causing errors
            console.log('🔍 Skipping desktop settings call to avoid backend errors');
        }, 1000);
    }
};

// Auto-initialize when DOM is ready
$(document).ready(function() {
    setTimeout(() => {
        safari.navigation.init();
    }, 1000);
});

// Initialize when Frappe is ready (for ERPNext v15)
$(document).ready(function() {
    // Wait for frappe object to be available
    function waitForFrappe() {
        if (typeof frappe !== 'undefined' && frappe.user_roles) {
            setTimeout(() => {
                safari.navigation.init();
            }, 1500);
        } else {
            setTimeout(waitForFrappe, 500);
        }
    }
    waitForFrappe();
});

// Export for console access and debugging
window.safariNavigation = safari.navigation;

// Add manual test trigger
window.testSafariNavigation = function() {
    console.log('🧪 Manual test triggered');
    safari.navigation.forceWorkspaceCheck();
    setTimeout(() => {
        safari.navigation.filterSidebarNavigation();
    }, 2000);
};

// Debug function to check navbar dropdown status
window.checkNavbarDropdown = function() {
    console.log('🔍 Checking navbar dropdown status...');
    
    const navbarSelectors = [
        '.dropdown-navbar-user',
        '.navbar-user-image', 
        '.dropdown-help',
        '.navbar .dropdown',
        '.navbar .dropdown-menu',
        '#toolbar .dropdown',
        '.toolbar-user',
        '.navbar-nav'
    ];
    
    navbarSelectors.forEach(selector => {
        const elements = $(selector);
        if (elements.length > 0) {
            elements.each(function(i) {
                const $el = $(this);
                console.log(`${selector}[${i}]:`, {
                    visible: $el.is(':visible'),
                    display: $el.css('display'),
                    visibility: $el.css('visibility'),
                    hasHiddenClass: $el.hasClass('safari-navigation-hidden'),
                    classes: $el.attr('class')
                });
            });
        } else {
            console.log(`${selector}: No elements found`);
        }
    });
    
    // Force protection
    safari.navigation.protectNavbarElements();
    console.log('🛡️ Navbar protection applied');
};