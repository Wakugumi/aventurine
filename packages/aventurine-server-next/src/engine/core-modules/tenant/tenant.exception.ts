import { CustomException } from 'src/utils/custom-exception';

export class TenantException extends CustomException {
  declare code: TenantExceptionCode;
  constructor(message: string, code: TenantExceptionCode) {
    super(message, code);
  }
}

export enum TenantExceptionCode {
  SUBDOMAIN_ALREADY_EXISTS = 'SUBDOMAIN_ALREADY_EXISTS',
  SUBDOMAIN_NOT_FOUND = 'SUBDOMAIN_NOT_FOUND',
  DOMAIN_ALREADY_EXISTS = 'DOMAIN_ALREADY_EXISTS',
  TENANT_NOT_FOUND = 'TENANT_NOT_FOUND',
  ENVIRONMENT_NOT_FOUND = 'ENVIRONMENT_NOT_FOUND',
}
