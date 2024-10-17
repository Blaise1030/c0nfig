import { Badge } from "@/components/ui/badge";
import { CodeBlockWrapper } from "@/components/code-previewer";
import { OperationDocs } from "@/components/registry/OperationBlock";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ConfigSchema, OperationConfig } from "@kmdr/types";



export default async function DetailsPage() {
  const src = "http://localhost:3000/cli/auth.json";
  const item = await fetch(src);
  const detailsPage = (await item.json()) as OperationConfig;
  const result = ConfigSchema.safeParse(detailsPage?.operation);

  return (
    <div className="md:flex-[5] flex">
      <div className="flex items-start gap-14">
        <div className="flex-[3] py-10">
          <div className="mb-8 flex gap-2 flex-col">
            <h1 className="text-3xl font-bold">{detailsPage?.title}</h1>
            <p className="text-muted-foreground text-[16.5px]">
              {detailsPage?.description}
            </p>
            <div className="flex gap-2">
              <Badge>Version {detailsPage?.version}</Badge>
              {result.success ? (
                <Badge
                  className="gap-2 bg-background w-fit"
                  variant="outline"
                >
                  <div className="size-2 bg-green-400 animate-pulse rounded-full" />
                  Schema Valid
                </Badge>
              ) : (
                <Badge
                  className="gap-2 bg-background w-fit"
                  variant="outline"
                >
                  <div className="size-2 bg-red-400 animate-pulse rounded-full" />
                  Schema Invalid
                </Badge>
              )}
            </div>
          </div>
          <div className="w-full max-w-[65ch] flex flex-col gap-4">
            <div className="flex gap-1 flex-col">
              <h3 className="font-semibold text-sm">Run command with</h3>
              <CodeBlockWrapper className="w-full max-w-none">
                npx kmdrr@latest {src}
              </CodeBlockWrapper>
            </div>
            <Tabs defaultValue="what-this-does">
              <TabsList>
                <TabsTrigger value="what-this-does">
                  What it does ?
                </TabsTrigger>
                <TabsTrigger value="payload">Payload</TabsTrigger>
              </TabsList>
              <TabsContent value="what-this-does">
                <OperationDocs
                  operations={detailsPage.operation}
                  host={new URL(src).origin}
                />
              </TabsContent>
              <TabsContent value="payload">
                <CodeBlockWrapper
                  className="max-w-[89vw] md:max-w-auto w-full"
                  disableShowMore
                >
                  {JSON.stringify(detailsPage, null, 2)}
                </CodeBlockWrapper>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <DocumentationToC />
    </div>
  );
}

function DocumentationToC() {
  return (
    <div className="lg:flex hidden toc flex-[1] min-w-[230px] py-8 sticky top-16 h-[95.95vh]">
      <div className="flex flex-col gap-3 w-full pl-2">
        There is some images
      </div>
    </div>
  );
}

