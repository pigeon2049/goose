import { ChevronDown, ListTodo } from 'lucide-react';
import { useState } from 'react';
import { defineMessages, useIntl } from '../i18n';
import { cn } from '../utils';
import { completedTodoCount, parseTodoMarkdown } from '../utils/todoPlan';
import type { LoadingStatus } from './ToolCallWithResponse';
import TodoChecklist from './TodoChecklist';

const i18n = defineMessages({
  updating: { id: 'todoTool.updating', defaultMessage: 'Updating task list' },
  updated: { id: 'todoTool.updated', defaultMessage: 'Task list updated' },
  updatedWithProgress: {
    id: 'todoTool.updatedWithProgress',
    defaultMessage: 'Task list updated · {done}/{total}',
  },
  failed: { id: 'todoTool.failed', defaultMessage: 'Failed to update task list' },
  expand: { id: 'todoTool.expand', defaultMessage: 'Show updated task list' },
  collapse: { id: 'todoTool.collapse', defaultMessage: 'Hide updated task list' },
});

export default function TodoToolCallView({
  content,
  status,
}: {
  content: string;
  status: LoadingStatus;
}) {
  const intl = useIntl();
  const [expanded, setExpanded] = useState(false);
  const entries = parseTodoMarkdown(content);
  const done = completedTodoCount(entries);
  const label =
    status === 'loading'
      ? intl.formatMessage(i18n.updating)
      : status === 'error'
        ? intl.formatMessage(i18n.failed)
        : entries.length > 0
          ? intl.formatMessage(i18n.updatedWithProgress, { done, total: entries.length })
          : intl.formatMessage(i18n.updated);

  return (
    <div className="w-full text-sm font-sans">
      <button
        type="button"
        className="group flex min-h-10 w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-background-secondary/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-border-primary"
        onClick={() => entries.length > 0 && setExpanded((value) => !value)}
        aria-expanded={entries.length > 0 ? expanded : undefined}
        aria-label={
          entries.length > 0
            ? expanded
              ? intl.formatMessage(i18n.collapse)
              : intl.formatMessage(i18n.expand)
            : undefined
        }
      >
        <ListTodo
          aria-hidden="true"
          className={cn(
            'size-4 shrink-0 text-text-secondary',
            status === 'loading' && 'tool-call-name-loading',
            status === 'error' && 'text-text-danger'
          )}
        />
        <span
          className={cn(
            'min-w-0 flex-1 truncate font-medium',
            status === 'loading' && 'tool-call-name-loading',
            status === 'error' && 'text-text-danger'
          )}
        >
          {label}
        </span>
        {entries.length > 0 && (
          <ChevronDown
            className={cn(
              'size-4 shrink-0 text-text-secondary transition-transform group-hover:text-text-primary',
              expanded && 'rotate-180'
            )}
          />
        )}
      </button>
      {expanded && (
        <TodoChecklist
          entries={entries}
          className="border-t border-border-primary bg-background-secondary/20 px-3 py-2.5"
        />
      )}
    </div>
  );
}
