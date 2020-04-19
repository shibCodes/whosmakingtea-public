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
                    console.log(error);
                    reject(error);
                });

        }

        return new Promise(resolver);

    }

    loginUser(user) {

        let resolver = (resolve, reject)=> {

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

}