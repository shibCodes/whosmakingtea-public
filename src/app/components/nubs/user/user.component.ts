import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    @ViewChild('usernameInput') usernameInput: ElementRef;
    @ViewChild('emailInput') emailInput: ElementRef;
    @ViewChild('currentPasswordInput') currentPasswordInput: ElementRef;
    @ViewChild('newPasswordInput') newPasswordInput: ElementRef;
    @Output() showMenu: EventEmitter<boolean> = new EventEmitter();
    profileVisibleSubscription: Subscription;
    infoMessage: string = "Here's your info! You can edit if you like! :)";
    editInfo: boolean = false;
    currentPassword: string;
    password: string;
    passwordConfirmed: boolean = false;
    username: string;
    email: string;
    newPassword: string;
    confirmNewPassword: string;
    existingEmail: string;
    usernameDisabled: boolean = true;
    savingUsername: boolean = false;
    emailDisabled: boolean = true;
    savingEmail: boolean = false;
    newPasswordDisabled: boolean = true;
    savingPassword: boolean = false;
    savingCurrentPassword: boolean = false;
    errorMessage: string;
    showError: boolean = false;
    successMessage: string;
    showSuccess: boolean = false;
    editingPassword: boolean = false;
    menuOpen: boolean = false;

    constructor(private firebaseService: FirebaseService, private dataService: DataService) { }

    ngOnInit(): void {
        this.firebaseService.getUserData().then((user) => {
            this.username = (user as any).displayName;
            this.email = (user as any).email;
            this.existingEmail = (user as any).email;
        });

        this.profileVisibleSubscription = this.dataService.profileVisibleObservable.subscribe((visible: boolean) => {
            if (!visible) {
                this.resetProfile();
            }
            else {
                this.menuOpen = false;
                this.showMenu.emit(this.menuOpen);
            }
        });
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
        this.showMenu.emit(this.menuOpen);
    }

    toggleEditInfo(visible: boolean) {
        this.editInfo = visible;

        if (visible) {
            this.infoMessage = "Enter your password to edit your info!";
            /*setTimeout(() => {
                this.currentPasswordInput.nativeElement.focus();
            }, 0);*/
        }
        else {
            this.infoMessage = "Here's your info! You can edit if you like! :)";
        }

        
    }

    saveCurrentPassword() {

        this.showError = false;
        this.savingCurrentPassword = true;

        this.firebaseService.reauthenticateUser(this.email, this.currentPassword)
            .then((res) => {
                this.savingCurrentPassword = false;
                this.passwordConfirmed = true;
                this.infoMessage = "Here's your info! You can edit if you like! :)";
                this.successMessage = "Woo! Password confirmed! You can now edit your info! :)";
                this.showSuccess = true;
            })
            .catch((error) => {
                this.savingCurrentPassword = false;
                this.handleError(error);
            });
    }

    editUsername() {
        this.usernameDisabled = false;
        this.showSuccess = false;
        setTimeout(() => {
            this.usernameInput.nativeElement.focus();
        }, 0);
    }

    saveUsername() {
        this.showError = false;
        this.savingUsername = true;
        this.firebaseService.updateDisplayName(this.username)
            .then((res) => {
                this.usernameDisabled = true;
                this.savingUsername = false;
                this.successMessage = "Yay! Username successfully updated! :)";
                this.showSuccess = true;
                this.dataService.updateUsernameUpdated(true);
            })
            .catch((error) => {
                this.savingUsername = false;
                this.handleError(error);
            });
    }

    editEmail() {
        this.emailDisabled = false;
        this.showSuccess = false;
        setTimeout(() => {
            this.emailInput.nativeElement.focus();
        }, 0);
    }

    saveEmail() {
        this.showError = false;
        this.savingEmail = true;
        this.firebaseService.updateEmail(this.email)
            .then(() => {
                this.emailDisabled = true;
                this.savingEmail = false;
                this.successMessage = "Yay! Email successfully updated! :)";
                this.showSuccess = true;
            })
            .catch((error) => {
                this.savingEmail = false;
                this.handleError(error);
            });
    }
    
    changePassword() {
        this.editingPassword = true;
        this.newPasswordDisabled = false;
        this.showSuccess = false;
        setTimeout(() => {
            this.newPasswordInput.nativeElement.focus();
        }, 0);
    }

    savePassword() {

        if (this.newPassword != this.confirmNewPassword) {
            let error = {
                message: "Passwords must match!"
            }
            this.handleError(error);
        }
        else {
            this.showError = false;
            this.savingPassword = true;
            this.firebaseService.updatePassword(this.newPassword)
                .then(() => {
                    this.newPasswordDisabled = true;
                    this.savingPassword = false;
                    this.newPasswordDisabled = true;
                    this.editingPassword = false;
                    this.newPassword = "";
                    this.confirmNewPassword = "";
                    this.successMessage = "Yay! Password successfully updated! :)";
                    this.showSuccess = true;
                })
                .catch((error) => {
                    this.savingPassword = false;
                    this.handleError(error);
                })
        }

        
    }

    private handleError(error) {
        this.errorMessage = error.message;
        this.showError = true;
    }

    private resetProfile() {
        this.infoMessage = "Here's your info! You can edit if you like! :)";
        this.editInfo = false;
        this.currentPassword = "";
        this.password = "";
        this.passwordConfirmed = false;  
        this.newPassword = "";
        this.confirmNewPassword = ""
        this.usernameDisabled = true;
        this.savingUsername = false;
        this.emailDisabled = true;
        this.savingEmail = false;
        this.newPasswordDisabled = true;
        this.savingPassword = false;
        this.savingCurrentPassword = false;
        this.showError = false;
        this.showSuccess = false;
        this.editingPassword = false;
    }
}
