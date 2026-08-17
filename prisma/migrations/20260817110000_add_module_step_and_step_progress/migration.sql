-- CreateTable
CREATE TABLE "ModuleStep" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "videoUrl" TEXT,
    "videoProvider" TEXT,
    "videoId" TEXT,
    "audioUrl" TEXT,
    "contentMarkdown" TEXT,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "quizData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModuleStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StepProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "score" INTEGER,
    "answers" JSONB,

    CONSTRAINT "StepProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ModuleStep_moduleId_orderIndex_idx" ON "ModuleStep"("moduleId", "orderIndex");

-- CreateIndex
CREATE INDEX "StepProgress_userId_idx" ON "StepProgress"("userId");

-- CreateIndex
CREATE INDEX "StepProgress_stepId_idx" ON "StepProgress"("stepId");

-- CreateIndex
CREATE UNIQUE INDEX "StepProgress_userId_stepId_key" ON "StepProgress"("userId", "stepId");

-- AddForeignKey
ALTER TABLE "ModuleStep" ADD CONSTRAINT "ModuleStep_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepProgress" ADD CONSTRAINT "StepProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepProgress" ADD CONSTRAINT "StepProgress_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "ModuleStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;
