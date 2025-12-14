from ollama_client import ask_ai

def analyze_pr(pr, diff):
    prompt = f"""
Review this PR:

Title: {pr.title}
Description: {pr.body}

Diff:
{diff}

Return:
Risk Level (LOW / MEDIUM / HIGH)
Problems
Suggestions
"""
    return ask_ai(prompt)
