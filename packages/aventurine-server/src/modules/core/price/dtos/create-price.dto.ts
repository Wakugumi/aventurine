import { CreatePriceRequestSchema } from "@aventurine/shared";
import { createZodDto } from "nestjs-zod";

export class CreatePriceDto extends createZodDto(CreatePriceRequestSchema) { }
