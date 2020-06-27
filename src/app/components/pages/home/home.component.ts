import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PickerComponent } from '../../nubs/picker/picker.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ThreeService } from 'src/app/services/three.service';

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
		private threeService: ThreeService
	) { }

    ngAfterViewInit() {
       this.threeService.init();
	}
	
	onHideTagline(hideTagline) {
		this.hideTagline = hideTagline;
	}

	onHidePage(hidePage) {
		this.hidePage = hidePage;
	}


}