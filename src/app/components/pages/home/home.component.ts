import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PickerComponent } from '../../nubs/picker/picker.component';
//import { LoginHeaderComponent } from '../../nubs/loginheader/loginheader.component';
//import { APIService } from '../../../services/api.service';

@Component({
	selector: 'home-page',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})

export class HomeComponent implements AfterViewInit {
	@ViewChild(PickerComponent) picker: PickerComponent;
	//@ViewChild(LoginHeaderComponent) loginheader: LoginHeaderComponent;
	hideTagline: boolean = false;
	hidePage: boolean = false;

	constructor(
		private router: Router,
		//private apiService: APIService
	) { }

    ngAfterViewInit() {
		console.log("yeee");
       	console.log(this.picker);
       // this.apiService.checkAuthToken();      

	}
	
	onHideTagline(hideTagline) {
		this.hideTagline = hideTagline;
	}

	onHidePage(hidePage) {
		this.hidePage = hidePage;
	}


}