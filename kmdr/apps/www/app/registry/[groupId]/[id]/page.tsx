import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { generateMdxContent } from "@/lib/generateMdxContent";
import { parseMdx } from "@/lib/markdown";
import { ConfigSchema, OperationConfig } from "@kmdr/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Gauge, X } from "lucide-react";

export default async function OperationsPage() {
  const src = "http://localhost:3000/cli/auth.json";
  const item = await fetch(src);
  const detailsPage = (await item.json()) as OperationConfig;
  const result = ConfigSchema.safeParse(detailsPage?.operation);
  const { mdxContent, manualSteps, commandLineSteps } =
    await generateMdxContent(detailsPage.operation, new URL(src).origin);
  const content = await parseMdx(mdxContent);
  const runCommandCode = generateCodeBlock(`npx kmdrr@latest run ${src}`);
  const runCommand = await parseMdx(runCommandCode);

  const jsonCode = generateCodeBlock(
    JSON.stringify(detailsPage, null, 2),
    "```json"
  );
  const json = await parseMdx(jsonCode);

  return (
    <div className="flex items-start gap-10 flex-[5.45]">
      <div className="flex-[4.5] pt-8 pb-10">
        <Typography>
          <h1 className="text-3xl -mt-2">{detailsPage?.title}</h1>
          <p className="-mt-6 text-muted-foreground text-[16.5px]">
            {detailsPage?.description}
          </p>
          <div className="flex gap-2 ">
            <Badge>Version {detailsPage?.version}</Badge>
            {result.success ? (
              <Badge className="gap-2 bg-background w-fit" variant="outline">
                <div className="size-2 bg-green-400 animate-pulse rounded-full" />
                Schema Valid
              </Badge>
            ) : (
              <Badge className="gap-2 bg-background w-fit" variant="outline">
                <div className="size-2 bg-red-400 animate-pulse rounded-full" />
                Schema Invalid
              </Badge>
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-sm">Run command</h3>
            <div className="-mt-6">{runCommand.content}</div>
          </div>

          <Tabs defaultValue="what-this-does" className="mt-2">
            <TabsList>
              <TabsTrigger value="what-this-does">What it does ?</TabsTrigger>
              <TabsTrigger value="payload">Payload</TabsTrigger>
            </TabsList>
            <TabsContent value="what-this-does">
              <div>{content.content}</div>
            </TabsContent>
            <TabsContent value="payload">{json.content}</TabsContent>
          </Tabs>
        </Typography>
      </div>
      <div className="lg:flex hidden toc flex-[1.5] min-w-[238px] py-8 sticky top-16 h-[95.95vh]">
        <div className="flex flex-col gap-3 w-full pl-2 text-center">
          <div>
            <Card className="flex items-center flex-col w-full p-1 bg-muted">
              <div className="p-2 py-3 flex gap-2 font-bold items-center">
                <Gauge />
                <div className="flex items-center text-2xl">
                  {(manualSteps / commandLineSteps).toFixed(1)}x
                </div>
              </div>
              <h3 className="font-medium text-sm mb-3 text-muted-foreground">
                Number of steps saved
              </h3>
              <div className="bg-background rounded-lg w-full p-2 py-3 text-center border">
                <p className="w-full font-semibold">
                  <span className="line-through text-muted-foreground">
                    {manualSteps} Steps
                  </span>
                  <span className="px-2">⚡️</span>
                  <span>{commandLineSteps} Steps</span>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateCodeBlock(content: string, type: string = "```bash") {
  const lines = [];
  lines.push(type);
  lines.push(`${content}`);
  lines.push("```");
  return lines.join("\n");
}
