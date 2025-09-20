-- CreateTable
CREATE TABLE "public"."logs" (
    "id" TEXT NOT NULL,
    "deployment_id" TEXT NOT NULL,
    "log" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "logs_deployment_id_idx" ON "public"."logs"("deployment_id");

-- AddForeignKey
ALTER TABLE "public"."logs" ADD CONSTRAINT "logs_deployment_id_fkey" FOREIGN KEY ("deployment_id") REFERENCES "public"."deployments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
