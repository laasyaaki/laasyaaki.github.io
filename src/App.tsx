import { useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent, PointerEvent } from "react";
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
    // | "music"
    | "minesweeper";

const browserTabs: { id: AppView; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "experience", label: "Experience" },
];

const resumeHref = "/Laasya_aki_resume_carnegie_mellon_computer_science_ML.pdf";
const contactFormAccessKey =
    import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? "YOUR_WEB3FORMS_ACCESS_KEY";

const spotifyPlaylistEmbedUrl =
    "https://open.spotify.com/embed/playlist/6PUc70ez1gmDnnfKVFwEQc?utm_source=generator&si=58943ff5484f49a5";

const pathByView: Record<AppView, string> = {
    home: "/",
    experience: "/experience",
    search: "/search",
    // mail: "/mail",
    contacts: "/links",
    notepad: "/blog",
    paint: "/paint",
    // music: "/music",
    minesweeper: "/minesweeper",
};

const desktopApps: {
    id: AppView;
    label: string;
    icon:
        | "ie"
        | "mail"
        | "contacts"
        | "paint"
        | "notepad"
        | "music"
        | "minesweeper";
}[] = [
    { id: "home", label: "Internet Explorer", icon: "ie" },
    // { id: "mail", label: "Mail", icon: "mail" },
    { id: "notepad", label: "Notepad", icon: "notepad" },
    { id: "contacts", label: "Contacts", icon: "contacts" },
    { id: "paint", label: "Paint", icon: "paint" },
    // { id: "music", label: "CD Player", icon: "music" },
    { id: "minesweeper", label: "Minesweeper", icon: "minesweeper" },
];

const taskbarLabels: Record<AppView, string> = {
    home: "Internet Explorer",
    experience: "Internet Explorer",
    search: "Internet Explorer",
    // mail: "Contact Me",
    contacts: "Contacts",
    notepad: "Notepad",
    paint: "Paint",
    // music: "CD Player",
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
    // music: "CD Player",
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

type MineCell = {
    adjacent: number;
    col: number;
    isExploded: boolean;
    isFlagged: boolean;
    isMine: boolean;
    isRevealed: boolean;
    row: number;
};

type MineLevel = {
    cols: number;
    label: string;
    mines: number;
    rows: number;
};

type MineStatus = "ready" | "playing" | "won" | "lost";

const mineLevel: MineLevel = {
    label: "Intermediate",
    rows: 16,
    cols: 16,
    mines: 40,
};

const neighborOffsets = [-1, 0, 1] as const;

function createEmptyMineBoard(rows: number, cols: number): MineCell[][] {
    return Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => ({
            adjacent: 0,
            col,
            isExploded: false,
            isFlagged: false,
            isMine: false,
            isRevealed: false,
            row,
        })),
    );
}

function cloneMineBoard(board: MineCell[][]) {
    return board.map((row) => row.map((cell) => ({ ...cell })));
}

function isInsideBoard(board: MineCell[][], row: number, col: number) {
    return row >= 0 && row < board.length && col >= 0 && col < board[0].length;
}

function createRandomMineBoard(
    level: MineLevel,
    safeRow: number,
    safeCol: number,
) {
    const board = createEmptyMineBoard(level.rows, level.cols);
    const safeCells = new Set<string>();

    for (const rowOffset of neighborOffsets) {
        for (const colOffset of neighborOffsets) {
            const row = safeRow + rowOffset;
            const col = safeCol + colOffset;

            if (isInsideBoard(board, row, col)) {
                safeCells.add(`${row}:${col}`);
            }
        }
    }

    const mineCandidates = board
        .flat()
        .filter((cell) => !safeCells.has(`${cell.row}:${cell.col}`));

    for (let index = mineCandidates.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [mineCandidates[index], mineCandidates[swapIndex]] = [
            mineCandidates[swapIndex],
            mineCandidates[index],
        ];
    }

    mineCandidates.slice(0, level.mines).forEach((cell) => {
        board[cell.row][cell.col].isMine = true;
    });

    board.forEach((row) => {
        row.forEach((cell) => {
            if (cell.isMine) {
                return;
            }

            let adjacent = 0;

            for (const rowOffset of neighborOffsets) {
                for (const colOffset of neighborOffsets) {
                    if (rowOffset === 0 && colOffset === 0) {
                        continue;
                    }

                    const neighborRow = cell.row + rowOffset;
                    const neighborCol = cell.col + colOffset;

                    if (
                        isInsideBoard(board, neighborRow, neighborCol) &&
                        board[neighborRow][neighborCol].isMine
                    ) {
                        adjacent += 1;
                    }
                }
            }

            cell.adjacent = adjacent;
        });
    });

    return board;
}

