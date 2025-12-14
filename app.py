from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from github_client import get_repo
from agents.issue_agent import analyze_issue
from agents.pr_agent import analyze_pr
from agents.summary_agent import summarize_activity
from itertools import islice  # ✅ Import islice for safe iteration

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    repo_name = request.json.get("repo") # Safe .get() to avoid crashing if key missing
    if not repo_name:
        return jsonify({"error": "Repository name is required"}), 400

    repo = get_repo(repo_name)

    # ✅ FIXED: Use islice instead of [:5] to prevent IndexError
    issues = []
    for issue in islice(repo.get_issues(state="open"), 5):
        issues.append(analyze_issue(issue))

    # ✅ FIXED: Use islice for PRs and add safety check for diffs
    prs = []
    for pr in islice(repo.get_pulls(state="open"), 3):
        # Handle cases where a PR has no files or no patch data
        files = pr.get_files()
        diff = ""
        if files.totalCount > 0:
            # Get the patch of the first file, default to empty string if None
            diff = files[0].patch or ""
            
        prs.append(analyze_pr(pr, diff))

    summary = summarize_activity(issues, prs)

    return jsonify({
        "issues": issues,
        "prs": prs,
        "summary": summary
    })
def decision_agent(pr_analysis):
    """
    Decision agent that determines action based on PR analysis.
    
    Args:
        pr_analysis: Analysis result from PR agent (string)
        
    Returns:
        str: Decision (CLINE_FIX, RAISE_ISSUE, or NO_ACTION)
    """
    if not pr_analysis:
        return "NO_ACTION"
    
    analysis_upper = str(pr_analysis).upper()
    if "HIGH" in analysis_upper:
        return "CLINE_FIX"
    elif "MEDIUM" in analysis_upper:
        return "RAISE_ISSUE"
    else:
        return "NO_ACTION"

@app.route("/kestra/pr-analysis", methods=["POST"])
def kestra_pr_analysis():
    """
    Endpoint for Kestra workflow to trigger PR analysis.
    Can be used as an alternative to direct Python script execution.
    """
    data = request.json
    repo_owner = data.get("repo_owner")
    repo_name = data.get("repo_name")
    pr_number = data.get("pr_number")
    
    if not all([repo_owner, repo_name, pr_number]):
        return jsonify({"error": "repo_owner, repo_name, and pr_number are required"}), 400
    
    try:
        from kestra_integration import analyze_pr_for_kestra, make_decision, execute_decision
        
        # Analyze PR
        analysis = analyze_pr_for_kestra(repo_owner, repo_name, pr_number)
        
        # Make decision
        decision = make_decision(analysis)
        
        # Execute decision
        result = execute_decision(decision, repo_owner, repo_name, pr_number, analysis)
        
        return jsonify({
            "analysis": analysis,
            "decision": decision,
            "result": result
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == "__main__":
    app.run(debug=True) # ✅ debug=True helps you see errors in the browser