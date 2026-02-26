-- CreateEnum
CREATE TYPE "EstadoTarea" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'COMPLETADO');

-- CreateTable
CREATE TABLE "Tarea" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaLimite" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoTarea" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tarea_pkey" PRIMARY KEY ("id")
);
