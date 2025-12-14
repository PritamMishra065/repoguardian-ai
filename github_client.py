import os
from github import Github

def get_repo(repo_url):
    token = os.getenv("GITHUB_TOKEN")
    g = Github(token)
    repo_name = repo_url.replace("https://github.com/", "")
    return g.get_repo(repo_name)
