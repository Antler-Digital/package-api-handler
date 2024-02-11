import createErrorMessage from './error-messages';
import type {
  BaseErrorCodeEnum,
  BaseErrorCodeObjectType,
  BaseErrorCodesType,
} from './errors.d';
import type HttpStatusCode from './http-status-codes';

// Base constants codes
export const BAD_REQUEST = 'BAD_REQUEST';
export const UNAUTHORISED = 'UNAUTHORISED';
export const NOT_FOUND = 'NOT_FOUND';
export const METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED';
export const VALIDATION_ERROR = 'VALIDATION_ERROR';
export const TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS';
export const INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';
export const SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE';
export const UNKNOWN_API_ERROR = 'UNKNOWN_API_ERROR';
export const EXCEPTION_CODE_ERROR = 'EXCEPTION_CODE_ERROR';

export const GENERAL = 'GENERAL';

export const BASE_ERROR_CODES: {
  [index: string]: BaseErrorCodeEnum;
} = {
  BAD_REQUEST,
  UNAUTHORISED,
  NOT_FOUND,
  METHOD_NOT_ALLOWED,
  VALIDATION_ERROR,
  TOO_MANY_REQUESTS,
  INTERNAL_SERVER_ERROR,
  SERVICE_UNAVAILABLE,
  UNKNOWN_API_ERROR,
  EXCEPTION_CODE_ERROR,
};

export const BASE_ERROR_CODES_ARRAY: BaseErrorCodeEnum[] = [
  BAD_REQUEST,
  UNAUTHORISED,
  NOT_FOUND,
  METHOD_NOT_ALLOWED,
  VALIDATION_ERROR,
  TOO_MANY_REQUESTS,
  INTERNAL_SERVER_ERROR,
  SERVICE_UNAVAILABLE,
  UNKNOWN_API_ERROR,
  EXCEPTION_CODE_ERROR,
];

export const getErrorFromCode = (code: BaseErrorCodeEnum) => {
  return BASE_ERRORS[`${code}`];
};
export const getErrorFromStatus = (status: HttpStatusCode) => {
  return BASE_ERRORS_BY_STATUS[`${status}`];
};

const BASE_ERRORS: BaseErrorCodesType = {
  [BAD_REQUEST]: {
    status: 400,
    sourceType: GENERAL,
    message: createErrorMessage(BAD_REQUEST),
    code: BAD_REQUEST,
  },
  [UNAUTHORISED]: {
    status: 403,
    sourceType: GENERAL,
    message: createErrorMessage(UNAUTHORISED),
    code: UNAUTHORISED,
  },
  [NOT_FOUND]: {
    status: 404,
    sourceType: GENERAL,
    message: createErrorMessage(NOT_FOUND),
    code: NOT_FOUND,
  },
  [METHOD_NOT_ALLOWED]: {
    status: 405,
    sourceType: GENERAL,
    message: createErrorMessage(METHOD_NOT_ALLOWED),
    code: METHOD_NOT_ALLOWED,
  },
  [VALIDATION_ERROR]: {
    status: 422,
    sourceType: GENERAL,
    message: createErrorMessage(VALIDATION_ERROR),
    code: VALIDATION_ERROR,
  },
  [TOO_MANY_REQUESTS]: {
    status: 429,
    sourceType: GENERAL,
    message: createErrorMessage(TOO_MANY_REQUESTS),
    code: TOO_MANY_REQUESTS,
  },
  [INTERNAL_SERVER_ERROR]: {
    status: 500,
    sourceType: GENERAL,
    message: createErrorMessage(INTERNAL_SERVER_ERROR),
    code: INTERNAL_SERVER_ERROR,
  },
  [SERVICE_UNAVAILABLE]: {
    status: 503,
    sourceType: GENERAL,
    message: createErrorMessage(SERVICE_UNAVAILABLE),
    code: SERVICE_UNAVAILABLE,
  },
  [UNKNOWN_API_ERROR]: {
    status: null,
    sourceType: GENERAL,
    message: createErrorMessage(UNKNOWN_API_ERROR),
    code: UNKNOWN_API_ERROR,
  },
  // used if there is a code exception in a try catch
  [EXCEPTION_CODE_ERROR]: {
    status: null,
    sourceType: GENERAL,
    message: createErrorMessage(EXCEPTION_CODE_ERROR),
    code: EXCEPTION_CODE_ERROR,
  },
};

export const BASE_ERRORS_BY_STATUS = Object.entries(BASE_ERRORS).reduce(
  (acc: { [index: string]: BaseErrorCodeObjectType }, [, value]) => {
    if (value.status) {
      acc[`${value.status}`] = value;
    }
    return acc;
  },
  {},
);

export default BASE_ERRORS;
