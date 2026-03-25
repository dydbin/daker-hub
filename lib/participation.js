export function isSharedEntry(team) {
  return Boolean(team?.owner_id ?? team?.ownerId ?? team?.owner_name ?? team?.ownerName);
}

export function isSoloEntry(team) {
  return isSharedEntry(team) && Number(team?.member_count ?? team?.memberCount ?? 1) === 0;
}

export function isOpenEntry(team) {
  return Boolean(team?.is_open ?? team?.isOpen);
}

export function isJoinableTeam(team) {
  return isSharedEntry(team) && !isSoloEntry(team) && isOpenEntry(team);
}

export function getParticipationLabel(team) {
  if (!isSharedEntry(team)) return "공식 팀";
  return isSoloEntry(team) ? "개인 참가" : "팀 모집";
}

export function getParticipationEyebrow(team) {
  if (!isSharedEntry(team)) return "Official Team";
  return isSoloEntry(team) ? "개인 참가" : "공유 팀";
}

export function getParticipationNeedLabel(team) {
  return isSoloEntry(team) ? "희망 협업" : "모집 포지션";
}
