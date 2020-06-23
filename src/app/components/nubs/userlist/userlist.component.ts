import { Component, OnInit, Output, EventEmitter, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { instructionMessages } from './instructionMessages';
import { errorMessages } from './errorMessages';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { List } from 'src/app/core/List';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Participant } from 'src/app/core/Participant';
import { ItemToDelete } from 'src/app/core/ItemToDelete';

@Component({
    selector: 'userlist',
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.scss']
})
export class UserListComponent implements OnInit {
    @ViewChildren('input') inputElements: QueryList<ElementRef>;
    @Output() showMenu: EventEmitter<boolean> = new EventEmitter();
    allListsSubscription: Subscription;
    selectedListSubscription: Subscription;
    menuOpen: boolean = false;
    instructionMessage: string = instructionMessages.default;
    errorMessage: string = undefined;
    noLists: boolean = true;
    selectedList: List;
    currentParticipants: Participant[];
    hideList: boolean = false;
    pickPersonVisible: boolean = false;
    pickPersonDisabled: boolean = true;
    addVisible: boolean = false;
    addDisabled: boolean = false;
    showError: boolean = false;
    itemToDelete: ItemToDelete;
    showDeletePopup: boolean;
    noPeople: boolean = false;
    isLoading: boolean = true;

    constructor(private dataService: DataService, private firebaseService: FirebaseService) { }

    ngOnInit(): void {

        this.allListsSubscription = this.dataService.allListsObservable.subscribe((allLists: List[]) => {
            this.updateAllLists(allLists);
        });

        this.selectedListSubscription = this.dataService.selectedListObservable.subscribe((selectedList: List) => {
            this.updateSelectedList(selectedList);
        });

    }

    ngAfterViewInit() {
		this.inputElements.changes.subscribe(() => {
			this.peopleArrayRendered();
		});
	}

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
        this.showMenu.emit(this.menuOpen);
    }

    calculateWidth(index) {
    
        var teasMade = this.currentParticipants[index].made;
        var totalRuns = this.selectedList.totalRuns

        var percentage = (teasMade / totalRuns) * 100;

        return percentage + '%';
        
    }

    togglePerson(personIndex: number) {

        this.currentParticipants[personIndex].selected = !this.currentParticipants[personIndex].selected;

        let numberSelected = 0;

        for (let i = 0; i < this.currentParticipants.length; i++) {
            
            if (this.currentParticipants[i].selected) {
                numberSelected = numberSelected + 1;
            }

        }

        (numberSelected < 2) ? this.pickPersonDisabled = true : this.pickPersonDisabled = false;

        this.updateParticipant(personIndex);

    }

    addParticipant() {

        // disable add button
        // create user obj to scope
        // send to server
        // once all g then push to selectedlist with pid

        this.showError = false;

        if (!this.addDisabled) {

            this.addDisabled = true;

            let newParticipant: Participant = {
                "name": "",
                "made": 0,
                "drank": 0,
                "selected": true,
                "id": this.generateParticipantID(),
                "last": false
            }

            this.currentParticipants.push(newParticipant);

            if (this.currentParticipants.length >= 2) {
                this.pickPersonDisabled = false;
                this.pickPersonVisible = true;
                this.noPeople = false;
                this.instructionMessage = instructionMessages.default;
            }
    
            this.firebaseService.addNewParticipant(this.selectedList.id, newParticipant)
                .then((participantRef) => {
                    this.handleNewParticipant(participantRef);
                })
                .catch(this.handleError);

        } 

    }

    updateParticipant(personIndex: number) {
        let participant = this.currentParticipants[personIndex];
        this.firebaseService.updateParticipant(this.selectedList.id, participant);
    }

    deleteParticipant(personIndex: number) {
        let participant = this.currentParticipants[personIndex];

        let itemToDelete: ItemToDelete = {
            id: participant.id,
            title: participant.name,
            type: "participant",
            participant: participant,
            listID: this.selectedList.id
        }

        this.itemToDelete = itemToDelete;

        this.showDeletePopup = true;

    }

    removeParticipant(participant: Participant) {

        console.log("remove participant!");

        this.showDeletePopup = false;

        for (var i = 0; i < this.currentParticipants.length; i++) {

            if (this.currentParticipants[i].id == participant.id) {
                this.currentParticipants.splice(i, 1);
                break;
            }

        }

        if (this.currentParticipants.length < 2) {
            this.pickPersonDisabled = true;
            this.pickPersonVisible = false;   
        }
        
        if (this.currentParticipants.length <= 0) {
            this.noPeople = true;
            this.instructionMessage = instructionMessages.emptyList;
        }

    }

    closePopup(event: boolean) {
        this.showDeletePopup = event;
    }

    private peopleArrayRendered() {
        if (this.currentParticipants.length === 1) {
			this.inputElements.first.nativeElement.focus();
		}
		else if (this.currentParticipants.length > 1) {
			this.inputElements.last.nativeElement.focus();
		}
    }

    private handleNewParticipant(participantRef: any) {

        let participantIndex = this.currentParticipants.length - 1;

        this.currentParticipants[participantIndex].id = participantRef.id;

        this.addDisabled = false;

    }

    private updateAllLists(lists: List[]) {

        if (lists != undefined) {
            if (lists.length <= 0) {
                this.noLists = true;
                this.instructionMessage = instructionMessages.noLists;
                this.isLoading = false;
            }
            else {
                this.noLists = false;
                this.instructionMessage = instructionMessages.default;
            }
        }
    
    }

    private updateSelectedList(list: List) {

        this.selectedList = list;

        if (list.id != undefined) {
            this.isLoading = true;
            this.firebaseService.getListParticipants(list.id)
                .then((allParticipants: Participant[]) => {
                    this.organiseParticipants(allParticipants);
                });
        }

    }

    private organiseParticipants(participants: Participant[]) {
        
        this.currentParticipants = participants;
        this.addVisible = true;
        
        if (this.currentParticipants.length <= 0) {
            this.instructionMessage = instructionMessages.emptyList;
            this.noPeople = true;
            this.pickPersonVisible = false;
        }
        else if (this.currentParticipants.length < 2) {
            this.instructionMessage = instructionMessages.default;
            this.pickPersonVisible = true;
            this.pickPersonDisabled = true;
            this.noPeople = false;
        }
        else if (this.currentParticipants.length >= 2) {
            this.instructionMessage = instructionMessages.default;
            this.pickPersonVisible = true;
            this.pickPersonDisabled = false;      
            this.noPeople = false;
        }

        this.isLoading = false;

    }

    private generateParticipantID(): number {

        let increment = (this.currentParticipants.length <= 0) ? 1 : (this.currentParticipants.length + 1);

        let participantID = increment;

        return participantID;

    }

    private handleError(error) {
        console.error(error);
    }

}
