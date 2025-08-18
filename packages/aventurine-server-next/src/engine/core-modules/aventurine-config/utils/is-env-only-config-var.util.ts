import { TypedReflect } from 'src/utils/typed-reflect';
import { ConfigVariables } from '../config-variables';

export const isEnvOnlyConfigVar = (key: keyof ConfigVariables): boolean => {
  const metadata =
    TypedReflect.getMetadata('config-variables', ConfigVariables) ?? {};
  const envMetadata = metadata[key];

  return !!envMetadata?.isEnvOnly;
};
