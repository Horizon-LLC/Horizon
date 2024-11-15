import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

test('navigates to Home Page when Home link is clicked from ProfilePage', async () => {
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === 'username') return 'testUser';
    if (key === 'token') return 'fakeToken';
    return null;
  });

  render(
    <MemoryRouter initialEntries={['/Profile']}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText(/Yo soy Dora\./i)).toBeInTheDocument();

  const homeLink = screen.getByRole('link', { name: /home/i });
  userEvent.click(homeLink);

  expect(await screen.findByText(/Create Post/i)).toBeInTheDocument();
});
