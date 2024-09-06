import { Request, Response, NextFunction } from 'express';

// تعريف نوع fn وهو دالة تأخذ Request وResponse وNextFunction كمعاملات وتُرجع Promise
const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
