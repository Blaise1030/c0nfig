import { Operation, Config } from "@kmdr/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CodeBlockWrapper } from "../code-previewer";
import { StepComp, StepDescription } from "./StepComponents";
import _ from "lodash";
import React from "react";

export const OperationDocs = ({
  operations,
  host,
}: {
  operations: Config;
  host: string;
}) => {
  return (
    <div className="space-y-4">
      {operations.map((operation: Operation, index: number) => (
        <OperationBlock
          key={index}
          operation={operation}
          number={index + 1}
          host={host}
        />
      ))}
    </div>
  );
};

export const OperationBlock = async ({
  operation,
  number,
  host,
}: {
  number: number;
  operation: Operation;
  host: string;
}) => {
  const opType = operation.op;

  if (opType === "install") {
    return (
      <div key={number}>
        <StepComp
          description={`Install the following dependencies:`}
          number={number}
        />
        <StepDescription>
          <>
            {operation.dep && operation.dep.length > 0 && (
              <>
                <p className="font-semibold">Dependencies:</p>
                <CodeBlockWrapper className="max-w-sm w-full">
                  {operation.dep.join("\n")}
                </CodeBlockWrapper>
              </>
            )}
            {operation.devDep && operation.devDep.length > 0 && (
              <>
                <p className="font-semibold">Dev Dependencies:</p>
                <CodeBlockWrapper className="max-w-[80vw] md:max-w-auto w-full">
                  {operation.devDep.join("\n")}
                </CodeBlockWrapper>
              </>
            )}
          </>
        </StepDescription>
      </div>
    );
  } else if (opType === "add") {
    return (
      <div key={number}>
        <StepComp
          description={
            <>
              Copy file from <code>{operation.remoteSrc}</code> to{" "}
              <code>{operation.targetSrc}</code>
            </>
          }
          number={number}
        />
        <StepDescription>
          <CodeBlockWrapper className="max-w-[80vw] md:max-w-auto w-full">
            {await (await fetch(`${host}${operation.remoteSrc}`)).text()}
          </CodeBlockWrapper>
        </StepDescription>
      </div>
    );
  } else if (opType === "updateJSON") {
    return (
      <div key={number}>
        <StepComp
          description={
            <>
              Update <code>{operation.targetSrc}</code> at path{" "}
              <code>{operation.path}</code> with value{" "}
              <code>{operation.value}</code>
            </>
          }
          number={number}
        />
        <StepDescription>
          <CodeBlockWrapper className="max-w-[80vw] md:max-w-auto w-full">
            {JSON.stringify(
              _.set({}, operation.path, operation.value),
              null,
              2
            )}
          </CodeBlockWrapper>
        </StepDescription>
      </div>
    );
  } else if (opType === "input") {
    return (
      <div key={number}>
        <StepComp
          description={
            <>
              Prompt: <code>{operation.title}</code> (default:{" "}
              <code>{operation.defaultValue}</code>)
              <br />
              Saved value as <code>{operation.value}</code>
            </>
          }
          number={number}
        />
        <StepDescription>
          <React.Fragment>
            <p className="italic mb-4 text-sm text-muted-foreground">Then:</p>
            <OperationDocs operations={operation.actions} host={host} />
          </React.Fragment>
        </StepDescription>
      </div>
    );
  } else if (opType === "select") {
    return (
      <div key={number}>
        <StepComp description={operation.title} number={number} />
        <StepDescription>
          <Tabs defaultValue={operation.selections[0]?.value}>
            <TabsList>
              {operation.selections.map(
                (selection: { value: string; label: string }, idx: number) => (
                  <TabsTrigger key={idx} value={selection.value}>
                    {selection.label}
                  </TabsTrigger>
                )
              )}
            </TabsList>
            {operation.selections.map(
              (selection: { value: string; label: string }, idx: number) => (
                <TabsContent value={selection.value} key={idx} className="pt-4">
                  <OperationDocs
                    operations={operation.values[selection.value]}
                    host={host}
                  />
                </TabsContent>
              )
            )}
          </Tabs>
        </StepDescription>
      </div>
    );
  } else if (opType === "conditional") {
    return (
      <div key={number}>
        <StepComp
          description={`Conditional Operation: If ${operation.condition}`}
          number={number}
        />
        <StepDescription>
          <>
            <p className="font-semibold">Condition:</p>
            <CodeBlockWrapper className="max-w-[80vw] md:max-w-auto w-full">
              {operation.condition}
            </CodeBlockWrapper>
            {operation.then && (
              <>
                <p className="mt-4 font-semibold">Then:</p>
                <OperationDocs host={host} operations={operation.then} />
              </>
            )}
            {operation.else && (
              <>
                <p className="mt-4 font-semibold">Else:</p>
                <OperationDocs host={host} operations={operation.else} />
              </>
            )}
          </>
        </StepDescription>
      </div>
    );
  } else if (opType === "add-import") {
    return (
      <div key={number}>
        <StepComp
          description={
            <>
              Add import statement to <code>{operation.targetSrc}</code>:
            </>
          }
          number={number}
        />
        <StepDescription>
          <CodeBlockWrapper className="max-w-[80vw] md:max-w-auto w-full">
            {operation.content}
          </CodeBlockWrapper>
        </StepDescription>
      </div>
    );
  } else if (opType === "add-export") {
    return (
      <div key={number}>
        <StepComp
          description={
            <>
              Add export statement to <code>{operation.targetSrc}</code>:
            </>
          }
          number={number}
        />
        <StepDescription>
          <CodeBlockWrapper className="max-w-[80vw] md:max-w-auto w-full">
            {operation.content}
          </CodeBlockWrapper>
        </StepDescription>
      </div>
    );
  } else if (opType === "readJSON") {
    return (
      <div key={number}>
        <StepComp
          description={
            <>
              Read value from <code>{operation.targetSrc}</code> at path{" "}
              <code>{operation.path}</code>
              {operation.value && (
                <>
                  <br />
                  Save value as <code>{operation.value}</code>
                </>
              )}
            </>
          }
          number={number}
        />
        {operation.values && Object.keys(operation.values).length > 0 && (
          <StepDescription>
            <React.Fragment>
              <p className="italic mb-4 text-sm text-muted-foreground">
                Based on the value, perform the following actions:
              </p>
              <Tabs defaultValue={Object.keys(operation.values)[0]}>
                <TabsList>
                  {Object.keys(operation.values).map((key, idx) => (
                    <TabsTrigger key={idx} value={key}>
                      {key}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {Object.entries(operation.values).map(([key, ops], idx) => (
                  <TabsContent value={key} key={idx} className="pt-4">
                    <OperationDocs host={host} operations={ops as Config} />
                  </TabsContent>
                ))}
              </Tabs>
            </React.Fragment>
          </StepDescription>
        )}
      </div>
    );
  } else {
    return (
      <div key={number}>
        <StepComp
          description={`Unknown operation: ${(operation as any)?.op}`}
          number={number}
        />
        <StepDescription>
          <CodeBlockWrapper className="max-w-[80vw] md:max-w-auto w-full">
            {JSON.stringify(operation, null, 2)}
          </CodeBlockWrapper>
        </StepDescription>
      </div>
    );
  }
};
