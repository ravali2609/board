import { NOT_FOUND } from "../constants/http-status-codes.js";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "../constants/http-status-phrases.js";
import BaseException from "./base-exception.js";

export default class NotFoundException extends BaseException {
  constructor(message?: string, errData?: any) {
    super(NOT_FOUND, message || NOT_FOUND_MESSAGE, NOT_FOUND_MESSAGE, true, errData);
  }
}
