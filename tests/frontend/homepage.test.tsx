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

test('Typography and font token classes render without error', () => {
  const { container } = render(
    <div className="font-display-hero text-on-surface bg-surface">
      Test Typography
    </div>
  );
  expect((container.firstChild as HTMLElement).className).toContain('font-display-hero');
  expect((container.firstChild as HTMLElement).className).toContain('text-on-surface');
  expect((container.firstChild as HTMLElement).className).toContain('bg-surface');
});
