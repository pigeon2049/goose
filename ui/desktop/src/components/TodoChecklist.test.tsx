/**
 * @vitest-environment jsdom
 */
import type { PlanEntry } from '@agentclientprotocol/sdk';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IntlTestWrapper } from '../i18n/test-utils';
import TodoChecklist from './TodoChecklist';

describe('TodoChecklist', () => {
  it('spins the in-progress status icon', () => {
    const entries: PlanEntry[] = [
      {
        content: 'Run the current task',
        priority: 'medium',
        status: 'in_progress',
      },
    ];

    render(<TodoChecklist entries={entries} />, { wrapper: IntlTestWrapper });

    expect(screen.getByLabelText('In progress')).toHaveClass('animate-spin');
    expect(screen.getByLabelText('In progress')).not.toHaveClass('animate-pulse');
  });
});
