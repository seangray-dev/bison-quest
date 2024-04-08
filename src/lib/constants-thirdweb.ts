import { Engine } from "@thirdweb-dev/engine";
import { ChatCompletionTool } from "openai/resources/index.mjs";
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
const CHAIN = "sepolia";
const CONTRACT_ADDRESS = "0x5F80b5ec43bfF0698dCDF113D68F67b4bD2f6f85";

export const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "check_tokens_balance",
      description:
        "This function checks the balance of the three unique tokens a player has collected.",
      parameters: {
        type: "object",
        properties: {
          address: {
            type: "string",
            descriptions: "The wallet address of the player",
          },
        },
        required: ["address"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "send_token_to_player_wallet",
      description:
        "This function awards a token to a player's wallet when they successfully navigate a challenge.",
      parameters: {
        type: "object",
        properties: {
          address: {
            type: "string",
            description: "The address of the player",
          },
          tokenType: {
            type: "string",
            description: "The type of token to send to the player",
          },
        },
        required: ["address", "tokenType"],
      },
    },
  },
];

async function check_tokens_balance(address: string) {
  try {
    const engine = new Engine({
      url: process.env.ENGINE_URL as string,
      accessToken: process.env.ENGINE_ACCESS_TOKEN as string,
    });

    const clarityPrismBalance = await engine.erc1155.balanceOf(
      address,
      "0",
      CHAIN,
      CONTRACT_ADDRESS,
    );
    const fortitudeCoreBalance = await engine.erc1155.balanceOf(
      address,
      "1",
      CHAIN,
      CONTRACT_ADDRESS,
    );
    const libertySparkBalance = await engine.erc1155.balanceOf(
      address,
      "2",
      CHAIN,
      CONTRACT_ADDRESS,
    );

    return JSON.stringify({
      status: "success",
      data: {
        clarityPrismBalance,
        fortitudeCoreBalance,
        libertySparkBalance,
      },
    });
  } catch (err: any) {
    console.error(err);
    return JSON.stringify({ status: "error", message: err.message });
  }
}

async function send_token_to_player_wallet(address: string, tokenType: string) {
  let tokenId;
  if (tokenType.toLowerCase().includes("clarity prism")) {
    tokenId = "0";
  } else if (tokenType.toLowerCase().includes("fortitude core")) {
    tokenId = "1";
  } else if (tokenType.toLowerCase().includes("libery spark")) {
    tokenId = "2";
  } else {
    throw new Error("Invalid token type: " + tokenType);
  }

  try {
    const engine = new Engine({
      url: process.env.ENGINE_URL as string,
      accessToken: process.env.ENGINE_ACCESS_TOKEN as string,
    });

    const response = await engine.erc1155.mintAdditionalSupplyTo(
      CHAIN,
      CONTRACT_ADDRESS,
      process.env.BACKEND_WALLER as string,
      {
        receiver: address,
        tokenId: tokenId,
        additionalSupply: "1",
      },
    );

    return JSON.stringify({
      status: "success",
      data: { response: response.result.queueId },
    });
  } catch (err: any) {
    console.error(err);
    return JSON.stringify({ status: "error", message: err.message });
  }
}

export async function executeFunction(functionName: string, args: any) {
  switch (functionName) {
    case "check_tokens_balance":
      return await check_tokens_balance(args["address"]);
    case "send_token_to_player_wallet":
      return await send_token_to_player_wallet(
        args["address"],
        args["tokenType"],
      );
    default:
      return null;
  }
}
