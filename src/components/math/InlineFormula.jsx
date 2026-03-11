import React, { Component } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * Error boundary for inline formulas to prevent whole-page crashes.
 */
class InlineFormulaErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <code className="rounded bg-red-100 px-1 py-0.5 text-xs text-red-600 dark:bg-red-900/30 dark:text-red-300">
          [formula error]
        </code>
      );
    }
    return this.props.children;
  }
}

/**
 * Renders a KaTeX inline formula.
 *
 * Props:
 *   formula  {string}  LaTeX string to render inline
 */
function InlineFormula({ formula }) {
  if (!formula) return null;

  return (
    <InlineFormulaErrorBoundary>
      <span className="inline-block align-middle">
        <InlineMath
          math={formula}
          renderError={() => (
            <code className="rounded bg-red-100 px-1 py-0.5 text-xs text-red-600 dark:bg-red-900/30 dark:text-red-300">
              [formula error]
            </code>
          )}
        />
      </span>
    </InlineFormulaErrorBoundary>
  );
}

export default InlineFormula;
