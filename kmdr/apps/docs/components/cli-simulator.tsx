"use client";

import React, { useState, useEffect } from "react";

type TCommand = {
  id: string;
  text?: string;
  typing?: boolean;
  delay?: number;
  clear?: boolean;
};

const CLISimulator = ({
  commands,
  defaultDelay = 100,
  onNextCommand,
}: {
  onNextCommand: (c: TCommand) => void;
  commands: TCommand[];
  defaultDelay: number;
}) => {
  const [displayedText, setDisplayedText] = useState(""); // Text displayed so far
  const [index, setIndex] = useState(0); // Index of the command to display
  const [subIndex, setSubIndex] = useState(0); // Index within the command text being typed

  useEffect(() => {
    if (onNextCommand) onNextCommand(commands[index]);
  }, [index]);

  useEffect(() => {
    if (index < commands.length) {
      const {
        text = "",
        typing = true,
        delay = defaultDelay,
        clear,
      } = commands[index];

      if (clear) {
        // If the command has a clear property, reset the canvas (clear the text)
        setDisplayedText("");
        setIndex((prevIndex) => prevIndex + 1); // Move to the next command
        setSubIndex(0); // Reset subIndex
        return; // Exit the current effect
      }

      if (text === "") {
        // If the text is empty, just delay and move to the next command
        const emptyDelay = setTimeout(() => {
          setIndex((prevIndex) => prevIndex + 1);
        }, delay);
        return () => clearTimeout(emptyDelay);
      }

      if (typing) {
        // If it's a command to be typed, start the typing effect
        const textToType = `~ ${text}`;
        if (subIndex < textToType.length) {
          const typingInterval = setInterval(() => {
            setDisplayedText((prev) => prev + textToType[subIndex]);
            setSubIndex((prevSubIndex) => prevSubIndex + 1);
          }, delay);

          return () => clearInterval(typingInterval);
        } else {
          // Once the text is fully typed, move to the next command
          setIndex((prevIndex) => prevIndex + 1);
          setSubIndex(0); // Reset the subIndex for the next command
          setDisplayedText((prev) => prev + "\n"); // Add a new line after each command
        }
      } else {
        // If typing is false, display the multiline text directly
        const lines = text.split("\n");
        const formattedLines = lines.map((line) => `  ${line}`).join("\n");
        setDisplayedText((prev) => prev + formattedLines + "\n");
        setIndex((prevIndex) => prevIndex + 1);
      }
    }
  }, [index, subIndex, commands, defaultDelay]);

  return (
    <div className="font-mono text-sm whitespace-pre-wrap min-w-[500px]">
      {displayedText}
      {index < commands.length && commands[index].typing && (
        <span className="text-blue-800 dark:text-blue-500">|</span>
      )}
    </div>
  );
};

export default CLISimulator;
