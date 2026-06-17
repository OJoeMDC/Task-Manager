import { useEffect, useState } from "react";
import "./Logo.css";

export default function Logo() {
    const [isCorrect, setIsCorrect] = useState(false);
    const [isDeleting, setIsDeleting] = useState(true);
    const fullWord = !isCorrect ? "Task Managr" : "Task Manager";
    const [text, setText] = useState(fullWord);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isDeleting) {
                const currentText = text.slice(0, text.length - 1);

               setText(currentText);

               if (currentText === "Task Mana") {
                setIsDeleting(false);
               }
            } else {

                const currentText = fullWord.slice(0, text.length + 1);

                setText(currentText);

                if (currentText === fullWord) {
                    setIsDeleting(true);
                    setIsCorrect(prev => !prev);
                }
            }
        }, 500);
        return () => clearInterval(interval);
    }, [text, isDeleting, fullWord]);

    return (
        <span className="logo">
            {text}
            <span className="cursor">|</span>
        </span>
    )
}