'use client';
import ValidatingFormSubmitButton from '@/components/buttons/ValidatingFormSubmitButton';
import { FormComponent } from '@/components/form/FormComponent';
import {
  PasswordInputField,
  TextInputField2,
} from '@/components/form/FormField';
import { useServerSignUp } from '@/hooks/auth/server/useServerSignUp';
import { SIGNIN } from '@/routes/routes';
import {
  SignupData,
  signupInitialValues,
  SignupSchema,
} from '@/schemas/auth/signup.schema';
import { FormikHelpers } from 'formik';
import Link from 'next/link';
import React from 'react';

const SignupPage = () => {
  const { signUp, serving } = useServerSignUp();

  const handleSubmit = async (
    values: SignupData,
    actions: FormikHelpers<SignupData>
  ) => {
    await signUp(values);
    actions.resetForm({ values: signupInitialValues });
  };

  return (
    <div className="w-full max-w-[500px]">
      <h1 className="w-full text-center my-3 font-bold text-2xl">
        CREATE ACCOUNT
      </h1>
      <FormComponent
        initialValues={signupInitialValues}
        schema={SignupSchema}
        onSubmit={handleSubmit}
      >
        <TextInputField2 name="email" label="Email" />
        <PasswordInputField name="password" label="Password" />
        <ValidatingFormSubmitButton loading={serving} disabled={serving}>
          SIgn Up
        </ValidatingFormSubmitButton>
        <p className="w-full text-center">
          Already have an account?{' '}
          <Link className="text-blue-600 underline" href={`/${SIGNIN}`}>
            Sign in
          </Link>
        </p>
      </FormComponent>
    </div>
  );
};

export default SignupPage;
