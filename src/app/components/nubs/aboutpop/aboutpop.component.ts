import { Component, Input, SimpleChanges, Output, EventEmitter} from '@angular/core';

@Component({
	selector: 'aboutpop',
	templateUrl: './aboutpop.component.html',
	styleUrls: ['./aboutpop.component.scss']
})
export class AboutPopComponent {
	@Input() showPopup: boolean;
	@Output() closePopup: EventEmitter<boolean> = new EventEmitter(true);
	makePopupVisible: boolean = false;
	backgroundFadeIn: boolean = false;
	disappear: boolean = true;

	constructor() { }

	ngOnChanges(changes: SimpleChanges) {

        if (changes.showPopup.currentValue == true) { 
            this.makePopupVisible = true;
            setTimeout(() => {
                this.backgroundFadeIn = true;
                this.disappear = false;
            }, 200);
            
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

}
