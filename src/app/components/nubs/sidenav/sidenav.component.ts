import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { List } from 'src/app/core/List';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/services/popup.service';
import { Subscription } from 'rxjs';
import { isNgTemplate } from '@angular/compiler';

@Component({
    selector: 'sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SideNavComponent implements OnInit {
    @ViewChildren('sidebarlists') sidebarLists: QueryList<ElementRef>;
    deleteListSubscription: Subscription;
    username: string;
    showAddNewList: boolean = false;
    addListLoading: boolean = false;
    editListLoading: boolean = false;
    listLimitReached: boolean = false;
    listName: string;
    currentListName: string;
    allLists: List[] = [];

    constructor(private firebaseService: FirebaseService, private router: Router, private popupService: PopupService) { }

    ngOnInit(): void {

        this.deleteListSubscription = this.popupService.deleteListObservable.subscribe((deletedList) => {
            console.log(deletedList);
            if (this.allLists.length > 0) {
                this.removeList(deletedList);
            }
        });

        this.firebaseService.getUserData().then((user) => {

            this.username = (user as any).displayName;

            this.firebaseService.getAllLists()
                .then(this.organiseAllLists.bind(this))
                .catch(this.handleError.bind(this));

        });

    }

    organiseAllLists(lists: List[]) {
        this.allLists = lists;

        if (this.allLists.length >= 5) {
            this.listLimitReached = true;
        }

    }

    toggleAddNewList(show: boolean) {
        this.showAddNewList = show;

        if (!show) {
            this.listName = undefined;
        }

    }

    toggleListOptions(listIndex: number) {

        this.allLists[listIndex].showMore = !this.allLists[listIndex].showMore;

        if (this.allLists[listIndex].showEdit) {
            this.allLists[listIndex].name = this.currentListName;
            this.allLists[listIndex].showEdit = false;
        }
        
    }

    editListName(listIndex: number) {

        this.currentListName = this.allLists[listIndex].name;

        this.allLists[listIndex].showEdit = !this.allLists[listIndex].showEdit;

        let updateNameTimeout = setTimeout(() => {  
            this.sidebarLists.toArray()[listIndex].nativeElement.children[1].focus();
            clearTimeout(updateNameTimeout);
        }, 0);

    }

    saveListName(listIndex: number) {    

        this.editListLoading = true;

        this.firebaseService.updateList(this.allLists[listIndex])
            .then(() => {
                this.allLists[listIndex].showEdit = false;
                this.allLists[listIndex].showMore = !this.allLists[listIndex].showMore;
                this.editListLoading = false;
            })
            .catch((error) => {
                console.error(error);
                this.editListLoading = false;
                this.toggleListOptions(listIndex);
            });

    }

    saveNewList() {

        this.addListLoading = true;

        let generatedID = this.generateListID();

        let newListObj: List = {
            name: this.listName,
            totalRuns: 0,
            selected: false,
            active: true
        }

        this.firebaseService.addNewList(newListObj, generatedID)
            .then((listObj: List) => {
                console.log(listObj);
                this.addListLoading = false;
                this.allLists.push(listObj);
                this.toggleAddNewList(false);
                if (this.allLists.length >= 5) {
                    this.listLimitReached = true;
                }
                this.setSelectedList((this.allLists.length - 1));
            })
            .catch(this.handleError);

    }

    setSelectedList(listIndex: number) {

        this.deselectAllSelected();
        this.allLists[listIndex].selected = true;
        localStorage.setItem("selectedListID", this.allLists[listIndex].id);

    }

    deleteList(listIndex: number) {

        let list = this.allLists[listIndex];

        let popup = {
            "type": "list",
            "show": true,
            "item": list
        }

        this.popupService.updateShowPopup(popup);

    }

    

    logout() {
        this.firebaseService.logoutUser().then(() => {
            this.router.navigateByUrl('');
        })
    }

    handleError(error: any) {
        this.addListLoading = false;
        console.error(error);
    }

    private deselectAllSelected() {

        for (let i = 0; i < this.allLists.length; i++) {
            this.allLists[i].showMore = false;
            this.allLists[i].showEdit = false;
            this.allLists[i].selected = false;
        }

    }

    private generateListID(): string {

        let increment = (this.allLists.length <= 0) ? 1 : (this.allLists.length + 1);

        let listID = "list" + increment;

        return listID;

    }

    private removeList(list: List) {

        for (var i = 0; i < this.allLists.length; i++) {

            if (this.allLists[i].id == list.id) {
                this.allLists.splice(i, 1);
                break;
            }

        }

        this.popupService.updateDeleteStatus('done');

        this.setSelectedList(0);

        if (this.allLists.length < 5) {
            this.listLimitReached = false;
        }

    }

}
