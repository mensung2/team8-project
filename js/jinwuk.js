console.log("jinwuk.js loaded");

const db = loadDb();
const comments = loadComment(db);

//db에서 가져온 댓글 있으면
//댓글을 화면에 표시하고 댓글관련 UI를 킨다.
if (!comments.length) {
	processComment(comments);
	toggleCommentUI(true);
}

//댓글 작성 버튼과 각 댓글의 삭제, 수정 버튼의 이벤트 리스터를 설정한다.
const eventHandlerMap = getEventHandlerMap();
eventHandlerMap.forEach(entry => {
	addEventListenerByClass(
		entry.targetClass, entry.eventType, entry.handlerFn
	)
});

//테스트용 댓글 생성
const commentComponent = createComment({ text: "첫번째 댓글" });

const commentContainer = document.getElementById('comment-content-div');
commentContainer.append(commentComponent);

function handleDeleteComment(event) {
	console.log('delete');
	//삭제 후 댓글이 0개면 댓글 표시 UI 끄기

	//문서에서 삭제

	//DB에서 삭제
}

function handleWriteComment(event) {
	console.log(event);

	//데이터 불러오기
	const comment = {};

	//컴포넌트 만들기
	const commentComponent = createComment({});

	//문서에 저장
	const commentContainer = document.getElementById('con');
	commentContainer.append(commentComponent);

	//댓글이 0개였다가 1개가 된 것이면 댓글표시 UI 키기
	if (!commentContainer.children.length) {
		toggleCommentUI(true);
	}

	//DB에 저장
	db.writeComment(comment);
}

function handleModifyComment(event) {
	console.log('modify');

	//문서에 반영

	//DB에 반영
}

function loadDb() {
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

//db에서 불러온 댓글 데이터를 배열 형식으로 반환한다
function loadComment(db) {
	console.log('load');

	return loadDummyComment();

	function loadDummyComment() {
		return [
		];
	}
}

function processComment(comments) {
	comments.forEach(comment => {
		createComment(comment);
	});
}

function createComment(comment) {
	//댓글 식별 아이디 생성
	const commentId = Symbol('commentId');

	//댓글의 서브컴포넌트(댓글 내용, 삭제, 수정 버튼)
	//생성 시 사용할 정보
	const subComponentMap = [{
		tagName: 'span',
		innerText: comment.text,
	}, {
		tagName: 'button',
		innerText: '댓글 삭제',
		eventType: 'click',
		eventHandler: handleDeleteComment,
	}, {
		tagName: 'button',
		innerText: '댓글 수정',
		eventType: 'click',
		eventHandler: handleModifyComment,
	}];

	//댓글 내용, 삭제, 수정 버튼을 붙일 메인 컴포넌트
	const mainComponent = document.createElement('div');
	mainComponent.setAttribute("className", "a-comment");
	mainComponent.commentId = commentId;

	subComponentMap.forEach(info => {
		//서브컴포넌트 정보를 사용해서 서브컴포넌트를 생성한다.
		const subc = document.createElement(info.tagName);
		subc.innerText = info.innerText;
		if(info.eventType) {
			subc.addEventListener(info.eventType, info.eventHandler)
		}
		//메인컴포넌트에 서브컴포넌트를 자식으로 붙인다.
		mainComponent.appendChild(subc);
		//서브컴포넌트에도 댓글식별 번호를 설정한다.
		subc.commentId = commentId;
	});

	return mainComponent;
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

function addEventListenerByClass(className, eventType, handlerFn) {
	const elems = document.getElementsByClassName(className);
	Array.from(elems).forEach((elem) =>
		elem.addEventListener(eventType, handlerFn)
	);
}

function getEventHandlerMap() {
	return [{
		targetClass: 'delete-button',
		eventType: 'click',
		handlerFn: handleDeleteComment,
	}, {
		targetClass: 'write-button',
		eventType: 'click',
		handlerFn: handleWriteComment,
	}, {
		targetClass: 'modify-button',
		eventType: 'click',
		handlerFn: handleModifyComment,
	}];
}

function getConfigurationData() {
	return {
	};
}