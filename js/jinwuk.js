/**************
   메인 로직
**************/
console.log("jinwuk.js loaded");

const db = createDBInstance();
const commentData = loadCommentData(db);

//db에서 가져온 댓글이 있으면
//댓글을 화면에 표시하고 댓글관련 UI를 킨다.
if (commentData.length) {
	processCommentData(commentData);
	toggleCommentUI(true);
}



/***************
 핸들러 관련 함수
****************/
function handleClickDeleteButton(event) {
	console.log('delete');
	//삭제 후 댓글이 0개면 댓글 표시 UI 끄기

	//문서에서 삭제

	//DB에서 삭제
}

function handleClickWriteButton(event) {
	//입력필드 요소 불러오기
	const commentInputField = document.getElementById("comment-input");

	//To-do: 입력필드 길이 검사하기

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
}

function handleClickModifyButton(event) {
	console.log('modify');

	//문서에 반영

	//DB에 반영
}



/***************
  DB 관련 함수
****************/
function createDBInstance() {
	const db = {};

	db.writeComment = dbWriteComment;
	db.deleteComment = dbDeleteCommentAtDB;
	db.modifyComment = dbModifyCommentAtDB;

	return db;
}

function dbWriteComment(comment) {

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
	//메인 컴포넌트가 서브컴포넌트들을 하나로 묶는다.
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
	console.log('load');

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

function attachCommentToContainer(commentComponent){
	document.getElementById("comment-content-div")
			.append(commentComponent);

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

function getConfigurationData() {
	return {
	};
}