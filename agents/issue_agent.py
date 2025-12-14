from ollama_client import ask_ai

def analyze_issue(issue):
    prompt = f"""
Classify the GitHub issue:

Title: {issue.title}
Body: {issue.body}

Return:
Type (Bug / Feature / Question)
Short Summary
"""
    return ask_ai(prompt)
def raise_issue(repo, title, body):
    repo.create_issue(
        title=title,
        body=body,
        labels=["ai-review", "needs-fix"]
    )