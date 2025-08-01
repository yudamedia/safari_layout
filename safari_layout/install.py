# ~/frappe-bench/apps/safari_layout/safari_layout/install.py
# Installation script for Safari Layout with Role Navigation

import frappe
from frappe import _

def after_install():
    """Run after Safari Layout installation"""
    print("🦁 Setting up Safari Layout with Role-Based Navigation...")
    
    setup_workspace_permissions()
    create_custom_roles_if_missing()
    setup_default_workspace_visibility()
    clear_cache_and_restart()
    
    print("✅ Safari Layout installation completed!")

def setup_workspace_permissions():
    """Set up role-based workspace permissions"""
    print("📋 Setting up workspace permissions...")
    
    try:
        from safari_core.utils.role_utils import setup_role_permissions
        setup_role_permissions()
    except Exception as e:
        print(f"⚠️ Could not setup role permissions: {str(e)}")

def create_custom_roles_if_missing():
    """Ensure all Safari custom roles exist"""
    print("👥 Creating Safari custom roles...")
    
    safari_roles = [
        {
            "role_name": "Safari Guest",
            "desk_access": 0,
            "restrict_to_domain": "Safari Management"
        },
        {
            "role_name": "Safari Guide", 
            "desk_access": 1,
            "restrict_to_domain": "Safari Management"
        },
        {
            "role_name": "Safari User",
            "desk_access": 1,
            "restrict_to_domain": "Safari Management"
        },
        {
            "role_name": "Safari Manager",
            "desk_access": 1,
            "restrict_to_domain": "Safari Management"
        },
        {
            "role_name": "Excursion Manager",
            "desk_access": 1,
            "restrict_to_domain": "Safari Management"
        },
        {
            "role_name": "Excursion Guide",
            "desk_access": 1,
            "restrict_to_domain": "Safari Management"
        }
    ]
    
    for role_data in safari_roles:
        role_name = role_data["role_name"]
        
        if not frappe.db.exists("Role", role_name):
            try:
                role = frappe.get_doc({
                    "doctype": "Role",
                    **role_data
                })
                role.insert(ignore_permissions=True)
                print(f"✅ Created role: {role_name}")
            except Exception as e:
                print(f"❌ Failed to create role {role_name}: {str(e)}")
        else:
            print(f"⚠️ Role {role_name} already exists")

def setup_default_workspace_visibility():
    """Configure default workspace visibility settings"""
    print("🏢 Configuring workspace visibility...")
    
    workspace_configs = [
        {
            "workspace": "Users",
            "roles": ["System Manager"],
            "is_hidden": 0
        },
        {
            "workspace": "Integrations Management",
            "roles": ["System Manager"], 
            "is_hidden": 0
        },
        {
            "workspace": "Company Settings",
            "roles": ["System Manager", "Safari Manager", "Excursion Manager"],
            "is_hidden": 0
        },
        {
            "workspace": "Safari Operations",
            "roles": ["System Manager", "Safari Manager", "Safari User", "Safari Guide"],
            "is_hidden": 0
        },
        {
            "workspace": "Excursion Management", 
            "roles": ["System Manager", "Safari Manager", "Excursion Manager", "Excursion Guide"],
            "is_hidden": 0
        },
        {
            "workspace": "Transport Management",
            "roles": ["System Manager", "Safari Manager", "Excursion Manager", "Excursion Guide"],
            "is_hidden": 0
        }
    ]
    
    for config in workspace_configs:
        workspace_name = config["workspace"]
        
        if frappe.db.exists("Workspace", workspace_name):
            try:
                workspace = frappe.get_doc("Workspace", workspace_name)
                
                # Clear existing roles
                workspace.roles = []
                
                # Add configured roles
                for role_name in config["roles"]:
                    if frappe.db.exists("Role", role_name):
                        workspace.append("roles", {"role": role_name})
                
                # Set visibility
                workspace.is_hidden = config["is_hidden"]
                
                workspace.save(ignore_permissions=True)
                print(f"✅ Configured workspace: {workspace_name}")
                
            except Exception as e:
                print(f"❌ Failed to configure workspace {workspace_name}: {str(e)}")
        else:
            print(f"⚠️ Workspace {workspace_name} not found")

