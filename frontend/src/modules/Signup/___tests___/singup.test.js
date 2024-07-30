import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import React from 'react';
import '@testing-library/jest-dom';

describe('SignUp Component', () => {
    test('renders SignUp component', () => {
        render(
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        );

        expect(screen.getByText(/Sign Up 🚀/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter your username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/············/i)).toBeInTheDocument();
    });
});
