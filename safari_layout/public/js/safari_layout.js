// Safari Layout - Enhanced Sidebar Functionality

$(document).ready(function() {
    
    // Enhanced sidebar tooltip functionality
    function updateSidebarTooltips() {
        const sidebar = $('#left-sidebar');
        const isCollapsed = sidebar.hasClass('collapsed');
        
        if (isCollapsed) {
            // Add tooltips to menu items
            $('.sidebar-item-icon').each(function() {
                const $icon = $(this);
                const $anchor = $icon.closest('.item-anchor');
                const title = $anchor.attr('title') || $anchor.find('.sidebar-item-label').text();
                
                if (title && !$icon.find('.sidebar-tooltip').length) {
                    $icon.append(`<div class="sidebar-tooltip">${title}</div>`);
                }
            });
        } else {
            // Remove tooltips when expanded
            $('.sidebar-tooltip').remove();
        }
    }
    
    // Update tooltips when sidebar toggles
    $(document).on('click', '#sidebar-toggle', function() {
        // Delay to allow CSS transition to complete
        setTimeout(updateSidebarTooltips, 100);
    });
    
    // Initial tooltip setup
    updateSidebarTooltips();
    
    // Update tooltips when workspace content changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && 
                mutation.target.classList.contains('desk-sidebar')) {
                setTimeout(updateSidebarTooltips, 100);
            }
        });
    });
    
    // Start observing workspace changes
    const deskSidebar = document.querySelector('.desk-sidebar');
    if (deskSidebar) {
        observer.observe(deskSidebar, {
            childList: true,
            subtree: true
        });
    }
    
});

// Icon utility functions
frappe.safari_layout = {
    
    // Function to register custom icons for use in icon picker
    register_custom_icons: function() {
        if (frappe.ui && frappe.ui.form && frappe.ui.form.ControlIcon) {
            
            // Safari custom FontAwesome Pro icons
            const safari_icons = [
                'bed-front',
                'compass', 
                'compass-drafting',
                'map',
                'map-location',
                'location-pin',
                'plane-departure',
                'binoculars',
                'car',
                'boxes-packing',
                'family',
                'people-line',
                'user-magnifying-glass'
            ];
            
            // Extend the original get_all_icons method if it exists
            if (frappe.ui.form.ControlIcon.prototype.get_all_icons) {
                const original_get_all_icons = frappe.ui.form.ControlIcon.prototype.get_all_icons;
                frappe.ui.form.ControlIcon.prototype.get_all_icons = function() {
                    original_get_all_icons.call(this);
                    if (this.icons) {
                        this.icons = this.icons.concat(safari_icons);
                    }
                };
            }
        }
    },
    
    // Helper function to use custom icons
    get_icon: function(icon_name, size = 'md') {
        return frappe.utils.icon(icon_name, size);
    }
    
};

// Register custom icons when ready
frappe.ready(function() {
    frappe.safari_layout.register_custom_icons();
});
