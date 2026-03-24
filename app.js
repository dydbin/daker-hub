const FALLBACK_DATA = {
  detail: {
    slug: "aimers-8-model-lite",
    title: "Aimers 8기 : 모델 경량화 온라인 해커톤",
    sections: {
      overview: {
        summary: "제한된 평가 환경에서 모델의 성능과 추론 속도를 함께 최적화합니다.",
        teamPolicy: {
          allowSolo: true,
          maxTeamSize: 5
        }
      },
      info: {
        notice: [
          "제출 마감 이후 추가 제출은 불가합니다.",
          "평가 환경은 고정이며, 제출물은 별도 설치 없이 실행 가능해야 합니다."
        ],
        links: {
          rules: "https://example.com/public/rules/aimers8",
          faq: "https://example.com/public/faq/aimers8"
        }
      },
      eval: {
        metricName: "FinalScore",
        description: "성능과 속도를 종합한 점수(세부 산식은 규정 참고).",
        limits: {
          maxRuntimeSec: 1200,
          maxSubmissionsPerDay: 5
        }
      },
      schedule: {
        timezone: "Asia/Seoul",
        milestones: [
          { name: "리더보드 제출 마감", at: "2026-02-25T10:00:00+09:00" },
          { name: "대회 종료", at: "2026-02-26T10:00:00+09:00" }
        ]
      },
      prize: {
        items: [
          { place: "1st", amountKRW: 3000000 },
          { place: "2nd", amountKRW: 1500000 },
          { place: "3rd", amountKRW: 800000 }
        ]
      },
      teams: {
        campEnabled: true,
        listUrl: "/camp?hackathon=aimers-8-model-lite"
      },
      submit: {
        allowedArtifactTypes: ["zip"],
        submissionUrl: "/hackathons/aimers-8-model-lite#submit",
        guide: [
          "제출물은 규정에 맞는 단일 zip 파일로 업로드합니다.",
          "업로드 후 '제출' 버튼을 눌러야 리더보드에 반영됩니다."
        ]
      },
      leaderboard: {
        publicLeaderboardUrl: "/hackathons/aimers-8-model-lite#leaderboard",
        note: "Public 리더보드는 제출 마감 시점 기준으로 고정될 수 있습니다(규정 참고)."
      }
    },
    extraDetails: [
      {
        slug: "daker-handover-2026-03",
        title: "긴급 인수인계 해커톤: 명세서만 보고 구현하라",
        sections: {
          overview: {
            summary: "기능 명세서만 남기고 사라진 개발자의 문서를 기반으로 바이브 코딩을 통해 웹서비스를 구현·배포하는 해커톤입니다.",
            teamPolicy: {
              allowSolo: true,
              maxTeamSize: 5
            }
          },
          info: {
            notice: [
              "예시 자료 외 데이터는 제공되지 않습니다.",
              "더미 데이터/로컬 저장소(localStorage 등)를 활용해 구현하세요.",
              "배포 URL은 외부에서 접속 가능해야하며 심사 기간동안 접근 가능해야합니다.",
              "외부 API/외부 DB를 쓰는 경우에도 심사자가 별도 키 없이 확인 가능해야 합니다. (키가 필요한 기능은 평가에서 확인이 제한될 수 있음)"
            ],
            links: {
              rules: "https://example.com/public/rules/daker-handover-202603",
              faq: "https://example.com/public/faq/daker-handover-202603"
            }
          },
          eval: {
            metricName: "FinalScore",
            description: "참가팀/심사위원 투표 점수를 가중치로 합산한 최종 점수",
            scoreSource: "vote",
            scoreDisplay: {
              label: "투표 점수",
              breakdown: [
                { key: "participant", label: "참가자", weightPercent: 30 },
                { key: "judge", label: "심사위원", weightPercent: 70 }
              ]
            }
          },
          schedule: {
            timezone: "Asia/Seoul",
            milestones: [
              { name: "접수/기획서 제출 기간", at: "2026-03-04T10:00:00+09:00" },
              { name: "접수/기획서 제출 마감", at: "2026-03-30T10:00:00+09:00" },
              { name: "최종 웹링크 제출 마감", at: "2026-04-06T10:00:00+09:00" },
              { name: "최종 솔루션 PDF 제출 마감", at: "2026-04-13T10:00:00+09:00" },
              { name: "1차 투표평가 시작", at: "2026-04-13T12:00:00+09:00" },
              { name: "1차 투표평가 마감", at: "2026-04-17T10:00:00+09:00" },
              { name: "2차 내부평가 종료", at: "2026-04-24T23:59:00+09:00" },
              { name: "최종 결과 발표", at: "2026-04-27T10:00:00+09:00" }
            ]
          },
          teams: {
            campEnabled: true,
            listUrl: "/camp?hackathon=daker-handover-2026-03"
          },
          submit: {
            allowedArtifactTypes: ["text", "url", "pdf"],
            submissionUrl: "/hackathons/daker-handover-2026-03#submit",
            guide: [
              "기획서 → 웹링크 → PDF를 단계별로 제출합니다.",
              "배포 URL은 외부에서 접속 가능해야 하며 심사 기간 동안 접근 가능해야 합니다.",
              "PPT는 PDF로 변환하여 제출합니다."
            ],
            submissionItems: [
              { key: "plan", title: "기획서(1차 제출)", format: "text_or_url" },
              { key: "web", title: "최종 웹링크 제출", format: "url" },
              { key: "pdf", title: "최종 솔루션 PDF 제출", format: "pdf_url" }
            ]
          },
          leaderboard: {
            publicLeaderboardUrl: "/hackathons/daker-handover-2026-03#leaderboard",
            note: "아이디어 해커톤의 점수(score)는 투표 결과를 기반으로 표시됩니다."
          }
        }
      }
    ]
  },
  hackathons: [
    {
      slug: "aimers-8-model-lite",
      title: "Aimers 8기 : 모델 경량화 온라인 해커톤",
      status: "ended",
      tags: ["LLM", "Compression", "vLLM"],
      thumbnailUrl: "https://example.com/public/img/aimers8.png",
      period: {
        timezone: "Asia/Seoul",
        submissionDeadlineAt: "2026-02-25T10:00:00+09:00",
        endAt: "2026-02-26T10:00:00+09:00"
      },
      links: {
        detail: "/hackathons/aimers-8-model-lite",
        rules: "https://example.com/public/rules/aimers8",
        faq: "https://example.com/public/faq/aimers8"
      }
    },
    {
      slug: "monthly-vibe-coding-2026-02",
      title: "월간 해커톤 : 바이브 코딩 개선 AI 아이디어 공모전 (2026.02)",
      status: "ongoing",
      tags: ["Idea", "GenAI", "Workflow"],
      thumbnailUrl: "https://example.com/public/img/vibe202602.png",
      period: {
        timezone: "Asia/Seoul",
        submissionDeadlineAt: "2026-03-03T10:00:00+09:00",
        endAt: "2026-03-09T10:00:00+09:00"
      },
      links: {
        detail: "/hackathons/monthly-vibe-coding-2026-02",
        rules: "https://example.com/public/rules/vibe202602",
        faq: "https://example.com/public/faq/vibe202602"
      }
    },
    {
      slug: "daker-handover-2026-03",
      title: "긴급 인수인계 해커톤: 명세서만 보고 구현하라",
      status: "upcoming",
      tags: ["VibeCoding", "Web", "Vercel", "Handover"],
      thumbnailUrl: "https://example.com/public/img/daker-handover-202603.png",
      period: {
        timezone: "Asia/Seoul",
        submissionDeadlineAt: "2026-03-30T10:00:00+09:00",
        endAt: "2026-04-27T10:00:00+09:00"
      },
      links: {
        detail: "/hackathons/daker-handover-2026-03",
        rules: "https://example.com/public/rules/daker-handover-202603",
        faq: "https://example.com/public/faq/daker-handover-202603"
      }
    }
  ],
  leaderboard: {
    hackathonSlug: "aimers-8-model-lite",
    updatedAt: "2026-02-26T10:00:00+09:00",
    entries: [
      {
        rank: 1,
        teamName: "Team Alpha",
        score: 0.7421,
        submittedAt: "2026-02-24T21:05:00+09:00"
      },
      {
        rank: 2,
        teamName: "Team Gamma",
        score: 0.7013,
        submittedAt: "2026-02-25T09:40:00+09:00"
      }
    ],
    extraLeaderboards: [
      {
        hackathonSlug: "daker-handover-2026-03",
        updatedAt: "2026-04-17T10:00:00+09:00",
        entries: [
          {
            rank: 1,
            teamName: "404found",
            score: 87.5,
            submittedAt: "2026-04-13T09:58:00+09:00",
            scoreBreakdown: {
              participant: 82,
              judge: 90
            },
            artifacts: {
              webUrl: "https://404found.vercel.app",
              pdfUrl: "https://example.com/404found-solution.pdf",
              planTitle: "404found 기획서"
            }
          },
          {
            rank: 2,
            teamName: "LGTM",
            score: 84.2,
            submittedAt: "2026-04-13T09:40:00+09:00",
            scoreBreakdown: {
              participant: 79,
              judge: 88
            },
            artifacts: {
              webUrl: "https://lgtm-hack.vercel.app",
              pdfUrl: "https://example.com/lgtm-solution.pdf",
              planTitle: "LGTM 기획서"
            }
          }
        ]
      }
    ]
  },
  teams: [
    {
      teamCode: "T-ALPHA",
      hackathonSlug: "aimers-8-model-lite",
      name: "Team Alpha",
      isOpen: true,
      memberCount: 3,
      lookingFor: ["Backend", "ML Engineer"],
      intro: "추론 최적화/경량화 실험을 함께 진행할 팀원을 찾습니다.",
      contact: {
        type: "link",
        url: "https://open.kakao.com/o/example1"
      },
      createdAt: "2026-02-20T11:00:00+09:00"
    },
    {
      teamCode: "T-BETA",
      hackathonSlug: "monthly-vibe-coding-2026-02",
      name: "PromptRunners",
      isOpen: true,
      memberCount: 1,
      lookingFor: ["Frontend", "Designer"],
      intro: "프롬프트 품질 점수화 + 개선 가이드 UX를 기획합니다.",
      contact: {
        type: "link",
        url: "https://forms.gle/example2"
      },
      createdAt: "2026-02-18T18:30:00+09:00"
    },
    {
      teamCode: "T-HANDOVER-01",
      hackathonSlug: "daker-handover-2026-03",
      name: "404found",
      isOpen: true,
      memberCount: 3,
      lookingFor: ["Frontend", "Designer"],
      intro: "명세서 기반으로 기본 기능을 빠르게 완성하고 UX 확장을 노립니다.",
      contact: {
        type: "link",
        url: "https://open.kakao.com/o/example3"
      },
      createdAt: "2026-03-04T11:00:00+09:00"
    },
    {
      teamCode: "T-HANDOVER-02",
      hackathonSlug: "daker-handover-2026-03",
      name: "LGTM",
      isOpen: false,
      memberCount: 5,
      lookingFor: [],
      intro: "기획서-구현-문서화를 깔끔하게 맞추는 방향으로 진행합니다.",
      contact: {
        type: "link",
        url: "https://forms.gle/example4"
      },
      createdAt: "2026-03-05T09:20:00+09:00"
    }
  ]
};

const STORAGE_KEYS = {
  campTeams: "rapid-relay:camp-teams",
  teamMessages: "rapid-relay:team-messages",
  teamActions: "rapid-relay:team-actions",
  hackathonSubmissions: "rapid-relay:hackathon-submissions",
  favoriteHackathons: "rapid-relay:favorite-hackathons",
  campDraft: "rapid-relay:camp-draft",
  submitDrafts: "rapid-relay:submit-drafts"
};

const LOCAL_DB_NAME = "daker-hub-local-db";
const LOCAL_DB_STORE = "ui-state";
const LOCAL_DB_VERSION = 1;
const STORAGE_SYNC_KEY = "rapid-relay:storage-sync";
const STORAGE_SYNC_CHANNEL =
  typeof window !== "undefined" && "BroadcastChannel" in window ? new BroadcastChannel("daker-hub-state") : null;

const FEATURED_SLUG = "daker-handover-2026-03";
const PRODUCT_NAME = "Daker Hub";
const FEATURE_NAME = "Judge Preview";
const CORE_MESSAGE = "Daker Hub는 해커톤 탐색, 팀 모집, 랭킹, Judge Preview를 한 흐름으로 묶은 공개 해커톤 포털입니다.";

const PUBLIC_DISCLOSURE_RULES = [
  "내부 유저 정보",
  "유저가 비공개한 정보",
  "다른 팀의 내부 정보",
  "인증 키, 토큰, 관리자 전용 URL 같은 민감 접근 정보",
  "심사에 직접 쓰이지 않는 개인 식별 정보와 비공개 운영 메모"
];
const DISCLOSURE_COMPLIANCE_CHECKS = [
  "배포 URL은 외부에서 접속 가능해야 하며 심사 기간 동안 접근 가능해야 합니다.",
  "심사자는 별도 키 없이 주요 기능을 확인할 수 있어야 합니다.",
  "다른 팀 내부 정보, 비공개 정보, 민감 접근 정보는 화면·더미 데이터·문서 어디에도 넣지 않습니다.",
  "코드, 이미지, 폰트, 아이콘은 저작권과 라이선스를 준수한 자료만 사용합니다."
];
const EVALUATION_PHASES = [
  {
    title: "1차 평가",
    description: "최종 제출한 참가팀 및 심사위원 상호 투표평가",
    subItems: ["참가팀 가중치: 30%", "심사위원 가중치: 70%"]
  },
  {
    title: "2차 평가",
    description: "1차 투표평가 상위 10팀에 대해 내부 심사위원 정성평가(100%) 진행",
    subItems: []
  }
];
const EVALUATION_CRITERIA_ROWS = [
  {
    label: "기본 구현",
    score: 30,
    point: "웹 페이지 구현도, 데이터 기반 렌더링, 필터/정렬 동작, 빈 상태 UI"
  },
  {
    label: "확장(아이디어)",
    score: 30,
    point: "팀 고유 기능/UX 개선의 참신함·실용성, 서비스로서 가치가 드러나는 확장, 일관된 흐름"
  },
  {
    label: "완성도",
    score: 25,
    point: "사용성(동선/가독성), 안정성(오류/예외 처리), 성능(로딩/반응성), 접근성/반응형"
  },
  {
    label: "문서/설명",
    score: 15,
    point: "기획서의 명확성, PPT의 설계/구현 설명력, 실행/검증 방법(재현성)"
  }
];
const EVALUATION_TIEBREAKERS = [
  "심사위원 득표수가 많은 팀이 우선순위",
  "팀에게 부여된 투표권 중 사용하지 않은 투표수가 적을수록 우선순위",
  "산출물 최초 업로드 시간이 빠를수록 우선순위"
];

