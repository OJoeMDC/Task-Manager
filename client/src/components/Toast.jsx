import './Toast.css'

export default function Toast({ message, type, toastKey }) {
    /*
    Toast function manages the display of a toast message for user actions utilizing a toastKey passed from App.jsx > layout.jsx > toast

    this is a component to be placed on a page
    */


    
    if (!message) return null;

    return (
        <div key ={toastKey} className={`toast ${type}`}>
            {message}
        </div>
    );
}