import React from 'react';
import { act, render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import NpmSearchComponent from './index';

fetchMock.enableMocks();

jest.mock('use-debounce', () => ({
  useDebounce: (value) => [value, value]
}));

describe('NpmSearchComponent', () => {
  it('renders component', () => {
    render(<NpmSearchComponent />);
  });

  it('updates queryText when input changes', () => {
    const { getByTestId } = render(<NpmSearchComponent />);
    const input = getByTestId('search');

    act(() => {
      fireEvent.change(input, { target: { value: 'react' } });
    });
    expect(input.value).toBe('react');
  });

  it('displays error message when API fetch fails', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

    const { getByTestId } = render(<NpmSearchComponent />);
    const input = getByTestId('search');

    act(() => {
      fireEvent.change(input, { target: { value: 'react' } });
    });

    await waitFor(() => {
      expect(getByTestId('error')).toBeInTheDocument();
    });
  });

  it('displays results when API fetch succeeds', async () => {
    const mockData = [
      {
        package: {
          name: 'react',
          version: '18.2.0',
          description: 'React is a JavaScript library for building user interfaces.',
          links: { npm: 'https://www.npmjs.com/package/react' }
        }
      }
    ]

    fetchMock.mockResponseOnce(JSON.stringify(mockData), {status: 200});

    const { getByTestId, getAllByTestId } = render(<NpmSearchComponent />);
    const input = getByTestId('search');

    act(() => {
      fireEvent.change(input, { target: { value: 'react' } });
    });

    await waitFor(() => {
      const result = getByTestId('result');
      expect(getByTestId('package', {container: result})).toHaveTextContent(mockData[0].package.name);
      expect(getByTestId('version', {container: result})).toHaveTextContent(mockData[0].package.version);
      expect(getByTestId('description', {container: result})).toHaveTextContent(mockData[0].package.description);
    });
  });
});
