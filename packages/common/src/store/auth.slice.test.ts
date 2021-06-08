import slice, {
  createPassword,
  createPasswordFailed,
  createPasswordSuccess,
  login,
  loginFailed,
  loginSuccess,
  logout,
  reset,
  setNewUser
} from './auth.slice';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    db: { invoke: jest.fn() }
  }
}));

describe('authSlice', () => {
  describe('setNewUser', () => {
    it('sets newUser to the payload', () => {
      expect(
        slice.reducer(
          { initialized: false, newUser: false, loggedIn: false, loggingIn: false },
          setNewUser(true)
        )
      ).toStrictEqual({
        initialized: true,
        newUser: true,
        loggedIn: false,
        loggingIn: false
      });

      expect(
        slice.reducer(
          { initialized: false, newUser: true, loggedIn: false, loggingIn: false },
          setNewUser(false)
        )
      ).toStrictEqual({
        initialized: true,
        newUser: false,
        loggedIn: false,
        loggingIn: false
      });
    });
  });

  describe('login', () => {
    it('sets logging in to true', () => {
      expect(
        slice.reducer(
          { initialized: true, newUser: false, loggedIn: false, loggingIn: false },
          login()
        )
      ).toStrictEqual({
        initialized: true,
        newUser: false,
        loggedIn: false,
        loggingIn: true
      });
    });
  });

  describe('loginSuccess', () => {
    it('sets loggedIn to true', () => {
      expect(
        slice.reducer(
          { initialized: true, newUser: false, loggedIn: false, loggingIn: true },
          loginSuccess()
        )
      ).toStrictEqual({
        initialized: true,
        newUser: false,
        loggedIn: true,
        loggingIn: false
      });
    });
  });

  describe('loginFailed', () => {
    it('sets error to the payload', () => {
      const state = { initialized: true, newUser: false, loggedIn: false, loggingIn: true };
      expect(slice.reducer(state, loginFailed('Foo bar'))).toStrictEqual({
        ...state,
        loggingIn: false,
        error: 'Foo bar'
      });
    });
  });

  describe('logout', () => {
    it('sets loggedIn and newUser to false, initialized to true', () => {
      expect(
        slice.reducer(
          { initialized: false, newUser: true, loggedIn: true, loggingIn: false },
          logout()
        )
      ).toStrictEqual({
        initialized: true,
        newUser: false,
        loggedIn: false,
        loggingIn: false
      });
    });
  });

  describe('createPassword', () => {
    it('sets logging in to true', () => {
      expect(
        slice.reducer(
          { initialized: true, newUser: true, loggedIn: false, loggingIn: false },
          createPassword()
        )
      ).toStrictEqual({
        initialized: true,
        newUser: true,
        loggedIn: false,
        loggingIn: true
      });
    });
  });

  describe('createPasswordSuccess', () => {
    it('sets newUser to false and loggedIn to true', () => {
      expect(
        slice.reducer(
          { initialized: true, newUser: true, loggedIn: false, loggingIn: true },
          createPasswordSuccess()
        )
      ).toStrictEqual({
        initialized: true,
        newUser: false,
        loggedIn: true,
        loggingIn: false
      });
    });

    it('clears the error', () => {
      expect(
        slice.reducer(
          { initialized: true, newUser: true, loggedIn: false, error: 'foo bar', loggingIn: true },
          createPasswordSuccess()
        )
      ).toStrictEqual({
        initialized: true,
        newUser: false,
        loggedIn: true,
        loggingIn: false,
        error: undefined
      });
    });
  });

  describe('createPasswordFailed', () => {
    it('sets error to the payload', () => {
      const state = { initialized: true, newUser: true, loggedIn: false, loggingIn: true };
      expect(slice.reducer(state, createPasswordFailed('Foo bar'))).toStrictEqual({
        ...state,
        loggingIn: false,
        error: 'Foo bar'
      });
    });
  });

  describe('reset', () => {
    it('sets new user', () => {
      const state = { initialized: true, newUser: false, loggedIn: false, loggingIn: false };
      expect(slice.reducer(state, reset())).toStrictEqual({
        ...state,
        newUser: true
      });
    });
  });
});
