export interface Participant {
    id: number,
    name: string,
    made: number,
    drank: number,
    last: boolean,
    selected: boolean,
    percentage_not_made?: number
}