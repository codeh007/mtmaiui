"use client";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { Icons } from "mtxuilib/icons/icons";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Button } from "mtxuilib/ui/button";
import { Fragment } from "react";

import { UserLoginForm } from "../../../components/auth/user-login-form";
import { useLoginHandler } from "../../../hooks/useAuth";

export const Route = createLazyFileRoute("/auth/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  // useErrorParam();

  // const meta = useApiMeta();

  // if (meta.isLoading) {
  // 	return <MtLoading />;
  // }

  // const schemes = meta.data?.auth?.schemes || [];
  // const basicEnabled = schemes.includes("basic");
  // const googleEnabled = schemes.includes("google");
  // const githubEnabled = schemes.includes("github");

  // let prompt = "Enter your email and password below.";

  // if (basicEnabled && (googleEnabled || githubEnabled)) {
  // 	prompt =
  // 		"Enter your email and password below, or continue with a supported provider.";
  // } else if (googleEnabled || githubEnabled) {
  // 	prompt = "Continue with a supported provider.";
  // } else if (basicEnabled) {
  // 	prompt = "Enter your email and password below.";
  // } else {
  // 	prompt = "No login methods are enabled.";
  // }

  const forms = [
    // basicEnabled && <BasicLogin />,
    <BasicLogin key="basic" />,
    // googleEnabled && <GoogleLogin key="google" />,
    // githubEnabled && <GithubLogin key="github" />,
  ].filter(Boolean);

  return (
    <div className="flex flex-1 flex-col items-center justify-center w-full h-full lg:flex-row">
      <div className="container relative flex-col items-center justify-center w-full lg:px-0">
        <div className="mx-auto flex w-full max-w-md lg:p-8">
          <div className="flex w-full flex-col justify-center space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
              <p className="text-sm text-gray-700 dark:text-gray-300">{/* {prompt} */}</p>
            </div>
            {forms.map((form, index) => (
              <Fragment key={index}>
                {form}
                {/* {index < schemes.length - 1 && <OrContinueWith />} */}
              </Fragment>
            ))}

            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Don't have an account?{" "}
                <CustomLink
                  to="/auth/register"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign up
                </CustomLink>
              </p>
            </div>
            <p className="text-left text-sm text-gray-700 dark:text-gray-300 w-full">
              By clicking continue, you agree to our{" "}
              <Link
                to="https://www.iubenda.com/terms-and-conditions/76608149"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>
              ,{" "}
              <Link
                to="https://www.iubenda.com/privacy-policy/76608149/cookie-policy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Cookie Policy
              </Link>
              , and{" "}
              <Link
                to="https://www.iubenda.com/privacy-policy/76608149"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrContinueWith() {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          Or continue with
        </span>
      </div>
    </div>
  );
}

function BasicLogin() {
  const { loginHandler, isPending, fieldErrors } = useLoginHandler();

  return <UserLoginForm isLoading={isPending} onSubmit={loginHandler} fieldErrors={fieldErrors} />;
}

export function GoogleLogin() {
  return (
    <a href={"/api/v1/users/google/start"} className="w-full">
      <Button variant="outline" type="button" className="w-full py-2">
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button>
    </a>
  );
}

export function GithubLogin() {
  const origin = window.location.origin;
  return (
    <a href={`/api/v1/users/github/start?origin=${origin}`} className="w-full">
      <Button variant="outline" type="button" className="w-full py-2">
        <Icons.gitHub className="mr-2 h-4 w-4" />
        Github
      </Button>
    </a>
  );
}
