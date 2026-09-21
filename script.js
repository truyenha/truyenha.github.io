// =====================================================
// TỦ TRUYỆN - ONLINE SUPABASE
// =====================================================

import {
    createClient
} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


// =====================================================
// SUPABASE
// =====================================================

const SUPABASE_URL =
    "https://yqarsofpiwyrojvzrirt.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_TyaNbO4RVgFgBBBqD9-Pzg_7LjVjRNB";

const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =====================================================
// BIẾN
// =====================================================

let stories = [];

let currentStory = null;

let currentChapterIndex = 0;

let fontSize = 18;


// =====================================================
// TẢI TRUYỆN
// =====================================================

async function loadOnlineStories() {

    try {

        const {
            data,
            error
        } =
        await supabase
            .from("stories")
            .select(`
                *,
                chapters (*)
            `)
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


        if (error) {
            throw error;
        }


        stories =
            data || [];


        // Sắp xếp chương
        stories.forEach(
            story => {

                if (
                    story.chapters
                ) {

                    story.chapters.sort(
                        (
                            a,
                            b
                        ) =>
                            a.chapter_number -
                            b.chapter_number
                    );

                }

            }
        );


        renderStories();

    }
    catch (error) {

        console.error(
            error
        );


        const storyList =
            document.getElementById(
                "storyList"
            );


        storyList.innerHTML = `
            <div class="story-card">

                <h3>
                    ⚠️ Không tải được kho truyện
                </h3>

                <p>
                    ${escapeHTML(
                        error.message ||
                        "Lỗi kết nối Supabase"
                    )}
                </p>

            </div>
        `;

    }

}


// =====================================================
// HIỂN THỊ DANH SÁCH TRUYỆN
// =====================================================

function renderStories(
    list = stories
) {

    const storyList =
        document.getElementById(
            "storyList"
        );


    storyList.innerHTML =
        "";


    if (
        list.length === 0
    ) {

        storyList.innerHTML = `
            <div class="story-card">

                <h3>
                    📚 Chưa có truyện
                </h3>

                <p>
                    Hãy vào trang quản trị trên PC
                    để thêm truyện.
                </p>

            </div>
        `;

        return;

    }


    list.forEach(
        story => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "story-card";


            div.innerHTML = `

                <h3>
                    📖
                    ${escapeHTML(
                        story.title
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        story.volume ||
                        ""
                    )}
                </p>

                <p>
                    Tác giả:
                    ${escapeHTML(
                        story.author ||
                        "Không rõ"
                    )}
                </p>

                <p>
                    ${
                        story.chapters
                            ? story.chapters.length
                            : 0
                    }
                    chương
                </p>

            `;


            div.onclick =
                function () {

                    openStory(
                        story.id
                    );

                };


            storyList.appendChild(
                div
            );

        }
    );

}


// =====================================================
// MỞ TRUYỆN
// =====================================================

function openStory(
    id
) {

    currentStory =
        stories.find(
            story =>
                story.id === id
        );


    if (
        !currentStory
    ) {
        return;
    }


    document
        .getElementById(
            "homePage"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "readerPage"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "chapterPage"
        )
        .classList.remove(
            "hidden"
        );


    document
        .getElementById(
            "storyTitle"
        )
        .textContent =
        currentStory.title;


    document
        .getElementById(
            "storyAuthor"
        )
        .textContent =
        `${currentStory.volume || ""} • Tác giả: ${currentStory.author || "Không rõ"}`;


    renderChapters();

}


// =====================================================
// DANH SÁCH CHƯƠNG
// =====================================================

function renderChapters() {

    const chapterList =
        document.getElementById(
            "chapterList"
        );


    chapterList.innerHTML =
        "";


    if (
        !currentStory ||
        !currentStory.chapters ||
        currentStory.chapters.length === 0
    ) {

        chapterList.innerHTML =
            "<p>Chưa có chương.</p>";

        return;

    }


    currentStory.chapters.forEach(
        (
            chapter,
            index
        ) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "chapter-row";


            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "chapter-item";


            button.textContent =
                `Chương ${chapter.chapter_number}: ${chapter.chapter_title || ""}`;


            button.onclick =
                function () {

                    openChapter(
                        index
                    );

                };


            row.appendChild(
                button
            );


            chapterList.appendChild(
                row
            );

        }
    );

}


