export type SignalPost = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  summary: string;
  contentMarkdown?: string | null;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  readingMinutes: number;
  category: string;
  tags: string[];
  signalScore: number;
  body: string[];
};

export type TimelineEvent = {
  month: string;
  keywords: string[];
};

export const posts: SignalPost[] = [
  {
    slug: "agentic-ai-workflows",
    title: "에이전틱 AI 워크플로우가 제품 개발 방식을 바꾸는 이유",
    excerpt:
      "AI가 단순 응답 도구에서 계획, 실행, 검증까지 담당하는 작업 계층으로 이동하고 있습니다.",
    summary:
      "에이전트형 AI는 코드 작성, 리서치, 운영 자동화에서 반복 업무를 줄이고 제품 팀의 의사결정 속도를 높이는 방향으로 확산되고 있습니다.",
    source: "AI Engineering Weekly",
    sourceUrl: "https://example.com/agentic-ai-workflows",
    publishedAt: "2026-04-29",
    readingMinutes: 6,
    category: "Agentic AI",
    tags: ["Agents", "Workflow", "LLM"],
    signalScore: 94,
    body: [
      "에이전틱 AI는 하나의 프롬프트에 답하는 수준을 넘어 목표를 분해하고 필요한 도구를 호출하며 결과를 검증하는 흐름으로 발전하고 있습니다.",
      "초기에는 개발자 도구와 리서치 자동화에서 빠르게 확산되고 있으며, 서비스 내부 운영 도구에도 같은 패턴이 적용되고 있습니다.",
      "시그널로그는 이런 변화를 단발 뉴스가 아니라 누적되는 기술 흐름으로 기록합니다.",
    ],
  },
  {
    slug: "mcp-as-agent-infrastructure",
    title: "MCP는 왜 에이전트 시대의 연결 계층으로 주목받나",
    excerpt:
      "모델이 외부 도구와 데이터를 안정적으로 다루기 위한 표준 인터페이스가 중요해지고 있습니다.",
    summary:
      "MCP는 AI 앱이 파일, 데이터베이스, 외부 서비스에 접근하는 방식을 표준화하며 에이전트 생태계의 기반 계층으로 부상하고 있습니다.",
    source: "Protocol Notes",
    sourceUrl: "https://example.com/mcp-agent-infra",
    publishedAt: "2026-04-28",
    readingMinutes: 5,
    category: "Infrastructure",
    tags: ["MCP", "Tools", "Protocol"],
    signalScore: 89,
    body: [
      "AI 서비스가 단순 채팅을 넘어 실제 작업을 처리하려면 외부 시스템과의 안정적인 연결이 필요합니다.",
      "MCP는 도구 호출, 리소스 접근, 컨텍스트 전달을 일관된 방식으로 묶어 에이전트 개발 복잡도를 낮춥니다.",
      "앞으로는 모델 성능뿐 아니라 어떤 도구 생태계와 연결되는지가 제품 경쟁력의 중요한 기준이 될 가능성이 큽니다.",
    ],
  },
  {
    slug: "react-native-hermes-history",
    title: "Hermes가 React Native 성능 이야기에서 갖는 의미",
    excerpt:
      "모바일 런타임 최적화는 사용자 경험뿐 아니라 크로스플랫폼 개발 전략에도 영향을 줬습니다.",
    summary:
      "Hermes는 React Native 앱의 시작 시간과 메모리 사용량을 개선하며 모바일 JavaScript 런타임 경쟁의 중요한 기준점이 됐습니다.",
    source: "Mobile Runtime Review",
    sourceUrl: "https://example.com/hermes-react-native",
    publishedAt: "2026-04-27",
    readingMinutes: 4,
    category: "Mobile",
    tags: ["React Native", "Hermes", "Runtime"],
    signalScore: 82,
    body: [
      "Hermes는 React Native 앱을 더 빠르게 시작하고 더 적은 메모리로 실행하기 위해 설계된 JavaScript 엔진입니다.",
      "이 변화는 크로스플랫폼 앱에서도 런타임 선택과 번들 최적화가 제품 품질에 직접 연결된다는 점을 보여줬습니다.",
      "기술 히스토리 관점에서는 프레임워크 자체보다 실행 계층이 주목받기 시작한 사례로 볼 수 있습니다.",
    ],
  },
  {
    slug: "vercel-ai-sdk-product-patterns",
    title: "Vercel AI SDK가 AI 앱 개발 패턴을 단순하게 만든 지점",
    excerpt:
      "스트리밍 응답, 도구 호출, 구조화 출력이 프론트엔드 개발 흐름 안으로 들어오고 있습니다.",
    summary:
      "Vercel AI SDK는 모델 호출과 UI 스트리밍을 앱 개발자가 다루기 쉬운 형태로 추상화하며 AI 네이티브 제품 개발의 기본 도구로 자리 잡고 있습니다.",
    source: "Frontend AI Notes",
    sourceUrl: "https://example.com/vercel-ai-sdk-patterns",
    publishedAt: "2026-04-26",
    readingMinutes: 5,
    category: "Frontend",
    tags: ["AI SDK", "Streaming", "React"],
    signalScore: 78,
    body: [
      "AI 기능은 더 이상 백엔드 API 호출 하나로 끝나지 않고, 응답이 생성되는 동안의 UI 상태와 사용자 피드백까지 함께 설계해야 합니다.",
      "Vercel AI SDK는 스트리밍 텍스트, 도구 호출, 구조화 응답을 React 기반 앱에서 다루기 쉽게 만들며 구현 복잡도를 낮춥니다.",
      "제품 관점에서는 모델 자체보다 모델 출력을 어떤 인터페이스로 전달하는지가 점점 더 중요해지고 있습니다.",
    ],
  },
  {
    slug: "rag-stack-moving-beyond-vector-search",
    title: "RAG 스택은 단순 벡터 검색을 넘어 어디로 가고 있나",
    excerpt:
      "검색 품질을 높이기 위해 재랭킹, 쿼리 변환, 평가 파이프라인이 함께 중요해지고 있습니다.",
    summary:
      "초기 RAG가 벡터DB 도입에 집중했다면, 최근에는 검색 결과 평가와 재랭킹, 도메인별 컨텍스트 조립 방식이 핵심 차별점으로 이동하고 있습니다.",
    source: "Retrieval Systems Digest",
    sourceUrl: "https://example.com/rag-beyond-vector-search",
    publishedAt: "2026-04-25",
    readingMinutes: 7,
    category: "RAG",
    tags: ["RAG", "Vector DB", "Rerank"],
    signalScore: 76,
    body: [
      "RAG는 모델이 최신 정보와 사내 지식을 활용하게 만드는 대표적인 패턴으로 자리 잡았습니다.",
      "하지만 벡터 검색만 붙이는 방식은 긴 문서, 혼합 데이터, 도메인 특화 질문에서 품질 한계가 빠르게 드러납니다.",
      "최근에는 검색 품질을 측정하고 개선하는 평가 루프가 RAG 시스템의 핵심 운영 요소로 떠오르고 있습니다.",
    ],
  },
  {
    slug: "open-source-models-local-first",
    title: "오픈소스 모델 확산이 로컬 우선 AI 제품에 주는 의미",
    excerpt:
      "더 작은 모델과 로컬 추론 환경이 개인정보, 비용, 지연시간 문제를 동시에 건드리고 있습니다.",
    summary:
      "오픈소스 모델 생태계가 성숙하면서 모든 AI 기능을 클라우드 모델에 의존하지 않고, 로컬 추론과 서버 모델을 조합하는 제품 전략이 늘고 있습니다.",
    source: "Model Operations Brief",
    sourceUrl: "https://example.com/local-first-open-models",
    publishedAt: "2026-04-24",
    readingMinutes: 6,
    category: "Models",
    tags: ["Open Source", "Local AI", "Inference"],
    signalScore: 74,
    body: [
      "오픈소스 모델은 비용과 배포 통제권 측면에서 AI 제품 팀에게 새로운 선택지를 제공합니다.",
      "특히 개인정보가 중요한 작업이나 낮은 지연시간이 필요한 기능은 로컬 추론과 잘 맞습니다.",
      "앞으로는 클라우드 대형 모델과 로컬 소형 모델을 상황에 따라 조합하는 하이브리드 구조가 더 흔해질 가능성이 큽니다.",
    ],
  },
];

export const timelineEvents: TimelineEvent[] = [
  {
    month: "2026.01",
    keywords: ["Transformer", "RAG", "Vector DB"],
  },
  {
    month: "2026.02",
    keywords: ["MCP", "Agents", "Workflow"],
  },
  {
    month: "2026.03",
    keywords: ["Hermes", "React Native", "Runtime"],
  },
  {
    month: "2026.04",
    keywords: ["Agentic AI", "Vercel AI SDK", "Local AI"],
  },
];

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}
