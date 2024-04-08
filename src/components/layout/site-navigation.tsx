import React from "react";
import Login from "../ui/login";
import { ModeToggle } from "../ui/mode-toggle";

export default function SiteNavigation() {
  return (
    <nav className="container flex items-center justify-between border-b py-2">
      <div>Bison Quest</div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Login />
      </div>
    </nav>
  );
}
