module.exports = handler => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// use generic type to let request handlers know about request params, if passed.
// export default <T extends ParamsDictionary>(handler: RequestHandler<T>) => {
//   return (req: Request<T>, res: Response, next: NextFunction) => {
//     Promise.resolve(handler(req, res, next)).catch(next);
//   };
// };
