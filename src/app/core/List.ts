import { Participant } from './Participant';

export interface List {
    id?: string,
    name: string,
    totalRuns: number,
    selected?: boolean,
    participants?: Participant[],
    showEdit?: boolean,
    showMore?: boolean,
    active?: boolean
}