function revealMineCells(board: MineCell[][], row?: number, col?: number) {
    const nextBoard = cloneMineBoard(board);

    nextBoard.forEach((boardRow) => {
        boardRow.forEach((cell) => {
            if (cell.isMine) {
                cell.isRevealed = true;
            }
        });
    });

    if (row !== undefined && col !== undefined) {
        nextBoard[row][col].isExploded = true;
    }

    return nextBoard;
}

function revealOpenArea(
    board: MineCell[][],
    startRow: number,
    startCol: number,
) {
    const nextBoard = cloneMineBoard(board);
    const stack: MineCell[] = [nextBoard[startRow][startCol]];

    while (stack.length > 0) {
        const cell = stack.pop();

        if (!cell || cell.isRevealed || cell.isFlagged || cell.isMine) {
            continue;
        }

        cell.isRevealed = true;

        if (cell.adjacent !== 0) {
            continue;
        }

        for (const rowOffset of neighborOffsets) {
            for (const colOffset of neighborOffsets) {
                if (rowOffset === 0 && colOffset === 0) {
                    continue;
                }

                const row = cell.row + rowOffset;
                const col = cell.col + colOffset;

                if (isInsideBoard(nextBoard, row, col)) {
                    stack.push(nextBoard[row][col]);
                }
            }
        }
    }

    return nextBoard;
}

function hasClearedMineBoard(board: MineCell[][]) {
    return board.flat().every((cell) => cell.isMine || cell.isRevealed);
}

function formatMineCounter(value: number) {
    if (value < 0) {
        return `-${String(Math.abs(value)).padStart(2, "0").slice(0, 2)}`;
    }

    return String(Math.min(value, 999)).padStart(3, "0");
}

function formatMineTime(value: number) {
    return String(Math.min(value, 999)).padStart(3, "0");
}

function copyTextFallback(value: string) {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
}

async function copyToClipboard(value: string) {
    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(value);
            return;
        } catch {
            copyTextFallback(value);
            return;
        }
    }

    copyTextFallback(value);
}

function contactCopyValue(href: string) {
    return href.replace(/^mailto:/, "");
}

type WindowBounds = {
    height: number;
    width: number;
    x: number;
    y: number;
};

type DesktopWindow = {
    bounds: WindowBounds;
    view: AppView;
    zIndex: number;
};

type ResizeEdge = "n" | "e" | "s" | "w" | "ne" | "nw" | "se" | "sw";

type WindowInteraction =
    | {
          origin: WindowBounds;
          pointerX: number;
          pointerY: number;
          type: "drag";
          view: AppView;
      }
    | {
          edge: ResizeEdge;
          origin: WindowBounds;
          pointerX: number;
          pointerY: number;
          type: "resize";
          view: AppView;
      };

const defaultWindowBounds: Record<
    AppView,
    Pick<WindowBounds, "width" | "height">
> = {
    home: { width: 820, height: 610 },
    experience: { width: 920, height: 640 },
    search: { width: 620, height: 440 },
    contacts: { width: 690, height: 470 },
    notepad: { width: 900, height: 610 },
    paint: { width: 940, height: 650 },
    // music: { width: 520, height: 570 },
    minesweeper: { width: 360, height: 430 },
};

const minWindowBounds = {
    height: 260,
    width: 330,
};

function createDesktopWindow(
    view: AppView,
    index: number,
    zIndex: number,
): DesktopWindow {
    const defaults = defaultWindowBounds[view];

    return {
        bounds: {
            height: defaults.height,
            width: defaults.width,
            x: 18 + index * 34,
            y: 18 + index * 28,
        },
        view,
        zIndex,
    };
}

function clampWindowBounds(
    bounds: WindowBounds,
    workspace: HTMLDivElement | null,
): WindowBounds {
    if (!workspace) {
        return bounds;
    }

    const maxWidth = Math.max(minWindowBounds.width, workspace.clientWidth);
    const maxHeight = Math.max(minWindowBounds.height, workspace.clientHeight);
    const width = Math.min(
        Math.max(bounds.width, minWindowBounds.width),
        maxWidth,
    );
    const height = Math.min(
        Math.max(bounds.height, minWindowBounds.height),
        maxHeight,
    );

    return {
        height,
        width,
        x: Math.min(Math.max(bounds.x, 0), Math.max(0, maxWidth - width)),
        y: Math.min(Math.max(bounds.y, 0), Math.max(0, maxHeight - height)),
    };
}

