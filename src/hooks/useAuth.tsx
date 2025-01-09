"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { userGetCurrentOptions, userUpdateLoginMutation } from "mtmaiapi";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import { setCookie } from "mtxuilib/lib/clientlib";
import { useMtmaiV2 } from "../stores/StoreProvider";

export const useUser = () => {
  const userQuery = useQuery({
    ...userGetCurrentOptions(),
  });
  return userQuery.data;
};
export const useTenant = () => {
  const tenant = useMtmaiV2((x) => x.currentTenant);
  if (!tenant) {
    throw new Error("Tenant not found");
  }
  return tenant;
};

export const useOptionalTenant = () => {
  return useMtmaiV2((x) => x.currentTenant);
};

export const useIsAdmin = () => {
  const tenant = useTenant();
  return (
    tenant.name === "default" ||
    tenant.name === "admin" ||
    tenant.name === "Default"
  );
};

export const useLoginHandler = () => {
  const router = useMtRouter();
  const frontendConfig = useMtmaiV2((x) => x.frontendConfig);

  const cookieKey = frontendConfig!.cookieAccessToken || "access_token";
  const loginMutation = useMutation({
    ...userUpdateLoginMutation(),
    onSuccess: (data) => {
      console.log("login success", data);
      if (data.userToken) {
        setCookie(cookieKey, data.userToken);
        router.push("/");
      }
    },
  });

  const loginHandler = async (values) => {
    const loginResult = await loginMutation.mutateAsync({
      body: {
        email: values.email,
        password: values.password,
      },
    });
  };

  return { loginHandler, isPending: loginMutation.isPending };
};
