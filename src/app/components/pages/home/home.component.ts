import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PickerComponent } from '../../nubs/picker/picker.component';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
	selector: 'home-page',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})

export class HomeComponent implements AfterViewInit {
	@ViewChild(PickerComponent) picker: PickerComponent;
	hideTagline: boolean = false;
	hidePage: boolean = false;

	constructor(
		private router: Router,
		private firebaseService: FirebaseService
	) { }

    ngAfterViewInit() {
		console.log("yeee");
       	console.log(this.picker);
       	this.firebaseService.checkAuthState();   

	}
	
	onHideTagline(hideTagline) {
		this.hideTagline = hideTagline;
	}

	onHidePage(hidePage) {
		this.hidePage = hidePage;
	}


}