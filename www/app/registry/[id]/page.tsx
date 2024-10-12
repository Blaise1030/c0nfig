import { CodeBlockWrapper } from "@/components/code-previewer";
import { Typography } from "@/components/typography";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import React from "react";
import { ReactElement } from "react";
import _ from "lodash";

// Sample operations array with added 'add-import', 'add-export', and 'readJSON' operations
const op = [
  {
    op: "input",
    title: "Which is your source directory",
    defaultValue: "./src/*",
    value: "$aliases",
    actions: [
      {
        op: "add",
        remoteSrc: "/cli/setup.json",
        targetSrc: "./command.config.json",
      },
      {
        op: "updateJSON",
        targetSrc: "./command.config.json",
        path: "aliases.path",
        value: "$aliases",
      },
      {
        op: "updateJSON",
        targetSrc: "./package.json",
        path: "imports.~/*",
        value: "$aliases",
      },
      {
        op: "updateJSON",
        targetSrc: "./tsconfig.json",
        path: "compilerOptions.paths.~/*[0]",
        value: "$aliases",
      },
    ],
  },
  {
    op: "select",
    title: "Select your package manager",
    selections: [
      { label: "npm", value: "npm" },
      { label: "pnpm", value: "pnpm" },
      { label: "yarn", value: "yarn" },
    ],
    value: "$packageManager",
    values: {
      npm: [
        {
          op: "updateJSON",
          targetSrc: "./command.config.json",
          path: "packageManager ajdslaslkdjas asdjlkasdjlas dlkjalksdajskld asdajskld",
          value: "npm",
        },
      ],
      pnpm: [
        {
          op: "updateJSON",
          targetSrc: "./command.config.json",
          path: "packageManager",
          value: "pnpm",
        },
      ],
      yarn: [
        {
          op: "updateJSON",
          targetSrc: "./command.config.json",
          path: "packageManager",
          value: "yarn",
        },
      ],
    },
  },
  {
    op: "add-import",
    targetSrc: "./src/index.js",
    content: "import newModule from './newModule';",
  },
  {
    op: "add-export",
    targetSrc: "./src/index.js",
    content: "export { newModule };",
  },
  {
    op: "readJSON",
    targetSrc: "./package.json",
    path: "scripts.build",
    value: "$buildScript",
    values: {
      webpack: [
        {
          op: "add",
          remoteSrc: "/configs/webpack.config.js",
          targetSrc: "./webpack.config.js",
        },
      ],
      rollup: [
        {
          op: "add",
          remoteSrc: "/configs/rollup.config.js",
          targetSrc: "./rollup.config.js",
        },
      ],
    },
  },
];

const StepComp = ({
  number,
  description,
}: {
  number: number;
  description: string | ReactElement;
}) => {
  return (
    <div className="flex gap-2 items-center -ml-2.5">
      <div className="w-6 h-6 min-w-6 text-sm rounded-full bg-border text-primary text-center flex items-center justify-center">
        {number}
      </div>
      <Typography className="w-fit">{description}</Typography>
    </div>
  );
};

const StepDescription = ({ children }: { children: ReactElement }) => {
  return (
    <div className="border-l-2 pl-4 md:pl-5 py-4 h-fit w-full">
      {children}
    </div>
  );
};

const DetailsPage = () => {
  return (
    <React.Fragment>
      <Tabs defaultValue="what-this-does">
        <TabsList>
          <TabsTrigger value="what-this-does">
            What it does ?
          </TabsTrigger>
          <TabsTrigger value="payload">
            Payload
          </TabsTrigger>
        </TabsList>
        <TabsContent value="what-this-does">
          <OperationDocs operations={op} />
        </TabsContent>
        <TabsContent value="payload">
          <CodeBlockWrapper className="max-w-[80vw] md:max-w-auto w-full" className="max-w-[89vw]" disableShowMore>
            {JSON.stringify(op, null, 2)}
          </CodeBlockWrapper>
        </TabsContent>
      </Tabs>
    </React.Fragment>
  );
};

const OperationDocs = ({ operations }) => {
  return (
    <div className="space-y-4">
      {operations.map((operation, index) => (
        <OperationBlock
          key={index}
          operation={operation}
          number={index + 1}
        />
      ))}
    </div>
  );
};

const OperationBlock = ({ operation, number }) => {
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
                <CodeBlockWrapper className="max-w-[80vw] md:max-w-auto w-full" className="max-w-sm w-full">{operation.dep.join("\n")}</CodeBlockWrapper>
              </>
            )}
            {operation.devDep && operation.devDep.length > 0 && (
              <>
                <p className="font-semibold">Dev Dependencies:</p>
                <CodeBlockWrapper className="max-w-[80vw] md:max-w-auto w-full">{operation.devDep.join("\n")}</CodeBlockWrapper>
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
          <CodeBlockWrapper className="max-w-[80vw] md:max-w-auto w-full">{/* Remote file content */}</CodeBlockWrapper>
        </StepDescription >
      </div >
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
            <OperationDocs operations={operation.actions} />
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
                <TabsContent
                  value={selection.value}
                  key={idx}
                  className="pt-4"
                >
                  <OperationDocs operations={operation.values[selection.value]} />
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
            <CodeBlockWrapper className="max-w-[80vw] md:max-w-auto w-full">{operation.condition}</CodeBlockWrapper>
            {operation.then && (
              <>
                <p className="mt-4 font-semibold">Then:</p>
                <OperationDocs operations={operation.then} />
              </>
            )}
            {operation.else && (
              <>
                <p className="mt-4 font-semibold">Else:</p>
                <OperationDocs operations={operation.else} />
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
          <CodeBlockWrapper className="max-w-[80vw] md:max-w-auto w-full">{operation.content}</CodeBlockWrapper>
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
          <CodeBlockWrapper className="max-w-[80vw] md:max-w-auto w-full">{operation.content}</CodeBlockWrapper>
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
                  <OperationDocs operations={ops} />
                </TabsContent>
              ))}
            </Tabs>
          </StepDescription>
        )}
      </div>
    );
  } else {
    return (
      <div key={number}>
        <StepComp
          description={`Unknown operation: ${operation.op}`}
          number={number}
        />
        <StepDescription>
          <CodeBlockWrapper className="max-w-[80vw] md:max-w-auto w-full">{JSON.stringify(operation, null, 2)}</CodeBlockWrapper>
        </StepDescription>
      </div>
    );
  }
};

export default DetailsPage;