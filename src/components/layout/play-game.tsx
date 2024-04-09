"use client";
import { useActiveAccount } from "thirdweb/react";
import Login from "../ui/login";
import Chat from "./chat";

export default function PlayGame() {
  const account = useActiveAccount();
  return (
    <div>
      {!account ? (
        <div>
          <Login />
        </div>
      ) : (
        <Chat />
      )}
    </div>
  );
}
