import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'redis' }) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{
        margin: '20px 0',
        padding: '20px',
        borderRadius: '6px',
        fontSize: '13px',
        lineHeight: '1.6',
        overflow: 'auto',
        background: '#1a1a1a',
      }}
      showLineNumbers={false}
    >
      {code}
    </SyntaxHighlighter>
  );
};
