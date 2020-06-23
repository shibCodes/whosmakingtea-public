import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ItemToDelete } from 'src/app/core/ItemToDelete';
import { List } from 'src/app/core/List';
import { Participant } from 'src/app/core/Participant';


@Component({
    selector: 'popup-new',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss']
})

export class PopupComponent {
    @Input() itemToDelete: ItemToDelete;
    @Input() showPopup: boolean;
    @Output() listDeletionComplete: EventEmitter<List> = new EventEmitter(false);
    @Output() participantDeletionComplete: EventEmitter<Participant> = new EventEmitter(false);
    @Output() closePopup: EventEmitter<boolean> = new EventEmitter(true);
    deleteStatus: string = "idle";
    backgroundFadeIn: boolean = false;
    makePopupVisible: boolean = false;
    disappear: boolean = true;

    constructor(private firebaseService: FirebaseService) {

    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.showPopup.currentValue == true) { 
            this.makePopupVisible = true;
            setTimeout(() => {
                this.backgroundFadeIn = true;
                this.disappear = false;
            }, 0);
            
        }
        else {
            this.backgroundFadeIn = false;
            this.disappear = true;
            setTimeout(() => {
                this.makePopupVisible = false;    
            }, 200);
        }

    }

    dismissPopup() {
        this.closePopup.emit(false);
    }

    deleteItem() {

        this.deleteStatus = 'processing';

        if (this.itemToDelete.type == "list") {         
            this.firebaseService.deleteList(this.itemToDelete.list)
                .then(() => {
                    this.listDeletionComplete.emit(this.itemToDelete.list);
                    this.deleteStatus = "idle";
                })
                .catch((error) => {
                    this.handleError(error);
                });
        }
        else {
            this.firebaseService.deleteParticipant(this.itemToDelete.listID, this.itemToDelete.participant)
                .then(() => {
                    console.log("yee");
                    this.participantDeletionComplete.emit(this.itemToDelete.participant);
                    this.deleteStatus = "idle";
                })
                .catch((error) => {
                    this.handleError(error);
                });
        }
    }

    private handleError(error) {

    }
}