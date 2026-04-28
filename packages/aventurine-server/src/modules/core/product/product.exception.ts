import { CustomException } from "src/utils/custom-exception";

export class ProductException extends CustomException {

}

export enum ProductExceptionCode {
  PRODUCT_NOT_EXIST = "PRODUCT_NOT_EXIST",
  UPDATE_FAILED = "UPDATE_FAILED"
}
