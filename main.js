/**
 * Created by donghyunkim on 2017. 3. 14..
 */

/*
    dom을 객체에 넣고 쉽게 사용한다
    insertAdjacentHTML() 함수 찾아보기
    페이지 처리
    스콥을 나누기 위해 즉시 실행 함수를 사용한다.
    setTimeout을 사용하면 좋지 않다.
    계속 콜백함수를 불러야 할 수도 있다.
    서버에서 html을 먼저 만들고 보내주는 것이 나은지 아니면 프로트엔드에서 하는 것이 좋은지는 명확하지 않다.
    둘다 할수도 있다.
    템플릿 작업을 하는 것이 좋다.

    구독!!!


 */

(function() {
// ajax 부분
    var jsonData;
    var currentSite = 0;

    function reqListener() {
        jsonData = JSON.parse(this.responseText);
        loadPage();
        //delegation은 상위 element에 리스너를 걸어주면 하위 자식 노드
        var listUl = document.querySelector(".mainArea>nav>ul");
        listUl.addEventListener("click", listClickHandler);


        var buttonDom = document.querySelector("button");
        buttonDom.addEventListener("click", buttonClickHandler);

        var arrowBtnDom = document.querySelector(".btn");
        arrowBtnDom.addEventListener("click", arrowClickHandler);
    }

    var oReq = new XMLHttpRequest();

    oReq.addEventListener("load", reqListener);


    oReq.open("GET", "./data/newslist.json");
    oReq.send();

//몇번째 li가 눌렸는지 확인 해야한다


//첫번째 로딩 함수
    function loadPage() {

        var listTemplate = '<li class="{name}">{name}</li>';
        var listHtmlResult = "";

        jsonData.forEach(function (val) {
            listHtmlResult += listTemplate.replace(/{name}/g, val.title);
        });


        var listDom = document.querySelector(".mainArea>nav>ul");
        //console.log(listDom);
        listDom.innerHTML = listHtmlResult;
        //console.log(jsonData);

        if (jsonData.length !== 0) {
            replaceTemplate(jsonData[0]);
        } else {
            var contentDom = document.querySelector(".content");
            contentDom.innerHTML = "";
        }

    }


//탬플릿을 바꾸어주는 함수

    function replaceTemplate(jsonData) {

        var mainTemplate = document.querySelector("#newsTemplate").innerText;
        //console.log(mainTemplate);
        mainTemplate = mainTemplate.replace("{title}", jsonData.title);
        mainTemplate = mainTemplate.replace("{imgurl}", jsonData.imgurl);
        mainTemplate = mainTemplate.replace("{newsList}", jsonData.newslist.map(function (val) {
            return "<li>" + val + "</li>"
        }).join(""));

        var contentDom = document.querySelector(".content");
        contentDom.innerHTML = mainTemplate;

        var buttonDom = document.querySelector("button");
        buttonDom.addEventListener("click", buttonClickHandler);

        highLight();

    }

//리스트 클릭 핸들러
    function listClickHandler(event) {
        var seletedData = jsonData.filter(function (val, idx) {
            if (val.title == event.target.innerText) {
                currentSite = idx;
                return true;
            }
        })[0];

        replaceTemplate(seletedData);
    }

    function highLight() {
        var dom = document.querySelectorAll("nav>ul>li");
        dom.forEach(function (value) {
            value.style.color = "black";
        });
        document.querySelector("nav>ul>." + jsonData[currentSite].title).style.color = "blue";
    }


//삭제 버튼 클릭 핸들러
    function buttonClickHandler() {
        var titleDom = document.querySelector(".newsName");
        for (var i = 0; i < jsonData.length; i++) {
            if (jsonData[i].title == titleDom.innerText) {
                jsonData.splice(i, 1);
                break;
            }
        }
        currentSite = 0;
        loadPage(jsonData);

    }

//화살표 클릭 핸들러
    function arrowClickHandler(event) {

        if (event.target.parentElement.className == "left") {

            if (currentSite > 0) {
                currentSite--;
            } else if (currentSite === 0) {
                currentSite = jsonData.length - 1;
            }

        } else {
            if (currentSite < jsonData.length - 1) {
                currentSite++;
            } else if (currentSite === jsonData.length - 1) {
                currentSite = 0;
            }
        }
        if (jsonData.length !== 0) {
            replaceTemplate(jsonData[currentSite]);
        }

    }

})();
