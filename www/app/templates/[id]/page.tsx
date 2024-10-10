// pages/details.tsx

import { CodeBlockWrapper } from "@/components/code-previewer";
import React from "react";
import { ReactElement } from "react";

const StepComp = ({
  number,
  description,
}: {
  number: number;
  description: string;
}) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="size-6 min-w-6 text-sm rounded-full bg-border text-primary text-center flex items-center justify-center">
        {number}
      </div>
      <p>{description}</p>
    </div>
  );
};

const StepDescription = ({ children }: { children: ReactElement }) => {
  return (
    <div className="ml-[11px] border-s-2 ps-5 py-4 h-fit w-full">
      {children}
    </div>
  );
};

const item = `// Your code here
function example() {
  console.log("Hello, world!");
}

function example2() {
  console.log("Hello, world!");
}

function example3() {
  console.log("Hello, world!");
}

`;
const DetailsPage = () => {
  return (
    <React.Fragment>
      <StepComp description="Install the following dependencies" number={1} />
      <StepDescription>
        <CodeBlockWrapper>{item}</CodeBlockWrapper>
      </StepDescription>
      <StepComp
        description="Copy and paste the following code into your project."
        number={2}
      />
      <StepDescription>
        <CodeBlockWrapper>
          <div>This si teh code</div>
        </CodeBlockWrapper>
      </StepDescription>
      <StepComp
        description="Update the import paths to match your project setup."
        number={3}
      />
      <StepDescription>
        <div>This si teh code</div>
      </StepDescription>
      <StepComp description="Update" number={4} />
      <StepDescription>
        <CodeBlockWrapper>
          <div>This si teh code</div>
        </CodeBlockWrapper>
      </StepDescription>
      <StepComp description="Update" number={4} />
      <StepDescription>
        <CodeBlockWrapper>
          <div>This si teh code</div>
        </CodeBlockWrapper>
      </StepDescription>
      <StepComp description="Update" number={4} />
      <StepDescription>
        <CodeBlockWrapper>
          <div>This si teh code</div>
        </CodeBlockWrapper>
      </StepDescription>
      <StepComp description="Update" number={4} />
      <StepDescription>
        <CodeBlockWrapper>
          <div>This si teh code</div>
        </CodeBlockWrapper>
      </StepDescription>
    </React.Fragment>
  );
};

export default DetailsPage;
