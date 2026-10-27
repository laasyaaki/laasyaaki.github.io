import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ShaderGradient } from "./ui/shader-gradient";
import "./MagicEightBall.css";

const answers = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes, definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful.",
] as const;

const oracleColors = ["#141258", "#3f35c9", "#5169eb", "#262080"];

export function MagicEightBallPanel() {
    const [question, setQuestion] = useState("");
    const [askedQuestion, setAskedQuestion] = useState("");
    const [answerIndex, setAnswerIndex] = useState<number | null>(null);
    const [isShaking, setIsShaking] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (timerRef.current !== null) clearTimeout(timerRef.current);
    }, []);

    function shake() {
        if (timerRef.current !== null) return;
        setAskedQuestion(question.trim());
        setIsShaking(true);

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        timerRef.current = setTimeout(() => {
            // Pick uniformly, excluding the previous answer on repeat shakes.
            const draw = Math.floor(Math.random() * (answers.length - (answerIndex === null ? 0 : 1)));
            setAnswerIndex(answerIndex !== null && draw >= answerIndex ? draw + 1 : draw);
            setIsShaking(false);
            timerRef.current = null;
        }, reducedMotion ? 150 : 1200);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        shake();
    }

    function reset() {
        setQuestion("");
        setAskedQuestion("");
        setAnswerIndex(null);
    }

    const answer = answerIndex === null ? null : answers[answerIndex];
    const state = isShaking ? "shaking" : answer ? "answered" : "idle";

    return (
        <div className="magic-app">
            <div className="magic-menubar">
                <span>Fortune Teller v1.0</span>
                <span>20 possible futures</span>
            </div>
            <div className="magic-stage" data-state={state}>
                <header className="magic-heading">
                    <p>A little help from the universe</p>
                    <h3>Ask the Magic 8 Ball.</h3>
                    <span>Think of a yes-or-no question. Give fate a little shake.</span>
                </header>

                <button
                    className="magic-ball-button"
                    type="button"
                    aria-label="Shake the Magic 8 Ball"
                    disabled={isShaking}
                    onClick={shake}
                >
                    <span className="magic-ball" aria-hidden="true">
                        <span className="magic-eight">8</span>
                        <span className="magic-porthole">
                            <span className="magic-triangle">
                                {state !== "idle" && (
                                    <ShaderGradient
                                        theme="dark"
                                        colors={oracleColors}
                                        speed={0.28}
                                        grain={0.2}
                                        interactive={false}
                                    />
                                )}
                            </span>
                            <span className="magic-answer">{answer}</span>
                        </span>
                    </span>
                </button>

                <p className="magic-prompt" aria-hidden="true">
                    {isShaking ? "Consulting the cosmos..." : answer ? (askedQuestion || "The universe has spoken.") : "The future is a click away."}
                </p>
                <p className="magic-announcement" role="status" aria-live="polite" aria-atomic="true">
                    {isShaking ? "Consulting the cosmos..." : answer ? `The Magic 8 Ball says: ${answer}` : "Ready for your question."}
                </p>

                <form className="magic-form" onSubmit={handleSubmit}>
                    <label htmlFor="magic-question">Your question <span>(or keep it to yourself)</span></label>
                    <input
                        id="magic-question"
                        type="text"
                        value={question}
                        maxLength={160}
                        placeholder="Will everything work out?"
                        autoComplete="off"
                        disabled={isShaking}
                        onChange={(event) => setQuestion(event.target.value)}
                    />
                    <div className="magic-actions">
                        <button className="button magic-shake" type="submit" disabled={isShaking}>
                            <span aria-hidden="true">✧</span>
                            {isShaking ? "Shaking..." : answer ? "Ask again" : "Shake the ball"}
                        </button>
                        <button className="button" type="button" disabled={isShaking || (!question && !answer)} onClick={reset}>
                            Reset
                        </button>
                    </div>
                </form>
            </div>
            <div className="magic-statusbar">
                <span>Just for fun · <a href="https://www.23rd.dev/docs/components/shader-gradient" target="_blank" rel="noreferrer">Visuals by 23rd</a></span>
            </div>
        </div>
    );
}
