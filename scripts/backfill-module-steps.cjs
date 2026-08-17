// One-off data migration: splits each existing Module's flat content
// (contentMarkdown/video*/syllabus*) into ModuleStep rows, and carries
// forward existing UserProgress completions as StepProgress rows for every
// step produced from that module (the old model had no finer granularity,
// so a completed module means all its new steps inherit completed=true).
//
// Idempotent: skips any Module that already has steps, so it's safe to
// re-run. Run with: node scripts/backfill-module-steps.cjs
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const modules = await prisma.module.findMany({
    orderBy: { orderIndex: "asc" },
    include: { steps: true, progress: true },
  });

  const summary = [];

  for (const learningModule of modules) {
    if (learningModule.steps.length > 0) {
      summary.push({ moduleId: learningModule.id, title: learningModule.title, skipped: "already has steps" });
      continue;
    }

    const stepsToCreate = [];
    let orderIndex = 0;

    if (learningModule.videoProvider && learningModule.videoId) {
      stepsToCreate.push({
        type: "video",
        title: "Video",
        orderIndex: orderIndex++,
        videoProvider: learningModule.videoProvider,
        videoId: learningModule.videoId,
        videoUrl: learningModule.videoUrl,
        audioUrl: learningModule.audioUrl,
      });
    } else if (learningModule.videoUrl || learningModule.audioUrl) {
      stepsToCreate.push({
        type: "video",
        title: "Video",
        orderIndex: orderIndex++,
        videoUrl: learningModule.videoUrl,
        audioUrl: learningModule.audioUrl,
      });
    }

    // contentMarkdown is non-nullable on Module today, so every module gets a text step.
    stepsToCreate.push({
      type: "text",
      title: "Reading",
      orderIndex: orderIndex++,
      contentMarkdown: learningModule.contentMarkdown,
    });

    if (learningModule.syllabusUrl) {
      stepsToCreate.push({
        type: "file",
        title: "Download",
        orderIndex: orderIndex++,
        fileUrl: learningModule.syllabusUrl,
        fileName: learningModule.syllabusFileName,
      });
    }

    const createdSteps = [];
    for (const stepData of stepsToCreate) {
      const step = await prisma.moduleStep.create({
        data: { moduleId: learningModule.id, ...stepData },
      });
      createdSteps.push(step);
    }

    const completedProgress = learningModule.progress.filter((p) => p.completed);
    for (const progress of completedProgress) {
      for (const step of createdSteps) {
        await prisma.stepProgress.upsert({
          where: { userId_stepId: { userId: progress.userId, stepId: step.id } },
          update: { completed: true, completedAt: progress.completedAt ?? new Date() },
          create: {
            userId: progress.userId,
            stepId: step.id,
            completed: true,
            completedAt: progress.completedAt ?? new Date(),
          },
        });
      }
    }

    summary.push({
      moduleId: learningModule.id,
      title: learningModule.title,
      stepsCreated: createdSteps.map((s) => ({ id: s.id, type: s.type, title: s.title })),
      progressCarriedForward: completedProgress.map((p) => p.userId),
    });
  }

  console.log(JSON.stringify(summary, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
