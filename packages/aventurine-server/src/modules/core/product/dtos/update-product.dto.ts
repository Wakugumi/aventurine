import { UpdateProductRequestSchema } from "@aventurine/shared";
import { createZodDto } from "nestjs-zod";

export class UpdateProductDto extends createZodDto(UpdateProductRequestSchema) {

}
