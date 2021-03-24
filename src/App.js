import React, { useRef, useState } from 'react';
import './App.css';
import TimeAgo from 'javascript-time-ago'
import ReactTimeAgo from 'react-time-ago'
import logo from './icon.svg'; // with import
import logoDark from './icon-dark.svg'; // with import

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
 
        

      
            
        { user ? <ChatRoom /> : <NewUser />}


            
          

      <Footer></Footer>
    </div>
  );
}

function NewUser(){

  

  return (
    <main className="mx-auto max-w-7xl px-4 my-24">
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
          
        <section className="flow-root">
          <ul className="mb-8">

              {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
              </ul>
      </section>
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

function Footer() {
  return (
    <footer className="bg-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a href="https://www.facebook.com/mrcarllister88" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Facebook</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
            </svg>
          </a>
    
          <a href="https://www.instagram.com/mrcarllister88/" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Instagram</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
            </svg>
          </a>
    
          <a href="https://twitter.com/mrcarllister" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Twitter</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
    
          <a href="https://github.com/MrCarlLister/supr.chat" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">GitHub</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
          </a>
          
        </div>
        <div className="mt-8 md:mt-0 md:order-1 flex">
        <img className="h-8 w-auto" src={logoDark} alt="Supr.chat" /> <span className="pl-2 text-indigo-600 text-lg font-medium">Supr.chat</span>

        </div>
      </div>
    </footer>    
 


  )
}

export default App;
