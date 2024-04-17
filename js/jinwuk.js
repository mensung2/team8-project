/****************
	메인 로직
*****************/

console.log("jinwuk.js loaded");

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

document.getElementById('back-button')
	.addEventListener('click', handleClickBackButton);

document.addEventListener('keyup', createLayoutOutlineHandler());



/*****************
	핸들러 함수들
******************/
function createLayoutOutlineHandler() {
	let turnedOn = false;

	const cssRule = "* { outline: rgb(160, 160, 255) solid 1px;}";
	const styleElemId = "devOutlineStyle";

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

function handleClickDeleteButton(event) {
	//클릭된 삭제버튼과 연결된 댓글 컴포넌트 불러오기
	const commentComp = event.target.parentElement;

	//댓글 정보 추출
	const commentData = commentComp.querySelector("span").innerText;

	//댓글 정보 DB에서 삭제
	db.deleteComment(commentData);

	//댓글 컴포넌트 문서에서 삭제
	commentComp.remove();

	//삭제 후 댓글이 0개가 된 경우 댓글 표시 UI 끄기
	if (getCommentNumber() === 0) {
		setCommentUIVisibility(false)
	}

	alert("삭제가 완료되었습니다.")
}

function handleClickWriteButton(event) {
	const commentInputField = document.getElementById("comment-input");

	const inputFieldText = commentInputField.value;

	const {valid, code} = validateText(inputFieldText);
	if(!valid) {
		//유효하지 않은 이유 출력
		alert(getMessageOfCode(code));

		commentInputField.focus();
		return;
	}

	commentInputField.value = "";

	const commentData = { text: inputFieldText };
	const commentComponent = createCommentComponent(commentData);
	attachCommentToContainer(commentComponent);

	db.writeComment(commentData);

	if (getCommentNumber() === 1) {
		setCommentUIVisibility(true);
	}

	alert("작성이 완료되었습니다.");

	commentInputField.focus();
}

function handleClickModifyButton(event) {
	//To-do: 이미 수정 버튼을 눌러서 수정가능한 상태인 경우 처리

	//수정버튼과 연결된 댓글내용 HTML요소
	const span = event.target.parentElement.querySelector('span');

	span.contentEditable = true;
	span.focus();

	//To-do: Range 사용하여 커서를 맨 끝으로 커서 이동

	span.addEventListener('keyup', handleKeyup);
	span.addEventListener('keydown', handleKeydown);

	//To-do: 수정완료 버튼 동적으로 추가
	
	function handleKeyup(event) {
		if (event.key === 'Enter' && !event.shift) {
			const commentText = span.innerText;

			const { valid, code } = validateText(commentText);
			if (!valid) {
				//유효하지 않은 이유 출력
				alert(getMessageOfCode(code));
				commentInputField.focus();
				return;
			}

			db.writeComment(span.innerText);

			span.contentEditable = false;

			span.removeEventListener('keydown', handleKeydown);
			span.removeEventListener('keyup', handleKeyup);

			alert("수정이 완료되었습니다.");
		}
	}

	function handleKeydown(event) {
		//줄바꿈 문자 입력 방지
		if (event.key === "Enter") {
			event.preventDefault();
		}
	}
}

function handleClickBackButton(event) {
	document.location.href = "./index.html";
}



/*****************
  DB 관련 함수들
******************/
function createDBInstance() {
	const db = {};

	db.writeComment = dbWriteCommentAtDB;
	db.deleteComment = dbDeleteCommentAtDB;
	db.modifyComment = dbModifyCommentAtDB;

	return db;
}

function dbWriteCommentAtDB(comment) {

}

function dbDeleteCommentAtDB(comment) {

}

function dbModifyCommentAtDB(comment) {

}

/********************
 컴포넌트 관련 함수들
*********************/
function createCommentComponent(comment) {
	//댓글 식별 아이디 생성
	const commentId = Symbol('commentId');

	//댓글의 서브컴포넌트(댓글 내용, 삭제, 수정 버튼)
	//생성 시 사용할 정보
	const subComponentMap = [{
		tagName: 'span',
		innerText: comment.text,
		className: "a-comment-text",
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

	//메인 컴포넌트 생성
	//역할: 아래 forEach에서 서브컴포넌트들을 하나로 묶을 것이다.
	const mainComponent = document.createElement('div');
	mainComponent.setAttribute("class", "a-comment");
	mainComponent.commentId = commentId;

	subComponentMap.forEach(info => {
		//서브컴포넌트 정보로 서브컴포넌트를 생성한다.
		const subc = document.createElement(info.tagName);
		subc.innerText = info.innerText;
		if (info.eventType) {
			subc.addEventListener(info.eventType, info.eventHandler)
		}
		if (info.className) {
			subc.setAttribute("class", info.className)
		}
		//메인컴포넌트에 서브컴포넌트를 자식으로 붙인다.
		mainComponent.appendChild(subc);
		//서브컴포넌트에도 댓글식별 번호를 설정한다.
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
	});
}

//db에서 불러온 댓글 데이터를 배열로 반환한다
function loadCommentData(db) {
	return loadDummyData();

	function loadDummyData() {
		return [
			{ text: "안녕하세요" },
			{ text: "hello hello" },
			{ text: "let's goooo" },
			{ text: "리액트" },
			{ text: "자바스크립트" },
		];
	}
}

function attachCommentToContainer(commentComponent) {
	(document.getElementById("comment-content-div")
		.append(commentComponent));

	commentComponent.scrollIntoView();
}

function getCommentNumber() {
	return document.querySelectorAll('.a-comment').length
}

function setCommentUIVisibility(visible) {
	setVisibility(document.getElementById("comment-ui"), visible);
}

function setVisibility(targetElem, visible) {
	if (visible) {
		targetElem.removeAttribute('hidden');
		return;
	} else {
		targetElem.setAttribute('hidden', "");
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
		return "empty";
	} else if(text.includes('나쁜말')) {
		return "bad-word";
	} else {
		return "ok";
	}
}

function getMessageOfCode(code) {
	const codeToMessageMap = {
		'empty': '입력된 값이 없습니다. 값을 입력해주세요.',
		'bad-word': '나쁜말을 사용하지 맙시다 ^^.',
	};
	return codeToMessageMap[code];
}