def clear_cache_and_restart():
    """Clear cache and restart to apply changes"""
    print("🔄 Clearing cache and applying changes...")
    
    try:
        # Clear workspace cache
        frappe.clear_cache()
        
        # Clear specific caches
        frappe.cache().delete_keys("workspace")
        frappe.cache().delete_keys("roles")
        
        frappe.db.commit()
        print("✅ Cache cleared successfully")
        
    except Exception as e:
        print(f"⚠️ Cache clear warning: {str(e)}")

def validate_installation():
    """Validate that everything is set up correctly"""
    print("🔍 Validating installation...")
    
    # Check roles
    required_roles = ["Safari Guest", "Safari Guide", "Safari User", "Safari Manager", "Excursion Manager", "Excursion Guide"]
    missing_roles = []
    
    for role in required_roles:
        if not frappe.db.exists("Role", role):
            missing_roles.append(role)
    
    if missing_roles:
        print(f"❌ Missing roles: {', '.join(missing_roles)}")
        return False
    else:
        print("✅ All required roles exist")
    
    # Check workspaces
    required_workspaces = ["Safari Operations", "Company Settings", "Users", "Integrations Management"]
    missing_workspaces = []
    
    for workspace in required_workspaces:
        if not frappe.db.exists("Workspace", workspace):
            missing_workspaces.append(workspace)
    
    if missing_workspaces:
        print(f"❌ Missing workspaces: {', '.join(missing_workspaces)}")
        return False
    else:
        print("✅ All required workspaces exist")
    
    print("🎉 Installation validation completed successfully!")
    return True

def setup_development_mode():
    """Setup development mode features"""
    if frappe.conf.get('developer_mode'):
        print("🔧 Setting up development mode features...")
        
        # Enable navigation debugging
        frappe.db.set_single_value("System Settings", "safari_debug_navigation", 1)
        
        # Create a test user for each role (optional)
        create_test_users()

def create_test_users():
    """Create test users for each Safari role (development only)"""
    if not frappe.conf.get('developer_mode'):
        return
    
    test_users = [
        {"email": "safari.manager@test.com", "first_name": "Safari", "last_name": "Manager", "role": "Safari Manager"},
        {"email": "safari.user@test.com", "first_name": "Safari", "last_name": "User", "role": "Safari User"},
        {"email": "safari.guide@test.com", "first_name": "Safari", "last_name": "Guide", "role": "Safari Guide"},
        {"email": "excursion.manager@test.com", "first_name": "Excursion", "last_name": "Manager", "role": "Excursion Manager"},
        {"email": "excursion.guide@test.com", "first_name": "Excursion", "last_name": "Guide", "role": "Excursion Guide"}
    ]
    
    for user_data in test_users:
        if not frappe.db.exists("User", user_data["email"]):
            try:
                user = frappe.get_doc({
                    "doctype": "User",
                    "email": user_data["email"],
                    "first_name": user_data["first_name"],
                    "last_name": user_data["last_name"],
                    "send_welcome_email": 0,
                    "enabled": 1
                })
                user.insert(ignore_permissions=True)
                
                # Add role
                user.add_roles(user_data["role"])
                
                print(f"✅ Created test user: {user_data['email']} with role {user_data['role']}")
                
            except Exception as e:
                print(f"❌ Failed to create test user {user_data['email']}: {str(e)}")

# Manual setup functions for troubleshooting
def manual_setup():
    """Manual setup function - can be called from console"""
    print("🔧 Running manual Safari Layout setup...")
    after_install()
    validate_installation()

def reset_workspace_permissions():
    """Reset all workspace permissions - useful for testing"""
    print("🔄 Resetting workspace permissions...")
    
    workspaces = frappe.get_all("Workspace", fields=["name"])
    
    for workspace in workspaces:
        try:
            doc = frappe.get_doc("Workspace", workspace.name)
            doc.roles = []
            doc.save(ignore_permissions=True)
            print(f"✅ Reset permissions for: {workspace.name}")
        except Exception as e:
            print(f"❌ Failed to reset {workspace.name}: {str(e)}")
    
    # Re-apply Safari permissions
    setup_workspace_permissions()
    frappe.db.commit()
    print("🎉 Workspace permissions reset complete!")

if __name__ == "__main__":
    # Can be run directly for testing
    manual_setup()