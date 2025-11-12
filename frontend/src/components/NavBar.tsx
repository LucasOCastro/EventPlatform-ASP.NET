import { type FC } from "react";
import { allRoutes } from "@/config/routes.tsx";
import { Link } from "react-router";
import type { RouteInfo } from "@/types/routes.ts";

function makeLink(r: RouteInfo, i: number) {
  return (
    <Link key={i} to={r.fullPath || ""} className="px-2 border-r-5 text-center">
      <h1>{r.handle.label}</h1>
    </Link>
  );
}

export const NavBar: FC = () => {
  const barRoutes = allRoutes
    .filter((r) => r.handle?.showInNavbar)
    .map((r, i) => makeLink(r, i));

  return <div className="">{barRoutes}</div>;
};
