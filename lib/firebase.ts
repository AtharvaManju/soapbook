import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage' // ✅ Add this

const firebaseConfig = {
  apiKey: "AIzaSyDwYitu1Qwdpw_KfAAJ7PVH4Wc8wjyUrus",
  authDomain: "soapbook-d5279.firebaseapp.com",
  projectId: "soapbook-d5279",
  storageBucket: "soapbook-d5279.appspot.com", // ✅ FIXED: was ".app", should be ".com"
  messagingSenderId: "741461288977",
  appId: "1:741461288977:web:072b3fdb8661eb8ca069b0",
  measurementId: "G-QXG05Q680D"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app) // ✅ Add this
