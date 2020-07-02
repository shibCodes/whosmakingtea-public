import { NgModule } from '@angular/core';
import { PreloadAllModules, Routes, RouterModule } from '@angular/router';

import { HomeModule } from './components/pages/home/home.module';
import { LoginModule } from './components/pages/login/login.module';
import { RegisterModule } from './components/pages/register/register.module';
import { LostPasswordModule } from './components/pages/lostpassword/lostpassword.module';
import { DashboardModule } from './components/pages/dashboard/dashboard.module';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';


const routes: Routes = [
	{ path: '', loadChildren: () => HomeModule },
	{ path: 'login', loadChildren: () => LoginModule },
	{ path: 'register', loadChildren: () => RegisterModule },
	{ path: 'forgotpassword', loadChildren: () => LostPasswordModule },
	{ path: 'dashboard', loadChildren: () => DashboardModule, canActivate: [AuthGuard]}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
	exports: [RouterModule]
})
export class AppRoutingModule { }