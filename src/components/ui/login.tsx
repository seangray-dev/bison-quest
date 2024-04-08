"use client";

import { chain, client } from "@/lib/constants-thirdweb";
import { ConnectButton } from "thirdweb/react";

export default function Login() {
  return (
    <ConnectButton
      connectButton={{ className: "!bg-primary" }}
      client={client}
      chain={chain}
    />
  );
}
