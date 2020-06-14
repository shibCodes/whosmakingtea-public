import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/auth';

@Injectable()
export class FirebaseService {

    createNewUser(user) {

        let resolver = (resolve, reject) => {

            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then((res) => {
                    //resolve(res);
                    this.updateDisplayName(user.name)
                        .then(resolve)
                        .catch(resolve)
                })
                .catch((error) => {
                    reject(error);
                });

        }

        return new Promise(resolver);

    }

    updateDisplayName(name) {

        let resolver = (resolve, reject) => {

            let user = firebase.auth().currentUser;

            user.updateProfile({
                displayName: name,
            })
            .then(resolve)
            .catch(reject);

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

    logoutUser() {

        let resolver = (resolve, reject) => {

            firebase.auth().signOut()
                .then(() => {
                    resolve(true);
                })
                .catch(() => {
                    reject(false);
                })

        }

        return new Promise(resolver);

    }

    getUserData() {

        let resolver = (resolve, reject) => {

            let user = firebase.auth().currentUser;

            if (user) {
                resolve(user);
            }
            else {
                reject();
            }

        }

        return new Promise(resolver);

    }

    isUserAuthenticated() {

        let resolver = (resolve, reject) => {

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    resolve(user);
                }
                else {
                    reject(false);
                }
            });

        }

        return new Promise(resolver);


    }

}