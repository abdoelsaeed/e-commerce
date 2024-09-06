import mongoose, { Document, CallbackWithoutResultAndOptionalError } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
export interface IUser extends Document {
  name: string;
  password: string;
  confirmPassword: string|undefined;
  email:string;
  phone: string;
  street: string;
  apartment: string;
  isAdmin: boolean;
  zip:string;
  refreshToken:string|undefined;
  city:string;
  country:string;
  _id:any;
  isModified(path: string): boolean;
  passwordChangedAt:any;
  passwordResetToken:string|undefined;
  passwordResetExpires:string|undefined;
  changePasswordAfter(JWTTimestamp: number): boolean;
  createPasswordRestToken():string;
}
const userSchema = new mongoose.Schema<IUser>({
    name:{
        type: String,
        required: [true,'please inter your name']
    },
    email:{
    type:String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Please provide a valid email'
    }
    },
    password:{
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 5,
        select: false
    },
    confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function(value: string|number) {
        return value === this.password;
      },
      message: 'Confirm password must match the original password.'
    },
    
  },
  phone:{
        type: String,
        unique: true,
        required: true,
    },
  street:{
        type: String,
        default: ''
    },
    apartment:{
        type: String,
        default: ''
    },
    isAdmin:{
        type: Boolean,
        default: false,
        select: true,
    },
    zip:{
        type: String,
        default: ''
    },
    city:{
        type: String,
        default: ''
    },
    country:{
        type: String,
        default: ''
    },
    refreshToken:{
        type: String,
    },  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
// userSchema.virtual('id').get(function(this:IUser){
// return this._id.toHexString(); 
// });

userSchema.methods.changePasswordAfter = function(JWTTimestamp:any) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false; //password not changed
};

userSchema.pre('save',async function (next: CallbackWithoutResultAndOptionalError) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
userSchema.methods.createPasswordRestToken = function() {
  const restToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(restToken)
    .digest('hex');
  // crypto احفظها مش فاهمها
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //مدته 10 minutes
  return restToken;
};
const User = mongoose.model<IUser>('User', userSchema);

export default User;