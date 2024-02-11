/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import type { NextApiRequest } from 'next';
import type { NextApiRequestQuery } from 'next/dist/server/api-utils';
import type { JWT } from 'next-auth/jwt';

import { BASE_ERROR_CODES } from './error-codes.js';
import type HttpStatusCode from './http-status-codes.js';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createEnum<T extends { [P in keyof T]: P }>(o: T) {
  return o;
}

export const BaseErrorCodes = createEnum(BASE_ERROR_CODES);

export type BaseErrorCodeEnum =
  | BAD_REQUEST
  | UNAUTHORISED
  | NOT_FOUND
  | METHOD_NOT_ALLOWED
  | VALIDATION_ERROR
  | TOO_MANY_REQUESTS
  | INTERNAL_SERVER_ERROR
  | SERVICE_UNAVAILABLE
  | UNKNOWN_API_ERROR
  | EXCEPTION_CODE_ERROR;

export type BAD_REQUEST = 'BAD_REQUEST';
export type UNAUTHORISED = 'UNAUTHORISED';
export type NOT_FOUND = 'NOT_FOUND';
export type METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED';
export type VALIDATION_ERROR = 'VALIDATION_ERROR';
export type TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS';
export type INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';
export type SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE';
export type UNKNOWN_API_ERROR = 'UNKNOWN_API_ERROR';
export type EXCEPTION_CODE_ERROR = 'EXCEPTION_CODE_ERROR';

export type ErrorCodeType =
  | BaseErrorCodeEnum
  | `${string}_${BaseErrorCodeEnum}`
  | string;

export type CustomErrorsType = CustomErrorType[];

export type CustomErrorType = {
  code: ErrorCodeType;
  message: string;
  status?: HttpStatusCode;
  hasError: ({ res, req }: { res?: Response; req?: NextApiRequest }) => boolean;
};

export type DefaultErrorType = {
  code: ErrorCodeType;
  message: string;
  status: HttpStatusCode;
  data?: object;
};

export type ErrorMessageObjectType = {
  [key in BaseErrorCodeEnum]: (type?: string) => string;
};

export type BaseErrorCodeObjectType = {
  status: HttpStatusCode | null;
  message: string;
  code: ErrorCodeType;
  sourceType: string;
};

export type BaseErrorCodesType = {
  [key in BaseErrorCodeEnum]: BaseErrorCodeObjectType;
};

type RequestBodyType = object | null;

export type ErrorDetailsType = {
  requestUrl: string;
  requestBody: RequestBodyType;
  requestHeaders: object | null;
  responseBody?: object | null;
  requiresAuth?: boolean;
  requestQuery?: NextApiRequestQuery;
  isAuthenticated?: boolean;
  authentication?: JWT | null;
  hadToken?: boolean;
};

export type ErrorObjectOutput = BaseErrorCodeObjectType & {
  details: ErrorDetailsType;
  isError: true;
};

interface ErrorInputBase {
  message: string;
  sourceType: string;
  details: ErrorDetailsType;
}

// interface ErrorStatus extends ErrorInputBase {
//     status: HttpStatusCode | null;
//     code: never;
// }
// interface ErrorCode extends ErrorInputBase {
//     code: ErrorCodeType;
//     status: never;
// }

export interface ErrorObjectInput extends ErrorInputBase {
  code: ErrorCodeType;
  status: HttpStatusCode | null;
}

// export type ErrorObjectInput = ErrorCode | ErrorStatus;
// | ErrorCode
// | ErrorStatus;
