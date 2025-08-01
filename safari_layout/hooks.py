app_name = "safari_layout"
app_title = "Safari Layout"
app_publisher = "Safari ERP"
app_description = "Enhanced layout and navigation for Safari ERP"
app_email = "yuda@graphicshop.co.ke"
app_license = "mit"


# Include JS and CSS files
app_include_js = [
    "/assets/safari_layout/js/safari_layout.js",
    "/assets/safari_layout/js/role_navigation.js"
]

app_include_css = [
    "/assets/safari_layout/css/safari_layout.css", 
    "/assets/safari_layout/css/role_navigation.css"
]

app_include_icons = [
    "safari_layout/icons/safari_icons.svg"
]

# Boot session data - inject role information
boot_session = "safari_layout.utils.boot.get_boot_session_data"

# Document Events for role-based access
doc_events = {
    "User": {
        "after_insert": "safari_core.utils.role_utils.setup_role_permissions",
        "on_update": "safari_core.utils.role_utils.setup_role_permissions"
    }
    # "Workspace": {
    #     "validate": "safari_core.utils.role_utils.validate_workspace_access"
    # }
}

# Jinja environment - add role checking functions
jenv = {
    "methods": [
        "safari_core.utils.role_utils.can_access_workspace",
        "safari_core.utils.role_utils.get_user_workspace_access"
    ]
}

# Website context - add role info for portal users
website_context = {
    "get_user_workspace_access": "safari_core.utils.role_utils.get_user_workspace_access"
}

# Override standard methods - temporarily disabled
# override_whitelisted_methods = {
#     "frappe.desk.desktop.get_desktop_settings": "safari_layout.utils.desktop.get_desktop_settings_with_roles"
# }

# Standard portal pages (if needed for portal access)
standard_portal_menu_items = []

# Installation hooks
after_install = "safari_layout.install.after_install"

# Scheduler Events (optional - for role auditing)
# scheduler_events = {
#     "daily": [
#         "safari_core.utils.role_utils.audit_workspace_access"
#     ]
# }

# Website routing
website_route_rules = [
    {"from_route": "/login", "to_route": "login"},
]

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "safari_layout.utils.jinja_methods",
# 	"filters": "safari_layout.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "safari_layout.install.before_install"
# after_install = "safari_layout.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "safari_layout.uninstall.before_uninstall"
# after_uninstall = "safari_layout.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "safari_layout.utils.before_app_install"
# after_app_install = "safari_layout.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "safari_layout.utils.before_app_uninstall"
# after_app_uninstall = "safari_layout.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "safari_layout.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"safari_layout.tasks.all"
# 	],
# 	"daily": [
# 		"safari_layout.tasks.daily"
# 	],
# 	"hourly": [
# 		"safari_layout.tasks.hourly"
# 	],
# 	"weekly": [
# 		"safari_layout.tasks.weekly"
# 	],
# 	"monthly": [
# 		"safari_layout.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "safari_layout.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "safari_layout.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "safari_layout.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["safari_layout.utils.before_request"]
# after_request = ["safari_layout.utils.after_request"]

# Job Events
# ----------
# before_job = ["safari_layout.utils.before_job"]
# after_job = ["safari_layout.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"safari_layout.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

