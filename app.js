const firebaseConfig = {
    apiKey: "AIzaSyCVMHC0cjVdruZ6e82Ipn3W21nbUJKQ07g",
    authDomain: "golden-hour-9693a.firebaseapp.com",
    projectId: "golden-hour-9693a",
    storageBucket: "golden-hour-9693a.firebasestorage.app",
    messagingSenderId: "513777333720",
    appId: "1:513777333720:web:2153c7b4422052ad0e2ead"
};

let db = null;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
} catch (e) {
    console.error("Firebase initialization error", e);
}

// 10문제 (힌트 및 해설 포함)
const questions = [
    {
        id: 1,
        text: "심정지 환자를 발견했을 때 가장 먼저 해야 할 행동은 무엇인가요?",
        options: ["즉시 119에 신고한다.", "환자의 어깨를 두드리며 의식을 확인한다.", "가슴압박을 시작한다.", "자동심장충격기(AED)를 가져온다."],
        answer: 1,
        hint: "무엇이든 환자의 상태를 파악하는 것이 가장 우선입니다.",
        explanation: "심정지 의심 환자를 발견하면 가장 먼저 다가가서 어깨를 가볍게 두드리며 \"괜찮으세요?\"라고 큰 소리로 묻고 의식을 확인해야 합니다."
    },
    {
        id: 2,
        text: "환자의 의식이 없다면 다음으로 취해야 할 행동은?",
        options: ["보호자에게 연락한다.", "주변 사람을 지목하여 119 신고와 AED를 요청한다.", "인공호흡을 2회 실시한다.", "따뜻한 물을 먹인다."],
        answer: 1,
        hint: "혼자서 모든 것을 다 할 수는 없습니다. 구조 요청이 필요합니다.",
        explanation: "의식이 없음을 확인하면 즉시 주변의 특정 사람을 지목하여 119 신고와 자동심장충격기(AED)를 가져다 달라고 명확하게 요청해야 합니다."
    },
    {
        id: 3,
        text: "가슴압박 시 올바른 압박 부위는 어디인가요?",
        options: ["가슴뼈(흉골)의 아래쪽 절반 부위", "명치 끝", "왼쪽 가슴(심장 부위)", "가슴뼈의 맨 윗부분"],
        answer: 0,
        hint: "가슴의 정중앙에서 약간 아래쪽 뼈 부분입니다.",
        explanation: "정확한 가슴압박 위치는 가슴뼈(흉골)의 아래쪽 절반 부위입니다. 명치를 누르지 않도록 주의해야 합니다."
    },
    {
        id: 4,
        text: "성인 대상 가슴압박 시 올바른 깊이와 속도는?",
        options: ["약 3cm 깊이, 분당 80회", "약 5cm 깊이, 분당 100~120회", "약 7cm 깊이, 분당 150회", "깊이는 상관없이 최대한 빠르게"],
        answer: 1,
        hint: "충분히 깊게, 그리고 1초에 약 2번 정도의 속도입니다.",
        explanation: "가슴압박은 약 5cm 깊이로, 1분에 100~120회의 속도로 강하고 빠르게 규칙적으로 실시해야 합니다."
    },
    {
        id: 5,
        text: "가슴압박을 할 때 주의해야 할 점으로 옳지 않은 것은?",
        options: ["압박 후에는 가슴이 원래 위치로 충분히 이완되도록 한다.", "팔꿈치를 곧게 펴고 환자의 가슴과 수직이 되도록 한다.", "손가락이 환자의 가슴에 닿지 않도록 주의한다.", "체중을 싣지 않고 팔의 힘만으로 누른다."],
        answer: 3,
        hint: "팔 힘만으로는 금방 지치고 충분한 깊이로 누를 수 없습니다.",
        explanation: "가슴압박은 팔의 힘이 아닌 체중을 실어서 해야 효과적이며 오랫동안 유지할 수 있습니다."
    },
    {
        id: 6,
        text: "자동심장충격기(AED)가 도착하면 가장 먼저 해야 할 일은?",
        options: ["패드를 부착한다.", "전원을 켠다.", "심장리듬 분석 버튼을 누른다.", "환자의 옷을 벗긴다."],
        answer: 1,
        hint: "모든 전자기기의 기본 조작입니다.",
        explanation: "AED가 도착하면 가장 먼저 전원 버튼을 켜야 합니다. 전원을 켜면 기계에서 나오는 음성 지시를 따라하면 됩니다."
    },
    {
        id: 7,
        text: "AED 패드의 올바른 부착 위치는?",
        options: ["우측 빗장뼈 아래, 좌측 젖꼭지 아래 중간겨드랑선", "좌측 빗장뼈 아래, 우측 젖꼭지 아래", "가슴 정중앙과 복부", "양쪽 어깨 위"],
        answer: 0,
        hint: "심장을 대각선으로 가로지르는 방향입니다.",
        explanation: "패드 1은 오른쪽 빗장뼈(쇄골) 아래에, 패드 2는 왼쪽 젖꼭지 아래 중간겨드랑선에 부착하여 전기 충격이 심장을 대각선으로 통과하게 합니다."
    },
    {
        id: 8,
        text: "AED가 '심장리듬을 분석 중입니다'라는 음성을 낼 때 해야 할 행동은?",
        options: ["계속해서 가슴압박을 한다.", "환자에게서 손을 떼고 물러난다.", "인공호흡을 준비한다.", "패드를 꾹 눌러준다."],
        answer: 1,
        hint: "분석 중에 흔들림이 있으면 기계가 정확한 분석을 할 수 없습니다.",
        explanation: "심장리듬 분석 중에는 오류를 막기 위해 환자에게서 손을 떼고 모두 물러나야 합니다."
    },
    {
        id: 9,
        text: "AED에서 '심장충격이 필요합니다'라고 한 후, 버튼이 깜빡일 때 해야 할 행동은?",
        options: ["즉시 버튼을 누른다.", "환자 주변 사람들에게 물러나라고 외친 후 접촉자가 없는지 확인하고 버튼을 누른다.", "충전이 완료되었으므로 가슴압박을 다시 시작한다.", "119에 다시 전화를 건다."],
        answer: 1,
        hint: "버튼을 누르기 전에 주변 사람들의 안전을 확인해야 합니다.",
        explanation: "심장충격 버튼을 누르기 전에는 반드시 주위 사람들에게 \"물러나세요!\"라고 외치고 아무도 환자와 접촉하고 있지 않은지 확인해야 합니다."
    },
    {
        id: 10,
        text: "AED가 심장충격을 실시한 직후 해야 할 일은?",
        options: ["환자의 의식이 돌아왔는지 확인한다.", "AED가 다음 지시를 할 때까지 기다린다.", "즉시 가슴압박을 다시 시작한다.", "인공호흡만 2회 실시한다."],
        answer: 2,
        hint: "심장충격 후 심장이 정상 리듬을 찾을 때까지 혈액을 순환시켜주어야 합니다.",
        explanation: "심장충격이 끝나면 지체 없이 즉시 가슴압박을 다시 시작하여 뇌와 심장에 혈류를 공급해야 합니다."
    }
];

