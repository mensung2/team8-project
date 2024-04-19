/****************
	 메인 로직
*****************/

console.log('jinwuk.js loaded');

const db = createDBInstance(); //미구현
const commentData = loadCommentData(db);

//db에서 가져온 댓글이 있으면
//댓글을 화면에 표시하고 댓글관련 UI를 킨다.
if (commentData.length) {
	processCommentData(commentData);
	setCommentUIVisibility(true);
}

/*********************
  이벤트 핸들러 등록
*********************/
document.getElementById('write-button')
	.addEventListener('click', handleClickWriteButton);

document.getElementById('comment-input')
	.addEventListener('keyup', handleKeyupInputField);

document.getElementById('back-button')
	.addEventListener('click', handleClickBackButton);

document.addEventListener('keyup', createLayoutOutlineHandler());



/*****************
	핸들러 함수들
******************/
function createLayoutOutlineHandler() {
	let turnedOn = false;

	const cssRule = '* { outline: rgb(160, 160, 255) solid 1px;}';
	const styleElemId = 'devOutlineStyle';

	function _handleLayoutOutlineHandler(event) {
		//ctrl+shift+q를 누르면 레이아웃 아웃라인 표시
		if (event.shiftKey && event.ctrlKey
			&& event.key.toLowerCase() === 'q') {
			//이미 표시된 상태면 숨기기
			if (turnedOn) {
				const styleElem = document.getElementById(styleElemId);

				styleElem.remove();

				turnedOn = false;
			}
			//표시되지 않은 상태면 표시하기
			else {
				const styleElem = document.createElement('style');

				styleElem.innerHTML = cssRule;
				styleElem.setAttribute('id', styleElemId);

				document.head.appendChild(styleElem);

				turnedOn = true;
			}
		}
	}

	return _handleLayoutOutlineHandler;
}

function handleClickWriteButton() {
	const commentInputField = document.getElementById('comment-input');

	const inputFieldText = commentInputField.value;

	const { valid, code } = validateText(inputFieldText);
	if (!valid) {
		//유효하지 않은 이유 출력
		alert(getCodeMessage(code));

		commentInputField.focus();
		return;
	}

	commentInputField.value = '';

	const commentData = { text: inputFieldText };
	const commentComponent = createCommentComponent(commentData);
	attachCommentToContainer(commentComponent);
	commentComponent.scrollIntoView();

	db.writeComment(commentData);

	if (getCommentNumber() === 1) {
		setCommentUIVisibility(true);
	}

	alert('작성이 완료되었습니다.');

	commentInputField.focus();
}

function handleKeyupInputField(event) {
	if(event.key === 'Enter') {
		handleClickWriteButton();
		return;
	}
}

function handleClickModifyButton(event) {
	//To-do: 이미 같은 댓글의 수정 버튼을 또 누른 경우
	//To-do: 이미 한 댓글의 수정 버튼을 눌렀는데 
	//또 다른 댓글의 수정 버튼을 누른 경우 
	
	//수정버튼과 연결된 댓글내용 HTML요소
	const span = event.target.parentElement.querySelector('span');

	span.contentEditable = true;
	span.focus();

	//To-do: Range 사용하여 커서를 맨 끝으로 이동

	span.addEventListener('keyup', handleKeyup);
	span.addEventListener('keydown', handleKeydown);

	//To-do: 수정완료 버튼 추가
	
	function handleKeyup(event) {
		if (event.key === 'Enter' && !event.shift) {
			const commentText = span.innerText;

			const { valid, code } = validateText(commentText);
			if (!valid) {
				//유효하지 않은 이유 출력
				alert(getCodeMessage(code));
				return;
			}

			db.writeComment(span.innerText);

			span.contentEditable = false;

			span.removeEventListener('keydown', handleKeydown);
			span.removeEventListener('keyup', handleKeyup);

			alert('수정이 완료되었습니다.');
		}
	}

	function handleKeydown(event) {
		//줄바꿈 문자 입력 방지
		if (event.key === 'Enter') {
			event.preventDefault();
		}
	}
}

function handleClickDeleteButton(event) {
	//클릭된 삭제버튼과 연결된 댓글 컴포넌트 불러오기
	const commentComp = event.target.parentElement;

	//댓글 정보 추출
	const commentData = commentComp.querySelector('span').innerText;

	db.deleteComment(commentData);

	commentComp.remove();

	if (getCommentNumber() === 0) {
		setCommentUIVisibility(false)
	}

	alert('삭제가 완료되었습니다.')
}

function handleClickBackButton(event) {
	document.location.href = './index.html';
}



