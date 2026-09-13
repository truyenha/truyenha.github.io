// =====================================================
// TỦ TRUYỆN
// =====================================================


// =====================================================
// KHO TRUYỆN
// =====================================================

let stories = loadStories();


// Truyện hiện tại
let currentStory = null;


// Chương hiện tại
let currentChapterIndex = 0;


// Cỡ chữ
let fontSize = 18;


// =====================================================
// LƯU DỮ LIỆU
// =====================================================

function saveStories() {

    localStorage.setItem(
        "tuTruyenData",
        JSON.stringify(stories)
    );

}


// =====================================================
// ĐỌC DỮ LIỆU
// =====================================================

function loadStories() {

    const saved =
        localStorage.getItem(
            "tuTruyenData"
        );


    if (!saved) {

        return [];

    }


    try {

        return JSON.parse(saved);

    }
    catch (error) {

        console.error(error);

        return [];

    }

}


// =====================================================
// HIỂN THỊ DANH SÁCH TRUYỆN
// =====================================================

function renderStories(list = stories) {

    const storyList =
        document.getElementById(
            "storyList"
        );


    storyList.innerHTML = "";


    if (list.length === 0) {

        storyList.innerHTML = `

            <div class="story-card">

                <h3>
                    📚 Chưa có truyện
                </h3>

                <p>
                    Hãy chọn file TXT
                    để thêm truyện.
                </p>

            </div>

        `;

        return;

    }


    list.forEach(story => {

        const div =
            document.createElement(
                "div"
            );


        div.className =
            "story-card";


        div.innerHTML = `

            <h3>
                📖 ${escapeHTML(
                    story.title
                )}
            </h3>

            <p>
                ${escapeHTML(
                    story.volume || ""
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
                ${story.chapters.length}
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

    });

}


// =====================================================
// MỞ TRUYỆN
// =====================================================

function openStory(id) {

    currentStory =
        stories.find(
            story =>
                story.id === id
        );


    if (!currentStory) return;


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
// HIỂN THỊ CHƯƠNG
// =====================================================

function renderChapters() {

    const chapterList =
        document.getElementById(
            "chapterList"
        );


    chapterList.innerHTML = "";


    if (
        !currentStory ||
        currentStory.chapters.length === 0
    ) {

        chapterList.innerHTML =
            "<p>Chưa có chương.</p>";

        return;

    }


    currentStory.chapters.forEach(
        (chapter, index) => {

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
                `Chương ${chapter.number}: ${chapter.title}`;


            button.onclick =
                function () {

                    openChapter(index);

                };


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.className =
                "delete-chapter-btn";


            deleteButton.textContent =
                "🗑";


            deleteButton.title =
                "Xóa chương";


            deleteButton.onclick =
                function (event) {

                    event.stopPropagation();

                    deleteChapter(index);

                };


            row.appendChild(
                button
            );


            row.appendChild(
                deleteButton
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

function openChapter(index) {

    if (!currentStory) return;


    const chapter =
        currentStory.chapters[index];


    if (!chapter) return;


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
        `Chương ${chapter.number}: ${chapter.title}`;


    const content =
        document.getElementById(
            "storyContent"
        );


    content.innerHTML = "";


    const paragraphs =
        chapter.content
            .split(
                /\n\s*\n/
            )
            .map(
                paragraph => {

                    const p =
                        document.createElement(
                            "p"
                        );


                    p.textContent =
                        paragraph.trim();


                    return p;

                }
            );


    paragraphs.forEach(
        p => {

            if (
                p.textContent.trim()
            ) {

                content.appendChild(
                    p
                );

            }

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
    ) return;


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
    ) return;


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

    const buttons = [

        document.getElementById(
            "prevBtn"
        ),

        document.getElementById(
            "nextBtn"
        ),

        document.getElementById(
            "prevBtnTop"
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


    buttons[0].disabled =
        atFirst;


    buttons[2].disabled =
        atFirst;


    buttons[1].disabled =
        atLast;


    buttons[3].disabled =
        atLast;

}


// =====================================================
// XÓA TOÀN BỘ TRUYỆN
// =====================================================

function deleteCurrentStory() {

    if (!currentStory) {

        return;

    }


    const confirmDelete =
        confirm(
            `Bạn có chắc muốn xóa toàn bộ truyện "${currentStory.title}"?\n\nTất cả chương của truyện cũng sẽ bị xóa.`
        );


    if (!confirmDelete) {

        return;

    }


    const id =
        currentStory.id;


    stories =
        stories.filter(
            story =>
                story.id !== id
        );


    saveStories();


    currentStory =
        null;


    goHome();


    renderStories();

}


// =====================================================
// XÓA MỘT CHƯƠNG
// =====================================================

function deleteChapter(index) {

    if (!currentStory) {

        return;

    }


    const chapter =
        currentStory.chapters[index];


    if (!chapter) {

        return;

    }


    const confirmDelete =
        confirm(
            `Bạn có chắc muốn xóa Chương ${chapter.number}: ${chapter.title}?`
        );


    if (!confirmDelete) {

        return;

    }


    currentStory.chapters.splice(
        index,
        1
    );


    saveStories();


    renderChapters();


    renderStories();


    // Nếu xóa hết chương
    if (
        currentStory.chapters.length === 0
    ) {

        return;

    }

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

function changeFontSize(change) {

    fontSize += change;


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
// ĐỌC FILE TXT
// =====================================================

async function loadTxtFiles() {

    const input =
        document.getElementById(
            "txtFiles"
        );


    const files =
        Array.from(
            input.files
        );


    if (
        files.length === 0
    ) {

        alert(
            "Bạn chưa chọn file TXT."
        );

        return;

    }


    let addedCount = 0;

    let duplicateCount = 0;


    for (
        const file of files
    ) {

        try {

            const text =
                await readTextFile(
                    file
                );


            const chapter =
                parseTxtFile(
                    text,
                    file.name
                );


            if (!chapter) {

                continue;

            }


            const result =
                addChapterToStory(
                    chapter
                );


            if (
                result === "added"
            ) {

                addedCount++;

            }
            else if (
                result === "duplicate"
            ) {

                duplicateCount++;

            }

        }
        catch (error) {

            console.error(
                error
            );

        }

    }


    saveStories();


    renderStories();


    let message =
        `Đã thêm ${addedCount} chương.`;


    if (
        duplicateCount > 0
    ) {

        message +=
            `\n${duplicateCount} chương đã tồn tại và được bỏ qua.`;

    }


    alert(
        message
    );


    input.value = "";

}


// =====================================================
// ĐỌC TXT
// =====================================================

function readTextFile(file) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();


            reader.onload =
                function () {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                function () {

                    reject(
                        reader.error
                    );

                };


            reader.readAsText(
                file,
                "UTF-8"
            );

        }
    );

}


// =====================================================
// PHÂN TÍCH TXT
// =====================================================

function parseTxtFile(
    text,
    filename
) {

    text =
        text
            .replace(
                /\r\n/g,
                "\n"
            )
            .replace(
                /\r/g,
                "\n"
            );


    text =
        text.replace(
            /^\uFEFF/,
            ""
        );


    const lines =
        text.split("\n");


    // -----------------------------------------
    // TÊN TRUYỆN
    // -----------------------------------------

    const storyLine =
        (
            lines[0] || ""
        ).trim();


    if (!storyLine) {

        return null;

    }


    let storyTitle =
        storyLine;


    let volume =
        "";


    const volumeMatch =
        storyLine.match(
            /^(.*?)\s*-\s*Quyển\s*(\d+)\s*:\s*[“"]?(.*?)[”"]?\s*\.?\s*$/i
        );


    if (volumeMatch) {

        storyTitle =
            volumeMatch[1]
                .replace(
                    /[“”"]/g,
                    ""
                )
                .trim();


        volume =
            `Quyển ${volumeMatch[2]} - ` +
            volumeMatch[3]
                .replace(
                    /[“”"]/g,
                    ""
                )
                .trim();

    }


    // -----------------------------------------
    // TÁC GIẢ
    // -----------------------------------------

    let author = "";


    for (
        let i = 1;
        i < Math.min(
            lines.length,
            10
        );
        i++
    ) {

        const match =
            lines[i].match(
                /^\s*Tác\s*Giả\s*:\s*(.*?)\s*\.?\s*$/i
            );


        if (match) {

            author =
                match[1]
                    .trim();

            break;

        }

    }


    // -----------------------------------------
    // CHAP
    // -----------------------------------------

    let chapterIndex =
        -1;


    let chapterNumber =
        null;


    let chapterTitle =
        "";


    for (
        let i = 0;
        i < lines.length;
        i++
    ) {

        const line =
            lines[i].trim();


        const match =
            line.match(
                /^\s*Chap\s*(\d+)\s*:\s*[“"]?(.*?)[”"]?\s*\.?\s*$/i
            );


        if (match) {

            chapterIndex =
                i;


            chapterNumber =
                parseInt(
                    match[1],
                    10
                );


            chapterTitle =
                match[2]
                    .replace(
                        /[“”"]/g,
                        ""
                    )
                    .replace(
                        /\.$/,
                        ""
                    )
                    .trim();


            break;

        }

    }


    if (
        chapterIndex === -1
    ) {

        console.warn(
            "Không tìm thấy Chap:",
            filename
        );


        return null;

    }


    // -----------------------------------------
    // NỘI DUNG
    // -----------------------------------------

    const content =
        lines
            .slice(
                chapterIndex + 1
            )
            .join("\n")
            .trim();


    return {

        storyTitle:
            storyTitle,

        volume:
            volume,

        author:
            author,

        number:
            chapterNumber,

        title:
            chapterTitle,

        content:
            content,

        filename:
            filename

    };

}


// =====================================================
// THÊM CHƯƠNG
// =====================================================

function addChapterToStory(
    chapter
) {

    let story =
        stories.find(
            s =>
                s.title ===
                chapter.storyTitle
        );


    if (!story) {

        story = {

            id:
                Date.now() +
                Math.random(),

            title:
                chapter.storyTitle,

            volume:
                chapter.volume,

            author:
                chapter.author,

            chapters:
                []

        };


        stories.push(
            story
        );

    }


    const exists =
        story.chapters.some(
            oldChapter =>
                oldChapter.number ===
                chapter.number
        );


    if (exists) {

        return "duplicate";

    }


    story.chapters.push({

        number:
            chapter.number,

        title:
            chapter.title,

        content:
            chapter.content

    });


    story.chapters.sort(
        (
            a,
            b
        ) =>
            a.number -
            b.number
    );


    return "added";

}


// =====================================================
// CHỐNG HTML
// =====================================================

function escapeHTML(text) {

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
// KHỞI ĐỘNG
// =====================================================

renderStories();