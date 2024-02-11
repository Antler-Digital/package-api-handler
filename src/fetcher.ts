/* eslint-disable no-console */
import config from '../config';

const fetcher = async (
  relativeUrl: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  data?: object | null,
  headers?: object,
) => {
  try {
    if (method === 'GET') {
      const res = await fetch(`${config.URL}${relativeUrl}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return res.json();
    }

    const res = await fetch(`${config.URL}${relativeUrl}`, {
      method: method,
      body: data && JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    return res.json();
  } catch (error) {
    // capture error on sentry
    console.log(`Error making request to ${config.URL}${relativeUrl}`);
    console.log(error);
    return {
      error: true,
      message: error,
    };
  }
};

export default fetcher;
