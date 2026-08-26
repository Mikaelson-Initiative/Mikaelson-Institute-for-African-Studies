// One-off content replacement: rebuilds Cohort 01's five topic modules
// (currently a mixed Pre-Colonial/Contact/Colonial/Independence/Contemporary
// survey) into a single, deep, five-part story of pre-colonial Africa —
// told in plain, jargon-free, narrative language, for a cohort of students
// who come from many different African countries and backgrounds.
//
// Every historical claim below is drawn from mainstream, well-documented
// scholarship (the Mali Empire and Mansa Musa's hajj, the Kingdom of Kush
// and the Meroe pyramids, Great Zimbabwe, the Kingdom of Aksum, the Swahili
// coast city-states, the Kingdom of Benin and Ife, the Timbuktu manuscript
// tradition) — nothing here is invented. Images are real photographs/
// historical artworks from Wikimedia Commons, sourced from the specific
// Wikipedia articles on each topic, not generated or guessed.
//
// Module 1's existing first step is UPDATED IN PLACE (preserves its id and
// the one real completion already recorded against it). Modules 2-5's
// existing single "Reading" steps, and all their content, are DISCARDED
// entirely and replaced — confirmed safe: zero real StepProgress rows exist
// on any of them. Welcome to Ubuntu's "What's Ahead" step and Final
// Assessment's content are rewritten to describe the new five-part
// pre-colonial arc instead of the old five-era one.
//
// Run with: node scripts/seed-precolonial-cohort.cjs
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEMO_VIDEO = { videoProvider: "youtube", videoId: "TTIAqeoduP0" };