function resizeWindowBounds(
    origin: WindowBounds,
    edge: ResizeEdge,
    deltaX: number,
    deltaY: number,
) {
    let { height, width, x, y } = origin;

    if (edge.includes("e")) {
        width += deltaX;
    }

    if (edge.includes("s")) {
        height += deltaY;
    }

    if (edge.includes("w")) {
        width -= deltaX;
        x += deltaX;
    }

    if (edge.includes("n")) {
        height -= deltaY;
        y += deltaY;
    }

    if (width < minWindowBounds.width) {
        if (edge.includes("w")) {
            x -= minWindowBounds.width - width;
        }

        width = minWindowBounds.width;
    }

    if (height < minWindowBounds.height) {
        if (edge.includes("n")) {
            y -= minWindowBounds.height - height;
        }

        height = minWindowBounds.height;
    }

    return { height, width, x, y };
}

function hasBrowserChrome(view: AppView) {
    return view === "home" || view === "experience" || view === "search";
}
function App() {
    const initialView = viewFromPath(
        sessionStorage.getItem("redirectPath") ?? window.location.pathname,
    );
    const [openWindows, setOpenWindows] = useState<DesktopWindow[]>(() => [
        createDesktopWindow(initialView, 0, 2),
    ]);
    const [activeWindow, setActiveWindow] = useState<AppView>(initialView);
    const [interaction, setInteraction] = useState<WindowInteraction | null>(
        null,
    );
    const [selectedExperience, setSelectedExperience] =
        useState<Experience | null>(null);
    const workspaceRef = useRef<HTMLDivElement>(null);
    const zIndexRef = useRef(3);

    function nextZIndex() {
        zIndexRef.current += 1;
        return zIndexRef.current;
    }

    function updateWindowBounds(view: AppView, bounds: WindowBounds) {
        setOpenWindows((currentWindows) =>
            currentWindows.map((item) =>
                item.view === view
                    ? {
                          ...item,
                          bounds: clampWindowBounds(
                              bounds,
                              workspaceRef.current,
                          ),
                      }
                    : item,
            ),
        );
    }

    function focusWindow(view: AppView) {
        const zIndex = nextZIndex();
        setActiveWindow(view);
        setOpenWindows((currentWindows) =>
            currentWindows.map((item) =>
                item.view === view ? { ...item, zIndex } : item,
            ),
        );
    }

    function openView(view: AppView, shouldPushHistory = true) {
        const zIndex = nextZIndex();

        setActiveWindow(view);
        setOpenWindows([createDesktopWindow(view, 0, zIndex)]);

        if (shouldPushHistory) {
            window.history.pushState(null, "", pathByView[view]);
        }
    }

    function closeWindow(view: AppView) {
        setInteraction((currentInteraction) =>
            currentInteraction?.view === view ? null : currentInteraction,
        );
        setOpenWindows([]);
    }

    function beginDrag(
        event: PointerEvent<HTMLElement>,
        desktopWindow: DesktopWindow,
    ) {
        if (event.button !== 0) {
            return;
        }

        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        focusWindow(desktopWindow.view);
        setInteraction({
            origin: desktopWindow.bounds,
            pointerX: event.clientX,
            pointerY: event.clientY,
            type: "drag",
            view: desktopWindow.view,
        });
    }

    function beginResize(
        event: PointerEvent<HTMLSpanElement>,
        desktopWindow: DesktopWindow,
        edge: ResizeEdge,
    ) {
        if (event.button !== 0) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        focusWindow(desktopWindow.view);
        setInteraction({
            edge,
            origin: desktopWindow.bounds,
            pointerX: event.clientX,
            pointerY: event.clientY,
            type: "resize",
            view: desktopWindow.view,
        });
    }

    useEffect(() => {
        const redirectedPath = sessionStorage.getItem("redirectPath");

        if (redirectedPath) {
            sessionStorage.removeItem("redirectPath");
            window.history.replaceState(null, "", redirectedPath);
            openView(viewFromPath(redirectedPath), false);
        }

        const handlePopState = () =>
            openView(viewFromPath(window.location.pathname), false);
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    useEffect(() => {
        if (!interaction) {
            return;
        }

        const currentInteraction = interaction;

        function handlePointerMove(event: globalThis.PointerEvent) {
            const deltaX = event.clientX - currentInteraction.pointerX;
            const deltaY = event.clientY - currentInteraction.pointerY;
            const nextBounds =
                currentInteraction.type === "drag"
                    ? {
                          ...currentInteraction.origin,
                          x: currentInteraction.origin.x + deltaX,
                          y: currentInteraction.origin.y + deltaY,
                      }
                    : resizeWindowBounds(
                          currentInteraction.origin,
                          currentInteraction.edge,
                          deltaX,
                          deltaY,
                      );

            updateWindowBounds(currentInteraction.view, nextBounds);
        }

        function handlePointerUp() {
            setInteraction(null);
        }

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        window.addEventListener("pointercancel", handlePointerUp);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointercancel", handlePointerUp);
        };
    }, [interaction]);

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

            <div
                className="workspace"
                aria-label="Retro desktop workspace"
                ref={workspaceRef}
            >
                {openWindows.length === 0 && (
                    <DesktopShortcuts onOpen={openView} />
                )}
                {openWindows.map((desktopWindow) => (
                    <AppWindowFrame
                        activeWindow={activeWindow}
                        desktopWindow={desktopWindow}
                        interaction={interaction}
                        key={desktopWindow.view}
                        onBeginDrag={beginDrag}
                        onClose={closeWindow}
                        onFocus={focusWindow}
                        onOpenView={openView}
                        onShowMore={setSelectedExperience}
                    />
                ))}
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
                    {desktopApps.map((app) => {
                        const isAppOpen = openWindows.some((item) =>
                            app.id === "home"
                                ? hasBrowserChrome(item.view)
                                : item.view === app.id,
                        );
                        const isAppActive =
                            isAppOpen &&
                            (app.id === "home"
                                ? hasBrowserChrome(activeWindow)
                                : activeWindow === app.id);

                        return (
                            <button
                                className={
                                    isAppActive
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
                        );
                    })}
                </nav>
                <time dateTime="2026">33:72 PM</time>
            </footer>
        </main>
    );
}

function AppWindowFrame({
    activeWindow,
    desktopWindow,
    interaction,
    onBeginDrag,
    onClose,
    onFocus,
    onOpenView,
    onShowMore,
}: {
    activeWindow: AppView;
    desktopWindow: DesktopWindow;
    interaction: WindowInteraction | null;
    onBeginDrag: (
        event: PointerEvent<HTMLElement>,
        desktopWindow: DesktopWindow,
    ) => void;
    onClose: (view: AppView) => void;
    onFocus: (view: AppView) => void;
    onOpenView: (view: AppView) => void;
    onShowMore: (experience: Experience) => void;
}) {
    const view = desktopWindow.view;
    const isActive = activeWindow === view;
    const isDragging =
        interaction?.type === "drag" && interaction.view === view;

    return (
        <section
            className={
                isActive
                    ? `window app-window app-window-${view} is-active`
                    : `window app-window app-window-${view}`
            }
            aria-labelledby={`window-title-${view}`}
            style={{
                zIndex: desktopWindow.zIndex,
            }}
            onPointerDown={() => onFocus(view)}
        >
            <header
                className={isDragging ? "title-bar is-dragging" : "title-bar"}
                onPointerDown={(event) => onBeginDrag(event, desktopWindow)}
            >
                <h2 id={`window-title-${view}`}>{windowTitles[view]}</h2>
                <div className="window-controls">
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                    <button
                        className="window-control-button"
                        type="button"
                        aria-label="Close window"
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={() => onClose(view)}
                    >
                        X
                    </button>
                </div>
            </header>

            {hasBrowserChrome(view) ? (
                <>
                    <div className="menu-bar">
                        {[
                            ...browserTabs,
                            ...(view === "search"
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
                                    view === tab.id ? "tab is-active" : "tab"
                                }
                                key={tab.id}
                                onClick={() => onOpenView(tab.id)}
                                type="button"
                            >
                                {tab.label}
                            </button>
                        ))}
                        <button
                            className="tab new-tab"
                            type="button"
                            aria-label="Open new tab"
                            onClick={() => onOpenView("search")}
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
                            {addressText(view)}
                        </span>
                        <button
                            className="button small"
                            type="button"
                            disabled={view !== "search"}
                            onClick={() =>
                                googleSearch(
                                    view === "search" ? "" : "laasyaaki.com",
                                )
                            }
                        >
                            Search
                        </button>
                    </div>
                </>
            ) : null}

            <div className="window-body">
                {view === "home" && <HomePanel />}
                {view === "experience" && (
                    <ExperiencePanel onShowMore={onShowMore} />
                )}
                {view === "search" && <SearchPanel />}
                {view === "contacts" && <ContactsPanel />}
                {view === "notepad" && <BlogPanel />}
                {view === "paint" && <PaintPanel />}
                {/* {view === "music" && <MusicPanel />} */}
                {view === "minesweeper" && <MinesweeperPanel />}
            </div>
        </section>
    );
}
function HomePanel() {
    return (
        <div>
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

// function MusicPanel() {
//     return (
//         <div className="music-app">
//             <div className="music-menu" aria-hidden="true">
//                 <span>Disc</span>
//                 <span>View</span>
//                 <span>Options</span>
//                 <span>Help</span>
//             </div>
//             <div className="music-display" aria-label="CD player display">
//                 <span className="music-display-label">Track</span>
//                 <strong>01</strong>
//                 <span className="music-display-time">00:00</span>
//             </div>
//             <div className="music-controls" aria-label="CD player controls">
//                 <button type="button" aria-label="Previous track">
//                     |?
//                 </button>
//                 <button type="button" aria-label="Play">
//                     ?
//                 </button>
//                 <button type="button" aria-label="Pause">
//                     ??
//                 </button>
//                 <button type="button" aria-label="Stop">
//                     ?
//                 </button>
//                 <button type="button" aria-label="Next track">
//                     ?|
//                 </button>
//                 <button type="button" aria-label="Eject">
//                     ?
//                 </button>
//             </div>

//             <iframe
//                 className="spotify-embed"
//                 src={spotifyPlaylistEmbedUrl}
//                 title="Spotify playlist"
//                 allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
//                 loading="lazy"
//                 frameBorder="0"
//             />
//         </div>
//     );
// }

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
                    {/* <PhotoStrip title={experience.title} offset={index} /> */}
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
    const [copiedLink, setCopiedLink] = useState<string | null>(null);
    const copyTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) {
                window.clearTimeout(copyTimeoutRef.current);
            }
        };
    }, []);

    async function handleCopy(link: { label: string; href: string }) {
        const value = contactCopyValue(link.href);

        try {
            await copyToClipboard(value);
        } catch {
            return;
        }

        setCopiedLink(link.label);

        if (copyTimeoutRef.current) {
            window.clearTimeout(copyTimeoutRef.current);
        }

        copyTimeoutRef.current = window.setTimeout(() => {
            setCopiedLink(null);
            copyTimeoutRef.current = null;
        }, 1800);
    }

    return (
        <div className="contacts-app">
            <aside className="contacts-sidebar">
                <strong>Contacts</strong>
                <span>{links.length} entries</span>
            </aside>
            <div className="contact-list">
                {links.map((link) => (
                    <article className="contact-card" key={link.label}>
                        <a
                            className="contact-link"
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span className="social-icon" aria-hidden="true">
                                <BrandIcon label={link.label} />
                            </span>
                            <span>
                                <strong>{link.label}</strong>
                                <small>{contactCopyValue(link.href)}</small>
                            </span>
                        </a>
                        <button
                            className={
                                copiedLink === link.label
                                    ? "copy-button is-copied"
                                    : "copy-button"
                            }
                            type="button"
                            aria-label={`Copy ${link.label}`}
                            title={`Copy ${link.label}`}
                            onClick={() => void handleCopy(link)}
                        >
                            {copiedLink === link.label ? (
                                <CheckIcon />
                            ) : (
                                <CopyIcon />
                            )}
                        </button>
                    </article>
                ))}
            </div>
        </div>
    );
}