// 게임 상태 변수
let currentQuestionIndex = 0;
let correctCount = 0;
let startTime = null;
let timerInterval = null;
let gemsCount = 3;
let studentInfo = { id: '' };

// DOM 요소
const screens = document.querySelectorAll('.screen');
const loginForm = document.getElementById('login-form');
const displayNickname = document.getElementById('display-nickname');
const timeDisplay = document.getElementById('time-display');
const progressText = document.getElementById('progress-text');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const doorContainer = document.querySelector('.door-transition-container');
const hintBtn = document.getElementById('hint-btn');
const gemsCountDisplay = document.getElementById('gems-count');
const explanationModal = document.getElementById('explanation-modal');
const explanationText = document.getElementById('explanation-text');
const nextQuestionBtn = document.getElementById('next-question-btn');

// Audio 요소
const bgm = document.getElementById('bgm');
const sfxCorrect = document.getElementById('sfx-correct');
const sfxWrong = document.getElementById('sfx-wrong');
const sfxDoor = document.getElementById('sfx-door');

// 음량 설정
bgm.volume = 0.3;
sfxCorrect.volume = 0.6;
sfxWrong.volume = 0.6;
sfxDoor.volume = 0.8;

// 화면 전환 함수
function showScreen(screenId) {
    screens.forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// 타이머 함수
function updateTimer() {
    if (!startTime) return;
    const now = new Date();
    const diff = Math.floor((now - startTime) / 1000);
    const minutes = String(Math.floor(diff / 60)).padStart(2, '0');
    const seconds = String(diff % 60).padStart(2, '0');
    timeDisplay.textContent = `${minutes}:${seconds}`;
}

// 로그인 (시작) 이벤트
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const idInput = document.getElementById('student-id').value.trim();

    // 관리자 로그인 체크
    if (idInput === "선생님") {
        showScreen('admin-screen');
        loadRanking();
        return;
    }

    // 학생 정보 저장 및 게임 시작
    studentInfo.id = idInput;
    displayNickname.textContent = studentInfo.id;
    
    // 초기화
    currentQuestionIndex = 0;
    correctCount = 0;
    gemsCount = 3;
    gemsCountDisplay.textContent = gemsCount;
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
    
    // BGM 재생 (브라우저 정책 우회하기 위해 사용자 상호작용 후 재생)
    bgm.play().catch(e => console.log("BGM autoplay blocked: ", e));
    
    showScreen('game-screen');
    loadQuestion();
});

