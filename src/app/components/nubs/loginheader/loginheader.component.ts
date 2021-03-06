import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
	selector: 'loginheader',
	templateUrl: './loginheader.component.html',
	styleUrls: ['./loginheader.component.scss']
})

export class LoginHeaderComponent implements OnInit {
	@Output() hidePage: EventEmitter<boolean> = new EventEmitter(false);
	@Input() fadeAway: boolean;
	currentUrl: string;

	constructor(
		private router: Router,
		private firebaseService: FirebaseService
	) { }

	ngOnInit() {
		this.currentUrl = this.router.url;
	}

	register() {

		(this.currentUrl == '/register') ? this.hidePage.emit(false) : this.hidePage.emit(true);

		let pickerTimeout = setTimeout(() => {
			this.router.navigate(['/register']);
			clearTimeout(pickerTimeout);
		}, 1000);

	}

	login() {

		(this.currentUrl == '/login') ? this.hidePage.emit(false) : this.hidePage.emit(true);

		let pickerTimeout = setTimeout(() => {
			this.router.navigate(['/login']);
			clearTimeout(pickerTimeout);
		}, 1000);
	}

}