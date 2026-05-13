from fastapi import APIRouter

router = APIRouter()

# ================= ABOUT =================

about_data = {
    "title": "About VoltStream",
    "description": "VoltStream is an AI-powered smart energy monitoring platform designed to help households optimize electricity usage, monitor solar generation, reduce carbon emissions, and gain real-time energy insights."
}

@router.get("/about")
def get_about():
    return about_data


# ================= PRICING =================

pricing_data = {
    "plans": [
        {
            "name": "Starter",
            "price": "Free",
            "features": [
                "Basic Dashboard",
                "Device Monitoring",
                "Daily Analytics"
            ]
        },
        {
            "name": "Pro",
            "price": "₹499/month",
            "features": [
                "Advanced Analytics",
                "AI Insights",
                "Unlimited Devices"
            ]
        },
        {
            "name": "Enterprise",
            "price": "Custom",
            "features": [
                "Enterprise Security",
                "Custom Integrations",
                "Priority Support"
            ]
        }
    ]
}

@router.get("/pricing")
def get_pricing():
    return pricing_data


# ================= CAREERS =================

careers_data = {
    "jobs": [
        {
            "role": "Frontend Developer",
            "location": "Remote",
            "type": "Full Time"
        },
        {
            "role": "Backend Engineer",
            "location": "Hyderabad",
            "type": "Full Time"
        },
        {
            "role": "AI Engineer",
            "location": "Remote",
            "type": "Internship"
        }
    ]
}

@router.get("/careers")
def get_careers():
    return careers_data


# ================= CONTACT =================

contact_data = {
    "email": "support@voltstream.ai",
    "phone": "+91 9876543210",
    "location": "Hyderabad, India"
}

@router.get("/contact")
def get_contact():
    return contact_data


# ================= ROADMAP =================

roadmap_data = {
    "upcoming_features": [
        "AI Energy Forecasting",
        "Smart Automation",
        "EV Charging Analytics",
        "Advanced Solar Insights",
        "Mobile Application"
    ]
}

@router.get("/roadmap")
def get_roadmap():
    return roadmap_data


# ================= SECURITY =================

security_data = {
    "details": [
        "End-to-End Encryption",
        "Secure Cloud Storage",
        "JWT Authentication",
        "Role-Based Access",
        "Continuous Monitoring"
    ]
}

@router.get("/security")
def get_security():
    return security_data


# ================= BLOG =================

blog_data = {
    "posts": [
        {
            "title": "How AI Improves Energy Efficiency"
        },
        {
            "title": "Top 5 Smart Home Energy Tips"
        },
        {
            "title": "Understanding Solar Analytics"
        }
    ]
}

@router.get("/blog")
def get_blog():
    return blog_data


# ================= PRIVACY =================

privacy_data = {
    "title": "Privacy Policy",
    "content": "VoltStream securely stores and protects all user energy data."
}

@router.get("/privacy")
def get_privacy():
    return privacy_data


# ================= TERMS =================

terms_data = {
    "title": "Terms & Conditions",
    "content": "Users must comply with VoltStream platform policies and usage guidelines."
}

@router.get("/terms")
def get_terms():
    return terms_data


# ================= COOKIES =================

cookies_data = {
    "title": "Cookies Policy",
    "content": "VoltStream uses cookies to improve user experience and analytics."
}

@router.get("/cookies")
def get_cookies():
    return cookies_data