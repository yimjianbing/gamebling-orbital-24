import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import { AuthContext } from '../context/AuthContext';
import ChatRoom from '../components/ChatRoom/ChatRoom';

function render(ui, { providerProps, ...renderOptions }) {
    return rtlRender(
      <AuthContext.Provider {...providerProps}>{ui}</AuthContext.Provider>,
      renderOptions
    )
}

const values = {
    currentUserLoggedIn: {
        displayName: "test",
    },
    setCurrentUserLoggedIn: null,
    updateLoggedIn: null,
    loggedIn: true,
  }

describe('ChatRoom Component', () => {



    test('renders ChatRoom component', () => {
        render(<ChatRoom />,  { providerProps: { value: { values } } });

        const aboutElement = screen.getByTestId('chatRoom');
        expect(aboutElement).toBeInTheDocument();
    });

    test('displays open chat icon', () => {
        render(<ChatRoom />,  { providerProps: { value: { values } } });

        const iconElement = screen.getByTestId("closeChat");
        expect(iconElement).toBeInTheDocument();
    });

    test('updates on newMessage input change', () => {
        render(<ChatRoom />,  { providerProps: { value: { values } } });

        const messageInput = screen.getByTestId('newMessage');
        fireEvent.change(messageInput, { target: { value: 'test' } });
        expect(messageInput.value).toBe('test');
    });

    // test('new message appears upon hitting send', () => {

    //     render(<ChatRoom />,  { providerProps: { value: { values } } });

    //     const messageInput = screen.getByTestId('newMessage');
    //     fireEvent.change(messageInput, { target: { value: 'test' } });
    //     fireEvent.click(screen.getByTestId('send'));
    //     expect(screen.getByText('test')).toBeInTheDocument();
    // });


});