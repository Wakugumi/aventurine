import { createZodDto } from 'nestjs-zod';
import { UpdateStoreRequestSchema } from '@aventurine/shared';

export class UpdateStoreDto extends createZodDto(UpdateStoreRequestSchema) { }
