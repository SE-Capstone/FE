import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from './App';

describe('Testing app component', () => {
  it('should have hello world text', () => {
    const appRender = render(<App />);

    expect(appRender).toBeDefined();
  });
});

export {};
