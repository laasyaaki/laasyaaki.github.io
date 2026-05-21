import { useEffect, useRef, useState } from "react";
import type { FormEvent, PointerEvent } from "react";
import { about, experiences, links, type Experience } from "./content";
import { blogPosts, type BlogPost } from "./posts";

type AppView =
    | "home"
    | "experience"
    | "search"
    // | "mail"
    | "contacts"
    | "notepad"
    | "paint"
    | "minesweeper";

const browserTabs: { id: AppView; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "experience", label: "Experience" },
];

const resumeHref = "/Laasya_aki_resume_carnegie_mellon_computer_science_ML.pdf";
const contactFormAccessKey =
    import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? "YOUR_WEB3FORMS_ACCESS_KEY";

const pathByView: Record<AppView, string> = {
    home: "/",
    experience: "/experience",
    search: "/search",
    // mail: "/mail",
    contacts: "/links",
    notepad: "/blog",
    paint: "/paint",
    minesweeper: "/minesweeper",
};

const desktopApps: {
    id: AppView;
    label: string;
    icon: "ie" | "mail" | "contacts" | "paint" | "notepad" | "minesweeper";
}[] = [
    { id: "home", label: "Internet Explorer", icon: "ie" },
    // { id: "mail", label: "Mail", icon: "mail" },
    { id: "notepad", label: "Notepad", icon: "notepad" },
    { id: "contacts", label: "Contacts", icon: "contacts" },
    { id: "paint", label: "Paint", icon: "paint" },
    { id: "minesweeper", label: "Minesweeper", icon: "minesweeper" },
];

const taskbarLabels: Record<AppView, string> = {
    home: "Internet Explorer",
    experience: "Internet Explorer",
    search: "Internet Explorer",
    // mail: "Contact Me",
    contacts: "My Links",
    notepad: "Blog",
    paint: "Paint",
    minesweeper: "Minesweeper",
};

const windowTitles: Record<AppView, string> = {
    home: "Internet Explorer",
    experience: "Internet Explorer",
    search: "Internet Explorer",
    // mail: "Contact Me",
    contacts: "My Links",
    notepad: "Blog",
    paint: "Paint",
    minesweeper: "Minesweeper",
};

function viewFromPath(pathname: string): AppView {
    const match = Object.entries(pathByView).find(
        ([, path]) => path === pathname,
    );
    return (match?.[0] as AppView | undefined) ?? "home";
}

function addressText(view: AppView) {
    if (view === "experience") {
        return "what are some of the things laasya has done?";
    }

    if (view === "search") {
        return "https://www.google.com";
    }

    return "laasyaaki.com";
}

function googleSearch(query: string) {
    window.location.assign(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    );
}

