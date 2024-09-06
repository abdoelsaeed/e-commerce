import{Request,Response, NextFunction} from 'express';
import AppError from './../errFolder/err'
import catchAsync from '../errFolder/catchAsync';

export const createOne = (Model: any)=>
catchAsync(async(req:Request, res:Response, next:NextFunction) => {
if(req.file?.filename){ 
  console.log(123)
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
  req.body.image = `${basePath}${req.file?.filename}`;
}
console.log(req.file);
let item  = new Model(req.body);
item = await item.save();
res.status(200).json({ 
  status:'success',
  message: item
});
}
);

export const getAll = (Model: any,select?:boolean,sortt?:any)=>
  catchAsync(async(req:Request, res:Response,next:NextFunction) => {
const items = select ? await Model.find().select('name -_id') : await Model.find().sort({[sortt]:-1});
  if(items.length === 0){
    return next(new AppError('Not Found Category',404));
  }
  res.status(200).json({ 
      status: 'success',
      results: items.length,
      data: {
        items
      }
    });
  });

export const deleteOne = (Model: any)=>
  catchAsync(async(req:Request, res:Response, next:NextFunction) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    console.log(item)
    if(!item){
      return next(new AppError('Not Found Item',404));
    }
    res.status(200).json({
      status:'success',
      message: null
    });
  });

export const getOne = (Model: any,populatee?:any,populateee?:any)=> 
  catchAsync(async(req:Request,res:Response, next:NextFunction) => {
const item = populatee
    ? populateee
        ? await Model.findById(req.params.id)
              .populate({ path: populatee, select: 'name -_id' })
              .populate({path:populateee ,
                populate:{path:'product',select:'name category',
                  populate:{path:'category',select:'name -_id'}}})
        : await Model.findById(req.params.id).populate({ path: populatee, select: 'name -_id' })
    : await Model.findById(req.params.id);
  
    if(!item){
      return next(new AppError('Not Found Item',400));
    }
    res.status(200).json({
      status:'success',
      data: item
    });
  });
  export const updateOne = (Model: any)=>
    catchAsync(async(req:Request, res:Response, next:NextFunction) => {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body,{
      new: true,
      runValidators: true
    });
    if(!item){
      return next(new AppError('Not Found Item',404));
    }
    res.status(200).json({
      status:'success',
      data: item
    });
    });
