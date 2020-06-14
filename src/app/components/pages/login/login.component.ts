import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WMTUser } from 'src/app/core/WMTUser';

@Component({
	selector: 'login-page',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	hideTagline: boolean = false;
	hideLogin: boolean = false;
	hideHeader: boolean = false;
	errorMessage: string;
	showError: boolean = false;
	isLoading: boolean = false;

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

	login() {

		if (this.loginForm.valid) {

			this.showError = false;
			this.isLoading = true;

			let user:WMTUser = {
				name: "",
				email: this.loginForm.value.email,
				password: this.loginForm.value.password
			}
	
			this.firebaseService.loginUser(user)
				.then((res) => {
					this.isLoading = false;
					this.goToDashboard();
				})
				.catch((error) => {
					this.isLoading = false;
					this.errorMessage = error.message;
					this.showError = true;
				});

		}

	}

	cancel() {

		this.hideLogin = true;

		let pickerTimeout = setTimeout(() => {
			this.router.navigate(['/']);
			clearTimeout(pickerTimeout);
		}, 1000);

	}


	onHideTagline(hideTagline: boolean) {
		this.hideTagline = hideTagline;
	}

	formFocus(focussed: boolean) {
		this.hideHeader = focussed;
	}

	private goToDashboard() {
		this.router.navigate(['dashboard']);
	}

}