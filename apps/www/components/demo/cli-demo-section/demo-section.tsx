"use client";

import { useState } from "react";
import CLISimulator from "./cli-simulator";
import { FolderDiff } from "./folder-diff";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { RefreshCwIcon } from "lucide-react";

const sample = `[
  {
    "op": "add",
    "remoteSrc": "/assets/db/turso/index.ts",
    "targetSrc": "~/db/index.ts"
  },
  {
    "op": "install",
    "dep": ["@libsql/client"]
  },
  {
    "op": "updateJSON",
    "targetSrc": "./command.config.json",
    "path": "db.engine",
    "value": "sqlite"
  }
]`;

const endpoint = `https://api.example.com/add.json`;

const beforeStructure = `
project-root/
└── setup.json
`;

const afterStructure = `
project-root/
~ ├── setup.json
+ ├── db/
+ │   └── index.ts
+ └── node_modules/
+    └── @libsql/client/
`;

const commands = [
  {
    id: "1",
    text: `curl -X GET "${endpoint}" | jq`,
    typing: true,
    delay: 50,
    clear: false,
  },
  { id: "2", text: "", typing: true, delay: 1000, clear: false },
  { id: "3", text: sample, typing: false, clear: false },
  { id: "4", text: "", typing: true, delay: 1500, clear: false },
  { id: "5", text: "", typing: true, delay: 1000, clear: false },
  {
    id: "6",
    text: `npx k0nfig@latest run ${endpoint}`,
    typing: true,
    delay: 50,
    clear: false,
  },
  {
    id: "7",
    text: "Running command...",
    typing: false,
    delay: 50,
    clear: false,
  },
  { id: "8", text: "", typing: true, delay: 1000, clear: false },
  {
    id: "9",
    text: "Added /assets/db/turso/index.ts to ~/db/index.ts",
    typing: false,
    delay: 1000,
    clear: false,
  },
  {
    id: "10",
    text: "Dependencies installed",
    typing: false,
    delay: 1000,
    clear: false,
  },
  {
    id: "11",
    text: "Updated db.engine in setup.json to sqlite",
    typing: false,
    delay: 1000,
    clear: false,
  },
];

export function DemoSection() {
  const [shouldSwitch, setSwitch] = useState<boolean>(false);
  const [key, setKey] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  return (
    <section className="flex flex-col w-full md:flex-row gap-4 pt-8">
      <Card className="flex-grow min-h-[500px] overflow-hidden">
        <AppHeader appName="Terminal" />
        <div className="w-full h-full p-2 overflow-y-auto">
          <CLISimulator
            key={String(key)}
            commands={commands}
            defaultDelay={100}
            onNextCommand={(item) => {
              setSwitch((p) => (!p ? item?.id === "9" : p));
              setAnimationDone(!Boolean(item));
            }}
          />
        </div>
      </Card>
      <Card className="flex-grow max-w-sm w-full h-[240px] relative overflow-hidden">
        <AppHeader appName="My Project" />
        <div className="w-full h-full p-2 overflow-y-auto pb-20">
          <FolderDiff diff={shouldSwitch ? afterStructure : beforeStructure} />
          <Button
            data-show={animationDone}
            className="rounded-full z-10 absolute bottom-3 data-[show=true]:translate-y-0 transition-all data-[show=false]:translate-y-12 left-[50%] -translate-x-[50%]"
            variant={"secondary"}
            size={"sm"}
            onClick={() => {
              setAnimationDone(false);
              setSwitch(false);
              setKey((p) => !p);
            }}
          >
            <RefreshCwIcon size={12} className="mr-2" />
            Reset Animation
          </Button>
        </div>
      </Card>
    </section>
  );
}

function AppHeader({ appName }: { appName: string }) {
  return (
    <div className="bg-muted h-6 rounded-t flex items-center border-b px-2 gap-2 relative">
      <div className="bg-destructive h-3 w-3 rounded-full" />
      <div className="bg-gray-300 dark:bg-gray-700 h-3 w-3 rounded-full" />
      <div className="bg-green-300 dark:bg-green-600 h-3 w-3 rounded-full" />
      <div className="inset-0 tracking-tight text-center absolute h-full text-xs flex items-center justify-center">
        {appName}
      </div>
    </div>
  );
}