// =====================================================
// MỞ CHƯƠNG
// =====================================================

function openChapter(
    index
) {

    if (
        !currentStory
    ) {
        return;
    }


    const chapter =
        currentStory.chapters[index];


    if (
        !chapter
    ) {
        return;
    }


    currentChapterIndex =
        index;


    document
        .getElementById(
            "chapterPage"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "homePage"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "readerPage"
        )
        .classList.remove(
            "hidden"
        );


    document
        .getElementById(
            "readerTitle"
        )
        .textContent =
        `Chương ${chapter.chapter_number}: ${chapter.chapter_title || ""}`;


    const content =
        document.getElementById(
            "storyContent"
        );


    content.innerHTML =
        "";


    const paragraphs =
        chapter.content
            .split(
                /\n\s*\n/
            );


    paragraphs.forEach(
        paragraph => {

            if (
                paragraph.trim() === ""
            ) {
                return;
            }


            const p =
                document.createElement(
                    "p"
                );


            p.textContent =
                paragraph.trim();


            content.appendChild(
                p
            );

        }
    );


    content.style.fontSize =
        fontSize + "px";


    updateNavigation();


    window.scrollTo(
        0,
        0
    );

}


// =====================================================
// CHƯƠNG TRƯỚC
// =====================================================

function previousChapter() {

    if (
        !currentStory
    ) {
        return;
    }


    if (
        currentChapterIndex > 0
    ) {

        openChapter(
            currentChapterIndex - 1
        );

    }

}


// =====================================================
// CHƯƠNG SAU
// =====================================================

function nextChapter() {

    if (
        !currentStory
    ) {
        return;
    }


    if (
        currentChapterIndex <
        currentStory.chapters.length - 1
    ) {

        openChapter(
            currentChapterIndex + 1
        );

    }

}


// =====================================================
// CẬP NHẬT NÚT CHUYỂN CHƯƠNG
// =====================================================

function updateNavigation() {

    const prevButtons = [

        document.getElementById(
            "prevBtn"
        ),

        document.getElementById(
            "prevBtnTop"
        )

    ];


    const nextButtons = [

        document.getElementById(
            "nextBtn"
        ),

        document.getElementById(
            "nextBtnTop"
        )

    ];


    const atFirst =
        currentChapterIndex === 0;


    const atLast =
        !currentStory ||
        currentChapterIndex >=
        currentStory.chapters.length - 1;


    prevButtons.forEach(
        button => {

            if (
                button
            ) {

                button.disabled =
                    atFirst;

            }

        }
    );


    nextButtons.forEach(
        button => {

            if (
                button
            ) {

                button.disabled =
                    atLast;

            }

        }
    );

}


// =====================================================
// VỀ TRANG CHỦ
// =====================================================

function goHome() {

    document
        .getElementById(
            "chapterPage"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "readerPage"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "homePage"
        )
        .classList.remove(
            "hidden"
        );


    renderStories();

}


// =====================================================
// VỀ DANH SÁCH CHƯƠNG
// =====================================================

function goChapters() {

    document
        .getElementById(
            "readerPage"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "chapterPage"
        )
        .classList.remove(
            "hidden"
        );


    renderChapters();

}


// =====================================================
// CỠ CHỮ
// =====================================================

function changeFontSize(
    change
) {

    fontSize +=
        change;


    if (
        fontSize < 14
    ) {

        fontSize = 14;

    }


    if (
        fontSize > 30
    ) {

        fontSize = 30;

    }


    const content =
        document.getElementById(
            "storyContent"
        );


    content.style.fontSize =
        fontSize + "px";

}


// =====================================================
// TÌM KIẾM
// =====================================================

document
    .getElementById(
        "searchInput"
    )
    .addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .toLowerCase()
                    .trim();


            const result =
                stories.filter(
                    story =>
                        story.title
                            .toLowerCase()
                            .includes(
                                keyword
                            )
                );


            renderStories(
                result
            );

        }
    );


// =====================================================
// DARK MODE
// =====================================================

document
    .getElementById(
        "darkModeBtn"
    )
    .onclick =
    function () {

        document.body
            .classList
            .toggle(
                "dark"
            );

    };


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(
    text
) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// BẮT ĐẦU
// =====================================================

loadOnlineStories();
