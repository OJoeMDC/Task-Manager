import { useEffect, useState } from "react";
import "./Logo.css";

export default function Logo() {
    const [isCorrect, setIsCorrect] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const fullWord = !isCorrect ? "Task Managr" : "Task Manager";
    const [text, setText] = useState("");
    const [index, setIndex] = useState(0);
    const [speed, setSpeed] = useState(350);


    useEffect(() => {

        const timeout = setTimeout(() => {
            if (fullWord === "Task Managr") {
                const currentText = fullWord.slice(0, index);

                setText(currentText);
                setIndex(index + 1);

                if (currentText === fullWord) {
                        setIsCorrect(true);
                        setIsDeleting(true);
                        setSpeed(2000);
                }
            } else if (isCorrect && isDeleting) {
                const currentText = fullWord.slice(0, text.length - 1);

                setText(currentText);
                setSpeed(200);

                if (currentText === "Task Man") {
                    setIsDeleting(false);
                }
            } else if (isCorrect && !isDeleting ) {
                const currentText = fullWord.slice(0, text.length + 1);

                setText(currentText);
                setSpeed(350);
            }
        }, speed);

        return () => clearTimeout(timeout);
    }, [text, fullWord, isCorrect, index, isDeleting, speed])

    return (
        <span className="logo">
            {text}
            <span className="cursor">|</span>
        </span>
    )
}