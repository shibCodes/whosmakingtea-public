import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
    selector: 'app-lostpassword',
    templateUrl: './lostpassword.component.html',
    styleUrls: ['./lostpassword.component.scss']
})
export class LostPasswordComponent implements OnInit {
    lostPasswordForm: FormGroup;
	hideTagline: boolean = false;
	hideLogin: boolean = false;
	hideHeader: boolean = false;
    errorMessage: string;
    successMessage: string = "Yay! A password reset email has been sent! :)";
    showError: boolean = false;
    showSuccess: boolean = false;
	isLoading: boolean = false;

    constructor(private router: Router, private formBuilder: FormBuilder, private firebaseService: FirebaseService) { }

    ngOnInit(): void {
		this.lostPasswordForm = this.formBuilder.group({
			email: ['', [
				Validators.required,
				Validators.pattern("[^ @]*@[^ @]*")
			]]
		});
	}

    onHideTagline(hideTagline: boolean) {
		this.hideTagline = hideTagline;
    }
    
    formFocus(focussed: boolean) {
		this.hideHeader = focussed;
    }
    
    resetPassword() {
        if (this.lostPasswordForm.valid) {

            this.showError = false;
            this.showSuccess = false;
            this.isLoading = true;
            
            //this.loginForm.value.email,

            this.firebaseService.sendPasswordResetEmail(this.lostPasswordForm.value.email)
                .then((res) => {
                    this.isLoading = false;
                    this.showSuccess = true;
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
			this.router.navigate(['/login']);
			clearTimeout(pickerTimeout);
		}, 1000);

	}

}