// ---------------------------------------------------------------------------
// MODULE 1 — Origins & the Nile Valley
// ---------------------------------------------------------------------------
const MODULE_1 = {
  title: "Origins & the Nile Valley",
  description: "Where the human story begins, and the first great river civilizations of Kemet and Kush.",
  firstStep: {
    title: "Overview: The Oldest Story",
    contentMarkdown: `Before there was Egypt, before there was Timbuktu, before any of the names you will learn in this cohort — there was a river, and there were people, and the people had already been telling stories for longer than almost anywhere else on Earth.

That is where we begin. Not with a date. With a river.

![The pyramids of Meroe rise from the desert of what is now Sudan, built by the kings and queens of ancient Kush.](https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Sudan_Meroe_Pyramids_30sep2005_2.jpg/500px-Sudan_Meroe_Pyramids_30sep2005_2.jpg)

If you have ever been told that African history "really starts" with European contact, or that Africa was a continent without cities, without writing, without kings and queens and libraries and long, argued-over successions of power — this module is where that idea quietly falls apart. Not because we will shout it down, but because we will simply walk you along the river and show you what was already there.

**A word before we start.** This cohort is not going to move in a straight line through "ancient" to "modern." Every module in this course stays inside the period historians call *pre-colonial* — the long, layered story of Africa before European colonization began. We are staying here on purpose, for the whole cohort, because this period is usually rushed through in a single lesson, when it deserves five.`,
  },
  newSteps: [
    {
      type: "text",
      title: "The River That Made Civilizations",
      contentMarkdown: `Pick up almost any world history textbook and you will find a chapter called "Ancient Egypt." What most of those textbooks leave out is that Egypt did not grow up alone. Along the same river — the Nile, the longest river on the continent — a second civilization grew up to its south, in what is now Sudan: the Kingdom of Kush.

Kush and Egypt were neighbors, trading partners, rivals, and at times conquerors of one another, for over two thousand years. For a period in the eighth century BCE, Kushite kings ruled Egypt itself, founding what historians call Egypt's Twenty-Fifth Dynasty — Kushite pharaohs, wearing the double crown, ruling from the Nile Delta all the way south into the heart of the continent.

This matters for a simple reason: the story most of the world learned treats Egypt as a civilization that happened to be *located* on the African continent, almost by accident, disconnected from everything around it. The real story is a two-thousand-year-long relationship between two African civilizations on the same river, each shaping the other.`,
    },
    {
      type: "text",
      title: "Kush: The Kingdom That Outlasted Egypt",
      contentMarkdown: `Here is a fact that surprises most people the first time they hear it: the Kingdom of Kush outlived ancient Egypt as an independent civilization. While Egypt fell under Persian, then Greek, then Roman rule, Kush continued — with its own kings, its own capital cities (first Napata, then Meroe), and eventually its own writing system, Meroitic, which modern scholars still cannot fully read.

Kush's kings and queens built pyramids too — smaller, steeper, and far more numerous than Egypt's. Sudan has more pyramids standing today than Egypt does. The image at the top of this module shows the pyramid field at Meroe, the Kushite capital for its final six centuries, now a UNESCO World Heritage Site.

Kush was also, notably, a kingdom where royal women held real, formal political power. Meroitic queens known as *kandakes* — a title some scholars connect to the origin of the name "Candace" — ruled in their own right, led armies, and are recorded standing up to Roman forces at the empire's northern border. This is not a footnote. It is a sign of how differently power could be organized here than in the empires history classes usually center.`,
    },
    {
      type: "text",
      title: "What 'Before Writing' Really Means",
      contentMarkdown: `A common but mistaken idea is that a place without a *European-style* writing system was a place "without history." Two things are worth holding onto here.

First: much of the Nile Valley *did* have writing — Egyptian hieroglyphs, and Kush's own Meroitic script. This alone should end the myth. But second, and more importantly: even where a society kept its history orally rather than on paper or stone, that does not mean the history was any less real, detailed, or carefully kept.

Oral historians — griots, court remembrancers, lineage keepers — were trained specialists, the same way a modern archivist or librarian is trained. Their job was to remember accurately, across a human lifetime, and to pass that memory on intact. We will spend real time on how oral history actually works, and why it is a legitimate historical method rather than "just legend," in Module 5 of this cohort. For now, hold onto this: the absence of paper is not the absence of history.`,
    },
    {
      type: "text",
      title: "Why We Start Here",
      contentMarkdown: `We open this whole cohort in the Nile Valley for a reason. It is the part of pre-colonial African history most people have *already heard of* — but almost always with its African identity quietly edited out. Egypt gets discussed as though it floats near Africa rather than sitting inside it. Kush, its neighbor, mostly does not get discussed at all.

So consider this module a correction and a foundation at the same time. From here, we are going to travel — west, across the desert, to the empires built on gold and salt; south, to the walled stone cities and coastal trading towns; and further south and west still, to the kingdoms of the forest. Each stop is its own civilization, with its own story, its own art, its own politics. None of them needed anyone else to arrive from outside to become "civilized." They already were.`,
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
            prompt: "According to this module, which kingdom ruled Egypt during its Twenty-Fifth Dynasty?",
            options: [
              { id: "a", text: "The Kingdom of Kush", isCorrect: true },
              { id: "b", text: "The Kingdom of Aksum", isCorrect: false },
              { id: "c", text: "The Mali Empire", isCorrect: false },
              { id: "d", text: "The Kingdom of Benin", isCorrect: false },
            ],
          },
          {
            id: "q2",
            prompt: "What does this module say about Kush relative to ancient Egypt?",
            options: [
              { id: "a", text: "It outlasted Egypt as an independent civilization", isCorrect: true },
              { id: "b", text: "It was conquered by Egypt and never recovered", isCorrect: false },
              { id: "c", text: "It had no contact with Egypt", isCorrect: false },
              { id: "d", text: "It was founded after Egypt fell to Rome", isCorrect: false },
            ],
          },
        ],
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// MODULE 2 — Empires of Gold and Salt
// ---------------------------------------------------------------------------
const MODULE_2 = {
  title: "Empires of Gold and Salt",
  description: "Ghana, Mali, and Songhai — the trans-Saharan trade empires, Timbuktu, and Mansa Musa.",
  steps: [
    {
      type: "text",
      title: "Overview: A Road Made of Sand",
      contentMarkdown: `Imagine a trade route with no road, no river, and no signposts — just an ocean of sand nearly the size of the continental United States. Now imagine merchants crossing it, again and again, for centuries, on camelback, carrying two things in opposite directions: gold, moving north, and salt, moving south.

That crossing — the trans-Saharan trade — built some of the wealthiest and most sophisticated states in pre-colonial African history: the Empire of Ghana, then Mali, then Songhai, rising one after another across roughly a thousand years in the region historians call the West African Sahel.

![Mansa Musa of Mali, shown holding a gold nugget, in the Catalan Atlas — a map made in Europe in 1375 specifically because his wealth and empire were already famous there.](https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Catalan_Atlas_BNF_Sheet_6_Mansa_Musa.jpg/500px-Catalan_Atlas_BNF_Sheet_6_Mansa_Musa.jpg)

This module is about that stretch of desert, the empires it made rich, and one ruler in particular whose wealth was so famous that fourteenth-century European mapmakers put his portrait on a map of the known world — the image above.`,
    },
    {
      type: "text",
      title: "Ghana, First of the Three",
      contentMarkdown: `The Ghana Empire — no direct relation to the modern country of the same name, which took the name later in honor of this history — rose to power controlling the gold trade of the western Sahel starting around the seventh or eighth century. Arab geographers who visited or wrote about it described a capital city with a royal quarter of stone and a merchant quarter with mosques, and a king so wealthy that Arabic writers nicknamed the land "the land of gold."

Ghana's power came from a position, not just a resource: it sat exactly between the gold fields further south and the salt and Mediterranean goods coming across the desert from the north. Every caravan that wanted both had to pass through, and Ghana taxed the traffic in both directions. This is the same principle that later made Mali and Songhai rich after Ghana declined — controlling the *crossing point* of a trade route can be worth more than controlling the resource itself.`,
    },
    {
      type: "text",
      title: "Mansa Musa's Walk to Mecca",
      contentMarkdown: `By the early 1300s, the Mali Empire had absorbed and surpassed Ghana, and its ninth *mansa* (a Mandinka title, roughly "emperor"), Musa I, decided to make the pilgrimage to Mecca that every devout Muslim aspires to complete.

He did not travel lightly. Historical accounts — written by observers along his route — describe a procession of tens of thousands of people, including enslaved attendants and soldiers, along with camels carrying so much gold that when Mansa Musa passed through Cairo in 1324, he reportedly gave away or spent enough of it to measurably depress the value of gold in Egypt's economy for years afterward. Whatever the exact numbers (medieval chroniclers were not precise accountants, and later retellings inflated the story further), the core fact is not disputed: this was one of the most famous displays of wealth the medieval world had ever witnessed, and it put the Mali Empire on the mental map of merchants and mapmakers from Cairo to Venice.

That is why the Catalan Atlas — a map made in Spain, for a European king, more than 3,000 miles from Mali's capital — includes his portrait. Mali's reputation had already traveled that far, well before any European ship reached West Africa's coast.`,
    },
    {
      type: "text",
      title: "Timbuktu: A City Built on Books",
      contentMarkdown: `Mansa Musa's pilgrimage had a second, quieter consequence: he returned home with scholars, architects, and books, and invested heavily in the city of Timbuktu, which grew into one of the intellectual capitals of the Islamic world — a city where, by the 1400s and 1500s, a functioning manuscript trade employed copyists, and private and mosque libraries held tens of thousands of texts on law, astronomy, medicine, poetry, and theology.

Timbuktu was not unique in isolation — it was connected, by the same trade routes that carried gold and salt, to scholarly centers in Cairo, Fez, and Mecca. Students traveled to study there and carried what they learned home again. We will return to Timbuktu's manuscripts specifically — and to a modern effort to save tens of thousands of them from destruction — in Module 5, when we talk about how historians actually know what they know.`,
    },
    {
      type: "text",
      title: "Songhai and the Fall of an Era",
      contentMarkdown: `Mali eventually weakened, and a third empire, Songhai, rose from within its former territory to become the largest of the three, stretching along the Niger River under rulers like Sunni Ali and Askia Muhammad in the late 1400s and 1500s. Songhai inherited Timbuktu's scholarly reputation and expanded the empire's reach through a combination of military strength and administrative reform — Askia Muhammad in particular is remembered for organizing the empire into provinces with appointed governors, a structure of centralized governance built well before it existed in most of the societies that would later colonize the region.

Songhai's fall came in 1591, at the Battle of Tondibi, to an invading Moroccan army equipped with firearms — a reminder that gunpowder weapons were already reshaping power balances in West Africa a full three centuries before the European colonial partition of the continent. This empire did not fall to Europe. It fell to a neighboring African-Islamic power, and its decline reshaped West African politics for the next two centuries, well before the period most people associate with "colonial history" even begins.`,
    },
    { type: "video", title: "Module Overview Video", ...DEMO_VIDEO },
    {
      type: "quiz",
      title: "Comprehension Check",
      quizData: {
        passingScore: 2,
        questions: [
          {
            id: "q1",
            prompt: "What two goods moved in opposite directions across the trans-Saharan trade routes?",
            options: [
              { id: "a", text: "Gold moving north, salt moving south", isCorrect: true },
              { id: "b", text: "Silk moving south, ivory moving north", isCorrect: false },
              { id: "c", text: "Only gold, in both directions", isCorrect: false },
              { id: "d", text: "Spices and textiles exclusively", isCorrect: false },
            ],
          },
          {
            id: "q2",
            prompt: "Why does the Catalan Atlas (a European map from 1375) include a portrait of Mansa Musa?",
            options: [
              { id: "a", text: "Mali's wealth and empire were already famous in Europe by then", isCorrect: true },
              { id: "b", text: "European mapmakers had personally visited Mali", isCorrect: false },
              { id: "c", text: "Mansa Musa commissioned the map himself", isCorrect: false },
              { id: "d", text: "It was a random inclusion with no real basis", isCorrect: false },
            ],
          },
          {
            id: "q3",
            prompt: "What ended the Songhai Empire in 1591?",
            options: [
              { id: "a", text: "An invading Moroccan army with firearms, at the Battle of Tondibi", isCorrect: true },
              { id: "b", text: "European colonization", isCorrect: false },
              { id: "c", text: "A trans-Saharan trade collapse", isCorrect: false },
              { id: "d", text: "Internal collapse with no external attack", isCorrect: false },
            ],
          },
        ],
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// MODULE 3 — Cities of Stone and the Swahili Coast
// ---------------------------------------------------------------------------
const MODULE_3 = {
  title: "Cities of Stone and the Swahili Coast",
  description: "Great Zimbabwe, the Kingdom of Aksum, and the Indian Ocean trading cities of the Swahili coast.",
  steps: [
    {
      type: "text",
      title: "Overview: Stone That Was Never Supposed to Exist",
      contentMarkdown: `In the early twentieth century, European visitors to a hilltop in what is now Zimbabwe found a walled city of dry-stone architecture — no mortar, just carefully fitted granite blocks, some walls over thirty feet tall — and simply refused to believe African builders had made it. Colonial-era writers invented stories crediting Phoenicians, or the Queen of Sheba, or almost anyone other than the ancestors of the people who actually lived there.

![The stone walls of Great Zimbabwe, built without mortar between roughly the eleventh and fifteenth centuries — the site the modern country of Zimbabwe is named after.](https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Great-Zimbabwe.jpg/500px-Great-Zimbabwe.jpg)

Modern archaeology settled the question decades ago, conclusively: Great Zimbabwe was built by the ancestors of the Shona people, over roughly four centuries. This module is about that site, and about two other kinds of "stone city" pre-colonial Africa built — the ancient highland kingdom of Aksum, and the coral-stone trading towns of the Swahili coast.`,
    },
    {
      type: "text",
      title: "Great Zimbabwe: Capital of a Cattle-and-Gold Kingdom",
      contentMarkdown: `Great Zimbabwe was the capital of a kingdom that grew wealthy controlling cattle herding and the regional gold trade, connecting the interior of southern Africa to Indian Ocean trade networks — gold and ivory moving out through the Swahili coast, glass beads and Chinese porcelain moving back in. Archaeologists have found fragments of imported Persian and Chinese pottery at the site, physical proof of trade links stretching thousands of miles.

At its height in the 1300s and 1400s, the city may have housed somewhere between ten and twenty thousand people, making it one of the largest urban settlements in the region at the time. Its name lives on today — the modern nation of Zimbabwe took its name directly from this site, and the country's flag and currency both carry the image of the "Zimbabwe Bird," a soapstone carving found among the ruins.`,
    },
    {
      type: "text",
      title: "Aksum: An Ancient Christian Kingdom in the Highlands",
      contentMarkdown: `Thirteen hundred miles north and east, in the highlands of what is now Ethiopia and Eritrea, the Kingdom of Aksum was, by the fourth century CE, one of the great powers of the ancient world — a fourth-century Persian text ranked it alongside Rome, Persia, and China as one of the world's four leading civilizations.

![One of Aksum's carved granite obelisks, or stelae — monuments marking royal graves, some over one hundred feet tall.](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Aksum_obelisk.jpg/500px-Aksum_obelisk.jpg)

Aksum minted its own coinage, developed the Ge'ez script (still used in Ethiopian Orthodox Christian liturgy today), and adopted Christianity as a state religion around 330 CE — decades before the Roman Empire did the same, and centuries before Christianity spread through most of Europe. This is worth sitting with: one of the world's oldest continuously practiced Christian traditions is not European. It is African, and it predates most of Christian Europe.`,
    },
    {
      type: "text",
      title: "The Swahili Coast: Cities Built on Monsoon Winds",
      contentMarkdown: `Along Africa's eastern coastline, from Somalia down through Kenya, Tanzania, and into Mozambique, a string of independent city-states grew wealthy trading with the Arabian Peninsula, Persia, India, and even China — using the Indian Ocean's predictable seasonal monsoon winds to sail out and, months later, sail back.

![The interior prayer hall of the Great Mosque of Kilwa, built and expanded between the twelfth and fifteenth centuries — once the largest mosque on the East African coast.](https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Inside_the_great_mosque_of_Kilwa.jpg/500px-Inside_the_great_mosque_of_Kilwa.jpg)

Cities like Kilwa, Mombasa, and Zanzibar built in coral stone, minted their own coins, and developed Swahili — a Bantu language enriched with Arabic vocabulary from centuries of trade contact — as a shared trading tongue that is still spoken by tens of millions of people across East Africa today. When the Moroccan traveler Ibn Battuta visited Kilwa in 1331, he described it as one of the most beautiful and well-built towns he had seen anywhere in his extensive travels across the Islamic world — high praise from a man who had also seen Cairo, Baghdad, and Mecca.`,
    },
    {
      type: "text",
      title: "Three Coastlines, One Pattern",
      contentMarkdown: `Look at what Great Zimbabwe, Aksum, and the Swahili coast city-states have in common, despite being separated by thousands of miles and centuries of time: each built real wealth and real political power by sitting at a *connection point* between an African interior and a much larger international trade network — exactly the same underlying pattern we saw with Ghana, Mali, and Songhai controlling the trans-Saharan crossing in Module 2.

This is not a coincidence, and it is the opposite of the old, false idea of pre-colonial Africa as cut off from the rest of the world. These societies were some of the best-connected places on Earth for their time — plugged into Mediterranean, Middle Eastern, South Asian, and East Asian trade networks centuries before a European ship ever reached these coasts.`,
    },
    { type: "video", title: "Module Overview Video", ...DEMO_VIDEO },
    {
      type: "quiz",
      title: "Comprehension Check",
      quizData: {
        passingScore: 2,
        questions: [
          {
            id: "q1",
            prompt: "What did modern archaeology conclusively determine about who built Great Zimbabwe?",
            options: [
              { id: "a", text: "The ancestors of the Shona people", isCorrect: true },
              { id: "b", text: "Phoenician traders", isCorrect: false },
              { id: "c", text: "It remains completely unknown", isCorrect: false },
              { id: "d", text: "Portuguese explorers", isCorrect: false },
            ],
          },
          {
            id: "q2",
            prompt: "Around what year did the Kingdom of Aksum adopt Christianity as a state religion?",
            options: [
              { id: "a", text: "Around 330 CE", isCorrect: true },
              { id: "b", text: "Around 1500 CE", isCorrect: false },
              { id: "c", text: "Around 100 BCE", isCorrect: false },
              { id: "d", text: "It never did", isCorrect: false },
            ],
          },
          {
            id: "q3",
            prompt: "What made the seasonal monsoon winds important to the Swahili coast city-states?",
            options: [
              { id: "a", text: "They allowed predictable sailing out to trade and back across the Indian Ocean", isCorrect: true },
              { id: "b", text: "They were only useful for fishing", isCorrect: false },
              { id: "c", text: "They prevented any sea trade from happening", isCorrect: false },
              { id: "d", text: "They connected the coast to the Atlantic instead", isCorrect: false },
            ],
          },
        ],
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// MODULE 4 — Kingdoms of the Forest and the Rain
// ---------------------------------------------------------------------------
const MODULE_4 = {
  title: "Kingdoms of the Forest and the Rain",
  description: "Benin, Ife, and Kongo — the forest and equatorial kingdoms of West and Central Africa, and their art.",
  steps: [
    {
      type: "text",
      title: "Overview: A Different Kind of Wealth",
      contentMarkdown: `The empires in Module 2 grew rich on gold and salt moving across open desert. The kingdoms in this module grew powerful somewhere very different: dense rainforest and equatorial woodland, where the wealth was not sand-crossing caravans but farming, iron-working, long-distance forest trade routes, and — in more than one of these kingdoms — an extraordinary tradition of bronze and brass casting that museums around the world still argue over who rightfully owns today.

![A Benin brass plaque, part of a tradition of royal court art stretching back to at least the thirteenth century.](https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Benin_brass_plaque_03_%28cropped%29.jpg/500px-Benin_brass_plaque_03_%28cropped%29.jpg)

This module looks at the Kingdom of Ife and the Kingdom of Benin, both in what is now Nigeria, and the Kingdom of Kongo in Central Africa — three kingdoms, three different political systems, and one shared thread: art as a form of governance and historical record, not decoration.`,
    },
    {
      type: "text",
      title: "Ife: Where Yoruba Tradition Says the World Began",
      contentMarkdown: `In Yoruba oral tradition, the city of Ile-Ife is where the world itself was created — a foundational story, not unlike the way other cultures around the world root their identity in a specific sacred place. Historically, Ife was a powerful city-state that reached a cultural peak between roughly the eleventh and fifteenth centuries, and it is where some of the most technically advanced bronze and terracotta portrait sculpture anywhere in the pre-colonial world was produced.

These are not stylized, abstract figures. Ife's sculptors cast individual, recognizable royal portraits with naturalistic detail — proportion, expression, individual features — using a lost-wax casting technique of extraordinary precision. When European collectors first encountered Ife bronzes in the early twentieth century, some flatly refused to believe they were made in Africa at all, guessing at a lost colony of ancient Greeks instead. It took decades, and considerable stubbornness from actual scholars of African art, to correct that record.`,
    },
    {
      type: "text",
      title: "Benin: A Kingdom Governed Through Its Art",
      contentMarkdown: `South of Ife, the Kingdom of Benin (again, in what is now Nigeria — not related to the modern country of Benin, further west) built one of the most centralized and long-lasting monarchies in pre-colonial West Africa, ruled by an *oba* (king) whose court commissioned thousands of brass and bronze plaques and sculptures over roughly five centuries, from around 1200 CE onward.

These plaques were not simply art for art's sake. They recorded royal history — coronations, military victories, ceremonial events, the ranks and roles of court officials — functioning as something close to an illustrated royal archive, cast in metal rather than written on paper. Portuguese traders who reached Benin's coast in the late 1400s were themselves depicted in some of these plaques, holding manillas and firearms — a direct, contemporary artistic record of first contact, made by Benin's own artists, not a European account written after the fact.

In 1897, British colonial forces destroyed Benin City and looted thousands of these plaques and sculptures, which is why so many now sit in museums in London, Berlin, and elsewhere — a story that belongs properly to the colonial period this cohort deliberately does not cover, but it is worth knowing as you look at the image above: the art survived. The city that made it, and the kingdom that governed through it, were violently interrupted.`,
    },
    {
      type: "text",
      title: "Kongo: A Kingdom That Negotiated on Its Own Terms",
      contentMarkdown: `Further south, along the Congo River in Central Africa, the Kingdom of Kongo had, by the time Portuguese ships arrived on its coast in 1483, already existed as an organized state for roughly a century, with a king (the *manikongo*), a structured nobility, and provincial governors.

What makes Kongo's early contact with Portugal distinctive is that it was, for its first several decades, a negotiation between two states meeting as something closer to equals than the later colonial relationship most people assume. King Nzinga a Nkuwu converted to Christianity and took the baptismal name João I; his son, who ruled as Afonso I, sent Kongo nobles to be educated in Portugal and corresponded directly and assertively with Portuguese kings — including, later, forcefully protesting the growing transatlantic slave trade's effect on his kingdom. Kongo's court adopted elements of Portuguese Catholicism and literacy on its own terms, blending them with existing Kongo religious and political structures, rather than simply having them imposed.

This relationship soured badly over the following century, as the slave trade's economic gravity distorted it — but that early period is a useful corrective to the assumption that African kingdoms only ever encountered Europe as passive subjects. Kongo, at least at first, was a full participant in the relationship, making its own choices about what to adopt and what to resist.`,
    },
    {
      type: "text",
      title: "Art as Government",
      contentMarkdown: `Step back and look at Ife, Benin, and Kongo together: in each, art was not separate from political power — it *was* political power, or at least one of its central tools. A royal plaque, a portrait bronze, a court chronicle carved rather than written, all served the same function that a national archive, a coin, or a royal portrait painting served in European monarchies of the same era: recording legitimacy, memory, and rank.

The difference is that this tradition is rarely taught alongside those European equivalents, despite being just as sophisticated, just as deliberate, and — in Ife's and Benin's case — technically superior in bronze casting to almost anything being produced in Europe at the same time. That imbalance in whose art gets called "history" and whose gets called "artifact" is itself a legacy worth naming plainly, and it is exactly the kind of question Module 5 takes on directly.`,
    },
    { type: "video", title: "Module Overview Video", ...DEMO_VIDEO },
    {
      type: "quiz",
      title: "Comprehension Check",
      quizData: {
        passingScore: 2,
        questions: [
          {
            id: "q1",
            prompt: "What technique did Ife's sculptors use to cast their famously naturalistic bronze portraits?",
            options: [
              { id: "a", text: "Lost-wax casting", isCorrect: true },
              { id: "b", text: "Stone carving only", isCorrect: false },
              { id: "c", text: "Wood block printing", isCorrect: false },
              { id: "d", text: "Imported European molds", isCorrect: false },
            ],
          },
          {
            id: "q2",
            prompt: "What function did Benin's brass and bronze plaques serve, according to this module?",
            options: [
              { id: "a", text: "They recorded royal history, functioning like an illustrated archive", isCorrect: true },
              { id: "b", text: "They were purely decorative, with no historical content", isCorrect: false },
              { id: "c", text: "They were created entirely by Portuguese artists", isCorrect: false },
              { id: "d", text: "They were used only as currency", isCorrect: false },
            ],
          },
          {
            id: "q3",
            prompt: "What distinguished Kongo's early contact with Portugal, according to this module?",
            options: [
              { id: "a", text: "It began as a negotiation between two states meeting closer to as equals", isCorrect: true },
              { id: "b", text: "Kongo had no king or political structure before contact", isCorrect: false },
              { id: "c", text: "Kongo immediately became a Portuguese colony", isCorrect: false },
              { id: "d", text: "There was no religious exchange of any kind", isCorrect: false },
            ],
          },
        ],
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// MODULE 5 — How We Know What We Know
// ---------------------------------------------------------------------------
const MODULE_5 = {
  title: "How We Know What We Know",
  description: "Oral tradition, archaeology, manuscripts, and why 'no written record' never meant 'no history.'",
  steps: [
    {
      type: "text",
      title: "Overview: The Question Behind Every Module",
      contentMarkdown: `Four modules ago, we promised to come back to a question we kept setting aside: *how do historians actually know any of this?* Not "what happened" — we have covered a lot of "what happened" — but how the knowledge itself survived, was recorded, was nearly lost, and was in some cases deliberately erased.

![A page from a Timbuktu manuscript on astronomy and mathematics, dated 1731 — part of a written scholarly tradition that thrived in West Africa for centuries.](https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Timbuktu-manuscripts-astronomy-mathematics.jpg/500px-Timbuktu-manuscripts-astronomy-mathematics.jpg)

This module is about method, not a new kingdom or empire. It is, in a sense, the most important module in the cohort, because it explains why everything you learned in Modules 1 through 4 is trustworthy — and why so much of it was, for a long time, dismissed by people who should have known better.`,
    },
    {
      type: "text",
      title: "Oral Tradition Is a Discipline, Not a Rumor",
      contentMarkdown: `In many of the societies covered in this cohort, professional oral historians — griots in the Mali and Songhai tradition, court remembrancers elsewhere — trained for years, sometimes across an entire childhood and adolescence, to memorize and recite genealogies, royal histories, and legal precedent with word-for-word discipline. This was a formal profession with formal training, apprenticeship, and accountability, not casual storytelling passed around a fire.

Historians who actually study these traditions closely — rather than dismissing them from a distance — have repeatedly found that oral accounts, cross-checked against archaeology, written Arabic sources, and each other, hold up as reliable historical evidence. The griot tradition of Mali, for instance, preserved detailed royal genealogies that independently match dates and successions recorded by Arab travelers writing at the time. That correspondence is not a coincidence. It is what a rigorous historical method, working in a different medium than paper, looks like.`,
    },
    {
      type: "text",
      title: "What the Ground Remembers",
      contentMarkdown: `Where oral tradition and written sources run out, archaeology fills in enormous gaps — and has, over the past century, repeatedly *proven* pre-colonial African societies right, and colonial-era dismissals wrong. The Great Zimbabwe controversy from Module 3 is the clearest example: colonial administrators insisted, against the physical evidence in front of them, that African hands could not have built those walls. Careful, methodical excavation eventually settled the matter beyond reasonable dispute, dating the site and matching its construction and artifacts to the ancestors of the Shona people who already lived there.

The lesson generalizes: archaeological evidence has, again and again, confirmed what local oral tradition already said, while European assumption had said otherwise. That pattern should change how much weight you give to each kind of source.`,
    },
    {
      type: "text",
      title: "The Manuscripts That Almost Didn't Survive",
      contentMarkdown: `Timbuktu's written manuscript tradition, which we met in Module 2, nearly met a very modern threat: in 2012 and 2013, armed groups occupying northern Mali destroyed some manuscripts and threatened tens of thousands more, held across dozens of private and public libraries in the city. In response, librarians and ordinary residents of Timbuktu smuggled an estimated 350,000 manuscripts out of the city by road and river, hidden in rice sacks and metal trunks, at real personal risk, to keep them from being destroyed.

This is worth sitting with as a closing image for this module: the same written tradition Mansa Musa helped seed in the 1300s was still alive, still being actively protected by ordinary people, in the 2010s — not a dead relic in a museum case, but a living inheritance that people were willing to risk their safety for.`,
    },
    {
      type: "text",
      title: "Putting the Five Modules Together",
      contentMarkdown: `Look back across everything this cohort has covered: a two-thousand-year river civilization in Kush; desert empires that made West Africa a center of global gold wealth and Islamic scholarship; stone cities and coastal trading towns plugged into Indian Ocean and Mediterranean networks; forest kingdoms that governed through art of extraordinary technical sophistication; and now, the methods — oral, archaeological, and written — that let us know all of it with real confidence.

None of this needed European contact to become impressive, complex, wealthy, or worth studying seriously. It already was, on its own terms, for centuries. That is not a rebuttal offered defensively — it is simply what the evidence shows, once you actually look at it closely and take African-generated sources as seriously as European ones. Carry that method — evidence first, assumption second — into everything you study after this cohort ends.`,
    },
    { type: "video", title: "Module Overview Video", ...DEMO_VIDEO },
    {
      type: "quiz",
      title: "Comprehension Check",
      quizData: {
        passingScore: 2,
        questions: [
          {
            id: "q1",
            prompt: "What does this module say distinguishes a griot's oral history from casual storytelling?",
            options: [
              { id: "a", text: "Years of formal training and word-for-word disciplined memorization", isCorrect: true },
              { id: "b", text: "Nothing — they are the same thing", isCorrect: false },
              { id: "c", text: "Griots only performed for entertainment, not historical record", isCorrect: false },
              { id: "d", text: "It was always written down first, then spoken", isCorrect: false },
            ],
          },
          {
            id: "q2",
            prompt: "What did archaeological evidence eventually confirm about Great Zimbabwe?",
            options: [
              { id: "a", text: "That it was built by the ancestors of the Shona people, matching local oral tradition", isCorrect: true },
              { id: "b", text: "That colonial-era claims about foreign builders were correct", isCorrect: false },
              { id: "c", text: "That the site's age could never be determined", isCorrect: false },
              { id: "d", text: "That it was built within the last hundred years", isCorrect: false },
            ],
          },
          {
            id: "q3",
            prompt: "Roughly how many Timbuktu manuscripts were smuggled out of the city to protect them in 2012-2013?",
            options: [
              { id: "a", text: "An estimated 350,000", isCorrect: true },
              { id: "b", text: "Around 50", isCorrect: false },
              { id: "c", text: "None — they were left in place", isCorrect: false },
              { id: "d", text: "Exactly 1,000", isCorrect: false },
            ],
          },
        ],
      },
    },
  ],
};

async function replaceModuleContent(title, plan) {
  const learningModule = await prisma.module.findFirst({
    where: { title },
    include: { steps: true },
  });
  if (!learningModule) {
    return { title, skipped: "module not found" };
  }

  await prisma.module.update({
    where: { id: learningModule.id },
    data: { title: plan.title, description: plan.description },
  });

  if (plan.firstStep) {
    // Module 1 path: update the existing first step in place (preserves id +
    // the one real completion), then append the rest as new steps.
    const firstStep = learningModule.steps.find((s) => s.type === "text") ?? learningModule.steps[0];
    if (firstStep) {
      await prisma.moduleStep.update({
        where: { id: firstStep.id },
        data: { title: plan.firstStep.title, contentMarkdown: plan.firstStep.contentMarkdown },
      });
    }
    let orderIndex = learningModule.steps.length;
    const created = [];
    for (const step of plan.newSteps) {
      const row = await prisma.moduleStep.create({ data: { moduleId: learningModule.id, orderIndex: orderIndex++, ...step } });
      created.push({ id: row.id, type: row.type, title: row.title });
    }
    return { title: plan.title, mode: "updated-first-step", created };
  }

  // Modules 2-5 path: no real progress exists on any of their current
  // steps (confirmed before writing this script) — delete and replace.
  await prisma.moduleStep.deleteMany({ where: { moduleId: learningModule.id } });
  const created = [];
  let orderIndex = 0;
  for (const step of plan.steps) {
    const row = await prisma.moduleStep.create({ data: { moduleId: learningModule.id, orderIndex: orderIndex++, ...step } });
    created.push({ id: row.id, type: row.type, title: row.title });
  }
  return { title: plan.title, mode: "replaced", created };
}

async function updateWelcomeToUbuntuRoadmap() {
  const module_ = await prisma.module.findFirst({ where: { title: "Welcome to Ubuntu" }, include: { steps: true } });
  if (!module_) return { skipped: "Welcome to Ubuntu not found" };
  const step = module_.steps.find((s) => s.title === "What's Ahead");
  if (!step) return { skipped: "What's Ahead step not found" };

  await prisma.moduleStep.update({
    where: { id: step.id },
    data: {
      contentMarkdown: `This cohort spends its entire five modules inside a single period: **pre-colonial Africa** — the long, layered story of the continent before European colonization began. We are staying here on purpose, in five parts:

1. **Origins & the Nile Valley** — ancient Egypt's neighbor and rival, the Kingdom of Kush, and two thousand years of river civilization.
2. **Empires of Gold and Salt** — the Ghana, Mali, and Songhai empires, the trans-Saharan trade, and Mansa Musa's famous pilgrimage.
3. **Cities of Stone and the Swahili Coast** — Great Zimbabwe, the ancient Christian Kingdom of Aksum, and the Indian Ocean trading cities of the Swahili coast.
4. **Kingdoms of the Forest and the Rain** — Ife, Benin, and Kongo, and a tradition of art as governance and historical record.
5. **How We Know What We Know** — oral tradition, archaeology, and manuscripts: the methods behind everything the first four modules covered.

A **Final Assessment** closes out the cohort — a chance to connect all five parts of this story together.`,
    },
  });
  return { updated: "What's Ahead" };
}

async function updateFinalAssessment() {
  const module_ = await prisma.module.findFirst({ where: { title: "Final Assessment" }, include: { steps: true } });
  if (!module_) return { skipped: "Final Assessment not found" };

  const instructions = module_.steps.find((s) => s.title === "Instructions");
  if (instructions) {
    await prisma.moduleStep.update({
      where: { id: instructions.id },
      data: {
        contentMarkdown: `You have moved through five parts of one long story — the Nile Valley, the trans-Saharan gold and salt empires, the stone cities and coastal trading towns, the forest kingdoms and their art, and the methods historians use to know all of it. This assessment isn't a quiz with a single right answer. It's a chance to show you can connect them.`,
      },
    });
  }

  const questionTitles = [
    ["Question 1: Origins & the Nile Valley", "Choose one fact from **Module 1 (Origins & the Nile Valley)** that changed how you think about the Nile Valley's history. Why did it stand out to you?"],
    ["Question 2: Tracing a Thread", "Trace a single thread across **any two modules** in this cohort — a pattern (a trade relationship, an art form, a political structure) that appears in more than one kingdom or civilization we studied."],
    ["Question 3: Art, Power, and Memory", "Pick one example from **Module 4 (Kingdoms of the Forest and the Rain)** of art functioning as a form of government or historical record, and explain it in your own words."],
    ["Question 4: How We Know", "In your own words: after **Module 5**, how has your sense of what counts as a reliable historical source changed?"],
  ];
  for (const [title, contentMarkdown] of questionTitles) {
    const step = module_.steps.find((s) => s.title === title || s.title.startsWith(title.split(":")[0]));
    if (step) await prisma.moduleStep.update({ where: { id: step.id }, data: { title, contentMarkdown } });
  }

  const finalQuiz = module_.steps.find((s) => s.type === "quiz");
  if (finalQuiz) {
    await prisma.moduleStep.update({
      where: { id: finalQuiz.id },
      data: {
        quizData: {
          passingScore: 2,
          questions: [
            {
              id: "q1",
              prompt: "Which ancient African kingdom, along the Nile, outlasted Egypt as an independent civilization (Module 1)?",
              options: [
                { id: "a", text: "Kush", isCorrect: true },
                { id: "b", text: "Aksum", isCorrect: false },
                { id: "c", text: "Mali", isCorrect: false },
                { id: "d", text: "Kongo", isCorrect: false },
              ],
            },
            {
              id: "q2",
              prompt: "Which ruler's pilgrimage to Mecca famously put the Mali Empire on European maps (Module 2)?",
              options: [
                { id: "a", text: "Mansa Musa", isCorrect: true },
                { id: "b", text: "Askia Muhammad", isCorrect: false },
                { id: "c", text: "Afonso I", isCorrect: false },
                { id: "d", text: "Sunni Ali", isCorrect: false },
              ],
            },
            {
              id: "q3",
              prompt: "What did archaeology eventually confirm about who built Great Zimbabwe (Module 3)?",
              options: [
                { id: "a", text: "The ancestors of the Shona people", isCorrect: true },
                { id: "b", text: "A lost European colony", isCorrect: false },
                { id: "c", text: "It remains fully unknown", isCorrect: false },
                { id: "d", text: "Traders from Kongo", isCorrect: false },
              ],
            },
          ],
        },
      },
    });
  }

  return { updated: true };
}

async function main() {
  const summary = [];
  summary.push(await replaceModuleContent("Module 1", MODULE_1));
  summary.push(await replaceModuleContent("Module 2", MODULE_2));
  summary.push(await replaceModuleContent("Module 3", MODULE_3));
  summary.push(await replaceModuleContent("Module 4", MODULE_4));
  summary.push(await replaceModuleContent("Module 5", MODULE_5));
  summary.push({ welcomeToUbuntu: await updateWelcomeToUbuntuRoadmap() });
  summary.push({ finalAssessment: await updateFinalAssessment() });
  console.log(JSON.stringify(summary, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
