import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, { provide: Router, useValue: routerSpy }],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should deny access if token exists (redirect to dashboard)', () => {
    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs']); // Redirect authenticated users
  });

  it('should allow access if no token exists', () => {
    expect(guard.canActivate()).toBeTrue();
  });
});
