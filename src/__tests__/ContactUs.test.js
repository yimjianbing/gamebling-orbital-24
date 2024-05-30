import { render, screen, fireEvent } from '@testing-library/react';
import ContactUs from '../pages/ContactUs/ContactUs';

// Import the necessary dependencies

// Test case: Check if the ContactUs component renders without errors
test('renders ContactUs component without errors', () => {
    render(<ContactUs />);
    const contactUsElement = screen.getByTestId('contactus');
    expect(contactUsElement).toBeInTheDocument();
});