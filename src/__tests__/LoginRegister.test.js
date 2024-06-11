import { render, screen, fireEvent } from '@testing-library/react';
import LoginRegister from '../pages/LoginRegister/LoginRegister';
import { MemoryRouter,  HashRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';

describe('LoginRegister Component', () => {

    const history = createMemoryHistory({ initialEntries: ['/home']});


    test('renders LoginRegister component', () => {
        render(
            <MemoryRouter history={history}>
                <LoginRegister />
            </MemoryRouter>
        );
    });

    test('updates on register login input change', () => {
        render(
            <MemoryRouter history={history}>
                <LoginRegister />
            </MemoryRouter>);
        const emailInput = screen.getByTestId('loginEmail');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(emailInput.value).toBe('test@example.com');
    });

    test('updates on register email input change', () => {
        render(
            <MemoryRouter history={history}>
                <LoginRegister />
            </MemoryRouter>);
        const emailInput = screen.getByTestId('registerEmail');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(emailInput.value).toBe('test@example.com');
    });

    test('updates on login password input change', () => {
        render(
            <MemoryRouter history={history}>
                <LoginRegister />
            </MemoryRouter>);
        const emailInput = screen.getByTestId('loginPassword');
        fireEvent.change(emailInput, { target: { value: 'abcdef' } });
        expect(emailInput.value).toBe('abcdef');
    });

    test('updates on register password input change', () => {
        render(
            <MemoryRouter history={history}>
                <LoginRegister />
            </MemoryRouter>);
        const emailInput = screen.getByTestId('registerPassword');
        fireEvent.change(emailInput, { target: { value: 'abcdef' } });
        expect(emailInput.value).toBe('abcdef');
    });

    
    test('updates on register username input change', () => {
        render(
            <MemoryRouter history={history}>
                <LoginRegister />
            </MemoryRouter>);
        const emailInput = screen.getByTestId('username');
        fireEvent.change(emailInput, { target: { value: 'abcdef' } });
        expect(emailInput.value).toBe('abcdef');
    });

    // test('navigate to mainmenu upon succesful login', () => {
    //     render(
    //         // <MemoryRouter history={history}>
    //         //     <LoginRegister />
    //         // </MemoryRouter>
    //         <HashRouter>
    //             <LoginRegister />
    //       </HashRouter>
    //     );

    //     Object.defineProperty(window, "location", {
    //         value: new URL("http://example.com"),
    //         configurable: true,
    //       });
            
    //     const emailInput = screen.getByTestId('loginEmail');
    //     fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    //     const passwordInput = screen.getByTestId('loginPassword');
    //     fireEvent.change(passwordInput, { target: { value: 'testtest' } });
    //     fireEvent.click(screen.getByTestId('loginSubmit'));
    //     expect(window.location.hostname).toBe('/#/mainmenu');

    // });

});