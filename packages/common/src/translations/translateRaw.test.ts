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
});
