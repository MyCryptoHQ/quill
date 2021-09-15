import { translateRaw } from './translateRaw';

describe('translateRaw', () => {
  it('grabs a translation string from en.json', () => {
    expect(translateRaw('DELETE')).toBe('Delete');
  });

  it('replaces variables', () => {
    expect(translateRaw('FORGOT_PASSWORD_HELP', { $link: 'foo' })).toBe(
      'Forgot your password? Discover options foo'
    );
  });

  it('handles escaping of $', () => {
    expect(translateRaw('CONFIRM_ACCOUNT_DELETION', { $label: '$`', $address: '0x' })).toBe(
      'Are you sure you want to delete “$`” account with address 0x?'
    );
  });

  it('handles errors', () => {
    expect(translateRaw('CONFIRM_ACCOUNT_DELETION', { $label: undefined })).toBe(
      'CONFIRM_ACCOUNT_DELETION'
    );
  });
});
