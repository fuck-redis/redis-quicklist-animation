import React, { Fragment, useMemo } from 'react';
import { LANGUAGE_LABELS, SOLUTION_CODES } from '@/data/quicklistCode';
import { AlgorithmStep, Language, SolutionId } from '@/types/quicklistViz';
import styles from './CodePanel.module.css';

interface CodePanelProps {
  solutionId: SolutionId;
  language: Language;
  onLanguageChange: (language: Language) => void;
  step: AlgorithmStep;
}

interface Token {
  text: string;
  type: 'normal' | 'keyword' | 'string' | 'number' | 'comment';
}

const KEYWORDS = new Set([
  'class',
  'void',
  'int',
  'for',
  'if',
  'else',
  'while',
  'return',
  'new',
  'const',
  'let',
  'function',
  'def',
  'func',
  'true',
  'false',
  'continue',
  'None',
  'nil',
]);

function tokenize(line: string): Token[] {
  const commentIndex = line.indexOf('//');
  const hashComment = line.indexOf('#');
  let splitCommentAt = -1;

  if (commentIndex >= 0 && hashComment >= 0) {
    splitCommentAt = Math.min(commentIndex, hashComment);
  } else {
    splitCommentAt = Math.max(commentIndex, hashComment);
  }

  if (splitCommentAt >= 0) {
    return [
      ...tokenize(line.slice(0, splitCommentAt)),
      { text: line.slice(splitCommentAt), type: 'comment' },
    ];
  }

  const tokens: Token[] = [];
  const regex = /("(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_][a-zA-Z0-9_]*\b)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > cursor) {
      tokens.push({ text: line.slice(cursor, match.index), type: 'normal' });
    }

    const [token] = match;
    if (token.startsWith('"') || token.startsWith("'")) {
      tokens.push({ text: token, type: 'string' });
    } else if (/^\d/.test(token)) {
      tokens.push({ text: token, type: 'number' });
    } else if (KEYWORDS.has(token)) {
      tokens.push({ text: token, type: 'keyword' });
    } else {
      tokens.push({ text: token, type: 'normal' });
    }
    cursor = match.index + token.length;
  }

  if (cursor < line.length) {
    tokens.push({ text: line.slice(cursor), type: 'normal' });
  }

  return tokens;
}

export const CodePanel: React.FC<CodePanelProps> = ({ solutionId, language, onLanguageChange, step }) => {
  const snippet = SOLUTION_CODES[solutionId].snippets[language];
  const codeLines = useMemo(() => snippet.split('\n'), [snippet]);

  const activeLineSet = useMemo(() => new Set(step.lineHighlights[language]), [language, step.lineHighlights]);
  const lineNotes = step.lineNotes[language];

  const languageKeys: Language[] = ['java', 'python', 'go', 'javascript'];

  return (
    <section className={styles.panel}>
      <div className={styles.topBar}>
        <div className={styles.titleBlock}>
          <h3 className={styles.title}>代码调试视图</h3>
          <p className={styles.subtitle}>{SOLUTION_CODES[solutionId].summary}</p>
        </div>
        <div className={styles.languageSwitch}>
          {languageKeys.map((key) => (
            <button
              key={key}
              type="button"
              className={`${styles.langButton} ${language === key ? styles.activeLang : ''}`}
              onClick={() => onLanguageChange(key)}
            >
              {LANGUAGE_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.codeViewport}>
        {codeLines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = activeLineSet.has(lineNumber);
          const note = lineNotes[lineNumber];
          const tokens = tokenize(line);

          return (
            <div
              key={lineNumber}
              className={`${styles.codeLine} ${isActive ? styles.activeLine : ''}`}
            >
              <span className={styles.lineNo}>{String(lineNumber).padStart(2, '0')}</span>
              <span className={styles.lineText}>
                {tokens.map((token, tokenIdx) => (
                  <Fragment key={`${lineNumber}-${tokenIdx}`}>
                    <span className={styles[token.type]}>{token.text}</span>
                  </Fragment>
                ))}
              </span>
              <span className={styles.lineNote}>{note ?? ''}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
