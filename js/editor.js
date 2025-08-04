//---------------------------------
// 설정
//---------------------------------
const DATA_URL = "novel.json"; // 동일 디렉터리 기준
//---------------------------------

let novel = {};
let currentIndex = -1;
const $toc = document.getElementById("toc");
const $view = document.getElementById("chapter-view");
const $title = document.getElementById("chapter-title");
const $content = document.getElementById("chapter-content");
const $prev = document.getElementById("prev-btn");
const $next = document.getElementById("next-btn");
const $tocBtn = document.getElementById("toc-btn");
const $form = document.getElementById("chapter-form");
const $newTitle = document.getElementById("new-title");
const $newContent = document.getElementById("new-content");

async function loadNovel() {
  const res = await fetch(DATA_URL + `?t=${Date.now()}`); // 캐시 방지
  novel = await res.json();
  document.getElementById("novel-title").textContent = novel.title;
  document.getElementById("novel-desc").textContent = novel.description;
  renderTOC();
}

// 목차 그리기
function renderTOC() {
  $toc.innerHTML = "<h2>목차</h2>";
  novel.chapters.forEach((ch, idx) => {
    const btn = document.createElement("button");
    btn.textContent = `${idx + 1}화. ${ch.title}`;
    btn.onclick = () => showChapter(idx);
    $toc.appendChild(btn);
  });
}

// 회차 보기
function showChapter(idx) {
  currentIndex = idx;
  const ch = novel.chapters[idx];
  $title.textContent = `${idx + 1}화. ${ch.title}`;
  $content.innerHTML = ch.content.replace(/\n/g, "<br/>");
  [$toc, $view].forEach(el => (el.hidden = !el.hidden));
  updateNavButtons();
}

// 네비게이션 버튼 활성화
function updateNavButtons() {
  $prev.disabled = currentIndex <= 0;
  $next.disabled = currentIndex >= novel.chapters.length - 1;
}

// 버튼 핸들러
$prev.onclick = () => showChapter(currentIndex - 1);
$next.onclick = () => showChapter(currentIndex + 1);
$tocBtn.onclick = () => {
  [$toc, $view].forEach(el => (el.hidden = !el.hidden));
};

// 회차 추가
$form.addEventListener("submit", async e => {
  e.preventDefault();
  const newChapter = {
    id: novel.chapters.length + 1,
    title: $newTitle.value.trim(),
    content: $newContent.value.trim(),
    publishedDate: new Date().toISOString().slice(0, 10),
    wordCount: $newContent.value.trim().split(/\s+/).length
  };
  novel.chapters.push(newChapter);
  saveNovel(); // GitHub API 연동 자리
  renderTOC();
  $form.reset();
});

// -------------------------
// GitHub API와 연결하는 부분
// -------------------------
// 현재 코드는 데모용으로만 로컬 상태에 저장됩니다.
// 실제 배포 후 GitHub에 자동 커밋하려면 아래 함수를
// GitHub REST API(v3) 호출로 교체하세요.
function saveNovel() {
  localStorage.setItem("novelTemp", JSON.stringify(novel));
  alert("(데모) 로컬에 임시 저장되었습니다.");
}

// 로컬 임시 JSON이 있으면 우선 사용
function loadTemp() {
  const tmp = localStorage.getItem("novelTemp");
  if (tmp) novel = JSON.parse(tmp);
}

loadTemp();
loadNovel();
