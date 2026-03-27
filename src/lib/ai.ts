export interface CarIdentification {
  brand: string;
  model: string;
  year: number;
  trim: string;
  color: string;
  mods: string[];
  condition: string;
  wheels: string;
}

export interface CarRating {
  aura: number;
  larp: number;
  money: number;
  demand: number;
  hype: number;
  carmog_score: number;
  analysis: string;
  identification: CarIdentification;
  model_used: string;
}

function calculateCarMogScore(scores: {
  aura: number;
  larp: number;
  money: number;
  demand: number;
  hype: number;
}): number {
  return Math.round(
    scores.aura * 0.25 +
      scores.larp * 0.2 +
      scores.money * 0.2 +
      scores.demand * 0.2 +
      scores.hype * 0.15
  );
}

const MOCK_CARS: CarRating[] = [
  {
    aura: 88,
    larp: 92,
    money: 85,
    demand: 90,
    hype: 94,
    carmog_score: 0,
    analysis:
      "This is a seriously clean build. The widebody kit sits perfectly flush with the aggressive wheel fitment, and whoever did the wrap knew exactly what they were doing. The stance is dialed in without being slammed to the point of uselessness. Interior shots show real carbon fiber, not the AliExpress stick-on garbage. The exhaust tips are OEM performance spec. This thing would stop traffic on any boulevard and break Instagram feeds. Only thing holding it back from a perfect score is the aftermarket headlights that cheapen the front end slightly. Overall, this build commands respect and the owner clearly knows what they are doing.",
    identification: {
      brand: "BMW",
      model: "M4 Competition",
      year: 2023,
      trim: "Competition xDrive",
      color: "Brooklyn Grey Metallic",
      mods: [
        "Widebody kit",
        "Forged carbon fiber hood",
        "HRE FF04 wheels",
        "KW V3 coilovers",
        "Akrapovic exhaust",
      ],
      condition: "Excellent",
      wheels: "HRE FF04 20-inch forged",
    },
    model_used: "gemini-2.0-flash",
  },
  {
    aura: 45,
    larp: 22,
    money: 38,
    demand: 30,
    hype: 55,
    carmog_score: 0,
    analysis:
      "Look, someone stuck an M badge on a 320i and thought nobody would notice. The base model brake calipers are right there for everyone to see. The eBay diffuser is already peeling, the taillights are smoked with spray paint, and those are replica Vossens that would shatter on the first pothole. The interior still has cloth seats but there is an aftermarket shift knob that probably cost more thought than the rest of the build. At least the car is clean and the paint is not destroyed. Points for effort, but the larp is strong with this one. Be real about what you drive and people will respect it more.",
    identification: {
      brand: "BMW",
      model: "320i",
      year: 2019,
      trim: "Base",
      color: "Alpine White",
      mods: [
        "Fake M badge",
        "eBay rear diffuser",
        "Replica wheels",
        "Smoked taillights",
        "Aftermarket shift knob",
      ],
      condition: "Good",
      wheels: "Replica Vossen CVT 19-inch",
    },
    model_used: "gemini-2.0-flash",
  },
  {
    aura: 96,
    larp: 98,
    money: 95,
    demand: 99,
    hype: 97,
    carmog_score: 0,
    analysis:
      "An R34 GT-R in Bayside Blue. This is the car that launched a thousand posters on bedroom walls. Everything about this build is period-correct and tastefully done. The Nismo front bumper, the carbon fiber rear diffuser, the gold TE37s -- this is the holy grail spec. The engine bay shows a well-maintained RB26DETT with what appears to be a proper HKS setup. This car does not need social media validation because it IS the validation. The market agrees, with these commanding half a million dollars on a quiet day. If you own this car, you already won.",
    identification: {
      brand: "Nissan",
      model: "Skyline GT-R V-Spec II",
      year: 2002,
      trim: "V-Spec II",
      color: "Bayside Blue",
      mods: [
        "Nismo front bumper",
        "Carbon rear diffuser",
        "HKS turbo upgrade",
        "Nismo exhaust",
      ],
      condition: "Excellent",
      wheels: "Volk TE37 18-inch gold",
    },
    model_used: "gemini-2.0-flash",
  },
];

export async function rateCar(
  _imageBase64Array: string[]
): Promise<CarRating> {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    // Return mock data
    const mock = MOCK_CARS[Math.floor(Math.random() * MOCK_CARS.length)];
    const scores = {
      aura: mock.aura,
      larp: mock.larp,
      money: mock.money,
      demand: mock.demand,
      hype: mock.hype,
    };
    return {
      ...mock,
      carmog_score: calculateCarMogScore(scores),
    };
  }

  // TODO: Real Gemini Vision implementation
  // Pass 1: Identification prompt
  // Pass 2: Scoring prompt with anchored rubric
  // For now, return mock
  const mock = MOCK_CARS[Math.floor(Math.random() * MOCK_CARS.length)];
  const scores = {
    aura: mock.aura,
    larp: mock.larp,
    money: mock.money,
    demand: mock.demand,
    hype: mock.hype,
  };
  return {
    ...mock,
    carmog_score: calculateCarMogScore(scores),
  };
}
