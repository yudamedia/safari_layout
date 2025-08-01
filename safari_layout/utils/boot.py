# ~/frappe-bench/apps/safari_layout/safari_layout/utils/boot.py
# Boot session data for Safari Layout

import frappe
from safari_core.utils.role_utils import get_user_workspace_access

def get_boot_session_data(bootinfo):
    """
    Add Safari role and workspace access data to boot session
    This makes the data available to JavaScript on page load
    
    Args:
        bootinfo: The boot information dictionary from Frappe
    """
    if frappe.session.user and frappe.session.user != 'Guest':
        try:
            # Get user's workspace access info
            workspace_access = get_user_workspace_access()
            
            # Add Safari-specific data to bootinfo
            bootinfo.update({
                'safari_user_roles': frappe.get_roles(),
                'safari_workspace_access': workspace_access,
                'safari_navigation_config': {
                    'debug_mode': frappe.conf.get('developer_mode', 0),
                    'show_role_indicator': frappe.conf.get('safari_debug_navigation', 0)
                }
            })
            
        except Exception as e:
            frappe.log_error(f"Safari boot session error: {str(e)}")
            # Add empty Safari data on error
            bootinfo.update({
                'safari_user_roles': [],
                'safari_workspace_access': {},
                'safari_navigation_config': {}
            })