/********************
 컴포넌트 관련 함수들
*********************/
function createCommentComponent(comment) {
	const commentId = Symbol('commentId');

	//댓글의 서브컴포넌트(댓글 내용, 삭제, 수정 버튼) 정보
	const subComponentMap = [{
		tagName: 'span',
		innerText: comment.text,
		className: 'a-comment-text',
	}, {
		tagName: 'button',
		innerText: '삭제',
		eventType: 'click',
		eventHandler: handleClickDeleteButton,
	}, {
		tagName: 'button',
		innerText: '수정',
		eventType: 'click',
		eventHandler: handleClickModifyButton,
	}];

	//메인 컴포넌트
	//역할: 아래 forEach에서 서브컴포넌트들을 하나로 묶는다.
	const mainComponent = document.createElement('div');
	mainComponent.setAttribute('class', 'a-comment');
	mainComponent.commentId = commentId;

	subComponentMap.forEach(info => {
		const subc = document.createElement(info.tagName);
		subc.innerText = info.innerText;
		if (info.eventType) {
			subc.addEventListener(info.eventType, info.eventHandler)
		}
		if (info.className) {
			subc.setAttribute('class', info.className)
		}

		mainComponent.appendChild(subc);

		subc.commentId = commentId;
	});

	return mainComponent;
}



/*****************************
 데이터 가공 및 유틸리티 함수들
******************************/
function processCommentData(commentData) {
	commentData.forEach(data => {
		const commentComp = createCommentComponent(data);
		attachCommentToContainer(commentComp);
		commentComp.scrollIntoView();
	});
}

function attachCommentToContainer(commentComponent) {
	document.getElementById('comment-content-div')
		.append(commentComponent);
}

function getCommentNumber() {
	return document.querySelectorAll('.a-comment').length
}

function setCommentUIVisibility(visible) {
	setVisibility(document.getElementById('comment-ui'), visible);
}

function setVisibility(targetElem, visible) {
	if (visible) {
		targetElem.removeAttribute('hidden');
		return;
	} else {
		targetElem.setAttribute('hidden', '');
		return;
	}
}

function validateText(text) {
	const analyzeResult = {};
	analyzeResult.code = analyzeText(text);

	switch (analyzeResult.code) {
		case 'empty':
		case 'bad-word':
			analyzeResult.valid = false;
			break;
		case 'ok':
			analyzeResult.valid = true;
			break;
		default:
			console.error('validateText->switch statement: invalid default detected');
			analyzeResult.valid = true;
			break;
	}
	return analyzeResult;
}

function analyzeText(text){
	if(text.length === 0) {
		return 'empty';
	} else if(text.includes('나쁜말')) {
		return 'bad-word';
	} else {
		return 'ok';
	}
}

function getCodeMessage(code) {
	const codeToMessageMap = {
		'empty': '입력된 값이 없습니다. 값을 입력해주세요.',
		'bad-word': '나쁜말을 사용하지 맙시다 ^^.',
	};
	return codeToMessageMap[code];
}



/*****************
  DB 관련 함수들
******************/
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

function dbWriteCommentAtDB(comment, commentId) {
    //setDoc();
}

function dbDeleteCommentAtDB(comment, commentId) {
    //deleteDoc();
}

function dbModifyCommentAtDB(comment, commentId) {
    //setDoc();
}

function createDBInstance() {
	const db = {};
	try {
		db = connectDB();
	} catch(e) {
		console.error('db연결 실패');
		return {};
	}
	
	console.log('db 연결 성공');
   
	db.writeComment = dbWriteCommentAtDB;
	db.deleteComment = dbDeleteCommentAtDB;
	db.modifyComment = dbModifyCommentAtDB;
    
	return db;
}

function connectDB(){
	const firebaseConfig = {
		apiKey: "AIzaSyCCKlWrDx64cWzF9mqSsnQrhizaM-aZxLg",
		authDomain: "myproject-f0cda.firebaseapp.com",
		projectId: "myproject-f0cda",
		storageBucket: "myproject-f0cda.appspot.com",
		messagingSenderId: "632752137713",
		appId: "1:632752137713:web:66746f134fb7f22d575050",
		measurementId: "G-GC25C4MM0V",
	};

	const app = initializeApp(firebaseConfig);
	const fireStore = getFirestore(app);

	return fireStore;
}

//db에서 불러온 댓글 데이터를 배열로 반환한다
function loadCommentData(db) {
	//getDocs();
	
	return loadDummyData();

	function loadDummyData() {
		return [
			{ text: '안녕하세요' },
			{ text: 'hello hello' },
			{ text: "let's goooo" },
			{ text: '리액트' },
			{ text: '자바스크립트' },
		];
	}
}