function MinesweeperPanel() {
    const [board, setBoard] = useState(() =>
        createEmptyMineBoard(mineLevel.rows, mineLevel.cols),
    );
    const [status, setStatus] = useState<MineStatus>("ready");
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (status !== "playing") {
            return;
        }

        const intervalId = window.setInterval(() => {
            setSeconds((currentSeconds) => Math.min(currentSeconds + 1, 999));
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [status]);

    const flagCount = board.flat().filter((cell) => cell.isFlagged).length;
    const remainingMines = mineLevel.mines - flagCount;

    function resetGame() {
        setBoard(createEmptyMineBoard(mineLevel.rows, mineLevel.cols));
        setStatus("ready");
        setSeconds(0);
    }

    function handleCellReveal(row: number, col: number) {
        if (status === "lost" || status === "won") {
            return;
        }

        setBoard((currentBoard) => {
            const selectedCell = currentBoard[row]?.[col];

            if (
                !selectedCell ||
                selectedCell.isFlagged ||
                selectedCell.isRevealed
            ) {
                return currentBoard;
            }

            const activeBoard =
                status === "ready"
                    ? createRandomMineBoard(mineLevel, row, col)
                    : cloneMineBoard(currentBoard);

            if (status === "ready") {
                setStatus("playing");
            }

            const cell = activeBoard[row][col];

            if (cell.isMine) {
                setStatus("lost");
                return revealMineCells(activeBoard, row, col);
            }

            const revealedBoard = revealOpenArea(activeBoard, row, col);

            if (hasClearedMineBoard(revealedBoard)) {
                setStatus("won");
                return revealMineCells(revealedBoard);
            }

            return revealedBoard;
        });
    }

    function handleCellFlag(
        event: MouseEvent<HTMLButtonElement>,
        row: number,
        col: number,
    ) {
        event.preventDefault();

        if (status === "lost" || status === "won") {
            return;
        }

        setBoard((currentBoard) => {
            const selectedCell = currentBoard[row]?.[col];

            if (!selectedCell || selectedCell.isRevealed) {
                return currentBoard;
            }

            const nextBoard = cloneMineBoard(currentBoard);
            nextBoard[row][col].isFlagged = !nextBoard[row][col].isFlagged;
            return nextBoard;
        });
    }

    return (
        <div className="minesweeper-app">
            <div className="mine-classic-menu" aria-label="Minesweeper menu">
                <span>Game</span>
                <span>Help</span>
            </div>

            <div className="mine-shell">
                <div className="mine-scorebar">
                    <div className="mine-display" aria-label="Mines remaining">
                        {formatMineCounter(remainingMines)}
                    </div>
                    <button
                        className={`mine-face mine-face-${status}`}
                        type="button"
                        aria-label="New game"
                        onClick={() => resetGame()}
                    >
                        {status === "lost"
                            ? "Boom! Retry?"
                            : status === "won"
                              ? "Yay! Retry?"
                              : "Reset"}
                    </button>
                    <div className="mine-display" aria-label="Seconds elapsed">
                        {formatMineTime(seconds)}
                    </div>
                </div>

                <div className="mine-board-wrap">
                    <div
                        className="mine-board"
                        style={{
                            gridTemplateColumns: `repeat(${mineLevel.cols}, 16px)`,
                        }}
                    >
                        {board.flat().map((cell) => {
                            const cellClasses = [
                                "mine-cell",
                                cell.isRevealed ? "is-revealed" : "",
                                cell.isFlagged ? "is-flagged" : "",
                                cell.isMine && cell.isRevealed ? "is-mine" : "",
                                cell.isExploded ? "is-exploded" : "",
                                cell.isRevealed && cell.adjacent > 0
                                    ? `mine-count-${cell.adjacent}`
                                    : "",
                            ]
                                .filter(Boolean)
                                .join(" ");
                            const cellText = cell.isRevealed
                                ? cell.isMine
                                    ? "*"
                                    : cell.adjacent || ""
                                : cell.isFlagged
                                  ? "F"
                                  : "";

                            return (
                                <button
                                    aria-label={`Row ${cell.row + 1}, column ${cell.col + 1}`}
                                    className={cellClasses}
                                    key={`${cell.row}-${cell.col}`}
                                    type="button"
                                    onClick={() =>
                                        handleCellReveal(cell.row, cell.col)
                                    }
                                    onContextMenu={(event) =>
                                        handleCellFlag(
                                            event,
                                            cell.row,
                                            cell.col,
                                        )
                                    }
                                >
                                    {cellText}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
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

function CopyIcon() {
    return (
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <rect x="8" y="8" width="11" height="11" />
            <path d="M5 15H4V4h11v1" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path d="m5 12 4 4 10-10" />
        </svg>
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
    type: "mail" | "contacts" | "paint" | "notepad" | "music" | "minesweeper";
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
            {type === "music" && (
                <>
                    <rect x="4" y="7" width="24" height="19" />
                    <circle cx="16" cy="16.5" r="6" />
                    <circle cx="16" cy="16.5" r="1.5" />
                    <path d="M7 4h18v3H7zM7 23h4" />
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
