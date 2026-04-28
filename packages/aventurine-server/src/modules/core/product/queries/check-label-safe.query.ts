import { Query } from "@nestjs/cqrs";

export class CheckLabelSafeQuery extends Query<boolean> {
  constructor(
    public readonly ownerId: string,
    public readonly label: string) { super(); }

}
