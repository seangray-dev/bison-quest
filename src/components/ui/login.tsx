"use client";

import { chain, client } from "@/lib/constants-thirdweb";
import { ConnectButton } from "thirdweb/react";

export default function Login() {
  return (
    <ConnectButton
      connectButton={{
        className: "!bg-primary !py-2 !text-white !rounded-sm",
        label: "Login to play",
      }}
      client={client}
      chain={chain}
    />
  );
}
