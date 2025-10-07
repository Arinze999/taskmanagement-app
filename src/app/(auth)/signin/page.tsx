'use client';
import ValidatingFormSubmitButton from '@/components/buttons/ValidatingFormSubmitButton';
import { FormComponent } from '@/components/form/FormComponent';
import {
  PasswordInputField,
  TextInputField2,
} from '@/components/form/FormField';
import { useServerSignIn } from '@/hooks/auth/server/useServerSignIn';
import { SIGNUP } from '@/routes/routes';
import {
  SigninData,
  signinInitialValues,
  SigninSchema,
} from '@/schemas/auth/signin.schema';
import { FormikHelpers } from 'formik';
import Link from 'next/link';
import React from 'react';

const SigninPage = () => {
  const { signIn, serving } = useServerSignIn();

  const handleSubmit = async (
    values: SigninData,
    actions: FormikHelpers<SigninData>
  ) => {
    await signIn(values);
    actions.resetForm({ values: signinInitialValues });
  };

  return (
    <div className="w-full max-w-[500px]">
      <h1 className="w-full text-center my-3 font-bold text-2xl">LOGIN</h1>
      <FormComponent
        initialValues={signinInitialValues}
        schema={SigninSchema}
        onSubmit={handleSubmit}
      >
        <TextInputField2 name="email" label="Email" />
        <PasswordInputField name="password" label="Password" />
        <ValidatingFormSubmitButton loading={serving} disabled={serving}>
          SIgn In
        </ValidatingFormSubmitButton>
        <p className="w-full text-center">
          Dont have an account yet?{' '}
          <Link className="text-blue-600 underline" href={`/${SIGNUP}`}>
            Sign up
          </Link>
        </p>
      </FormComponent>
    </div>
  );
};

export default SigninPage;
