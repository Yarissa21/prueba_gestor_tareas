import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Tarea } from "@prisma/client";
import { CrearTareaDto } from "./dto/crear-tarea.dto";

@Injectable()
export class TareasService {
  constructor(private readonly prisma: PrismaService) {}

    async crear(datos: CrearTareaDto): Promise<Tarea> {
        const fecha = datos.fechaLimite instanceof Date
            ? datos.fechaLimite
            : new Date(datos.fechaLimite as unknown as string);

        return this.prisma.tarea.create({
            data: {
            descripcion: datos.descripcion,
            fechaLimite: fecha,
            },
        });
    }

  async listar(): Promise<Tarea[]> {
    return this.prisma.tarea.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async eliminar(id: number): Promise<Tarea> {
    return this.prisma.tarea.delete({
      where: { id },
    });
  }
}