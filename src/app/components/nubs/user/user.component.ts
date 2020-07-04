import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { DataService } from 'src/app/services/data.service';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    @ViewChild('usernameInput') usernameInput: ElementRef;
    username: string;
    usernameDisabled: boolean = true;
    savingUsername: boolean = false;

    constructor(private firebaseService: FirebaseService, private dataService: DataService) { }

    ngOnInit(): void {
        this.firebaseService.getUserData().then((user) => {
            this.username = (user as any).displayName;
        });
    }

    editUsername() {
        this.usernameDisabled = false;
        setTimeout(() => {
            this.usernameInput.nativeElement.focus();
        }, 0);
    }

    saveUsername() {
        this.savingUsername = true;
        this.firebaseService.updateDisplayName(this.username)
            .then((res) => {
                this.usernameDisabled = true;
                this.savingUsername = false;
                this.dataService.updateUsernameUpdated(true);
            })
            .catch((error) => {
                this.savingUsername = false;
                this.handleError(error);
            });
    }

    private handleError(error) {
        console.log(error);
    }
}