function createCampDraft(hackathonSlug = "") {
  return {
    hackathonSlug,
    name: "",
    intro: "",
    isOpen: true,
    lookingFor: "",
    contactUrl: ""
  };
}

function createSubmitDraft(hackathonSlug, teams = []) {
  return {
    hackathonSlug,
    teamCode: teams[0]?.id ?? "",
    projectTitle: "",
    teamParticipants: "",
    serviceOverview: "",
    pageComposition: "",
    systemComposition: "",
    coreFunctionSpec: "",
    userFlow: "",
    developmentPlan: "",
    checks: {
      dataRendering: false,
      filterSort: false,
      emptyState: false,
      responsive: false,
      errorHandling: false
    },
    fileNames: []
  };
}

const PERSISTED_STATE_FIELDS = {
  campTeams: {
    storageKey: STORAGE_KEYS.campTeams,
    createDefault: () => []
  },
  teamMessages: {
    storageKey: STORAGE_KEYS.teamMessages,
    createDefault: () => ({})
  },
  teamActions: {
    storageKey: STORAGE_KEYS.teamActions,
    createDefault: () => ({})
  },
  hackathonSubmissions: {
    storageKey: STORAGE_KEYS.hackathonSubmissions,
    createDefault: () => []
  },
  favoriteHackathons: {
    storageKey: STORAGE_KEYS.favoriteHackathons,
    createDefault: () => ({})
  },
  campDraft: {
    storageKey: STORAGE_KEYS.campDraft,
    createDefault: () => createCampDraft()
  },
  submitDrafts: {
    storageKey: STORAGE_KEYS.submitDrafts,
    createDefault: () => ({})
  }
};

const STORAGE_KEY_TO_FIELD = Object.fromEntries(
  Object.entries(PERSISTED_STATE_FIELDS).map(([field, config]) => [config.storageKey, field])
);

const state = {
  isLoading: true,
  loadError: null,
  routeInfo: null,
  data: null,
  usingFallback: false,
  campTeams: [],
  teamMessages: {},
  teamActions: {},
  hackathonSubmissions: [],
  favoriteHackathons: {},
  campDraft: createCampDraft(),
  submitDrafts: {},
  listFilters: {
    status: "all",
    tag: "all"
  },
  rankingPeriod: "all"
};

const app = document.getElementById("app");
const navLinks = Array.from(document.querySelectorAll("[data-link]"));
let detailNavCleanup = null;
let localDbPromise = null;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function readStorageRaw(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  } catch (error) {
    return undefined;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    return;
  }
}

function getPersistedStateDefault(field) {
  return PERSISTED_STATE_FIELDS[field]?.createDefault?.();
}

function openLocalDb() {
  if (!("indexedDB" in window)) return Promise.resolve(null);
  if (localDbPromise) return localDbPromise;

  localDbPromise = new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(LOCAL_DB_NAME, LOCAL_DB_VERSION);

      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(LOCAL_DB_STORE)) {
          request.result.createObjectStore(LOCAL_DB_STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch (error) {
      resolve(null);
    }
  });

  return localDbPromise;
}

async function readFromLocalDb(storageKey) {
  const db = await openLocalDb();
  if (!db) return undefined;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(LOCAL_DB_STORE, "readonly");
      const store = transaction.objectStore(LOCAL_DB_STORE);
      const request = store.get(storageKey);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(undefined);
    } catch (error) {
      resolve(undefined);
    }
  });
}

async function writeToLocalDb(storageKey, value) {
  const db = await openLocalDb();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(LOCAL_DB_STORE, "readwrite");
      const store = transaction.objectStore(LOCAL_DB_STORE);
      store.put(value, storageKey);
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => resolve(false);
      transaction.onabort = () => resolve(false);
    } catch (error) {
      resolve(false);
    }
  });
}

async function readPersistedValue(storageKey, fallback) {
  const dbValue = await readFromLocalDb(storageKey);
  if (dbValue !== undefined) {
    return dbValue;
  }

  const legacyValue = readStorageRaw(storageKey);
  if (legacyValue !== undefined) {
    void writeToLocalDb(storageKey, legacyValue);
    return legacyValue;
  }

  return fallback;
}

function emitPersistedStateSync(storageKey) {
  const payload = {
    storageKey,
    at: Date.now()
  };

  if (STORAGE_SYNC_CHANNEL) {
    STORAGE_SYNC_CHANNEL.postMessage(payload);
  }

  try {
    window.localStorage.setItem(STORAGE_SYNC_KEY, JSON.stringify(payload));
  } catch (error) {
    return;
  }
}

async function writePersistedValue(storageKey, value) {
  const storedInDb = await writeToLocalDb(storageKey, value);
  if (!storedInDb) {
    writeStorage(storageKey, value);
  }
  emitPersistedStateSync(storageKey);
}

async function hydratePersistedState(fields = Object.keys(PERSISTED_STATE_FIELDS)) {
  await Promise.all(
    fields.map(async (field) => {
      const config = PERSISTED_STATE_FIELDS[field];
      state[field] = await readPersistedValue(config.storageKey, getPersistedStateDefault(field));
    })
  );
}

async function loadPersistedState() {
  await hydratePersistedState();
}

function persistStateField(field) {
  const config = PERSISTED_STATE_FIELDS[field];
  if (!config) return Promise.resolve();
  return writePersistedValue(config.storageKey, state[field]);
}

function isTrackedStorageKey(key) {
  return key === STORAGE_SYNC_KEY || Boolean(STORAGE_KEY_TO_FIELD[key]);
}

async function syncPersistedStateAndRender(storageKey) {
  const field = storageKey ? STORAGE_KEY_TO_FIELD[storageKey] : null;
  const fields = field ? [field] : Object.keys(PERSISTED_STATE_FIELDS);
  await hydratePersistedState(fields);
  renderApp();
}

async function handleStorageSync(event) {
  if (event.storageArea !== window.localStorage) return;
  if (event.key && !isTrackedStorageKey(event.key)) return;

  if (event.key === STORAGE_SYNC_KEY) {
    try {
      const payload = JSON.parse(event.newValue ?? "{}");
      await syncPersistedStateAndRender(payload.storageKey);
    } catch (error) {
      await syncPersistedStateAndRender();
    }
    return;
  }

  await syncPersistedStateAndRender(event.key);
}

function handleBroadcastSync(event) {
  const storageKey = event.data?.storageKey;
  if (!storageKey || !STORAGE_KEY_TO_FIELD[storageKey]) return;
  void syncPersistedStateAndRender(storageKey);
}

