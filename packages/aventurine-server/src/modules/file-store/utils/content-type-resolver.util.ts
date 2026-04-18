import { ContentType } from "@aventurine/shared";

export function ResolveContentType(extension: string): ContentType {
  switch (extension) {

    case "jpg":
      return ContentType.JPEG;

    case "jpeg":
      return ContentType.JPEG;

    case "png": return ContentType.PNG;

    default:
      throw new Error(`Cannot resolve for extension ${extension}`)
  }
}
