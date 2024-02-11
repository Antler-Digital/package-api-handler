import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextApiRequestQuery } from 'next/dist/server/api-utils';
import type { JWT } from 'next-auth/jwt';

import type { CustomErrorsType, DefaultErrorType } from './errors.ts';
import type HttpStatusCode from './http-status-codes.js';

export type FetcherOptions = {
  method: MethodTypes;
  data?: object;
  headers: {
    [key: string]: string;
  };
};

export type MethodTypes = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type ErrorCodeType = {
  [key: string]: string;
  GENERAL: 'GENERAL';
};
type ErrorCodeKeys = {
  [key: string]: string;
};

export type MakeErrorOutput = NextApiResponse & {
  status: HttpStatusCode;
  sourceType: ErrorCodeType;
  isError: true;
  errorCode: ErrorCodeType;
  message: string;
  details: {
    requestUrl: string;
    requestBody: RequestBodyType;
    responseBody: object | null;
    requestHeaders: object | null;
    requiresAuth?: boolean | null;
    hadToken?: boolean | null;
  };
};

export type RequestBodyType = Record<string, any> | null;

export type MakeErrorInput = {
  status: HttpStatusCode;
  sourceType: ErrorCodeType | string;
  message: string;
  errorCode: ErrorCodeType;
  details: {
    requestUrl: string;
    requestBody: RequestBodyType;
    responseBody?: object;
    requestHeaders?: object;
    requiresAuth?: boolean;
    hadToken?: boolean;
  };
};

export type UnauthenticatedMethodsType = {
  [index: MethodTypes]: boolean;
  GET?: boolean;
  POST?: boolean;
  PUT?: boolean;
  DELETE?: boolean;
  PATCH?: boolean;
};

type APIHandlerOptionsType = {
  authenticate: (req: NextApiRequest) => Promise<JWT | null>;
  publicMethods?: UnauthenticatedMethodsType;
  sourceType: string;
};

export type MakeHttpResponse = (args: HandlerArgumentsType) => Promise<
  | {
      // response: NextApiResponse<MakeErrorOutput | SuccessResponseType<T>>;
      response?: Response;
      defaultResponse?: DefaultErrorType;
    }
  | undefined
>;

// Partial so not every method is required for each handler instance
type APIHandlerMethods = Partial<Record<MethodTypes, MakeHttpResponse>>;

export interface APIInitalisationType extends APIHandlerMethods {
  config: APIHandlerOptionsType;
  customErrors?: CustomErrorsType;
}

type HandlerArgumentsType = {
  query: NextApiRequestQuery;
  body: RequestBodyType;
  isAuthenticated: boolean;
  authentication: JWT | null;
};

export type SuccessResponseType<T> = {
  ok: boolean;
  error: boolean;
  sourceType?: string;
  blob?: Promise<Blob> | null;
  data: T | null;
};
export type ErrorResponseType = MakeErrorOutput;

export type ApiHandlerResponse<T = any> = SuccessResponseType<T> &
  ErrorResponseType;

type BaseHandlerResponse = null;
