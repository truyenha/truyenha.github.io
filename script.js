import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://yqarsofpiwyrojvzrirt.supabase.co";
const SUPABASE_KEY = "sb_publishable_TyaNbO4RVgFgBBBqD9-Pzg_7LjVjRNB";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let stories = [];
let currentStory = null;
let currentChapterIndex = 0;

const homePage = document.getElementById("homePage");
const storyPage = document.getElementById("storyPage");
const readerPage = document.getElementById("readerPage");

async function loadOnlineStories() {
    const { data, error } = await supabase
        .from("stories")
        .select(`
            *,
            chapters (*)
        `)
        .order("created_at", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    stories = data || [];

    stories.forEach(story => {
        story.chapters = story.chapters || [];

        story.chapters.sort(
            (a, b) => a.chapter_number - b.chapter_number
        );
    });

    renderHome();
}

function renderHome() {
    homePage.innerHTML = "";

    if (stories.length === 0) {
        homePage.innerHTML = "<p>Chưa có truyện.</p>";
        return;
    }

    stories.forEach(story => {
        const card = document.createElement("div");
        card.className = "story-card";

        card.innerHTML = `
            <h2>${escapeHtml(story.title)}</h2>
            <p>${escapeHtml(story.volume || "")}</p>
            <p>${escapeHtml(story.author || "")}</p>
            <p>${story.chapters.length} chương</p>
        `;

        card.onclick = () => openStory(story);

        homePage.appendChild(card);
    });
}

function openStory(story) {
    currentStory = story;

    homePage.style.display = "none";
    readerPage.style.display = "none";
    storyPage.style.display = "block";

    renderChapterList();
    window.scrollTo(0, 0);
}

function renderChapterList() {
    storyPage.innerHTML = `
        <button onclick="goHome()">← Danh sách truyện</button>

        <h1>${escapeHtml(currentStory.title)}</h1>

        <p>
            ${escapeHtml(currentStory.volume || "")}
            ${currentStory.author ? " · " + escapeHtml(currentStory.author) : ""}
        </p>

        <div id="chapterList"></div>
    `;

    const chapterList = document.getElementById("chapterList");

    currentStory.chapters.forEach((chapter, index) => {
        const row = document.createElement("div");
        row.className = "chapter-row";

        row.innerHTML = `
            <span>
                Chap ${chapter.chapter_number}
                ${chapter.chapter_title ? ": " + escapeHtml(chapter.chapter_title) : ""}
            </span>
        `;

        row.onclick = () => openChapter(index);

        chapterList.appendChild(row);
    });
}

function openChapter(index) {
    currentChapterIndex = index;

    const chapter = currentStory.chapters[index];

    homePage.style.display = "none";
    storyPage.style.display = "none";
    readerPage.style.display = "block";

    renderReader(chapter);

    window.scrollTo(0, 0);
}

function renderReader(chapter) {
    const total = currentStory.chapters.length;

    const prevButton =
        currentChapterIndex > 0
            ? `<button onclick="openChapter(${currentChapterIndex - 1})">← Chương trước</button>`
            : `<button disabled>← Chương trước</button>`;

    const nextButton =
        currentChapterIndex < total - 1
            ? `<button onclick="openChapter(${currentChapterIndex + 1})">Chương sau →</button>`
            : `<button disabled>Chương sau →</button>`;

    readerPage.innerHTML = `
        <button class="back-chapters" onclick="backToChapters()">
            📚 Danh sách chương
        </button>

        <div class="reader-nav">
            ${prevButton}
            ${nextButton}
        </div>

        <h1>${escapeHtml(currentStory.title)}</h1>

        <h2>
            Chap ${chapter.chapter_number}
            ${chapter.chapter_title ? ": " + escapeHtml(chapter.chapter_title) : ""}
        </h2>

        <div class="reader-content">
            ${formatContent(chapter.content)}
        </div>

        <div class="reader-nav bottom-nav">
            ${prevButton}
            ${nextButton}
        </div>

        <button class="back-chapters bottom-back" onclick="backToChapters()">
            📚 Danh sách chương
        </button>
    `;
}

function backToChapters() {
    readerPage.style.display = "none";
    storyPage.style.display = "block";

    renderChapterList();

    window.scrollTo(0, 0);
}

function goHome() {
    readerPage.style.display = "none";
    storyPage.style.display = "none";
    homePage.style.display = "block";

    window.scrollTo(0, 0);
}

function formatContent(text) {
    return escapeHtml(text)
        .split(/\n\s*\n/)
        .map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`)
        .join("");
}

function escapeHtml(text) {
    if (text === null || text === undefined) return "";

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

window.openChapter = openChapter;
window.backToChapters = backToChapters;
window.goHome = goHome;

loadOnlineStories();
