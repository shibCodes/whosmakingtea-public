import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'login-page',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
	@ViewChild("email") emailField: ElementRef;
	loginForm: FormGroup
	hideTagline: boolean = false;
	hideLogin: boolean = false;
	errorMessage: string;
	showError: boolean = false;

	constructor(
		private router: Router,
		private firebaseService: FirebaseService,
		private formBuilder: FormBuilder
	) { }

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			email: ['', [
				Validators.required,
				Validators.pattern("[^ @]*@[^ @]*")
			]],
			password: ['', [
				Validators.required,
				Validators.minLength(4)
			]]
		});
	}

	ngAfterViewInit() {

		let focusTimeout = setTimeout(() =>{
			this.emailField.nativeElement.focus();
			clearTimeout(focusTimeout);
		}, 300);

	}

	login() {

		if (this.loginForm.valid) {

			this.showError = false;

			let user = {
				email: this.loginForm.value.email,
				password: this.loginForm.value.password
			}
	
			this.firebaseService.loginUser(user)
				.then((res) => {
					console.log(res);
				});

		}

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
			//localStorage.setItem("username", this.user.email);
			this.router.navigate(['dashboard']);
		}

	}

}