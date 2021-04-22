import slice, {
  createPasswordFailed,
  createPasswordSuccess,
  loginFailed,
  loginSuccess,
  logout,
  reset,
  setLoggedIn,
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
      expect(slice.reducer({ newUser: false, loggedIn: false }, setNewUser(true))).toStrictEqual({
        newUser: true,
        loggedIn: false
      });

      expect(slice.reducer({ newUser: true, loggedIn: false }, setNewUser(false))).toStrictEqual({
        newUser: false,
        loggedIn: false
      });
    });
  });

  describe('setLoggedIn', () => {
    it('sets loggedIn to the payload', () => {
      expect(slice.reducer({ newUser: false, loggedIn: false }, setLoggedIn(true))).toStrictEqual({
        newUser: false,
        loggedIn: true
      });

      expect(slice.reducer({ newUser: false, loggedIn: true }, setLoggedIn(false))).toStrictEqual({
        newUser: false,
        loggedIn: false
      });
    });
  });

  describe('loginSuccess', () => {
    it('sets loggedIn to true', () => {
      expect(slice.reducer({ newUser: false, loggedIn: false }, loginSuccess())).toStrictEqual({
        newUser: false,
        loggedIn: true,
        error: undefined
      });
    });
  });

  describe('loginFailed', () => {
    it('sets error to the payload', () => {
      const state = { newUser: false, loggedIn: false };
      expect(slice.reducer(state, loginFailed('Foo bar'))).toStrictEqual({
        ...state,
        error: 'Foo bar'
      });
    });
  });

  describe('logout', () => {
    it('sets loggedIn and newUser to false', () => {
      expect(slice.reducer({ newUser: true, loggedIn: true }, logout())).toStrictEqual({
        newUser: false,
        loggedIn: false
      });
    });
  });

  describe('createPasswordSuccess', () => {
    it('sets newUser to false and loggedIn to true', () => {
      expect(
        slice.reducer({ newUser: true, loggedIn: false }, createPasswordSuccess())
      ).toStrictEqual({
        newUser: false,
        loggedIn: true,
        error: undefined
      });
    });

    it('clears the error', () => {
      expect(
        slice.reducer({ newUser: true, loggedIn: false, error: 'foo bar' }, createPasswordSuccess())
      ).toStrictEqual({
        newUser: false,
        loggedIn: true,
        error: undefined
      });
    });
  });

  describe('createPasswordFailed', () => {
    it('sets error to the payload', () => {
      const state = { newUser: true, loggedIn: false };
      expect(slice.reducer(state, createPasswordFailed('Foo bar'))).toStrictEqual({
        ...state,
        error: 'Foo bar'
      });
    });
  });

  describe('reset', () => {
    it('sets new user', () => {
      const state = { newUser: false, loggedIn: false };
      expect(slice.reducer(state, reset())).toStrictEqual({
        ...state,
        newUser: true
      });
    });
  });
});
