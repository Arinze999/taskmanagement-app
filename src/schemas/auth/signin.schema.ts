import * as Yup from 'yup';

export const SigninSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'At least 8 characters')
    .required('Password is required'),
});

export type SigninData = Yup.InferType<typeof SigninSchema>;

export const signinInitialValues: SigninData = {
  email: '',
  password: '',
};

export type AuthUser = { id: string | null; email: string | null };

export const initialState: AuthUser = { id: null, email: null };
