"use client";
import { useMtmaiV2 } from "../../../../stores/StoreProvider";
import type { ArtifactApiResponse, TaskApiResponse } from "../../../api/types";

export function useArtifactImageURL(artifact: ArtifactApiResponse) {
  const backendUrl = useMtmaiV2((x) => x.serverUrl);
  if (artifact?.uri?.startsWith("file://")) {
    return `${backendUrl}/api/v1/artifact/image?path=${artifact.uri.slice(7)}`;
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else if (artifact?.uri?.startsWith("s3://") && artifact?.signed_url) {
    return artifact.signed_url;
  }
  return artifact?.uri;
}

export function getScreenshotURL(task: TaskApiResponse) {
  if (!task.screenshot_url) {
    return;
  }
  if (task.screenshot_url?.startsWith("file://")) {
    return `${artifactApiBaseUrl}/api/v1/artifact/image?path=${task.screenshot_url.slice(7)}`;
  }
  return task.screenshot_url;
}

export function getRecordingURL(task: TaskApiResponse) {
  if (!task.recording_url) {
    return null;
  }
  if (task.recording_url?.startsWith("file://")) {
    return `${artifactApiBaseUrl}/artifact/recording?path=${task.recording_url.slice(7)}`;
  }
  return task.recording_url;
}
