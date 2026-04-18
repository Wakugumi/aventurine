import { UploadConfirmRequestSchema } from '@aventurine/shared';
import { createZodDto } from 'nestjs-zod'

export class UploadConfirmDto extends createZodDto(UploadConfirmRequestSchema) { }
