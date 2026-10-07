// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import SiteSettingsForm from '@/components/admin/SiteSettingsForm';

test('SiteSettingsForm includes footer_text text input and CV File Upload field', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render(<SiteSettingsForm settings={{} as any} onSubmit={vi.fn() as any} isPending={false} />);
  expect(screen.getByLabelText(/Teks Footer/i)).toBeDefined();
  expect(screen.getByLabelText(/File CV/i)).toBeDefined();
});
