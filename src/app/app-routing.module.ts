import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProtectedGuard } from './guards/protected.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./signup/signup.module').then((m) => m.SignupPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [ProtectedGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [ProtectedGuard],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
