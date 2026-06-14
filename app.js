const firebaseConfig = {
    apiKey: "AIzaSyCVMHC0cjVdruZ6e82Ipn3W21nbUJKQ07g",
    authDomain: "golden-hour-9693a.firebaseapp.com",
    projectId: "golden-hour-9693a",
    storageBucket: "golden-hour-9693a.firebasestorage.app",
    messagingSenderId: "513777333720",
    appId: "1:513777333720:web:2153c7b4422052ad0e2ead"
};

// Initialize Firebase (실제 설정이 없으면 에러가 날 수 있으므로 try-catch로 감쌈)
let db = null;
try {
    if (firebaseConfig.apiKey !== "API_KEY_PLACEHOLDER") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
    } else {
        console.warn("Firebase config is missing. App will run in mock mode.");
    }
} catch (e) {
    console.error("Firebase initialization error", e);
}

// 심폐소생술/AED 관련 기본 문제 세트 (MD 파일에 잘린 내용 대체)
const questions = [
    {
        id: 1,
        text: "심정지 환자 발생 시 가장 먼저 해야 할 일은 무엇인가요?",
        options: [
            "환자의 의식과 호흡을 확인한다.",
            "즉시 가슴압박을 시작한다.",
            "따뜻한 물을 먹인다.",
            "AED를 찾아온다."
        ],
        answer: 0
    },
    {
        id: 2,
        text: "가슴압박 시 올바른 압박 깊이와 속도는?",
        options: [
            "약 3cm 깊이, 분당 80회",
            "약 5cm 깊이, 분당 100~120회",
            "약 7cm 깊이, 분당 150회",
            "깊이는 상관없고 최대한 빨리"
        ],
        answer: 1
    },
    {
        id: 3,
        text: "자동심장충격기(AED) 패드 부착 위치로 알맞은 것은?",
        options: [
            "우측 빗장뼈(쇄골) 아래와 좌측 젖꼭지 아래 중간겨드랑선",
            "좌측 빗장뼈 아래와 우측 젖꼭지 아래",
            "명치 부위와 등 뒤",
            "가슴 정중앙과 복부"
        ],
        answer: 0
    },
    {
        id: 4,
        text: "AED에서 '심장충격(제세동)이 필요합니다'라는 음성이 나올 때 해야 할 행동은?",
        options: [
            "가슴압박을 계속한다.",
            "환자에게서 떨어져서 충전되기를 기다린다.",
            "환자의 팔다리를 마사지한다.",
            "인공호흡을 2회 실시한다."
        ],
        answer: 1
    },
    {
        id: 5,
        text: "심폐소생술의 골든타임(생존율이 높은 시간)은 심정지 발생 후 몇 분 이내인가요?",
        options: [
            "1분 이내",
            "4분 이내",
            "10분 이내",
            "30분 이내"
        ],
        answer: 1
    }
];

// 게임 상태 변수
let currentQuestionIndex = 0;
let correctCount = 0;
let startTime = null;
let timerInterval = null;
let studentInfo = {
    id: '',
    name: ''
};

// DOM 요소
const screens = document.querySelectorAll('.screen');
const loginForm = document.getElementById('login-form');
const displayNickname = document.getElementById('display-nickname');
const timeDisplay = document.getElementById('time-display');
const progressText = document.getElementById('progress-text');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const doorContainer = document.querySelector('.door-transition-container');

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
    const nameInput = document.getElementById('student-name').value.trim();

    // 관리자 로그인 체크
    if (idInput === "선생님" && nameInput === "선생님") {
        showScreen('admin-screen');
        loadRanking();
        return;
    }

    // 학생 학번 유효성 검사 (5자리 숫자)
    const idRegex = /^\d{5}$/;
    if (!idRegex.test(idInput)) {
        alert("학번은 5자리 숫자로 입력해주세요. (예: 30101)");
        return;
    }

    // 학생 정보 저장 및 게임 시작
    studentInfo.id = idInput;
    studentInfo.name = nameInput;
    displayNickname.textContent = `${studentInfo.id} ${studentInfo.name}`;
    
    // 초기화
    currentQuestionIndex = 0;
    correctCount = 0;
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
    
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

// 정답 확인
function checkAnswer(selectedIndex) {
    const currentQ = questions[currentQuestionIndex];
    
    if (selectedIndex === currentQ.answer) {
        // 정답 시
        correctCount++;
        playDoorAnimation(() => {
            currentQuestionIndex++;
            loadQuestion();
        });
    } else {
        // 오답 시 (진동 애니메이션 등 추가 가능)
        alert("틀렸습니다. 다시 생각해보세요!");
    }
}

// 문 열림 애니메이션 효과
function playDoorAnimation(callback) {
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
                name: studentInfo.name,
                nickname: `${studentInfo.id} ${studentInfo.name}`,
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
    studentInfo = { id: '', name: '' };
    document.getElementById('student-id').value = '';
    document.getElementById('student-name').value = '';
    showScreen('login-screen');
});

// 관리자 로그아웃
document.getElementById('admin-logout-btn').addEventListener('click', () => {
    document.getElementById('student-id').value = '';
    document.getElementById('student-name').value = '';
    showScreen('login-screen');
});

// 관리자 랭킹 불러오기
async function loadRanking() {
    const tbody = document.getElementById('ranking-body');
    tbody.innerHTML = '<tr><td colspan="6">데이터 불러오는 중...</td></tr>';
    
    if (db) {
        try {
            const snapshot = await db.collection('cpr_escape_ranking')
                .orderBy('elapsedTime', 'asc')
                .get();
                
            tbody.innerHTML = '';
            if (snapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="6">기록이 없습니다.</td></tr>';
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
                    <td>${data.name}</td>
                    <td>${minutes}:${seconds}</td>
                    <td>${data.correctCount} / 5</td>
                    <td>성공</td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error("Error loading ranking: ", error);
            tbody.innerHTML = '<tr><td colspan="6">데이터를 불러오는 중 오류가 발생했습니다.</td></tr>';
        }
    } else {
        tbody.innerHTML = `
            <tr><td colspan="6">Firebase가 설정되지 않았습니다 (Mock Mode)</td></tr>
            <tr>
                <td>1</td>
                <td>30101</td>
                <td>테스트학생</td>
                <td>01:30</td>
                <td>5 / 5</td>
                <td>성공</td>
            </tr>
        `;
    }
}
