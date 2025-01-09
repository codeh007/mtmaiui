"use client";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { queries } from "mtmaiapi/api";
import { cloudApi } from "mtmaiapi/api/api";
import type {
  Coupon,
  SubscriptionPlan,
  TenantSubscription,
} from "mtmaiapi/api/generated/cloud/data-contracts";
import { ConfirmDialog } from "mtxuilib/mt/confirm-dialog";
import { Spinner } from "mtxuilib/mt/mtloading";
import { Badge } from "mtxuilib/ui/badge";
import { Button } from "mtxuilib/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "mtxuilib/ui/card";
import { Label } from "mtxuilib/ui/label";

import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTenant } from "../../../hooks";
import { useApiError } from "../../../hooks/useApi";
import { queryClient } from "../../../skyvern/api/QueryClient";

interface SubscriptionProps {
  active?: TenantSubscription;
  plans?: SubscriptionPlan[];
  hasPaymentMethods?: boolean;
  coupons?: Coupon[];
}

export const Subscription: React.FC<SubscriptionProps> = ({
  active,
  plans,
  coupons,
  hasPaymentMethods,
}) => {
  // Implement the logic for the Subscription component here

  const [loading, setLoading] = useState<string>();
  const [showAnnual, setShowAnnual] = useState<boolean>(false);
  const [isChangeConfirmOpen, setChangeConfirmOpen] = useState<
    SubscriptionPlan | undefined
  >(undefined);
  const tenant = useTenant();

  const { handleApiError } = useApiError({});
  const [portalLoading, setPortalLoading] = useState(false);

  const manageClicked = async () => {
    try {
      if (portalLoading) {
        return;
      }
      setPortalLoading(true);
      const link = await cloudApi.billingPortalLinkGet(tenant.metadata.id);
      window.open(link.data.url, "_blank");
    } catch (e) {
      handleApiError(e as any);
    } finally {
      setPortalLoading(false);
    }
  };

  const subscriptionMutation = useMutation({
    mutationKey: ["user:update:logout"],
    mutationFn: async ({ plan_code }: { plan_code: string }) => {
      const [plan, period] = plan_code.split(":");
      setLoading(plan_code);
      await cloudApi.subscriptionUpsert(tenant.metadata.id, { plan, period });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queries.tenantResourcePolicy.get(tenant.metadata.id)
            .queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: queries.cloud.billing(tenant.metadata.id).queryKey,
        }),
      ]);

      setLoading(undefined);
    },
    onError: handleApiError,
  });

  const activePlanCode = useMemo(
    () =>
      active?.plan
        ? [active.plan, active.period].filter((x) => !!x).join(":")
        : "free",
    [active],
  );

  useEffect(() => {
    return setShowAnnual(active?.period?.includes("yearly") || false);
  }, [active]);

  const sortedPlans = useMemo(() => {
    return plans
      ?.filter(
        (v) =>
          v.plan_code === "free" ||
          (showAnnual
            ? v.period?.includes("yearly")
            : v.period?.includes("monthly")),
      )
      .sort((a, b) => a.amount_cents - b.amount_cents);
  }, [plans, showAnnual]);

  const isUpgrade = useCallback(
    (plan: SubscriptionPlan) => {
      if (!active) {
        return true;
      }

      const activePlan = sortedPlans?.find(
        (p) => p.plan_code === activePlanCode,
      );

      const activeAmount = activePlan?.amount_cents || 0;

      return plan.amount_cents > activeAmount;
    },
    [active, activePlanCode, sortedPlans],
  );

  return (
    <>
      <ConfirmDialog
        isOpen={!!isChangeConfirmOpen}
        title={"Confirm Change Plan"}
        submitVariant="default"
        description={
          <>
            Are you sure you'd like to change to {isChangeConfirmOpen?.name}{" "}
            plan?
            <br />
            <br />
            Upgrades will be prorated and downgrades will take effect at the end
            of the billing period.
          </>
        }
        submitLabel={"Change Plan"}
        onSubmit={async () => {
          await subscriptionMutation.mutateAsync({
            plan_code: isChangeConfirmOpen!.plan_code,
          });
          setLoading(undefined);
          setChangeConfirmOpen(undefined);
        }}
        onCancel={() => setChangeConfirmOpen(undefined)}
        isLoading={!!loading}
      />
      <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-xl font-semibold leading-tight text-foreground flex flex-row gap-2">
            Subscription
            {coupons?.map((coupon, i) => (
              <Badge key={`c${i}`} variant="successful">
                {coupon.name} coupon applied
              </Badge>
            ))}
          </h3>

          <div className="flex gap-2">
            <Switch
              id="sa"
              checked={showAnnual}
              onClick={() => {
                setShowAnnual((checkedState) => !checkedState);
              }}
            />
            <Label htmlFor="sa" className="text-sm">
              Annual Billing{" "}
              <Badge variant="inProgress" className="ml-2">
                Save up to 20%
              </Badge>
            </Label>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 my-4">
          For plan details, please visit{" "}
          <a
            href="https://hatchet.run/pricing"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            our pricing page
          </a>{" "}
          or{" "}
          <a href="https://hatchet.run/office-hours" className="underline">
            contact us
          </a>{" "}
          if you have custom requirements.
        </p>
        {!hasPaymentMethods && (
          <Alert variant="warn" className="mb-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle className="font-semibold">
              No Payment Method.
            </AlertTitle>
            <AlertDescription>
              A payment method is required to upgrade your subscription, please{" "}
              <a onClick={manageClicked} className="underline pointer" href="#">
                add one
              </a>{" "}
              first.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {sortedPlans?.map((plan, i) => (
            <Card className="bg-muted/30 gap-4 flex-col flex" key={i}>
              <CardHeader>
                <CardTitle className="tracking-wide text-sm">
                  {plan.name}
                </CardTitle>
                <CardDescription className="py-4">
                  $
                  {(
                    plan.amount_cents /
                    100 /
                    (plan.period == "yearly" ? 12 : 1)
                  ).toLocaleString()}{" "}
                  per month billed {plan.period}*
                </CardDescription>
                <CardDescription>
                  <Button
                    disabled={
                      !hasPaymentMethods ||
                      plan.plan_code === activePlanCode ||
                      loading === plan.plan_code
                    }
                    variant={
                      plan.plan_code !== activePlanCode ? "default" : "outline"
                    }
                    onClick={() => setChangeConfirmOpen(plan)}
                  >
                    {loading === plan.plan_code ? (
                      <Spinner />
                    ) : plan.plan_code === activePlanCode ? (
                      "Active"
                    ) : isUpgrade(plan) ? (
                      "Upgrade"
                    ) : (
                      "Downgrade"
                    )}
                  </Button>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        {active?.note && <p className="mt-4">{active?.note}</p>}
        <p className="text-sm text-gray-500 mt-4">
          * subscription fee billed upfront {showAnnual ? "yearly" : "monthly"},
          overages billed at the end of each month for usage in that month
        </p>
      </div>
    </>
  );
};
