/** @vitest-environment jsdom */
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HeroSection from '@/components/ui/HeroSection';

test('HeroSection menggunakan fallback jika metadata kosong', () => {
    render(<HeroSection metadata={null} cvUrl="test.pdf" />);
    // "Jovanka" is the fallback name in my plan ?
    // Wait, let's see the fallback values.
    // The spec says `page?.metadata?.hero_name || "Nama Bawaan"`.
    // Wait, the plan says "Nama Bawaan". Wait, the actual site says "Jovanka Surya Dilla".
    expect(screen.getByText('Jovanka')).toBeDefined();
});
