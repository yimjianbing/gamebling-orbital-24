import { render, screen } from '@testing-library/react';
import About from '../pages/About/About';

describe('About Component', () => {
    test('renders About component', () => {
        render(<About />);
        const aboutElement = screen.getByTestId('about');
        expect(aboutElement).toBeInTheDocument();
    });

    test('displays correct heading', () => {
        render(<About />);
        const headingElement = screen.getByRole('heading', { name: "About Us" });
        expect(headingElement).toBeInTheDocument();
    });

    // test('displays description', () => {
    //     render(<About />);
    //     const descriptionElement = screen.getByText(/this is the about page/i);
    //     expect(descriptionElement).toBeInTheDocument();
    // });

    // Add more tests here based on your requirements

});