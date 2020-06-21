import { List } from './List';
import { Participant } from './Participant';

export interface ItemToDelete {
    id: any,
    title: string,
    type: string,
    list?: List,
    participant?: Participant,
    listID?: string
}