import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';



import { AppComponent } from './app.component';

import { FirebaseService } from './services/firebase.service';
import { DataService } from './services/data.service';
import { ThreeService } from './services/three.service';


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
		DataService,
		ThreeService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
