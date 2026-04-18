import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { FileContext } from "../enums/file-context.enum";

export class CreateUploadInstructionDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  referenceId!: string;

  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsEnum(FileContext)
  context!: FileContext;
}


