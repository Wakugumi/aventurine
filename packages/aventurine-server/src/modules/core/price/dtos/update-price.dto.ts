import { UpdatePriceRequestSchema } from "@aventurine/shared";
import { createZodDto } from "nestjs-zod";

export class UpdatePriceDto extends createZodDto(UpdatePriceRequestSchema) { }
