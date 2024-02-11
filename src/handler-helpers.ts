import type { NextApiRequest, NextApiResponse } from 'next';

import type {
  ErrorResponseType,
  MethodTypes,
  SuccessResponseType,
  UnauthenticatedMethodsType,
} from './api-handler';
import { BaseErrorCodes } from './errors';
import type {
  BaseErrorCodesType,
  CustomErrorsType,
  CustomErrorType,
} from './errors.d';

export const shouldMethodBeUnauthenticated = (
  unauthenticatedMethods: UnauthenticatedMethodsType = {
    GET: false,
    POST: false,
    PUT: false,
    DELETE: false,
    PATCH: false,
  },
  method: MethodTypes,
) => {
  return unauthenticatedMethods[`${method}`];
};

export const isBaseErrorCode = (code: BaseErrorCodesType | string) => {
  return Object.keys(BaseErrorCodes).includes(code as string);
};

export const handlerWrapper = async <BodyResponseArgumentType>(
  response: NextApiResponse,
  handlerFunction: () => Promise<
    NextApiResponse<
      SuccessResponseType<BodyResponseArgumentType> | ErrorResponseType
    >
  >,
  exceptionError: ErrorResponseType,
) => {
  try {
    return await handlerFunction();
  } catch (e) {
    return response.status(500).json(exceptionError);
  }
};

export const hasCustomErrors = (
  customErrors: CustomErrorsType,
  response?: Response,
  request?: NextApiRequest,
) => {
  return customErrors.find((error) => {
    return error.hasError({ res: response, req: request });
  });
};

export const getBody = async (response: Response) => {
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
};

export const getStatus = (
  externalResponse?: Response,
  defaultStatus?: number,
  customError?: CustomErrorType,
) => {
  if (customError?.status) return customError.status;
  if (externalResponse?.status) return externalResponse.status;
  if (defaultStatus) return defaultStatus;
  return 500;
};
