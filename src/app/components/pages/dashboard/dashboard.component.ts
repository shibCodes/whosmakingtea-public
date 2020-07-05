import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    openMenu: boolean = false;
    showProfile: boolean = false;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
    }

    toggleMenu(event: boolean) {
        this.openMenu = event;
    }

    toggleProfile(event: boolean) {
        this.showProfile = event;
        if (!this.showProfile) {
            this.dataService.updateProfileVisible(false);
        }
    }

}
