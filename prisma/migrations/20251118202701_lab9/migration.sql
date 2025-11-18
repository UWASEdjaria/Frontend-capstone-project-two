-- CreateTable
CREATE TABLE "FollowLab9" (
    "id" SERIAL NOT NULL,
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,

    CONSTRAINT "FollowLab9_pkey" PRIMARY KEY ("id")
);