function App() {
    const [activeView, setActiveView] = useState<AppView>(() => {
        const redirectedPath = sessionStorage.getItem("redirectPath");
        return viewFromPath(redirectedPath ?? window.location.pathname);
    });
    const [isWindowOpen, setIsWindowOpen] = useState(true);
    const [selectedExperience, setSelectedExperience] =
        useState<Experience | null>(null);

    useEffect(() => {
        const redirectedPath = sessionStorage.getItem("redirectPath");

        if (redirectedPath) {
            sessionStorage.removeItem("redirectPath");
            window.history.replaceState(null, "", redirectedPath);
            setActiveView(viewFromPath(redirectedPath));
        }

        const handlePopState = () =>
            setActiveView(viewFromPath(window.location.pathname));
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    function openView(view: AppView) {
        setActiveView(view);
        setIsWindowOpen(true);
        window.history.pushState(null, "", pathByView[view]);
    }

    return (
        <main className="desktop">
            <section className="hero">
                <div>
                    <p className="eyebrow">Laasya Aki.exe</p>
                    <h1>CS + ML at Carnegie Mellon</h1>
                </div>
                <a
                    className="button primary"
                    href={resumeHref}
                    target="_blank"
                    rel="noreferrer"
                >
                    View Resume
                </a>
            </section>

            <div className="workspace" aria-label="Retro desktop workspace">
                {isWindowOpen ? (
                    <section className="window" aria-labelledby="window-title">
                        <header className="title-bar">
                            <h2 id="window-title">
                                {windowTitles[activeView]}
                            </h2>
                            <div className="window-controls">
                                <span aria-hidden="true" />
                                <span aria-hidden="true" />
                                <button
                                    className="window-control-button"
                                    type="button"
                                    aria-label="Close window"
                                    onClick={() => setIsWindowOpen(false)}
                                >
                                    X
                                </button>
                            </div>
                        </header>
                        {activeView === "home" ||
                        activeView === "experience" ||
                        activeView === "search" ? (
                            <>
                                <div className="menu-bar">
                                    {[
                                        ...browserTabs,
                                        ...(activeView === "search"
                                            ? [
                                                  {
                                                      id: "search" as const,
                                                      label: "Google",
                                                  },
                                              ]
                                            : []),
                                    ].map((tab) => (
                                        <button
                                            className={
                                                activeView === tab.id
                                                    ? "tab is-active"
                                                    : "tab"
                                            }
                                            key={tab.id}
                                            onClick={() => openView(tab.id)}
                                            type="button"
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                    <button
                                        className="tab new-tab"
                                        type="button"
                                        aria-label="Open new tab"
                                        onClick={() => openView("search")}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="20px"
                                            viewBox="0 -960 960 960"
                                            width="20px"
                                            fill="#000000"
                                        >
                                            <path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z" />
                                        </svg>
                                    </button>
                                </div>
                                <div
                                    className="address-bar"
                                    aria-label="Internet Explorer address bar"
                                >
                                    <span>Address</span>
                                    <span className="address-input">
                                        {addressText(activeView)}
                                    </span>
                                    <button
                                        className="button small"
                                        type="button"
                                        disabled={activeView !== "search"}
                                        onClick={() =>
                                            googleSearch(
                                                activeView === "search"
                                                    ? ""
                                                    : "laasyaaki.com",
                                            )
                                        }
                                    >
                                        Search
                                    </button>
                                </div>
                            </>
                        ) : null}
                        <div className="window-body">
                            {activeView === "home" && <HomePanel />}
                            {activeView === "experience" && (
                                <ExperiencePanel
                                    onShowMore={setSelectedExperience}
                                />
                            )}
                            {activeView === "search" && <SearchPanel />}
                            {/* {activeView === "mail" && <MailPanel />} */}
                            {activeView === "contacts" && <ContactsPanel />}
                            {activeView === "notepad" && <BlogPanel />}
                            {activeView === "paint" && <PaintPanel />}
                            {activeView === "minesweeper" && (
                                <DummyApp title="Minesweeper" />
                            )}
                        </div>
                    </section>
                ) : (
                    <DesktopShortcuts onOpen={openView} />
                )}
            </div>

            {selectedExperience && (
                <ExperienceModal
                    experience={selectedExperience}
                    onClose={() => setSelectedExperience(null)}
                />
            )}

            <footer className="taskbar">
                <button
                    className="start-button"
                    type="button"
                    onClick={() => openView("home")}
                >
                    Start
                </button>
                <nav className="app-bar" aria-label="Windows apps">
                    {desktopApps.map((app) => (
                        <button
                            className={
                                isWindowOpen && activeView === app.id
                                    ? "app-button is-active"
                                    : "app-button"
                            }
                            key={app.id}
                            type="button"
                            onClick={() => openView(app.id)}
                        >
                            {app.icon === "ie" ? (
                                <InternetExplorerIcon />
                            ) : (
                                <AppIcon type={app.icon} />
                            )}
                            <span>{taskbarLabels[app.id]}</span>
                        </button>
                    ))}
                </nav>
                <time dateTime="2026">33:72 PM</time>
            </footer>
        </main>
    );
}

function HomePanel() {
    return (
        <div className="two-column">
            <section>
                <h3>About Me</h3>
                <p>{about}</p>
                {/* <div className="quick-actions">
                    <a
                        className="button"
                        href="https://www.cmu.edu/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Carnegie Mellon
                    </a>
                </div> */}
            </section>
            <section className="status-panel" aria-label="Interests">
                <h3>Currently Into</h3>
                <ul className="check-list">
                    <li>Machine learning</li>
                    <li>Cybersecurity playbooks</li>
                    <li>Jewelry and crafts</li>
                    <li>Bike rides</li>
                </ul>
            </section>
        </div>
    );
}

function ExperiencePanel({
    onShowMore,
}: {
    onShowMore: (experience: Experience) => void;
}) {
    return (
        <div className="experience-grid">
            {experiences.map((experience, index) => (
                <article className="experience-card" key={experience.title}>
                    {/* <PhotoStrip title={experience.title} offset={index} /> */}
                    <div>
                        <h3>{experience.title}</h3>
                        {experience.meta && (
                            <p className="meta">{experience.meta}</p>
                        )}
                        <p>{experience.body}</p>
                    </div>
                    <div className="card-actions">
                        <button
                            className="button small"
                            type="button"
                            onClick={() => onShowMore(experience)}
                        >
                            Show More
                        </button>
                        {experience.href && (
                            <a
                                className="button small"
                                href={experience.href}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Open
                            </a>
                        )}
                    </div>
                </article>
            ))}
        </div>
    );
}

function SearchPanel() {
    const [query, setQuery] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmedQuery = query.trim();

        if (trimmedQuery) {
            googleSearch(trimmedQuery);
        }
    }

    return (
        <form className="google-panel" onSubmit={handleSubmit}>
            <h3>Google Search</h3>
            <label>
                <span>Search for</span>
                <input
                    autoFocus
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="What are you looking for today?"
                />
            </label>
            <button className="button" type="submit">
                Search Google
            </button>
        </form>
    );
}

function PhotoStrip({ title, offset = 0 }: { title: string; offset?: number }) {
    return (
        <div
            className="photo-strip"
            aria-label={`Placeholder photos for ${title}`}
        >
            {[0, 1].map((item) => (
                <div
                    className="placeholder-photo"
                    data-variant={(offset + item) % 4}
                    key={`${title}-${item}`}
                >
                    <span>Photo {item + 1}</span>
                </div>
            ))}
        </div>
    );
}

function ExperienceModal({
    experience,
    onClose,
}: {
    experience: Experience;
    onClose: () => void;
}) {
    const index = experiences.findIndex(
        (item) => item.title === experience.title,
    );

    return (
        <div
            className="modal-backdrop"
            role="presentation"
            onMouseDown={onClose}
        >
            <section
                className="modal-window"
                aria-labelledby="modal-title"
                role="dialog"
                aria-modal="true"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <header className="title-bar">
                    <h2 id="modal-title">{experience.title}</h2>
                    <button
                        className="window-close"
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                    >
                        X
                    </button>
                </header>
                <div className="modal-body">
                    <PhotoStrip title={experience.title} offset={index} />
                    {experience.meta && (
                        <p className="meta">{experience.meta}</p>
                    )}
                    <p>{experience.body}</p>
                    {experience.href && (
                        <a
                            className="button small"
                            href={experience.href}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Open Link
                        </a>
                    )}
                </div>
            </section>
        </div>
    );
}

function DesktopShortcuts({ onOpen }: { onOpen: (view: AppView) => void }) {
    return (
        <div className="desktop-shortcuts" aria-label="Desktop shortcuts">
            {desktopApps.map((app) => (
                <button
                    className="desktop-shortcut"
                    key={app.id}
                    type="button"
                    onClick={() => onOpen(app.id)}
                >
                    {app.icon === "ie" ? (
                        <InternetExplorerIcon />
                    ) : (
                        <AppIcon type={app.icon} />
                    )}
                    <span>{app.label}</span>
                </button>
            ))}
        </div>
    );
}

function MailPanel() {
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
        "idle",
    );

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus("sending");

        const form = event.currentTarget;
        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
            });
            const result = (await response.json()) as { success?: boolean };

            if (!response.ok || !result.success) {
                throw new Error("Submission failed");
            }

            form.reset();
            setStatus("sent");
        } catch {
            setStatus("error");
        }
    }

    return (
        <form
            className="mail-form"
            action="https://api.web3forms.com/submit"
            method="post"
            onSubmit={handleSubmit}
        >
            <input
                type="hidden"
                name="access_key"
                value={contactFormAccessKey}
            />
            <input
                type="hidden"
                name="subject"
                value="New message from laasyaaki.com"
            />
            <input type="hidden" name="from_name" value="laasyaaki.com" />
            <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                className="botcheck"
            />
            <div className="mail-toolbar">
                <strong>New Message</strong>
                <button className="button small" type="submit">
                    Send
                </button>
            </div>
            <label>
                <span>To</span>
                <input name="to" value="laasya" readOnly />
            </label>
            <label>
                <span>From</span>
                <input
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                />
            </label>
            <label>
                <span>Subject</span>
                <input
                    name="message_subject"
                    placeholder="Hello Laasya!"
                    required
                />
            </label>
            <label className="message-field">
                <span>Message</span>
                <textarea
                    name="message"
                    placeholder="Write your note here..."
                    required
                />
            </label>
            {status !== "idle" && (
                <p
                    className={`mail-status mail-status-${status}`}
                    role="status"
                >
                    {status === "sending" && "Sending message..."}
                    {status === "sent" && "Message sent. Thank you!"}
                    {status === "error" &&
                        "Something went wrong. Please try again."}
                </p>
            )}
        </form>
    );
}

