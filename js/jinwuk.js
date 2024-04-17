/**************
	메인 로직
**************/

console.log("jinwuk.js loaded");

const db = createDBInstance(); //미구현
const commentData = loadCommentData(db);

//db에서 가져온 댓글이 있으면
//댓글을 화면에 표시하고 댓글관련 UI를 킨다.
if (commentData.length) {
	processCommentData(commentData);
	toggleCommentUI(true);
}

/*********************
  이벤트 핸들러 등록
*********************/
document.getElementById('write-button')
	.addEventListener('click', handleClickWriteButton);

document.getElementById('back-button')
	.addEventListener('click', handleClickBackButton);

//ctrl+shift+q를 누르면 레이아웃 아웃라인 표시
//To-do 한 번 더 누르면 레이아웃 아웃라인 숨기기
document.addEventListener('keyup', (event) => {
	console.dir(event);
	if (event.shiftKey && event.ctrlKey
		&& event.key.toLowerCase() === 'q') {
		const ss = document.styleSheets[0];
		ss.insertRule(`* { outline: rgb(160, 160, 255) solid 1px;}`
			, ss.cssRules.length);
	}
});

/***************
 핸들러 관련 함수
****************/
function handleClickDeleteButton(event) {
	//클릭된 삭제버튼과 연결된 댓글 컴포넌트 불러오기
	const commentComp = event.target.parentElement;

	//댓글 정보 추출
	const commentData = commentComp.querySelector("span").innerText;

	//댓글 정보 DB에서 삭제
	db.deleteComment(commentData);

	//댓글 컴포넌트 문서에서 삭제
	commentComp.remove();

	//To-do: 삭제 후 댓글이 0개가 된 경우 댓글 표시 UI 끄기
	if (false) {
		toggleCommentUI(true)
	}

	alert("삭제가 완료되었습니다.")
}

function handleClickWriteButton(event) {
	//입력필드 요소 불러오기
	const commentInputField = document.getElementById("comment-input");

	//To-do: 입력필드 유효성 검사하기

	//입력필드 데이터 불러오기
	const commentText = commentInputField.value;

	//입력필드 값 초기화하기
	commentInputField.value = "";

	//댓글 데이터 구성
	const commentData = { text: commentText };

	//댓글 컴포넌트 만들기
	const commentComponent = createCommentComponent(commentData);

	//댓글창에 댓글 컴포넌트 붙이기
	attachCommentToContainer(commentComponent);

	//To-do: 댓글이 0개였다가 1개가 된 경우 댓글표시 UI 키기
	if (false) {
		toggleCommentUI(true);
	}

	//DB에 저장
	db.writeComment(commentData);

	alert("작성이 완료되었습니다.");
}

function handleClickModifyButton(event) {
	//To-do: 이미 수정 버튼을 눌러서 수정가능한 상태인 경우 처리

	//수정버튼과 연결된 댓글내용 HTML요소 불러오기
	const span = event.target.parentElement.querySelector('span');

	//댓글내용을 수정가능 상태로 변경 및 포커스 적용,
	span.contentEditable = true;
	span.focus();

	//To-do: Range 사용하여 커서를 맨 끝으로 커서 이동

	//엔터입력 이벤트를 감지하기 위한 헨들러등록
	span.addEventListener('keyup', handleKeyup);
	span.addEventListener('keydown', handleKeydown);

	//To-do: 수정완료 버튼 동적으로 추가

	function handleKeyup(event) {
		if (event.key === 'Enter' && !event.shift) {
			//새로운 댓글내용을 DB에 쓰기
			db.writeComment(span.innerText);

			//댓글내용을 수정불가 상태로 변경
			span.contentEditable = false;

			//핸들러 해제
			span.removeEventListener('keydown', handleKeydown);
			span.removeEventListener('keyup', handleKeyup);

			alert("수정이 완료되었습니다.");
		}
	}

	function handleKeydown(event) {
		if (event.key === "Enter") {
			event.preventDefault();
		}
	}
}

function handleClickBackButton(event) {
	document.location.href = "./index.html";
}

/***************
  DB 관련 함수
****************/
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

/******************
 컴포넌트 관련 함수
*******************/
function createCommentComponent(comment) {
	//댓글 식별 아이디 생성
	const commentId = Symbol('commentId');

	//댓글의 서브컴포넌트(댓글 내용, 삭제, 수정 버튼)
	//생성 시 사용할 정보
	const subComponentMap = [{
		tagName: 'span',
		innerText: comment.text,
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
	mainComponent.setAttribute("className", "a-comment");
	mainComponent.commentId = commentId;

	subComponentMap.forEach(info => {
		//서브컴포넌트 정보로 서브컴포넌트를 생성한다.
		const subc = document.createElement(info.tagName);
		subc.innerText = info.innerText;
		if (info.eventType) {
			subc.addEventListener(info.eventType, info.eventHandler)
		}
		//메인컴포넌트에 서브컴포넌트를 자식으로 붙인다.
		mainComponent.appendChild(subc);
		//서브컴포넌트에도 댓글식별 번호를 설정한다.
		subc.commentId = commentId;
	});

	return mainComponent;
}



/***************************
 데이터 가공 및 유틸리티 함수
****************************/
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

function toggleCommentUI(forceHide) {
	if (forceHide === undefined) {
		//토글
		return;
	}

	if (forceHide) {
		//숨기기
		return;
	} else {
		//켜기
		return;
	}
}