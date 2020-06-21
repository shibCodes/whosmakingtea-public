import { Injectable } from '@angular/core';
import { List } from '../core/List';
import { Participant } from '../core/Participant';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {
    private allLists = new BehaviorSubject<List[]>([]);
    allListsObservable = this.allLists.asObservable();

    private selectedList = new BehaviorSubject<any>({});
    selectedListObservable = this.selectedList.asObservable();

    updateAllLists(lists: List[]) {
        this.allLists.next(lists);
    }

    updateSelectedList(list: List) {
        this.selectedList.next(list);
    }


}