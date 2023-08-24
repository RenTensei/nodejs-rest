import { NextFunction, Request, RequestHandler, Response } from 'express';

import type { ParamsDictionary } from 'express-serve-static-core';

// export default (handler: RequestHandler) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await handler(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };
// };

// use generic type to let request handlers know about request params, if passed.
export default <T extends ParamsDictionary>(handler: RequestHandler<T>) => {
  return (req: Request<T>, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};
