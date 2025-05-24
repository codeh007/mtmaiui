import { createLazyFileRoute } from "@tanstack/react-router";
import { RootAppWrapper } from "../../components/RootAppWrapper";
import { UserRegisterScreen } from "../../components/auth/UserRegister";

export const Route = createLazyFileRoute("/auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RootAppWrapper className="flex w-full h-full flex-1">
      <UserRegisterScreen />
    </RootAppWrapper>
  );
}
