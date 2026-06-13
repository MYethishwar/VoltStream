#!/usr/bin/env python3
"""
VoltStream API Test Script
Tests all critical endpoints to verify deployment readiness
"""

import requests
import json
import sys
import time
from typing import Dict, Any

BASE_URL = "http://localhost:8080"
TIMEOUT = 5

def print_status(endpoint: str, success: bool, response_data: Any = None, error: str = None):
    """Pretty print endpoint test results"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"\n{status} | {endpoint}")
    if response_data:
        print(f"Response: {json.dumps(response_data, indent=2)}")
    if error:
        print(f"Error: {error}")

def test_health() -> bool:
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=TIMEOUT)
        if response.status_code == 200:
            data = response.json()
            print_status("GET /health", True, data)
            return True
        else:
            print_status("GET /health", False, error=f"Status {response.status_code}")
            return False
    except Exception as e:
        print_status("GET /health", False, error=str(e))
        return False

def test_ready() -> bool:
    """Test readiness endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/ready", timeout=TIMEOUT)
        if response.status_code == 200:
            data = response.json()
            print_status("GET /ready", True, data)
            return True
        else:
            print_status("GET /ready", False, error=f"Status {response.status_code}")
            return False
    except Exception as e:
        print_status("GET /ready", False, error=str(e))
        return False

def test_about() -> bool:
    """Test about endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/about", timeout=TIMEOUT)
        if response.status_code == 200:
            data = response.json()
            print_status("GET /about", True, data)
            return True
        else:
            print_status("GET /about", False, error=f"Status {response.status_code}")
            return False
    except Exception as e:
        print_status("GET /about", False, error=str(e))
        return False

def test_pricing() -> bool:
    """Test pricing endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/pricing", timeout=TIMEOUT)
        if response.status_code == 200:
            data = response.json()
            print_status("GET /pricing", True, data)
            return True
        else:
            print_status("GET /pricing", False, error=f"Status {response.status_code}")
            return False
    except Exception as e:
        print_status("GET /pricing", False, error=str(e))
        return False

def test_docs() -> bool:
    """Test API docs endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/docs", timeout=TIMEOUT)
        if response.status_code == 200:
            print_status("GET /docs", True, {"message": "Swagger UI available"})
            return True
        else:
            print_status("GET /docs", False, error=f"Status {response.status_code}")
            return False
    except Exception as e:
        print_status("GET /docs", False, error=str(e))
        return False

def main():
    """Run all tests"""
    print("=" * 70)
    print("🧪 VoltStream API Test Suite (Updated Endpoints)")
    print("=" * 70)
    print(f"Testing: {BASE_URL}")
    print(f"Timeout: {TIMEOUT}s\n")
    
    # Check if server is reachable
    try:
        requests.get(f"{BASE_URL}/health", timeout=2)
    except:
        print("❌ ERROR: Cannot connect to API server")
        print(f"   Make sure the server is running on {BASE_URL}")
        print("\n   Run from backend/ directory:")
        print("   python -m uvicorn main:app --host 0.0.0.0 --port 8080")
        sys.exit(1)
    
    # Run tests
    results = {
        "health": test_health(),
        "ready": test_ready(),
        "about": test_about(),
        "pricing": test_pricing(),
        "docs": test_docs(),
    }
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 Test Summary")
    print("=" * 70)
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    print(f"Passed: {passed}/{total}")
    
    for endpoint, result in results.items():
        status = "✅" if result else "❌"
        print(f"  {status} {endpoint}")
    
    if passed == total:
        print("\n🎉 All tests passed! Application is ready.")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
