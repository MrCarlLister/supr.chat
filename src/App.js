import React, { useRef, useState } from 'react';
import './App.css';
import TimeAgo from 'javascript-time-ago'
import ReactTimeAgo from 'react-time-ago'
import logo from './icon.svg'; // with import

import en from 'javascript-time-ago/locale/en'

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { firebaseConfig } from './firebase-config.js';

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();
TimeAgo.addDefaultLocale(en)



// signed in = obj --- signed out = null

function App() {
  const [user] = useAuthState(auth);


  return (
    <div className="App">
      
      <header>
        <Navigation user={user} />
      </header>
 
        

      <section className="flow-root">
          <ul className="-mb-8">
            
        { user ? <ChatRoom /> : <NewUser />}


            
          </ul>
      </section>
    </div>
  );
}

function NewUser(){

  

  return (
    <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
      <div className="text-center">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block xl:inline">Supr.chat </span>
          <span className="inline text-indigo-600 xl:inline">demo</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          A simple chat built with <span className="bg-indigo-100">firebase</span>, <span className="bg-indigo-100">react</span> & <span className="bg-indigo-100">tailwindcss</span>
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
          <SignIn />
            
          </div>

        </div>
      </div>
    </main>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()} className="text-white text-sm mr-4">Sign out</button>
  )
}
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return  (
    <button onClick={signInWithGoogle} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">Sign in with Google</button>
    
  )
}

function Navigation(props) {

  const { photoURL } = auth.currentUser !== null
      ? auth.currentUser // if all
      : '';

      const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
      }
    

  return (
    <nav className="bg-indigo-600">
  <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
    <div className="relative flex items-center justify-between h-16">
      
      <div className="flex-1 flex">
        <div className="flex-shrink-0 flex items-center">
          <img className="h-8 w-auto" src={logo} alt="Supr.chat" /> <span className="pl-2 text-white text-lg font-medium">Supr.chat</span>

        </div>
        
      </div>

      
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">


          <div className="ml-3 relative">
              { props.user ? 
            <div className="flex">
              <SignOut></SignOut>
            
                <img className="h-8 w-8 rounded-full" src={photoURL} alt="" />
            </div>
                : 
                <button onClick={signInWithGoogle} className="text-white text-sm mr-4">Sign in with Google</button>
                }

          </div>
      </div>
    </div>
  </div>
 
</nav>
  )

}

function ChatRoom(){

  const dummy = useRef();


  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  
  const [messages] = useCollectionData(query, {idField: 'id'});
  
  const [formValue,setFormValue] = useState('');

  const sendMessage = async(e) => {

    e.preventDefault();

    console.log(auth.currentUser);
    const { uid, photoURL, displayName } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      displayName
    });

    setFormValue('');
    
    dummy.current.scrollIntoView({
      behavior: 'smooth'
    });

  }

  return (
    
    <main className="mt-12">
        <div className="max-w-4xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          

              {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
              <div ref={dummy}></div>
 
            <form onSubmit={sendMessage} className="bg-gray-800 shadow sm:rounded-lg px-4 py-5 sm:p-6 z-20 relative">
 

                <div className="mt-1 relative rounded-md shadow-sm">
                  <input type="text" name="supr_msg" id="supr_msg" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 text-sm border-gray-300 rounded-md" placeholder="Send a message to supr.chat" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    
                    <svg  className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  </div>
                </div>




            </form>
            </div>
    </main>
  )
}

function ChatMessage(props) {
  

  const { text, uid, photoURL, displayName} = props.message;
  const createdAt = props.message.createdAt;
  const readable = createdAt ? createdAt.toDate() : Date.now();
  const messageClass = uid === auth.currentUser.uid ? 'relative order-2 ml-8' : 'relative';
  const alignClass = uid === auth.currentUser.uid ? 'text-right' : '';

  return (
    <li className={alignClass}>
              <div className="relative pb-8">
                <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                <span className="absolute top-5 right-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                <div className="relative flex items-start space-x-3">
                  <div className={messageClass}>
                    <img className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white" src={photoURL} alt="" />

                    <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
                    <svg  className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div>
                        <span className="font-thin text-xs text-gray-400"><ReactTimeAgo date={readable} locale="en-GB"/></span>
                        <p className="text-sm font-medium text-md text-gray-900">{displayName} </p>
                      </div>
                      
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <p>
                        {text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>

    )
}

export default App;
