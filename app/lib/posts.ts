export type SignalPost = {
  slug: string;
  title: string;
  excerpt: string;
  summary: string;
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
  year: string;
  title: string;
  description: string;
  tags: string[];
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
];

export const timelineEvents: TimelineEvent[] = [
  {
    year: "2017",
    title: "Transformer 등장",
    description: "대규모 언어 모델 시대의 기반 구조가 된 Attention 중심 아키텍처가 확산됐습니다.",
    tags: ["Transformer", "NLP"],
  },
  {
    year: "2022",
    title: "ChatGPT 대중화",
    description: "LLM이 개발자 도구를 넘어 일반 사용자 서비스의 중심 인터페이스로 올라섰습니다.",
    tags: ["ChatGPT", "Prompt"],
  },
  {
    year: "2024",
    title: "멀티모달 경쟁",
    description: "텍스트, 이미지, 음성 입력을 다루는 모델 경쟁이 제품 경험으로 연결되기 시작했습니다.",
    tags: ["Multimodal", "Realtime"],
  },
  {
    year: "2026",
    title: "에이전틱 AI 확산",
    description: "AI가 답변 생성에서 작업 실행 계층으로 이동하며 워크플로우 자동화가 핵심 주제가 됐습니다.",
    tags: ["Agents", "Automation"],
  },
];

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}
