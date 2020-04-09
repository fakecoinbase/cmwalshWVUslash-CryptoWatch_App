import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import 'firebase/firestore';
import"firebase/auth";
import { toast } from "../components/toast";
import axios from 'axios';

const admin = require('firebase-admin');

var config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  };

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}


var serviceAccount = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://crypto-watch-dbf71.firebaseio.com"
  });


export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const adminAuth = admin.auth();

export async function loginUser(userData: {email: string, password: string}) {
  try {
    const res = await firebase.auth().signInWithEmailAndPassword(
      userData.email,
      userData.password
    )

    return res
  } catch (error) {
    toast(error.message, 2000)
    return false
  }
}

export async function registerUser(userData: {email: string, password: string, name: string}) {
  try {
    auth.createUserWithEmailAndPassword(
      userData.email,
      userData.password
    ).then(async (resp) => {
        await firestore.collection('users').doc(resp!.user!.uid).set({
            name: userData.name,
            userEmail: userData.email
        })
        return true
    }).catch((error) => {
      toast(error.message, 2000)
      return false
    })
  } catch (error) {
    toast(error.message, 2000)
    return false
  }
}

export async function signout() {
  auth.signOut().then(() => {
    toast("User signed out", 2000)
  })
}

export async function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(function(user) {
      if (user) {
        resolve(user)
      } else {
        resolve(null)
      }
      unsubscribe()
    })
  })
}

export async function getTopCryptos() {

    const top20 = firestore.collection('top').doc('top20').get()
        .then(doc => {
            if (!doc.exists) {
                return axios.get('https://mighty-dawn-74394.herokuapp.com//top')
                    .then(response => {
                        return response.data.data
                    }).catch(error => {
                        console.log(error)
                        return null
                    });
            } else {
                const data = doc!.data()!.top20
                return data
            }
        })
        .catch(err => {
            console.log(err)
            return axios.get('https://mighty-dawn-74394.herokuapp.com//top')
                .then(response => {
                    return response.data.data
                }).catch(error => console.log(error)
        );            
    });

    return top20
}

export async function getDailyHoldingsHistory(userId: string) {

    console.log(userId)
    const top20 = firestore.collection('dailyHoldings').doc(userId).collection("holdingsHistory").orderBy('lastUpdated', 'desc').get()
        .then(res => {
            const history:any[] = []
            res.forEach(r => {
                history.push(r.data())
            })
            return history
        })
        .catch(err => {
            console.log(err)           
    });

    return top20
}

export async function getHistoricalCyrptoPrices(ticker: string) {

    console.log(ticker)
    const priceHistory = firestore.collection('priceData').doc("priceHistory").collection(ticker).orderBy('timeStamp', 'desc').limit(100).get()
        .then(res => {
            const history:any[] = []
            res.forEach(r => {
                history.push(r.data())
            })
            return history
        })
        .catch(err => {
            console.log(err)           
    });

    return priceHistory
}

export async function getCoinbaseHoldings(userId: string) {
    const cbHoldings = firestore.collection('cbHoldings').doc(userId).collection("cbHoldings").get()
        .then(res => {
            const holdings:any[] = []
            res.forEach(r => {
                const data = r.data().holding
                if (Number(data.amount) > 0) {
                    holdings.push(data)
                }
            })
            return holdings
        })
        .catch(err => {
            console.log(err)           
    });

    return cbHoldings
}

export async function getAdditionalHoldings(userId: string) {
    const holdings = firestore.collection('holdings').doc(userId).collection("holdings").get()
        .then(res => {
            const holdings:any[] = []
            res.forEach(r => {
                holdings.push(r.data())
            })
            return holdings
        })
        .catch(err => {
            console.log(err)           
    });

    return holdings
}


export const recordTransaction = async (transaction: any, userId: string) => {
    console.log(userId)
        if (transaction.dollarAmount !== undefined) {
            const top20 = await firestore.collection('top').doc('top20').get()
                .then(doc => {
                    if (!doc.exists) {
                        return axios.get('https://mighty-dawn-74394.herokuapp.com//top')
                            .then(response => {
                                return response.data.data
                            }).catch(error => {
                                console.log(error)
                                return null
                            });
                    } else {
                        const data = doc!.data()!.top20
                        return data
                    }
                })
                .catch(err => {
                    console.log(err)
                    return axios.get('https://mighty-dawn-74394.herokuapp.com//top')
                        .then(response => {
                            return response.data.data
                        }).catch(error => console.log(error)
                ); 
            })
            if (top20 !== null && top20 !== undefined) {
                var currentPrice = top20.filter((currency: any) => transaction.coin === currency.symbol.toUpperCase())[0].quote.USD.price;
                    console.log(currentPrice);

                    var numCoins = Number(transaction.dollarAmount) / Number(currentPrice);
                    transaction.numberOfCoins = numCoins;
            
                    firestore.collection('transactions').doc(userId).collection('transactions').add({
                        ...transaction,
                        purchaseDate: new Date()
                    }).then(() => {
                        console.log("Tansaction Success")
                    }).catch((err) => {
                        console.log("Tansaction Error")
                    })
            }
        }
        else {
            firestore.collection('transactions').doc(userId).collection('transactions').add({
                ...transaction,
                purchaseDate: new Date()
            }).then(() => {
                console.log("Tansaction Success")
            }).catch((err) => {
                console.log("Tansaction Error")
            })
        }
    }
