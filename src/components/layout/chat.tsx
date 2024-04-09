import { useChat } from "ai/react";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useRef } from "react";
import { useActiveAccount } from "thirdweb/react";
import ChatCard from "../chat/chat-card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Chat() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const account = useActiveAccount();
  const address = account?.address;

  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    body: {
      walletAddress: address,
    },
    onResponse: (response) => {
      if (response.status === 429) {
        console.log("reached rate limit");
        return;
      } else {
        console.log("chat initiated");
      }
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  return (
    <div className="container w-full">
      {messages.length > 0 ? (
        messages.map((message, idx) => (
          <ChatCard key={idx} role={message.role} message={message.content} />
        ))
      ) : (
        <p>Let's start!</p>
      )}
      <div className="container fixed bottom-0 left-0 right-0 w-full pb-4">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex items-center gap-2"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                formRef.current?.requestSubmit();
                e.preventDefault();
              }
            }}
            type="text"
          />
          <Button size={"icon"} disabled={isLoading}>
            {isLoading ? (
              <Loader2Icon size={18} className="animate-spin" />
            ) : (
              <ArrowUpIcon size={18} />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

// 35:32
