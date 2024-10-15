import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OperationDocs } from "@/components/registry/OperationBlock";
import { CodeBlockWrapper } from "@/components/code-previewer";
import React from "react";
import _ from "lodash";

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

const DetailsPage = () => {
  return (
    <React.Fragment>
      <Tabs defaultValue="what-this-does">
        <TabsList>
          <TabsTrigger value="what-this-does">What it does ?</TabsTrigger>
          <TabsTrigger value="payload">Payload</TabsTrigger>
        </TabsList>
        <TabsContent value="what-this-does">
          <OperationDocs operations={op} />
        </TabsContent>
        <TabsContent value="payload">
          <CodeBlockWrapper
            className="max-w-[89vw] md:max-w-auto w-full"
            disableShowMore
          >
            {JSON.stringify(op, null, 2)}
          </CodeBlockWrapper>
        </TabsContent>
      </Tabs>
    </React.Fragment>
  );
};

export default DetailsPage;
