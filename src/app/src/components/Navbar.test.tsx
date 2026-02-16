import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

describe('Navbar', () => {
  it('should render the expected number of navigation links', async () => {
    // Arrange/Act
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Assert
    const links = await screen.findAllByRole('link');

    expect(links).toHaveLength(3);

    links.forEach((link) => {
      expect(link).toBeVisible();
    });
  });

  it('should render the Home, Vehicles, and Line-up Builder links', async () => {
    // Arrange/Act
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Assert
    expect(await screen.findByRole('link', { name: 'Home' })).toBeVisible();
    expect(await screen.findByRole('link', { name: 'Vehicles' })).toBeVisible();
    expect(await screen.findByRole('link', { name: 'Line-up Builder' })).toBeVisible();
  });

  it('should set aria-current="page" on active link', async () => {
    // Arrange/Act
    render(
      <MemoryRouter initialEntries={['/vehicles']}>
        <Navbar />
      </MemoryRouter>
    );

    // Assert
    const vehiclesLink = await screen.findByRole('link', { name: 'Vehicles' });
    expect(vehiclesLink).toHaveAttribute('aria-current', 'page');

    const homeLink = await screen.findByRole('link', { name: 'Home' });
    expect(homeLink).not.toHaveAttribute('aria-current');
    const lineupLink = await screen.findByRole('link', { name: 'Line-up Builder' });
    expect(lineupLink).not.toHaveAttribute('aria-current');
  });

  it('should set aria-current="page" on home link when at root', async () => {
    // Arrange/Act
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    );

    // Assert
    const homeLink = await screen.findByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });
});
