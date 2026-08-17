// One-off content seed: loads the previously-drafted, user-approved module
// content (see the delivered module-content-draft.md) into the DB, and
// expands each module from its single placeholder "Reading" step into a
// fuller ~7-step lesson (several readings, a video, and a comprehension
// quiz), so the platform can be previewed at realistic depth. Explicitly a
// placeholder curriculum per the user, not the final one — quiz questions
// are grounded only in the drafted text below, and the reused video id is
// the one real, oEmbed-verified test video already in the DB (no new
// unverified IDs are introduced).
//
// Preserves the two existing real completions (Welcome to Ubuntu's video +
// reading, Module 1's reading) by updating those rows in place rather than
// deleting/recreating them. Idempotent: skips any module that already has
// more than its original 1-2 steps.
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEMO_VIDEO = { videoProvider: "youtube", videoId: "TTIAqeoduP0" };

const CONTENT = {
  "Welcome to Ubuntu": {
    keepExisting: true,
    updateFirstText: {
      title: "Our Philosophy",
      contentMarkdown: `Ubuntu is Mikaelson Institute's free, cohort-based learning program in African history. There's no tuition and no application fee — the only cost is your time and attention.

**I am because we are.**

That's the philosophy this program is built on. At MIAS, knowledge doesn't exist only for the person who discovers it — it has to strengthen the community around it. It can preserve a memory institutions tried to erase. It can give language to an experience that was previously unutterable. It can help a generation understand itself and its place in history.`,
    },
    newSteps: [
      {
        type: "text",
        title: "Our Goal",
        contentMarkdown:
          "This cohort is one part of a much larger goal: reaching 10,000,000 students and researchers across the continent and its diaspora, building a shared, rigorous foundation in African history and thought.",
      },
      {
        type: "text",
        title: "What's Ahead",
        contentMarkdown: `This cohort walks through five modules, following a single chronological throughline:

1. **Pre-Colonial** — African societies and states before European contact
2. **Contact** — early trade, exploration, and the arrival of European powers
3. **Colonial** — the imposition and administration of colonial rule
4. **Independence** — anti-colonial movements and the transition to sovereign states
5. **Contemporary** — the present continent, shaped by and reckoning with this history

A **Final Assessment** closes out the cohort — a chance to bring together what the five modules covered.`,
      },
      {
        type: "text",
        title: "How This Works",
        contentMarkdown:
          "Modules unlock in order, on the schedule your cohort sets. Each one has reading, and sometimes a short video, alongside it. When you've worked through a module, mark it complete — that unlocks your progress toward finishing the cohort, and updates the progress bar you see in your Space.\n\nTake your time with each one. This isn't a race.",
      },
      {
        type: "quiz",
        title: "Getting Started Check",
        quizData: {
          passingScore: 1,
          questions: [
            {
              id: "q1",
              prompt: "What philosophy is this program built on?",
              options: [
                { id: "a", text: "Ubuntu — “I am because we are”", isCorrect: true },
                { id: "b", text: "Meritocracy", isCorrect: false },
                { id: "c", text: "Manifest Destiny", isCorrect: false },
                { id: "d", text: "Social Darwinism", isCorrect: false },
              ],
            },
            {
              id: "q2",
              prompt: "How many modules come before the Final Assessment in this cohort?",
              options: [
                { id: "a", text: "Three", isCorrect: false },
                { id: "b", text: "Five", isCorrect: true },
                { id: "c", text: "Seven", isCorrect: false },
                { id: "d", text: "Ten", isCorrect: false },
              ],
            },
          ],
        },
      },
    ],
  },

  "Module 1": {
    updateFirstText: {
      title: "Overview",
      contentMarkdown:
        "The most important thing to unlearn first: African history did not begin with European contact. By the time European ships reached West African shores in the 1400s, the continent already held centuries of state-building, scholarship, trade, and religious life — at a scale and sophistication that colonial-era writing worked hard to erase from memory.",
    },
    newSteps: [
      {
        type: "text",
        title: "Scale and Diversity",
        contentMarkdown:
          '"Pre-colonial Africa" is not one place or one story. It spans the pharaonic civilizations of the Nile Valley; the trading empires of the West African Sahel — Ghana, Mali, and Songhai, each rising and falling across roughly a thousand years; the stone architecture of Great Zimbabwe in the south; the ancient Christian kingdom of Aksum in the northeast; the Kongo Kingdom in the west-central rainforest; and the Swahili city-states — Kilwa, Mombasa, Zanzibar — that linked the eastern coast to Indian Ocean trade routes reaching as far as India and China.',
      },
      {
        type: "text",
        title: "Governance and Trade",
        contentMarkdown:
          "These were not simple or static societies. Mali under Sundiata Keita and later Mansa Musa controlled trans-Saharan gold and salt trade on a scale that reshaped Mediterranean economies. Timbuktu, part of the Songhai Empire, held one of the world's great manuscript traditions — tens of thousands of texts on law, astronomy, medicine, and theology, many still being catalogued today.",
      },
      {
        type: "text",
        title: "Knowledge and Memory",
        contentMarkdown:
          'Not everything was written down, and that matters: oral tradition — griots, praise-singers, lineage historians — functioned as a rigorous historiographical method in societies where memory was a trained, transmitted discipline, not an informal afterthought. Treating "no written record" as "no history" is itself a colonial-era bias this module wants you to notice and set aside.',
      },
      {
        type: "text",
        title: "Why This Module Comes First",
        contentMarkdown:
          "Every stage that follows — contact, colonization, independence, the present — is a disruption of *something*. Understanding what that something was is the whole point of starting here.",
      },
      { type: "video", title: "Module Overview Video", ...DEMO_VIDEO },
      {
        type: "quiz",
        title: "Comprehension Check",
        quizData: {
          passingScore: 1,
          questions: [
            {
              id: "q1",
              prompt:
                "Which West African empire's ruler, Mansa Musa, reshaped Mediterranean economies through trans-Saharan gold and salt trade?",
              options: [
                { id: "a", text: "Mali", isCorrect: true },
                { id: "b", text: "Aksum", isCorrect: false },
                { id: "c", text: "Kongo", isCorrect: false },
                { id: "d", text: "Great Zimbabwe", isCorrect: false },
              ],
            },
            {
              id: "q2",
              prompt: "What role did griots and praise-singers play, according to this module?",
              options: [
                { id: "a", text: "A trained, transmitted method of recording history orally", isCorrect: true },
                { id: "b", text: "Ceremonial entertainment with no historical value", isCorrect: false },
                { id: "c", text: "Enforcers of colonial law", isCorrect: false },
                { id: "d", text: "Record-keepers for trans-Saharan trade only", isCorrect: false },
              ],
            },
          ],
        },
      },
    ],
  },

  "Module 2": {
    updateFirstText: {
      title: "Overview",
      contentMarkdown:
        '"Contact" is a deceptively simple word for a process that unfolded over roughly four centuries, at wildly different speeds and with wildly different consequences depending on where in Africa you were standing.',
    },
    newSteps: [
      {
        type: "text",
        title: "Before European Ships",
        contentMarkdown:
          "Long before Portuguese caravels reached the West African coast in the 1440s, Africa already had extensive trade contact with the outside world — trans-Saharan caravan routes into North Africa and the Mediterranean, and Indian Ocean trade linking the Swahili coast to Arabia, Persia, India, and China. Contact with outsiders was not new. What changed was who was arriving, and what they wanted.",
      },
      {
        type: "text",
        title: "From Trade to Extraction",
        contentMarkdown:
          "Early Portuguese, then Dutch, English, and French contact along the coasts began, in many places, as trade between relative equals — gold, ivory, textiles, pepper. That relationship deformed over the following two centuries into something else entirely: the transatlantic slave trade, which forcibly transported an estimated 12-15 million people from Africa to the Americas between the 16th and 19th centuries. This was not incidental to contact — for many coastal societies, it became the dominant economic and political fact of the era, reshaping local power structures, warfare, and politics in ways still being studied.",
      },
      {
        type: "text",
        title: "Uneven and Contested",
        contentMarkdown:
          "This module resists a single narrative arc. Some societies profited from the trade as intermediaries; others were devastated by it. Some regions had almost no direct contact with Europeans until the 19th century. Resistance took many forms — military, diplomatic, and the quieter resistance of maintaining language, religion, and social structure under pressure.",
      },
      {
        type: "text",
        title: "Why This Matters Going In",
        contentMarkdown:
          'The colonial period that follows is often taught as though it starts from nothing. It doesn\'t. The relationships, resentments, dependencies, and power imbalances built during centuries of "contact" are the foundation colonialism was built on top of.',
      },
      { type: "video", title: "Module Overview Video", ...DEMO_VIDEO },
      {
        type: "quiz",
        title: "Comprehension Check",
        quizData: {
          passingScore: 1,
          questions: [
            {
              id: "q1",
              prompt: "Before European ships arrived, Africa's outside contact came primarily through which trade networks?",
              options: [
                { id: "a", text: "Trans-Saharan and Indian Ocean trade routes", isCorrect: true },
                { id: "b", text: "Only Atlantic trade with Europe", isCorrect: false },
                { id: "c", text: "No prior outside contact existed", isCorrect: false },
                { id: "d", text: "Trade exclusively with the Americas", isCorrect: false },
              ],
            },
            {
              id: "q2",
              prompt:
                "Roughly how many people does this module estimate were forcibly transported in the transatlantic slave trade?",
              options: [
                { id: "a", text: "1-2 million", isCorrect: false },
                { id: "b", text: "12-15 million", isCorrect: true },
                { id: "c", text: "50-60 million", isCorrect: false },
                { id: "d", text: "Under 500,000", isCorrect: false },
              ],
            },
          ],
        },
      },
    ],
  },

  "Module 3": {
    updateFirstText: {
      title: "Overview",
      contentMarkdown:
        "At the 1884-85 Berlin Conference, European powers divided almost the entire African continent among themselves — without a single African representative in the room. Borders were drawn with rulers and compasses, cutting through existing kingdoms, ethnic groups, and trade networks, with little regard for who actually lived where. Many of today's national borders are a direct legacy of that conference.",
    },
    newSteps: [
      {
        type: "text",
        title: "How Colonial Rule Actually Worked",
        contentMarkdown:
          'Colonial administration took different forms — French and Portuguese "direct rule" governed through colonial officials embedded at every level; British "indirect rule" governed through existing local authorities, co-opted or installed, answering to colonial administrators. Both extracted: cash-crop agriculture replaced diversified local economies, forced labor built colonial infrastructure, and taxation compelled participation in colonial economic systems whether or not people chose it.',
      },
      {
        type: "text",
        title: "Beyond the Economic",
        contentMarkdown:
          "Colonial rule didn't stop at extraction. Missionary education systems, often the only schooling available, taught colonial languages and colonial versions of history. Legal systems criminalized or marginalized existing religious and social practices. This is the “decolonization” half of MIAS's own name — the recognition that colonialism's effects on how Africans were taught to see their own history and culture outlasted colonial administration itself.",
      },
      {
        type: "text",
        title: "Resistance Was Constant, Not Occasional",
        contentMarkdown:
          "From early armed resistance movements at the point of conquest, through labor strikes, religious movements, and political organizing in the 20th century, no colonial territory was without resistance. The following module — Independence — didn't emerge from nowhere; it's the culmination of resistance that had been building for decades.",
      },
      {
        type: "text",
        title: "Long Shadows",
        contentMarkdown:
          "Arbitrary borders, export-oriented economies, and education systems built during this period didn't disappear at independence. Much of what Module 5 discusses under “contemporary” traces back to structural decisions made during this era.",
      },
      { type: "video", title: "Module Overview Video", ...DEMO_VIDEO },
      {
        type: "quiz",
        title: "Comprehension Check",
        quizData: {
          passingScore: 1,
          questions: [
            {
              id: "q1",
              prompt:
                "At which 1884-85 conference did European powers divide the African continent without African representation?",
              options: [
                { id: "a", text: "The Berlin Conference", isCorrect: true },
                { id: "b", text: "The Congress of Vienna", isCorrect: false },
                { id: "c", text: "The Paris Peace Conference", isCorrect: false },
                { id: "d", text: "The Bandung Conference", isCorrect: false },
              ],
            },
            {
              id: "q2",
              prompt: "What distinguished British “indirect rule” from French and Portuguese “direct rule”?",
              options: [
                {
                  id: "a",
                  text: "It governed through existing local authorities co-opted by colonial administrators",
                  isCorrect: true,
                },
                { id: "b", text: "It abolished all local leadership structures", isCorrect: false },
                { id: "c", text: "It granted full self-governance immediately", isCorrect: false },
                { id: "d", text: "It relied solely on missionary schools for administration", isCorrect: false },
              ],
            },
          ],
        },
      },
    ],
  },

  "Module 4": {
    updateFirstText: {
      title: "Overview",
      contentMarkdown:
        "Between 1957 (Ghana) and the early 1990s (with South Africa's apartheid ending in 1994), the vast majority of Africa's colonial territories became sovereign states — one of the most rapid political transformations in modern history.",
    },
    newSteps: [
      {
        type: "text",
        title: "Not One Story",
        contentMarkdown:
          "Independence arrived by many different paths. Some, like Ghana under Kwame Nkrumah, were achieved through sustained political organizing and negotiation. Others, like Algeria's independence from France or the wars that ended Portuguese colonial rule in Angola and Mozambique, came through prolonged armed struggle. The differences in *how* independence was won shaped what kind of state emerged afterward.",
      },
      {
        type: "text",
        title: "Pan-Africanism as an Idea, Not Just a Slogan",
        contentMarkdown:
          "Independence-era thinkers — Nkrumah, Julius Nyerere in Tanzania, Frantz Fanon writing from the Algerian struggle, and many others — argued independence on paper meant little without economic and intellectual independence too. The Organisation of African Unity, founded in 1963, was a direct institutional expression of that argument: African states insisting on continental solidarity in a world still organized around former colonial relationships.",
      },
      {
        type: "text",
        title: "Independence Didn't Mean a Clean Break",
        contentMarkdown:
          "Cold War pressure pulled newly sovereign states toward alignment with the US or USSR, often destabilizing them in the process. Economic structures built to export raw materials to former colonizers didn't disappear just because political control did — a dependency many economists argue persists in different forms today. Some states inherited functioning institutions; others inherited borders and bureaucracies built for extraction, not self-governance.",
      },
      {
        type: "text",
        title: "What to Carry Into the Next Module",
        contentMarkdown:
          "The optimism of the independence era, and the very real structural constraints that optimism ran into, are both part of the story. Module 5 picks up from here — not as a story of failure, but as a continent still actively working through what full sovereignty actually requires.",
      },
      { type: "video", title: "Module Overview Video", ...DEMO_VIDEO },
      {
        type: "quiz",
        title: "Comprehension Check",
        quizData: {
          passingScore: 1,
          questions: [
            {
              id: "q1",
              prompt: "Which country is cited as achieving independence first, in 1957, under Kwame Nkrumah?",
              options: [
                { id: "a", text: "Ghana", isCorrect: true },
                { id: "b", text: "Algeria", isCorrect: false },
                { id: "c", text: "South Africa", isCorrect: false },
                { id: "d", text: "Tanzania", isCorrect: false },
              ],
            },
            {
              id: "q2",
              prompt: "What institution, founded in 1963, expressed the Pan-Africanist argument for continental solidarity?",
              options: [
                { id: "a", text: "The Organisation of African Unity", isCorrect: true },
                { id: "b", text: "The United Nations", isCorrect: false },
                { id: "c", text: "The Berlin Conference", isCorrect: false },
                { id: "d", text: "The Non-Aligned Movement", isCorrect: false },
              ],
            },
          ],
        },
      },
    ],
  },

  "Module 5": {
    updateFirstText: {
      title: "Overview",
      contentMarkdown:
        'The temptation with "contemporary Africa" is to reach for a single narrative — crisis, or triumph, or an emerging market pitch. All three miss the point. This module asks you to hold complexity instead: 54 countries, over a billion people, an enormous range of political systems, economic trajectories, and lived realities, all shaped by — and actively working through — everything the previous four modules covered.',
    },
    newSteps: [
      {
        type: "text",
        title: "Demographic Weight",
        contentMarkdown:
          "Africa has the youngest population of any continent and is projected to hold a substantial share of the world's population growth this century. That's not a footnote — it's arguably the single most consequential fact about the continent's next fifty years, for Africa and the world.",
      },
      {
        type: "text",
        title: "Decolonization as Unfinished, Ongoing Work",
        contentMarkdown:
          "This is the throughline of MIAS's own name and mission. Debates over the restitution of looted cultural artifacts held in European museums, campaigns to decolonize university curricula still teaching colonial-era historical framing, and movements to build African-language scholarship and publishing are not symbolic gestures — they're direct continuations of the disruption Module 3 described.",
      },
      {
        type: "text",
        title: "Agency, Not Just Aftermath",
        contentMarkdown:
          "Contemporary Africa is not only a continent processing its past. It's home to some of the world's fastest-growing economies, a globally influential diaspora, rapidly growing creative and tech industries, and intellectual movements actively producing new African scholarship rather than only responding to old external narratives about the continent.",
      },
      {
        type: "text",
        title: "Where This Leaves You",
        contentMarkdown:
          "This module — and this cohort — isn't really about memorizing dates and names. It's about being equipped to think clearly about how the past four stages produced the present one, and where you might place yourself in whatever comes after it.",
      },
      { type: "video", title: "Module Overview Video", ...DEMO_VIDEO },
      {
        type: "quiz",
        title: "Comprehension Check",
        quizData: {
          passingScore: 1,
          questions: [
            {
              id: "q1",
              prompt:
                "According to this module, what is arguably the most consequential demographic fact about Africa's next fifty years?",
              options: [
                { id: "a", text: "It has the youngest population of any continent", isCorrect: true },
                { id: "b", text: "It has the oldest population of any continent", isCorrect: false },
                { id: "c", text: "Its population is shrinking rapidly", isCorrect: false },
                { id: "d", text: "It has the smallest population of any continent", isCorrect: false },
              ],
            },
            {
              id: "q2",
              prompt:
                "Campaigns to decolonize curricula and restitute looted artifacts are described as direct continuations of which module's disruption?",
              options: [
                { id: "a", text: "Module 3 (Colonial)", isCorrect: true },
                { id: "b", text: "Module 1 (Pre-Colonial)", isCorrect: false },
                { id: "c", text: "Module 4 (Independence)", isCorrect: false },
                { id: "d", text: "This assessment itself", isCorrect: false },
              ],
            },
          ],
        },
      },
    ],
  },

  "Final Assessment": {
    updateFirstText: {
      title: "Instructions",
      contentMarkdown:
        "You've moved through five stages spanning centuries — Pre-Colonial, Contact, Colonial, Independence, and Contemporary. This assessment isn't a quiz with a single right answer. It's a chance to show you can connect them.",
    },
    newSteps: [
      {
        type: "text",
        title: "Question 1: Pre-Colonial Reflection",
        contentMarkdown:
          "Choose one idea, event, or figure from **Module 1 (Pre-Colonial)** that changed how you think about Africa before European contact. Why did it stand out to you?",
      },
      {
        type: "text",
        title: "Question 2: Tracing a Thread",
        contentMarkdown:
          "Trace a single thread from **Module 2 through Module 4** — something (an economic pattern, a form of resistance, a political idea) that started in one stage and reappeared, transformed, in a later one.",
      },
      {
        type: "text",
        title: "Question 3: Contemporary Connections",
        contentMarkdown:
          "Pick one issue raised in **Module 5 (Contemporary)** and explain how it connects back to something specific from the Colonial or Independence modules.",
      },
      {
        type: "text",
        title: "Question 4: Defining Decolonization",
        contentMarkdown:
          'In your own words: what does "decolonization" mean to you now, compared to what you might have assumed it meant before starting this cohort?\n\nThere\'s no minimum word count enforced here, but give each answer real thought — a few honest sentences beats a long vague paragraph.',
      },
      { type: "video", title: "Closing Reflection", ...DEMO_VIDEO },
      {
        type: "quiz",
        title: "Final Check",
        quizData: {
          passingScore: 2,
          questions: [
            {
              id: "q1",
              prompt: "Which trans-Saharan empire's ruler was Mansa Musa (from Module 1)?",
              options: [
                { id: "a", text: "Mali", isCorrect: true },
                { id: "b", text: "Songhai", isCorrect: false },
                { id: "c", text: "Aksum", isCorrect: false },
                { id: "d", text: "Kongo", isCorrect: false },
              ],
            },
            {
              id: "q2",
              prompt: "What 1884-85 conference (from Module 3) divided Africa among European powers?",
              options: [
                { id: "a", text: "The Berlin Conference", isCorrect: true },
                { id: "b", text: "The Congress of Vienna", isCorrect: false },
                { id: "c", text: "The Yalta Conference", isCorrect: false },
                { id: "d", text: "The Bandung Conference", isCorrect: false },
              ],
            },
            {
              id: "q3",
              prompt: "In what year did Ghana, cited in Module 4, become independent?",
              options: [
                { id: "a", text: "1957", isCorrect: true },
                { id: "b", text: "1963", isCorrect: false },
                { id: "c", text: "1975", isCorrect: false },
                { id: "d", text: "1994", isCorrect: false },
              ],
            },
          ],
        },
      },
    ],
  },
};

