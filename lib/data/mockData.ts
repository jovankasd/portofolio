export interface ProjectItem {
  id: string;
  title: string;
  summary: string;
  description: string;
  thumbnail_url: string;
  live_url?: string;
  github_url: string;
  ai_tags: string[];
  tech_stack: string[];
  sort_order: number;
  is_featured: boolean;
}

export interface CredentialItem {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  cert_image_url: string;
  proof_image_url?: string;
  verification_url?: string;
  category: "certificate" | "competition";
  sort_order: number;
}

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "proj-01",
    title: "Autonomous Agent Orchestrator",
    summary: "Multi-agent runtime framework for asynchronous task decomposition, tool dispatch, and verification loops.",
    description: "Designed a deterministic orchestration engine capable of directing specialized subagents across isolated sandboxes. Features dynamic context compaction and structured JSON validation.",
    thumbnail_url: "/projects/agent-orchestrator.svg",
    live_url: "https://demo.ai-orchestrator.internal",
    github_url: "https://github.com/example/autonomous-orchestrator",
    ai_tags: ["Multi-Agent Architecture", "Tool Calling", "Autonomous Loops"],
    tech_stack: ["TypeScript", "Next.js", "Python", "LangGraph", "FastAPI"],
    sort_order: 1,
    is_featured: true,
  },
  {
    id: "proj-02",
    title: "GraphRAG Semantic Knowledge Engine",
    summary: "Knowledge graph ingestion pipeline turning unstructured technical dossiers into queryable topological subgraphs.",
    description: "Built with tree-sitter AST extraction and community clustering (Leiden algorithm). Enables sub-second entity traversal and semantic context injection without repetitive re-indexing.",
    thumbnail_url: "/projects/graphrag-engine.svg",
    live_url: "https://graph.knowledge-dossier.internal",
    github_url: "https://github.com/example/graphrag-engine",
    ai_tags: ["Knowledge Graphs", "RAG Pipelines", "AST Parsing"],
    tech_stack: ["Python", "NetworkX", "Tree-Sitter", "PostgreSQL", "Next.js"],
    sort_order: 2,
    is_featured: true,
  },
  {
    id: "proj-03",
    title: "Deterministic State Machine Evaluator",
    summary: "Policy evaluation engine providing runtime guardrails and schema compliance for LLM outputs.",
    description: "Enforces strict type safety and programmatic invariant checks before API execution, stopping hallucinated payloads and unauthorized state mutations in real time.",
    thumbnail_url: "/projects/state-evaluator.svg",
    github_url: "https://github.com/example/state-machine-evaluator",
    ai_tags: ["Guardrails", "Schema Validation", "Safe Execution"],
    tech_stack: ["TypeScript", "Zod", "Node.js", "Jest"],
    sort_order: 3,
    is_featured: false,
  },
];

export const INITIAL_CREDENTIALS: CredentialItem[] = [
  {
    id: "cred-01",
    title: "Certified AI Systems Architect",
    issuer: "Cloud & AI Architecture Council",
    issue_date: "2025",
    cert_image_url: "/credentials/cert-ai-architect.svg",
    verification_url: "https://verify.credentials.example/cert-01",
    category: "certificate",
    sort_order: 1,
  },
  {
    id: "cred-02",
    title: "National AI Autonomous Agents Hackathon Champion",
    issuer: "Tech Innovation Guild",
    issue_date: "2025",
    cert_image_url: "/credentials/cert-hackathon.svg",
    proof_image_url: "/credentials/proof-hackathon.svg",
    verification_url: "https://verify.credentials.example/hackathon-2025",
    category: "competition",
    sort_order: 2,
  },
  {
    id: "cred-03",
    title: "Distributed Systems & LLM Engineering Specialization",
    issuer: "Advanced Computing Institute",
    issue_date: "2024",
    cert_image_url: "/credentials/cert-distributed.svg",
    verification_url: "https://verify.credentials.example/specialization-2024",
    category: "certificate",
    sort_order: 3,
  },
];

export const DOSSIER_PROFILE = {
  codename: "Obsidian & Atmosphere",
  persona: "AI Orchestrator & Agentic AI Engineer",
  status: "ONLINE",
  location: "UTC+7",
  bio: "Saya merancang sistem AI dan perangkat lunak yang membantu orang menyelesaikan pekerjaan nyata, dari fondasi data hingga pengalaman yang mereka lihat di layar.",
  cv_filename: "Dossier_AI_Orchestrator_CV.pdf",
  socials: [
    { label: "GITHUB", address: "github.com/developer", url: "https://github.com" },
    { label: "LINKEDIN", address: "linkedin.com/in/ai-orchestrator", url: "https://linkedin.com" },
    { label: "EMAIL", address: "architect@obsidian-atmosphere.internal", url: "mailto:architect@obsidian-atmosphere.internal" },
  ],
};
