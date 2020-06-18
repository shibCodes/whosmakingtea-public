import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { DeclareFunctionStmt } from '../../../../../node_modules/@angular/compiler';
import { log } from 'util';
import { PopupService } from '../../../services/popup.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SideNavComponent } from '../sidenav/sidenav.component';

@Component({
    selector: 'popup-new',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss']
})

export class PopupComponent implements OnInit {
    showPopupSubscription: Subscription;
    deleteStatusSubscription: Subscription;
    deleteListLine1: string = "Are you sure you want to delete the list ";
    deleteUserLine1: string = "Are you sure you want to delete the user ";
    deleteListLine2: string = "If you hit delete there's no way back! It's gone for good! No take-backsies!";
    deleteUserLine2: string = "If you hit delete there's no way back! They're gone for good! No take-backsies!";
    textLine1: string = undefined;
    textLine2: string = undefined;
    itemName: string = undefined;
    selectedList = undefined;
    showPopup: boolean = false;
    popupType: string = "list";
    popupItem: any = {};
    deleteStatus: string = "idle";

    username: string;

    constructor(
        private firebaseService: FirebaseService,
        private popupService: PopupService
    ) { }


    ngOnInit() {

        console.log("popup yea!");

        this.textLine1 = this.deleteListLine1;
        this.textLine2 = this.deleteListLine2;
        this.username = localStorage.getItem("username");

        this.showPopupSubscription = this.popupService.showPopupObservable.subscribe(
            showPopup => this.updatePopup(showPopup));

        this.deleteStatusSubscription = this.popupService.deleteStatusObservable.subscribe(
            deleteStatus => this.updateDeleteStatus(deleteStatus));

    }

    updatePopup(popup) {

        console.log("update popup");
        console.log(popup);

        this.popupType = popup.type;
        this.popupItem = popup.item;

        if (this.popupType == "list") {
            this.textLine1 = this.deleteListLine1;
            this.textLine2 = this.deleteListLine2;
            this.itemName = popup.item.name;
        }
        else {
            this.textLine1 = this.deleteUserLine1;
            this.textLine2 = this.deleteUserLine2;
            this.itemName = popup.name;
        }

        this.showPopup = popup.show;

    }

    updateDeleteStatus(status) {
        this.deleteStatus = status;
    }

    closePopup() {
        this.showPopup = false;
    }

    delete() {

        this.popupService.updateDeleteStatus('processing');

        if (this.popupType == "list") {         
            this.firebaseService.deleteList(this.popupItem)
                .then(() => {
                    this.popupService.updateDeleteList(this.popupItem);
                    this.resetPopup();
                });
        }
        else {
            //this.popupService.updateDeleteUser(this.popupItem);
        }

    }

    resetPopup() {

        this.closePopup();
        this.deleteStatus = 'idle';
        this.popupType = undefined;

    }
}