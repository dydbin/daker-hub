const dateTimeFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short"
});

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium"
});

const moneyFormatter = new Intl.NumberFormat("ko-KR");

export function formatDate(value) {
  if (!value) return "-";
  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value) {
  if (!value) return "-";
  return dateTimeFormatter.format(new Date(value));
}

export function formatMoney(value) {
  if (value == null) return "-";
  return `${moneyFormatter.format(value)}원`;
}

export function statusLabel(status) {
  switch (status) {
    case "ongoing":
      return "진행중";
    case "upcoming":
      return "예정";
    case "ended":
      return "종료";
    default:
      return "상태 미정";
  }
}
