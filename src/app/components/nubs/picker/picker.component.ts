import { Component, ViewChildren, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'picker',
	templateUrl: './picker.component.html',
	styleUrls: ['./picker.component.scss']
})

export class PickerComponent {
	@ViewChildren('input') inputElements;
	@Output() hideTagline: EventEmitter<boolean> = new EventEmitter(false);
	allPeople = [];
	instructionMessage: string = "Add a bunch of people and we’ll pick a random person for you!";
	pickPersonDisabled: boolean = true;
	pickPersonVisible: boolean = false;
	hidePicker: boolean = false;
	hideLoady: boolean = true;
	hideSelection: boolean = true;
	selectedPerson: string = "";

	addPerson() {

		if (this.allPeople.length <= 0) {
			this.hideTagline.emit(true);
		}

		let personObj = {
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

	private showPickedPerson(person) {

		this.hideLoady = true;
		this.hideSelection = false;
		this.instructionMessage = "And the person making tea is...";
		this.selectedPerson = person;

	}


}