import { isRouteErrorResponse } from "react-router";

export interface ErrorInfo {
  title: string;
  message: string;
}

const routeErrorInfoMap: Record<number, ErrorInfo> = {
  404: {
    title: "Not Found",
    message: "Could not find this page or resource.",
  },
  401: {
    title: "Unauthorized",
    message: "You are not authorized to view this page.",
  },
  403: {
    title: "Forbidden",
    message: "You do not have permission to access this resource.",
  },
};

export function extractErrorInfo(error: unknown) {
  if (isRouteErrorResponse(error)) {
    const { status, statusText } = error;
    return (
      routeErrorInfoMap[status] || makeGenericErrorInfo(status, statusText)
    );
  }

  console.error("Unknown error type:", error);
  return {
    title: "An error occurred!",
    message: "Something went wrong. Sorry!",
  };
}

function makeGenericErrorInfo(status: number, statusText?: string) {
  return {
    title: `Error ${status}`,
    message: statusText || "An unexpected server error occurred.",
  };
}
