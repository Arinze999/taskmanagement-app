import * as Yup from 'yup';

export const SignupSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(8, 'At least 8 characters').required('Password is required'),
});

export type SignupData = Yup.InferType<typeof SignupSchema>;

export const signupInitialValues: SignupData = {
  email: '',
  password: '',
};
