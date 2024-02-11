/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import BASE_ERRORS, { UNKNOWN_API_ERROR } from './error-codes';
import createErrorMessage from './error-messages';
import type { BaseErrorCodeEnum, BaseErrorCodeObjectType } from './errors.d';
import { isBaseErrorCode } from './handler-helpers';
import type HttpStatusCode from './http-status-codes';

export const CREATE_ERRORS_OF_BASE_TYPE = (type: string) => {
  const baseErrorsKey = Object.keys(BASE_ERRORS) as BaseErrorCodeEnum[];

  // this 'object' type here needs to be refactored
  return baseErrorsKey.reduce((acc: object, key: BaseErrorCodeEnum) => {
    return {
      ...acc,
      [`${type}_${key}`]: {
        ...BASE_ERRORS[`${key}`],
        sourceType: type,
        code: `${type}_${key}`,
        message: createErrorMessage(key, type),
      },
    };
  }, {});
};

export const CREATE_ERROR_OF_TYPE = (
  type: string,
  code: BaseErrorCodeEnum | string,
  status?: HttpStatusCode,
  message?: string,
): BaseErrorCodeObjectType => {
  // should check if it is a base error code
  const isBaseError = isBaseErrorCode(code);

  if (isBaseError) {
    const baseErrorCode = code as BaseErrorCodeEnum;
    // this will be a BaseErrorCodeEnum as it has to pass the isBaseError check above
    const baseError = BASE_ERRORS?.[`${baseErrorCode}`];
    return {
      ...baseError,
      sourceType: type,
      code: `${type}_${code as BaseErrorCodeEnum}`,
      message: createErrorMessage(baseErrorCode, type),
    };
  }
  // if there is a code, its not a base error, and there is a message and a status
  // then return the custom error
  if (code && message && status) {
    return {
      status,
      sourceType: type,
      code: `${type}_${code as BaseErrorCodeEnum}`,
      message: message,
    };
  }

  return {
    ...BASE_ERRORS[`${UNKNOWN_API_ERROR}`],
    status: 500,
    sourceType: type,
    code: `${type}_${code as BaseErrorCodeEnum}`,
  };
};
