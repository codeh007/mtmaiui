"use client";

import { useQuery } from "@tanstack/react-query";
import { userGetCurrentOptions } from "mtmaiapi";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import { useIsAdmin } from "../hooks/useAuth";

export const MustLogin = (props: { children: React.ReactNode }) => {
  // const tenant = useTenant();

  const userQuery = useQuery({
    ...userGetCurrentOptions({
      // onError: (error) => {
      //   console.error(error);
      // },
    }),
    // onError: (error) => {
    //   console.error(error);
    // },
  });

  // useEffect(() => {
  //   if (!userQuery.data) {
  //     router.push("/auth/login");
  //   }
  // }, [userQuery.data]);

  const router = useMtRouter();
  if (userQuery.error) {
    // router.push("/auth/login");
    return (
      <div>
        login,<pre>{JSON.stringify(userQuery.error, null, 2)}</pre>
      </div>
    );
  }
  return props.children;
};

export const AdminOnly = (props: { children: React.ReactNode }) => {
  const isAdmin = useIsAdmin();
  if (!isAdmin) {
    return null;
  }
  return props.children;
};
