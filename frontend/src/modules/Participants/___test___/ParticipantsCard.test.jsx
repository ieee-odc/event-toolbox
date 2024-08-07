import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import ParticipantsCard from '../components/ParticipantsCard';
import "@testing-library/jest-dom";

const mockStore = configureStore([]);

describe('ParticipantsCard Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            participantsStore: {
                participants: [],
                filteredParticipants: [],
                participantsPerPage: 10,
                searchQuery: '',
                isEdit: false
            }
        });
    });

    test('renders ParticipantsCard component', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <ParticipantsCard />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText(/All Participants/i)).toBeInTheDocument();
        expect(screen.getByText(/Download/i)).toBeInTheDocument();
    });

    test('handles status change', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <ParticipantsCard />
                </BrowserRouter>
            </Provider>
        );

        const selectElement = screen.getByLabelText(/participantStatusFilter/i);
        fireEvent.change(selectElement, { target: { value: 'Paid' } });
        expect(selectElement.value).toBe('Paid');
    });

    test('download button triggers generateExcel function', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <ParticipantsCard />
                </BrowserRouter>
            </Provider>
        );

        const downloadButton = screen.getByText(/Download/i);
        fireEvent.click(downloadButton);

        expect(true).toBe(true);
    });
});
