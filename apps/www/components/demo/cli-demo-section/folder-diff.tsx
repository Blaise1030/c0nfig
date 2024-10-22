'use client'
import React from 'react';

// DiffLine component that applies styles based on the type of change
const DiffLine = ({ line }: { line: string }) => {
  // Determine the background color based on the first character (added, updated, or unchanged)
  const getLineStyle = (line: string) => {
    if (line.startsWith('+')) {
      return 'dark:bg-green-500/40 bg-green-400'; // Added lines (green background)
    } else if (line.startsWith('~')) {
      return 'dark:bg-orange-500/40 bg-orange-300'; // Updated lines (orange background)
    } else {
      return ''; // No background for unchanged lines
    }
  };

  return (
    <div className={getLineStyle(line)}>
      {line}
    </div>
  );
};

// FolderDiff component that displays the diff with highlighted lines
export const FolderDiff = ({ diff }: { diff: string }) => {
  // Split the diff into lines and map over them
  return (
    <div className="whitespace-pre-wrap font-mono text-sm transition-colors">
      {diff.split('\n').map((line, index) => (
        <DiffLine key={index} line={line} />
      ))}
    </div>
  );
};