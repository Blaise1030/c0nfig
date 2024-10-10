"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  expandButtonTitle?: string;
}

export function CodeBlockWrapper({
  expandButtonTitle = "View Code",
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [isOpened, setIsOpened] = React.useState(false);
  const codeBlockRef = React.useRef<HTMLDivElement>(null);
  const [showButton, setShowButton] = React.useState(false);

  React.useEffect(() => {
    if (codeBlockRef.current) {
      const lineHeight = parseInt(
        getComputedStyle(codeBlockRef.current).lineHeight
      );
      const totalLines = Math.ceil(
        codeBlockRef.current.scrollHeight / lineHeight
      );
      setShowButton(totalLines > 5); // Show button if there are more than 5 lines
    }
  }, [children]);

  return (
    <div className="bg-gray-900 border text-white rounded-md relative p-2 max-w-xl">
      <div
        ref={codeBlockRef}
        className={cn(
          "whitespace-pre text-xs font-mono",
          !isOpened && "line-clamp-5"
        )}
      >
        {children}
      </div>
      {showButton && (
        <Button
          className="bottom-1 absolute left-[50%] z-10 -translate-x-[50%]"
          onClick={() => setIsOpened(!isOpened)}
          variant={"secondary"}
          size={"xs"}
        >
          {isOpened ? "Hide code" : expandButtonTitle}
        </Button>
      )}
    </div>
  );
}
