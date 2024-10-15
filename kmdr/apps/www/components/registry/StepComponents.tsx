import { ReactElement } from "react";
import { Typography } from "../typography";

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
    <div className="border-l-2 pl-4 md:pl-5 py-4 h-fit w-full">{children}</div>
  );
};

export { StepComp, StepDescription };
