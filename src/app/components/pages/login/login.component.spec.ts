import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';

describe('LoginComponent', () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule, ReactiveFormsModule, FormsModule],
			declarations: [LoginComponent],
			providers: [ FirebaseService ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.ngOnInit();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('form should be invalid when empty', () => {
		expect(component.loginForm.valid).toBeFalsy();
	});
	
	it('email field should be initially invalid', () => {
		let email = component.loginForm.controls['email'];
		expect(email.valid).toBeFalsy();
	});
	
	it('email required validator should ping when field is empty', () => {
		let email = component.loginForm.controls['email'];
		let errors = email.errors || {};
		expect(errors['required']).toBeTruthy();
	});
	
	it('email required validator should not ping when field is filled', () => {
		let email = component.loginForm.controls['email'];
		email.setValue("test");
		let errors = email.errors || {};
		expect(errors['required']).toBeFalsy();
	});
	
	it('email pattern validator should ping when pattern is wrong', () => {
		let email = component.loginForm.controls['email'];
		email.setValue("shib");
		let errors = email.errors || {};
		expect(errors['pattern']).toBeTruthy();
	});
	
	it('email pattern validator should not ping when pattern is correct', () => {
		let email = component.loginForm.controls['email'];
		email.setValue("shib@shib.com");
		let errors = email.errors || {};
		expect(errors['pattern']).toBeFalsy();
	});
	
	it('password field should be initially invalid', () => {
		let password = component.loginForm.controls['password'];
		expect(password.valid).toBeFalsy();
	});
	
	it('password required validator should ping when field is empty', () => {
		let password = component.loginForm.controls['password'];
		let errors = password.errors || {};
		expect(errors['required']).toBeTruthy();
	});
	
	it('password required validator should not ping when field is filled', () => {
		let password = component.loginForm.controls['password'];
		password.setValue("test");
		let errors = password.errors || {};
		expect(errors['required']).toBeFalsy() 
	});

	it('password minlength validator should ping when pw is too short', () => {
		let password = component.loginForm.controls['password'];
		password.setValue("t");
		let errors = password.errors || {};
		expect(errors['minlength']).toBeDefined();
	});

	it('password minlength validator should not ping when field is correct length', () => {
		let password = component.loginForm.controls['password'];
		password.setValue("test");
		let errors = password.errors || {};
		expect(errors['minlength']).toBeUndefined();
	});

	it('on login submit isLoading should be true', () => {
		let email = component.loginForm.controls['email'];
		let password = component.loginForm.controls['password'];
		email.setValue("test@test.com");
		password.setValue("test");
		component.login();
		expect(component.isLoading).toBeTruthy();
	});

});