// 문제 불러오기
function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }

    const currentQ = questions[currentQuestionIndex];
    questionText.textContent = currentQ.text;
    progressText.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
    
    optionsContainer.innerHTML = '';
    currentQ.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(btn);
    });
}

// 힌트 버튼 이벤트
hintBtn.addEventListener('click', () => {
    if (gemsCount > 0) {
        gemsCount--;
        gemsCountDisplay.textContent = gemsCount;
        alert("💡 힌트: " + questions[currentQuestionIndex].hint);
    } else {
        alert("보석이 부족합니다!");
    }
});

// 정답 확인
function checkAnswer(selectedIndex) {
    const currentQ = questions[currentQuestionIndex];
    
    if (selectedIndex === currentQ.answer) {
        // 정답 시
        correctCount++;
        sfxCorrect.play();
        showExplanation(currentQ.explanation);
    } else {
        // 오답 시
        sfxWrong.currentTime = 0;
        sfxWrong.play();
        alert("틀렸습니다. 다시 생각해보세요!");
    }
}

// 해설 모달 표시
function showExplanation(explanationStr) {
    explanationText.textContent = explanationStr;
    explanationModal.style.display = 'flex';
}

// 해설 모달에서 다음 문제로 이동
nextQuestionBtn.addEventListener('click', () => {
    explanationModal.style.display = 'none';
    playDoorAnimation(() => {
        currentQuestionIndex++;
        loadQuestion();
    });
});

// 문 열림 애니메이션 효과
function playDoorAnimation(callback) {
    sfxDoor.play();
    doorContainer.style.display = 'flex';
    // 강제 리플로우
    void doorContainer.offsetWidth;
    doorContainer.classList.add('door-open');
    
    setTimeout(() => {
        doorContainer.classList.remove('door-open');
        setTimeout(() => {
            doorContainer.style.display = 'none';
            callback();
        }, 500); // 닫히는 시간 대기
    }, 1500); // 열려있는 시간
}

// 게임 종료 로직
async function endGame() {
    clearInterval(timerInterval);
    bgm.pause();
    const endTime = new Date();
    const elapsedTime = Math.floor((endTime - startTime) / 1000);
    
    const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
    const seconds = String(elapsedTime % 60).padStart(2, '0');
    
    document.getElementById('final-time').textContent = `${minutes}:${seconds}`;
    document.getElementById('final-score').textContent = `${correctCount} / ${questions.length}`;
    
    // Firebase 데이터 저장
    if (db) {
        try {
            await db.collection('cpr_escape_ranking').add({
                studentId: studentInfo.id,
                startTime: firebase.firestore.Timestamp.fromDate(startTime),
                endTime: firebase.firestore.Timestamp.fromDate(endTime),
                elapsedTime: elapsedTime,
                correctCount: correctCount,
                isCompleted: true
            });
        } catch (error) {
            console.error("Error saving record: ", error);
        }
    } else {
        console.log("Mock Mode: Data would be saved here.", {
            studentId: studentInfo.id,
            elapsedTime,
            correctCount
        });
    }

    showScreen('result-screen');
}

// 다시 시작
document.getElementById('restart-btn').addEventListener('click', () => {
    studentInfo = { id: '' };
    document.getElementById('student-id').value = '';
    showScreen('login-screen');
});

// 관리자 로그아웃
document.getElementById('admin-logout-btn').addEventListener('click', () => {
    document.getElementById('student-id').value = '';
    showScreen('login-screen');
});

// 관리자 랭킹 불러오기
async function loadRanking() {
    const tbody = document.getElementById('ranking-body');
    tbody.innerHTML = '<tr><td colspan="5">데이터 불러오는 중...</td></tr>';
    
    if (db) {
        try {
            const snapshot = await db.collection('cpr_escape_ranking')
                .orderBy('elapsedTime', 'asc')
                .get();
                
            tbody.innerHTML = '';
            if (snapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="5">기록이 없습니다.</td></tr>';
                return;
            }

            let rank = 1;
            snapshot.forEach(doc => {
                const data = doc.data();
                const minutes = String(Math.floor(data.elapsedTime / 60)).padStart(2, '0');
                const seconds = String(data.elapsedTime % 60).padStart(2, '0');
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${rank++}</td>
                    <td>${data.studentId}</td>
                    <td>${minutes}:${seconds}</td>
                    <td>${data.correctCount} / ${questions.length}</td>
                    <td>성공</td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error("Error loading ranking: ", error);
            tbody.innerHTML = '<tr><td colspan="5">데이터를 불러오는 중 오류가 발생했습니다.</td></tr>';
        }
    } else {
        tbody.innerHTML = `
            <tr><td colspan="5">Firebase가 설정되지 않았습니다 (Mock Mode)</td></tr>
        `;
    }
}
