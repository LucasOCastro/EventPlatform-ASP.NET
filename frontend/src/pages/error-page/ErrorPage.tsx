import type { FC } from "react";
import { useRouteError, Link } from "react-router";
import { extractErrorInfo } from "@/pages/error-page/errorInfo.ts";

export const ErrorPage: FC = () => {
  const error = useRouteError();
  const { title, message } = extractErrorInfo(error);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1>{title}</h1>
      <p>{message}</p>
      {/* Show detailed error info in development */}
      {process.env.NODE_ENV === "development" && error instanceof Error && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
            maxWidth: "80%",
            background: "#eee",
            padding: "1rem",
            borderRadius: "5px",
          }}
        >
          <code>{error.stack}</code>
        </pre>
      )}
      <p>
        <Link
          to="/"
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            background: "blue",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Go to Homepage
        </Link>
      </p>
    </div>
  );
};
