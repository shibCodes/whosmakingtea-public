import { NgModule } from '@angular/core';
import { PreloadAllModules, Routes, RouterModule } from '@angular/router';

import { HomeModule } from './components/pages/home/home.module';
import { LoginModule } from './components/pages/login/login.module';
import { RegisterModule } from './components/pages/register/register.module';

const routes: Routes = [
	{ path: '', loadChildren: () => HomeModule },
	{ path: 'login', loadChildren: () => LoginModule },
	{ path: 'register', loadChildren: () => RegisterModule },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
	exports: [RouterModule]
})
export class AppRoutingModule { }