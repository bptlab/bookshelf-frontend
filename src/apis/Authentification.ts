import Response from '@/interfaces/authentification/Response';

export default class Authentification {
  public static login(username: string, password: string, cb: (loggedIn: boolean) => void) {
    cb = arguments[arguments.length - 1];
    if (localStorage.token) {
      if (cb) { cb(true); }
      this.onChange(true);
      return;
    }
    pretendRequest(username, password, (res: any) => {
      if (res.authenticated) {
        localStorage.token = res.token;
        if (cb) { cb(true); }
        this.onChange(true);
      } else {
        if (cb) { cb(false); }
        this.onChange(false);
      }
    });
  }

  public static getToken() {
    return localStorage.token;
  }

  public static logout() {
    delete localStorage.token;
    this.onChange(false);
  }

  public static loggedIn(): boolean {
    return !!localStorage.token;
  }

  public static onChange( loggedIn: boolean ) {
    return;
  }
}

function pretendRequest(username: string, password: string, cb: (response: Response) => void) {
  setTimeout(() => {
    if (username === 'admin' && password === 'admin') {
      cb({
        authenticated: true,
        token: Math.random().toString(36).substring(7),
      });
    } else {
      cb({ authenticated: false });
    }
  }, 0);
}
