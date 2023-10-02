import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard'
import '@testing-library/jest-dom';
import React from 'react';

describe('Renders Element on Dashboard', () => {
  const renderDashboard= () => {
    render(<Dashboard data = {[
      { id: '1', name: 'Namespaces', value: 1 },
      { id: '2', name: 'Nodes', value: 4 },
      { id: '3', name: 'Pods', value: 2 },
    ]} />)
  }
  test("Renders Element on Dashboard", () => {
    renderDashboard();
    expect(screen.getByText('Namespaces')).toBeInTheDocument()
    expect(screen.getByText('Nodes')).toBeInTheDocument()
    expect(screen.getByText('Pods')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(document.getElementById('1')).toHaveTextContent('Namespaces')
    expect(document.getElementById('1')).toHaveTextContent('1')
    expect(document.getElementById('2')).toHaveTextContent('Nodes')
    expect(document.getElementById('2')).toHaveTextContent('4')
    expect(document.getElementById('3')).toHaveTextContent('Pods')
    expect(document.getElementById('3')).toHaveTextContent('2')









  });
});