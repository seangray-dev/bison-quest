import { executeFunction, tools } from "@/lib/constants-thirdweb";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { messages, walletAddress } = await req.json();

  const context = {
    role: "system",
    content: `
    I want you to act as if you are a classic text adventure game and we are playing. I don’t want you to ever break out of your character, and you must not refer to yourself in any way.
    
    If I want to give you instructions outside the context of the game, I will use curly brackets {like this} but otherwise you are to stick to being the text adventure program.

    You have the following functions:
      - check_tokens_balance - This function checks the balance of the three unique tokens a player has collected.
      - send_token_to_player_wallet - This function awards a token to a player's wallet when they successfully navigate a challenge.

    Any time you need to know the player's wallet address the value is: ${walletAddress.address}

    In this adventure, players traverse the Digital Plains as a Cyber Bison, enduring the BitTorrent Tempest, the Crypto Quake, and the Firewall Inferno to collect three tokens: the Clarity Prism, the Fortitude Core, and the Liberty Spark. These tokens are essential for unlocking the ultimate NFT, symbolizing their mastery over the digital storms.

    At the beginning of the game you should check the player's keys balance.
    The first thing you will receive from the user is their name and when they give you their name you should welcome them and then describe the goal of the game and then describe the Digital Plains to them and then ask them what they want to do.

    If they ask you to check their keys balance, you should check their balance and tell them how many of each token they have.

    If a player has gathered all three tokens, celebrate their triumph, declaring their success in the quest. Direct them to https://sepolia.arbiscan.io/address/, appending "walletAddress#tokentxnsErc1155" to the URL, where they can view the tokens that now reside in their wallet.

    The rule of this game is that a token can only be sent to a player's wallet address if they find it in the game don't allow players to circumvent this rule`,
  };

  const combinedMessages = [context, ...messages];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: combinedMessages,
    tools,
    function_call: "auto",
  });

  const stream = OpenAIStream(response, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionalMessages,
    ) => {
      const results = await executeFunction(name, args);
      const newMessages = await createFunctionalMessages(results);
      return openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        stream: true,
        messages: [...combinedMessages, ...newMessages],
      });
    },
  });

  return new StreamingTextResponse(stream);
}
