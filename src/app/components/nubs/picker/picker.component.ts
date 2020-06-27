import { Component, ViewChildren, Output, EventEmitter, QueryList, Input, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { Person } from 'src/app/core/Person';

@Component({
	selector: 'picker',
	templateUrl: './picker.component.html',
	styleUrls: ['./picker.component.scss']
})

export class PickerComponent implements AfterViewInit {
	@ViewChildren('input') inputElements: QueryList<ElementRef>;
	@Output() hideTagline: EventEmitter<boolean> = new EventEmitter(false);
	allPeople: Person[] = [];
	instructionMessage: string = "Add a bunch of people and we’ll pick a random person for you!";
	pickPersonDisabled: boolean = true;
	pickPersonVisible: boolean = false;
	hidePicker: boolean = false;
	hideLoady: boolean = true;
	hideSelection: boolean = true;
	selectedPerson: string = "";

	ngAfterViewInit() {
		this.inputElements.changes.subscribe(() => {
			this.peopleArrayRendered();
		});
	}

	addPerson() {

		if (this.allPeople.length <= 0) {
			this.hideTagline.emit(true);
		}

		let personObj: Person = {
			name: ""
		}

		this.allPeople.push(personObj);

		this.pickPersonDisabled = true;

		if (this.allPeople.length > 1) {
			this.pickPersonVisible = true;
		}

	}

	pickPerson() {

		this.hidePicker = true;
		this.hideSelection = true;
		this.hideLoady = false;

		this.instructionMessage = "Please wait while we pick the perfect person..."

		let randomNumber = Math.floor(Math.random() * this.allPeople.length);

		let selectedPerson = this.allPeople[randomNumber];

		let pickerTimeout = setTimeout(() => {
			this.showPickedPerson(selectedPerson.name);
			clearTimeout(pickerTimeout);
		}, 1500);

	}

	removePerson(index) {

		this.allPeople.splice(index, 1);

		if (this.allPeople.length == 0) {
			this.hideTagline.emit(false);
		}

		if (this.allPeople.length < 2) {
			this.pickPersonVisible = false;
		}

		this.checkButtonState();

	}

	addMorePeople() {

		this.hideSelection = true;
		this.hidePicker = false;

		this.instructionMessage = "Add a bunch of people and we’ll pick a random person for you!";

	}

	checkButtonState() {

		var notFilledOut = false;

		for (var i = 0; i < this.allPeople.length; i++) {
			if (this.allPeople[i].name == "") { notFilledOut = true; break; }
		}

		(!notFilledOut) ? this.pickPersonDisabled = false : this.pickPersonDisabled = true;

	}

	onKey(event: KeyboardEvent) {

		// 13 = Enter
		if (event.keyCode === 13) {
			this.addPerson();
		}

	}

	private peopleArrayRendered() {
		if (this.allPeople.length === 1) {
			this.inputElements.first.nativeElement.focus();
		}
		else if (this.allPeople.length > 1) {
			this.inputElements.last.nativeElement.focus();
		}
	}

	private showPickedPerson(person) {

		this.hideLoady = true;
		this.hideSelection = false;
		this.instructionMessage = "And the person making tea is...";
		this.selectedPerson = person;

	}


}