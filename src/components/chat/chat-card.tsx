import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChatCard({
  role,
  message,
}: {
  role: string;
  message: string;
}) {
  const headerClass = role === "user" ? "bg-secondary" : "bg-primary";

  return (
    <Card className="w-full">
      <CardHeader className={`${headerClass} p-2`}>
        <CardTitle className="text-sm">{role}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <p>{message}</p>
      </CardContent>
    </Card>
  );
}
