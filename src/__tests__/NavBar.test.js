import { render, screen} from '@testing-library/react';
import { NavBar } from '../components/NavBar/NavBar';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { AuthContext } from '../context/AuthContext';

test('NavBar Component', () => {
    const history = createMemoryHistory();
    const mockAuthContext = {
        loggedIn: true,
        // any other expected values
    };
    render(
        <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
            <NavBar />
        </MemoryRouter>
        </AuthContext.Provider>
    );
});

    test('navigates to about page on button click', () => {
        const history = createMemoryHistory();
        const mockAuthContext = {
            loggedIn: true,
            // any other expected values
        };
        render(
            <AuthContext.Provider value={mockAuthContext}>
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
            </AuthContext.Provider>
        );
        expect(screen.getByTestId('home')).toHaveAttribute('href', '/');
        expect(screen.getByTestId('about')).toHaveAttribute('href', '/about');
        expect(screen.getByTestId('contactus')).toHaveAttribute('href', '/contactus');
        expect(screen.getByTestId('mainmenu')).toHaveAttribute('href', '/mainmenu');
                
    });
