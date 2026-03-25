export const AUTH_INPUT_LIMITS = {
  displayName: 24,
  email: 120,
  password: 128
};

export const TEAM_INPUT_LIMITS = {
  name: 80,
  intro: 600,
  lookingFor: 200,
  contactUrl: 300
};

export const MESSAGE_INPUT_LIMITS = {
  body: 500
};

export const SUBMISSION_INPUT_LIMITS = {
  projectTitle: 120,
  teamParticipants: 160,
  serviceOverview: 2500,
  pageComposition: 3500,
  systemComposition: 3500,
  coreFunctionSpec: 4500,
  userFlow: 3000,
  developmentPlan: 3000,
  extensionIdea: 2500,
  verificationPlan: 2500
};

function normalizeText(value) {
  return String(value ?? "").trim();
}

export function assertMaxLength(label, value, max) {
  if (normalizeText(value).length > max) {
    throw new Error(`${label}은 ${max}자 이하로 입력해 주세요.`);
  }
}

export function assertOptionalMaxLength(label, value, max) {
  if (!normalizeText(value)) return;
  assertMaxLength(label, value, max);
}

export function countTrimmedLength(value) {
  return normalizeText(value).length;
}
