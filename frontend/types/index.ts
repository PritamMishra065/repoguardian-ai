export interface AnalysisItem {
    type?: string;
    title?: string;
    summary?: string;
    risk_level?: string;
    problems?: string;
    suggestions?: string;
    short_summary?: string;
}

export interface DashboardData {
    repo: string;
    issues: AnalysisItem[];
    prs: AnalysisItem[];
    summary: string;
}
