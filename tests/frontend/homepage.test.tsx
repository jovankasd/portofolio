// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import HeroSection from '@/components/ui/HeroSection';

test('HeroSection gracefully falls back if page metadata is completely empty/null', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render(<HeroSection metadata={null as any} cvUrl={null as any} />);
  expect(screen.getByText(/Jovanka/i)).toBeDefined();
  expect(screen.getByText(/Surya Dilla/i)).toBeDefined();
});
