import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
    selector: 'sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SideNavComponent implements OnInit {
    username: string;

    constructor(private firebaseService: FirebaseService) { }

    ngOnInit(): void {

        this.firebaseService.getUserData().then((user) => {
            console.log(user);
            this.username = (user as any).displayName;
        });

    }

}
