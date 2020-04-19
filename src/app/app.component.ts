import { Component } from '@angular/core';
import * as firebase from 'firebase/app';
import { firebaseConfig } from '../../firebaseCreds';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	constructor() {
		console.log("٩(๑❛ᴗ❛๑)۶ Look at you - being sneaky and snoopin' all up in my console logs!");
		console.log("whosmakingtea was made with love and built using Angular. :)");
		console.log("Follow me on Twitter: @shibbles_");
		firebase.initializeApp(firebaseConfig);
	}
}
