export const couple = {
  appName: "Our Space",
  user: {
    realName: "Visshwa",
    nickname: "AI",
    initial: "A",
  },
  partner: {
    realName: "Vandna",
    nickname: "The One",
    initial: "T",
  },
  startedAt: "2024-02-14",
  anniversaryMonth: 1,
  anniversaryDay: 14,
};

export function partnerFor(sender) {
  return sender === couple.user.nickname ? couple.partner.nickname : couple.user.nickname;
}
