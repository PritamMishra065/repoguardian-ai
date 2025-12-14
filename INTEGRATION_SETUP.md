# Integration Setup Guide

This guide explains how to integrate Kestra workflows and CodeRabbit with RepoGuardian AI.

## CodeRabbit Integration

CodeRabbit is configured via `.coderabbit.yaml` in the repository root. The current configuration:

```yaml
reviews:
  auto_review: true
  comment_level: pr
  suggestions: true
```

### Setup Steps:
1. Install CodeRabbit GitHub App in your repository
2. The `.coderabbit.yaml` file should be in the repository root (already configured)
3. CodeRabbit will automatically review PRs based on the configuration

## Kestra Workflow Integration

The Kestra workflow automatically analyzes PRs when they are opened or updated.

**Available workflow files:**
- `repoguardian-pr.yml` - Two-task version (analyze → decision)
- `repoguardian-pr-simple.yml` - Single-task version (all-in-one, recommended for simplicity)

### Setup Steps:

1. **Install Kestra**: Follow the [Kestra installation guide](https://kestra.io/docs/getting-started/installation)

2. **Configure GitHub Token**:
   ```bash
   export GITHUB_TOKEN=your_github_token_here
   ```

3. **Set Repository Variable in Kestra**:
   - Go to Kestra UI → Variables
   - Create a variable named `github_repository` with value: `owner/repo-name`
   - Or modify the workflow file to use a specific repository

4. **Deploy the Workflow**:
   - Upload `repoguardian-pr.yml` to your Kestra instance
   - The workflow will automatically trigger on PR events

5. **Workflow Behavior**:
   - When a PR is opened or updated, the workflow:
     1. Analyzes the PR using the PR agent
     2. Makes a decision based on risk level (HIGH/MEDIUM/LOW)
     3. Executes actions:
        - **HIGH risk**: Triggers CLINE_FIX (placeholder for Cline integration)
        - **MEDIUM risk**: Creates a GitHub issue with findings
        - **LOW risk**: No action

### Alternative: Use Flask API Endpoint

Instead of running the workflow directly, you can call the Flask API endpoint:

```bash
curl -X POST http://localhost:5000/kestra/pr-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "repo_owner": "owner",
    "repo_name": "repo",
    "pr_number": 123
  }'
```

## Environment Variables

Required environment variables:
- `GITHUB_TOKEN`: GitHub personal access token with repo permissions

Optional:
- `OLLAMA_HOST`: Defaults to `http://localhost:11434` (for Ollama client)

## Testing the Integration

1. **Test CodeRabbit**: Open a PR and verify CodeRabbit comments appear
2. **Test Kestra Workflow**: 
   - Create a test PR
   - Check Kestra execution logs
   - Verify the workflow completes successfully
3. **Test Flask API**: Use the `/kestra/pr-analysis` endpoint with test data

