import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { WMTUser } from 'src/app/core/WMTUser';

@Component({
	selector: 'register-page',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
	registerForm: FormGroup;
	hideTagline: boolean = false;
	hideRegister: boolean = false;
	hideHeader: boolean = false;
	isLoading: boolean = false;
	errorMessage: string;
	showError: boolean = false;

	constructor(
		private router: Router,
		private firebaseService: FirebaseService
	) { }

	ngOnInit() {		
		this.registerForm = new FormGroup({
			email: new FormControl('', [
				Validators.required,
				Validators.pattern("[^ @]*@[^ @]*")
			]),
			password: new FormControl('', [
				Validators.required, 
				Validators.minLength(4)
			]),
			passwordConfirm: new FormControl('', [
				Validators.minLength(4)
			]),
		  }, this.passwordMatchValidator);
	}

	passwordMatchValidator(g: FormGroup) {
		return g.get('password').value === g.get('passwordConfirm').value
		   ? null : {'mismatch': true};
	 }

	register() {

		if (this.registerForm.valid) {

			this.showError = false;
			this.isLoading = true;

			let user:WMTUser = {
				email: this.registerForm.value.email,
				password: this.registerForm.value.password
			}
	
			this.firebaseService.createNewUser(user)
				.then((res) => {
					console.log(res);
					this.isLoading = false;
					this.goToDashboard();
				})
				.catch((error) => {
					this.isLoading = false;
					this.showError = true;
					this.errorMessage = error.message;
				});

		}

	}

	cancel() {

		this.hideRegister = true;

		let pickerTimeout = setTimeout(() => {
			this.router.navigate(['/']);
			clearTimeout(pickerTimeout);
		}, 1000);
		
	}

	formFocus(focussed: boolean) {
		this.hideHeader = focussed;
	}

	onHideTagline(hideTagline) {
		this.hideTagline = hideTagline;
	}

	private goToDashboard() {
		//localStorage.setItem("username", this.user.email);
		this.router.navigate(['dashboard']);
	}

}