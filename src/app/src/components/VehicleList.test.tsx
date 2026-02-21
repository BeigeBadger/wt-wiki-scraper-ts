import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { VehicleList } from '../components/VehicleList';

describe('VehicleList', () => {
  const mockVehicles = [
    {
      id: '1',
      name: '[Sweden]Bf 109 G-2',
      country: 'sweden',
      category: 'aviation',
      rank: 3,
      role: 'Fighter',
      battleRating: { arcade: 3.0, realistic: 3.7, simulator: 4.0 },
    },
    {
      id: '2',
      name: '[China]A6M2',
      country: 'china',
      category: 'aviation',
      rank: 2,
      role: 'Fighter',
      battleRating: { arcade: 2.7, realistic: 2.7, simulator: 2.7 },
    },
    {
      id: '3',
      name: '[Japan]F-86F-40',
      country: 'japan',
      category: 'aviation',
      rank: 7,
      role: 'Fighter',
      battleRating: { arcade: 8.0, realistic: 8.7, simulator: 9.0 },
    },
    {
      id: '4',
      name: '[USA]Bf 109 F-4',
      country: 'usa',
      category: 'aviation',
      rank: 3,
      role: 'Fighter',
      battleRating: { arcade: 3.3, realistic: 3.7, simulator: 4.0 },
    },
    {
      id: '5',
      name: 'Bf 109 G-2',
      country: 'germany',
      category: 'aviation',
      rank: 3,
      role: 'Fighter',
      battleRating: { arcade: 3.0, realistic: 3.3, simulator: 3.7 },
    },
  ];

  it('should render vehicle name with Sweden country tag', async () => {
    // Arrange/Act
    render(<VehicleList vehicles={[mockVehicles[0]]} />);

    // Assert
    const vehicleName = await screen.findByTestId('vehicle-name');

    expect(vehicleName).toBeVisible()
    expect(vehicleName.textContent).toBe('[Sweden]Bf 109 G-2');
  });

  it('should render vehicle name with China country tag', async () => {
    // Arrange/Act
    render(<VehicleList vehicles={[mockVehicles[1]]} />);

    // Assert
    const vehicleName = await screen.findByTestId('vehicle-name');

    expect(vehicleName).toBeVisible();
    expect(vehicleName.textContent).toBe('[China]A6M2');
  });

  it('should render vehicle name with Japan country tag', async () => {
    // Arrange/Act
    render(<VehicleList vehicles={[mockVehicles[2]]} />);

    // Assert
    const vehicleName = await screen.findByTestId('vehicle-name');

    expect(vehicleName).toBeVisible();
    expect(vehicleName.textContent).toBe('[Japan]F-86F-40');
  });

  it('should render vehicle name with USA country tag', async () => {
    // Arrange/Act
    render(<VehicleList vehicles={[mockVehicles[3]]} />);

    // Assert
    const vehicleName = await screen.findByTestId('vehicle-name');

    expect(vehicleName).toBeVisible();
    expect(vehicleName.textContent).toBe('[USA]Bf 109 F-4');
  });

  it('should render vehicle name without country tag when not captured', async () => {
    // Arrange/Act
    render(<VehicleList vehicles={[mockVehicles[4]]} />);

    // Assert
    const vehicleName = await screen.findByTestId('vehicle-name');

    expect(vehicleName).toBeVisible();
    expect(vehicleName.textContent).toBe('Bf 109 G-2');
  });

  it('should render multiple vehicles with different country tags', async () => {
    // Arrange/Act
    render(<VehicleList vehicles={mockVehicles} />);

    // Assert
    const table = await screen.findByRole("table")
    const rowGroups = await within(table).findAllByRole("rowgroup")
    // NOTE: rowGroups[0] is the thead element
    const tableBody = rowGroups[1]

    const vehicleRows = await within(tableBody).findAllByRole("row");

    expect(vehicleRows.length).toBe(mockVehicles.length);
  });
});
