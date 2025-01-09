"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { siteGetOptions } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { Label } from "mtxuilib/ui/label";
import { Separator } from "mtxuilib/ui/separator";
import { Textarea } from "mtxuilib/ui/textarea";
import { useTenant } from "../../hooks/useAuth";

interface SiteShowViewProps {
  siteId: string;
}
export function SiteShowView({ siteId }: SiteShowViewProps) {
  const tenant = useTenant();
  const siteQuery = useSuspenseQuery({
    ...siteGetOptions({
      path: {
        site: siteId,
        tenant: tenant.metadata.id,
      },
    }),
  });

  const siteData = siteQuery.data;
  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start p-4">
          <div className="flex items-start gap-4 text-sm">
            <Avatar>
              <AvatarImage alt={siteData?.title || ""} />
              <AvatarFallback>
                {siteData?.title
                  ?.split(" ")
                  .map((chunk) => chunk[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="font-semibold">{siteData?.title}</div>
              <div className="line-clamp-1 text-xs">{siteData?.title}</div>
              <div className="line-clamp-1 text-xs">
                {/* <span className="font-medium">Reply-To:</span> {site?.author} */}
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
          {siteData.description}
        </div>
        <Separator className="mt-auto" />
        <div className="p-4">
          <form>
            <div className="grid gap-4">
              <Textarea
                className="p-4"
                placeholder={`Reply ${siteData?.title}...`}
              />
              <div className="flex items-center">
                <Label
                  htmlFor="mute"
                  className="flex items-center gap-2 text-xs font-normal"
                >
                  <Switch id="mute" aria-label="Mute thread" /> Mute this thread
                </Label>
                <Button
                  onClick={(e) => e.preventDefault()}
                  size="sm"
                  className="ml-auto"
                >
                  Send
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
