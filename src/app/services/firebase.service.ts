import { Injectable } from '@angular/core';
import { firebaseConfig } from '../../../firebaseCreds';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/analytics';
import { List } from '../core/List';
import { Participant } from '../core/Participant';

@Injectable()
export class FirebaseService {
    db: any;
    user: any;

    initialiseFirebase() {
        let app = firebase.initializeApp(firebaseConfig);
        this.db = firebase.firestore(app);
        firebase.analytics();
    }

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

    sendPasswordResetEmail(email) {

        let resolver = (resolve, reject) => {

            firebase.auth().sendPasswordResetEmail(email)
                .then(() => {
                    resolve();
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

    updateEmail(email: string) {

        let resolver = (resolve, reject) => {

            let user = firebase.auth().currentUser;

            user.updateEmail(email)
                .then(resolve)
                .catch(reject);

        }

        return new Promise(resolver);

    }

    updatePassword(password: string) {

        let resolver = (resolve, reject) => {

            let user = firebase.auth().currentUser;

            user.updatePassword(password)
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

    reauthenticateUser(email: string, password: string) {

        let resolver = (resolve, reject) => {

            let user = firebase.auth().currentUser;

            let credential = firebase.auth.EmailAuthProvider.credential(
                email, // references the user's email address
                password
            );

            user.reauthenticateWithCredential(credential)
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                })

        }

        return new Promise(resolver);

    }

    getUserData() {

        let resolver = (resolve, reject) => {

            let user = firebase.auth().currentUser;

            if (user) {
                this.user = user;
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

    getAllLists() {

        let resolver = (resolve, reject) => {

            let listsArray: List[] = [];
            let listsCollectionRef = this.db.collection("users").doc(this.user.uid).collection("lists").where("active", "==", true);

            listsCollectionRef.get()
                .then((lists) => {

                    let selectedListID = localStorage.getItem("selectedListID");
                    if (selectedListID == undefined) {
                        selectedListID = "list1";
                    }

                    lists.forEach((list) => {

                        let listData = list.data();
                        let selected = false;

                        if (selectedListID == list.id) {
                            selected = true;
                        }

                        let listObj: List = {
                            id: list.id,
                            name: listData.name,
                            totalRuns: listData.totalRuns,
                            selected: selected,
                            showEdit: false,
                            showMore: false
                        }

                        listsArray.push(listObj);

                    });

                    resolve(listsArray);

                })
                .catch((error) => {
                    reject(error);
                });

        }

        return new Promise(resolver);

    }

    updateList(listObj: List) {

        let resolver = (resolve, reject) => {

            let listDataToSend = {
                name: listObj.name,
                totalRuns: listObj.totalRuns,
                active: true
            }
    
            let listDocRef = this.db.collection("users").doc(this.user.uid).collection("lists").doc(listObj.id);
    
            listDocRef.set(listDataToSend)
                .then((res) => { 
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });

        }

        return new Promise(resolver);

    }

    deleteList(listObj: List) {

        let resolver = (resolve, reject) => {

            let listDataToSend = {
                name: listObj.name,
                totalRuns: listObj.totalRuns,
                active: false
            }

            let listDocRef = this.db.collection("users").doc(this.user.uid).collection("lists").doc(listObj.id);

            listDocRef.set(listDataToSend)
                .then((res) => { 
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });

        }

        return new Promise(resolver);

    }

    addNewList(listObj: List, generatedID: string) {

        let resolver = (resolve, reject) => {

            let listRef = this.db.collection("users").doc(this.user.uid).collection("lists").doc(generatedID);

            listRef.get().then((list) => {
                if (!list.exists) {
                    this.saveNewList(listObj, generatedID)
                        .then(resolve)
                        .catch(reject);
                }
                else {
                    this.getEveryListEver(listObj)
                        .then(resolve)
                        .catch(reject);
                }
            });


        }

        return new Promise(resolver);

    }

    getEveryListEver(listObj: List) {

        let resolver = (resolve, reject) => {
            let listsCollectionRef = this.db.collection("users").doc(this.user.uid).collection("lists");

            listsCollectionRef.get()
                    .then((lists) => {

                        let generatedID = "list" + (lists.docs.length + 1);
                        
                        this.saveNewList(listObj, generatedID)
                            .then(resolve)
                            .catch(reject);
                    })
                    .catch(reject);
        }

        return new Promise(resolver);

    }

    private saveNewList(listObj: List, generatedID: string) {

        let resolver = (resolve, reject) => {

            let listsCollectionRef = this.db.collection("users").doc(this.user.uid).collection("lists");

            listsCollectionRef.doc(generatedID).set(listObj)
                .then(() => {

                    let newListObj: List = {
                        id: generatedID,
                        name: listObj.name,
                        totalRuns: listObj.totalRuns,
                        selected: false,
                        showEdit: false,
                        showMore: false
                    }

                    resolve(newListObj);
                })
                .catch((error) => {
                    reject(error);
                });
        }

        return new Promise(resolver);

    }

    getListParticipants(listID: string) {

        let resolver = (resolve, reject) => {

            let participantsRef = this.db.collection("users").doc(this.user.uid).collection("lists").doc(listID).collection("participants");

            participantsRef.get()
                .then((participants) => {

                    let allParticipants: Participant[] = [];

                    if (participants.docs.length <= 0) {
                        resolve(allParticipants);
                    }
                    else {
                        participants.forEach((participant) => {

                            let newParticipant: Participant = {
                                id: participant.id,
                                name: participant.data().name,
                                made: participant.data().made,
                                drank: participant.data().drank,
                                last: participant.data().last,
                                selected: participant.data().selected
                            }

                            allParticipants.push(newParticipant);

                        });

                        resolve(allParticipants);
                    }

                })
                .catch((error) => {
                    reject(error);
                });


        }

        return new Promise(resolver);

    }

    addNewParticipant(listID: string, participant: Participant) {

        let resolver = (resolve, reject) => {

            let participantsRef = this.db.collection("users").doc(this.user.uid).collection("lists").doc(listID).collection("participants")

            participantsRef.add(participant)
                .then((participantRef) => {
                    resolve(participantRef);
                })
                .catch((error) => {
                    reject(error);
                });

        }

        return new Promise(resolver);

    }

    updateParticipant(listID: string, participant: Participant) {

        let resolver = (resolve, reject) => {

            let participantRef = this.db.collection("users").doc(this.user.uid).collection("lists").doc(listID).collection("participants").doc(participant.id);

            participantRef.set(participant)
                .then(resolve)
                .catch(reject);

        }

        return new Promise(resolver);

    }

    deleteParticipant(listID: string, participant: Participant) {

        let resolver = (resolve, reject) => {

            let participantRef = this.db.collection("users").doc(this.user.uid).collection("lists").doc(listID).collection("participants").doc(participant.id);

            participantRef.delete()
                .then(resolve)
                .catch(reject);

        }

        return new Promise(resolver);

    }

    saveTeaRoundResults(list: List, participants: Participant[]) {

        let resolver = (resolve, reject) => {

            let batch = this.db.batch();

            let listDocRef = this.db.collection("users").doc(this.user.uid).collection("lists").doc(list.id);
            batch.update(listDocRef, { "totalRuns": list.totalRuns });

            participants.forEach((participant) => {

                let participantRef = this.db.collection("users").doc(this.user.uid).collection("lists").doc(list.id).collection("participants").doc(participant.id);

                batch.update(participantRef, { "made": participant.made, "drank": participant.drank, "last": participant.last });

            });

            batch.commit()
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });

        }

        return new Promise(resolver);

    }


    getListDataWithParticipants() {

        let lists: List[] = [];
        let listsCollectionRef = this.db.collection("users").doc(this.user.uid).collection("lists");

        listsCollectionRef.get()
            .then((lists) => {
                lists.forEach((list) => {

                    let listData = list.data();

                    let listObj: List = {
                        id: list.id,
                        name: listData.name,
                        totalRuns: listData.totalRuns,
                        participants: [],
                        selected: false
                    }

                    let participantsCollectionRef = listsCollectionRef.doc(list.id).collection("participants");

                    participantsCollectionRef.get()
                        .then((participants) => {
                            participants.forEach((participant) => {

                                let participantData = participant.data();

                                let participantObj: Participant = {
                                    id: participant.id,
                                    name: participantData.name,
                                    made: participantData.made,
                                    drank: participantData.drank,
                                    last: participantData.last,
                                    selected: participantData.selected
                                }

                                listObj.participants.push(participantObj);
                            });
                        });

                });
            });

    }

}