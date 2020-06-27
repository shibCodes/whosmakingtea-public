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
    hideIntroText: boolean = false;
    pickPersonVisible: boolean = false;
    pickPersonDisabled: boolean = true;
    addVisible: boolean = false;
    addDisabled: boolean = false;
    showError: boolean = false;
    itemToDelete: ItemToDelete;
    showDeletePopup: boolean;
    noPeople: boolean = false;
    isLoading: boolean = true;
    hideSelection: boolean = true;
    selectedPerson: Participant;
    selectedPersonName: string;
    isPicking: boolean = false;

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
		this.inputElements.changes.subscribe((changes) => {
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

       // let updateTimeout = setTimeout(() => {

            console.log("update participant!");

            let participant = this.currentParticipants[personIndex];

            console.log(participant);

            if (participant != undefined) {
                this.firebaseService.updateParticipant(this.selectedList.id, participant);
            }

          //  clearTimeout(updateTimeout);

        //}, 1000);
        
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

    backToList() {

        this.hideSelection = true;
        this.hideList = false;
        this.hideIntroText = false;

        this.instructionMessage = instructionMessages.default;
    }

    pickParticipant() {
        
        // Set messaging
        this.instructionMessage = instructionMessages.picking;   
        this.hideList = true;
        this.hideIntroText = true;
        this.hideSelection = true;
        this.isLoading = true;   
        this.isPicking = true;
        
        // Calculate tea tally modifier per participant
        let participantsInRound = this.getParticipantsInRound();
        let teaTally = 0;
        participantsInRound.forEach((participant) => teaTally += participant.percentage_not_made);
        let modifier = 100 / teaTally;

        // Calculate the drink modifier
        participantsInRound.map((participant) => participant.percentage = participant.percentage_not_made*modifier );

        // Now sort
        participantsInRound.sort((participantA, participantB):number => { 
            if (participantA.percentage < participantB.percentage) return -1;
            if (participantA.percentage > participantB.percentage) return 1;
            return 0;
        });

        //- Find the graphPlot, which is 100 / (num participants - 1) (e.g 33)
        //- Plot out the graphArr using the graphPlot (let's say it's 33.33 with 4 participants) as thus [100, 66.6, 33.3, 0]
        //- The find the graphDiff, which is the sum of graphArr / 100 (e.g. 199.9 / 100 = 1.999)
        //- Then recalculate each new percentage for participants with:
        // newChange = (moddedPerc * graphDiff) + graphArr[i] / 2 / graphDiff
        // (where [i] is the value from graphArr that corresponds with this user's position in the original sorted drinks array.
        // Mod graph = (modPer * graphDiff) + 100 / 2 / graphDiff = result
        // (23*2.5) + 100 / 2 / 2.5 = 31.5

        var graphPlot = 100 / (participantsInRound.length - 1);
        var graphDiff = 0;

        for (let p = 0; p < participantsInRound.length; p++) {
            let graphArrayNum = 100 - (graphPlot * p);
            graphDiff = graphDiff + graphArrayNum;
        }

        graphDiff = graphDiff / 100;

        let randomMax = 0;

        for (let i = 0; i < participantsInRound.length; i++) { 
            let participantWeighter = graphPlot * i;
            let weightedPercentage = (participantsInRound[i].percentage + participantWeighter) / 2;
            randomMax = randomMax + weightedPercentage;
            participantsInRound[i].percentage = weightedPercentage;
        }

        var victim = null;
        var roulette = Math.ceil(Math.random() * randomMax);
        var pointer = 0;

        participantsInRound.forEach( (a) => {
            pointer = pointer + a.percentage;
            if (roulette <= pointer && victim == null && !a.last) {
                victim = a;
                this.selectedPerson = victim;
            }
        });

        ////////////////////////////////
        let pickerTimeout = setTimeout(() => {  
            this.showPickedParticipant(this.selectedPerson);
            clearTimeout(pickerTimeout);
        }, 1500);

    }

    teaMade() {

        console.log(this.selectedPerson);

        for (var i = 0; i < this.currentParticipants.length; i++) {

            this.currentParticipants[i].last = false;
            
            if (this.selectedPerson.id == this.currentParticipants[i].id) {
                this.currentParticipants[i].made++;
                this.currentParticipants[i].last = true;
            }

            if (this.currentParticipants[i].selected == true) {
                this.currentParticipants[i].drank++;
            }
        }

        this.selectedList.totalRuns = this.selectedList.totalRuns + 1;

        this.updateList();
        this.updateParticipants();

        this.hideSelection = true;
        this.hideList = false;
        this.hideIntroText = false;

        this.instructionMessage = instructionMessages.default;

    }

    private updateList() {

    }

    private updateParticipants() {
        
    }

    private showPickedParticipant(participant: Participant) {
        this.isLoading = false;
        this.hideSelection = false;
        this.hideIntroText = false;

        this.instructionMessage = instructionMessages.picked;

        this.selectedPersonName = participant.name;
    }

    private getParticipantsInRound() {

        let peopleInRound = [];

        for (var i = 0; i < this.currentParticipants.length; i++) {

            if (this.currentParticipants[i].selected) {

                var made = this.currentParticipants[i].made;
                var drank = this.currentParticipants[i].drank;
                var notMade = drank - made;

                if (drank == 0) {
                    this.currentParticipants[i].percentage_not_made = 100;
                }
                else {
                    this.currentParticipants[i].percentage_not_made = (notMade / drank) * 100;
                }

                peopleInRound.push(this.currentParticipants[i]);
            }

        }

        return peopleInRound;
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
