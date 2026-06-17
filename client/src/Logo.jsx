import { useEffect, useState } from "react";
import "./Logo.css";

export default function Logo() {
    const [text, setText] = useState("Task Manager");

    
    return (
        <span className="logo">
            {text}
            <span className="cursor">|</span>
        </span>
    )
}