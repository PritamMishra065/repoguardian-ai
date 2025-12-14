from ollama_client import ask_ai

def summarize_activity(issues, prs):
    prompt = f"""
Summarize repository activity:

Issues:
{issues}

PRs:
{prs}

Give a short daily summary.
"""
    return ask_ai(prompt)