function ContactsPanel() {
    return (
        <div className="contacts-app">
            <aside className="contacts-sidebar">
                <strong>Contacts</strong>
                <span>{links.length} entries</span>
            </aside>
            <div className="contact-list">
                {links.map((link) => (
                    <a
                        className="contact-card"
                        href={link.href}
                        key={link.label}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span className="social-icon" aria-hidden="true">
                            <BrandIcon label={link.label} />
                        </span>
                        <span>
                            <strong>{link.label}</strong>
                            <small>{link.href.replace("mailto:", "")}</small>
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
}

function DummyApp({ title }: { title: string }) {
    return (
        <div className="dummy-app">
            <AppIcon type={title === "Paint" ? "paint" : "minesweeper"} />
            <h3>{title}</h3>
            <p>Coming soon maybe?</p>
        </div>
    );
}

function PaintPanel() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [color, setColor] = useState("#000000");
    const [isDrawing, setIsDrawing] = useState(false);
    const colors = [
        { label: "Black", value: "#000000" },
        { label: "Red", value: "#d02020" },
        { label: "Orange", value: "#ffa500" },
        { label: "Yellow", value: "#ffff00" },
        { label: "Green", value: "#008000" },
        { label: "Blue", value: "#0000cc" },
        { label: "Purple", value: "#800080" },
        { label: "Pink", value: "#f1788c" },
        { label: "Brown", value: "#863618" },
    ];

    function canvasPoint(event: PointerEvent<HTMLCanvasElement>) {
        const canvas = event.currentTarget;
        const rect = canvas.getBoundingClientRect();

        return {
            x: ((event.clientX - rect.left) / rect.width) * canvas.width,
            y: ((event.clientY - rect.top) / rect.height) * canvas.height,
        };
    }

    function startDrawing(event: PointerEvent<HTMLCanvasElement>) {
        const canvas = event.currentTarget;
        const context = canvas.getContext("2d");

        if (!context) {
            return;
        }

        const point = canvasPoint(event);
        canvas.setPointerCapture(event.pointerId);
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineCap = "round";
        context.lineJoin = "round";
        context.lineWidth = 5;
        context.strokeStyle = color;
        setIsDrawing(true);
    }

    function draw(event: PointerEvent<HTMLCanvasElement>) {
        if (!isDrawing) {
            return;
        }

        const context = event.currentTarget.getContext("2d");

        if (!context) {
            return;
        }

        const point = canvasPoint(event);
        context.lineTo(point.x, point.y);
        context.stroke();
    }

    function stopDrawing(event: PointerEvent<HTMLCanvasElement>) {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        setIsDrawing(false);
    }

    function clearCanvas() {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        if (canvas && context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    return (
        <div className="paint-app">
            <div className="paint-toolbar" aria-label="Paint colors">
                {colors.map((item) => (
                    <button
                        className={
                            color === item.value
                                ? "color-swatch is-active"
                                : "color-swatch"
                        }
                        key={item.value}
                        style={{ backgroundColor: item.value }}
                        type="button"
                        aria-label={item.label}
                        onClick={() => setColor(item.value)}
                    />
                ))}
                <button
                    className="button small"
                    type="button"
                    onClick={clearCanvas}
                >
                    Clear
                </button>
            </div>
            <canvas
                ref={canvasRef}
                className="paint-canvas"
                width={900}
                height={520}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
            />
        </div>
    );
}

function BlogPanel() {
    const [selectedPost, setSelectedPost] = useState<BlogPost>(blogPosts[0]);

    return (
        <div className="notepad-app">
            <aside className="message-list note-list" aria-label="Blog posts">
                <div className="inbox-toolbar">
                    <strong>Files</strong>
                    <span>{blogPosts.length} posts</span>
                </div>
                {blogPosts.map((post) => (
                    <button
                        className={
                            selectedPost.slug === post.slug
                                ? "message-item is-active"
                                : "message-item"
                        }
                        key={post.slug}
                        onClick={() => setSelectedPost(post)}
                        type="button"
                    >
                        <span>{post.title}</span>
                        <time dateTime={post.date}>{post.date}</time>
                    </button>
                ))}
            </aside>

            <article className="email-reader note-reader">
                <header className="email-header note-header">
                    <h3>{selectedPost.title}</h3>
                    <dl>
                        <div>
                            <dt>File</dt>
                            <dd>{selectedPost.slug}.txt</dd>
                        </div>
                        <div>
                            <dt>Date</dt>
                            <dd>
                                <time dateTime={selectedPost.date}>
                                    {selectedPost.date}
                                </time>
                            </dd>
                        </div>
                    </dl>
                </header>
                <div
                    className="email-content"
                    dangerouslySetInnerHTML={{ __html: selectedPost.html }}
                />
            </article>
        </div>
    );
}

function LinksPanel() {
    return (
        <div className="link-grid">
            {links.map((link) => (
                <a
                    className="link-tile"
                    href={link.href}
                    key={link.label}
                    target="_blank"
                    rel="noreferrer"
                >
                    <span className="social-icon" aria-hidden="true">
                        <BrandIcon label={link.label} />
                    </span>
                    <span>{link.label}</span>
                </a>
            ))}
        </div>
    );
}

function BrandIcon({ label }: { label: string }) {
    switch (label) {
        case "GitHub":
            return (
                <svg viewBox="0 0 24 24" role="img">
                    <path d="M12 .7a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.2.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.2 11.2 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.2c0 .4.2.7.8.6A11.5 11.5 0 0 0 12 .7Z" />
                </svg>
            );
        case "LinkedIn":
            return (
                <svg viewBox="0 0 24 24" role="img">
                    <path d="M4.9 7.8H1.2V23h3.7V7.8ZM3.1 1A2.1 2.1 0 1 0 3 5.2 2.1 2.1 0 0 0 3.1 1ZM22.8 14.3c0-4.1-2.2-6.8-5.7-6.8-1.9 0-3.3 1-4 2.1h-.1V7.8H9.5V23h3.7v-7.5c0-2 1.1-3.3 2.8-3.3 1.6 0 3 1 3 3.3V23h3.7v-8.7Z" />
                </svg>
            );
        case "Pinterest":
            return (
                <svg viewBox="0 0 24 24" role="img">
                    <path d="M12.3.8C5.9.8 2.6 5.4 2.6 9.4c0 2.4 1.3 5.3 3.4 6.2.3.1.5.1.6-.2l.4-1.7c.1-.3 0-.4-.2-.7-.7-.8-1-1.8-1-3 0-3.6 2.7-6.8 7-6.8 3.8 0 5.9 2.3 5.9 5.6 0 4.1-1.8 7-4.5 7-1.5 0-2.5-1.2-2.2-2.7.4-1.8 1.2-3.7 1.2-5 0-1.1-.6-2.1-1.9-2.1-1.5 0-2.7 1.6-2.7 3.7 0 1.3.4 2.2.4 2.2l-1.8 7.5c-.5 2.1-.1 4.6-.1 4.8 0 .1.2.2.3.1.1-.1 2-2.4 2.6-4.5l1-3.7c.5.9 1.8 1.7 3.3 1.7 4.3 0 7.2-3.9 7.2-9.1C21.5 4.8 18.2.8 12.3.8Z" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 24 24" role="img">
                    <path d="M3 5h18v14H3V5Zm2.7 2 6.3 5.2L18.3 7H5.7Zm13.3 9.5V9.2l-7 5.7-7-5.7v7.3h14Z" />
                </svg>
            );
    }
}

function InternetExplorerIcon() {
    return (
        <svg
            className="ie-icon"
            viewBox="0 0 64 64"
            role="img"
            aria-label="Internet Explorer"
        >
            <path
                className="ie-orbit"
                d="M8 42c6 10 28 11 43 1 12-8 13-18 6-22-5-3-14-2-23 2"
            />
            <path
                className="ie-letter"
                d="M49 39c-3 7-10 12-19 12-11 0-19-8-19-19s8-19 19-19c10 0 18 7 19 17H23c1 5 4 8 9 8 3 0 6-1 8-4l9 5ZM23 27h15c-1-4-4-6-8-6s-6 2-7 6Z"
            />
            <path
                className="ie-ring"
                d="M6 39c3-8 14-17 28-23 10-4 19-5 23-2"
            />
        </svg>
    );
}

function AppIcon({
    type,
}: {
    type: "mail" | "contacts" | "paint" | "notepad" | "minesweeper";
}) {
    return (
        <svg
            className={`app-icon app-icon-${type}`}
            viewBox="0 0 32 32"
            aria-hidden="true"
        >
            {type === "mail" && (
                <>
                    <rect x="4" y="8" width="24" height="16" />
                    <path d="m5 9 11 8 11-8" />
                </>
            )}
            {type === "contacts" && (
                <>
                    <rect x="7" y="5" width="19" height="24" />
                    <circle cx="16" cy="14" r="4" />
                    <path d="M10 25c1-5 11-5 12 0" />
                </>
            )}
            {type === "paint" && (
                <>
                    <path d="M7 22 20 9l4 4L11 26H7v-4Z" />
                    <path d="M19 8 22 5l5 5-3 3" />
                </>
            )}
            {type === "notepad" && (
                <>
                    <rect x="8" y="5" width="17" height="23" />
                    <path d="M12 11h9M12 16h9M12 21h7" />
                </>
            )}
            {type === "minesweeper" && (
                <>
                    <rect x="5" y="5" width="22" height="22" />
                    <path d="M5 13h22M5 20h22M13 5v22M20 5v22" />
                    <circle cx="16" cy="16" r="3" />
                </>
            )}
        </svg>
    );
}

export default App;
