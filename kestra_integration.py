"""
Kestra workflow integration helper module.
This module provides functions that can be called from Kestra workflows.
"""
import os
from github import Github
from agents.pr_agent import analyze_pr
from agents.issue_agent import raise_issue

def get_pr_data(repo_owner, repo_name, pr_number):
    """
    Fetch PR data from GitHub for Kestra workflow.
    
    Args:
        repo_owner: Repository owner/organization
        repo_name: Repository name
        pr_number: Pull request number
        
    Returns:
        dict: PR data including title, body, diff, etc.
    """
    token = os.getenv("GITHUB_TOKEN")
    if not token:
        raise ValueError("GITHUB_TOKEN environment variable is required")
    
    g = Github(token)
    repo = g.get_repo(f"{repo_owner}/{repo_name}")
    pr = repo.get_pull(pr_number)
    
    # Get diff from PR files
    files = pr.get_files()
    diff = ""
    if files.totalCount > 0:
        # Combine all file patches
        diffs = []
        for file in files:
            if file.patch:
                diffs.append(f"--- {file.filename}\n{file.patch}")
        diff = "\n\n".join(diffs)
    
    return {
        "pr": pr,
        "title": pr.title,
        "body": pr.body or "",
        "diff": diff,
        "repo": repo
    }

def analyze_pr_for_kestra(repo_owner, repo_name, pr_number):
    """
    Analyze a PR for Kestra workflow.
    This function is designed to be called from Kestra Python scripts.
    
    Args:
        repo_owner: Repository owner/organization
        repo_name: Repository name
        pr_number: Pull request number
        
    Returns:
        str: Analysis result from PR agent
    """
    pr_data = get_pr_data(repo_owner, repo_name, pr_number)
    analysis = analyze_pr(pr_data["pr"], pr_data["diff"])
    return analysis

def make_decision(pr_analysis):
    """
    Decision agent for Kestra workflow.
    Determines action based on PR analysis.
    
    Args:
        pr_analysis: Analysis result from PR agent
        
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

def execute_decision(decision, repo_owner, repo_name, pr_number, pr_analysis):
    """
    Execute the decision made by the decision agent.
    
    Args:
        decision: Decision from make_decision()
        repo_owner: Repository owner/organization
        repo_name: Repository name
        pr_number: Pull request number
        pr_analysis: Original PR analysis
        
    Returns:
        str: Result of the action taken
    """
    if decision == "RAISE_ISSUE":
        pr_data = get_pr_data(repo_owner, repo_name, pr_number)
        repo = pr_data["repo"]
        pr = pr_data["pr"]
        
        issue_title = f"AI Review: Issues found in PR #{pr_number}"
        issue_body = f"""
This issue was automatically created by RepoGuardian AI based on PR analysis.

**PR:** #{pr_number} - {pr.title}
**Analysis:**
{pr_analysis}

Please review and address the issues identified.
        """
        
        raise_issue(repo, issue_title, issue_body)
        return f"Issue created for PR #{pr_number}"
    
    elif decision == "CLINE_FIX":
        # For Cline integration, you would call Cline API here
        # This is a placeholder for future Cline integration
        return f"CLINE_FIX action triggered for PR #{pr_number} (integration pending)"
    
    else:
        return f"No action needed for PR #{pr_number}"

