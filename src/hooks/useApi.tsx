"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { metadataListIntegrationsOptions } from "mtmaiapi";
import type { APIErrors } from "mtmaiapi/api";
import api from "mtmaiapi/api";
import { useToast } from "mtxuilib/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { type Dispatch, type SetStateAction, useEffect, useMemo } from "react";
import { getFieldErrors } from "../lib/utils";
export function useApiError(props: {
  setFieldErrors?: Dispatch<SetStateAction<Record<string, string>>>;
  // if setErrors is passed, it will be used to pass the errors. otherwise,
  // it will use the global toast.
  setErrors?: (errors: string[]) => void;
}): {
  handleApiError: (error) => void;
} {
  const { toast } = useToast();

  const handler = props.setErrors
    ? props.setErrors
    : (errors: string[]) => {
        for (const error of errors) {
          if (typeof window !== "undefined") {
            toast({
              title: "Error",
              description: error,
              duration: 5000,
            });
          }
        }
      };

  const handleError = (error) => {
    if (error.response?.status) {
      if (error.response?.status >= 500) {
        handler(["An internal error occurred."]);

        return;
      }
    }

    const apiErrors = error.response?.data as APIErrors;

    if (error.response?.status === 400) {
      if (apiErrors?.errors && apiErrors.errors.length > 0) {
        const fieldErrors = getFieldErrors(apiErrors);

        if (Object.keys(fieldErrors).length !== 0) {
          if (props.setFieldErrors) {
            props.setFieldErrors(fieldErrors);
          }

          if (props.setErrors) {
            const errors = Object.values(fieldErrors);
            props.setErrors(errors);
          }

          return;
        }
      }
    }

    if (!apiErrors || !apiErrors.errors || apiErrors.errors.length === 0) {
      handler(["An internal error occurred."]);

      return;
    }

    handler(
      apiErrors.errors.map(
        (error) => error.description || "An internal error occurred.",
      ),
    );
  };

  return {
    handleApiError: handleError,
  };
}

export function useApiMetaIntegrations() {
  const { handleApiError } = useApiError({});
  // const mtmapi = useMtmClient();
  // const metaQuery = mtmapi.useQuery("get", "/api/v1/meta/integrations", {
  //   params: {},
  // });
  const metaQuery = useSuspenseQuery({
    ...metadataListIntegrationsOptions({}),
  });

  if (metaQuery.isError) {
    handleApiError(metaQuery.error);
  }

  return metaQuery.data;
}

export function useErrorParam() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (searchParams.get("error") && searchParams.get("error") !== "") {
      toast({
        title: "Error",
        description: searchParams.get("error") || "",
        duration: 5000,
      });

      // remove from search params
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("error");
      setSearchParams(newSearchParams);
    }
  }, [toast, searchParams, setSearchParams]);
}

export function useApiMeta() {
  const { handleApiError } = useApiError({});

  const metaQuery = useQuery({
    queryKey: ["metadata:get"],
    queryFn: async () => {
      const meta = await api.metadataGet();
      return meta;
    },
    staleTime: 1000 * 60,
  });

  if (metaQuery.isError) {
    handleApiError(metaQuery.error as AxiosError);
  }

  const data = useMemo(() => {
    return metaQuery.data?.data;
  }, [metaQuery.data]);

  return {
    data: data,
    isLoading: false,
  };
}
