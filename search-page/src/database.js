import Firebase from 'firebase'
import config from './firebase.config'

const firebase = Firebase.initializeApp(config);
const database = firebase.database();
export default database;