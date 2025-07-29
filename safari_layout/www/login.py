# safari_core/www/login.py
import frappe
import frappe.utils
from frappe import _
from frappe.auth import LoginManager
from frappe.website.utils import get_home_page
from frappe.utils.html_utils import get_icon_html

def get_context(context):
    """
    Custom login page controller that extends the functionality of the original
    frappe login controller but uses our custom template
    """
    # First get the standard login page context
    if frappe.session.user != "Guest":
        frappe.local.flags.redirect_location = get_home_page()
        raise frappe.Redirect

    # Set up the standard context fields
    context.no_header = True
    context.no_sidebar = True
    context.no_breadcrumbs = True
    context.no_cache = True
    context.title = "Login"
    context.hide_login = True  # Special flag to prevent standard login
    
    # Add standard login form info
    context.form_dict = frappe.form_dict
    
    for key in ("login_email", "login_password"):
        if key in frappe.form_dict:
            del frappe.form_dict[key]
    
    # Add Safari ERP specific fields
    context.safari_logo = "/assets/safari_layout/images/safari_logo.svg"
    context.safari_title = "SafariMATE"
    context.safari_subtitle = "Mobility - Accommodation - Tours - Ecosystem"
    context.year = frappe.utils.now_datetime().year
    context.safari_version = "1.0.0"
    
    # Support for redirect URL
    context.redirect_to = frappe.local.request.args.get("redirect-to") or ""
    
    return context