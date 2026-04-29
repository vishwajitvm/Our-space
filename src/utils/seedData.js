export function seedRoom(roomId) {
  return {
    meta: {
      roomId,
      title: "Our Space",
      couple: {
        ai: "Visshwa",
        theOne: "Vandna",
      },
      inviteCode: roomId,
    },
    roomState: {
      partnerOnline: true,
      mood: "missing you badly",
      petFedCount: 7,
      note: "The One, your AI is saving hugs for later.",
      gift: "A tiny promise: no sleeping angry tonight.",
      photoUrl: "",
      wallDoodleUrl: "",
      lastAction: "AI fed the pet",
    },
    messages: [
      { sender: "The One", type: "text", text: "miss you idiot ❤️", read: true },
      { sender: "AI", type: "text", text: "AI misses you badly. Like dramatic-movie-level badly.", read: true },
      { sender: "The One", type: "hidden", text: "I act annoyed but I love your clingy side.", revealedBy: [] },
      { sender: "AI", type: "sticker", sticker: "forehead kiss delivery" },
      { sender: "The One", type: "poll", question: "Tonight?", options: ["Movie marathon", "Sleep call"], votes: {} },
      { sender: "AI", type: "voice", duration: "0:18", text: "Voice note for The One" },
    ],
    activities: [
      { actor: "The One", text: "The One sent a hidden message", type: "secret" },
      { actor: "AI", text: "AI uploaded a memory", type: "memory" },
      { actor: "The One", text: "The One fed your pet", type: "room" },
    ],
    memories: [
      { title: "Our first weird fight 😂", body: "Somehow still cute. Somehow still ours.", type: "text", mood: "chaotic cute" },
      { title: "That sleepy selfie from Vandna", body: "AI kept looking at it longer than necessary.", type: "text", mood: "soft" },
    ],
    letters: [
      { title: "Open when you miss AI", body: "Your AI is probably missing you first. Come collect one long hug." },
      { title: "Open when The One is angry", body: "Say sorry, speak softly, send food, and do not act smart." },
      { title: "Open when you cannot sleep", body: "Imagine the quiet little room where both of you are safe." },
    ],
    bucketlist: [
      { text: "Goa trip together", done: false },
      { text: "Late night movie marathon", done: true },
      { text: "Matching hoodies", done: false },
    ],
  };
}

export const dailyMissions = [
  "Send The One one honest line you were too shy to say.",
  "AI must describe Vandna in three dangerously soft words.",
  "Both of you pick a memory and rename it like a movie title.",
  "Leave a secret note and reveal it only after midnight.",
];

export const moods = ["missing you badly", "clingy", "sleepy", "angry but cute", "romantic"];

export const gamePrompts = {
  draw: ["Draw how AI looks when The One ignores messages.", "Draw Vandna's sleepy face from memory."],
  thisThat: ["Long call or surprise voice note?", "Matching hoodies or matching bracelets?", "Goa sunset or rainy balcony?"],
  dares: ["Send a dramatic love confession.", "Tell The One the exact moment you smiled today.", "Let AI choose tomorrow's good morning text."],
  quiz: ["Who says sorry first after a cute fight?", "What snack belongs in your movie marathon?", "Which message made AI blush most?"],
  story: ["AI opened the door and The One was holding...", "Vandna laughed because Visshwa had just..."],
  poll: ["Who misses harder today?", "Who is more clingy after midnight?"],
};
