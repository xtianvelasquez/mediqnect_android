import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ProtectedGuard } from './protected.guard';

describe('ProtectedGuard', () => {
  let guard: ProtectedGuard;
  let routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProtectedGuard, { provide: Router, useValue: routerSpy }],
    });

    guard = TestBed.inject(ProtectedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if token exists', () => {
    localStorage.setItem('access_token', 'test_token');
    expect(guard.canActivate()).toBeTrue();
  });

  it('should deny access if no token exists', () => {
    localStorage.removeItem('access_token');
    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
