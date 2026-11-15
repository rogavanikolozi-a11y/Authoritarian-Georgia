/* =========================================================================
   data.js
   All editable text for the data-driven parts of the site lives here.
   Change words in this file; you do not need to touch main.js or styles.css.

   Needle positions ("disc", "formal") are numbers between 0 and 1.
   0 = Brussels, 1 = Moscow. They are ILLUSTRATIVE, not measurements:
   they show the direction the thesis describes.
     disc   = where the ruling party's discourse and laws pointed
     formal = the official line on EU membership (null = dropped)
   ========================================================================= */

window.SITE_DATA = {
  contact: {
    /* Email, stored backwards in two parts so spam bots can't read it. main.js puts it back together. */
    emailParts: ["moc.liamg", "izolokinavagor"],
    linkedin: "https://www.linkedin.com/in/nikoloz-rogava-43b50126a/",
  },

  /* Where the small needle in the top bar sits for each section of the page */
  needleBySection: {
    hero: 0.5,
    puzzle: 0.3,
    theory: 0.42,
    method: 0.42,
    regimes: 0.5,
    checkpoints: 0.45,
    experts: 0.86,
    findings: 0.86,
    about: 0.86,
  },

  /* ---------- 01 The puzzle: timeline ---------- */
  timeline: [
    {
      year: "2003",
      title: "Rose Revolution",
      text: "A new government commits Georgia to EU and NATO integration and starts rebuilding the state.",
      disc: 0.2, formal: 0.2,
    },
    {
      year: "2008",
      title: "Russia-Georgia war",
      text: "The war leaves a lasting fear of renewed conflict. That fear becomes political material later.",
      disc: 0.2, formal: 0.2,
    },
    {
      year: "2012",
      title: "Georgian Dream takes power",
      text: "Georgia’s first peaceful transfer of power. The new ruling party stays formally pro-European while democratic checks slowly weaken.",
      disc: 0.3, formal: 0.22,
    },
    {
      year: "Feb 2022",
      title: "Russia invades Ukraine",
      text: "The slow erosion speeds up. The government keeps its distance from Ukraine and refuses to join sanctions.",
      disc: 0.42, formal: 0.25,
    },
    {
      year: "Dec 2023",
      title: "EU candidate status",
      text: "Georgia receives candidate status. The official line and the actual course are now far apart.",
      disc: 0.6, formal: 0.25,
    },
    {
      year: "Nov 2024",
      title: "EU process suspended",
      text: "The government suspends EU integration until 2028. The official line gives way.",
      disc: 0.85, formal: null,
    },
  ],

  /* ---------- 03 Method: the five lenses ---------- */
  lenses: [
    { name: "Nomination", q: "How are actors named?", ex: "“radicals”, “agents”, “spies”" },
    { name: "Predication", q: "What traits are attached to them?", ex: "extremist, anti-state, foreign-funded" },
    { name: "Argumentation", q: "How are claims justified?", ex: "transparency, the US FARA law, sovereignty" },
    { name: "Perspectivization", q: "Whose viewpoint is taken?", ex: "the only force that sees the real danger" },
    { name: "Intensification", q: "Do claims get stronger or softer?", ex: "from suspicion to open accusation" },
  ],

  /* ---------- 04.1 Reference regimes: map steps and cards ---------- */
  regimes: [
    {
      id: "overview",
      name: "Three reference regimes, one case",
      tag: "Overview",
      focus: [[-9, 35.5], [53, 61.5]],
      points: [
        "Russia, Belarus and Hungary are reference points in this thesis, not full comparative cases. They serve to recognise patterns.",
        "The lines on the map are shared repertoires that the thesis identifies. They are not proof of instructions.",
      ],
    },
    {
      id: "russia",
      name: "Russia",
      tag: "The gravity center",
      focus: [[19, 41], [62, 63]],
      points: [
        "Stability and order are presented as the highest political good. Liberal democracy is linked to chaos.",
        "“Sovereign democracy”: sovereignty works as a shield against the West, and protest is read as a foreign plot.",
        "The original foreign agents framework, introduced in 2012 and widened from NGOs to media and individuals.",
        "“Traditional values” as a moral order that the state must protect from a Western agenda.",
        "The war narrative: the West uses Ukraine as an instrument, and Russia is only defending itself.",
      ],
    },
    {
      id: "belarus",
      name: "Belarus",
      tag: "The testing ground",
      focus: [[12, 45.5], [42, 59]],
      points: [
        "Long-term pressure on civil society. Since 2011, breaking the rules on foreign aid has been a criminal matter.",
        "The “collective West” conspiracy: protesters, opposition and NGOs are described as pawns of foreign actors.",
        "Ukraine’s Euromaidan is used as a warning: a pro-Western path ends in war.",
        "The regime survived the 2020 protests with Russian support in media and finance, and possibly in security.",
        "It presents itself as a peace seeker.",
      ],
    },
    {
      id: "hungary",
      name: "Hungary",
      tag: "Illiberalism inside the EU",
      focus: [[4, 40.5], [32, 54]],
      points: [
        "Sovereignty against “Brussels”: disputes over the rule of law are presented as foreign domination.",
        "Family, children and moral-panic narratives are used against a “liberal agenda”.",
        "Critical NGOs and media are framed as agents of foreign influence.",
        "EU sanctions on Russia are framed as “dragging Hungary into war”. Staying out is presented as responsible.",
        "The goal is to reform the EU, not to leave it.",
      ],
    },
    {
      id: "georgia",
      name: "Georgia",
      tag: "The contradiction",
      focus: [[32, 37.5], [53, 47.5]],
      points: [
        "Not Belarus: Georgia has stronger ties with Western partners and a security set-up more distant from Russia.",
        "Not Hungary: Georgia is not an EU member, so it cannot weaken the EU from inside.",
        "Its strategy is contradictory: pro-EU language, combined with laws and narratives that make integration impossible.",
        "The ruling party selectively adapts Russia-compatible narratives and adjusts them to the Georgian context.",
      ],
    },
  ],

  /* Arcs on the map. kind: "documented" (solid) or "inferred" (dashed) */
  arcs: [
    { from: "Moscow", to: "Minsk", kind: "documented", note: "Cooperation and support, documented in the literature" },
    { from: "Moscow", to: "Tbilisi", kind: "inferred", note: "Same repertoire, inferred from timing and logic" },
    { from: "Moscow", to: "Budapest", kind: "inferred", note: "Russia-compatible narratives" },
    { from: "Budapest", to: "Tbilisi", kind: "inferred", note: "Cited by Georgian Dream as a model" },
  ],

  /* ---------- 04.1 Narrative matrix ----------
     value: 2 = documented in the thesis, 1 = related foundations only, 0 = not documented in the thesis */
  matrix: {
    cols: [
      { id: "ru", name: "Russia", short: "RU" },
      { id: "by", name: "Belarus", short: "BY" },
      { id: "hu", name: "Hungary", short: "HU" },
      { id: "ge", name: "Georgia", short: "GE" },
    ],
    rows: [
      {
        name: "War and peace",
        cells: [
          [2, "The invasion is framed as forced and defensive. The West is said to use Ukraine as an instrument."],
          [2, "Belarus as a peaceful country and peacekeeper. Ukraine’s losses are shown as a warning."],
          [2, "“Staying out” of the war. Sanctions are framed as dragging Hungary in."],
          [2, "Georgian Dream as the only guarantor of peace. Critics become a “war party”."],
        ],
      },
      {
        name: "Sovereignty",
        cells: [
          [2, "“Sovereign democracy” as a shield against Western hegemony."],
          [2, "A state under siege. Protest is framed as a foreign attempt to undermine sovereignty."],
          [2, "National self-determination against “Brussels”."],
          [2, "Western criticism is framed as interference. By 2024 sovereignty is the main argument for the law."],
        ],
      },
      {
        name: "Foreign agents and foreign influence",
        cells: [
          [2, "The original framework, introduced in 2012."],
          [2, "Rules on foreign aid with criminal liability since 2011. The opposition as pawns of foreign actors."],
          [2, "Critical NGOs and media are framed as agents of foreign influence, with measures against them."],
          [2, "Two “Foreign Agents” bills, in 2023 and 2024."],
        ],
      },
      {
        name: "Traditional values",
        cells: [
          [2, "A moral order the state protects. Anti-LGBT narratives are framed as resistance to the West."],
          [0, "Not covered in the thesis’s review of Belarus."],
          [2, "Moral panics over children, family and gender."],
          [2, "Family values and anti-LGBT rhetoric are used against the West."],
        ],
      },
      {
        name: "“Real Europe” against Brussels",
        cells: [
          [1, "No “real Europe” claim. The thesis finds the foundations here: narratives against democracy promotion and minority rights."],
          [1, "Foundations only: Western actors are blamed for sponsoring protest and regime change."],
          [2, "The government as defender of “real” Europe against liberalism."],
          [2, "A desirable Europe is separated from the “current” one, run by a “Brussels bureaucracy”."],
        ],
      },
      {
        name: "Protest as a foreign plot",
        cells: [
          [2, "Protest and criticism are read as evidence of an external agenda."],
          [2, "The 2020 protests are framed as Western-run. Euromaidan is the warning."],
          [0, "The thesis’s review of Hungary covers NGOs and media, not street protest."],
          [2, "Protests are framed as foreign-funded and revolutionary: “Natsmaidani”."],
        ],
      },
    ],
  },

  /* ---------- 04.2 Four checkpoints ---------- */
  checkpoints: [
    {
      date: "24 Feb 2022",
      title: "Start of the war in Ukraine",
      frame: "Peace, national interests, no sanctions",
      enemy: "Domestic “radicals” who want war",
      intensity: 1,
      intensityLabel: "Soft at first, then “war party” language",
      disc: 0.45, formal: 0.25,
      body: [
        "The first statements express solidarity with Ukraine. In practice the government keeps its distance. Prime Minister Irakli Gharibashvili announces that Georgia will not join sanctions against Russia. The reason he gives is “national interests”.",
        "The war is quickly turned inward. The opposition United National Movement (UNM) is tied to former president Saakashvili’s “mistakes” in the 2008 war and accused of wanting to open a “second front” in Georgia. Georgian Dream presents itself as the only actor able to keep the peace.",
        "Criticism of the West is still mild. It is suspicion, not open hostility. The party keeps its pro-European vocabulary and calls EU membership a “civilizational choice”.",
      ],
      quote: {
        text: "There is a direct expressed desire on the part of the Ukrainian authorities for Georgia to become a second front.",
        who: "Irakli Kobakhidze",
        when: "21 July 2022",
        context: "On the Ukrainian government",
      },
    },
    {
      date: "14 Feb 2023",
      title: "First “Foreign Agents Law”",
      frame: "Transparency against foreign influence",
      enemy: "Domestic actors under foreign control",
      intensity: 2,
      intensityLabel: "Direct, stable, accusatory",
      disc: 0.58, formal: 0.25,
      body: [
        "Suspicion becomes an institutional frame. The words “agents” and “spies” are used about opponents as if they were normal vocabulary. The bill is defended with “transparency” and with the American Foreign Agents Registration Act (FARA), which the party calls its model. The public gives the bill another name: the “Russian law”.",
        "The enemy changes. Before, it was domestic radicals who wanted war. Now it is domestic actors controlled from abroad. Protesters, NGOs, the opposition and Western actors are joined into one chain. The opposition is called radical, extremist, fascist.",
        "The first bill was withdrawn. The label stayed. Georgia later received EU candidate status.",
      ],
      quote: {
        text: "In fact, it happened that another agent pardoned one agent. This proves that there are forces that want to incite polarization in Georgia.",
        who: "Irakli Kobakhidze",
        when: "24 June 2023",
        context: "On a pardon granted by the president",
      },
    },
    {
      date: "3 Apr 2024",
      title: "Second “Foreign Agents Law”",
      frame: "Sovereignty, dignity, no interference",
      enemy: "One “collective national movement”",
      intensity: 3,
      intensityLabel: "Sharper, totalizing",
      disc: 0.72, formal: 0.3,
      body: [
        "Irakli Kobakhidze is now prime minister. Elections are due in October 2024 and are framed as a choice between the West and Russia, between war and peace. The bill returns as part of the campaign.",
        "Protesters are described as traitors. Western diplomats are accused of interference. The law is no longer defended mainly as transparency. It becomes a defence of sovereignty, and even a condition for joining the EU. NGOs, movements and opposition parties are merged into a single “collective national movement”. Arguments about LGBT issues and family values are added.",
        "Campaign banners set a “destroyed Ukraine” beside a “developed Georgia”, with the message “No to war, choose Peace”. The opposition parties appear on the side of war.",
      ],
      quote: {
        text: "The main goal [of Resolution] is to facilitate the processes that failed in 2022.",
        who: "Irakli Kobakhidze",
        when: "26 April 2024",
        context: "On a European Parliament resolution about the law",
      },
    },
    {
      date: "28 Nov 2024",
      title: "EU integration suspended",
      frame: "EU blackmail, Deep State",
      enemy: "The “Global War Party” and the “Deep State”",
      intensity: 4,
      intensityLabel: "The peak",
      disc: 0.86, formal: null,
      body: [
        "A few hours after the European Parliament adopts a critical resolution on the elections, Kobakhidze suspends EU integration until 2028. Mass protests follow. They now include unaffiliated citizens and civil servants.",
        "The EU is accused of “blackmail”. The EU ambassador is accused of siding with the radical opposition, the US ambassador of supporting violence. The “Global War Party” is joined by a new idea, the “Deep State”. The split is selective: the Biden administration is the enemy, while a Trump administration is expected to stabilise relations.",
        "The protest is renamed “Natsmaidani”, a blend of the United National Movement’s name and Ukraine’s Euromaidan. New protest rules, such as a ban on face coverings, are presented as urgent. The prime minister says the government plans to ban opposition parties.",
      ],
      quote: {
        text: "In addition to the fact that foreign funding was involved in the attempt to organize this “Natsmaidani”, this involvement was also absolutely coordinated.",
        who: "Irakli Kobakhidze",
        when: "3 December 2024",
        context: "On the protests",
      },
    },
  ],

  /* ---------- Deep dive: three laws compared ----------
     interp: true marks a cell that is the author's or an interviewee's interpretation */
  lawCompare: {
    cols: ["US FARA", "Russia’s law", "Georgia’s law"],
    rows: [
      {
        dim: "Origin",
        cells: [
          { t: "Adopted in 1938, against Nazi propaganda." },
          { t: "Introduced in 2012 and expanded several times." },
          { t: "First bill in February 2023, withdrawn. Second bill in April 2024. Labelling rules in effect by summer 2024." },
        ],
      },
      {
        dim: "What triggers the label",
        cells: [
          { t: "Proof of a relationship between a foreign principal and its agent." },
          { t: "A foreign link is presumed to compromise independence. No proof of foreign control is needed. Since 2022 even foreign funding is not required." },
          { t: "Foreign funding is treated as foreign influence. The thesis reads this as the Russian presumption, not the American test.", interp: true },
        ],
      },
      {
        dim: "“Political activity”",
        cells: [
          { t: "Not assessed in the thesis." },
          { t: "Vague and widened over time. Even ecological advocacy can count if the authorities decide so." },
          { t: "Vague as well, which leaves room for selective enforcement." },
        ],
      },
      {
        dim: "The label",
        cells: [
          { t: "Meant to make foreign influence visible, in order to defend democracy.", interp: true },
          { t: "“Foreign agent” was chosen for its echo of espionage and betrayal in Soviet memory." },
          { t: "The same label, with the same post-Soviet echo. The public called the bill the “Russian law”." },
        ],
      },
      {
        dim: "Stated justification",
        cells: [
          { t: "Transparency." },
          { t: "Sovereignty, transparency, and “the Americans have FARA”." },
          { t: "Transparency and “a copy of the American law” in 2023. Sovereignty by 2024." },
        ],
      },
      {
        dim: "Who is hit in practice",
        cells: [
          { t: "Not assessed in the thesis. One interviewee notes that FARA is not perfect either." },
          { t: "NGOs first, then media and individuals. Enforcement is politically selective." },
          { t: "NGOs, media and watchdogs, including election observers." },
        ],
      },
      {
        dim: "Where the thesis lands",
        cells: [
          { t: "A different kind of law." },
          { t: "The model." },
          { t: "Much closer to Russia’s law than to FARA, and in some respects stricter.", interp: true },
        ],
      },
    ],
  },

  lawFlow: [
    { step: "Label", text: "An organisation that receives foreign funding must register and carry the label." },
    { step: "Stigmatize", text: "In post-Soviet memory the word means spy and traitor." },
    { step: "Isolate", text: "Donors lose interest. Members become afraid." },
    { step: "Damage credibility", text: "Criticism from NGOs and media is dismissed as a foreign agenda." },
    { step: "Make repression look acceptable", text: "“Foreign agent arrested” reads differently from “human rights defender arrested”." },
  ],

  /* ---------- 04.3 Experts ---------- */
  experts: [
    {
      name: "Lia Gurchiani",
      aff: "UC Davis School of Law",
      exp: "“Foreign Agents” legislation",
      date: "24 Mar 2026",
      take: "A law is a living organism. The same text produces different effects in different regimes, so “the Americans have one too” proves nothing. In her reading the Georgian version is closer to the Russian one, and in several respects more repressive. Its main mechanism is stigma: it does not need to ban anyone to work.",
    },
    {
      name: "Giorgi Badridze",
      aff: "GFSIS; former diplomat",
      exp: "Georgian foreign policy and Euro-Atlantic integration",
      date: "25 Mar 2026",
      take: "Georgian Dream’s Europeanism was tactical, a phase of imitating pro-Western policy. The façade fell when EU integration stopped being symbolic and started to demand real reform. He sees the Foreign Agents Law as a litmus test of authoritarian learning: the legal tool and its public defence are close to the Russian ones, sometimes word for word.",
    },
    {
      name: "Amelie Tolvin",
      aff: "University of Toronto",
      exp: "Authoritarianism in Belarus, protest repression",
      date: "26 Mar 2026",
      take: "Lukashenko survived the 2020 protests not only through force but through Russian support in media and finance, and possibly in coercion. Afterwards Belarus’s autonomy narrowed, and the country became a platform for Russia’s war against Ukraine.",
    },
    {
      name: "Giga Bokeria",
      aff: "Chair, “Federalists”",
      exp: "Former Secretary of the National Security Council",
      date: "26 Mar 2026",
      take: "2022 was a leap, not a beginning. The ruling party’s message can be reduced to one promise: whatever we are, while we are here there will be no war. Peace is made conditional on giving up freedom. He calls the result a sovereignty paradox: defending sovereignty against the West while becoming vulnerable to Russia.",
    },
    {
      name: "Anastasya Zavyalova",
      aff: "Rice University",
      exp: "“Foreign Agents” legislation",
      date: "27 Mar 2026",
      take: "The Russian model rests on two unclear criteria: foreign funding and political activity. The vagueness is the point, because it gives the state discretion. Stigma is itself a form of control. It isolates organisations, frightens members, and prepares the public to accept repression.",
    },
    {
      name: "Tinatin Inauri",
      aff: "Central European University",
      exp: "Georgian Dream’s discourse and illiberal political communication",
      date: "30 Mar 2026",
      take: "The soft, pro-European tone lasted as long as international legitimacy mattered. After 2022 that need weakened. The party used an existing fear of war and turned it into a reason to accept everything else: “at least there is peace”. Her advice is to watch the language closely, because it leaks intentions.",
    },
    {
      name: "Ghia Nodia",
      aff: "Caucasian Institute for Peace, Democracy and Development; Ilia State University",
      exp: "Former Minister of Education; comparative politics",
      date: "30 Mar 2026",
      take: "The Foreign Agents Law is the most visible example of learning from Russia. Georgia is repeating Russia’s path at a faster pace. He describes a mutually useful exchange: Russia gains an anti-Western Georgia, and Georgian Dream gains survival. One could argue the ideas were invented independently, but he finds it far more logical that they were learned.",
    },
    {
      name: "Stephen G. F. Hall",
      aff: "University of Bath",
      exp: "Scholar of authoritarian learning",
      date: "31 Mar 2026",
      take: "Do not look for a smoking gun. There will be no direct evidence until regimes change and archives open. Follow the logic and the sequence instead, and keep the claim explanatory, not conclusive. Discourse alone is weak evidence, because similar narratives appear in many illiberal settings. It has to be read together with laws and practice.",
    },
    {
      name: "Givi Targamadze",
      aff: "United National Movement",
      exp: "Former Chair of Parliament’s Defense and Security Committee",
      date: "17 Apr 2026",
      take: "In his view the war exposed a choice that had been made earlier. He traces it to changes in the security sector after 2012. He also points to speed: laws and practices that took Russia and Belarus years appeared in Georgia much faster. From Belarus he draws a warning: survival backed by Russia leaves a ruler less room to move.",
    },
  ],

  /* ---------- 05 Findings: the playbook (Diagram E) ---------- */
  playbook: [
    { word: "Peace", did: "justified settlement with Russia and suspicion of the opposition" },
    { word: "Sovereignty", did: "justified the anti-Western turn" },
    { word: "Transparency", did: "justified the Foreign Agents Law" },
    { word: "Traditions", did: "justified a change of civilizational direction" },
  ],
  playbookSeal: { word: "Conspiracy theories", did: "made all of the above sound unquestionable" },

  /* ---------- About: career map ---------- */
  places: [
    {
      city: "Tbilisi", lon: 44.79, lat: 41.72, hub: true,
      roles: [
        "Political Analyst, TV Formula, “Droeba”",
        "Intern/Researcher, Georgian Parliamentary Research Center",
        "Intern, Ministry of Economy and Sustainable Development",
        "BA Political Science, Tbilisi State University",
      ],
    },
    { city: "Tartu", lon: 26.72, lat: 58.38, roles: ["MSc Politics and Governance in the Digital Age, University of Tartu"], side: "right" },
    { city: "Tallinn", lon: 24.75, lat: 59.44, roles: ["Intern, Konrad-Adenauer-Stiftung Baltic Office"], side: "left" },
    { city: "Vilnius", lon: 25.28, lat: 54.69, roles: ["Research Assistant, Visionary Analytics"], side: "left" },
    { city: "Bologna", lon: 11.34, lat: 44.49, roles: ["Erasmus+ semester, University of Bologna"], side: "left" },
  ],

  /* ---------- About: experience and education ---------- */
  cv: [
    { when: "2026 to present", what: "Political Analyst", where: "TV Formula, “Droeba” (Tbilisi)" },
    { when: "2024 to 2026", what: "MSc Politics and Governance in the Digital Age", where: "University of Tartu" },
    { when: "2025 to 2026", what: "Erasmus+ semester, Political Science", where: "University of Bologna" },
    { when: "2025", what: "Research Assistant", where: "Visionary Analytics (Vilnius), Innovation, Research and Development" },
    { when: "2025", what: "Intern", where: "Konrad-Adenauer-Stiftung Baltic Office (Tallinn)" },
    { when: "2024", what: "Intern/Researcher", where: "Georgian Parliamentary Research Center (USAID National Governance Program)" },
    { when: "2023", what: "Intern", where: "Ministry of Economy and Sustainable Development, Economic Analysis and Reforms Department" },
    { when: "2021", what: "Intern", where: "Civil Service Bureau, Analytical Department" },
    { when: "2020 to 2024", what: "BA Political Science", where: "Tbilisi State University (scholarship). Thesis on public skepticism toward the funded pension system in Georgia" },
    { when: "2019 to 2022", what: "Founder and CEO", where: "Lazieri, an education initiative with 300+ young participants" },
  ],

  skills: [
    "Qualitative methods: CDA, expert interviews, focus groups",
    "Quantitative analysis and survey design",
    "Policy briefs",
    "Data visualization",
    "Political writing",
  ],
};
