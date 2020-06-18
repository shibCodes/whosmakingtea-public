import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'userlist',
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.scss']
})
export class UserListComponent implements OnInit {
    @Output() showMenu: EventEmitter<boolean> = new EventEmitter();
    menuOpen: boolean = false;

    constructor() { }

    ngOnInit(): void {
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
        this.showMenu.emit(this.menuOpen);
    }

}
