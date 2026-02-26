import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { TareasService } from "./tareas.service";
import { CrearTareaDto } from "./dto/crear-tarea.dto";

@Controller("tareas")
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  crear(@Body() datos: CrearTareaDto) {
    return this.tareasService.crear(datos);
  }

  @Get()
  listar() {
    return this.tareasService.listar();
  }

  @Delete(":id")
  eliminar(@Param("id") id: string) {
    return this.tareasService.eliminar(Number(id));
  }
}