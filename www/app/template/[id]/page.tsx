import { CodeBlockWrapper } from "@/components/code-previewer";
import { Typography } from "@/components/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from "react";
import { ReactElement } from "react";
import _ from "lodash";

const op = [
  {
    "op": "input",
    "title": "Which is your source directory",
    "defaultValue": "./src/*",
    "value": "$aliases",
    "actions": [
      {
        "op": "add",
        "remoteSrc": "/cli/setup.json",
        "targetSrc": "./command.config.json"
      },
      {
        "op": "updateJSON",
        "targetSrc": "./command.config.json",
        "path": "aliases.path",
        "value": "$aliases"
      },
      {
        "op": "updateJSON",
        "targetSrc": "./package.json",
        "path": "imports.~/*",
        "value": "$aliases"
      },
      {
        "op": "updateJSON",
        "targetSrc": "./tsconfig.json",
        "path": "compilerOptions.paths.~/*[0]",
        "value": "$aliases"
      }
    ]
  },
  {
    "op": "select",
    "title": "Select you package manager",
    "selections": [
      { "label": "npm", "value": "npm" },
      { "label": "pnpm", "value": "pnpm" },
      { "label": "yarn", "value": "yarn" }
    ],
    "value": "$packageManager",
    "values": {
      "npm": [
        {
          "op": "updateJSON",
          "targetSrc": "./command.config.json",
          "path": "packageManager",
          "value": "npm"
        }
      ],
      "pnpm": [
        {
          "op": "updateJSON",
          "targetSrc": "./command.config.json",
          "path": "packageManager",
          "value": "pnpm"
        }
      ],
      "yarn": [
        {
          "op": "updateJSON",
          "targetSrc": "./command.config.json",
          "path": "packageManager",
          "value": "yarn"
        }
      ]
    }
  }
]

const StepComp = ({
  number,
  description,
}: {
  number: number;
  description: string | ReactElement;
}) => {
  return (
    <div className="flex gap-2 items-center -ml-2.5">
      <div className="size-6 min-w-6 text-sm rounded-full bg-border text-primary text-center flex items-center justify-center">
        {number}
      </div>
      <Typography className="w-fit">{description}</Typography>
    </div>
  );
};

const StepDescription = ({ children }: { children: ReactElement }) => {
  return (
    <div className="border-s-2 ps-4 md:ps-5 py-4 h-fit w-full">
      {children}
    </div>
  );
};

const DetailsPage = () => {
  return (
    <React.Fragment>
      <OperationDocs operations={op} />
    </React.Fragment>
  );
};

const OperationDocs = ({ operations }) => {
  return (
    <div>
      {operations.map((operation, index) => (
        <OperationBlock key={index} operation={operation} number={index + 1} />
      ))}
    </div>
  );
};

const OperationBlock = ({ operation, number }) => {
  switch (operation.op) {
    case 'install':
      return (
        <div key={number}>
          <StepComp description={`Install the following dependencies:`} number={number} />
          <StepDescription>
            <CodeBlockWrapper>
              {`${operation.code} ${operation.dep ? operation.dep.join(' ') : ''} ${operation.devDep ? `--save-dev ${operation.devDep.join(' ')}` : ''}`}
            </CodeBlockWrapper>
          </StepDescription>
        </div>
      );

    case 'add':
      return (
        <div key={number}>
          <StepComp description={<>Add file from path <code>{operation?.remoteSrc}</code> to <code>{operation?.targetSrc}</code></>} number={number} />
          <StepDescription>
            <code className="text-xs">{operation?.remoteSrc}</code>
            <CodeBlockWrapper>{operation.code}</CodeBlockWrapper>
          </StepDescription>
        </div>
      );

    case 'updateJSON':
      return (
        <div key={number}>
          <StepComp description={<>Update JSON file at <code>{operation?.targetSrc}</code></>} number={number} />
          <StepDescription>
            <CodeBlockWrapper>{JSON.stringify(_.set({}, operation.path, operation.value), undefined, 2)}</CodeBlockWrapper>
          </StepDescription>
        </div>
      );

    case 'input':
      return (
        <div key={number}>
          <StepComp description={<>
            {operation.title} (default: <code className="mx-1">{operation.defaultValue}</code>) value is saved as
            <code className="mx-1">{operation.value}</code>
          </>} number={number} />
          <StepDescription>
            <React.Fragment>
              <p className="italic mb-4 text-sm text-muted-foreground">Then</p>
              <OperationDocs operations={operation.actions} />
            </React.Fragment>
          </StepDescription>
        </div>
      );

    case 'select':
      return (
        <div key={number}>
          <StepComp description={'Select an option:'} number={number} />
          <StepDescription>
            <React.Fragment>
              <Tabs defaultValue={operation.selections[0]?.value}>
                <TabsList>
                  {operation.selections.map((selection: { value: string, label: string }, idx: number) => (
                    <TabsTrigger key={idx} value={selection?.value}>{selection?.label}</TabsTrigger>
                  ))}
                </TabsList>
                {operation.selections.map((selection: { value: string, label: string }, idx: number) => (
                  <TabsContent value={selection?.value} key={idx} className="pt-4">
                    <OperationDocs operations={operation.values[selection?.value]} />
                  </TabsContent>
                ))}
              </Tabs>
            </React.Fragment>
          </StepDescription>
        </div>
      );

    case 'conditional':
      return (
        <div key={number}>
          <StepComp description={`Conditional Operation: Evaluating if ${operation.condition}`} number={number} />
          <StepDescription>
            <CodeBlockWrapper>
              {`If condition: ${operation.condition}`}
              {operation.then && (
                <div>Then, execute: {JSON.stringify(operation.then)}</div>
              )}
              {operation.else && (
                <div>Else, execute: {JSON.stringify(operation.else)}</div>
              )}
            </CodeBlockWrapper>
          </StepDescription>
        </div>
      );

    default:
      return (
        <div key={number}>
          <StepComp description={`Unknown operation: ${operation.op}`} number={number} />
          <StepDescription>
            <CodeBlockWrapper>{JSON.stringify(operation)}</CodeBlockWrapper>
          </StepDescription>
        </div>
      );
  }
};

export default DetailsPage;
