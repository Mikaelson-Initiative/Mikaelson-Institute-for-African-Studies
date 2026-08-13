// One-off migration of the real hardcoded content in team/partners/library-books
// page.tsx files into the new TeamMember/Partner/BookRecommendation tables.
// Run once with: node -r dotenv/config scripts/seed-cms.cjs (needs DATABASE_URL).
// Safe to re-run — clears and re-inserts each table. CommonJS deliberately —
// this Prisma client build's ESM named exports resolve to undefined here.
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

const teamCategories = [
  {
    label: "Executive Leadership",
    members: [
      {
        index: "01",
        name: "Michael Olukayode",
        role: "Founder & Research Fellow",
        affiliation: "Mikaelson Institute for African Studies",
        image: "/team/20240726_164330.jpeg",
      },
    ],
  },
  { label: "Research Fellows", members: [] },
  { label: "Research Associates", members: [] },
  { label: "Editorial Team", members: [] },
  { label: "Library & Archives", members: [] },
  { label: "Advisory Council", members: [] },
];

const partners = [
  {
    name: "Mikaelson Initiative",
    type: "Parent Organization",
    logo: "/logos/Mikealson initiative logo.png",
  },
];

const bookGenres = {
  "history-decolonization": [
    { imgUrl: "https://covers.openlibrary.org/b/id/426011-L.jpg", title: "Africa in History — Basil Davidson", linkUrl: "https://openlibrary.org/isbn/9780297764052" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/0882580132-L.jpg", title: "How Europe Underdeveloped Africa — Walter Rodney", linkUrl: "https://openlibrary.org/isbn/0882580132" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/9780435080167-L.jpg", title: "Decolonising the Mind — Ngũgĩ wa Thiong'o", linkUrl: "https://openlibrary.org/isbn/9780435080167" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/9780802141323-L.jpg", title: "The Wretched of the Earth — Frantz Fanon", linkUrl: "https://openlibrary.org/isbn/9780802141323" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/9780901787033-L.jpg", title: "Africa Must Unite — Kwame Nkrumah", linkUrl: "https://openlibrary.org/isbn/9780901787033" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/9780520034433-L.jpg", title: "A History of Africa — J.D. Fage", linkUrl: "https://openlibrary.org/isbn/9780520034433" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/0618001905-L.jpg", title: "King Leopold's Ghost — Adam Hochschild", linkUrl: "https://openlibrary.org/isbn/0618001905" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/0349104492-L.jpg", title: "The Scramble for Africa — Thomas Pakenham", linkUrl: "https://openlibrary.org/isbn/0349104492" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/0679724672-L.jpg", title: "The Black Jacobins — C.L.R. James", linkUrl: "https://openlibrary.org/isbn/0679724672" },
  ],
  "society-politics": [
    { imgUrl: "https://covers.openlibrary.org/b/isbn/9780385474542-L.jpg", title: "Things Fall Apart — Chinua Achebe", linkUrl: "https://openlibrary.org/isbn/9780385474542" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/9780226048680-L.jpg", title: "I Write What I Like — Steve Biko", linkUrl: "https://openlibrary.org/isbn/9780226048680" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/9780307719225-L.jpg", title: "Why Nations Fail — Acemoglu & Robinson", linkUrl: "https://openlibrary.org/isbn/9780307719225" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/9780521388016-L.jpg", title: "The State in Africa — Jean-François Bayart", linkUrl: "https://openlibrary.org/isbn/9780521388016" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/9780815702207-L.jpg", title: "Democracy and Development in Africa — Claude Ake", linkUrl: "https://openlibrary.org/isbn/9780815702207" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/0374139563-L.jpg", title: "Dead Aid — Dambisa Moyo", linkUrl: "https://openlibrary.org/isbn/0374139563" },
    { imgUrl: "https://covers.openlibrary.org/b/id/852880-L.jpg", title: "The Fate of Africa — Martin Meredith", linkUrl: "https://openlibrary.org/isbn/1586485482" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/0316548189-L.jpg", title: "Long Walk to Freedom — Nelson Mandela", linkUrl: "https://openlibrary.org/isbn/0316548189" },
  ],
  "arts-culture": [
    { imgUrl: "https://covers.openlibrary.org/b/isbn/9781400044702-L.jpg", title: "Half of a Yellow Sun — Chimamanda Ngozi Adichie", linkUrl: "https://openlibrary.org/isbn/9781400044702" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/9781101971062-L.jpg", title: "Homegoing — Yaa Gyasi", linkUrl: "https://openlibrary.org/isbn/9781101971062" },
    { imgUrl: "https://covers.openlibrary.org/b/id/275041-L.jpg", title: "Season of Migration to the North — Tayeb Salih", linkUrl: "https://openlibrary.org/isbn/0435900668" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/9781616953836-L.jpg", title: "Purple Hibiscus — Chimamanda Ngozi Adichie", linkUrl: "https://openlibrary.org/isbn/9781616953836" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/9780954702335-L.jpg", title: "Nervous Conditions — Tsitsi Dangarembga", linkUrl: "https://openlibrary.org/isbn/9780954702335" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/9780435902544-L.jpg", title: "The African Image — Ezekiel Mphahlele", linkUrl: "https://openlibrary.org/isbn/9780435902544" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/0435905554-L.jpg", title: "So Long a Letter — Mariama Bâ", linkUrl: "https://openlibrary.org/isbn/0435905554" },
    { imgUrl: "https://covers.openlibrary.org/b/id/275135-L.jpg", title: "The Joys of Motherhood — Buchi Emecheta", linkUrl: "https://openlibrary.org/isbn/0435906844" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/0385474555-L.jpg", title: "No Longer at Ease — Chinua Achebe", linkUrl: "https://openlibrary.org/isbn/0385474555" },
  ],
  "religion-philosophy": [
    { imgUrl: "https://covers.openlibrary.org/b/isbn/9780435895914-L.jpg", title: "African Religions and Philosophy — John S. Mbiti", linkUrl: "https://openlibrary.org/isbn/9780435895914" },
    { imgUrl: "https://covers.openlibrary.org/b/id/14166428-L.jpg", title: "Contrasts and Contests about Philosophy — Mogobe B. Ramose", linkUrl: "https://openlibrary.org/isbn/9781138223479" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/9781856494366-L.jpg", title: "An Introduction to African Philosophy — Samuel Olusegun Okafor", linkUrl: "https://openlibrary.org/isbn/9781856494366" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/9780521319386-L.jpg", title: "African Philosophy: An Introduction — Richard H. Bell", linkUrl: "https://openlibrary.org/isbn/9780521319386" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/0316552003-L.jpg", title: "The Africans: A Triple Heritage — Ali A. Mazrui", linkUrl: "https://openlibrary.org/isbn/0316552003" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/0195068521-L.jpg", title: "In My Father's House — Kwame Anthony Appiah", linkUrl: "https://openlibrary.org/isbn/0195068521" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/0253204682-L.jpg", title: "The Invention of Africa — V.Y. Mudimbe", linkUrl: "https://openlibrary.org/isbn/0253204682" },
    { imgUrl: "https://covers.openlibrary.org/b/isbn/0853451362-L.jpg", title: "Consciencism — Kwame Nkrumah", linkUrl: "https://openlibrary.org/isbn/0853451362" },
  ],
};

async function main() {
  await prisma.teamMember.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.bookRecommendation.deleteMany();

  for (const category of teamCategories) {
    for (const [i, member] of category.members.entries()) {
      await prisma.teamMember.create({
        data: {
          category: category.label,
          sortOrder: i,
          displayIndex: member.index,
          name: member.name,
          role: member.role,
          affiliation: member.affiliation ?? null,
          image: member.image ?? null,
        },
      });
    }
  }

  for (const [i, partner] of partners.entries()) {
    await prisma.partner.create({
      data: {
        sortOrder: i,
        name: partner.name,
        type: partner.type ?? null,
        logo: partner.logo ?? null,
      },
    });
  }

  for (const [genre, books] of Object.entries(bookGenres)) {
    for (const [i, book] of books.entries()) {
      await prisma.bookRecommendation.create({
        data: {
          genre,
          sortOrder: i,
          title: book.title,
          imgUrl: book.imgUrl,
          linkUrl: book.linkUrl,
        },
      });
    }
  }

  const counts = {
    teamMembers: await prisma.teamMember.count(),
    partners: await prisma.partner.count(),
    books: await prisma.bookRecommendation.count(),
  };
  console.log("Seeded:", JSON.stringify(counts, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
