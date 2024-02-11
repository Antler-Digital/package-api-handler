// @ts-ignore
import type { NextApiRequestQuery } from 'next/dist/server/api-utils';
import type { JWT } from 'next-auth/jwt';

import type { SuccessResponseType } from './api-handler';
import {
  EXCEPTION_CODE_ERROR,
  getErrorFromCode,
  getErrorFromStatus,
  METHOD_NOT_ALLOWED,
  UNAUTHORISED,
} from './error-codes';
import createErrorMessage from './error-messages';
import type {
  BaseErrorCodeEnum,
  CustomErrorType,
  ErrorDetailsType,
  ErrorObjectInput,
  ErrorObjectOutput,
} from './errors.d';
import { CREATE_ERROR_OF_TYPE } from './errors-factory';
import { isBaseErrorCode } from './handler-helpers';

// having this hear makes it easier to see what is being passed in
type DefaultErrorInput = {
  requestUrl: string;
  requestBody: object | null;
  requestHeaders: object;
  isAuthenticated: boolean;
  requiresAuth: boolean;
  requestQuery: NextApiRequestQuery;
  authentication: JWT | null;
  sourceType: string;
};

export const makeDefaultErrors = (defaultErrorInput: DefaultErrorInput) => {
  return {
    [UNAUTHORISED]: defaultErrorOfType(defaultErrorInput, UNAUTHORISED),
    [METHOD_NOT_ALLOWED]: defaultErrorOfType(
      defaultErrorInput,
      METHOD_NOT_ALLOWED,
    ),
    [EXCEPTION_CODE_ERROR]: defaultErrorOfType(
      defaultErrorInput,
      EXCEPTION_CODE_ERROR,
    ),
  };
};

// make the error object with detaiils
export const makeErrorObject = ({
  status,
  sourceType,
  message = '',
  code,
  details,
}: ErrorObjectInput): ErrorObjectOutput => {
  // check is baseErrorCode
  const isBaseError = isBaseErrorCode(code);

  // create error with passed error type and messages if custom
  let retrievedError = {
    status: status || null,
    // use the specific generic message or pass a custom message
    message,
    code,
    sourceType,
  };

  if (isBaseError) {
    const baseError = getErrorFromCode(code as BaseErrorCodeEnum);
    // generate the specific message
    const errorMessage = createErrorMessage(
      code as BaseErrorCodeEnum,
      sourceType,
    );

    retrievedError = {
      ...retrievedError,
      status: baseError.status,
      // use the specific generic message or pass a custom message
      message: errorMessage,
      code: baseError?.code || code,
    };
  }

  return {
    ...retrievedError,
    isError: true,
    details: {
      ...details,
      requestBody: details.requestBody || null,
      responseBody: details.responseBody || null,
      requestHeaders: details.requestHeaders || null,
    },
  };
};

// create default errors by type (not status)
export const defaultErrorOfType = (
  defaultErrorInput: DefaultErrorInput,
  errorCode: BaseErrorCodeEnum,
): ErrorObjectOutput => {
  const baseError = CREATE_ERROR_OF_TYPE(
    defaultErrorInput.sourceType,
    errorCode,
  );
  const errorDetails = getErrorDetails(defaultErrorInput);
  return makeErrorObject({
    ...baseError,
    ...errorDetails,
  });
};

// structure the error details correctly
const getErrorDetails = (
  defaultErrorInput: DefaultErrorInput,
): { details: ErrorDetailsType } => {
  const {
    requestUrl,
    requestBody,
    requestHeaders,
    isAuthenticated,
    authentication,
    requestQuery,
    requiresAuth,
  } = defaultErrorInput;
  return {
    details: {
      requestUrl,
      requestBody,
      requestQuery,
      requestHeaders,
      isAuthenticated,
      authentication,
      requiresAuth,
    },
  };
};

export const makeResponseObject = <T>(
  {
    status,
    sourceType,
    data,
    code,
    message,
    requestDetails,
  }: {
    status: number;
    sourceType: string;
    data: T;
    code?: string;
    blob?: Blob;
    message?: string;
    requestDetails: ErrorDetailsType;
  },
  customError?: CustomErrorType,
) => {
  if (customError) {
    return makeErrorObject({
      sourceType,
      // use the custom error if there is one
      code: customError?.code,
      status: customError?.status || 500,
      message: customError?.message,
      details: requestDetails,
    });
  }

  if (status >= 200 && status < 300) {
    return makeSuccessObject({
      sourceType,
      data,
    });
  }

  // get the error associated with the status
  const BASE_ERROR = getErrorFromStatus(status);

  return makeErrorObject({
    ...BASE_ERROR,
    sourceType,
    // use the custom error if there is one
    code: code || BASE_ERROR.code,
    message: message || BASE_ERROR.message,
    details: requestDetails,
  });
};

const makeSuccessObject = <T>(successResponse: {
  sourceType: string;
  data: T;
}): SuccessResponseType<T> => {
  return {
    ok: true,
    error: false,
    ...successResponse,
  };
};
