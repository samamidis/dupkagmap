import firebase from 'firebase/app'
// import firebaseConf from '~/firebase.config.js'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyA4z65XAdqWehrFUYBlAPdG82BezumbWwY',
    authDomain: 'mynuxt-e9a40.firebaseapp.com',
    databaseURL: 'https://mynuxt-e9a40.firebaseio.com',
    projectId: 'mynuxt-e9a40',
    storageBucket: 'mynuxt-e9a40.appspot.com',
    messagingSenderId: '410241414851',
    appId: '1:410241414851:web:df6b639e20e13cce5f5476'
  })
}

// export const authProviders = {
//   Google: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//   Email: firebase.auth.EmailAuthProvider.PROVIDER_ID
// }

export const googleAuth = new firebase.auth.GoogleAuthProvider()

export const fireDb = firebase.firestore()
export const fireAuth = firebase.auth()
export const fireStore = firebase.storage()
