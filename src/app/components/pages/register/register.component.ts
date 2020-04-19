import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
	selector: 'register-page',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})

export class RegisterComponent {
	@ViewChild("email") emailField: ElementRef;
	hideTagline: boolean = false;
	hideRegister: boolean = false;
	errorMessage: string;
	showError: boolean = false;
	user = {
		email: "",
		password: ""
	}
	confirmPassword = "";
	registerDisabled: boolean = true;
	passwordsMatch: boolean = false;

	constructor(
		private router: Router,
		private firebaseService: FirebaseService
	) { }

	ngAfterViewInit() {

		let focusTimeout = setTimeout(() => {
			this.emailField.nativeElement.focus();
			clearTimeout(focusTimeout);
		}, 300);

	}

	register() {

		this.showError = false;

		this.firebaseService.createNewUser(this.user)
			.then((res) => {
				console.log(res);
			})

		/*this.apiService.registerUser(this.user)
			.then(this.goToDashboard.bind(this));*/

	}

	cancel() {

		this.hideRegister = true;

		let pickerTimeout = setTimeout(() => {
			this.router.navigate(['/']);
		}, 1000);
	}

	checkButtonState() {

		let notFilledOut = false;

		let email = this.user.email;
		let password = this.user.password;
		let confirm = this.confirmPassword;

		this.passwordsMatch = (password == confirm && password != "");
		let fieldsEmpty = (email == "" || password == "" || confirm == "");

		(fieldsEmpty && !this.passwordsMatch || !this.passwordsMatch) ? notFilledOut = true : notFilledOut = false;

		(!notFilledOut) ? this.registerDisabled = false : this.registerDisabled = true;

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
			localStorage.setItem("username", this.user.email);
			this.router.navigate(['dashboard']);
		}

	}

}