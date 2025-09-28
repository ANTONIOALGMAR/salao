import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/dom';
import { Layout } from '../Layout';

describe('Layout component', () => {
  it('should render the header, main, and footer sections', () => {
    const container = document.createElement('div');
    container.innerHTML = Layout('<div>Test Content</div>');
    document.body.appendChild(container);

    const headerElement = document.querySelector('header');
    const mainElement = document.querySelector('main');
    const footerElement = document.querySelector('footer');

    expect(headerElement).toBeInTheDocument();
    expect(mainElement).toBeInTheDocument();
    expect(footerElement).toBeInTheDocument();
    expect(mainElement).toHaveTextContent('Test Content');
  });
});
