/* eslint-disable security/detect-object-injection */
import type { NextApiRequest, NextApiResponse } from 'next';

import type {
  APIInitalisationType,
  ErrorResponseType,
  HandlerArgumentsType,
  MethodTypes,
  SuccessResponseType,
} from './api-handler';
import type { DefaultErrorType } from './errors';
import {
  getBody,
  getStatus,
  hasCustomErrors,
  shouldMethodBeUnauthenticated,
} from './handler-helpers';
import type HttpStatusCode from './http-status-codes';
import {
  makeDefaultErrors,
  makeErrorObject,
  makeResponseObject,
} from './make-responses';

// default to auth required
const APIHandler = async <T>(
  // options and parameters
  // accepts an authenticate function, and an object of unauthenticated methods
  // also has a source type for error handling
  // all the details about the requests
  request: NextApiRequest,
  response: NextApiResponse,
  options: APIInitalisationType,
): // handles the methods
// pass in the custom errors
// eslint-disable-next-line sonarjs/cognitive-complexity
Promise<SuccessResponseType<T> | ErrorResponseType | void> => {
  // extract all the basic details from the request
  const method = request.method as MethodTypes;
  const query = request.query;
  const url = request.url;
  const headers = request.headers;
  const body =
    typeof request.body === 'string' && request.body
      ? JSON.parse(request.body)
      : Object.keys(request.body).length > 0
        ? request.body
        : undefined;

  const { config, customErrors = [] } = options;
  const { authenticate, publicMethods, sourceType } = config;

  // pass in an authentication function to authenticate the request
  // should return null or a JTW token / object
  const isAuthenticated = await authenticate(request);

  // check if the method that is being used needs to be authenticated
  const methodRequiresAuthentication = !shouldMethodBeUnauthenticated(
    publicMethods,
    method,
  );

  // construct a request details object (this is for error messages)
  const requestDetails = {
    requestUrl: url,
    requestBody: body || null,
    requestHeaders: headers,
    isAuthenticated: !!isAuthenticated,
    authentication: isAuthenticated,
    requestQuery: query,
    sourceType,
    requiresAuth: methodRequiresAuthentication,
  };

  // create default errors
  //@ts-ignore
  const { UNAUTHORISED, EXCEPTION_CODE_ERROR, METHOD_NOT_ALLOWED } =
    makeDefaultErrors(requestDetails);

  // send an unauthenticated error if the method requires authentication
  if (!isAuthenticated && methodRequiresAuthentication) {
    return response.status(Number(UNAUTHORISED.status)).json(UNAUTHORISED);
  }

  // create handler arguments and information
  // this is passed to the handler functions
  const handlerArguments: HandlerArgumentsType = {
    query,
    body,
    isAuthenticated: !!isAuthenticated,
    authentication: isAuthenticated,
  };

  try {
    // the primary function to handle errors and success of the request
    // takes in an object (later we could expand to provide other settings per request etc)
    const handlerWrapper = async (externalRequest?: {
      response?: Response;
      defaultResponse?: DefaultErrorType;
      // need to add this logic in
      // this can throw an error if there is not the expected status from the endpoint
      expectedStatus?: HttpStatusCode;
    }) => {
      // rename the response more accurately
      const externalResponse = externalRequest?.response;
      const defaultResponse = externalRequest?.defaultResponse;

      // find any custom errors
      const customError = hasCustomErrors(
        customErrors,
        externalResponse,
        request,
      );

      // extract the status for the requests
      const resStatus = getStatus(
        externalResponse,
        Number(defaultResponse?.status),
        customError,
      );

      if (defaultResponse && !customError) {
        return response.status(resStatus).json(
          makeResponseObject({
            sourceType,
            //@ts-ignore
            requestDetails,
            data: defaultResponse.data,
            ...defaultResponse,
          }),
        );
      }

      // show a default response if there is no response returned in the handler
      if (!externalResponse && !customError) {
        return response.status(resStatus).json(
          makeErrorObject({
            code: 'NO_RESPONSE_RETURNED',
            message: 'No response returned from handler',
            status: 500,
            sourceType,
            //@ts-ignore
            details: {
              ...requestDetails,
            },
          }),
        );
      }

      // create the response object (both error and success)
      return response.status(resStatus).json(
        makeResponseObject(
          {
            sourceType,
            status: resStatus,
            data: externalResponse ? await getBody(externalResponse) : null,
            //@ts-ignore
            requestDetails,
          },
          customError,
        ),
      );
    };

    // assign function
    const handlerMethodFunction = options[method];

    // if method return method
    if (handlerMethodFunction) {
      return handlerWrapper(
        await handlerMethodFunction({
          ...handlerArguments,
        }),
      );
    }

    // if no method return default no method
    return response
      .status(Number(METHOD_NOT_ALLOWED.status))
      .json(METHOD_NOT_ALLOWED);
  } catch (e: any) {
    return response
      .status(500)
      .json({ ...EXCEPTION_CODE_ERROR, message: e.message });
  }
};

export default APIHandler;
