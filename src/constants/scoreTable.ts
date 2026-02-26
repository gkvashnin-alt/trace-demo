export const SCORE_TABLE = {
  0: {
    agentSkillMatch: null,
    evidenceSufficiency: null,
    teamPrimary: null,
    teamPrimaryPct: null,
    teamSecondary: null,
    teamSecondaryPct: null,
    transferAcceptance: null,
  },
  1: {
    agentSkillMatch: 62,
    evidenceSufficiency: 49,
    teamPrimary: 'T&S',
    teamPrimaryPct: 57,
    teamSecondary: null,
    teamSecondaryPct: null,
    transferAcceptance: 43,
  },
  2: {
    agentSkillMatch: 59,
    evidenceSufficiency: 34,
    teamPrimary: 'T&S',
    teamPrimaryPct: 64,
    teamSecondary: 'Adv. Support',
    teamSecondaryPct: 43,
    transferAcceptance: 28,
  },
  3: {
    agentSkillMatch: 47,
    evidenceSufficiency: 34,
    teamPrimary: 'T&S',
    teamPrimaryPct: 68,
    teamSecondary: 'Adv. Support',
    teamSecondaryPct: 49,
    transferAcceptance: 19,
  },
  4: {
    agentSkillMatch: 82,
    evidenceSufficiency: 81,
    teamPrimary: 'In-Service',
    teamPrimaryPct: 84,
    teamSecondary: null,
    teamSecondaryPct: null,
    transferAcceptance: 41,
  },
  5: {
    agentSkillMatch: 93,
    evidenceSufficiency: 96,
    teamPrimary: 'resolved',
    teamPrimaryPct: null,
    teamSecondary: null,
    teamSecondaryPct: null,
    transferAcceptance: null,
  },
};

export const STATE_BY_MESSAGE = {
  0: 0, 1: 0,
  2: 1, 3: 1, 4: 1,
  5: 2,
  6: 3, 7: 3, 8: 3, 9: 3, 10: 3, 11: 3,
  12: 4, 13: 4,
  14: 5,
};

export const MESSAGE_TIMINGS_NORMAL = [0, 3000, 6000, 9000, 12000, 15500, 19000, 22000, 25000, 28000, 31000, 34000, 37000, 40000];

export const STATE_PAUSE_MS = { 1: 1200, 2: 1200, 3: 1000, 4: 1200, 5: 1500 };
