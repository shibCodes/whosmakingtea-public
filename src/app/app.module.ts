import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { IconsModule } from './icons/icons.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { PickerComponent } from './components/nubs/picker/picker.component';
import { LoadyspinComponent } from './components/nubs/loadyspin/loadyspin.component';
import { LoginHeaderComponent } from './components/nubs/loginheader/loginheader.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';

import { FirebaseService } from './services/firebase.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	suppressScrollX: true
};

@NgModule({
	declarations: [
		AppComponent,
		PickerComponent,
		HomeComponent,
		LoadyspinComponent,
		LoginHeaderComponent,
		LoginComponent,
		RegisterComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		IconsModule,
		PerfectScrollbarModule,
		FormsModule
	],
	providers: [
		FirebaseService,
		{
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
