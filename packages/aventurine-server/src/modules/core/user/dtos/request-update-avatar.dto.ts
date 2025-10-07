import { IsEnum, IsString } from 'class-validator';
import { ContentTypes } from 'src/engine/storage/types/storage.types';

export class RequestUpdateAvatarDto {
  @IsString()
  userId: string;

  @IsEnum(ContentTypes)
  contentType: ContentTypes;
}
