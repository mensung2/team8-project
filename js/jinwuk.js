console.log("hello world");

const db = loadDb();
const comments = loadComment(db);

//db에서 가져온 댓글이 있으면
//댓글을 화면에 표시하고 댓글관련 UI를 킨다.
if (!comments.length) {
	processComment(comments);
	toggleCommentUI(true);
}

//댓글 작성, 삭제, 수정 버튼에 이벤트 리스너를 등록한다.
const eventHandlerMap = getEventHandlerMap();
eventHandlerMap.forEach(entry => {
	addEventListenerByClass(
		entry.targetClass, entry.eventType, entry.handlerFn
	)
});

function handleDeleteComment(event) {
	console.log('delete');
	//삭제 후 댓글이 0개면 댓글 표시 UI 끄기
}

function handleWriteComment(event) {
	console.log('write');
	//추가 후 댓글이 0개에서 1개가 되면 댓글 표시 UI 키기
}

function handleModifyComment(event) {
	console.log('modify');
	//수정 후 데이터베이스에 반영
}

function renderComment(comment) {
	//label 생성
	//button 생성
	//button에 label 연결하기

	console.log(render);
}

function toggleCommentUI(forceHide) {
	if(forceHide === undefined) {
		//토글
		return;
	}

	if(forceHide) {
		//숨기기
		return;
	} else {
		//켜기
		return;
	}
}

function loadDb() {
	
}


//db에서 불러온 댓글 데이터를 배열 형식으로 반환한다
function loadComment(db) {
	console.log('load');

	return loadDummyComment();
}

function loadDummyComment() {
	return [


	];
}

function processComment(comments) {
	comments.forEach(comment => {
		renderComment(comment);
	});
}

function addEventListenerByClass(className, eventType, handlerFn) {
	const elems = document.getElementsByClassName(className);
	Array.from(elems).forEach((elem) =>
		elem.addEventListener(eventType, handlerFn)
	);
}

function getEventHandlerMap() {
	return [
		{
			targetClass: 'delete-button',
			eventType: 'click',
			handlerFn: handleDeleteComment,
		},
		{
			targetClass: 'write-button',
			eventType: 'click',
			handlerFn: handleWriteComment,
		},
		{
			targetClass: 'modify-button',
			eventType: 'click',
			handlerFn: handleModifyComment,
		},
	];
}

function getConfigurationData() {
	return {
	};
}