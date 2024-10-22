import { cn } from "@/lib/utils";
import clsx from "clsx";
import { Children, PropsWithChildren } from "react";

export function Stepper({ children }: PropsWithChildren) {
  const length = Children.count(children);

  return (
    <div className="flex flex-col mt-8">
      {Children.map(children, (child, index) => {
        return (
          <div
            className={cn(
              "border-l pl-3 md:pl-5 relative",
              clsx({
                "pb-5 ": index < length - 1,
              })
            )}
          >
            <div className="bg-muted size-4 md:size-6 text-xs font-medium rounded-md border flex items-center justify-center absolute -left-2 md:-left-3 font-code">
              {index + 1}
            </div>
            {child}
          </div>
        );
      })}
    </div>
  );
}

export function StepperItem({
  children,
  title,
}: PropsWithChildren & { title?: string }) {
  return (
    <div className="">
      <h4 className="-mt-1 md:mt-0">{title}</h4>
      <div>{children}</div>
    </div>
  );
}
