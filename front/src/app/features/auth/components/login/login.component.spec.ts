import { expect } from '@jest/globals';
import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';

describe('LoginComponent unit test', () => {
  let component: LoginComponent;
  let authService : any;
  let sessionService : any;
  let fb: any;
  let router: any
  let form : any;

  beforeEach( () => {
    authService = {login : jest.fn()}
    sessionService = {logIn : jest.fn()}
    fb = { group : jest.fn() }
    form = jest.fn();
    router = jest.fn();
    component = new LoginComponent(authService, fb, router, sessionService)
  })

  afterEach(() => {jest.restoreAllMocks();});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should throw an error when we call submit function', () => {
    component.form = form;
    const error = new Error('Error login test');
    jest.spyOn(authService, 'login').mockReturnValue(throwError(() => error));
    component.submit();
    expect(authService.login).toHaveBeenCalled();
    expect(component.onError).toBeTruthy();
  });

  it('should valid submit function', () => {
    component.form = form;
    const res = "test successful";
    jest.spyOn(authService, 'login').mockReturnValue(of(res));
    component.submit();
    expect(authService.login).toHaveBeenCalled();
    expect(component.onError).toBeFalsy();
  });
});
