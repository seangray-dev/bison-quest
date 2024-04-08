import { createThirdwebClient, defineChain } from "thirdweb";
import { sepolia } from "thirdweb/chains";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: clientId,
});

export const chain = defineChain(sepolia);
