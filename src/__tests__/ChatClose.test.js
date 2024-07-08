import { render, screen, fireEvent } from '@testing-library/react';
import ChatClose from '../components/ChatClose/ChatClose';

describe('chatClose Component', () => {
    test('renders chatClose component', () => {
        render(<ChatClose />);
        const aboutElement = screen.getByTestId('chatClose');
        expect(aboutElement).toBeInTheDocument();
    });

    test('displays open chat icon', () => {
        render(<ChatClose />);
        const iconElement = screen.getByTestId("openChat");
        expect(iconElement).toBeInTheDocument();
    });


});