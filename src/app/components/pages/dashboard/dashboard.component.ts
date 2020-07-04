import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    openMenu: boolean = false;
    showProfile: boolean = false;

    constructor() { }

    ngOnInit(): void {
    }

    toggleMenu(event: boolean) {
        this.openMenu = event;
    }

    toggleProfile(event: boolean) {
        this.showProfile = event;
    }

}
