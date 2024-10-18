import { CodeBlockWrapper } from "@/components/code-previewer";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { generateMdxContent } from "@/lib/generateMdxContent";
import { parseMdx } from "@/lib/markdown";
import { ConfigSchema, OperationConfig } from "@kmdr/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default async function OperationsPage() {
  const src = "http://localhost:3000/cli/auth.json";
  const item = await fetch(src);
  const detailsPage = (await item.json()) as OperationConfig;
  const result = ConfigSchema.safeParse(detailsPage?.operation);
  const mdxContent = await generateMdxContent(
    detailsPage.operation,
    new URL(src).origin
  );
  const content = await parseMdx(mdxContent);

  return (
    <div className="flex items-start gap-10 flex-[5.45]">
      <div className="flex-[4.5] py-10">
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
          <Tabs defaultValue="what-this-does" className="mt-8">
            <TabsList>
              <TabsTrigger value="what-this-does">What it does ?</TabsTrigger>
              <TabsTrigger value="payload">Payload</TabsTrigger>
            </TabsList>
            <TabsContent value="what-this-does">
              <div>{content.content}</div>
            </TabsContent>
            <TabsContent value="payload">
              <br />
              <CodeBlockWrapper
                className="max-w-[89vw] md:max-w-auto w-full"
                disableShowMore
              >
                {JSON.stringify(detailsPage, null, 2)}
              </CodeBlockWrapper>
            </TabsContent>
          </Tabs>
        </Typography>
      </div>
    </div>
  );
}
