import { Injectable } from '@angular/core';
import { List } from '../core/List';
import { Participant } from '../core/Participant';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {
    private allLists = new BehaviorSubject<List[]>(undefined);
    allListsObservable = this.allLists.asObservable();

    private selectedList = new BehaviorSubject<any>({});
    selectedListObservable = this.selectedList.asObservable();

    private usernameUpdated = new BehaviorSubject<boolean>(false);
    usernameUpdatedObservable = this.usernameUpdated.asObservable();

    private profileVisible = new BehaviorSubject<boolean>(false);
    profileVisibleObservable = this.profileVisible.asObservable();

    updateAllLists(lists: List[]) {
        this.allLists.next(lists);
    }

    updateSelectedList(list: List) {
        this.selectedList.next(list);
    }

    updateUsernameUpdated(updated: boolean) {
        this.usernameUpdated.next(updated);
    }

    updateProfileVisible(visible: boolean) {
        this.profileVisible.next(visible);
    }

}