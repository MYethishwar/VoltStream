# evaluate.py — run this once to generate your evaluation report
import requests
import json
import csv
from datetime import datetime

BASE_URL = "https://voltstream-api-536159688445.us-east5.run.app"

# ── Auto-login to get a real token ────────────────────────────────────────────
def get_token() -> str:
    response = requests.post(
        f"{BASE_URL}/api/auth/login",   # ← fixed path
        json={
            "email": "apple",   # ← your actual email
            "password": "apple"   # ← your actual password
        }
    )
    data = response.json()
    token = data.get("access_token") or data.get("token")
    if not token:
        raise Exception(f"Login failed: {data}")
    print(f"✅ Logged in successfully")
    return token
TOKEN = get_token()

HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# ... rest of your file unchanged
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# ── 15 test questions covering all agents ──────────────────────────────────────
TEST_CASES = [
    # Energy pipeline questions (5)
    {"id": 1,  "category": "energy",  "expected_tool": "get_usage_history",  "question": "which device in my home consumes the most energy?"},
    {"id": 2,  "category": "energy",  "expected_tool": "get_peak_hours",     "question": "what are my peak usage hours this week?"},
    {"id": 3,  "category": "energy",  "expected_tool": "get_smart_schedule", "question": "suggest an optimized schedule to reduce my electricity bill"},
    {"id": 4,  "category": "energy",  "expected_tool": "get_usage_history",  "question": "give me a full energy cost breakdown for the last 7 days"},
    {"id": 5,  "category": "energy",  "expected_tool": "get_usage_history",  "question": "how much is my AC costing me per week?"},

    # RAG knowledge questions (4)
    {"id": 6,  "category": "rag",     "expected_tool": "rag_energy_search",  "question": "what are the best practices for reducing AC energy consumption?"},
    {"id": 7,  "category": "rag",     "expected_tool": "rag_energy_search",  "question": "what is the recommended wattage for home appliances?"},
    {"id": 8,  "category": "rag",     "expected_tool": "rag_energy_search",  "question": "how do smart home devices impact energy bills?"},
    {"id": 9,  "category": "rag",     "expected_tool": "rag_energy_search",  "question": "what is the ideal AC temperature to save electricity?"},

    # Device control questions (3)
    {"id": 10, "category": "device",  "expected_tool": "toggle_device",      "question": "turn off the AC"},
    {"id": 11, "category": "device",  "expected_tool": "get_device_status",  "question": "what is the current status of my bedroom fan?"},
    {"id": 12, "category": "device",  "expected_tool": "list_devices",       "question": "list all my devices"},

    # Bulk operations (2)
    {"id": 13, "category": "bulk",    "expected_tool": "preview_bulk_toggle","question": "turn off all fans in the house"},
    {"id": 14, "category": "bulk",    "expected_tool": "preview_bulk_toggle","question": "switch off all lights"},

    # Edge cases (1)
    {"id": 15, "category": "edge",    "expected_tool": "get_usage_history",  "question": "analyze my energy consumption and give full recommendations"},
]


def call_agent(question: str) -> dict:
    response = requests.post(
        f"{BASE_URL}/api/v1/agent",
        headers=HEADERS,
        json={"message": question}
    )
    return response.json()


def check_tool_called(steps: list, expected_tool: str) -> bool:
    """Check if the expected tool was called in agent steps."""
    for step in steps:
        if step.get("step") == "tool_call" and step.get("tool") == expected_tool:
            return True
    return False


def extract_eval_score(reply: str) -> dict:
    """
    Parse evaluation score from reply if evaluation_agent output leaks,
    otherwise return N/A for non-energy questions.
    """
    score = {"faithfulness": "N/A", "relevance": "N/A", "result": "N/A"}
    if "Faithfulness:" in reply:
        for line in reply.split("\n"):
            if "Faithfulness:" in line:
                score["faithfulness"] = line.split(":")[-1].strip()
            if "Relevance:" in line:
                score["relevance"] = line.split(":")[-1].strip()
            if "Result:" in line:
                score["result"] = line.split(":")[-1].strip()
    return score


def run_evaluation():
    print("🚀 Starting VoltStream Evaluation...")
    print(f"📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 80)

    results = []

    for case in TEST_CASES:
        print(f"\n[{case['id']}/15] {case['question']}")

        try:
            response = call_agent(case["question"])
            reply = response.get("reply", "")
            steps = response.get("steps", [])

            tool_called = check_tool_called(steps, case["expected_tool"])
            tool_accuracy = "✅ PASS" if tool_called else "❌ FAIL"

            # find actual tools called
            actual_tools = [
                s["tool"] for s in steps if s.get("step") == "tool_call"
            ]

            # find agents involved
            agents_used = [
                s["agent"] for s in steps if s.get("step") == "agent_handoff"
            ]

            result = {
                "id": case["id"],
                "category": case["category"],
                "question": case["question"],
                "expected_tool": case["expected_tool"],
                "actual_tools": ", ".join(actual_tools) if actual_tools else "none",
                "tool_accuracy": tool_accuracy,
                "agents_used": ", ".join(agents_used) if agents_used else "none",
                "reply_preview": reply[:150].replace("\n", " "),
                "full_reply": reply,
            }

            results.append(result)

            print(f"   Tool Accuracy : {tool_accuracy}")
            print(f"   Tools Called  : {actual_tools}")
            print(f"   Agents Used   : {agents_used}")
            print(f"   Reply Preview : {reply[:100]}...")

        except Exception as e:
            print(f"   ❌ ERROR: {e}")
            results.append({
                "id": case["id"],
                "category": case["category"],
                "question": case["question"],
                "expected_tool": case["expected_tool"],
                "actual_tools": "ERROR",
                "tool_accuracy": "❌ ERROR",
                "agents_used": "ERROR",
                "reply_preview": str(e),
                "full_reply": str(e),
            })

    # ── Save CSV report ────────────────────────────────────────────────────────
    csv_file = f"evaluation_report_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "id", "category", "question", "expected_tool",
            "actual_tools", "tool_accuracy", "agents_used", "reply_preview"
        ])
        writer.writeheader()
        for r in results:
            writer.writerow({k: v for k, v in r.items() if k != "full_reply"})

    # ── Save full JSON report ──────────────────────────────────────────────────
    json_file = f"evaluation_report_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    # ── Print summary ──────────────────────────────────────────────────────────
    passed = sum(1 for r in results if "PASS" in r["tool_accuracy"])
    failed = sum(1 for r in results if "FAIL" in r["tool_accuracy"])
    errors = sum(1 for r in results if "ERROR" in r["tool_accuracy"])

    print("\n" + "=" * 80)
    print("📊 EVALUATION SUMMARY")
    print("=" * 80)
    print(f"Total Questions  : 15")
    print(f"✅ Tool Accuracy PASS : {passed}")
    print(f"❌ Tool Accuracy FAIL : {failed}")
    print(f"💥 Errors            : {errors}")
    print(f"📈 Accuracy Score    : {passed}/15 ({(passed/15)*100:.1f}%)")
    print(f"\n📄 CSV Report  saved: {csv_file}")
    print(f"📄 JSON Report saved: {json_file}")
    print("=" * 80)


if __name__ == "__main__":
    run_evaluation()