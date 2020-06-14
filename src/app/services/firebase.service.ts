import {Injectable} from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/auth';

@Injectable()
export class FirebaseService {
    
    createNewUser(user) {

        let resolver = (resolve, reject) => {

            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });

        }

        return new Promise(resolver);

    }

    loginUser(user) {

        let resolver = (resolve, reject) => {

            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });

        }

        return new Promise(resolver);

    }

    checkAuthState() {

        let resolver = (resolve, reject) => {

            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                  // User is signed in.
                  var displayName = user.displayName;
                  var email = user.email;
                  var emailVerified = user.emailVerified;
                  var photoURL = user.photoURL;
                  var isAnonymous = user.isAnonymous;
                  var uid = user.uid;
                  var providerData = user.providerData;

                 // console.log(user.email);
                 resolve(user);
                  // ...
                } else {
                  // User is signed out.
                  // ...
                  
                }
            });

        }

        return new Promise(resolver);

    }

}