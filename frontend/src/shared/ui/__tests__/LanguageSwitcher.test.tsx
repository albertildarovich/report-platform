import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../shared/i18n';

// Mock i18n changeLanguage
const mockChangeLanguage = jest.fn();
const mockI18n = {
  language: 'en',
  changeLanguage: mockChangeLanguage,
};

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: mockI18n,
  }),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    mockChangeLanguage.mockClear();
  });

  test('renders current language button', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  test('opens menu on button click', () => {
    render(<LanguageSwitcher />);
    const button = screen.getByText('English');
    fireEvent.click(button);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Русский')).toBeInTheDocument();
  });

  test('changes language on menu item click', async () => {
    render(<LanguageSwitcher />);
    const button = screen.getByText('English');
    fireEvent.click(button);
    const ruMenuItem = screen.getByText('Русский');
    fireEvent.click(ruMenuItem);
    expect(mockChangeLanguage).toHaveBeenCalledWith('ru');
  });

  test('closes menu after language selection', async () => {
    render(<LanguageSwitcher />);
    const button = screen.getByText('English');
    fireEvent.click(button);
    const ruMenuItem = screen.getByText('Русский');
    fireEvent.click(ruMenuItem);
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });
});