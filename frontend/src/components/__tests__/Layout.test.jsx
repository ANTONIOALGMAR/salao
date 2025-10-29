import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Layout from '../Layout';

describe('Layout component', () => {
  it('should render the header, main, and footer sections', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<div>Test Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const headerElement = document.querySelector('header');
    const mainElement = document.querySelector('main');
    const footerElement = document.querySelector('footer');

    expect(headerElement).toBeInTheDocument();
    expect(mainElement).toBeInTheDocument();
    expect(footerElement).toBeInTheDocument();
    expect(mainElement).toHaveTextContent('Test Content');
  });
});


