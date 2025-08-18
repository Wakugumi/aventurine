import { Transform } from 'class-transformer';
import { snakeCase } from 'lodash';

export const CastToUpperSnakeCase = () =>
  Transform(({ value }: { value: string }) => toUpperSnakeCase(value));

const toUpperSnakeCase = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    return snakeCase(value.trim()).toUpperCase();
  }

  return undefined;
};
