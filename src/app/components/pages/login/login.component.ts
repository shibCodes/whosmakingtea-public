import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
	selector: 'login-page',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})

export class LoginComponent {
	@ViewChild("email") emailField: ElementRef;
	hideTagline: boolean = false;
	hideLogin: boolean = false;
	loginDisabled: boolean = true;
	errorMessage: string;
	showError: boolean = false;
	user = {
		email: "",
		password: ""
	}

	constructor(
		private router: Router,
		private firebaseService: FirebaseService
	) { }

	ngAfterViewInit() {

		let focusTimeout = setTimeout(() =>{
			this.emailField.nativeElement.focus();
			clearTimeout(focusTimeout);
		}, 300);

	}

	login() {

		this.showError = false;

		this.firebaseService.loginUser(this.user)
			.then((res) => {
				console.log(res);
			});

		/*this.apiService.loginUser(this.user)
			.then(this.goToDashboard.bind(this));*/

	}

	cancel() {

		this.hideLogin = true;

		let pickerTimeout = setTimeout(() => {
			this.router.navigate(['/']);
			clearTimeout(pickerTimeout);
		}, 1000);

	}

	checkButtonState() {

		let notFilledOut = false;

		let username = this.user.email;
		let password = this.user.password;

		(username == "" || password == "") ? notFilledOut = true : notFilledOut = false;

		(!notFilledOut) ? this.loginDisabled = false : this.loginDisabled = true;

	}

	onHideTagline(hideTagline) {
		this.hideTagline = hideTagline;
	}

	private goToDashboard(res) {

		let error = res.error;

		if (error != undefined) {
			this.showError = true;
			this.errorMessage = res.reasons[0];
		}
		else {
			//this.apiService.setAuthToken(res.auth_token);
			// local storage set item in promise
			// .then(go to dashboard)
			localStorage.setItem("username", this.user.email);
			this.router.navigate(['dashboard']);
		}

	}

}