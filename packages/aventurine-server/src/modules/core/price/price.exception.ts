import { CustomException } from "src/utils/custom-exception";

export class PriceException extends CustomException {

}

export enum PriceExceptionCode {
  PRICE_NOT_FOUND = 'PRICE_NOT_FOUND',
  INVALID_DATA = 'INVALID_DATA',
  CURRENCY_NOT_MATCH = "CURRENCY_NOT_MATCH"

}
