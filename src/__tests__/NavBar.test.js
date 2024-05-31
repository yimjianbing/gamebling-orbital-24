import { render, screen} from '@testing-library/react';
import { NavBar } from '../Components/NavBar/NavBar';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';

describe('NavBar Component', () => {
    test('renders NavBar component', () => {
        const history = createMemoryHistory();
        render(
            <MemoryRouter history={history}>
                <NavBar />
            </MemoryRouter>
        );
    });

    test('navigates to about page on button click', () => {
        const history = createMemoryHistory();
        render(
            <MemoryRouter history={history}>
                <NavBar />
            </MemoryRouter>
        );
        expect(screen.getByTestId('home')).toHaveAttribute('href', '/');
        expect(screen.getByTestId('about')).toHaveAttribute('href', '/about');
        expect(screen.getByTestId('contactus')).toHaveAttribute('href', '/contactus');
        expect(screen.getByTestId('mainmenu')).toHaveAttribute('href', '/mainmenu');
                
    });
});