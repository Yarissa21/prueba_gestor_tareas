import { IsString, IsNotEmpty, IsDate } from "class-validator";
import { Type } from "class-transformer";



export class CrearTareaDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsDate()
  @Type(() => Date)
  fechaLimite: Date;
}