async function loadJson(path, fallback) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load ${path}`);
    }
    return { data: await response.json(), fallback: false };
  } catch (error) {
    return { data: fallback, fallback: true };
  }
}

async function loadData() {
  const [detail, hackathons, leaderboard, teams] = await Promise.all([
    loadJson("data/public_hackathon_detail.json", FALLBACK_DATA.detail),
    loadJson("data/public_hackathons.json", FALLBACK_DATA.hackathons),
    loadJson("data/public_leaderboard.json", FALLBACK_DATA.leaderboard),
    loadJson("data/public_teams.json", FALLBACK_DATA.teams)
  ]);

  state.data = buildCatalog(detail.data, hackathons.data, leaderboard.data, teams.data);
  state.usingFallback = [detail, hackathons, leaderboard, teams].some((entry) => entry.fallback);

  if (!state.data.hackathons.length) {
    throw new Error("해커톤 목록 데이터가 비어 있습니다.");
  }
}

function buildCatalog(detailData, hackathonList, leaderboardData, teamsData) {
  const detailsBySlug = {};
  const leaderboardsBySlug = {};

  if (detailData?.slug && detailData.sections) {
    detailsBySlug[detailData.slug] = detailData;
  }

  if (Array.isArray(detailData?.extraDetails)) {
    detailData.extraDetails.forEach((entry) => {
      detailsBySlug[entry.slug] = entry;
    });
  }

  if (leaderboardData?.hackathonSlug && Array.isArray(leaderboardData.entries)) {
    leaderboardsBySlug[leaderboardData.hackathonSlug] = {
      hackathonSlug: leaderboardData.hackathonSlug,
      updatedAt: leaderboardData.updatedAt,
      entries: leaderboardData.entries
    };
  }

  if (Array.isArray(leaderboardData?.extraLeaderboards)) {
    leaderboardData.extraLeaderboards.forEach((entry) => {
      leaderboardsBySlug[entry.hackathonSlug] = entry;
    });
  }

  return {
    hackathons: Array.isArray(hackathonList) ? hackathonList : [],
    detailsBySlug,
    leaderboardsBySlug,
    teams: Array.isArray(teamsData) ? teamsData : []
  };
}

function parseHashRoute() {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const [pathRaw, queryRaw = ""] = raw.split("?");
  const path = pathRaw.startsWith("/") ? pathRaw : `/${pathRaw}`;
  const normalizedPath = path === "/teams" ? "/camp" : path;
  const segments = normalizedPath.split("/").filter(Boolean);
  const query = new URLSearchParams(queryRaw);

  return {
    raw,
    path: normalizedPath,
    segments,
    query
  };
}

function currentRouteKey() {
  const info = state.routeInfo;
  if (!info || info.path === "/") return "/";
  if (info.segments[0] === "hackathons" && info.segments[1]) return "/hackathons";
  return `/${info.segments[0] ?? ""}`;
}

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date(value));
}

function statusLabel(status) {
  const labels = {
    ongoing: "진행중",
    ended: "종료",
    upcoming: "예정"
  };
  return labels[status] ?? status ?? "-";
}

function formatMoney(amount) {
  if (!amount) return "정보 없음";
  return `${amount.toLocaleString("ko-KR")}원`;
}

function getHackathonBySlug(slug) {
  return state.data?.hackathons.find((item) => item.slug === slug) ?? null;
}

function getHackathonDetail(slug) {
  return state.data?.detailsBySlug[slug] ?? null;
}

function getLeaderboard(slug) {
  return state.data?.leaderboardsBySlug[slug] ?? { hackathonSlug: slug, updatedAt: null, entries: [] };
}

function getBaseTeams() {
  return (state.data?.teams ?? []).map((team) => ({
    ...team,
    id: team.teamCode,
    isLocal: false
  }));
}

function getLocalTeams() {
  return state.campTeams.map((team) => ({
    ...team,
    id: team.id,
    isLocal: true
  }));
}

function getAllTeams() {
  return [...getBaseTeams(), ...getLocalTeams()];
}

function getTeamsForHackathon(slug) {
  return getAllTeams().filter((team) => team.hackathonSlug === slug);
}

function getTeamMessages(teamId) {
  return state.teamMessages[teamId] ?? [];
}

function getHackathonStartAt(hackathon) {
  const detail = getHackathonDetail(hackathon.slug);
  return detail?.sections?.schedule?.milestones?.[0]?.at ?? null;
}

function getParticipantCount(slug) {
  return getTeamsForHackathon(slug).reduce((sum, team) => sum + (Number(team.memberCount) || 0), 0);
}

function getParticipatingHackathonSlugs() {
  const slugs = new Set();

  state.hackathonSubmissions.forEach((entry) => {
    if (entry.hackathonSlug) slugs.add(entry.hackathonSlug);
  });

  state.campTeams.forEach((team) => {
    if (team.hackathonSlug) slugs.add(team.hackathonSlug);
  });

  Object.entries(state.teamActions).forEach(([key, action]) => {
    if (action !== "accept") return;
    const [slug] = key.split(":");
    if (slug) slugs.add(slug);
  });

  return slugs;
}

function isFavoriteHackathon(slug) {
  return Boolean(state.favoriteHackathons?.[slug]);
}

function getFavoriteHackathons() {
  return (state.data?.hackathons ?? []).filter((hackathon) => isFavoriteHackathon(hackathon.slug));
}

function getFavoriteStatusSummary() {
  const favorites = getFavoriteHackathons();
  if (!favorites.length) {
    return "아직 찜한 해커톤이 없습니다.";
  }

  const counts = favorites.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    },
    { ongoing: 0, upcoming: 0, ended: 0 }
  );

  return [
    counts.ongoing ? `진행중 ${counts.ongoing}개` : "",
    counts.upcoming ? `예정 ${counts.upcoming}개` : "",
    counts.ended ? `종료 ${counts.ended}개` : ""
  ]
    .filter(Boolean)
    .join(" · ");
}

function addNameToSlugMap(bucket, slug, name) {
  if (!slug || !String(name ?? "").trim()) return;
  const current = bucket.get(slug) ?? new Set();
  current.add(String(name).trim());
  bucket.set(slug, current);
}

function getMyTeamNamesByHackathon() {
  const namesBySlug = new Map();

  state.hackathonSubmissions.forEach((entry) => {
    addNameToSlugMap(namesBySlug, entry.hackathonSlug, entry.teamName);
  });

  state.campTeams.forEach((team) => {
    addNameToSlugMap(namesBySlug, team.hackathonSlug, team.name);
  });

  Object.entries(state.teamActions).forEach(([key, action]) => {
    if (action !== "accept") return;

    const [slug, teamId] = key.split(":");
    const matchingTeam = getTeamsForHackathon(slug).find((team) => String(team.id) === String(teamId));
    addNameToSlugMap(namesBySlug, slug, matchingTeam?.name);
  });

  return namesBySlug;
}

function listAllTags() {
  return [...new Set((state.data?.hackathons ?? []).flatMap((hackathon) => hackathon.tags ?? []))].sort();
}

function qualityTone(score) {
  if (score >= 85) return { label: "제출권", className: "score--high" };
  if (score >= 65) return { label: "보강 필요", className: "score--mid" };
  return { label: "초안", className: "score--low" };
}

function renderStatusCard({ kind, title, description, actionLabel, action }) {
  return `
    <section class="status-shell">
      <article class="card status-card">
        <span class="eyebrow">${escapeHtml(kind)}</span>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(description)}</p>
        ${
          actionLabel
            ? `<button class="button" type="button" data-action="${escapeHtml(action)}">${escapeHtml(actionLabel)}</button>`
            : ""
        }
      </article>
    </section>
  `;
}

function renderInlineEmptyState(title, description) {
  return `
    <div class="empty-inline">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(description)}</p>
    </div>
  `;
}

function renderMetric(label, value) {
  return `
    <div class="metric">
      <div class="metric__label-row">
        <span>${escapeHtml(label)}</span>
        <strong>${value}</strong>
      </div>
      <div class="metric__bar"><span style="width: ${value}%"></span></div>
    </div>
  `;
}

function renderReferenceGallery() {
  return `
    <section class="grid grid-2">
      <article class="card asset-card">
        <div class="section-head">
          <span class="eyebrow">Provided Memo</span>
          <h2>기능 명세 메모</h2>
          <p>손메모 기반 요구사항을 직접 보여주고, 구현 체크 기준으로 사용합니다.</p>
        </div>
        <a href="data/memo.png" target="_blank" rel="noreferrer" class="asset-frame">
          <img src="data/memo.png" alt="해커톤 웹 기능 명세 메모" loading="lazy" />
        </a>
      </article>

      <article class="card asset-card">
        <div class="section-head">
          <span class="eyebrow">Provided Flow</span>
          <h2>UI 흐름도</h2>
          <p>메인, 목록, 상세, 팀 모집, 랭킹, 브라우저 로컬 DB 저장 흐름을 한눈에 확인합니다.</p>
        </div>
        <a href="data/Hackathon-UI-Flow.png" target="_blank" rel="noreferrer" class="asset-frame">
          <img src="data/Hackathon-UI-Flow.png" alt="해커톤 UI Flow" loading="lazy" />
        </a>
      </article>
    </section>
  `;
}
function renderDisclosureRulesCard() {
  return `
    <article class="card">
      <div class="section-head">
        <span class="eyebrow">Disclosure Rules</span>
        <h2>공개 금지 목록</h2>
        <p>화면, 더미 데이터, README, 제출 자료 어디에도 아래 항목이 노출되면 안 됩니다.</p>
      </div>
      <div class="grid grid-2">
        <div>
          <h3>절대 공개 금지</h3>
          <ul class="plain-list">
            ${PUBLIC_DISCLOSURE_RULES.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </div>
        <div>
          <h3>심사/배포 공개 원칙</h3>
          <ul class="plain-list">
            ${DISCLOSURE_COMPLIANCE_CHECKS.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </div>
      </div>
      <div class="note-box">
        <strong>주의</strong>
        <p>비공개 정보 노출, 저작권·라이선스 위반, 심사자가 확인할 수 없는 기능은 감점 또는 심사 제외 위험이 있습니다.</p>
      </div>
    </article>
  `;
}

function renderTeamMessagePanel(team) {
  const messages = getTeamMessages(team.id);

  return `
    <details class="note-box team-message-box">
      <summary>문의 / 쪽지</summary>
      <div class="team-message-box__body">
        ${
          messages.length
            ? `
                <div class="storage-list">
                  ${messages
                    .slice(-4)
                    .map(
                      (message) => `
                        <div class="storage-item">
                          <strong>${escapeHtml(message.sender)}</strong>
                          <span>${escapeHtml(formatDateTime(message.sentAt))}</span>
                          <span>${escapeHtml(message.body)}</span>
                        </div>
                      `
                    )
                    .join("")}
                </div>
              `
            : renderInlineEmptyState("문의 내역 없음", "이 모집글에 대한 첫 문의를 남길 수 있습니다.")
        }
        <form class="form-grid team-message-form" data-team-message-form data-team-id="${escapeHtml(team.id)}" data-team-name="${escapeHtml(team.name)}" data-hackathon-slug="${escapeHtml(team.hackathonSlug || "")}">
          <label class="full">
            <span>쪽지 내용</span>
            <textarea name="body" rows="3" placeholder="팀 합류 문의나 협업 질문을 남기세요." required></textarea>
          </label>
          <div class="action-row full">
            ${team.contact?.url ? `<a class="button button--ghost" href="${escapeHtml(team.contact.url)}" target="_blank" rel="noreferrer">외부 연락 링크</a>` : ""}
            <button class="button" type="submit">문의 보내기</button>
          </div>
        </form>
      </div>
    </details>
  `;
}

function getUpcomingMilestones(limit = 4) {
  const referenceNow = Date.now();
  const allMilestones = (state.data?.hackathons ?? [])
    .flatMap((hackathon) => {
      const detail = getHackathonDetail(hackathon.slug);
      return (detail?.sections?.schedule?.milestones ?? []).map((item) => ({
        hackathonTitle: hackathon.title,
        hackathonSlug: hackathon.slug,
        name: item.name,
        at: item.at
      }));
    })
    .sort((left, right) => new Date(left.at).getTime() - new Date(right.at).getTime());

  const upcoming = allMilestones.filter((item) => new Date(item.at).getTime() >= referenceNow);
  return (upcoming.length ? upcoming : allMilestones).slice(0, limit);
}

function getMilestoneFocusTarget(name) {
  const label = String(name ?? "");

  if (/기획서|웹링크|PDF|제출/u.test(label)) return "submit";
  if (/팀|모집/u.test(label)) return "teams";
  if (/투표|리더보드|평가/u.test(label)) return "leaderboard";
  return "schedule";
}

function getUpcomingMilestoneLink(milestone) {
  if (!milestone?.hackathonSlug) return "#/hackathons";
  return `#/hackathons/${milestone.hackathonSlug}?focus=${getMilestoneFocusTarget(milestone.name)}`;
}

function getMilestoneByName(detail, pattern) {
  return (detail?.sections?.schedule?.milestones ?? []).find((item) => item.name.includes(pattern)) ?? null;
}

function getFeaturedSubmissionMilestones(detail) {
  return {
    plan: getMilestoneByName(detail, "기획서"),
    web: getMilestoneByName(detail, "웹링크"),
    pdf: getMilestoneByName(detail, "PDF"),
    vote: getMilestoneByName(detail, "1차 투표평가 시작")
  };
}

function normalizeInput(value) {
  return String(value ?? "").trim();
}

function collectJudgePreviewRisks(draft) {
  const sources = [
    draft.projectTitle,
    draft.teamParticipants,
    draft.serviceOverview,
    draft.pageComposition,
    draft.systemComposition,
    draft.coreFunctionSpec,
    draft.userFlow,
    draft.developmentPlan
  ]
    .map((item) => normalizeInput(item).toLowerCase())
    .filter(Boolean);

  const joined = sources.join(" ");
  const rules = [
    { pattern: /localhost|127\.0\.0\.1|0\.0\.0\.0/, message: "로컬 전용 URL이 포함되어 있습니다." },
    { pattern: /secret|token|api[-_\s]?key|access[-_\s]?key|private[-_\s]?url/, message: "민감 접근 정보로 보일 수 있는 문자열이 있습니다." },
    { pattern: /내부|비공개|internal/, message: "비공개 또는 내부 정보로 보일 수 있는 표현이 있습니다." }
  ];

  return rules.filter((rule) => rule.pattern.test(joined)).map((rule) => rule.message);
}

function deriveSubmissionTeamName(value) {
  const normalized = normalizeInput(value);
  if (!normalized) return "";

  const firstLine = normalized.split(/\n+/)[0].trim();
  const delimiters = [" / ", "/", "|", ",", "·"];
  let candidate = firstLine;

  delimiters.some((delimiter) => {
    if (candidate.includes(delimiter)) {
      candidate = candidate.split(delimiter)[0].trim();
      return true;
    }
    return false;
  });

  return candidate;
}

function buildJudgePreview(slug, detail, submitDraft) {
  const checks = submitDraft.checks ?? {};
  const projectTitle = normalizeInput(submitDraft.projectTitle);
  const teamParticipants = normalizeInput(submitDraft.teamParticipants);
  const serviceOverview = normalizeInput(submitDraft.serviceOverview);
  const pageComposition = normalizeInput(submitDraft.pageComposition);
  const systemComposition = normalizeInput(submitDraft.systemComposition);
  const coreFunctionSpec = normalizeInput(submitDraft.coreFunctionSpec);
  const userFlow = normalizeInput(submitDraft.userFlow);
  const developmentPlan = normalizeInput(submitDraft.developmentPlan);
  const documentFields = [
    ["projectTitle", projectTitle],
    ["teamParticipants", teamParticipants],
    ["serviceOverview", serviceOverview],
    ["pageComposition", pageComposition],
    ["systemComposition", systemComposition],
    ["coreFunctionSpec", coreFunctionSpec],
    ["userFlow", userFlow],
    ["developmentPlan", developmentPlan]
  ];
  const completedItems = documentFields.filter(([, value]) => Boolean(value)).length;
  const requiredItems = documentFields.length;
  const riskMessages = collectJudgePreviewRisks(submitDraft);
  const teamName = deriveSubmissionTeamName(teamParticipants) || "팀/참가자 정보를 입력하세요";

  const basic = Math.min(
    30,
    (checks.dataRendering ? 10 : 0) + (checks.filterSort ? 10 : 0) + (checks.emptyState ? 10 : 0)
  );
  const extension = (serviceOverview ? 10 : 0) + (coreFunctionSpec ? 10 : 0) + (developmentPlan ? 10 : 0);
  const completeness =
    (checks.responsive ? 8 : 0) +
    (checks.errorHandling ? 8 : 0) +
    (requiredItems ? Math.round((completedItems / requiredItems) * 9) : 0);
  const docs = (pageComposition ? 5 : 0) + (systemComposition ? 5 : 0) + (userFlow ? 5 : 0);
  const total = Math.min(100, basic + extension + completeness + docs);
  const tone = qualityTone(total);

  const warnings = [];
  const strengths = [];

  if (!projectTitle) warnings.push("프로젝트 제목이 없으면 제출 패키지 식별성이 떨어집니다.");
  if (!teamParticipants) warnings.push("팀/참가자 정보가 없으면 제출 주체를 파악하기 어렵습니다.");
  if (requiredItems && completedItems < requiredItems) warnings.push(`필수 제출 항목이 ${completedItems}/${requiredItems}개만 입력되었습니다.`);
  if (!serviceOverview) warnings.push("서비스 개요가 없으면 서비스 가치 설명이 약해집니다.");
  if (!coreFunctionSpec) warnings.push("핵심 기능 명세가 비어 있으면 확장(아이디어) 항목 설득력이 떨어집니다.");
  if (!developmentPlan) warnings.push("개발 및 개선 계획이 없으면 확장/완성도 로드맵이 약해집니다.");
  if (!pageComposition || !systemComposition || !userFlow) warnings.push("페이지 구성, 시스템 구성, 주요 사용 흐름 중 비어 있는 문서 항목이 있습니다.");
  if (!checks.responsive || !checks.errorHandling) warnings.push("반응형 또는 오류/예외 처리가 확인되지 않았습니다.");
  if (riskMessages.length) warnings.push(...riskMessages);

  if (requiredItems && completedItems === requiredItems) strengths.push("필수 제출 항목이 모두 입력되었습니다.");
  if (serviceOverview && coreFunctionSpec && developmentPlan) strengths.push("서비스 가치, 핵심 기능, 개선 계획이 함께 드러납니다.");
  if (pageComposition && systemComposition && userFlow) strengths.push("문서/설명 항목이 구조적으로 정리되었습니다.");
  if (checks.dataRendering && checks.filterSort && checks.emptyState) strengths.push("기본 구현 self-check가 모두 완료되었습니다.");
  if (checks.responsive && checks.errorHandling) strengths.push("완성도 관점의 반응형과 오류 대응이 모두 체크되었습니다.");

  const criteria = [
    {
      label: "기본 구현",
      max: 30,
      score: basic,
      summary: checks.dataRendering && checks.filterSort && checks.emptyState ? "데이터/필터/빈 상태 self-check 완료" : "기본 구현 체크가 아직 비었습니다."
    },
    {
      label: "확장(아이디어)",
      max: 30,
      score: extension,
      summary: serviceOverview && coreFunctionSpec && developmentPlan ? "서비스 가치와 확장 계획이 함께 정리되었습니다." : "서비스 개요, 핵심 기능 명세, 개선 계획 중 비어 있는 항목이 있습니다."
    },
    {
      label: "완성도",
      max: 25,
      score: completeness,
      summary: checks.responsive && checks.errorHandling ? "반응형과 오류 대응이 체크되었습니다." : "완성도 self-check를 더 채워야 합니다."
    },
    {
      label: "문서/설명",
      max: 15,
      score: docs,
      summary: pageComposition && systemComposition && userFlow ? "문서 구조가 명확히 정리되었습니다." : "페이지 구성, 시스템 구성, 사용 흐름 설명을 더 채워야 합니다."
    }
  ];

  const quickChecks = [
    {
      label: "문서 필수 구조",
      passed: requiredItems > 0 && completedItems === requiredItems,
      detail: `${completedItems}/${requiredItems || 0} 항목 입력`
    },
    {
      label: "팀/참가자 정보",
      passed: Boolean(teamParticipants),
      detail: teamParticipants || "팀/참가자 미입력"
    },
    {
      label: "서비스 가치 설명",
      passed: Boolean(serviceOverview) && Boolean(coreFunctionSpec),
      detail: serviceOverview && coreFunctionSpec ? "개요와 기능 명세 준비됨" : "서비스 개요 또는 핵심 기능 명세 필요"
    },
    {
      label: "개발 및 개선 계획",
      passed: Boolean(developmentPlan),
      detail: developmentPlan ? "로드맵 정리됨" : "개발 및 개선 계획 미입력"
    },
    {
      label: "완성도 self-check",
      passed: checks.dataRendering && checks.filterSort && checks.emptyState && checks.responsive && checks.errorHandling,
      detail: `${[checks.dataRendering, checks.filterSort, checks.emptyState, checks.responsive, checks.errorHandling].filter(Boolean).length}/5 완료`
    },
    {
      label: "공개 금지 정보",
      passed: riskMessages.length === 0,
      detail: riskMessages.length ? riskMessages[0] : "위험 신호 없음"
    }
  ];

  return {
    slug,
    total,
    tone,
    criteria,
    quickChecks,
    warnings,
    strengths,
    teamName,
    projectTitle: projectTitle || "프로젝트 제목을 입력하세요.",
    teamParticipants: teamParticipants || "팀/참가자 정보를 입력하세요.",
    serviceOverview: serviceOverview || "서비스 개요를 입력하세요.",
    coreFunctionSpec: coreFunctionSpec || "핵심 기능 명세를 입력하세요.",
    developmentPlan: developmentPlan || "개발 및 개선 계획을 입력하세요."
  };
}

function renderJudgePreviewCard(slug, detail, submitDraft, options = {}) {
  const preview = buildJudgePreview(slug, detail, submitDraft);
  const criteriaMarkup = preview.criteria
    .map((item) => renderMetric(item.label, Math.round((item.score / item.max) * 100)))
    .join("");
  const quickChecks = (options.compact ? preview.quickChecks.slice(0, 4) : preview.quickChecks)
    .map(
      (item) => `
        <div class="judge-preview__check ${item.passed ? "is-pass" : "is-warn"}">
          <strong>${escapeHtml(item.label)}</strong>
          <span>${escapeHtml(item.detail)}</span>
        </div>
      `
    )
    .join("");

  return `
    <article class="card judge-preview-card ${options.compact ? "judge-preview-card--compact" : ""}" data-judge-preview="${escapeHtml(slug)}">
      <div class="preview-top">
        <div>
          <span class="eyebrow">${options.compact ? "Judge Preview Snapshot" : "Judge Preview"}</span>
          <h2>${options.compact ? "심사 준비 스냅샷" : "Judge Preview"}</h2>
          <p>심사자가 실제로 보게 될 제출 패키지를 기준으로, 평가 항목별 준비 상태를 self-audit 합니다.</p>
        </div>
        <div class="score-pill ${preview.tone.className}">
          <strong>${preview.total}</strong>
          <span>${escapeHtml(preview.tone.label)}</span>
        </div>
      </div>

      <div class="metrics">
        ${criteriaMarkup}
      </div>

      <div class="judge-preview__checks">
        ${quickChecks}
      </div>

      ${
        options.compact
          ? `
              <div class="judge-preview__summary">
                <strong>${escapeHtml(preview.projectTitle)}</strong>
                <p>${escapeHtml(preview.serviceOverview)}</p>
              </div>
            `
          : `
              <div class="grid grid-2">
                <div class="fact-stack">
                  <div class="fact-row"><span>프로젝트 제목</span><strong>${escapeHtml(preview.projectTitle)}</strong></div>
                  <div class="fact-row"><span>팀/참가자</span><strong>${escapeHtml(preview.teamParticipants)}</strong></div>
                  <div class="fact-row"><span>서비스 개요</span><strong>${escapeHtml(preview.serviceOverview)}</strong></div>
                  <div class="fact-row"><span>핵심 기능 명세</span><strong>${escapeHtml(preview.coreFunctionSpec)}</strong></div>
                  <div class="fact-row"><span>개발 및 개선 계획</span><strong>${escapeHtml(preview.developmentPlan)}</strong></div>
                </div>
                <div class="feedback-grid">
                  <div>
                    <h3>강점</h3>
                    <ul class="plain-list">
                      ${(preview.strengths.length ? preview.strengths : ["지금부터 입력을 채우면 강점이 자동 정리됩니다."])
                        .map((item) => `<li>${escapeHtml(item)}</li>`)
                        .join("")}
                    </ul>
                  </div>
                  <div>
                    <h3>보완 포인트</h3>
                    <ul class="plain-list">
                      ${preview.warnings.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                    </ul>
                  </div>
                </div>
                <div class="action-row">
                  <a class="button" href="#/hackathons/${escapeHtml(slug)}/judge-preview">감점 분석 보기</a>
                  <a class="button button--ghost" href="#/hackathons/${escapeHtml(slug)}?focus=submit">제출로 돌아가기</a>
                </div>
              </div>
            `
      }
    </article>
  `;
}

function renderJudgePreviewReport(slug, hackathon, detail, submitDraft) {
  const preview = buildJudgePreview(slug, detail, submitDraft);

  return `
    <section class="page-head">
      <span class="eyebrow">Judge Preview Report</span>
      <h1>${escapeHtml(hackathon.title)} 제출 분석</h1>
      <p>테스트 결과를 기준으로 감점 포인트와 보완 우선순위를 따로 정리한 화면입니다.</p>
    </section>

    <section class="detail-hero card">
      <div class="detail-hero__main">
        <span class="eyebrow">Summary</span>
        <h1>${escapeHtml(preview.projectTitle)}</h1>
        <p>${escapeHtml(preview.serviceOverview)}</p>
        <div class="action-row">
          <a class="button" href="#/hackathons/${escapeHtml(slug)}?focus=submit">제출로 돌아가기</a>
          <a class="button button--ghost" href="#/hackathons/${escapeHtml(slug)}">상세 보기</a>
        </div>
      </div>
      <div class="detail-hero__side">
        <div class="score-pill ${preview.tone.className}">
          <strong>${preview.total}</strong>
          <span>${escapeHtml(preview.tone.label)}</span>
        </div>
        <div class="fact-row"><span>기준</span><strong>${escapeHtml(FEATURE_NAME)} self-audit</strong></div>
        <div class="fact-row"><span>보완 항목 수</span><strong>${preview.warnings.length}개</strong></div>
      </div>
    </section>

    <section class="card">
      <div class="section-head">
        <span class="eyebrow">Deductions</span>
        <h2>감점 포인트 요약</h2>
        <p>심사 기준과 제출 체크 관점에서 현재 빠져 있는 항목을 먼저 보여줍니다.</p>
      </div>
      ${
        preview.warnings.length
          ? `
              <ul class="plain-list">
                ${preview.warnings.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            `
          : renderInlineEmptyState("감점 포인트 없음", "현재 입력 기준으로 위험 신호가 보이지 않습니다.")
      }
    </section>

    <section class="grid grid-2">
      <article class="card">
        <div class="section-head">
          <span class="eyebrow">Criteria</span>
          <h2>평가 항목별 점수</h2>
          <p>어느 항목에서 몇 점이 비어 있는지 바로 확인합니다.</p>
        </div>
        <div class="storage-list">
          ${preview.criteria
            .map(
              (item) => `
                <div class="storage-item">
                  <strong>${escapeHtml(item.label)} · ${item.score}/${item.max}</strong>
                  <span>${escapeHtml(item.summary)}</span>
                  <span>남은 점수 ${item.max - item.score}점</span>
                </div>
              `
            )
            .join("")}
        </div>
      </article>

      <article class="card">
        <div class="section-head">
          <span class="eyebrow">Checks</span>
          <h2>빠른 확인</h2>
          <p>제출 전 한 번 더 확인해야 하는 통과/경고 항목입니다.</p>
        </div>
        <div class="judge-preview__checks">
          ${preview.quickChecks
            .map(
              (item) => `
                <div class="judge-preview__check ${item.passed ? "is-pass" : "is-warn"}">
                  <strong>${escapeHtml(item.label)}</strong>
                  <span>${escapeHtml(item.detail)}</span>
                </div>
              `
            )
            .join("")}
        </div>
      </article>
    </section>

    <section class="grid grid-2">
      <article class="card">
        <h2>강점</h2>
        <ul class="plain-list">
          ${(preview.strengths.length ? preview.strengths : ["아직 자동 정리된 강점이 없습니다."])
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("")}
        </ul>
      </article>
      <article class="card">
        <h2>다음 행동</h2>
        <ul class="plain-list">
          <li>제출 섹션으로 돌아가 비어 있는 문서 항목부터 채웁니다.</li>
          <li>서비스 개요, 핵심 기능 명세, 개발 및 개선 계획을 우선 보강합니다.</li>
          <li>필요하면 다시 테스트해 감점 포인트가 줄었는지 확인합니다.</li>
        </ul>
      </article>
    </section>
  `;
}

function renderHome() {
  const hackathons = state.data?.hackathons ?? [];
  const ongoingHackathons = hackathons.filter((hackathon) => hackathon.status === "ongoing");
  const upcomingHackathons = hackathons.filter((hackathon) => hackathon.status === "upcoming");
  const participatingHackathons = hackathons.filter((hackathon) => getParticipatingHackathonSlugs().has(hackathon.slug));
  const upcomingMilestone = getUpcomingMilestones(1)[0] ?? null;
  const openCampCount = getAllTeams().filter((team) => team.isOpen).length;
  const openCampHackathonCount = new Set(
    getAllTeams()
      .filter((team) => team.isOpen && team.hackathonSlug)
      .map((team) => team.hackathonSlug)
  ).size;
  const localCampCount = state.campTeams.length;
  const favoriteHackathons = getFavoriteHackathons();
  const favoriteStatusSummary = getFavoriteStatusSummary();
  const rankingRows = buildGlobalRanking("all");
  const topRank = rankingRows[0] ?? null;
  const participatingLeaderboards = buildParticipatingLeaderboardSections();
  const myOfficialBoardCount = participatingLeaderboards.filter((section) => section.myRows.some((row) => row.source === "official")).length;
  const myRankSummary = participatingLeaderboards
    .map((section) => {
      if (section.myRows.length) {
        const rankText = section.myRows
          .map((row) => (row.rank ? `#${row.rank}` : "로컬 제출"))
          .join(", ");
        return `${section.shortTitle} ${rankText}`;
      }

      return `${section.shortTitle} 매칭 대기`;
    })
    .slice(0, 3)
    .join(" · ");
  const myHackathonPoints = participatingLeaderboards.reduce((sum, section) => sum + section.myPointTotal, 0);
  const myMatchedTeams = [...new Set(participatingLeaderboards.flatMap((section) => section.myDisplayNames))];
  const favoriteHackathonNames = favoriteHackathons.map((item) => item.title).slice(0, 2).join(" · ");
  const upcomingMilestoneLink = getUpcomingMilestoneLink(upcomingMilestone);

  return `
    <section class="page-head page-head--home">
      <span class="eyebrow">Public Hackathon Portal</span>
      <h1>${escapeHtml(PRODUCT_NAME)}</h1>
      <p class="hero__lead">${escapeHtml(CORE_MESSAGE)}</p>
    </section>

    <section
      class="card portal-entry-card portal-entry-card--primary portal-entry-card--clickable"
      data-home-card-link="#/hackathons"
      role="link"
      tabindex="0"
      aria-label="전체 해커톤 목록 보기"
    >
      <div class="portal-entry-card__head">
        <span class="eyebrow">해커톤</span>
        <h2>해커톤 보기</h2>
        <p>카드 본문은 전체 해커톤 목록으로, 요약 카드는 찜한 해커톤과 다음 해야 할 해커톤으로 바로 이동합니다.</p>
      </div>
      <div class="portal-entry-card__summary">
        <a class="portal-entry-card__stat portal-entry-card__stat-link" href="#/hackathons?scope=favorites">
          <span>찜한 해커톤</span>
          <strong>${favoriteHackathons.length}개</strong>
          <small>${escapeHtml(favoriteHackathons.length ? favoriteHackathonNames || favoriteStatusSummary : "하트로 저장한 해커톤이 아직 없습니다.")}</small>
        </a>
        <a class="portal-entry-card__stat portal-entry-card__stat-link" href="${escapeHtml(upcomingMilestoneLink)}">
          <span>다음 예정된 할 일</span>
          <strong>${escapeHtml(upcomingMilestone ? `${upcomingMilestone.name} · ${formatDateTime(upcomingMilestone.at)}` : "일정 정보 없음")}</strong>
          <small>${escapeHtml(upcomingMilestone ? upcomingMilestone.hackathonTitle : "확인할 일정이 없으면 전체 해커톤 목록으로 이동합니다.")}</small>
        </a>
      </div>
      <div class="portal-subcards">
        <a class="portal-subcard" href="#/hackathons?scope=participating">
          <strong>참여중인 해커톤</strong>
          <span>${participatingHackathons.length}개</span>
          <small>${escapeHtml(participatingHackathons.length ? participatingHackathons.map((item) => item.title).slice(0, 2).join(" · ") : "아직 참여 상태가 기록되지 않았습니다.")}</small>
        </a>
        <a class="portal-subcard" href="#/hackathons?status=ongoing">
          <strong>진행중인 해커톤</strong>
          <span>${ongoingHackathons.length}개</span>
          <small>${escapeHtml(ongoingHackathons.length ? ongoingHackathons.map((item) => item.title).slice(0, 2).join(" · ") : "현재 진행중인 해커톤이 없습니다.")}</small>
        </a>
        <a class="portal-subcard" href="#/hackathons?status=upcoming">
          <strong>예정된 해커톤</strong>
          <span>${upcomingHackathons.length}개</span>
          <small>${escapeHtml(upcomingHackathons.length ? upcomingHackathons.map((item) => item.title).slice(0, 2).join(" · ") : "예정된 해커톤이 없습니다.")}</small>
        </a>
      </div>
    </section>

    <section class="grid grid-2 home-entry-grid">
      <a class="card portal-entry-card" href="#/camp">
        <div class="portal-entry-card__head">
          <h2>팀 찾기</h2>
          <p>모집중인 팀 글, 내가 만든 팀 모집 글, 찜한 해커톤 상태를 함께 확인합니다.</p>
        </div>
        <div class="portal-entry-card__stats">
          <div class="portal-entry-card__stat">
            <span>모집중 팀 글</span>
            <strong>${openCampCount}개</strong>
          </div>
          <div class="portal-entry-card__stat">
            <span>모집중 해커톤</span>
            <strong>${openCampHackathonCount}개</strong>
          </div>
          <div class="portal-entry-card__stat">
            <span>내가 만든 팀 글</span>
            <strong>${localCampCount}개</strong>
          </div>
          <div class="portal-entry-card__stat">
            <span>찜한 해커톤 상태</span>
            <strong>${favoriteHackathons.length}개 저장</strong>
            <small>${escapeHtml(favoriteStatusSummary)}</small>
          </div>
        </div>
      </a>

      <a class="card portal-entry-card" href="#/rankings">
        <div class="portal-entry-card__head">
          <h2>랭킹 보기</h2>
          <p>글로벌 랭킹과 내 해커톤 리더보드를 분리된 뷰에서 확인합니다.</p>
        </div>
        <div class="portal-entry-card__stats">
          <div class="portal-entry-card__stat">
            <span>전체 해커톤 랭킹</span>
            <strong>${rankingRows.length}명</strong>
            <small>${escapeHtml(topRank ? `현재 1위 ${topRank.nickname} · ${topRank.points}pt` : "공개 글로벌 랭킹 데이터가 없습니다.")}</small>
          </div>
          <div class="portal-entry-card__stat">
            <span>내가 참여중인 해커톤의 리더보드 개수</span>
            <strong>${participatingLeaderboards.length}개</strong>
            <small>${escapeHtml(participatingLeaderboards.length ? `공개 리더보드 매칭 ${myOfficialBoardCount}개` : "참여중인 해커톤이 아직 없습니다.")}</small>
          </div>
          <div class="portal-entry-card__stat">
            <span>내 실시간 참여중인 해커톤의 순위들</span>
            <strong>${escapeHtml(participatingLeaderboards.length ? `${participatingLeaderboards.filter((section) => section.myRows.length).length}개 해커톤 추적중` : "아직 추적중인 순위 없음")}</strong>
            <small>${escapeHtml(myRankSummary || "팀 생성, 팀 수락, 제출을 하면 여기에 순위 요약이 보입니다.")}</small>
          </div>
        </div>
        <div class="portal-entry-card__footer-card">
          <span>내 해커톤 포인트</span>
          <strong>${myHackathonPoints}pt</strong>
          <small>${escapeHtml(myMatchedTeams.length ? `매칭 팀 ${myMatchedTeams.join(" · ")}` : "공개 리더보드에 아직 내 팀 이름이 매칭되지 않았습니다.")}</small>
        </div>
      </a>
    </section>
  `;
}

function getHackathonListView() {
  const query = state.routeInfo?.query ?? new URLSearchParams();
  const validStatuses = new Set(["all", "upcoming", "ongoing", "ended"]);
  const validScopes = new Set(["all", "participating", "favorites"]);
  const status = validStatuses.has(query.get("status")) ? query.get("status") : state.listFilters.status;
  const tag = query.get("tag") ?? state.listFilters.tag;
  const scope = validScopes.has(query.get("scope")) ? query.get("scope") : "all";

  return {
    status: status || "all",
    tag: tag || "all",
    scope
  };
}

function getFilteredHackathons() {
  const filters = getHackathonListView();
  const participatingSlugs = getParticipatingHackathonSlugs();
  const favoriteSlugs = new Set(getFavoriteHackathons().map((hackathon) => hackathon.slug));

  return (state.data?.hackathons ?? []).filter((hackathon) => {
    const statusMatch = filters.status === "all" || hackathon.status === filters.status;
    const tagMatch = filters.tag === "all" || (hackathon.tags ?? []).includes(filters.tag);
    const scopeMatch =
      filters.scope === "all" ||
      (filters.scope === "participating" && participatingSlugs.has(hackathon.slug)) ||
      (filters.scope === "favorites" && favoriteSlugs.has(hackathon.slug));
    return statusMatch && tagMatch && scopeMatch;
  });
}

function renderHackathonList() {
  const hacks = getFilteredHackathons();
  const tags = listAllTags();
  const filters = getHackathonListView();
  const currentViewLabel =
    filters.scope === "participating"
      ? "참여중인 해커톤"
      : filters.scope === "favorites"
        ? "찜한 해커톤"
      : filters.status === "ongoing"
        ? "진행중인 해커톤"
        : filters.status === "upcoming"
          ? "예정된 해커톤"
          : filters.status === "ended"
            ? "종료된 해커톤"
            : "전체 해커톤";
  const isFiltered = filters.scope !== "all" || filters.status !== "all" || filters.tag !== "all";

  return `
    <section class="page-head">
      <span class="eyebrow">Hackathons</span>
      <h1>해커톤 목록</h1>
      <p>${escapeHtml(currentViewLabel)}을 보고 있습니다. 제목, 상태, 태그, 시작일, 종료일, 참가자 수를 카드로 보고 상세 slug 페이지로 이동합니다.</p>
    </section>

    <section class="card filter-card">
      <div class="filter-row">
        <label>
          <span>상태 필터</span>
          <select data-list-filter="status">
            <option value="all">전체</option>
            <option value="upcoming">예정</option>
            <option value="ongoing">진행중</option>
            <option value="ended">종료</option>
          </select>
        </label>
        <label>
          <span>태그 필터</span>
          <select data-list-filter="tag">
            <option value="all">전체</option>
            ${tags.map((tag) => `<option value="${escapeHtml(tag)}">${escapeHtml(tag)}</option>`).join("")}
          </select>
        </label>
        ${
          isFiltered
            ? `<div class="action-row"><a class="button button--ghost" href="#/hackathons">필터 초기화</a></div>`
            : ""
        }
      </div>
    </section>

    ${
      hacks.length
        ? `
          <section class="grid grid-2">
            ${hacks
              .map((hackathon) => {
                const detail = getHackathonDetail(hackathon.slug);
                const participantCount = getParticipantCount(hackathon.slug);
                const startAt = getHackathonStartAt(hackathon);
                const favoriteLabel = isFavoriteHackathon(hackathon.slug) ? "하트 해제" : "하트";

                return `
                  <article class="card hackathon-card">
                    <div class="hackathon-card__top">
                      <span class="chip">${escapeHtml(statusLabel(hackathon.status))}</span>
                      <button class="favorite-button ${isFavoriteHackathon(hackathon.slug) ? "is-active" : ""}" type="button" data-favorite-slug="${escapeHtml(hackathon.slug)}" aria-label="${escapeHtml(favoriteLabel)}">
                        ${isFavoriteHackathon(hackathon.slug) ? "♥" : "♡"}
                      </button>
                    </div>
                    <strong class="hackathon-card__title">${escapeHtml(hackathon.title)}</strong>
                    <p>${escapeHtml(detail?.sections?.overview?.summary ?? "상세 설명 데이터가 아직 없습니다.")}</p>
                    <div class="hackathon-card__tags">
                      ${(hackathon.tags ?? []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
                    </div>
                    <div class="fact-stack">
                      <div class="fact-row"><span>시작일</span><strong>${escapeHtml(formatDate(startAt))}</strong></div>
                      <div class="fact-row"><span>종료일</span><strong>${escapeHtml(formatDate(hackathon.period?.endAt))}</strong></div>
                      <div class="fact-row"><span>참가자 수</span><strong>${participantCount || 0}명</strong></div>
                    </div>
                    <div class="action-row action-row--end">
                      <a class="button button--ghost" href="#/hackathons/${escapeHtml(hackathon.slug)}">상세 보기</a>
                    </div>
                  </article>
                `;
              })
              .join("")}
          </section>
        `
        : renderStatusCard({
            kind: "데이터 없음",
            title: "조건에 맞는 해커톤이 없습니다",
            description: "상태 또는 태그 필터를 변경해보세요."
          })
    }
  `;
}

function getSubmitDraftFor(slug, teams) {
  const baseDraft = createSubmitDraft(slug, teams);
  const existingDraft = state.submitDrafts[slug] ?? {};
  const existing = {
    ...baseDraft,
    ...existingDraft,
    checks: {
      ...baseDraft.checks,
      ...(existingDraft.checks ?? {})
    },
    fileNames: [...(existingDraft.fileNames ?? baseDraft.fileNames)]
  };

  if (!existing.teamParticipants && normalizeInput(existingDraft.teamName)) {
    existing.teamParticipants = existingDraft.teamName;
  }
  if (!existing.serviceOverview && normalizeInput(existingDraft.judgeSummary)) {
    existing.serviceOverview = existingDraft.judgeSummary;
  }
  if (!existing.developmentPlan && normalizeInput(existingDraft.extensionSummary)) {
    existing.developmentPlan = existingDraft.extensionSummary;
  }

  state.submitDrafts[slug] = existing;
  return existing;
}

function getTeamActionState(slug, teamId) {
  return state.teamActions[`${slug}:${teamId}`] ?? "";
}

function calculateDetailScore(entry, detail) {
  const evalInfo = detail?.sections?.eval;
  if (evalInfo?.scoreSource === "vote" && entry.scoreBreakdown && Array.isArray(evalInfo.scoreDisplay?.breakdown)) {
    const weighted = evalInfo.scoreDisplay.breakdown.reduce((sum, part) => {
      return sum + (Number(entry.scoreBreakdown[part.key]) || 0) * (part.weightPercent / 100);
    }, 0);
    return Math.round(weighted * 10) / 10;
  }

  return entry.score ?? null;
}

function buildDetailLeaderboardRows(slug, detail, teams, leaderboard) {
  const myNameSet = new Set(getMyTeamNamesByHackathon().get(slug) ?? []);
  const officialRows = (leaderboard.entries ?? [])
    .map((entry) => ({
      source: "official",
      teamName: entry.teamName,
      rank: entry.rank,
      participantType: "팀",
      score: calculateDetailScore(entry, detail),
      status: "제출 완료",
      submittedAt: entry.submittedAt,
      artifacts: entry.artifacts ?? {},
      isMine: myNameSet.has(entry.teamName)
    }))
    .sort((left, right) => (left.rank ?? 999) - (right.rank ?? 999));

  const officialNames = new Set(officialRows.map((row) => row.teamName));
  const localRows = state.hackathonSubmissions
    .filter((entry) => entry.hackathonSlug === slug)
    .filter((entry) => !officialNames.has(entry.teamName))
    .map((entry) => ({
      source: "local",
      teamName: entry.teamName,
      rank: null,
      participantType: "팀",
      score: null,
      status: "로컬 제출",
      submittedAt: entry.submittedAt,
      artifacts: {
        projectTitle: entry.projectTitle,
        serviceOverview: entry.serviceOverview,
        fileNames: entry.fileNames
      },
      isMine: true
    }));

  const unsubmittedRows = teams
    .filter((team) => !officialNames.has(team.name))
    .filter((team) => !localRows.some((row) => row.teamName === team.name))
    .map((team) => ({
      source: "team",
      teamName: team.name,
      rank: null,
      participantType: "팀",
      score: null,
      status: "미제출",
      submittedAt: null,
      artifacts: {},
      isMine: myNameSet.has(team.name)
    }));

  return [...officialRows, ...localRows, ...unsubmittedRows];
}

function renderDetailLeaderboardSection(slug, hackathon, detail, rows) {
  const officialCount = rows.filter((row) => row.source === "official").length;
  const localCount = rows.filter((row) => row.source === "local").length;
  const unsubmittedCount = rows.filter((row) => row.status === "미제출").length;
  const latestSubmittedAt = rows.reduce((latest, row) => {
    const timestamp = row.submittedAt ? new Date(row.submittedAt).getTime() : 0;
    return Math.max(latest, timestamp);
  }, 0);
  const myRows = rows.filter((row) => row.isMine);
  const myRanks = myRows.length ? myRows.map((row) => (row.rank ? `#${row.rank}` : row.status)).join(", ") : "매칭 대기";

  return `
    <section class="card detail-section-card leaderboard-card" id="leaderboard" data-detail-section>
      <div class="leaderboard-card__head">
        <div>
          <h2>리더보드 (Leaderboard)</h2>
          <p>${escapeHtml(hackathon.title)}의 현재 제출/순위 상태를 카드 한 장에서 확인합니다.</p>
        </div>
        <div class="leaderboard-card__meta">
          <span class="chip">${escapeHtml(`공개 순위 ${officialCount}팀`)}</span>
          <span class="chip">${escapeHtml(`로컬 제출 ${localCount}팀`)}</span>
          <span class="chip">${escapeHtml(`미제출 ${unsubmittedCount}팀`)}</span>
          <span class="chip chip--alert">${escapeHtml(`내 순위 ${myRanks}`)}</span>
          <span class="chip">${escapeHtml(latestSubmittedAt ? `최근 제출 ${formatDateTime(new Date(latestSubmittedAt).toISOString())}` : "최근 제출 없음")}</span>
        </div>
      </div>
      <p class="small-note">
        ${
          detail?.sections?.leaderboard?.note
            ? escapeHtml(detail.sections.leaderboard.note)
            : "점수는 해커톤 설정에 따라 표시합니다. 제출이 없으면 미제출로 표기합니다."
        }
      </p>
      ${
        rows.length
          ? `
              <div class="table-wrap">
                <table class="table">
                  <thead>
                    <tr>
                      <th>순위</th>
                      <th>팀 또는 개인</th>
                      <th>참가자 닉네임 또는 팀 이름</th>
                      <th>최근 제출 날짜</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rows
                      .map(
                        (row) => `
                          <tr class="${row.isMine ? "table__row--mine" : ""}">
                            <td>${row.rank ? `#${row.rank}` : "-"}</td>
                            <td>${escapeHtml(row.participantType)}</td>
                            <td>
                              ${escapeHtml(row.teamName)}
                              ${row.isMine ? '<span class="chip chip--mine">내 팀</span>' : ""}
                              <span class="chip">${escapeHtml(row.status)}</span>
                              ${row.score !== null ? `<span class="chip">${escapeHtml(`점수 ${row.score}`)}</span>` : ""}
                            </td>
                            <td>${escapeHtml(row.submittedAt ? formatDateTime(row.submittedAt) : "-")}</td>
                          </tr>
                        `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            `
          : renderInlineEmptyState("데이터 없음", "이 해커톤의 리더보드 데이터가 아직 없습니다.")
      }
    </section>
  `;
}

function renderEvaluationSection(evalInfo) {
  const breakdown = Array.isArray(evalInfo?.scoreDisplay?.breakdown) ? evalInfo.scoreDisplay.breakdown : [];
  const breakdownMap = new Map(breakdown.map((item) => [item.label, item.weightPercent]));

  return `
    <section class="card detail-section-card" id="eval" data-detail-section>
      <div class="section-head">
        <span class="eyebrow">Evaluation Criteria</span>
        <h2>평가 기준</h2>
        <p>1차/2차 평가 구조와 내부 심사위원 평가표, 동점자 기준까지 한 번에 확인합니다.</p>
      </div>

      <div class="evaluation-stack">
        <article class="note-box evaluation-callout">
          <h3>평가</h3>
          <ul class="plain-list evaluation-list">
            ${EVALUATION_PHASES.map(
              (phase) => `
                <li>
                  <strong>${escapeHtml(phase.title)}</strong>: ${escapeHtml(phase.description)}
                  ${
                    phase.subItems.length
                      ? `
                          <ul class="plain-list evaluation-sublist">
                            ${phase.subItems
                              .map((item) => {
                                const [label, fallbackValue] = item.split(": ");
                                const displayValue = breakdownMap.has(label) ? `${breakdownMap.get(label)}%` : fallbackValue;
                                return `<li>${escapeHtml(`${label}: ${displayValue}`)}</li>`;
                              })
                              .join("")}
                          </ul>
                        `
                      : ""
                  }
                </li>
              `
            ).join("")}
          </ul>
        </article>

        <article class="card">
          <div class="section-head section-head--tight">
            <div>
              <h3>내부 심사위원 평가기준</h3>
              <p>${escapeHtml(evalInfo?.description ?? "참가팀/심사위원 투표 점수와 내부 평가 기준을 함께 봅니다.")}</p>
            </div>
            <div class="fact-stack">
              <div class="fact-row"><span>지표</span><strong>${escapeHtml(evalInfo?.metricName ?? "-")}</strong></div>
            </div>
          </div>
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>평가항목</th>
                  <th>배점</th>
                  <th>평가 포인트</th>
                </tr>
              </thead>
              <tbody>
                ${EVALUATION_CRITERIA_ROWS.map(
                  (item) => `
                    <tr>
                      <td>${escapeHtml(item.label)}</td>
                      <td>${item.score}</td>
                      <td>${escapeHtml(item.point)}</td>
                    </tr>
                  `
                ).join("")}
              </tbody>
            </table>
          </div>
        </article>

        <article class="note-box evaluation-callout">
          <h3>동점자 처리 기준</h3>
          <ul class="plain-list evaluation-list">
            ${EVALUATION_TIEBREAKERS.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>
      </div>
    </section>
  `;
}

function renderHackathonDetail() {
  const slug = state.routeInfo.segments[1];
  const hackathon = getHackathonBySlug(slug);

  if (!hackathon) {
    return renderStatusCard({
      kind: "에러",
      title: "해커톤을 찾을 수 없습니다",
      description: "목록에서 다시 선택해주세요.",
      actionLabel: "해커톤 목록으로",
      action: "go-hackathons"
    });
  }

  const detail = getHackathonDetail(slug);
  const sections = detail?.sections ?? {};
  const teams = getTeamsForHackathon(slug);
  const submitDraft = getSubmitDraftFor(slug, teams);

  if (state.routeInfo.segments[2] === "judge-preview") {
    return renderJudgePreviewReport(slug, hackathon, detail, submitDraft);
  }

  const leaderboard = getLeaderboard(slug);
  const leaderboardRows = buildDetailLeaderboardRows(slug, detail, teams, leaderboard);
  const submissionMilestones = getFeaturedSubmissionMilestones(detail);
  const sectionNav = [
    ["overview", "개요"],
    ["eval", "평가"],
    ["schedule", "일정"],
    ["prize", "상금"],
    ["teams", "팀"],
    ["submit", "제출"],
    ["leaderboard", "리더보드"]
  ];

  return `
    <section class="detail-layout">
      <aside class="detail-sidebar">
        <div class="detail-sidebar__sticky">
          <section class="card detail-sidebar__panel">
            <div class="detail-sidebar__head">
              <span class="eyebrow">대회안내</span>
              <h2>빠른 이동</h2>
              <p>스크롤 위치에 따라 현재 섹션이 강조됩니다.</p>
            </div>
            <nav class="detail-sidebar__nav" aria-label="상세 섹션 이동">
              ${sectionNav
                .map(
                  ([key, label]) => `
                    <button class="detail-sidebar__button" type="button" data-detail-nav="${escapeHtml(key)}">${escapeHtml(label)}</button>
                  `
                )
                .join("")}
            </nav>
          </section>
        </div>
      </aside>

      <div class="detail-main">
        <section class="detail-hero card">
          <div class="detail-hero__main">
            <span class="eyebrow">Hackathon Detail</span>
            <h1>${escapeHtml(hackathon.title)}</h1>
            <p>${escapeHtml(CORE_MESSAGE)}</p>
            <div class="tag-list">
              <span class="tag">${escapeHtml(statusLabel(hackathon.status))}</span>
              ${(hackathon.tags ?? []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
            </div>
            <div class="action-row">
              <button class="button" type="button" data-scroll-target="submit">제출 패키지 작성</button>
              <a class="button button--ghost" href="#/hackathons/${escapeHtml(slug)}/judge-preview">Judge Preview 테스트</a>
              <button class="button button--ghost ${isFavoriteHackathon(slug) ? "is-active" : ""}" type="button" data-favorite-slug="${escapeHtml(slug)}">${isFavoriteHackathon(slug) ? "♥ 찜됨" : "♡ 찜하기"}</button>
              <a class="button button--ghost" href="#/camp?hackathon=${escapeHtml(slug)}">팀 모집 보기</a>
              <button class="button button--ghost" type="button" data-scroll-target="leaderboard">리더보드로</button>
            </div>
          </div>
          <div class="detail-hero__side">
            <div class="fact-row"><span>상태</span><strong>${escapeHtml(statusLabel(hackathon.status))}</strong></div>
            <div class="fact-row"><span>기획서 마감</span><strong>${escapeHtml(formatDateTime(submissionMilestones.plan?.at))}</strong></div>
            <div class="fact-row"><span>웹링크 마감</span><strong>${escapeHtml(formatDateTime(submissionMilestones.web?.at))}</strong></div>
            <div class="fact-row"><span>PDF 마감 / 투표 시작</span><strong>${escapeHtml(formatDateTime(submissionMilestones.pdf?.at))} / ${escapeHtml(formatDateTime(submissionMilestones.vote?.at))}</strong></div>
            <div class="fact-row"><span>팀 수</span><strong>${teams.length}개</strong></div>
            <div class="fact-row"><span>참가자 수</span><strong>${getParticipantCount(slug)}명</strong></div>
          </div>
        </section>

        <section class="card detail-section-card" id="overview" data-detail-section>
          <div class="section-head">
            <span class="eyebrow">Overview</span>
            <h2>개요</h2>
            <p>해커톤 기본 정보와 안내를 하나의 큰 섹션 카드 안에서 확인합니다.</p>
          </div>
          <div class="detail-subgrid">
            <section class="detail-subpanel">
              <h3>기본 정보</h3>
              ${
                sections.overview
                  ? `
                    <div class="fact-stack">
                      <div class="fact-row"><span>요약</span><strong>${escapeHtml(sections.overview.summary)}</strong></div>
                      <div class="fact-row"><span>개인 참가</span><strong>${sections.overview.teamPolicy?.allowSolo ? "가능" : "불가"}</strong></div>
                      <div class="fact-row"><span>최대 팀 인원</span><strong>${sections.overview.teamPolicy?.maxTeamSize ?? "-"}명</strong></div>
                    </div>
                  `
                  : renderInlineEmptyState("데이터 없음", "개요 정보가 아직 없습니다.")
              }
            </section>

            <section class="detail-subpanel" id="info">
              <h3>안내</h3>
              ${
                sections.info
                  ? `
                    <ul class="plain-list">
                      ${(sections.info.notice ?? []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                    </ul>
                    <div class="link-row">
                      <a class="button button--ghost" href="${escapeHtml(sections.info.links?.rules ?? "#")}" target="_blank" rel="noreferrer">Rules</a>
                      <a class="button button--ghost" href="${escapeHtml(sections.info.links?.faq ?? "#")}" target="_blank" rel="noreferrer">FAQ</a>
                    </div>
                  `
                  : renderInlineEmptyState("데이터 없음", "안내 공지가 아직 없습니다.")
              }
            </section>
          </div>
        </section>

        ${
          sections.eval
            ? renderEvaluationSection(sections.eval)
            : `
                <section class="card detail-section-card" id="eval" data-detail-section>
                  ${renderInlineEmptyState("데이터 없음", "평가 정보가 아직 없습니다.")}
                </section>
              `
        }

        <section class="card detail-section-card" id="schedule" data-detail-section>
          <h2>일정 (Schedule)</h2>
          ${
            sections.schedule?.milestones?.length
              ? `
                  <div class="timeline">
                    ${sections.schedule.milestones
                      .map(
                        (item) => `
                          <div class="timeline__item">
                            <span class="timeline__phase">${escapeHtml(item.name)}</span>
                            <strong>${escapeHtml(formatDateTime(item.at))}</strong>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                `
              : renderInlineEmptyState("데이터 없음", "일정 정보가 아직 없습니다.")
          }
        </section>

        <section class="card detail-section-card" id="prize" data-detail-section>
          <h2>상금 (Prize)</h2>
          ${
            sections.prize?.items?.length
              ? `
                  <div class="timeline">
                    ${sections.prize.items
                      .map(
                        (item) => `
                          <div class="timeline__item">
                            <span class="timeline__phase">${escapeHtml(item.place)}</span>
                            <strong>${escapeHtml(formatMoney(item.amountKRW))}</strong>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                `
              : renderInlineEmptyState("데이터 없음", "상금 정보가 아직 공개되지 않았습니다.")
          }
        </section>

        <section class="card detail-section-card" id="teams" data-detail-section>
          <div class="section-head section-head--tight">
            <div>
              <span class="eyebrow">Teams</span>
              <h2>팀 (Teams)</h2>
              <p>이 해커톤 팀 구성, 초대/수락/거절, 팀 모집글 작성, 문의/쪽지 흐름을 제공합니다.</p>
            </div>
            <div class="action-row">
              <a class="button" href="#/camp?hackathon=${escapeHtml(slug)}">이 해커톤 팀 보기</a>
              <a class="button button--ghost" href="#/camp?hackathon=${escapeHtml(slug)}&mode=create">이 해커톤 팀 모집글 작성</a>
            </div>
          </div>

          <details class="note-box">
            <summary>팀 구성 시 유의사항</summary>
            <ul class="plain-list">
              <li>외부에 공개 가능한 소개와 연락 링크만 등록하세요.</li>
              <li>다른 팀 내부 정보나 비공개 정보는 팀 소개에 포함하지 마세요.</li>
              <li>연락 링크는 심사자가 접근 가능한 공개 링크만 사용하세요.</li>
            </ul>
          </details>

          ${
            teams.length
              ? `
                  <div class="grid grid-2">
                    ${teams
                      .map(
                        (team) => `
                          <article class="team-action-card">
                            <div class="team-action-card__head">
                              <span class="chip">${team.isOpen ? "모집중" : "마감"}</span>
                              <strong>${escapeHtml(team.name)}</strong>
                            </div>
                            <p>${escapeHtml(team.intro)}</p>
                            <p class="small-note">포지션: ${escapeHtml((team.lookingFor ?? []).join(" / ") || "모집 완료")}</p>
                            <p class="small-note">연락: ${escapeHtml(team.contact?.url ?? "-")}</p>
                            <div class="action-row">
                              <button class="button button--ghost ${getTeamActionState(slug, team.id) === "invite" ? "is-active" : ""}" type="button" data-team-action="invite" data-team-id="${escapeHtml(team.id)}" data-hackathon-slug="${escapeHtml(slug)}">초대</button>
                              <button class="button button--ghost ${getTeamActionState(slug, team.id) === "accept" ? "is-active" : ""}" type="button" data-team-action="accept" data-team-id="${escapeHtml(team.id)}" data-hackathon-slug="${escapeHtml(slug)}">수락</button>
                              <button class="button button--ghost ${getTeamActionState(slug, team.id) === "reject" ? "is-active" : ""}" type="button" data-team-action="reject" data-team-id="${escapeHtml(team.id)}" data-hackathon-slug="${escapeHtml(slug)}">거절</button>
                            </div>
                            ${renderTeamMessagePanel(team)}
                          </article>
                        `
                      )
                      .join("")}
                  </div>
                `
              : renderInlineEmptyState("데이터 없음", "이 해커톤과 연결된 팀이 아직 없습니다.")
          }
        </section>

        <section class="card detail-section-card" id="submit" data-detail-section>
          <h2>제출 (Submit)</h2>
          ${
            sections.submit
              ? `
                  <div class="grid grid-2">
                    <div>
                      <ul class="plain-list">
                        ${(sections.submit.guide ?? []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                      </ul>
                      <div class="tag-list">
                        ${(sections.submit.allowedArtifactTypes ?? []).map((type) => `<span class="tag">${escapeHtml(type)}</span>`).join("")}
                      </div>
                    </div>
                    <div class="submit-summary">
                      <div class="fact-row"><span>submissionUrl</span><strong>${escapeHtml(sections.submit.submissionUrl ?? "-")}</strong></div>
                      <div class="fact-row"><span>로컬 제출 수</span><strong>${state.hackathonSubmissions.filter((item) => item.hackathonSlug === slug).length}개</strong></div>
                      <div class="fact-row"><span>Judge Preview</span><strong>테스트 버튼을 눌러 감점 분석 화면에서 확인합니다.</strong></div>
                    </div>
                  </div>

                  <form class="form-grid submit-form" data-submit-form data-submit-slug="${escapeHtml(slug)}">
                    <label>
                      <span>프로젝트 제목</span>
                      <input name="projectTitle" data-submit-field="projectTitle" value="${escapeHtml(submitDraft.projectTitle)}" placeholder="예: Daker Hub" />
                    </label>
                    <label class="full">
                      <span>팀 / 참가자</span>
                      <textarea name="teamParticipants" data-submit-field="teamParticipants" rows="2" placeholder="예: Team Alpha / Alice, Bob">${escapeHtml(submitDraft.teamParticipants)}</textarea>
                    </label>
                    <label class="full">
                      <span>서비스 개요</span>
                      <textarea name="serviceOverview" data-submit-field="serviceOverview" rows="3" placeholder="서비스가 해결하는 문제와 핵심 가치를 정리하세요.">${escapeHtml(submitDraft.serviceOverview)}</textarea>
                    </label>
                    <label class="full">
                      <span>페이지 구성</span>
                      <textarea name="pageComposition" data-submit-field="pageComposition" rows="3" placeholder="메인, 해커톤 목록, 상세, 캠프, 랭킹 등 페이지 구성을 정리하세요.">${escapeHtml(submitDraft.pageComposition)}</textarea>
                    </label>
                    <label class="full">
                      <span>시스템 구성</span>
                      <textarea name="systemComposition" data-submit-field="systemComposition" rows="3" placeholder="데이터 로드, 상태 관리, 브라우저 로컬 DB, 라우팅 구조를 정리하세요.">${escapeHtml(submitDraft.systemComposition)}</textarea>
                    </label>
                    <label class="full">
                      <span>핵심 기능 명세</span>
                      <textarea name="coreFunctionSpec" data-submit-field="coreFunctionSpec" rows="4" placeholder="필수 기능과 팀 확장 기능을 명세 형태로 적으세요.">${escapeHtml(submitDraft.coreFunctionSpec)}</textarea>
                    </label>
                    <label class="full">
                      <span>주요 사용 흐름</span>
                      <textarea name="userFlow" data-submit-field="userFlow" rows="3" placeholder="사용자가 홈에서 상세, 제출, 랭킹까지 이동하는 흐름을 적으세요.">${escapeHtml(submitDraft.userFlow)}</textarea>
                    </label>
                    <label class="full">
                      <span>개발 및 개선 계획</span>
                      <textarea name="developmentPlan" data-submit-field="developmentPlan" rows="4" placeholder="현재 구현 범위와 이후 개선 계획을 정리하세요.">${escapeHtml(submitDraft.developmentPlan)}</textarea>
                    </label>
                    <div class="full submit-check-grid">
                      <label class="checkbox-card">
                        <input type="checkbox" data-submit-check="dataRendering" ${submitDraft.checks.dataRendering ? "checked" : ""} />
                        <span>데이터 기반 렌더링 확인</span>
                      </label>
                      <label class="checkbox-card">
                        <input type="checkbox" data-submit-check="filterSort" ${submitDraft.checks.filterSort ? "checked" : ""} />
                        <span>필터/정렬 동작 확인</span>
                      </label>
                      <label class="checkbox-card">
                        <input type="checkbox" data-submit-check="emptyState" ${submitDraft.checks.emptyState ? "checked" : ""} />
                        <span>빈 상태 UI 확인</span>
                      </label>
                      <label class="checkbox-card">
                        <input type="checkbox" data-submit-check="responsive" ${submitDraft.checks.responsive ? "checked" : ""} />
                        <span>모바일/반응형 확인</span>
                      </label>
                      <label class="checkbox-card">
                        <input type="checkbox" data-submit-check="errorHandling" ${submitDraft.checks.errorHandling ? "checked" : ""} />
                        <span>오류/예외 처리 확인</span>
                      </label>
                    </div>
                    <div class="action-row full">
                      <a class="button button--ghost" href="#/hackathons/${escapeHtml(slug)}/judge-preview">Judge Preview 테스트</a>
                      <button class="button" type="submit">로컬 제출 저장</button>
                    </div>
                  </form>
                `
              : renderInlineEmptyState("데이터 없음", "제출 설정 정보가 아직 없습니다.")
          }
        </section>

        ${renderDetailLeaderboardSection(slug, hackathon, detail, leaderboardRows)}

        ${renderDisclosureRulesCard()}
      </div>
    </section>
  `;
}

function renderCamp() {
  const slugFilter = state.routeInfo.query.get("hackathon") ?? state.routeInfo.query.get("hackathons") ?? "";
  const createMode = state.routeInfo.query.get("mode") === "create";
  const availableHackathons = state.data?.hackathons ?? [];
  const filteredTeams = slugFilter ? getAllTeams().filter((team) => team.hackathonSlug === slugFilter) : getAllTeams();
  const draft = { ...createCampDraft(slugFilter), ...state.campDraft, hackathonSlug: slugFilter || "" };
  const linkedHackathon = draft.hackathonSlug ? availableHackathons.find((hackathon) => hackathon.slug === draft.hackathonSlug) : null;

  return `
    <section class="page-head">
      <span class="eyebrow">Camp</span>
      <h1>팀원 모집</h1>
      <p>${linkedHackathon ? `${linkedHackathon.title}에 연결된 모집글을 만들 수 있고, 연결 없이도 새 모집글 생성이 가능합니다.` : "해커톤과 연결하지 않아도 생성 가능하고, ?hackathon=slug query로 특정 해커톤 팀만 필터링할 수 있습니다."}</p>
    </section>

    <section class="grid grid-2 camp-grid">
      <article class="card camp-card">
        <div class="section-head">
          <span class="eyebrow">List</span>
          <h2>팀 리스트 보기</h2>
          <p>${slugFilter ? `${slugFilter}에 연결된 팀만 보고 있습니다.` : "전체 팀을 보고 있습니다."}</p>
        </div>
        ${
          filteredTeams.length
            ? `
                <div class="storage-list">
                  ${filteredTeams
                    .map(
                      (team) => `
                        <div class="storage-item">
                          <strong>${escapeHtml(team.name)}</strong>
                          <span>${escapeHtml(team.hackathonSlug || "연결 안 함")} · ${team.isOpen ? "모집중" : "마감"} · ${team.memberCount}명</span>
                          <span>${escapeHtml(team.intro)}</span>
                          <span>모집 포지션: ${escapeHtml((team.lookingFor ?? []).join(" / ") || "모집 완료")}</span>
                          <span>연락 링크: ${escapeHtml(team.contact?.url || "-")}</span>
                          <div class="action-row">
                            ${
                              team.isLocal
                                ? `<button class="button button--ghost" type="button" data-camp-close="${escapeHtml(team.id)}">${team.isOpen ? "모집 마감 처리" : "모집 재개"}</button>`
                                : ""
                            }
                          </div>
                          ${renderTeamMessagePanel(team)}
                        </div>
                      `
                    )
                    .join("")}
                </div>
              `
            : renderInlineEmptyState("데이터 없음", "조건에 맞는 팀 모집글이 없습니다.")
        }
      </article>

      <article class="card camp-card camp-card--form">
        <div class="section-head">
          <span class="eyebrow">Create</span>
          <h2>팀 모집글 생성</h2>
          <p>${createMode && linkedHackathon ? "이 해커톤에 연결된 팀 모집글을 바로 작성합니다." : "팀명, 소개, 모집 상태, 모집 포지션, 연락 링크를 입력해 브라우저 로컬 DB에 저장합니다."}</p>
        </div>
        <form class="form-grid camp-form" data-camp-form data-camp-create-form>
          ${
            linkedHackathon
              ? `<div class="fact-row full"><span>연결 해커톤</span><strong>${escapeHtml(linkedHackathon.title)}</strong></div>`
              : `<div class="fact-row full"><span>연결 해커톤</span><strong>연결 안 함</strong></div>`
          }
          <label class="full">
            <span>팀명 (필수)</span>
            <input name="name" data-camp-field value="${escapeHtml(draft.name)}" placeholder="예: Emergency Relay Team" required />
          </label>
          <label class="full">
            <span>소개 (필수)</span>
            <textarea name="intro" data-camp-field rows="3" placeholder="팀 소개와 함께 어떤 문제를 풀고 싶은지 적어주세요." required>${escapeHtml(draft.intro)}</textarea>
          </label>
          <label class="full">
            <span>모집중 여부 (isOpen)</span>
            <select name="isOpen" data-camp-field>
              <option value="true">모집중</option>
              <option value="false">마감</option>
            </select>
          </label>
          <label class="full">
            <span>모집 포지션 (lookingFor[])</span>
            <input name="lookingFor" data-camp-field value="${escapeHtml(draft.lookingFor)}" placeholder="예: Frontend, Designer, PM" />
          </label>
          <label class="full">
            <span>연락 링크</span>
            <input name="contactUrl" type="url" data-camp-field value="${escapeHtml(draft.contactUrl)}" placeholder="예: https://open.kakao.com/... 또는 https://forms.gle/..." />
          </label>
          <div class="action-row action-row--start full">
            <button class="button" type="submit">팀 모집글 생성</button>
          </div>
        </form>
      </article>
    </section>
  `;
}

function getReferenceNow() {
  const allDates = Object.values(state.data?.leaderboardsBySlug ?? {})
    .flatMap((entry) => entry.entries ?? [])
    .map((item) => new Date(item.submittedAt).getTime())
    .filter((value) => Number.isFinite(value));

  if (!allDates.length) {
    return Date.now();
  }

  return Math.max(...allDates);
}

function getPeriodCutoff(period) {
  const reference = getReferenceNow();
  if (period === "all") return 0;
  const days = period === "7" ? 7 : 30;
  return reference - days * 24 * 60 * 60 * 1000;
}

function computeGlobalPoints(entry) {
  const placementPoints = Math.max(10, 120 - (entry.rank - 1) * 20);
  const scoreBonus =
    typeof entry.score === "number"
      ? entry.score < 1
        ? Math.round(entry.score * 40)
        : Math.round(entry.score / 5)
      : 0;
  return placementPoints + scoreBonus;
}

function buildParticipatingLeaderboardSections() {
  const myNamesBySlug = getMyTeamNamesByHackathon();

  return [...getParticipatingHackathonSlugs()]
    .map((slug) => {
      const hackathon = getHackathonBySlug(slug);
      const leaderboard = getLeaderboard(slug);
      const myDisplayNames = [...(myNamesBySlug.get(slug) ?? [])];
      const myNameSet = new Set(myDisplayNames);

      const officialRows = (leaderboard.entries ?? []).map((entry) => ({
        source: "official",
        rank: entry.rank ?? null,
        participantType: "팀",
        displayName: entry.teamName,
        submittedAt: entry.submittedAt ?? null,
        isMine: myNameSet.has(entry.teamName),
        points: computeGlobalPoints(entry)
      }));

      const officialNames = new Set(officialRows.map((row) => row.displayName));
      const localRows = state.hackathonSubmissions
        .filter((entry) => entry.hackathonSlug === slug)
        .filter((entry) => !officialNames.has(entry.teamName))
        .map((entry) => ({
          source: "local",
          rank: null,
          participantType: "팀",
          displayName: entry.teamName,
          submittedAt: entry.submittedAt,
          isMine: true,
          points: 0
        }));

      const rows = [...officialRows, ...localRows].sort((left, right) => {
        if (left.rank && right.rank) return left.rank - right.rank;
        if (left.rank) return -1;
        if (right.rank) return 1;
        return new Date(right.submittedAt ?? 0).getTime() - new Date(left.submittedAt ?? 0).getTime();
      });

      const myRows = rows.filter((row) => row.isMine);
      const latestSubmittedAt = rows.reduce((latest, row) => {
        const timestamp = row.submittedAt ? new Date(row.submittedAt).getTime() : 0;
        return Math.max(latest, timestamp);
      }, 0);

      return {
        slug,
        title: hackathon?.title ?? slug,
        shortTitle: (hackathon?.title ?? slug).replace(/^월간 해커톤\s*:\s*/u, "").replace(/^긴급 인수인계 해커톤:\s*/u, ""),
        rows,
        myRows,
        myDisplayNames,
        myPointTotal: myRows.reduce((sum, row) => sum + row.points, 0),
        latestSubmittedAt: latestSubmittedAt ? new Date(latestSubmittedAt).toISOString() : null
      };
    })
    .sort((left, right) => {
      if (left.myRows.length && !right.myRows.length) return -1;
      if (!left.myRows.length && right.myRows.length) return 1;
      return left.title.localeCompare(right.title, "ko");
    });
}

function buildGlobalRanking(period = state.rankingPeriod) {
  const cutoff = getPeriodCutoff(period);
  const bucket = new Map();

  Object.values(state.data?.leaderboardsBySlug ?? {}).forEach((board) => {
    (board.entries ?? []).forEach((entry) => {
      const submittedAt = new Date(entry.submittedAt).getTime();
      if (submittedAt < cutoff) return;

      const nickname = entry.teamName;
      const current = bucket.get(nickname) ?? { nickname, points: 0, participations: 0 };
      current.points += computeGlobalPoints(entry);
      current.participations += 1;
      bucket.set(nickname, current);
    });
  });

  return [...bucket.values()]
    .sort((left, right) => right.points - left.points)
    .map((entry, index) => ({
      rank: index + 1,
      nickname: entry.nickname,
      points: entry.points
    }));
}

function renderGlobalRankingContent(rows) {
  return rows.length
    ? `
        <section class="card">
          <table class="table">
            <thead>
              <tr>
                <th>rank</th>
                <th>nickname</th>
                <th>points</th>
              </tr>
            </thead>
            <tbody>
              ${rows
                .map(
                  (row) => `
                    <tr>
                      <td>#${row.rank}</td>
                      <td>${escapeHtml(row.nickname)}</td>
                      <td>${row.points}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </section>
      `
    : renderStatusCard({
        kind: "데이터 없음",
        title: "랭킹 데이터가 없습니다",
        description: "선택한 기간 안에 공개 리더보드 기록이 없습니다."
      });
}

function renderParticipatingRankingsContent(participatingLeaderboards) {
  return participatingLeaderboards.length
    ? `
        <section class="grid">
          ${participatingLeaderboards
            .map((section) => {
              const myRanks =
                section.myRows.length > 0 ? section.myRows.map((row) => (row.rank ? `#${row.rank}` : "로컬 제출")).join(", ") : "매칭 대기";

              return `
                <article class="card leaderboard-card">
                  <div class="leaderboard-card__head">
                    <div>
                      <h2>${escapeHtml(section.title)}</h2>
                      <p>${escapeHtml(`내 순위 ${myRanks} · 내 포인트 ${section.myPointTotal}pt`)}</p>
                    </div>
                    <div class="leaderboard-card__meta">
                      <span class="chip">${escapeHtml(`내 팀 ${section.myDisplayNames.length || 0}개`)}</span>
                      <span class="chip">${escapeHtml(section.latestSubmittedAt ? `최근 제출 ${formatDateTime(section.latestSubmittedAt)}` : "최근 제출 없음")}</span>
                    </div>
                  </div>
                  ${
                    section.rows.length
                      ? `
                          <div class="table-wrap">
                            <table class="table">
                              <thead>
                                <tr>
                                  <th>순위</th>
                                  <th>팀 또는 개인</th>
                                  <th>참가자 닉네임 또는 팀 이름</th>
                                  <th>최근 제출 날짜</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${section.rows
                                  .map(
                                    (row) => `
                                      <tr class="${row.isMine ? "table__row--mine" : ""}">
                                        <td>${row.rank ? `#${row.rank}` : "-"}</td>
                                        <td>${escapeHtml(row.participantType)}</td>
                                        <td>
                                          ${escapeHtml(row.displayName)}
                                          ${row.isMine ? '<span class="chip chip--mine">내 팀</span>' : ""}
                                        </td>
                                        <td>${escapeHtml(row.submittedAt ? formatDateTime(row.submittedAt) : "-")}</td>
                                      </tr>
                                    `
                                  )
                                  .join("")}
                              </tbody>
                            </table>
                          </div>
                        `
                      : renderInlineEmptyState("리더보드가 아직 없습니다", "공개 리더보드가 열리거나 로컬 제출이 생기면 여기에 표시됩니다.")
                  }
                </article>
              `;
            })
            .join("")}
        </section>
      `
    : renderInlineEmptyState("참여중인 해커톤이 없습니다", "팀 생성, 팀 수락, 제출을 하면 이 영역에 내 해커톤 리더보드가 모입니다.");
}

function renderRankings() {
  const rows = buildGlobalRanking();
  const participatingLeaderboards = buildParticipatingLeaderboardSections();
  const rankingView = state.routeInfo.query.get("view") === "mine" ? "mine" : "global";
  const isGlobalView = rankingView === "global";

  return `
    <section class="page-head">
      <h1>${isGlobalView ? "글로벌 랭킹" : "내 해커톤 리더보드"}</h1>
      <p>${isGlobalView ? "공개 리더보드의 팀 이름을 닉네임처럼 사용해 points를 합산한 글로벌 랭킹을 확인합니다." : "내가 참여중인 해커톤마다 별도의 리더보드 카드를 확인합니다."}</p>
    </section>

    <section class="card filter-card">
      <div class="rankings-switch">
        <a class="button button--ghost ${isGlobalView ? "is-active" : ""}" href="#/rankings">글로벌 랭킹</a>
        <a class="button button--ghost ${!isGlobalView ? "is-active" : ""}" href="#/rankings?view=mine">내 해커톤 리더보드</a>
      </div>
      ${
        isGlobalView
          ? `
              <div class="action-row">
                <button class="button button--ghost ${state.rankingPeriod === "7" ? "is-active" : ""}" type="button" data-ranking-period="7">최근 7일</button>
                <button class="button button--ghost ${state.rankingPeriod === "30" ? "is-active" : ""}" type="button" data-ranking-period="30">최근 30일</button>
                <button class="button button--ghost ${state.rankingPeriod === "all" ? "is-active" : ""}" type="button" data-ranking-period="all">전체</button>
              </div>
            `
          : `
              <p class="small-note">이 화면에는 기간 필터를 적용하지 않고, 참여중인 해커톤별 리더보드만 표시합니다.</p>
            `
      }
    </section>

    ${isGlobalView ? renderGlobalRankingContent(rows) : renderParticipatingRankingsContent(participatingLeaderboards)}
  `;
}

function renderAbout() {
  return `
    <section class="page-head">
      <span class="eyebrow">Rules</span>
      <h1>가이드 및 참고자료</h1>
      <p>공개 금지 목록, 제출 체크, 제공 메모와 UI 흐름도를 한 곳에서 확인합니다.</p>
    </section>

    <section class="grid grid-2">
      ${renderDisclosureRulesCard()}
      <article class="card">
        <h2>제출 전 체크</h2>
        <ul class="plain-list">
          <li>배포 URL은 외부에서 접속 가능해야 합니다.</li>
          <li>심사자는 별도 키 없이 주요 기능을 볼 수 있어야 합니다.</li>
          <li>다른 팀 내부 정보와 비공개 정보는 공개하지 않습니다.</li>
          <li>PDF, 웹링크, 기획서 제출 형식을 해커톤 설정에 맞춥니다.</li>
        </ul>
      </article>
    </section>

    ${renderReferenceGallery()}
  `;
}

function renderRouteContent() {
  const routeKey = currentRouteKey();

  if (routeKey === "/") return renderHome();
  if (routeKey === "/hackathons" && state.routeInfo.segments.length > 1) return renderHackathonDetail();
  if (routeKey === "/hackathons") return renderHackathonList();
  if (routeKey === "/camp") return renderCamp();
  if (routeKey === "/rankings") return renderRankings();
  if (routeKey === "/about") return renderAbout();

  return renderStatusCard({
    kind: "데이터 없음",
    title: "페이지를 찾을 수 없습니다",
    description: "메인으로 돌아가 다시 이동해주세요.",
    actionLabel: "메인으로",
    action: "go-home"
  });
}

function syncNavActiveState() {
  const routeKey = currentRouteKey();
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${routeKey}`);
  });
}

function renderApp() {
  state.routeInfo = parseHashRoute();
  syncNavActiveState();
  detailNavCleanup?.();
  detailNavCleanup = null;

  if (state.isLoading) {
    app.innerHTML = renderStatusCard({
      kind: "로딩중...",
      title: "데이터를 불러오는 중입니다",
      description: "잠시만 기다려주세요."
    });
    return;
  }

  if (state.loadError) {
    app.innerHTML = renderStatusCard({
      kind: "에러",
      title: "데이터를 불러오지 못했습니다",
      description: state.loadError,
      actionLabel: "다시 시도",
      action: "retry-load"
    });
    bindGlobalActions();
    return;
  }

  app.innerHTML = renderRouteContent();
  bindGlobalActions();
  bindRouteActions();
}

function bindGlobalActions() {
  app.querySelectorAll('[data-action="retry-load"]').forEach((button) => {
    button.addEventListener("click", retryLoad);
  });

  app.querySelectorAll('[data-action="go-home"]').forEach((button) => {
    button.addEventListener("click", () => {
      window.location.hash = "#/";
    });
  });

  app.querySelectorAll('[data-action="go-hackathons"]').forEach((button) => {
    button.addEventListener("click", () => {
      window.location.hash = "#/hackathons";
    });
  });
}

function bindScrollTargets(scope = app) {
  scope.querySelectorAll("[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.scrollTarget);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function bindDetailSidebarNav() {
  const buttons = Array.from(app.querySelectorAll("[data-detail-nav]"));
  const navPanel = app.querySelector(".detail-sidebar__panel");
  const sections = buttons
    .map((button) => document.getElementById(button.dataset.detailNav))
    .filter(Boolean);

  if (!buttons.length || !sections.length) return;

  let currentSectionId = "";
  let scrollFrame = 0;

  const setActiveSection = (sectionId) => {
    if (!sectionId || currentSectionId === sectionId) return;
    currentSectionId = sectionId;

    let activeButton = null;
    buttons.forEach((button) => {
      const isActive = button.dataset.detailNav === sectionId;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "true" : "false");
      if (isActive) activeButton = button;
    });

    if (activeButton && navPanel) {
      activeButton.scrollIntoView({
        block: "nearest",
        inline: "nearest"
      });
    }
  };

  const syncActiveSection = () => {
    if (scrollFrame) return;

    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;

      let activeSection = sections[0].id;

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= 180) {
          activeSection = section.id;
        }
      });

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 32) {
        activeSection = sections[sections.length - 1].id;
      }

      setActiveSection(activeSection);
    });
  };

  const clickHandlers = buttons.map((button) => {
    const handler = () => {
      const target = document.getElementById(button.dataset.detailNav);
      setActiveSection(button.dataset.detailNav);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    button.addEventListener("click", handler);
    return [button, handler];
  });

  window.addEventListener("scroll", syncActiveSection, { passive: true });
  window.addEventListener("resize", syncActiveSection);
  syncActiveSection();

  detailNavCleanup = () => {
    if (scrollFrame) {
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
    }
    clickHandlers.forEach(([button, handler]) => {
      button.removeEventListener("click", handler);
    });
    window.removeEventListener("scroll", syncActiveSection);
    window.removeEventListener("resize", syncActiveSection);
  };
}

function bindRouteActions() {
  const routeKey = currentRouteKey();

  bindScrollTargets();

  if (routeKey === "/") {
    app.querySelectorAll("[data-home-card-link]").forEach((card) => {
      card.addEventListener("click", handleHomeCardLink);
      card.addEventListener("keydown", handleHomeCardLinkKeydown);
    });
    return;
  }

  if (routeKey === "/hackathons" && state.routeInfo.segments.length === 1) {
    const filters = getHackathonListView();
    app.querySelectorAll("[data-list-filter]").forEach((select) => {
      select.value = filters[select.dataset.listFilter];
      select.addEventListener("change", handleListFilterChange);
    });
    app.querySelectorAll("[data-favorite-slug]").forEach((button) => {
      button.addEventListener("click", handleFavoriteHackathon);
    });
    return;
  }

  if (routeKey === "/hackathons" && state.routeInfo.segments.length > 1) {
    const slug = state.routeInfo.segments[1];
    const teams = getTeamsForHackathon(slug);
    getSubmitDraftFor(slug, teams);
    bindDetailSidebarNav();

    app.querySelectorAll("[data-team-action]").forEach((button) => {
      button.addEventListener("click", handleTeamAction);
    });

    app.querySelectorAll("[data-favorite-slug]").forEach((button) => {
      button.addEventListener("click", handleFavoriteHackathon);
    });

    app.querySelectorAll("[data-team-message-form]").forEach((form) => {
      form.addEventListener("submit", handleTeamMessageSubmit);
    });

    const form = app.querySelector("[data-submit-form]");
    if (form) {
      form.addEventListener("input", handleSubmitDraftInput);
      form.addEventListener("change", handleSubmitDraftInput);
      form.addEventListener("submit", handleHackathonSubmit);
    }

    const focusTarget = state.routeInfo.query.get("focus");
    if (focusTarget) {
      requestAnimationFrame(() => {
        document.getElementById(focusTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    return;
  }

  if (routeKey === "/camp") {
    const form = app.querySelector("[data-camp-form]");
    if (form) {
      const routeHackathonSlug = state.routeInfo.query.get("hackathon") ?? state.routeInfo.query.get("hackathons") ?? "";
      const draft = { ...createCampDraft(routeHackathonSlug), ...state.campDraft, hackathonSlug: routeHackathonSlug || "" };
      state.campDraft = draft;
      form.querySelector('[name="isOpen"]').value = String(draft.isOpen);
      form.addEventListener("input", handleCampDraftInput);
      form.addEventListener("change", handleCampDraftInput);
      form.addEventListener("submit", handleCampCreate);
    }

    app.querySelectorAll("[data-camp-close]").forEach((button) => {
      button.addEventListener("click", toggleCampClose);
    });

    app.querySelectorAll("[data-team-message-form]").forEach((messageForm) => {
      messageForm.addEventListener("submit", handleTeamMessageSubmit);
    });

    if (state.routeInfo.query.get("mode") === "create") {
      requestAnimationFrame(() => {
        const createForm = app.querySelector("[data-camp-create-form]");
        createForm?.scrollIntoView({ behavior: "smooth", block: "start" });
        createForm?.querySelector('[name="name"]')?.focus();
      });
    }
    return;
  }

  if (routeKey === "/rankings") {
    app.querySelectorAll("[data-ranking-period]").forEach((button) => {
      button.addEventListener("click", () => {
        state.rankingPeriod = button.dataset.rankingPeriod;
        renderApp();
      });
    });
  }
}

function handleListFilterChange(event) {
  const filterKey = event.target.dataset.listFilter;
  if (!filterKey) return;

  state.listFilters[filterKey] = event.target.value;

  const params = new URLSearchParams(state.routeInfo.query);
  const value = event.target.value;

  if (value === "all") {
    params.delete(filterKey);
  } else {
    params.set(filterKey, value);
  }

  const nextHash = params.toString() ? `#/hackathons?${params.toString()}` : "#/hackathons";
  if (window.location.hash === nextHash) {
    renderApp();
    return;
  }

  window.location.hash = nextHash;
}

function navigateToHash(hash) {
  if (!hash) return;

  if (window.location.hash === hash) {
    renderApp();
    return;
  }

  window.location.hash = hash;
}

function handleHomeCardLink(event) {
  if (event.target.closest("a, button, input, select, textarea, label")) return;
  navigateToHash(event.currentTarget.dataset.homeCardLink);
}

function handleHomeCardLinkKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  navigateToHash(event.currentTarget.dataset.homeCardLink);
}

function handleTeamAction(event) {
  const { teamId, teamAction, hackathonSlug } = event.currentTarget.dataset;
  state.teamActions[`${hackathonSlug}:${teamId}`] = teamAction;
  void persistStateField("teamActions");
  renderApp();
}

function handleFavoriteHackathon(event) {
  event.preventDefault();
  event.stopPropagation();

  const slug = event.currentTarget.dataset.favoriteSlug;
  if (!slug) return;

  if (state.favoriteHackathons[slug]) {
    delete state.favoriteHackathons[slug];
  } else {
    state.favoriteHackathons[slug] = true;
  }

  void persistStateField("favoriteHackathons");
  renderApp();
}

function handleCampDraftInput(event) {
  const field = event.target.dataset.campField;
  if (!field) return;

  state.campDraft[field] = field === "isOpen" ? event.target.value === "true" : event.target.value;
  void persistStateField("campDraft");
}

function handleCampCreate(event) {
  event.preventDefault();

  const draft = { ...createCampDraft(), ...state.campDraft };
  if (!draft.name.trim() || !draft.intro.trim()) {
    return;
  }

  const entry = {
    id: `LOCAL-${Date.now()}`,
    teamCode: `LOCAL-${Date.now()}`,
    hackathonSlug: draft.hackathonSlug,
    name: draft.name.trim(),
    intro: draft.intro.trim(),
    isOpen: Boolean(draft.isOpen),
    memberCount: 1,
    lookingFor: draft.lookingFor
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    contact: {
      type: "link",
      url: draft.contactUrl.trim()
    },
    createdAt: new Date().toISOString()
  };

  state.campTeams = [entry, ...state.campTeams];
  void persistStateField("campTeams");
  state.campDraft = createCampDraft(draft.hackathonSlug);
  void persistStateField("campDraft");
  renderApp();
}

function toggleCampClose(event) {
  const targetId = event.currentTarget.dataset.campClose;
  state.campTeams = state.campTeams.map((team) =>
    team.id === targetId
      ? {
          ...team,
          isOpen: !team.isOpen
        }
      : team
  );
  void persistStateField("campTeams");
  renderApp();
}

function handleTeamMessageSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const teamId = form.dataset.teamId;
  const teamName = form.dataset.teamName ?? "팀 모집글";
  const hackathonSlug = form.dataset.hackathonSlug ?? "";
  const body = form.querySelector('[name="body"]')?.value.trim() ?? "";

  if (!teamId || !body) {
    return;
  }

  const entry = {
    id: `MSG-${Date.now()}`,
    teamId,
    teamName,
    hackathonSlug,
    sender: "나",
    body,
    sentAt: new Date().toISOString()
  };

  const current = state.teamMessages[teamId] ?? [];
  state.teamMessages[teamId] = [...current, entry].slice(-20);
  void persistStateField("teamMessages");
  renderApp();
}

function handleSubmitDraftInput(event) {
  const form = event.currentTarget.closest("[data-submit-form]") ?? event.currentTarget;
  const slug = form.dataset.submitSlug;
  const draft = state.submitDrafts[slug];
  if (!draft) return;

  if (event.target.dataset.submitField) {
    draft[event.target.dataset.submitField] = event.target.value;
    void persistStateField("submitDrafts");
    return;
  }

  if (event.target.dataset.submitCheck) {
    draft.checks[event.target.dataset.submitCheck] = event.target.checked;
    void persistStateField("submitDrafts");
  }
}

function handleHackathonSubmit(event) {
  event.preventDefault();

  const slug = event.currentTarget.dataset.submitSlug;
  const draft = state.submitDrafts[slug];
  if (!draft || !draft.projectTitle.trim() || !draft.teamParticipants.trim()) {
    return;
  }

  const teamName = deriveSubmissionTeamName(draft.teamParticipants) || draft.projectTitle.trim();

  const entry = {
    id: Date.now(),
    hackathonSlug: slug,
    teamCode: draft.teamCode,
    teamName,
    projectTitle: draft.projectTitle.trim(),
    teamParticipants: draft.teamParticipants.trim(),
    serviceOverview: draft.serviceOverview.trim(),
    pageComposition: draft.pageComposition.trim(),
    systemComposition: draft.systemComposition.trim(),
    coreFunctionSpec: draft.coreFunctionSpec.trim(),
    userFlow: draft.userFlow.trim(),
    developmentPlan: draft.developmentPlan.trim(),
    checks: { ...draft.checks },
    fileNames: [...draft.fileNames],
    submittedAt: new Date().toISOString()
  };

  state.hackathonSubmissions = [entry, ...state.hackathonSubmissions];
  void persistStateField("hackathonSubmissions");
  state.submitDrafts[slug] = createSubmitDraft(slug, getTeamsForHackathon(slug));
  void persistStateField("submitDrafts");
  renderApp();
}

async function retryLoad() {
  state.isLoading = true;
  state.loadError = null;
  renderApp();

  try {
    await loadData();
  } catch (error) {
    state.loadError = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
  } finally {
    state.isLoading = false;
    renderApp();
  }
}

async function bootstrap() {
  await loadPersistedState();
  renderApp();

  try {
    await loadData();
  } catch (error) {
    state.loadError = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
  } finally {
    state.isLoading = false;
    renderApp();
  }

  window.addEventListener("hashchange", renderApp);
  window.addEventListener("storage", handleStorageSync);
  STORAGE_SYNC_CHANNEL?.addEventListener("message", handleBroadcastSync);
}

bootstrap();
