import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';



import { AppComponent } from './app.component';

import { FirebaseService } from './services/firebase.service';
import { PopupService } from './services/popup.service';


@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule
	],
	providers: [
		FirebaseService,
		PopupService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
