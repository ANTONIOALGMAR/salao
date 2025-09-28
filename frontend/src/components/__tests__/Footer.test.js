import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/dom';
import { Footer } from '../Footer';

describe('Footer component', () => {
  it('should render the footer text', () => {
    const container = document.createElement('div');
    container.innerHTML = Footer();
    document.body.appendChild(container);

    const footerElement = document.querySelector('footer');
    expect(footerElement).toBeInTheDocument();
    expect(footerElement).toHaveTextContent('© 2025 Salão de Beleza. Todos os direitos reservados.');
  });
});