async function main() {
  const modules = await prisma.module.findMany({
    orderBy: { orderIndex: "asc" },
    include: { steps: { orderBy: { orderIndex: "asc" } } },
  });

  const summary = [];

  for (const learningModule of modules) {
    const plan = CONTENT[learningModule.title];
    if (!plan) {
      summary.push({ title: learningModule.title, skipped: "no content plan for this title" });
      continue;
    }

    const targetTotal = learningModule.steps.length + plan.newSteps.length;
    if (learningModule.steps.length >= targetTotal) {
      summary.push({ title: learningModule.title, skipped: "already expanded" });
      continue;
    }

    // Update the existing first text step in place — preserves its id (and
    // any real StepProgress rows pointing at it) while replacing the
    // placeholder content with the real drafted lesson text.
    const firstTextStep = learningModule.steps.find((s) => s.type === "text");
    if (firstTextStep && plan.updateFirstText) {
      await prisma.moduleStep.update({
        where: { id: firstTextStep.id },
        data: { title: plan.updateFirstText.title, contentMarkdown: plan.updateFirstText.contentMarkdown },
      });
    }

    let orderIndex = learningModule.steps.length;
    const created = [];
    for (const step of plan.newSteps) {
      const row = await prisma.moduleStep.create({
        data: { moduleId: learningModule.id, orderIndex: orderIndex++, ...step },
      });
      created.push({ id: row.id, type: row.type, title: row.title });
    }

    summary.push({ title: learningModule.title, updatedFirstStep: !!firstTextStep, created });
  }

  console.log(JSON.stringify(summary, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
