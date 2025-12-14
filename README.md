# RepoGuardian AI

**RepoGuardian AI** is an intelligent dashboard that autonomously analyzes GitHub repositories for security risks, code quality issues, and PR reviews using local AI agents.

![Dashboard Preview](frontend/public/window.svg)

## 🚀 Features

-   **AI-Powered Analysis**: Uses local LLMs (Ollama) to review Issues and Pull Requests.
-   **Security & Quality Audit**: Identifies high/medium/low risk changes automatically.
-   **Modern Dashboard**: A premium, dark-mode accessible UI built with Next.js 14.
-   **Automated Agents**:
    -   `Issue Agent`: Classifies issues (Bug/Feature) and summarizes them.
    -   `PR Agent`: Analyzing diffs, detects risks, and suggests improvements.

## 🛠️ Tech Stack

-   **Frontend**: Next.js 16 (Turbopack), TypeScript, Tailwind CSS v4, Framer Motion.
-   **Backend**: Python, Flask.
-   **AI Engine**: Ollama (Mistral/Llama locally) or Groq/OpenAI (Cloud).

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

1.  **Node.js** (v18+)
2.  **Python** (v3.10+)
3.  **Ollama** (for local AI) -> [Download Here](https://ollama.com/)
    -   Run `ollama pull mistral` to get the model.
4.  **Git**

## ⚡ Quick Start / Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/PritamMishra065/repoguardian-ai.git
cd repoguardian-ai
```

### 2. Backend Setup (Python)
The backend runs the AI agents.

```bash
# Create virtual environment
python -m venv .venv

# Activate it
# Windows:
.venv\Scripts\Activate
# Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set GitHub Token (Required for fetching repo data)
# Windows (PowerShell):
$env:GITHUB_TOKEN="your_github_token_here"
# Mac/Linux:
export GITHUB_TOKEN="your_github_token_here"

# Start Server
python app.py
```
> The backend will run on `http://localhost:5000`.

### 3. Frontend Setup (Next.js)
The frontend displays the dashboard.

```bash
# Open new terminal and go to frontend folder
cd frontend

# Install dependencies
npm install

# Start Development Server
npm run dev
```
> The frontend will run on `http://localhost:3000`.

## 🖥️ Usage

1.  Open `http://localhost:3000`.
2.  Enter a public GitHub repository name (e.g., `facebook/react` or `your-username/repo`).
3.  Click **Analyze**.
4.  View the AI-generated report for top Issues and PRs.

## 📦 Deployment

-   **Frontend**: Deploy to Vercel (Import `frontend` folder).
-   **Backend**: 
    -   **Local**: Keep running on your machine (connect via ngrok if needed).
    -   **Cloud**: Requires switching from Ollama to Groq/OpenAI for deployment on Render/Railway.

See `DEPLOYMENT_GUIDE.md` (if available) for more details.
