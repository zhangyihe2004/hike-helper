//竞业达H5三画面回放播放器v1.7.7
function jydH5Player(option){
    var jydPlayerSight;
    var autoP = is360();
    var publicRpType = option.publicRpType;
    var teacherVideoUrl = option.teacherVideoUrl;
    var studentVideoUrl = option.studentVideoUrl;
    var courseVideoUrl = option.courseVideoUrl;

    if (publicRpType == "1,2,3") {
        jydPlayerSight = new sightTypeTSC(option, autoP);
    }
    else if (publicRpType == "1,2") {
        jydPlayerSight = new sightTypeTS(option, autoP);
    }
    else if (publicRpType == "2,3") {
        jydPlayerSight = new sightTypeTC(option, autoP);
    }
    else if (publicRpType == "1,3") {
        jydPlayerSight = new sightTypeSC(option, autoP);
    }
    else if (publicRpType == "2") {
        jydPlayerSight = new sightTypeSingle('t', option, autoP);
    }
    else if (publicRpType == "1") {
        jydPlayerSight = new sightTypeSingle('s', option, autoP);
    }
    else if (publicRpType == "3") {
        jydPlayerSight = new sightTypeSingle('c', option, autoP);
    }
    else if(!publicRpType) {
        if (teacherVideoUrl && studentVideoUrl && courseVideoUrl) {
            jydPlayerSight = new sightTypeTSC(option, autoP);
        }
        else if (teacherVideoUrl && studentVideoUrl && !courseVideoUrl) {
            jydPlayerSight = new sightTypeTS(option, autoP);
        }
        else if (teacherVideoUrl && !studentVideoUrl && courseVideoUrl) {
            jydPlayerSight = new sightTypeTC(option, autoP);
        }
        else if (!teacherVideoUrl && studentVideoUrl && courseVideoUrl) {
            jydPlayerSight = new sightTypeSC(option, autoP);
        }
        else if (teacherVideoUrl && !studentVideoUrl && !courseVideoUrl) {
            jydPlayerSight = new sightTypeSingle('t', option, autoP);
        }
        else if (!teacherVideoUrl && studentVideoUrl && !courseVideoUrl) {
            jydPlayerSight = new sightTypeSingle('s', option, autoP);
        }
        else if (!teacherVideoUrl && !studentVideoUrl && courseVideoUrl) {
            jydPlayerSight = new sightTypeSingle('c', option, autoP);
        }
        else {
            return false;
        }
    }
    return jydPlayerSight;
}

function is360() {
    if ( navigator.userAgent.toLowerCase().indexOf('chrome')>-1) {
        var desc = navigator.mimeTypes['application/x-shockwave-flash'];
        if (desc) {
            return true;
        }
        return false;
    }
    return false;
}

//tsc:老师、学生、课件三画面
function sightTypeTSC(option, autoP) {
    var element = option.element;
    var teacherVideoUrl = option.teacherVideoUrl;
    var studentVideoUrl = option.studentVideoUrl;
    var courseVideoUrl = option.courseVideoUrl;
    var videoSize = option.videoSize;
    var getPicInfoUrl = option.getPicInfoUrl;
    var getPicInfoId = option.getPicInfoId;
    var cutStartTime = option.cutStartTime;
    var cutEndTime = option.cutEndTime;
    var enablePic = option.enablePic;

    var jydVideoPlayer = "" +
        "<div class=\"jyd-videoPlayer\" id=\"jyd-videoPlayer\">\n" +
        "    <div class=\"jyd-videoPlayerCover\"></div>" +
        "    <div class=\"jyd-videoPart\">\n" +
        "        <div class=\"jyd-videoCover\">\n" +
        "            <div class=\"jyd-coverPlayBtn\"></div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-videoWrap jyd-leftWrap\" id=\"jyd-video1Wrap\">\n" +
        "            <div class=\"jyd-videoWaitingCover\">\n" +
        "               <div class=\"jyd-coverWaitingBtn\">" +
        "                  <div class=\"jyd-coverWaitingIcon\"></div>" +
        "                  <div class=\"jyd-coverWaitingText\">loading...</div>" +
        "                  <div class=\"jyd-coverWaitingBufferSpeed\" id=\"jyd-coverWaitingBufferSpeed\"></div>" +
        "               </div>\n" +
        "            </div>\n" +
        "            <video id=\"jyd-video1\"></video>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-videoWrap jyd-rightTopWrap\" id=\"jyd-video2Wrap\">\n" +
        "            <div class=\"jyd-videoWaitingCover\">\n" +
        "               <div class=\"jyd-coverWaitingBtn\">" +
        "                  <div class=\"jyd-coverWaitingIcon\"></div>" +
        "                  <div class=\"jyd-coverWaitingText\">loading...</div>" +
        "                  <div class=\"jyd-coverWaitingBufferSpeed\" id=\"jyd-coverWaitingBufferSpeed\"></div>" +
        "               </div>\n" +
        "            </div>\n" +
        "            <video id=\"jyd-video2\"></video>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-videoWrap jyd-rightBottomWrap\" id=\"jyd-video3Wrap\">\n" +
        "            <div class=\"jyd-videoWaitingCover\">\n" +
        "               <div class=\"jyd-coverWaitingBtn\">" +
        "                  <div class=\"jyd-coverWaitingIcon\"></div>" +
        "                  <div class=\"jyd-coverWaitingText\">loading...</div>" +
        "                  <div class=\"jyd-coverWaitingBufferSpeed\" id=\"jyd-coverWaitingBufferSpeed\"></div>" +
        "               </div>\n" +
        "            </div>\n" +
        "            <video id=\"jyd-video3\"></video>\n" +
        "        </div>\n" +
        "    </div>\n";
        if (enablePic && enablePic == "yes") {
            jydVideoPlayer += "" +
                "<div class=\"jyd-newPicBox\">" +
                "    <div class=\"jyd-newPicMiddleBox\" id=\"jyd-newPicMiddleBox\">" +
                "       <div class=\"jyd-newPicInnerBox\"></div>" +
                "    </div>" +
                "    <div class=\"jyd-newPicLeftBtn\">《</div>" +
                "    <div class=\"jyd-newPicRightBtn\">》</div>" +
                "</div>";
        }
    jydVideoPlayer += "" +
        "    <div class=\"jyd-videoControlBar\">\n" +
        "        <div class=\"jyd-startAndPause jyd-startIcon\" id=\"jyd-pauseState\"></div>\n" +
        "        <div class=\"jyd-processBar\" id=\"jyd-processBar\">\n" +
        "            <div class=\"jyd-currentProcessBar\" id=\"jyd-currentProcessBar\">\n" +
        "                <div class=\"jyd-roundBar\">" +
        "                    <div class=\"jyd-processBarTimeInfo\">00:00:00</div>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-timeUpdateNow\" id=\"jyd-timeUpdateNow\">00:00:00</div>\n" +
        "        <div class=\"jyd-splitTimeUpdate\">/</div>\n" +
        "        <div class=\"jyd-timeUpdateAll\" id=\"jyd-timeUpdateAll\">00:00:00</div>\n" +
        "        <div class=\"jyd-fullScreen\" id=\"jyd-fullScreen\"></div>\n" +
        "        <div class=\"jyd-exitFullScreen\" id=\"jyd-exitFullScreen\"></div>\n" +
        "        <div class=\"jyd-volumeBar\" id=\"jyd-volumeBar\">\n" +
        "            <div class=\"jyd-currentVolumeBar\" id=\"jyd-currentVolumeBar\">\n" +
        "                <div class=\"jyd-volumeRoundBar\"></div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-muteBtn jyd-unMuteIcon\" id=\"jyd-muteBtn\"></div>\n" +
        "        <div class=\"jyd-radioShift\" id=\"jyd-radioShift\">\n" +
        "            <span>当前音源：老师</span>\n" +
        "            <div class=\"jyd-radioShiftBox\">\n" +
        "                <div id=\"jyd-teacherVoice\">老师</div>\n" +
        "                <div id=\"jyd-studentVoice\">学生</div>\n" +
        "                <div id=\"jyd-courseVoice\">课件</div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-playSpeed\" id=\"jyd-playSpeed\">\n" +
        "            <span>当前倍速：1.0X</span>\n" +
        "            <div class=\"jyd-speedShiftBox\">\n" +
        "                <div id=\"jyd-speed200\">2.0X</div>\n" +
        "                <div id=\"jyd-speed150\">1.5X</div>\n" +
        "                <div id=\"jyd-speed125\">1.25X</div>\n" +
        "                <div id=\"jyd-speed100\">1.0X</div>\n" +
        "                <div id=\"jyd-speed075\">0.75X</div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>";

    var theDivDom = document.getElementById(element);
    theDivDom.innerHTML = jydVideoPlayer;

    var video1 = document.getElementById("jyd-video1");
    var video2 = document.getElementById("jyd-video2");
    var video3 = document.getElementById("jyd-video3");

    var playState = 0; //播放状态  1正在播放 0暂停
    var volumeState; //声音状态  1有声音 0静音
    var canFullScreen = 1; //禁用全屏flag  1可全屏 0禁用
    var canChangeSight = 1; //禁用切换主画面flag  1可切换 0禁用
    var currentVideo; //当前主画面  1老师 2学生 3课件
    var currentAudio; //当前声音线路  1老师 2学生 3课件
    var totalT; //视频总时长
    var theSize = parseInt(videoSize); //视频总大小(总和) 单位KB
    var startTime; //视频开始时间
    var endTime; //视频结束时间
    var firstCanplayState = 1; //初次加载状态
    var cuttingStartTime; //剪辑开始时间
    var cuttingEndTime; //剪辑结束时间

    // Each view loads independently; only an explicit stop pauses every view.
    var videos = [video1, video2, video3];
    var pending = new Map();
    function syncPlayback() {
        var active = videos.some(function(video) { return !video.paused && !video.ended && !video.error; });
        if (!active && pending.size == 0) playState = 0;
        $("#jyd-pauseState").removeClass(active ? "jyd-startIcon" : "jyd-pauseIcon")
            .addClass(active ? "jyd-pauseIcon" : "jyd-startIcon");
        if (playState == 1) $(".jyd-videoCover").hide();
        else $(".jyd-videoCover").show();
    }

    function requestPlayback(video) {
        if (playState == 0 || pending.has(video) || !video.paused || video.error) return;
        var request = video.play();
        pending.set(video, request);
        function settled() {
            if (pending.get(video) != request) return;
            pending.delete(video);
            syncPlayback();
        }
        request.then(settled, settled);
    }

    function stopPlayback() {
        playState = 0;
        autoP = false;
        pending.clear();
        videos.forEach(function(video) { video.pause(); });
        syncPlayback();
        $(".jyd-videoWaitingCover").hide();
    }

    function startPlayback() {
        autoP = false;
        playState = 1;
        videos.forEach(function(video) {
            if (video.error) {
                var time = video.currentTime;
                video.load();
                video.currentTime = time;
            }
            requestPlayback(video);
        });
        syncPlayback();
        testNetSpeed();
    }

    videos.forEach(function(video) {
        var waiting = $("#" + video.id + "Wrap").children(".jyd-videoWaitingCover");
        video.addEventListener("pause", syncPlayback);
        video.addEventListener("playing", function() { waiting.hide(); syncPlayback(); });
        video.addEventListener("waiting", function() { if (playState == 1) waiting.show(); });
        video.addEventListener("error", function() { waiting.show(); syncPlayback(); });
        video.addEventListener("canplay", function() { requestPlayback(video); });
        video.addEventListener("loadedmetadata", function() {
            if (playState == 0) return;
            var clock = videos.find(function(other) {
                return other != video && other.readyState > 0 && !other.paused && !other.error;
            });
            if (clock) video.currentTime = clock.currentTime;
        });
    });

    currentVideo = 1;
    if(Hls.isSupported()) {
        [teacherVideoUrl, studentVideoUrl, courseVideoUrl].forEach(function(url, index) {
            var media = new Hls();
            media.loadSource(url);
            media.attachMedia(videos[index]);
            media.on(Hls.Events.MANIFEST_PARSED, function() {
                if (autoP) startPlayback();
            });
        });
    }
    else {
        alert("请使用谷歌浏览器或360浏览器极速模式");
    }
    volumeState = 1;
    changeVoice(1);
    changeVideoWrapSize();


    //测试缓冲进度
    function printBufferedInfo(sight) {
        var video1Buffered = video1.buffered;
        var video2Buffered = video2.buffered;
        var video3Buffered = video3.buffered;
        var logText = "";
        if (sight == 1) {
            logText = "老师画面缓冲中...";
            logText += "\n老师画面缓冲信息：";
            for (var i1 = 0; i1 < video1Buffered.length; i1 ++) {
                logText += "\n\t第" + (i1 + 1) + "段：" + video1Buffered.start(i1) + "-" + video1Buffered.end(i1);
            }
            console.log(logText);
        }
        else if (sight == 2) {
            logText = "学生画面缓冲中...";
            logText += "\n学生画面缓冲信息：";
            for (var j1 = 0; j1 < video2Buffered.length; j1 ++) {
                logText += "\n\t第" + (j1 + 1) + "段：" + video2Buffered.start(j1) + "-" + video2Buffered.end(j1);
            }
            console.log(logText);
        }
        else if (sight == 3) {
            logText = "课件画面缓冲中...";
            logText += "\n课件画面缓冲信息：";
            for (var k1 = 0; k1 < video3Buffered.length; k1 ++) {
                logText += "\n\t第" + (k1 + 1) + "段：" + video3Buffered.start(k1) + "-" + video3Buffered.end(k1);
            }
            console.log(logText);
        }
    }

    //播放时间显示
    video1.addEventListener('canplay',function() {
        totalT = getTotalT(video1.duration);
        var videoDuration = formatTime(totalT);
        document.getElementById("jyd-timeUpdateAll").innerHTML = videoDuration;
        if (firstCanplayState) {
            video1.currentTime = startTime;
            video2.currentTime = startTime;
            video3.currentTime = startTime;
            if (enablePic == "yes" || enablePic == "simple") {
                getPicInfo();
            }
        }
        firstCanplayState = 0;
    });

    //剪辑时长校验
    function getTotalT(maxTime) {
        if (cutStartTime && cutStartTime > 0 && cutStartTime < maxTime) {
            if (cutEndTime && cutEndTime > cutStartTime && cutEndTime < maxTime) {
                startTime = cutStartTime;
                endTime = cutEndTime;
                return cutEndTime - cutStartTime;
            }
            else {
                startTime = cutStartTime;
                endTime = maxTime;
                return maxTime - cutStartTime;
            }
        }
        else {
            if (cutEndTime && cutEndTime > 0 && cutEndTime < maxTime) {
                startTime = 0;
                endTime = cutEndTime;
                return cutEndTime;
            }
            else {
                startTime = 0;
                endTime = maxTime;
                return maxTime;
            }
        }
    }

    video1.addEventListener('timeupdate',function() {
        var presentT = this.currentTime;
        // console.log(endTime, "endTime");
        // console.log(presentT, "presentT");
        if (presentT >= endTime) {
            video1.currentTime = startTime;
            video2.currentTime = startTime;
            video3.currentTime = startTime;
            if (playState == 1) stopPlayback();
        }
        if (draggingProgress) return;
        var videoCurrent = formatTime(presentT - startTime);
        document.getElementById("jyd-timeUpdateNow").innerHTML = videoCurrent;
        $(".jyd-processBarTimeInfo").text(videoCurrent);

        var percent = ( presentT - startTime ) / totalT * 100;
        document.getElementById("jyd-currentProcessBar").style.width = percent + '%';
    });

    function formatTime(t){
        var hh = parseInt(t / 3600);
        hh = hh < 10 ? '0' + hh : hh;
        var mm = parseInt(t % 3600 / 60);
        mm = mm < 10 ? '0' + mm : mm;
        var ss = parseInt(t % 60);
        ss = ss < 10 ? '0' + ss : ss;
        return hh + ':' + mm + ':' + ss;
    }


    //拖动进度条
    var mousePositionX = 0;
    var processBarWidth;
    var draggingProgress = false;
    var progressSeekInterval;
    var lastProgressPosition;
    var processBar = document.getElementById("jyd-processBar");
    var currentProcessBar = document.getElementById("jyd-currentProcessBar");
    function previewProgress(event) {
        mousePositionX = Math.max(0, Math.min(processBarWidth, event.clientX - processBar.offsetLeft));
        currentProcessBar.style.width = mousePositionX + "px";
        var videoCurrent = formatTime(totalT * mousePositionX / processBarWidth);
        document.getElementById("jyd-timeUpdateNow").innerHTML = videoCurrent;
        $(".jyd-processBarTimeInfo").text(videoCurrent);
    }
    function seekProgress() {
        if (mousePositionX === lastProgressPosition) return;
        lastProgressPosition = mousePositionX;
        var target = totalT * mousePositionX / processBarWidth + parseInt(startTime);
        videos.forEach(function(video) { video.currentTime = target; });
    }
    processBar.onmousedown = function(event) {
        if (!Number.isFinite(totalT) || totalT <= 0) return;
        draggingProgress = true;
        $(".jyd-processBarTimeInfo").show();
        processBarWidth = parseInt($("#jyd-processBar").css("width"));
        previewProgress(event || window.event);
        lastProgressPosition = NaN;
        seekProgress();
        clearInterval(progressSeekInterval);
        progressSeekInterval = setInterval(seekProgress, 300);
        document.onmousemove = function(event){
            previewProgress(event || window.event);
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }
    };
    document.onmouseup = function(){
        clearInterval(progressSeekInterval);
        if (draggingProgress) {
            draggingProgress = false;
            seekProgress();
        }
        $(".jyd-processBarTimeInfo").hide();
        document.onmousemove = null;
    };

    //拖动音量条
    var lastVolume = 1;
    var volumeMousePositionX = 0;
    var volumeBarWidth;
    var volumeBar = document.getElementById("jyd-volumeBar");
    var currentVolumeBar = document.getElementById("jyd-currentVolumeBar");
    volumeBar.onmousedown = function(event) {
        var that = this;
        volumeBarWidth = parseInt($("#jyd-volumeBar").css("width"));
        var event = event || window.event;
        volumeMousePositionX = event.clientX - this.offsetLeft;
        video1.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
        video2.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
        video3.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
        currentVolumeBar.style.width = volumeMousePositionX + "px";
        lastVolume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
        $("#jyd-muteBtn").removeClass("jyd-muteIcon");
        $("#jyd-muteBtn").addClass("jyd-unMuteIcon");
        volumeState = 1;
        unMute();
        document.onmousemove = function(event){
            var event = event || window.event;
            volumeMousePositionX = event.clientX - that.offsetLeft;
            if(volumeMousePositionX < 0){
                volumeMousePositionX = 0;
            }
            else if(volumeMousePositionX > volumeBarWidth){
                volumeMousePositionX = volumeBarWidth;
            }
            video1.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
            video2.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
            video3.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
            $("#jyd-muteBtn").removeClass("jyd-muteIcon");
            $("#jyd-muteBtn").addClass("jyd-unMuteIcon");
            currentVolumeBar.style.width = volumeMousePositionX + "px";
            lastVolume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
            volumeState = 1;
            unMute();
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }
    };

    //音源切换
    function changeVoice(theVoice){
        if (theVoice == 1) {
            video1.muted = false;
            video2.muted = true;
            video3.muted = true;
            currentAudio = 1;
            $("#jyd-radioShift").children("span").text("当前音源：老师");
        }
        else if (theVoice == 2) {
            video1.muted = true;
            video2.muted = false;
            video3.muted = true;
            currentAudio = 2;
            $("#jyd-radioShift").children("span").text("当前音源：学生");
        }
        else if (theVoice == 3) {
            video1.muted = true;
            video2.muted = true;
            video3.muted = false;
            currentAudio = 3;
            $("#jyd-radioShift").children("span").text("当前音源：课件");
        }
    }
    $("#jyd-teacherVoice").click(function(event){
        event.stopPropagation();
        changeVoice(1);
        $(".jyd-radioShiftBox").slideUp(0);
    });
    $("#jyd-studentVoice").click(function(event){
        event.stopPropagation();
        changeVoice(2);
        $(".jyd-radioShiftBox").slideUp(0);
    });
    $("#jyd-courseVoice").click(function(event){
        event.stopPropagation();
        changeVoice(3);
        $(".jyd-radioShiftBox").slideUp(0);
    });

    //画面比例自适应
    function changeVideoWrapSize(){
        var video1WrapWidth = $(".jyd-leftWrap").css("width");
        var video1WrapHeight = parseInt(video1WrapWidth) * 9 / 16;
        $(".jyd-leftWrap").css("height", video1WrapHeight);

        // var videoMaxHeight = parseInt($("#jyd-video1Wrap").css("height"));
        $(".jyd-videoCover").css("height", video1WrapHeight);
        $(".jyd-videoPart").css("height", video1WrapHeight);
        $(".jyd-rightTopWrap").css("height", video1WrapHeight / 2);
        $(".jyd-rightBottomWrap").css("height", video1WrapHeight / 2);
        $(".jyd-coverPlayBtn").css("margin-top", video1WrapHeight / 2 - 50);
        // $(".jyd-coverWaitingBtn").css("margin-top", video1WrapHeight / 2 - 50);
    }
    window.onresize = changeVideoWrapSize();

    //播放及暂停
    $(".jyd-videoCover").click(startPlayback);
    $("#jyd-pauseState").click(function(){
        if (playState == 1) stopPlayback();
        else startPlayback();
    });

    //主画面切换
    // function delayFullScreen() { //画面线路切换时禁止全屏
    //     canFullScreen = 0;
    //     setTimeout(function(){
    //         canFullScreen = 1;
    //     }, 100);
    // }
    $("#jyd-video1Wrap").click(function(){
        // console.log(canChangeSight, 'canChangeSight');
        setTimeout(function(){
            if (canChangeSight) {
                var currV = currentVideo;
                if (currV == 1) {

                }
                else if (currV == 2) {
                    // delayFullScreen();
                    currentVideo = 1;
                    $("#jyd-video1Wrap").removeClass("jyd-rightTopWrap");
                    $("#jyd-video1Wrap").addClass("jyd-leftWrap");
                    $("#jyd-video2Wrap").removeClass("jyd-leftWrap");
                    $("#jyd-video2Wrap").addClass("jyd-rightTopWrap");
                    changeVoice(1);
                }
                else if (currV == 3) {
                    // delayFullScreen();
                    currentVideo = 1;
                    $("#jyd-video1Wrap").removeClass("jyd-rightTopWrap");
                    $("#jyd-video1Wrap").addClass("jyd-leftWrap");
                    $("#jyd-video2Wrap").removeClass("jyd-rightBottomWrap");
                    $("#jyd-video2Wrap").addClass("jyd-rightTopWrap");
                    $("#jyd-video3Wrap").removeClass("jyd-leftWrap");
                    $("#jyd-video3Wrap").addClass("jyd-rightBottomWrap");
                    changeVoice(1);
                }
                changeVideoWrapSize();
                // var nowVideoPartHeight = $(".jyd-videoPart").css("height");
                // $(".jyd-videoPart").css("height", parseInt(nowVideoPartHeight) - 50 + "px");
            }
        }, 300);
    });
    $("#jyd-video2Wrap").click(function(){
        // console.log(canChangeSight, 'canChangeSight');
        setTimeout(function(){
            if (canChangeSight) {
                var currV = currentVideo;
                if (currV == 1) {
                    // delayFullScreen();
                    currentVideo = 2;
                    $("#jyd-video1Wrap").removeClass("jyd-leftWrap");
                    $("#jyd-video1Wrap").addClass("jyd-rightTopWrap");
                    $("#jyd-video2Wrap").removeClass("jyd-rightTopWrap");
                    $("#jyd-video2Wrap").addClass("jyd-leftWrap");
                    changeVoice(2);
                }
                else if (currV == 2) {

                }
                else if (currV == 3) {
                    // delayFullScreen();
                    currentVideo = 2;
                    $("#jyd-video2Wrap").removeClass("jyd-rightBottomWrap");
                    $("#jyd-video2Wrap").addClass("jyd-leftWrap");
                    $("#jyd-video3Wrap").removeClass("jyd-leftWrap");
                    $("#jyd-video3Wrap").addClass("jyd-rightBottomWrap");
                    changeVoice(2);
                }
                changeVideoWrapSize();
                // var nowVideoPartHeight = $(".jyd-videoPart").css("height");
                // $(".jyd-videoPart").css("height", parseInt(nowVideoPartHeight) - 50 + "px");
            }
        }, 300);
    });
    $("#jyd-video3Wrap").click(function(){
        // console.log(canChangeSight, 'canChangeSight');
        setTimeout(function(){
            if (canChangeSight) {
                var currV = currentVideo;
                if (currV == 1) {
                    // delayFullScreen();
                    currentVideo = 3;
                    $("#jyd-video1Wrap").removeClass("jyd-leftWrap");
                    $("#jyd-video1Wrap").addClass("jyd-rightTopWrap");
                    $("#jyd-video2Wrap").removeClass("jyd-rightTopWrap");
                    $("#jyd-video2Wrap").addClass("jyd-rightBottomWrap");
                    $("#jyd-video3Wrap").removeClass("jyd-rightBottomWrap");
                    $("#jyd-video3Wrap").addClass("jyd-leftWrap");
                    changeVoice(3);
                }
                else if (currV == 2) {
                    // delayFullScreen();
                    currentVideo = 3;
                    $("#jyd-video2Wrap").removeClass("jyd-leftWrap");
                    $("#jyd-video2Wrap").addClass("jyd-rightBottomWrap");
                    $("#jyd-video3Wrap").removeClass("jyd-rightBottomWrap");
                    $("#jyd-video3Wrap").addClass("jyd-leftWrap");
                    changeVoice(3);
                }
                else if (currV == 3) {

                }
                changeVideoWrapSize();
                // var nowVideoPartHeight = $(".jyd-videoPart").css("height");
                // $(".jyd-videoPart").css("height", parseInt(nowVideoPartHeight) - 50 + "px");
            }
        }, 300);
    });

    //全屏
    var hideControlBoxInterval;
    var controlBarOnHover = 0;
    var picBoxOnHover = 0;
    var fullScreenMousePositionX = 0;
    var fullScreenMousePositionY = 0;
    var lastFullScreenMousePositionX = 0;
    var lastFullScreenMousePositionY = 0;
    function setHideControlBoxInterval(event) {
        hideControlBoxInterval = setInterval(function () {
            // console.log(fullScreenMousePositionX, 'x');
            // console.log(fullScreenMousePositionY, 'y');
            if (fullScreenMousePositionX == lastFullScreenMousePositionX && fullScreenMousePositionY == lastFullScreenMousePositionY) {
                if (controlBarOnHover == 0 && picBoxOnHover == 0) {
                    $(".jyd-videoControlBar").fadeOut(300);
                    $(".jyd-newPicBox").fadeOut(300);
                }
            }
            lastFullScreenMousePositionX = fullScreenMousePositionX;
            lastFullScreenMousePositionY = fullScreenMousePositionY;
        }, 2000);
        document.onmousemove = function(event) {
            fullScreenMousePositionX = event.clientX;
            fullScreenMousePositionY = event.clientY;
            $(".jyd-videoControlBar").show();
            $(".jyd-newPicBox").show();
        }
    }

    $(".jyd-videoControlBar").hover(function() {
        controlBarOnHover = 1;
    }, function() {
        controlBarOnHover = 0;
    });
    $(".jyd-newPicBox").hover(function() {
        picBoxOnHover = 1;
    }, function() {
        picBoxOnHover = 0;
    });

    function startFullScreen(el) {
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
            wscript;
        if(typeof rfs != "undefined" && rfs) {
            rfs.call(el);
            changeVideoWrapSizeFS();
            setHideControlBoxInterval(el);
            $(".jyd-videoPlayerCover").show();
            $(".jyd-videoPlayerCover").dblclick(function() {
                exitFull();
            });
            var fsFalg = 1;
            window.onresize = function(event) {
                if (fsFalg == 0) {
                    clearInterval(hideControlBoxInterval);
                    changeVideoWrapSize();
                    $(".jyd-videoPlayer").css("padding-top", "0");
                    $(".jyd-videoControlBar").show();
                    $(".jyd-videoControlBar").css("position", "static");
                    $(".jyd-newPicBox").css("position", "relative");
                    $(".jyd-newPicBox").css("bottom", "0");
                    $(".jyd-exitFullScreen").css("display", "none");
                    $(".jyd-fullScreen").css("display", "inline-block");
                    $(".jyd-videoPlayerCover").hide();
                }
                fsFalg = 0;
            };
        }
        if(typeof window.ActiveXObject != "undefined") {
            wscript = new ActiveXObject("WScript.Shell");
            if(wscript) {
                wscript.SendKeys("{F11}");
            }
        }
    }
    function exitFull() {
        // 判断各种浏览器，找到正确的方法
        var exitMethod = document.exitFullscreen || //W3C
            document.mozCancelFullScreen || //FireFox
            document.webkitExitFullscreen || //Chrome等
            document.webkitExitFullscreen; //IE11
        if (exitMethod) {
            exitMethod.call(document);
        } else if (typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
        clearInterval(hideControlBoxInterval);
        changeVideoWrapSize();
        $(".jyd-videoPlayer").css("padding-top", "0");
        $(".jyd-videoControlBar").show();
        $(".jyd-videoControlBar").css("position", "static");
        $(".jyd-newPicBox").css("position", "relative");
        $(".jyd-newPicBox").css("bottom", "0");
        $(".jyd-exitFullScreen").css("display", "none");
        $(".jyd-fullScreen").css("display", "inline-block");
        $(".jyd-videoPlayerCover").hide();
    }

    function changeVideoWrapSizeFS() {
        var screenWidth = window.screen.width;
        var screenHeight = window.screen.height;

        var video1WrapWidth = screenWidth * 0.6667;
        var video1WrapHeight = parseInt(video1WrapWidth) * 9 / 16;
        $(".jyd-leftWrap").css("height", video1WrapHeight);

        $(".jyd-videoCover").css("height", video1WrapHeight);
        $(".jyd-videoPart").css("height", video1WrapHeight);
        $(".jyd-videoPlayer").css("padding-top", (screenHeight - video1WrapHeight) / 2 + "px");
        $(".jyd-rightTopWrap").css("height", video1WrapHeight / 2);
        $(".jyd-rightBottomWrap").css("height", video1WrapHeight / 2);
        $(".jyd-coverPlayBtn").css("margin-top", video1WrapHeight / 2 - 50);
        // $(".jyd-coverWaitingBtn").css("margin-top", video1WrapHeight / 2 - 50);

        // $(".jyd-videoControlBar").css("display", "none");
        $(".jyd-videoControlBar").css("position", "absolute");
        $(".jyd-videoControlBar").css("bottom", "0");
        $(".jyd-newPicBox").css("position", "absolute");
        $(".jyd-newPicBox").css("bottom", "50px");
    }
    function fullScreen(fullScreenSight) {
        if (fullScreenSight == 1) {
            if (video1 .requestFullscreen) {
                video1 .requestFullscreen();
            } else if (video1 .mozRequestFullScreen) {
                video1 .mozRequestFullScreen();
            } else if (video1 .webkitRequestFullScreen) {
                video1 .webkitRequestFullScreen();
            }
            changeVoice(1);
        }
        else if (fullScreenSight == 2) {
            if (video2 .requestFullscreen) {
                video2 .requestFullscreen();
            } else if (video2 .mozRequestFullScreen) {
                video2 .mozRequestFullScreen();
            } else if (video2 .webkitRequestFullScreen) {
                video2 .webkitRequestFullScreen();
            }
            changeVoice(2);
        }
        else if (fullScreenSight == 3) {
            if (video3 .requestFullscreen) {
                video3 .requestFullscreen();
            } else if (video3 .mozRequestFullScreen) {
                video3 .mozRequestFullScreen();
            } else if (video3 .webkitRequestFullScreen) {
                video3 .webkitRequestFullScreen();
            }
            changeVoice(3);
        }
    }
    $("#jyd-fullScreen").click(function(){
        $(this).css("display", "none");
        $(".jyd-exitFullScreen").css("display", "inline-block");
        var theElement = document.getElementById("jyd-videoPlayer");
        startFullScreen(theElement);
    });
    $("#jyd-exitFullScreen").click(function(){
        exitFull();
    });
    $("#jyd-video1Wrap").dblclick(function toFullScreen(){
        canChangeSight = 0;
        setTimeout(function () {
            canChangeSight = 1;
        }, 500);
        fullScreen(1);
    });
    $("#jyd-video2Wrap").dblclick(function toFullScreen(){
        canChangeSight = 0;
        setTimeout(function () {
            canChangeSight = 1;
        }, 500);
        fullScreen(2);
    });
    $("#jyd-video3Wrap").dblclick(function toFullScreen(){
        canChangeSight = 0;
        setTimeout(function () {
            canChangeSight = 1;
        }, 500);
        fullScreen(3);
    });

    //打开静音
    function unMute() {
        var curR = currentAudio;
        changeVoice(curR);
    }

    //倍速播放
    $("#jyd-speed200").click(function(){
        video1.playbackRate = 2;
        video2.playbackRate = 2;
        video3.playbackRate = 2;
        $("#jyd-playSpeed").children("span").text("当前倍速：2.0X");
    });
    $("#jyd-speed150").click(function(){
        video1.playbackRate = 1.5;
        video2.playbackRate = 1.5;
        video3.playbackRate = 1.5;
        $("#jyd-playSpeed").children("span").text("当前倍速：1.5X");
    });
    $("#jyd-speed125").click(function(){
        video1.playbackRate = 1.25;
        video2.playbackRate = 1.25;
        video3.playbackRate = 1.25;
        $("#jyd-playSpeed").children("span").text("当前倍速：1.25X");
    });
    $("#jyd-speed100").click(function(){
        video1.playbackRate = 1;
        video2.playbackRate = 1;
        video3.playbackRate = 1;
        $("#jyd-playSpeed").children("span").text("当前倍速：1.0X");
    });
    $("#jyd-speed075").click(function(){
        video1.playbackRate = 0.75;
        video2.playbackRate = 0.75;
        video3.playbackRate = 0.75;
        $("#jyd-playSpeed").children("span").text("当前倍速：0.75X");
    });

    //静音
    $("#jyd-muteBtn").click(function(event){
        event.stopPropagation();
        if (volumeState == 1) {
            currentVolumeBar.style.width = '0px';
            video1.volume = 0;
            video2.volume = 0;
            video3.volume = 0;
            $("#jyd-muteBtn").removeClass("jyd-unMuteIcon");
            $("#jyd-muteBtn").addClass("jyd-muteIcon");
            volumeState = 0;
        }
        else if (volumeState == 0) {
            currentVolumeBar.style.width = lastVolume * 100 + 'px';
            video1.volume = lastVolume;
            video2.volume = lastVolume;
            video3.volume = lastVolume;
            $("#jyd-muteBtn").removeClass("jyd-muteIcon");
            $("#jyd-muteBtn").addClass("jyd-unMuteIcon");
            volumeState = 1;
            unMute();
        }
    });

    //页面交互效果
    $("#jyd-radioShift").click(function(event){
        event.stopPropagation();
        if ($(".jyd-radioShiftBox").css('display') == 'none'){
            $(".jyd-radioShiftBox").slideDown(200);
            $(".jyd-speedShiftBox").slideUp(200);
        }
        else {
            $(".jyd-radioShiftBox").slideUp(200);
        }
    });
    $("#jyd-playSpeed").click(function(event){
        event.stopPropagation();
        if ($(".jyd-speedShiftBox").css('display') == 'none'){
            $(".jyd-speedShiftBox").slideDown(200);
            $(".jyd-radioShiftBox").slideUp(200);
        }
        else {
            $(".jyd-speedShiftBox").slideUp(200);
        }
    });
    $(document).click(function(){
        $(".jyd-radioShiftBox").slideUp(200);
        $(".jyd-speedShiftBox").slideUp(200);
    });
    // 控件区鼠标悬浮交互
    // $(".jyd-videoPlayer").hover(function(){
    //     $(this).children(".jyd-videoControlBar").show();
    //     var nowVideoPartHeight = $(".jyd-videoPart").css("height");
    //     $(".jyd-videoPart").css("height", parseInt(nowVideoPartHeight) - 50 + "px");
    //     $(".jyd-rightBottomWrap").css("bottom", "-50px");
    // }, function(){
    //     $(this).children(".jyd-videoControlBar").hide();
    //     var newVideoPartHeight = $(".jyd-videoPart").css("height");
    //     var trueVideoHeight = $(".jyd-leftWrap").css("height");
    //     if (newVideoPartHeight >= trueVideoHeight) {
    //         // $(".jyd-videoPart").css("height", parseInt(newVideoPartHeight) + 50 + "px");
    //     }
    //     else {
    //         $(".jyd-videoPart").css("height", parseInt(newVideoPartHeight) + 50 + "px");
    //     }
    //     $(".jyd-rightBottomWrap").css("bottom", "0");
    // });

    //检测网速
    function testNetSpeed() {
        if (video1.buffered.length && theSize) {
            var timeRangesIndex = 0;
            var timeRanges = video1.buffered;
            for (var i = 0; i < timeRanges.length; i ++) {
                if (video1.currentTime > timeRanges.start(i) && video1.currentTime < timeRanges.end(i)) {
                    timeRangesIndex = i;
                }
            }
            var lastEndTime = timeRanges.end(timeRangesIndex);
            var bufferdTime = 0;
            // console.log(lastEndTime);
            setInterval(function () {
                timeRangesIndex = 0;
                timeRanges = video1.buffered;
                for (var i = 0; i < timeRanges.length; i ++) {
                    if (video1.currentTime > timeRanges.start(i) && video1.currentTime < timeRanges.end(i)) {
                        timeRangesIndex = i;
                    }
                }
                bufferdTime ++;
                // console.log(bufferdTime, 'bufferdTime');
                // console.log(timeRanges.end(timeRangesIndex), 'last');
                // console.log(lastEndTime, 'lastEndTime');
                if (timeRanges.end(timeRangesIndex) > lastEndTime) {
                    var bufferdChange = timeRanges.end(timeRangesIndex) - lastEndTime;
                    var bufferdTrueChange = (bufferdChange / totalT) * theSize;
                    var bufferSpeed = Math.round(bufferdTrueChange / bufferdTime);
                    if (bufferSpeed > 1024 && bufferSpeed < 5000) {
                        bufferSpeedM = Math.round((bufferSpeed / 1024) * 100) / 100;
                        document.getElementById("jyd-coverWaitingBufferSpeed").innerText = bufferSpeedM + 'MB/s';
                    }
                    else if (bufferSpeed > 5000) {
                        bufferSpeedM = Math.round((bufferSpeed / 1024) * 100) / 100;
                        document.getElementById("jyd-coverWaitingBufferSpeed").innerText = '大于5MB/s';
                    }
                    else if (bufferSpeed < 1024 && bufferSpeed > 0) {
                        document.getElementById("jyd-coverWaitingBufferSpeed").innerText = bufferSpeed + 'kB/s';
                    }
                    // console.log(bufferSpeed + 'kB/s');
                    lastEndTime = timeRanges.end(timeRangesIndex);
                    bufferdTime = 0;
                }
            }, 1000)
        }
    }

    //获取打点数据
    function getPicInfo() {
        $.ajax({
            method: 'get',
            url: getPicInfoUrl,
            data: {
                // method: 'getPicInfo',
                id: getPicInfoId
            },
            success: function (data) {
                var picInfo = eval('(' + data + ')').result;
                if (enablePic == "yes") {
                    newSetPicInfo(picInfo);
                }
                else if (enablePic == "simple") {
                    setPicInfo(picInfo);
                }
            },
            error: function () {
                alert("获取打点信息失败");
                // var picInfo = [{"time":16,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/16.jpg&g=16.jpg&yspf=E:/Root","name":"机械设计总论"},{"time":35,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/35.jpg&g=35.jpg&yspf=E:/Root","name":"第一章总论"},{"time":54,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/54.jpg&g=54.jpg&yspf=E:/Root","name":"1.1机械设计课程的性质与任务"},{"time":56,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/56.jpg&g=56.jpg&yspf=E:/Root","name":"1.1.1本课程的研究对象"},{"time":57,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/57.jpg&g=57.jpg&yspf=E:/Root","name":"1.1机械设计课程的性质与任务"},{"time":63,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/63.jpg&g=63.jpg&yspf=E:/Root","name":"1.1.1本课程的研究对象"},{"time":87,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/87.jpg&g=87.jpg&yspf=E:/Root","name":"机械零件的分类\t专用零件:"},{"time":114,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/114.jpg&g=114.jpg&yspf=E:/Root","name":"学习本课程的注意事项\t1）正确对......"},{"time":169,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/169.jpg&g=169.jpg&yspf=E:/Root","name":"需求调研"},{"time":214,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/214.jpg&g=214.jpg&yspf=E:/Root","name":"\t\t\t1.2机械设计的一般步骤1.2.2......."},{"time":235,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/235.jpg&g=235.jpg&yspf=E:/Root","name":"1.2机械设计图"},{"time":269,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/269.jpg&g=269.jpg&yspf=E:/Root","name":"lim\tSt"},{"time":286,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/286.jpg&g=286.jpg&yspf=E:/Root","name":"1.机械零件的计算准则\t3、寿命准......"},{"time":348,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/348.jpg&g=348.jpg&yspf=E:/Root","name":"1.4机械设计的最新进展\t干涉检查"},{"time":354,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/354.jpg&g=354.jpg&yspf=E:/Root","name":"1.4机械设计的最新进展\t底座网格......"}];
                // if (enablePic == "yes") {
                //     newSetPicInfo(picInfo);
                // }
                // else if (enablePic == "simple") {
                //     setPicInfo(picInfo);
                // }
            }
        })
    }

    //加载打点数据
    function setPicInfo(picInfo) {
        if (picInfo) {
            for (var i = 0; i < picInfo.length; i ++) {
                // console.log(picInfo[i].name, 'name');
                // console.log(picInfo[i].time, 'time');
                if (picInfo[i].time > startTime && picInfo[i].time < endTime) {
                    var pointLeft = Math.round((( picInfo[i].time - startTime ) / totalT ) * 100);
                    var insertPointDiv = "" +
                        "            <div class=\"jyd-picPoint\" style=\"left:" + pointLeft + "%\">" +
                        "                <div class=\"jyd-picPointImg\">" +
                        "                    <img src=\"" + picInfo[i].pic + "\" />" +
                        "                    <div class=\"jyd-picPointText\">" + picInfo[i].name + "</div>" +
                        "                </div>" +
                        "            </div>";
                    $("#jyd-processBar").append(insertPointDiv);
                }
            }
        }
    }

    //新打点
    function newSetPicInfo(picInfo) {
        if (picInfo) {
            for (var i = 0; i < picInfo.length; i ++) {
                if (picInfo[i].time > startTime && picInfo[i].time < endTime) {
                    var pointLeft = Math.round((( picInfo[i].time - startTime ) / totalT ) * 100);
                    var insertPointDiv = "" +
                        "            <div class=\"jyd-picPoint\" id=\"jyd-picPointIndex_" + i + "\" style=\"left:" + pointLeft + "%\">" +
                        "            </div>";
                    $("#jyd-processBar").append(insertPointDiv);
                    var insertPicInfoDiv = "" +
                        "            <div class=\"jyd-newPicInfoItem\" id=\"jyd-newPicInfoItem_" + picInfo[i].time + "\">" +
                        "               <img src=\"" + picInfo[i].pic + "\" draggable=\"false\" />" +
                        "               <div class=\"jyd-newPicInfoText\">" + picInfo[i].name + "</div>" +
                        "            </div>";
                    $(".jyd-newPicInnerBox").append(insertPicInfoDiv);
                }
            }
        }
        var dragMouseTruePositionX = 0;
        var downMouseTruePositionX = 0;
        $(".jyd-newPicInfoItem").click(function(){
            console.log(dragMouseTruePositionX - downMouseTruePositionX, 'move');
            if (dragMouseTruePositionX - downMouseTruePositionX < 3 && dragMouseTruePositionX - downMouseTruePositionX > -3) {
                var evalTime = $(this).attr("id").split("_")[1];
                video1.currentTime = evalTime;
                video2.currentTime = evalTime;
                video3.currentTime = evalTime;
            }
            dragMouseTruePositionX = 0;
            downMouseTruePositionX = 0;
        });
        $(".jyd-picPoint").hover(function() {
            var picPointIndex = $(this).attr("id").split("_")[1];
            $(".jyd-newPicInfoItem").eq(picPointIndex).addClass("onselectPic");
            goPicPointPosition(picPointIndex);
        },function () {
            var picPointIndex = $(this).attr("id").split("_")[1];
            $(".jyd-newPicInfoItem").eq(picPointIndex).removeClass("onselectPic");
        });
        var dragMousePositionX = 0;
        var downMousePositionX = 0;
        var theScrl;
        var dragBox = document.getElementById("jyd-newPicMiddleBox");
        dragBox.onmousedown = function(event) {
            downMousePositionX = event.offsetX;
            downMouseTruePositionX = event.clientX;
            dragMouseTruePositionX = event.clientX;
            theScrl = $(".jyd-newPicMiddleBox").scrollLeft();
            // console.log(downMousePositionX, 'downMousePositionX');
            dragBox.onmousemove = function(event) {
                dragMousePositionX = event.offsetX;
                dragMouseTruePositionX = event.clientX;
                // console.log(dragMousePositionX, 'dragMousePositionX');
                theScrl = theScrl - (dragMousePositionX - downMousePositionX);
                $(".jyd-newPicMiddleBox").scrollLeft(theScrl);
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            }
        };
        document.onmouseup = function(){
            $(".jyd-processBarTimeInfo").hide();
            dragBox.onmousemove = null; //弹起鼠标不做任何操作
            document.onmousemove = null; //弹起鼠标不做任何操作
        };
    }

    var movepx = option.movepx ? option.movepx : 3;
    var scrl;
    var holdRight;
    var holdLeft;

    //单击滚页按钮
    $(".jyd-newPicRightBtn").click(function(){
        scrl = $(".jyd-newPicMiddleBox").scrollLeft();
        scrl += movepx;
        $(".jyd-newPicMiddleBox").scrollLeft(scrl);

    });
    $(".jyd-newPicLeftBtn").click(function(){
        scrl = $(".jyd-newPicMiddleBox").scrollLeft();
        scrl -= movepx;
        $(".jyd-newPicMiddleBox").scrollLeft(scrl);

    });
    //按住滚页按钮
	$(".jyd-newPicRightBtn").mousedown(function(e){
		if (e.which == 1)
		{
			scrl = $(".jyd-newPicMiddleBox").scrollLeft();
			holdRight = setInterval(function() {
				scrl += movepx;
				$(".jyd-newPicMiddleBox").scrollLeft(scrl);
			}, 1);
		}
		else if (e.which == 2 || e.which == 3)
		{
			clearInterval(holdRight);
		}
	});
	$(".jyd-newPicRightBtn").mouseup(function(){
		clearInterval(holdRight);
	});
    $(".jyd-newPicRightBtn").mousemove(function(){
        clearInterval(holdRight);
    });
	$(".jyd-newPicLeftBtn").mousedown(function(e){
		if (e.which == 1)
		{
			scrl = $(".jyd-newPicMiddleBox").scrollLeft();
			holdLeft = setInterval(function() {
				scrl -= movepx;
				$(".jyd-newPicMiddleBox").scrollLeft(scrl);
			}, 1);
		}
		else if (e.which == 2 || e.which == 3)
		{
			clearInterval(holdLeft);
		}
	});
	$(".jyd-newPicLeftBtn").mouseup(function() {
		clearInterval(holdLeft);
	});
    $(".jyd-newPicLeftBtn").mousemove(function() {
        clearInterval(holdLeft);
    });

    //打点图片定位
    function goPicPointPosition(picPointIndex) {
        $(".jyd-newPicMiddleBox").stop();
        var pointOffsetX = $(".jyd-newPicInfoItem").eq(picPointIndex).offset().left;
        $(".jyd-newPicMiddleBox").animate({scrollLeft: pointOffsetX}, 1000);
    }

    //对外暴露方法
    return {
        //暂停播放
        stopVideo: stopPlayback,
        //继续播放
        playVideo: startPlayback,
        //获取播放时间点
        playCurrentTime: function () {
            var theCurrentTime = Math.floor(video1.currentTime);
            return theCurrentTime;
        },
        //跳转到播放时间点
        playStartPoint: function (evalTime) {
            video1.currentTime = evalTime;
            video2.currentTime = evalTime;
            video3.currentTime = evalTime;
        },
        //开启剪辑功能
        startCutting: function () {
            if (playState == 1) stopPlayback();
            $("#jyd-currentProcessBar").hide();
            $(".jyd-picPoint").hide();
            $(".jyd-radioShift").hide();
            $(".jyd-playSpeed").hide();
            $(".jyd-processBar").css("width", "calc(100% - 400px)");
            var insertCuttingBar = "" +
                "            <div class=\"jyd-picCuttingBar\" id=\"jyd-picCuttingBarStart\" style=\"left:0%\">" +
                "               <div class=\"jyd-picCuttingHandleUp\"></div>" +
                "            </div>" +
                "            <div class=\"jyd-picCuttingBar\" id=\"jyd-picCuttingBarEnd\" style=\"left:100%\">" +
                "               <div class=\"jyd-picCuttingHandleDown\"></div>" +
                "            </div>";
            $("#jyd-processBar").append(insertCuttingBar);
            $(".jyd-picCuttingBar").mousedown(function(event){
                event.stopPropagation();
            });
            processBarWidth = parseInt($("#jyd-processBar").css("width"));
            var startPosition = 0;
            var endPostion = processBarWidth;
            mousePositionX = 0;
            var startBar = document.getElementById("jyd-picCuttingBarStart");
            startBar.onmousedown = function(event) {
                var that = document.getElementById("jyd-processBar");
                var event = event || window.event;
                document.onmousemove = function(event){
                    var event = event || window.event;
                    mousePositionX = event.clientX - that.offsetLeft;
                    if(mousePositionX < 0){
                        mousePositionX = 0;
                    }
                    else if(mousePositionX > endPostion){
                        mousePositionX = endPostion;
                    }
                    video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    video2.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    video3.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    startBar.style.left = mousePositionX + "px";
                    startPosition = mousePositionX;
                    cuttingStartTime = totalT * startPosition / processBarWidth + parseInt(startTime);
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                }
            }
            var endBar = document.getElementById("jyd-picCuttingBarEnd");
            endBar.onmousedown = function(event) {
                var that = document.getElementById("jyd-processBar");
                var event = event || window.event;
                document.onmousemove = function(event){
                    var event = event || window.event;
                    mousePositionX = event.clientX - that.offsetLeft;
                    if(mousePositionX < startPosition){
                        mousePositionX = startPosition;
                    }
                    else if(mousePositionX > processBarWidth){
                        mousePositionX = processBarWidth;
                    }
                    video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    video2.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    video3.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    endBar.style.left = mousePositionX + "px";
                    endPostion = mousePositionX;
                    cuttingEndTime = totalT * endPostion / processBarWidth + parseInt(startTime);
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                }
            }
        },
        //取消剪辑功能
        cancelCutting: function () {
            $("#jyd-currentProcessBar").show();
            $(".jyd-picPoint").show();
            $(".jyd-picCuttingBar").remove();
        },
        //完成剪辑功能
        completeCutting: function() {
            var cuttingInfo = {
                theStartTime: cuttingStartTime,
                theEndTime: cuttingEndTime
            };
            console.log(cuttingInfo);
            $("#jyd-currentProcessBar").show();
            $(".jyd-picPoint").show();
            $(".jyd-picCuttingBar").remove();
        },
        //获取剪辑开始时间
        getCuttingStartTime: function() {
            if (cuttingStartTime) {
                return Math.round(cuttingStartTime);
            }
            else {
                return 0;
            }
        },
        //获取剪辑结束时间
        getCuttingEndTime: function() {
            if (cuttingEndTime) {
                return Math.round(cuttingEndTime);
            }
            else {
                return totalT;
            }
        },
        //获取缓冲信息
        getBufferedInfo: function() {
            var video1Buffered = video1.buffered;
            var video2Buffered = video2.buffered;
            var video3Buffered = video3.buffered;
            var logText = "";
            logText += "当前缓冲信息：";
            logText += "\n\t老师画面加载时段：";
            for (var i1 = 0; i1 < video1Buffered.length; i1 ++) {
                logText += "\n\t\t第" + (i1 + 1) + "段：" + video1Buffered.start(i1) + "-" + video1Buffered.end(i1);
            }
            logText += "\n\t学生画面加载时段：";
            for (var j1 = 0; j1 < video2Buffered.length; j1 ++) {
                logText += "\n\t\t第" + (j1 + 1) + "段：" + video2Buffered.start(j1) + "-" + video2Buffered.end(j1);
            }
            logText += "\n\t课件画面加载时段：";
            for (var k1 = 0; k1 < video3Buffered.length; k1 ++) {
                logText += "\n\t\t第" + (k1 + 1) + "段：" + video3Buffered.start(k1) + "-" + video3Buffered.end(k1);
            }
            console.log(logText);
        },
        //开启自动获取缓冲信息
        getBufferedInfoAutoOpen: function() {
            video1.onprogress = function() {
                printBufferedInfo(1);
            };
            video2.onprogress = function() {
                printBufferedInfo(2);
            };
            video3.onprogress = function() {
                printBufferedInfo(3);
            };
        },
        //关闭自动获取缓冲信息
        getBufferedInfoAutoClose: function() {
            video1.onprogress = null;
            video2.onprogress = null;
            video3.onprogress = null;
        }
    }
}

//ts:老师、学生两画面
function sightTypeTS(option, autoP) {
    var element = option.element;
    var teacherVideoUrl = option.teacherVideoUrl;
    var studentVideoUrl = option.studentVideoUrl;
    var courseVideoUrl = option.courseVideoUrl;
    var videoSize = option.videoSize;
    var getPicInfoUrl = option.getPicInfoUrl;
    var getPicInfoId = option.getPicInfoId;
    var cutStartTime = option.cutStartTime;
    var cutEndTime = option.cutEndTime;
    var enablePic = option.enablePic;

    var jydVideoPlayer = "" +
        "<div class=\"jyd-videoPlayer\" id=\"jyd-videoPlayer\">\n" +
        "    <div class=\"jyd-videoPlayerCover\"></div>" +
        "    <div class=\"jyd-videoPart\">\n" +
        "        <div class=\"jyd-videoCover\">\n" +
        "            <div class=\"jyd-coverPlayBtn\"></div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-videoWrap jyd-leftWrap-doubleScreen\" id=\"jyd-video1Wrap\">\n" +
        "            <div class=\"jyd-videoWaitingCover\">\n" +
        "                <div class=\"jyd-coverWaitingBtn\">" +
        "                   <div class=\"jyd-coverWaitingIcon\"></div>" +
        "                   <div class=\"jyd-coverWaitingText\">loading...</div>" +
        "                   <div class=\"jyd-coverWaitingBufferSpeed\" id=\"jyd-coverWaitingBufferSpeed\"></div>" +
        "                </div>\n" +
        "            </div>\n" +
        "            <video id=\"jyd-video1\"></video>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-videoWrap jyd-rightWrap-doubleScreen\" id=\"jyd-video2Wrap\">\n" +
        "            <div class=\"jyd-videoWaitingCover\">\n" +
        "                <div class=\"jyd-coverWaitingBtn\">" +
        "                   <div class=\"jyd-coverWaitingIcon\"></div>" +
        "                   <div class=\"jyd-coverWaitingText\">loading...</div>" +
        "                   <div class=\"jyd-coverWaitingBufferSpeed\" id=\"jyd-coverWaitingBufferSpeed\"></div>" +
        "                </div>\n" +
        "            </div>\n" +
        "            <video id=\"jyd-video2\"></video>\n" +
        "        </div>\n" +
        "    </div>\n";
        if (enablePic && enablePic == "yes") {
            jydVideoPlayer += "" +
                "<div class=\"jyd-newPicBox\">" +
                "    <div class=\"jyd-newPicMiddleBox\" id=\"jyd-newPicMiddleBox\">" +
                "       <div class=\"jyd-newPicInnerBox\"></div>" +
                "    </div>" +
                "    <div class=\"jyd-newPicLeftBtn\">《</div>" +
                "    <div class=\"jyd-newPicRightBtn\">》</div>" +
                "</div>";
        }
        jydVideoPlayer += "" +
        "    <div class=\"jyd-videoControlBar\">\n" +
        "        <div class=\"jyd-startAndPause jyd-startIcon\" id=\"jyd-pauseState\"></div>\n" +
        "        <div class=\"jyd-processBar\" id=\"jyd-processBar\">\n" +
        "            <div class=\"jyd-currentProcessBar\" id=\"jyd-currentProcessBar\">\n" +
        "                <div class=\"jyd-roundBar\">" +
        "                    <div class=\"jyd-processBarTimeInfo\">00:00:00</div>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-timeUpdateNow\" id=\"jyd-timeUpdateNow\">00:00:00</div>\n" +
        "        <div class=\"jyd-splitTimeUpdate\">/</div>\n" +
        "        <div class=\"jyd-timeUpdateAll\" id=\"jyd-timeUpdateAll\">00:00:00</div>\n" +
        "        <div class=\"jyd-fullScreen\" id=\"jyd-fullScreen\"></div>\n" +
        "        <div class=\"jyd-exitFullScreen\" id=\"jyd-exitFullScreen\"></div>\n" +
        "        <div class=\"jyd-volumeBar\" id=\"jyd-volumeBar\">\n" +
        "            <div class=\"jyd-currentVolumeBar\" id=\"jyd-currentVolumeBar\">\n" +
        "                <div class=\"jyd-volumeRoundBar\"></div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-muteBtn jyd-unMuteIcon\" id=\"jyd-muteBtn\"></div>\n" +
        "        <div class=\"jyd-radioShift\" id=\"jyd-radioShift\">\n" +
        "            <span>当前音源：老师</span>\n" +
        "            <div class=\"jyd-radioShiftBox\">\n" +
        "                <div id=\"jyd-teacherVoice\">老师</div>\n" +
        "                <div id=\"jyd-studentVoice\">学生</div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-playSpeed\" id=\"jyd-playSpeed\">\n" +
        "            <span>当前倍速：1.0X</span>\n" +
        "            <div class=\"jyd-speedShiftBox\">\n" +
        "                <div id=\"jyd-speed200\">2.0X</div>\n" +
        "                <div id=\"jyd-speed150\">1.5X</div>\n" +
        "                <div id=\"jyd-speed125\">1.25X</div>\n" +
        "                <div id=\"jyd-speed100\">1.0X</div>\n" +
        "                <div id=\"jyd-speed075\">0.75X</div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>";

    var theDivDom = document.getElementById(element);
    theDivDom.innerHTML = jydVideoPlayer;

    var video1 = document.getElementById("jyd-video1");
    var video2 = document.getElementById("jyd-video2");

    var playState; //播放状态  1正在播放 0暂停
    var volumeState; //声音状态  1有声音 0静音
    var canFullScreen = 1; //禁用全屏flag  1可全屏 0禁用
    var canChangeSight = 1; //禁用切换主画面flag  1可切换 0禁用
    var currentVideo; //当前主画面  1老师 2学生
    var currentAudio; //当前声音线路  1老师 2学生
    var totalT; //视频总时长
    var theSize = parseInt(videoSize); //视频总大小(总和) 单位KB
    var startTime; //视频开始时间
    var endTime; //视频结束时间
    var firstCanplayState = 1; //初次加载状态
    var cuttingStartTime; //剪辑开始时间
    var cuttingEndTime; //剪辑结束时间

    //主画面线路  //视频加载
    var video1Url = teacherVideoUrl;
    var video2Url = studentVideoUrl;
    currentVideo = 1;
    if(Hls.isSupported()) {
        hls1 = new Hls();
        hls1.loadSource(video1Url);
        hls1.attachMedia(video1);
        hls1.on(Hls.Events.MANIFEST_PARSED,function() {
            if (autoP) {
                video1.play();
                $(".jyd-videoCover").hide();
                $("#jyd-pauseState").removeClass("jyd-startIcon");
                $("#jyd-pauseState").addClass("jyd-pauseIcon");
                playState = 1;
            }
            else {
                video1.pause();
                playState = 0;
            }
        });
        // hls1.on(Hls.Events.ERROR, (event, data) => {
        //     sightTypeSingle('s');
        // });
        hls2 = new Hls();
        hls2.loadSource(video2Url);
        hls2.attachMedia(video2);
        hls2.on(Hls.Events.MANIFEST_PARSED,function() {
            if (autoP) {
                video2.play();
                $(".jyd-videoCover").hide();
                $("#jyd-pauseState").removeClass("jyd-startIcon");
                $("#jyd-pauseState").addClass("jyd-pauseIcon");
                playState = 1;
            }
            else {
                video2.pause();
                playState = 0;
            }
        });
        // hls2.on(Hls.Events.ERROR, (event, data) => {
        //     sightTypeSingle('t');
        // });
    }
    else {
        alert("请使用谷歌浏览器或360浏览器极速模式");
    }
    volumeState = 1;
    changeVoice(1);
    changeVideoWrapSize();


    // 缓冲进度
    // var timeRanges;
    // setInterval(function(){
    //     timeRanges = video1.buffered;
    //     console.log(timeRanges.end(0), '1');
    // }, '100');
    // setInterval(function(){
    //     timeRanges = video2.buffered;
    //     console.log(timeRanges.end(0), '2');
    // }, '100');
    // setInterval(function(){
    //     timeRanges = video3.buffered;
    //     console.log(timeRanges.end(0), '3');
    // }, '100');

    var video1Loading = 1;
    var video2Loading = 1;
    var video1MetaLoad = 0;
    var video2MetaLoad = 0;

    function allLoad() {
        if (video1MetaLoad + video2MetaLoad) {
            if (playState == 1) {
                // $(".jyd-videoWaitingCover").hide();
                // video1.play();
                // video2.play();
                video1Loading = 0;
                video2Loading = 0;
                testNetSpeed();
            }
        }
    }

    video1.onloadedmetadata = function() {
        video1MetaLoad = 1;
        if (playState == 0) {
            video1.pause();
        }
        allLoad();
    };
    video2.onloadedmetadata = function() {
        video2MetaLoad = 1;
        if (playState == 0) {
            video2.pause();
        }
        allLoad();
    };

    //测试缓冲进度
    function printBufferedInfo(sight) {
        var video1Buffered = video1.buffered;
        var video2Buffered = video2.buffered;
        var logText = "";
        if (sight == 1) {
            logText = "老师画面缓冲中...";
            logText += "\n老师画面缓冲信息：";
            for (var i1 = 0; i1 < video1Buffered.length; i1 ++) {
                logText += "\n\t第" + (i1 + 1) + "段：" + video1Buffered.start(i1) + "-" + video1Buffered.end(i1);
            }
            console.log(logText);
        }
        else if (sight == 2) {
            logText = "学生画面缓冲中...";
            logText += "\n学生画面缓冲信息：";
            for (var j1 = 0; j1 < video2Buffered.length; j1 ++) {
                logText += "\n\t第" + (j1 + 1) + "段：" + video2Buffered.start(j1) + "-" + video2Buffered.end(j1);
            }
            console.log(logText);
        }
    }

    function consoleLogFlag() {
        console.log(video1Loading, 'video1Loading');
        console.log(video2Loading, 'video2Loading');
    }

    video1.onwaiting = function() {
        // if (video1Loading + video2Loading == 0) {
            video1Loading = 1;
            // console.log(video1Loading + video2Loading + video3Loading, 'sum');
            // console.log('1loading');
            // video2.pause();
            // consoleLogFlag();
            $("#jyd-video1Wrap").children(".jyd-videoWaitingCover").show();
        // }
        // else{
        //     return false
        // }
    };
    video2.onwaiting = function() {
        // if (video1Loading + video2Loading == 0) {
            video2Loading = 1;
            // console.log(video1Loading + video2Loading + video3Loading, 'sum');
            // console.log('2loading');
            // video1.pause();
            // consoleLogFlag();
            $("#jyd-video2Wrap").children(".jyd-videoWaitingCover").show();
        // }
        // else{
        //     return false
        // }
    };

    function goOnPlay(){
        // console.log('goOn!');
        // consoleLogFlag();
        if (video1Loading + video2Loading == 0) {
            if (playState == 1) {
                // console.log('realyGoOn!');
                // $(".jyd-videoWaitingCover").hide();
                video1.play();
                video2.play();
            }
        }
    }

    video1.onplaying = function() {
        video1Loading = 0;
        $("#jyd-video1Wrap").children(".jyd-videoWaitingCover").hide();
        goOnPlay();
    };

    video2.onplaying = function() {
        video2Loading = 0;
        $("#jyd-video2Wrap").children(".jyd-videoWaitingCover").hide();
        goOnPlay();
    };

    //播放时间显示
    video1.addEventListener('canplay',function(){
        totalT = getTotalT(video1.duration);
        var videoDuration = formatTime(totalT);
        document.getElementById("jyd-timeUpdateAll").innerHTML = videoDuration;
        if (firstCanplayState) {
            video1.currentTime = startTime;
            video2.currentTime = startTime;
            if (enablePic == "yes" || enablePic == "simple") {
                getPicInfo();
            }
        }
        firstCanplayState = 0;
    });

    //剪辑时长校验
    function getTotalT(maxTime) {
        if (cutStartTime && cutStartTime > 0 && cutStartTime < maxTime) {
            if (cutEndTime && cutEndTime > cutStartTime && cutEndTime < maxTime) {
                startTime = cutStartTime;
                endTime = cutEndTime;
                return cutEndTime - cutStartTime;
            }
            else {
                startTime = cutStartTime;
                endTime = maxTime;
                return maxTime - cutStartTime;
            }
        }
        else {
            if (cutEndTime && cutEndTime > 0 && cutEndTime < maxTime) {
                startTime = 0;
                endTime = cutEndTime;
                return cutEndTime;
            }
            else {
                startTime = 0;
                endTime = maxTime;
                return maxTime;
            }
        }
    }

    video1.addEventListener('timeupdate',function() {
        var presentT = this.currentTime;
        // console.log(endTime, "endTime");
        // console.log(presentT, "presentT");
        if (presentT >= endTime) {
            video1.currentTime = startTime;
            video2.currentTime = startTime;
            if(playState == 1) {
                video1.pause();
                video2.pause();
                $("#jyd-pauseState").removeClass("jyd-pauseIcon");
                $("#jyd-pauseState").addClass("jyd-startIcon");
                playState = 0;
                $(".jyd-videoCover").show();
                $(".jyd-videoWaitingCover").hide();
            }
        }
        var videoCurrent = formatTime(presentT - startTime);
        document.getElementById("jyd-timeUpdateNow").innerHTML = videoCurrent;
        $(".jyd-processBarTimeInfo").text(videoCurrent);

        var percent = ( presentT - startTime ) / totalT * 100;
        document.getElementById("jyd-currentProcessBar").style.width = percent + '%';
    });

    function formatTime(t){
        var hh = parseInt(t / 3600);
        hh = hh < 10 ? '0' + hh : hh;
        var mm = parseInt(t % 3600 / 60);
        mm = mm < 10 ? '0' + mm : mm;
        var ss = parseInt(t % 60);
        ss = ss < 10 ? '0' + ss : ss;
        return hh + ':' + mm + ':' + ss;
    }

    //拖动进度条
    var mousePositionX = 0;
    var processBarWidth;
    var processBar = document.getElementById("jyd-processBar");
    var currentProcessBar = document.getElementById("jyd-currentProcessBar");
    processBar.onmousedown = function(event) {
        var that = this;
        $(".jyd-processBarTimeInfo").show();
        processBarWidth = parseInt($("#jyd-processBar").css("width"));
        var event = event || window.event;
        mousePositionX = event.clientX - this.offsetLeft;
        video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
        video2.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
        allLoad();
        currentProcessBar.style.width = mousePositionX + "px";
        document.onmousemove = function(event){
            var event = event || window.event;
            mousePositionX = event.clientX - that.offsetLeft;
            if(mousePositionX < 0){
                mousePositionX = 0;
            }
            else if(mousePositionX > processBarWidth){
                mousePositionX = processBarWidth;
            }
            video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
            video2.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
            allLoad();
            currentProcessBar.style.width = mousePositionX + "px";
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }
    };
    document.onmouseup = function(){
        $(".jyd-processBarTimeInfo").hide();
        document.onmousemove = null; //弹起鼠标不做任何操作
    };

    //拖动音量条
    var lastVolume = 1;
    var volumeMousePositionX = 0;
    var volumeBarWidth;
    var volumeBar = document.getElementById("jyd-volumeBar");
    var currentVolumeBar = document.getElementById("jyd-currentVolumeBar");
    volumeBar.onmousedown = function(event) {
        var that = this;
        volumeBarWidth = parseInt($("#jyd-volumeBar").css("width"));
        var event = event || window.event;
        volumeMousePositionX = event.clientX - this.offsetLeft;
        video1.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
        video2.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
        currentVolumeBar.style.width = volumeMousePositionX + "px";
        lastVolume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
        $("#jyd-muteBtn").removeClass("jyd-muteIcon");
        $("#jyd-muteBtn").addClass("jyd-unMuteIcon");
        volumeState = 1;
        unMute();
        document.onmousemove = function(event){
            var event = event || window.event;
            volumeMousePositionX = event.clientX - that.offsetLeft;
            if(volumeMousePositionX < 0){
                volumeMousePositionX = 0;
            }
            else if(volumeMousePositionX > volumeBarWidth){
                volumeMousePositionX = volumeBarWidth;
            }
            video1.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
            video2.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
            $("#jyd-muteBtn").removeClass("jyd-muteIcon");
            $("#jyd-muteBtn").addClass("jyd-unMuteIcon");
            currentVolumeBar.style.width = volumeMousePositionX + "px";
            lastVolume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
            volumeState = 1;
            unMute();
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }
    };

    //音源切换
    function changeVoice(theVoice){
        if (theVoice == 1) {
            video1.muted = false;
            video2.muted = true;
            currentAudio = 1;
            $("#jyd-radioShift").children("span").text("当前音源：老师");
        }
        else if (theVoice == 2) {
            video1.muted = true;
            video2.muted = false;
            currentAudio = 2;
            $("#jyd-radioShift").children("span").text("当前音源：学生");
        }
    }
    $("#jyd-teacherVoice").click(function(event){
        event.stopPropagation();
        changeVoice(1);
        $(".jyd-radioShiftBox").slideUp(0);
    });
    $("#jyd-studentVoice").click(function(event){
        event.stopPropagation();
        changeVoice(2);
        $(".jyd-radioShiftBox").slideUp(0);
    });

    //画面比例自适应
    function changeVideoWrapSize(){
        var video1WrapWidth = $(".jyd-leftWrap-doubleScreen").css("width");
        var video1WrapHeight = parseInt(video1WrapWidth) * 9 / 16;
        $(".jyd-leftWrap-doubleScreen").css("height", video1WrapHeight);

        // var videoMaxHeight = parseInt($("#jyd-video1Wrap").css("height"));
        $(".jyd-videoCover").css("height", video1WrapHeight);
        $(".jyd-videoPart").css("height", video1WrapHeight);
        $(".jyd-rightWrap-doubleScreen").css("height", video1WrapHeight);
        $(".jyd-coverPlayBtn").css("margin-top", video1WrapHeight / 2 - 50);
        $(".jyd-coverWaitingBtn").css("margin-top", video1WrapHeight / 2 - 50);
    }
    window.onresize = changeVideoWrapSize();

    //播放及暂停
    $(".jyd-videoCover").click(function(){
        // if(video1MetaLoad + video2MetaLoad == 2) {
        //     video1.play();
        //     video2.play();
        //     $(".jyd-videoCover").hide();
        // }
        // else if(video1MetaLoad + video2MetaLoad < 2) {
        //     video1.pause();
        //     video2.pause();
        //     $(".jyd-videoCover").hide();
        //     $(".jyd-videoWaitingCover").show();
        // }
        video1.play();
        video2.play();
        $(this).hide();
        $("#jyd-pauseState").removeClass("jyd-startIcon");
        $("#jyd-pauseState").addClass("jyd-pauseIcon");
        playState = 1;
        testNetSpeed();
    });
    $("#jyd-pauseState").click(function(){
        if(playState == 1){
            video1.pause();
            video2.pause();
            $("#jyd-pauseState").removeClass("jyd-pauseIcon");
            $("#jyd-pauseState").addClass("jyd-startIcon");
            playState = 0
            $(".jyd-videoCover").show();
            $(".jyd-videoWaitingCover").hide();
        }
        else if(playState == 0){
            if(video1MetaLoad + video2MetaLoad == 2) {
                video1.play();
                video2.play();
                $(".jyd-videoCover").hide();
            }
            else if(video1MetaLoad + video2MetaLoad < 2) {
                video1.pause();
                video2.pause();
                $(".jyd-videoCover").hide();
                $(".jyd-videoWaitingCover").show();
            }
            $("#jyd-pauseState").removeClass("jyd-startIcon");
            $("#jyd-pauseState").addClass("jyd-pauseIcon");
            playState = 1;
        }
    });

    //主画面切换
    // function delayFullScreen() { //画面线路切换时禁止全屏
    //     canFullScreen = 0;
    //     setTimeout(function(){
    //         canFullScreen = 1;
    //     }, 100);
    // }
    $("#jyd-video1Wrap").click(function(){
        setTimeout(function () {
            if (canChangeSight) {
                var currV = currentVideo;
                if (currV == 1) {

                }
                else if (currV == 2) {
                    // delayFullScreen();
                    currentVideo = 1;
                    $("#jyd-video1Wrap").removeClass("jyd-rightWrap-doubleScreen");
                    $("#jyd-video1Wrap").addClass("jyd-leftWrap-doubleScreen");
                    $("#jyd-video2Wrap").removeClass("jyd-leftWrap-doubleScreen");
                    $("#jyd-video2Wrap").addClass("jyd-rightWrap-doubleScreen");
                    changeVoice(1);
                }
                changeVideoWrapSize();
                // var nowVideoPartHeight = $(".jyd-videoPart").css("height");
                // $(".jyd-videoPart").css("height", parseInt(nowVideoPartHeight) - 50 + "px");
            }
        }, 300);
    });
    $("#jyd-video2Wrap").click(function(){
        setTimeout(function () {
            if (canChangeSight) {
                var currV = currentVideo;
                if (currV == 1) {
                    // delayFullScreen();
                    currentVideo = 2;
                    $("#jyd-video1Wrap").removeClass("jyd-leftWrap-doubleScreen");
                    $("#jyd-video1Wrap").addClass("jyd-rightWrap-doubleScreen");
                    $("#jyd-video2Wrap").removeClass("jyd-rightWrap-doubleScreen");
                    $("#jyd-video2Wrap").addClass("jyd-leftWrap-doubleScreen");
                    changeVoice(2);
                }
                else if (currV == 2) {

                }
                changeVideoWrapSize();
                // var nowVideoPartHeight = $(".jyd-videoPart").css("height");
                // $(".jyd-videoPart").css("height", parseInt(nowVideoPartHeight) - 50 + "px");
            }
        }, 300);
    });


    //全屏
    var hideControlBoxInterval;
    var controlBarOnHover = 0;
    var picBoxOnHover = 0;
    var fullScreenMousePositionX = 0;
    var fullScreenMousePositionY = 0;
    var lastFullScreenMousePositionX = 0;
    var lastFullScreenMousePositionY = 0;
    function setHideControlBoxInterval(event) {
        hideControlBoxInterval = setInterval(function () {
            // console.log(fullScreenMousePositionX, 'x');
            // console.log(fullScreenMousePositionY, 'y');
            if (fullScreenMousePositionX == lastFullScreenMousePositionX && fullScreenMousePositionY == lastFullScreenMousePositionY) {
                if (controlBarOnHover == 0 && picBoxOnHover == 0) {
                    $(".jyd-videoControlBar").fadeOut(300);
                    $(".jyd-newPicBox").fadeOut(300);
                }
            }
            lastFullScreenMousePositionX = fullScreenMousePositionX;
            lastFullScreenMousePositionY = fullScreenMousePositionY;
        }, 2000);
        document.onmousemove = function(event) {
            fullScreenMousePositionX = event.clientX;
            fullScreenMousePositionY = event.clientY;
            $(".jyd-videoControlBar").show();
            $(".jyd-newPicBox").show();
        }
    }

    $(".jyd-videoControlBar").hover(function() {
        controlBarOnHover = 1;
    }, function() {
        controlBarOnHover = 0;
    });
    $(".jyd-newPicBox").hover(function() {
        picBoxOnHover = 1;
    }, function() {
        picBoxOnHover = 0;
    });

    function startFullScreen(el) {
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
            wscript;
        if(typeof rfs != "undefined" && rfs) {
            rfs.call(el);
            changeVideoWrapSizeFS();
            setHideControlBoxInterval(el);
            $(".jyd-videoPlayerCover").show();
            $(".jyd-videoPlayerCover").dblclick(function() {
                exitFull();
            });
            var fsFalg = 1;
            window.onresize = function() {
                if (fsFalg == 0) {
                    clearInterval(hideControlBoxInterval);
                    changeVideoWrapSize();
                    $(".jyd-videoPlayer").css("padding-top", "0");
                    $(".jyd-videoControlBar").show();
                    $(".jyd-videoControlBar").css("position", "static");
                    $(".jyd-newPicBox").css("position", "relative");
                    $(".jyd-newPicBox").css("bottom", "0");
                    $(".jyd-exitFullScreen").css("display", "none");
                    $(".jyd-fullScreen").css("display", "inline-block");
                    $(".jyd-videoPlayerCover").hide();
                }
                fsFalg = 0;
            };
        }
        if(typeof window.ActiveXObject != "undefined") {
            wscript = new ActiveXObject("WScript.Shell");
            if(wscript) {
                wscript.SendKeys("{F11}");
            }
        }
    }
    function exitFull() {
        // 判断各种浏览器，找到正确的方法
        var exitMethod = document.exitFullscreen || //W3C
            document.mozCancelFullScreen || //FireFox
            document.webkitExitFullscreen || //Chrome等
            document.webkitExitFullscreen; //IE11
        if (exitMethod) {
            exitMethod.call(document);
        } else if (typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
        changeVideoWrapSize();
        $(".jyd-videoPlayer").css("padding-top", "0");
        $(".jyd-videoControlBar").show();
        $(".jyd-videoControlBar").css("position", "static");
        $(".jyd-newPicBox").css("position", "relative");
        $(".jyd-newPicBox").css("bottom", "0");
        $(".jyd-exitFullScreen").css("display", "none");
        $(".jyd-fullScreen").css("display", "inline-block");
        $(".jyd-videoPlayerCover").hide();
    }

    function changeVideoWrapSizeFS() {
        var screenWidth = window.screen.width;
        var screenHeight = window.screen.height;

        var video1WrapWidth = screenWidth * 0.5;
        var video1WrapHeight = parseInt(video1WrapWidth) * 9 / 16;
        $(".jyd-leftWrap-doubleScreen").css("height", video1WrapHeight);

        $(".jyd-videoCover").css("height", video1WrapHeight);
        $(".jyd-videoPart").css("height", video1WrapHeight);
        $(".jyd-videoPlayer").css("padding-top", (screenHeight - video1WrapHeight) / 2 + "px");
        $(".jyd-rightWrap-doubleScreen").css("height", video1WrapHeight);
        $(".jyd-coverPlayBtn").css("margin-top", video1WrapHeight / 2 - 50);
        $(".jyd-coverWaitingBtn").css("margin-top", video1WrapHeight / 2 - 50);

        // $(".jyd-videoControlBar").css("display", "none");
        $(".jyd-videoControlBar").css("position", "absolute");
        $(".jyd-videoControlBar").css("bottom", "0");
        $(".jyd-newPicBox").css("position", "absolute");
        $(".jyd-newPicBox").css("bottom", "50px");
    }
    function fullScreen(fullScreenSight) {
        if (fullScreenSight == 1) {
            if (video1 .requestFullscreen) {
                video1 .requestFullscreen();
            } else if (video1 .mozRequestFullScreen) {
                video1 .mozRequestFullScreen();
            } else if (video1 .webkitRequestFullScreen) {
                video1 .webkitRequestFullScreen();
            }
            changeVoice(1);
        }
        else if (fullScreenSight == 2) {
            if (video2 .requestFullscreen) {
                video2 .requestFullscreen();
            } else if (video2 .mozRequestFullScreen) {
                video2 .mozRequestFullScreen();
            } else if (video2 .webkitRequestFullScreen) {
                video2 .webkitRequestFullScreen();
            }
            changeVoice(2);
        }
    }
    $("#jyd-fullScreen").click(function(){
        $(this).css("display", "none");
        $(".jyd-exitFullScreen").css("display", "inline-block");
        var theElement = document.getElementById("jyd-videoPlayer");
        startFullScreen(theElement);
    });
    $("#jyd-exitFullScreen").click(function(){
        exitFull();
    });
    $("#jyd-video1Wrap").dblclick(function(){
        canChangeSight = 0;
        setTimeout(function () {
            canChangeSight = 1;
        }, 500);
        fullScreen(1);
    });
    $("#jyd-video2Wrap").dblclick(function(){
        canChangeSight = 0;
        setTimeout(function () {
            canChangeSight = 1;
        }, 500);
        fullScreen(2);
    });

    //打开静音
    function unMute() {
        var curR = currentAudio;
        changeVoice(curR);
    }

    //倍速播放
    $("#jyd-speed200").click(function(){
        video1.playbackRate = 2;
        video2.playbackRate = 2;
        $("#jyd-playSpeed").children("span").text("当前倍速：2.0X");
    });
    $("#jyd-speed150").click(function(){
        video1.playbackRate = 1.5;
        video2.playbackRate = 1.5;
        $("#jyd-playSpeed").children("span").text("当前倍速：1.5X");
    });
    $("#jyd-speed125").click(function(){
        video1.playbackRate = 1.25;
        video2.playbackRate = 1.25;
        $("#jyd-playSpeed").children("span").text("当前倍速：1.25X");
    });
    $("#jyd-speed100").click(function(){
        video1.playbackRate = 1;
        video2.playbackRate = 1;
        $("#jyd-playSpeed").children("span").text("当前倍速：1.0X");
    });
    $("#jyd-speed075").click(function(){
        video1.playbackRate = 0.75;
        video2.playbackRate = 0.75;
        $("#jyd-playSpeed").children("span").text("当前倍速：0.75X");
    });

    //静音
    $("#jyd-muteBtn").click(function(event){
        event.stopPropagation();
        if (volumeState == 1) {
            currentVolumeBar.style.width = '0px';
            video1.volume = 0;
            video2.volume = 0;
            $("#jyd-muteBtn").removeClass("jyd-unMuteIcon");
            $("#jyd-muteBtn").addClass("jyd-muteIcon");
            volumeState = 0;
        }
        else if (volumeState == 0) {
            currentVolumeBar.style.width = lastVolume * 100 + 'px';
            video1.volume = lastVolume;
            video2.volume = lastVolume;
            $("#jyd-muteBtn").removeClass("jyd-muteIcon");
            $("#jyd-muteBtn").addClass("jyd-unMuteIcon");
            volumeState = 1;
            unMute();
        }
    });

    //页面交互效果
    $("#jyd-radioShift").click(function(event){
        event.stopPropagation();
        if ($(".jyd-radioShiftBox").css('display') == 'none'){
            $(".jyd-radioShiftBox").slideDown(200);
            $(".jyd-speedShiftBox").slideUp(200);
        }
        else {
            $(".jyd-radioShiftBox").slideUp(200);
        }
    });
    $("#jyd-playSpeed").click(function(event){
        event.stopPropagation();
        if ($(".jyd-speedShiftBox").css('display') == 'none'){
            $(".jyd-speedShiftBox").slideDown(200);
            $(".jyd-radioShiftBox").slideUp(200);
        }
        else {
            $(".jyd-speedShiftBox").slideUp(200);
        }
    });
    $(document).click(function(){
        $(".jyd-radioShiftBox").slideUp(200);
        $(".jyd-speedShiftBox").slideUp(200);
    });
    // 控件区鼠标悬浮交互
    // $(".jyd-videoPlayer").hover(function(){
    //     $(this).children(".jyd-videoControlBar").show();
    //     var nowVideoPartHeight = $(".jyd-videoPart").css("height");
    //     $(".jyd-videoPart").css("height", parseInt(nowVideoPartHeight) - 50 + "px");
    //     $(".jyd-rightBottomWrap").css("bottom", "-50px");
    // }, function(){
    //     $(this).children(".jyd-videoControlBar").hide();
    //     var newVideoPartHeight = $(".jyd-videoPart").css("height");
    //     var trueVideoHeight = $(".jyd-leftWrap-doubleScreen").css("height");
    //     if (newVideoPartHeight >= trueVideoHeight) {
    //
    //     }
    //     else {
    //         $(".jyd-videoPart").css("height", parseInt(newVideoPartHeight) + 50 + "px");
    //     }
    // });

    //检测网速
    function testNetSpeed() {
        if (video1.buffered.length && theSize) {
            var timeRangesIndex = 0;
            var timeRanges = video1.buffered;
            for (var i = 0; i < timeRanges.length; i ++) {
                if (video1.currentTime > timeRanges.start(i) && video1.currentTime < timeRanges.end(i)) {
                    timeRangesIndex = i;
                }
            }
            var lastEndTime = timeRanges.end(timeRangesIndex);
            var bufferdTime = 0;
            // console.log(lastEndTime);
            setInterval(function () {
                timeRangesIndex = 0;
                timeRanges = video1.buffered;
                for (var i = 0; i < timeRanges.length; i ++) {
                    if (video1.currentTime > timeRanges.start(i) && video1.currentTime < timeRanges.end(i)) {
                        timeRangesIndex = i;
                    }
                }
                bufferdTime ++;
                // console.log(bufferdTime, 'bufferdTime');
                // console.log(timeRanges.end(timeRangesIndex), 'last');
                // console.log(lastEndTime, 'lastEndTime');
                if (timeRanges.end(timeRangesIndex) > lastEndTime) {
                    var bufferdChange = timeRanges.end(timeRangesIndex) - lastEndTime;
                    var bufferdTrueChange = (bufferdChange / totalT) * theSize;
                    var bufferSpeed = Math.round(bufferdTrueChange / bufferdTime);
                    if (bufferSpeed > 1024 && bufferSpeed < 5000) {
                        bufferSpeedM = Math.round((bufferSpeed / 1024) * 100) / 100;
                        document.getElementById("jyd-coverWaitingBufferSpeed").innerText = bufferSpeedM + 'MB/s';
                    }
                    else if (bufferSpeed > 5000) {
                        bufferSpeedM = Math.round((bufferSpeed / 1024) * 100) / 100;
                        document.getElementById("jyd-coverWaitingBufferSpeed").innerText = '大于5MB/s';
                    }
                    else if (bufferSpeed < 1024 && bufferSpeed > 0) {
                        document.getElementById("jyd-coverWaitingBufferSpeed").innerText = bufferSpeed + 'kB/s';
                    }
                    // console.log(bufferSpeed + 'kB/s');
                    lastEndTime = timeRanges.end(timeRangesIndex);
                    bufferdTime = 0;
                }
            }, 1000)
        }
    }

    //获取打点数据
    function getPicInfo() {
        $.ajax({
            method: 'get',
            url: getPicInfoUrl,
            data: {
                // method: 'getPicInfo',
                id: getPicInfoId
            },
            success: function (data) {
                var picInfo = eval('(' + data + ')').result;
                if (enablePic == "yes") {
                    newSetPicInfo(picInfo);
                }
                else if (enablePic == "simple") {
                    setPicInfo(picInfo);
                }
            },
            error: function () {
                alert("获取打点信息失败");
                // var picInfo = [{"time":16,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/16.jpg&g=16.jpg&yspf=E:/Root","name":"机械设计总论"},{"time":35,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/35.jpg&g=35.jpg&yspf=E:/Root","name":"第一章总论"},{"time":54,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/54.jpg&g=54.jpg&yspf=E:/Root","name":"1.1机械设计课程的性质与任务"},{"time":56,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/56.jpg&g=56.jpg&yspf=E:/Root","name":"1.1.1本课程的研究对象"},{"time":57,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/57.jpg&g=57.jpg&yspf=E:/Root","name":"1.1机械设计课程的性质与任务"},{"time":63,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/63.jpg&g=63.jpg&yspf=E:/Root","name":"1.1.1本课程的研究对象"},{"time":87,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/87.jpg&g=87.jpg&yspf=E:/Root","name":"机械零件的分类\t专用零件:"},{"time":114,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/114.jpg&g=114.jpg&yspf=E:/Root","name":"学习本课程的注意事项\t1）正确对......"},{"time":169,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/169.jpg&g=169.jpg&yspf=E:/Root","name":"需求调研"},{"time":214,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/214.jpg&g=214.jpg&yspf=E:/Root","name":"\t\t\t1.2机械设计的一般步骤1.2.2......."},{"time":235,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/235.jpg&g=235.jpg&yspf=E:/Root","name":"1.2机械设计图"},{"time":269,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/269.jpg&g=269.jpg&yspf=E:/Root","name":"lim\tSt"},{"time":286,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/286.jpg&g=286.jpg&yspf=E:/Root","name":"1.机械零件的计算准则\t3、寿命准......"},{"time":348,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/348.jpg&g=348.jpg&yspf=E:/Root","name":"1.4机械设计的最新进展\t干涉检查"},{"time":354,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/354.jpg&g=354.jpg&yspf=E:/Root","name":"1.4机械设计的最新进展\t底座网格......"}];
                // if (enablePic == "yes") {
                //     newSetPicInfo(picInfo);
                // }
                // else if (enablePic == "simple") {
                //     setPicInfo(picInfo);
                // }
            }
        })
    }

    //加载打点数据
    function setPicInfo(picInfo) {
        if (picInfo) {
            for (var i = 0; i < picInfo.length; i ++) {
                // console.log(picInfo[i].name, 'name');
                // console.log(picInfo[i].time, 'time');
                if (picInfo[i].time > startTime && picInfo[i].time < endTime) {
                    var pointLeft = Math.round((( picInfo[i].time - startTime ) / totalT ) * 100);
                    var insertPointDiv = "" +
                        "            <div class=\"jyd-picPoint\" style=\"left:" + pointLeft + "%\">" +
                        "                <div class=\"jyd-picPointImg\">" +
                        "                    <img src=\"" + picInfo[i].pic + "\" />" +
                        "                    <div class=\"jyd-picPointText\">" + picInfo[i].name + "</div>" +
                        "                </div>" +
                        "            </div>";
                    $("#jyd-processBar").append(insertPointDiv);
                }
            }
        }
    }

    //新打点
    function newSetPicInfo(picInfo) {
        if (picInfo) {
            for (var i = 0; i < picInfo.length; i ++) {
                if (picInfo[i].time > startTime && picInfo[i].time < endTime) {
                    var pointLeft = Math.round((( picInfo[i].time - startTime ) / totalT ) * 100);
                    var insertPointDiv = "" +
                        "            <div class=\"jyd-picPoint\" id=\"jyd-picPointIndex_" + i + "\" style=\"left:" + pointLeft + "%\">" +
                        "            </div>";
                    $("#jyd-processBar").append(insertPointDiv);
                    var insertPicInfoDiv = "" +
                        "            <div class=\"jyd-newPicInfoItem\" id=\"jyd-newPicInfoItem_" + picInfo[i].time + "\">" +
                        "               <img src=\"" + picInfo[i].pic + "\" draggable=\"false\" />" +
                        "               <div class=\"jyd-newPicInfoText\">" + picInfo[i].name + "</div>" +
                        "            </div>";
                    $(".jyd-newPicInnerBox").append(insertPicInfoDiv);
                }
            }
        }
        var dragMouseTruePositionX = 0;
        var downMouseTruePositionX = 0;
        $(".jyd-newPicInfoItem").click(function(){
            console.log(dragMouseTruePositionX - downMouseTruePositionX, 'move');
            if (dragMouseTruePositionX - downMouseTruePositionX < 3 && dragMouseTruePositionX - downMouseTruePositionX > -3) {
                var evalTime = $(this).attr("id").split("_")[1];
                video1.currentTime = evalTime;
                video2.currentTime = evalTime;
                video3.currentTime = evalTime;
            }
            dragMouseTruePositionX = 0;
            downMouseTruePositionX = 0;
        });
        $(".jyd-picPoint").hover(function() {
            var picPointIndex = $(this).attr("id").split("_")[1];
            $(".jyd-newPicInfoItem").eq(picPointIndex).addClass("onselectPic");
            goPicPointPosition(picPointIndex);
        },function () {
            var picPointIndex = $(this).attr("id").split("_")[1];
            $(".jyd-newPicInfoItem").eq(picPointIndex).removeClass("onselectPic");
        });
        var dragMousePositionX = 0;
        var downMousePositionX = 0;
        var theScrl;
        var dragBox = document.getElementById("jyd-newPicMiddleBox");
        dragBox.onmousedown = function(event) {
            downMousePositionX = event.offsetX;
            downMouseTruePositionX = event.clientX;
            dragMouseTruePositionX = event.clientX;
            theScrl = $(".jyd-newPicMiddleBox").scrollLeft();
            // console.log(downMousePositionX, 'downMousePositionX');
            dragBox.onmousemove = function(event) {
                dragMousePositionX = event.offsetX;
                dragMouseTruePositionX = event.clientX;
                // console.log(dragMousePositionX, 'dragMousePositionX');
                theScrl = theScrl - (dragMousePositionX - downMousePositionX);
                $(".jyd-newPicMiddleBox").scrollLeft(theScrl);
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            }
        };
        document.onmouseup = function(){
            $(".jyd-processBarTimeInfo").hide();
            dragBox.onmousemove = null; //弹起鼠标不做任何操作
            document.onmousemove = null; //弹起鼠标不做任何操作
        };
    }

    var movepx = option.movepx ? option.movepx : 3;
    var scrl;
    var holdRight;
    var holdLeft;

    //单击滚页按钮
    $(".jyd-newPicRightBtn").click(function(){
        scrl = $(".jyd-newPicMiddleBox").scrollLeft();
        scrl += movepx;
        $(".jyd-newPicMiddleBox").scrollLeft(scrl);

    });
    $(".jyd-newPicLeftBtn").click(function(){
        scrl = $(".jyd-newPicMiddleBox").scrollLeft();
        scrl -= movepx;
        $(".jyd-newPicMiddleBox").scrollLeft(scrl);

    });
    //按住滚页按钮
    $(".jyd-newPicRightBtn").mousedown(function(e){
        if (e.which == 1)
        {
            scrl = $(".jyd-newPicMiddleBox").scrollLeft();
            holdRight = setInterval(function() {
                scrl += movepx;
                $(".jyd-newPicMiddleBox").scrollLeft(scrl);
            }, 1);
        }
        else if (e.which == 2 || e.which == 3)
        {
            clearInterval(holdRight);
        }
    });
    $(".jyd-newPicRightBtn").mouseup(function(){
        clearInterval(holdRight);
    });
    $(".jyd-newPicRightBtn").mousemove(function(){
        clearInterval(holdRight);
    });
    $(".jyd-newPicLeftBtn").mousedown(function(e){
        if (e.which == 1)
        {
            scrl = $(".jyd-newPicMiddleBox").scrollLeft();
            holdLeft = setInterval(function() {
                scrl -= movepx;
                $(".jyd-newPicMiddleBox").scrollLeft(scrl);
            }, 1);
        }
        else if (e.which == 2 || e.which == 3)
        {
            clearInterval(holdLeft);
        }
    });
    $(".jyd-newPicLeftBtn").mouseup(function() {
        clearInterval(holdLeft);
    });
    $(".jyd-newPicLeftBtn").mousemove(function() {
        clearInterval(holdLeft);
    });

    //打点图片定位
    function goPicPointPosition(picPointIndex) {
        $(".jyd-newPicMiddleBox").stop();
        var pointOffsetX = $(".jyd-newPicInfoItem").eq(picPointIndex).offset().left;
        $(".jyd-newPicMiddleBox").animate({scrollLeft: pointOffsetX}, 1000);
    }

    //对外暴露方法
    return {
        //暂停播放
        stopVideo: function () {
            if(playState == 1) {
                video1.pause();
                video2.pause();
                $("#jyd-pauseState").removeClass("jyd-pauseIcon");
                $("#jyd-pauseState").addClass("jyd-startIcon");
                playState = 0;
                $(".jyd-videoCover").show();
                $(".jyd-videoWaitingCover").hide();
            }
        },
        //继续播放
        playVideo: function () {
            if(video1MetaLoad + video2MetaLoad == 2) {
                video1.play();
                video2.play();
                $(".jyd-videoCover").hide();
            }
            else if(video1MetaLoad + video2MetaLoad < 2) {
                video1.pause();
                video2.pause();
                $(".jyd-videoCover").hide();
                $(".jyd-videoWaitingCover").show();
            }
            $("#jyd-pauseState").removeClass("jyd-startIcon");
            $("#jyd-pauseState").addClass("jyd-pauseIcon");
            playState = 1;
        },
        //获取播放时间点
        playCurrentTime: function () {
            var theCurrentTime = Math.floor(video1.currentTime);
            return theCurrentTime;
        },
        //跳转到播放时间点
        playStartPoint: function (evalTime) {
            video1.currentTime = evalTime;
            video2.currentTime = evalTime;
        },
        //开启剪辑功能
        startCutting: function () {
            if(playState == 1) {
                video1.pause();
                video2.pause();
                $("#jyd-pauseState").removeClass("jyd-pauseIcon");
                $("#jyd-pauseState").addClass("jyd-startIcon");
                playState = 0;
                $(".jyd-videoCover").show();
                $(".jyd-videoWaitingCover").hide();
            }
            $("#jyd-currentProcessBar").hide();
            $(".jyd-picPoint").hide();
            $(".jyd-radioShift").hide();
            $(".jyd-playSpeed").hide();
            $(".jyd-processBar").css("width", "calc(100% - 400px)");
            var insertCuttingBar = "" +
                "            <div class=\"jyd-picCuttingBar\" id=\"jyd-picCuttingBarStart\" style=\"left:0%\">" +
                "               <div class=\"jyd-picCuttingHandleUp\"></div>" +
                "            </div>" +
                "            <div class=\"jyd-picCuttingBar\" id=\"jyd-picCuttingBarEnd\" style=\"left:100%\">" +
                "               <div class=\"jyd-picCuttingHandleDown\"></div>" +
                "            </div>";
            $("#jyd-processBar").append(insertCuttingBar);
            $(".jyd-picCuttingBar").mousedown(function(event){
                event.stopPropagation();
            });
            processBarWidth = parseInt($("#jyd-processBar").css("width"));
            var startPosition = 0;
            var endPostion = processBarWidth;
            mousePositionX = 0;
            var startBar = document.getElementById("jyd-picCuttingBarStart");
            startBar.onmousedown = function(event) {
                var that = document.getElementById("jyd-processBar");
                var event = event || window.event;
                document.onmousemove = function(event){
                    var event = event || window.event;
                    mousePositionX = event.clientX - that.offsetLeft;
                    if(mousePositionX < 0){
                        mousePositionX = 0;
                    }
                    else if(mousePositionX > endPostion){
                        mousePositionX = endPostion;
                    }
                    video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    video2.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    allLoad();
                    startBar.style.left = mousePositionX + "px";
                    startPosition = mousePositionX;
                    cuttingStartTime = totalT * startPosition / processBarWidth + parseInt(startTime);
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                }
            }
            var endBar = document.getElementById("jyd-picCuttingBarEnd");
            endBar.onmousedown = function(event) {
                var that = document.getElementById("jyd-processBar");
                var event = event || window.event;
                document.onmousemove = function(event){
                    var event = event || window.event;
                    mousePositionX = event.clientX - that.offsetLeft;
                    if(mousePositionX < startPosition){
                        mousePositionX = startPosition;
                    }
                    else if(mousePositionX > processBarWidth){
                        mousePositionX = processBarWidth;
                    }
                    video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    video2.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    allLoad();
                    endBar.style.left = mousePositionX + "px";
                    endPostion = mousePositionX;
                    cuttingEndTime = totalT * endPostion / processBarWidth + parseInt(startTime);
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                }
            }
        },
        //取消剪辑功能
        cancelCutting: function () {
            $("#jyd-currentProcessBar").show();
            $(".jyd-picPoint").show();
            $(".jyd-picCuttingBar").remove();
        },
        //完成剪辑功能
        completeCutting: function() {
            var cuttingInfo = {
                theStartTime: cuttingStartTime,
                theEndTime: cuttingEndTime
            };
            console.log(cuttingInfo);
            $("#jyd-currentProcessBar").show();
            $(".jyd-picPoint").show();
            $(".jyd-picCuttingBar").remove();
        },
        //获取剪辑开始时间
        getCuttingStartTime: function() {
            if (cuttingStartTime) {
                return Math.round(cuttingStartTime);
            }
            else {
                return 0;
            }
        },
        //获取剪辑结束时间
        getCuttingEndTime: function() {
            if (cuttingEndTime) {
                return Math.round(cuttingEndTime);
            }
            else {
                return totalT;
            }
        },
        //获取缓冲信息
        getBufferedInfo: function() {
            var video1Buffered = video1.buffered;
            var video2Buffered = video2.buffered;
            var logText = "";
            logText += "当前缓冲信息：";
            logText += "\n\t老师画面加载时段：";
            for (var i1 = 0; i1 < video1Buffered.length; i1 ++) {
                logText += "\n\t\t第" + (i1 + 1) + "段：" + video1Buffered.start(i1) + "-" + video1Buffered.end(i1);
            }
            logText += "\n\t学生画面加载时段：";
            for (var j1 = 0; j1 < video2Buffered.length; j1 ++) {
                logText += "\n\t\t第" + (j1 + 1) + "段：" + video2Buffered.start(j1) + "-" + video2Buffered.end(j1);
            }
            console.log(logText);
        },
        //开启自动获取缓冲信息
        getBufferedInfoAutoOpen: function() {
            video1.onprogress = function() {
                printBufferedInfo(1);
            };
            video2.onprogress = function() {
                printBufferedInfo(2);
            };
        },
        //关闭自动获取缓冲信息
        getBufferedInfoAutoClose: function() {
            video1.onprogress = null;
            video2.onprogress = null;
        }
    }
}

//tc:老师、课件两画面
function sightTypeTC(option, autoP) {
    var element = option.element;
    var teacherVideoUrl = option.teacherVideoUrl;
    var studentVideoUrl = option.studentVideoUrl;
    var courseVideoUrl = option.courseVideoUrl;
    var videoSize = option.videoSize;
    var getPicInfoUrl = option.getPicInfoUrl;
    var getPicInfoId = option.getPicInfoId;
    var cutStartTime = option.cutStartTime;
    var cutEndTime = option.cutEndTime;
    var enablePic = option.enablePic;

    var jydVideoPlayer = "" +
        "<div class=\"jyd-videoPlayer\" id=\"jyd-videoPlayer\">\n" +
        "    <div class=\"jyd-videoPlayerCover\"></div>" +
        "    <div class=\"jyd-videoPart\">\n" +
        "        <div class=\"jyd-videoCover\">\n" +
        "            <div class=\"jyd-coverPlayBtn\"></div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-videoWrap jyd-leftWrap-doubleScreen\" id=\"jyd-video1Wrap\">\n" +
        "            <div class=\"jyd-videoWaitingCover\">\n" +
        "                <div class=\"jyd-coverWaitingBtn\">" +
        "                   <div class=\"jyd-coverWaitingIcon\"></div>" +
        "                   <div class=\"jyd-coverWaitingText\">loading...</div>" +
        "                   <div class=\"jyd-coverWaitingBufferSpeed\" id=\"jyd-coverWaitingBufferSpeed\"></div>" +
        "                </div>\n" +
        "            </div>\n" +
        "            <video id=\"jyd-video1\"></video>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-videoWrap jyd-rightWrap-doubleScreen\" id=\"jyd-video2Wrap\">\n" +
        "            <div class=\"jyd-videoWaitingCover\">\n" +
        "                <div class=\"jyd-coverWaitingBtn\">" +
        "                   <div class=\"jyd-coverWaitingIcon\"></div>" +
        "                   <div class=\"jyd-coverWaitingText\">loading...</div>" +
        "                   <div class=\"jyd-coverWaitingBufferSpeed\" id=\"jyd-coverWaitingBufferSpeed\"></div>" +
        "                </div>\n" +
        "            </div>\n" +
        "            <video id=\"jyd-video2\"></video>\n" +
        "        </div>\n" +
        "    </div>\n";
        if (enablePic && enablePic == "yes") {
            jydVideoPlayer += "" +
                "<div class=\"jyd-newPicBox\">" +
                "    <div class=\"jyd-newPicMiddleBox\" id=\"jyd-newPicMiddleBox\">" +
                "       <div class=\"jyd-newPicInnerBox\"></div>" +
                "    </div>" +
                "    <div class=\"jyd-newPicLeftBtn\">《</div>" +
                "    <div class=\"jyd-newPicRightBtn\">》</div>" +
                "</div>";
        }
        jydVideoPlayer += "" +
        "    <div class=\"jyd-videoControlBar\">\n" +
        "        <div class=\"jyd-startAndPause jyd-startIcon\" id=\"jyd-pauseState\"></div>\n" +
        "        <div class=\"jyd-processBar\" id=\"jyd-processBar\">\n" +
        "            <div class=\"jyd-currentProcessBar\" id=\"jyd-currentProcessBar\">\n" +
        "                <div class=\"jyd-roundBar\">" +
        "                    <div class=\"jyd-processBarTimeInfo\">00:00:00</div>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-timeUpdateNow\" id=\"jyd-timeUpdateNow\">00:00:00</div>\n" +
        "        <div class=\"jyd-splitTimeUpdate\">/</div>\n" +
        "        <div class=\"jyd-timeUpdateAll\" id=\"jyd-timeUpdateAll\">00:00:00</div>\n" +
        "        <div class=\"jyd-fullScreen\" id=\"jyd-fullScreen\"></div>\n" +
        "        <div class=\"jyd-exitFullScreen\" id=\"jyd-exitFullScreen\"></div>\n" +
        "        <div class=\"jyd-volumeBar\" id=\"jyd-volumeBar\">\n" +
        "            <div class=\"jyd-currentVolumeBar\" id=\"jyd-currentVolumeBar\">\n" +
        "                <div class=\"jyd-volumeRoundBar\"></div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-muteBtn jyd-unMuteIcon\" id=\"jyd-muteBtn\"></div>\n" +
        "        <div class=\"jyd-radioShift\" id=\"jyd-radioShift\">\n" +
        "            <span>当前音源：老师</span>\n" +
        "            <div class=\"jyd-radioShiftBox\">\n" +
        "                <div id=\"jyd-teacherVoice\">老师</div>\n" +
        "                <div id=\"jyd-courseVoice\">课件</div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-playSpeed\" id=\"jyd-playSpeed\">\n" +
        "            <span>当前倍速：1.0X</span>\n" +
        "            <div class=\"jyd-speedShiftBox\">\n" +
        "                <div id=\"jyd-speed200\">2.0X</div>\n" +
        "                <div id=\"jyd-speed150\">1.5X</div>\n" +
        "                <div id=\"jyd-speed125\">1.25X</div>\n" +
        "                <div id=\"jyd-speed100\">1.0X</div>\n" +
        "                <div id=\"jyd-speed075\">0.75X</div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>";

    var theDivDom = document.getElementById(element);
    theDivDom.innerHTML = jydVideoPlayer;

    var video1 = document.getElementById("jyd-video1");
    var video2 = document.getElementById("jyd-video2");

    var playState; //播放状态  1正在播放 0暂停
    var volumeState; //声音状态  1有声音 0静音
    var canFullScreen = 1; //禁用全屏flag  1可全屏 0禁用
    var canChangeSight = 1; //禁用切换主画面flag  1可切换 0禁用
    var currentVideo; //当前主画面  1老师 2课件
    var currentAudio; //当前声音线路  1老师 2课件
    var totalT; //视频总时长
    var theSize = parseInt(videoSize); //视频总大小(总和) 单位KB
    var startTime; //视频开始时间
    var endTime; //视频结束时间
    var firstCanplayState = 1; //初次加载状态
    var cuttingStartTime; //剪辑开始时间
    var cuttingEndTime; //剪辑结束时间

    //主画面线路  //视频加载
    var video1Url = teacherVideoUrl;
    var video2Url = courseVideoUrl;
    currentVideo = 1;
    if(Hls.isSupported()) {
        hls1 = new Hls();
        hls1.loadSource(video1Url);
        hls1.attachMedia(video1);
        hls1.on(Hls.Events.MANIFEST_PARSED,function() {
            if (autoP) {
                video1.play();
                $(".jyd-videoCover").hide();
                $("#jyd-pauseState").removeClass("jyd-startIcon");
                $("#jyd-pauseState").addClass("jyd-pauseIcon");
                playState = 1;
            }
            else {
                video1.pause();
                playState = 0;
            }
        });
        // hls1.on(Hls.Events.ERROR, (event, data) => {
        //     sightTypeSingle('c');
        // });
        hls2 = new Hls();
        hls2.loadSource(video2Url);
        hls2.attachMedia(video2);
        hls2.on(Hls.Events.MANIFEST_PARSED,function() {
            if (autoP) {
                video2.play();
                $(".jyd-videoCover").hide();
                $("#jyd-pauseState").removeClass("jyd-startIcon");
                $("#jyd-pauseState").addClass("jyd-pauseIcon");
                playState = 1;
            }
            else {
                video2.pause();
                playState = 0;
            }
        });
        // hls2.on(Hls.Events.ERROR, (event, data) => {
        //     sightTypeSingle('t');
        // });
    }
    else {
        alert("请使用谷歌浏览器或360浏览器极速模式");
    }
    volumeState = 1;
    changeVoice(1);
    changeVideoWrapSize();


    // 缓冲进度
    // var timeRanges;
    // setInterval(function(){
    //     timeRanges = video1.buffered;
    //     console.log(timeRanges.end(0), '1');
    // }, '100');
    // setInterval(function(){
    //     timeRanges = video2.buffered;
    //     console.log(timeRanges.end(0), '2');
    // }, '100');
    // setInterval(function(){
    //     timeRanges = video3.buffered;
    //     console.log(timeRanges.end(0), '3');
    // }, '100');

    var video1Loading = 1;
    var video2Loading = 1;
    var video1MetaLoad = 0;
    var video2MetaLoad = 0;

    function allLoad() {
        if (video1MetaLoad + video2MetaLoad) {
            if (playState == 1) {
                // $(".jyd-videoWaitingCover").hide();
                // video1.play();
                // video2.play();
                video1Loading = 0;
                video2Loading = 0;
                testNetSpeed();
            }
        }
    }

    video1.onloadedmetadata = function() {
        video1MetaLoad = 1;
        if (playState == 0) {
            video1.pause();
        }
        allLoad();
    };
    video2.onloadedmetadata = function() {
        video2MetaLoad = 1;
        if (playState == 0) {
            video2.pause();
        }
        allLoad();
    };

    //测试缓冲进度
    function printBufferedInfo(sight) {
        var video1Buffered = video1.buffered;
        var video2Buffered = video2.buffered;
        var logText = "";
        if (sight == 1) {
            logText = "老师画面缓冲中...";
            logText += "\n老师画面缓冲信息：";
            for (var i1 = 0; i1 < video1Buffered.length; i1 ++) {
                logText += "\n\t第" + (i1 + 1) + "段：" + video1Buffered.start(i1) + "-" + video1Buffered.end(i1);
            }
            console.log(logText);
        }
        else if (sight == 2) {
            logText = "课件画面缓冲中...";
            logText += "\n课件画面缓冲信息：";
            for (var j1 = 0; j1 < video2Buffered.length; j1 ++) {
                logText += "\n\t第" + (j1 + 1) + "段：" + video2Buffered.start(j1) + "-" + video2Buffered.end(j1);
            }
            console.log(logText);
        }
    }

    function consoleLogFlag() {
        console.log(video1Loading, 'video1Loading');
        console.log(video2Loading, 'video2Loading');
    }

    video1.onwaiting = function() {
        // if (video1Loading + video2Loading == 0) {
            video1Loading = 1;
            // console.log(video1Loading + video2Loading + video3Loading, 'sum');
            // console.log('1loading');
            // video2.pause();
            // consoleLogFlag();
            $("#jyd-video1Wrap").children(".jyd-videoWaitingCover").show();
        // }
        // else{
        //     return false
        // }
    };
    video2.onwaiting = function() {
        // if (video1Loading + video2Loading == 0) {
            video2Loading = 1;
            // console.log(video1Loading + video2Loading + video3Loading, 'sum');
            // console.log('2loading');
            // video1.pause();
            // consoleLogFlag();
            $("#jyd-video2Wrap").children(".jyd-videoWaitingCover").show();
        // }
        // else{
        //     return false
        // }
    };

    function goOnPlay(){
        // console.log('goOn!');
        // consoleLogFlag();
        if (video1Loading + video2Loading == 0) {
            if (playState == 1) {
                // console.log('realyGoOn!');
                // $(".jyd-videoWaitingCover").hide();
                video1.play();
                video2.play();
            }
        }
    }

    video1.onplaying = function() {
        video1Loading = 0;
        $("#jyd-video1Wrap").children(".jyd-videoWaitingCover").hide();
        goOnPlay();
    };

    video2.onplaying = function() {
        video2Loading = 0;
        $("#jyd-video2Wrap").children(".jyd-videoWaitingCover").hide();
        goOnPlay();
    };

    //播放时间显示
    video1.addEventListener('canplay',function(){
        totalT = getTotalT(video1.duration);
        var videoDuration = formatTime(totalT);
        document.getElementById("jyd-timeUpdateAll").innerHTML = videoDuration;
        if (firstCanplayState) {
            video1.currentTime = startTime;
            video2.currentTime = startTime;
            if (enablePic == "yes" || enablePic == "simple") {
                getPicInfo();
            }
        }
        firstCanplayState = 0;
    });

    //剪辑时长校验
    function getTotalT(maxTime) {
        if (cutStartTime && cutStartTime > 0 && cutStartTime < maxTime) {
            if (cutEndTime && cutEndTime > cutStartTime && cutEndTime < maxTime) {
                startTime = cutStartTime;
                endTime = cutEndTime;
                return cutEndTime - cutStartTime;
            }
            else {
                startTime = cutStartTime;
                endTime = maxTime;
                return maxTime - cutStartTime;
            }
        }
        else {
            if (cutEndTime && cutEndTime > 0 && cutEndTime < maxTime) {
                startTime = 0;
                endTime = cutEndTime;
                return cutEndTime;
            }
            else {
                startTime = 0;
                endTime = maxTime;
                return maxTime;
            }
        }
    }

    video1.addEventListener('timeupdate',function() {
        var presentT = this.currentTime;
        // console.log(endTime, "endTime");
        // console.log(presentT, "presentT");
        if (presentT >= endTime) {
            video1.currentTime = startTime;
            video2.currentTime = startTime;
            if(playState == 1) {
                video1.pause();
                video2.pause();
                $("#jyd-pauseState").removeClass("jyd-pauseIcon");
                $("#jyd-pauseState").addClass("jyd-startIcon");
                playState = 0;
                $(".jyd-videoCover").show();
                $(".jyd-videoWaitingCover").hide();
            }
        }
        var videoCurrent = formatTime(presentT - startTime);
        document.getElementById("jyd-timeUpdateNow").innerHTML = videoCurrent;
        $(".jyd-processBarTimeInfo").text(videoCurrent);

        var percent = ( presentT - startTime ) / totalT * 100;
        document.getElementById("jyd-currentProcessBar").style.width = percent + '%';
    });

    function formatTime(t){
        var hh = parseInt(t / 3600);
        hh = hh < 10 ? '0' + hh : hh;
        var mm = parseInt(t % 3600 / 60);
        mm = mm < 10 ? '0' + mm : mm;
        var ss = parseInt(t % 60);
        ss = ss < 10 ? '0' + ss : ss;
        return hh + ':' + mm + ':' + ss;
    }

    //拖动进度条
    var mousePositionX = 0;
    var processBarWidth;
    var processBar = document.getElementById("jyd-processBar");
    var currentProcessBar = document.getElementById("jyd-currentProcessBar");
    processBar.onmousedown = function(event) {
        var that = this;
        $(".jyd-processBarTimeInfo").show();
        processBarWidth = parseInt($("#jyd-processBar").css("width"));
        var event = event || window.event;
        mousePositionX = event.clientX - this.offsetLeft;
        video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
        video2.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
        allLoad();
        currentProcessBar.style.width = mousePositionX + "px";
        document.onmousemove = function(event){
            var event = event || window.event;
            mousePositionX = event.clientX - that.offsetLeft;
            if(mousePositionX < 0){
                mousePositionX = 0;
            }
            else if(mousePositionX > processBarWidth){
                mousePositionX = processBarWidth;
            }
            video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
            video2.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
            allLoad();
            currentProcessBar.style.width = mousePositionX + "px";
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }
    };
    document.onmouseup = function(){
        $(".jyd-processBarTimeInfo").hide();
        document.onmousemove = null; //弹起鼠标不做任何操作
    };

    //拖动音量条
    var lastVolume = 1;
    var volumeMousePositionX = 0;
    var volumeBarWidth;
    var volumeBar = document.getElementById("jyd-volumeBar");
    var currentVolumeBar = document.getElementById("jyd-currentVolumeBar");
    volumeBar.onmousedown = function(event) {
        var that = this;
        volumeBarWidth = parseInt($("#jyd-volumeBar").css("width"));
        var event = event || window.event;
        volumeMousePositionX = event.clientX - this.offsetLeft;
        video1.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
        video2.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
        currentVolumeBar.style.width = volumeMousePositionX + "px";
        lastVolume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
        $("#jyd-muteBtn").removeClass("jyd-muteIcon");
        $("#jyd-muteBtn").addClass("jyd-unMuteIcon");
        volumeState = 1;
        unMute();
        document.onmousemove = function(event){
            var event = event || window.event;
            volumeMousePositionX = event.clientX - that.offsetLeft;
            if(volumeMousePositionX < 0){
                volumeMousePositionX = 0;
            }
            else if(volumeMousePositionX > volumeBarWidth){
                volumeMousePositionX = volumeBarWidth;
            }
            video1.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
            video2.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
            $("#jyd-muteBtn").removeClass("jyd-muteIcon");
            $("#jyd-muteBtn").addClass("jyd-unMuteIcon");
            currentVolumeBar.style.width = volumeMousePositionX + "px";
            lastVolume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
            volumeState = 1;
            unMute();
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }
    };

    //音源切换
    function changeVoice(theVoice){
        if (theVoice == 1) {
            video1.muted = false;
            video2.muted = true;
            currentAudio = 1;
            $("#jyd-radioShift").children("span").text("当前音源：老师");
        }
        else if (theVoice == 2) {
            video1.muted = true;
            video2.muted = false;
            currentAudio = 2;
            $("#jyd-radioShift").children("span").text("当前音源：课件");
        }
    }
    $("#jyd-teacherVoice").click(function(event){
        event.stopPropagation();
        changeVoice(1);
        $(".jyd-radioShiftBox").slideUp(0);
    });
    $("#jyd-courseVoice").click(function(event){
        event.stopPropagation();
        changeVoice(2);
        $(".jyd-radioShiftBox").slideUp(0);
    });

    //画面比例自适应
    function changeVideoWrapSize(){
        var video1WrapWidth = $(".jyd-leftWrap-doubleScreen").css("width");
        var video1WrapHeight = parseInt(video1WrapWidth) * 9 / 16;
        $(".jyd-leftWrap-doubleScreen").css("height", video1WrapHeight);

        // var videoMaxHeight = parseInt($("#jyd-video1Wrap").css("height"));
        $(".jyd-videoCover").css("height", video1WrapHeight);
        $(".jyd-videoPart").css("height", video1WrapHeight);
        $(".jyd-rightWrap-doubleScreen").css("height", video1WrapHeight);
        $(".jyd-coverPlayBtn").css("margin-top", video1WrapHeight / 2 - 50);
        $(".jyd-coverWaitingBtn").css("margin-top", video1WrapHeight / 2 - 50);
    }
    window.onresize = changeVideoWrapSize();

    //播放及暂停
    $(".jyd-videoCover").click(function(){
        // if(video1MetaLoad + video2MetaLoad == 2) {
        //     video1.play();
        //     video2.play();
        //     $(".jyd-videoCover").hide();
        // }
        // else if(video1MetaLoad + video2MetaLoad < 2) {
        //     video1.pause();
        //     video2.pause();
        //     $(".jyd-videoCover").hide();
        //     $(".jyd-videoWaitingCover").show();
        // }
        video1.play();
        video2.play();
        $(this).hide();
        $("#jyd-pauseState").removeClass("jyd-startIcon");
        $("#jyd-pauseState").addClass("jyd-pauseIcon");
        playState = 1;
        testNetSpeed();
    });
    $("#jyd-pauseState").click(function(){
        if(playState == 1){
            video1.pause();
            video2.pause();
            $("#jyd-pauseState").removeClass("jyd-pauseIcon");
            $("#jyd-pauseState").addClass("jyd-startIcon");
            playState = 0
            $(".jyd-videoCover").show();
            $(".jyd-videoWaitingCover").hide();
        }
        else if(playState == 0){
            if(video1MetaLoad + video2MetaLoad == 2) {
                video1.play();
                video2.play();
                $(".jyd-videoCover").hide();
            }
            else if(video1MetaLoad + video2MetaLoad < 2) {
                video1.pause();
                video2.pause();
                $(".jyd-videoCover").hide();
                $(".jyd-videoWaitingCover").show();
            }
            $("#jyd-pauseState").removeClass("jyd-startIcon");
            $("#jyd-pauseState").addClass("jyd-pauseIcon");
            playState = 1;
        }
    });

    //主画面切换
    // function delayFullScreen() { //画面线路切换时禁止全屏
    //     canFullScreen = 0;
    //     setTimeout(function(){
    //         canFullScreen = 1;
    //     }, 100);
    // }
    $("#jyd-video1Wrap").click(function(){
        setTimeout(function () {
            if (canChangeSight) {
                var currV = currentVideo;
                if (currV == 1) {

                }
                else if (currV == 2) {
                    // delayFullScreen();
                    currentVideo = 1;
                    $("#jyd-video1Wrap").removeClass("jyd-rightWrap-doubleScreen");
                    $("#jyd-video1Wrap").addClass("jyd-leftWrap-doubleScreen");
                    $("#jyd-video2Wrap").removeClass("jyd-leftWrap-doubleScreen");
                    $("#jyd-video2Wrap").addClass("jyd-rightWrap-doubleScreen");
                    changeVoice(1);
                }
                changeVideoWrapSize();
                // var nowVideoPartHeight = $(".jyd-videoPart").css("height");
                // $(".jyd-videoPart").css("height", parseInt(nowVideoPartHeight) - 50 + "px");
            }
        }, 300);
    });
    $("#jyd-video2Wrap").click(function(){
        setTimeout(function () {
            if (canChangeSight) {
                var currV = currentVideo;
                if (currV == 1) {
                    // delayFullScreen();
                    currentVideo = 2;
                    $("#jyd-video1Wrap").removeClass("jyd-leftWrap-doubleScreen");
                    $("#jyd-video1Wrap").addClass("jyd-rightWrap-doubleScreen");
                    $("#jyd-video2Wrap").removeClass("jyd-rightWrap-doubleScreen");
                    $("#jyd-video2Wrap").addClass("jyd-leftWrap-doubleScreen");
                    changeVoice(2);
                }
                else if (currV == 2) {

                }
                changeVideoWrapSize();
                // var nowVideoPartHeight = $(".jyd-videoPart").css("height");
                // $(".jyd-videoPart").css("height", parseInt(nowVideoPartHeight) - 50 + "px");
            }
        }, 300);
    });


    //全屏
    var hideControlBoxInterval;
    var controlBarOnHover = 0;
    var picBoxOnHover = 0;
    var fullScreenMousePositionX = 0;
    var fullScreenMousePositionY = 0;
    var lastFullScreenMousePositionX = 0;
    var lastFullScreenMousePositionY = 0;
    function setHideControlBoxInterval(event) {
        hideControlBoxInterval = setInterval(function () {
            // console.log(fullScreenMousePositionX, 'x');
            // console.log(fullScreenMousePositionY, 'y');
            if (fullScreenMousePositionX == lastFullScreenMousePositionX && fullScreenMousePositionY == lastFullScreenMousePositionY) {
                if (controlBarOnHover == 0 && picBoxOnHover == 0) {
                    $(".jyd-videoControlBar").fadeOut(300);
                    $(".jyd-newPicBox").fadeOut(300);
                }
            }
            lastFullScreenMousePositionX = fullScreenMousePositionX;
            lastFullScreenMousePositionY = fullScreenMousePositionY;
        }, 2000);
        document.onmousemove = function(event) {
            fullScreenMousePositionX = event.clientX;
            fullScreenMousePositionY = event.clientY;
            $(".jyd-videoControlBar").show();
            $(".jyd-newPicBox").show();
        }
    }

    $(".jyd-videoControlBar").hover(function() {
        controlBarOnHover = 1;
    }, function() {
        controlBarOnHover = 0;
    });
    $(".jyd-newPicBox").hover(function() {
        picBoxOnHover = 1;
    }, function() {
        picBoxOnHover = 0;
    });

    function startFullScreen(el) {
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
            wscript;
        if(typeof rfs != "undefined" && rfs) {
            rfs.call(el);
            changeVideoWrapSizeFS();
            setHideControlBoxInterval(el);
            $(".jyd-videoPlayerCover").show();
            $(".jyd-videoPlayerCover").dblclick(function() {
                exitFull();
            });
            var fsFalg = 1;
            window.onresize = function() {
                if (fsFalg == 0) {
                    clearInterval(hideControlBoxInterval);
                    changeVideoWrapSize();
                    $(".jyd-videoPlayer").css("padding-top", "0");
                    $(".jyd-videoControlBar").show();
                    $(".jyd-videoControlBar").css("position", "static");
                    $(".jyd-newPicBox").css("position", "relative");
                    $(".jyd-newPicBox").css("bottom", "0");
                    $(".jyd-exitFullScreen").css("display", "none");
                    $(".jyd-fullScreen").css("display", "inline-block");
                    $(".jyd-videoPlayerCover").hide();
                }
                fsFalg = 0;
            };
        }
        if(typeof window.ActiveXObject != "undefined") {
            wscript = new ActiveXObject("WScript.Shell");
            if(wscript) {
                wscript.SendKeys("{F11}");
            }
        }
    }
    function exitFull() {
        // 判断各种浏览器，找到正确的方法
        var exitMethod = document.exitFullscreen || //W3C
            document.mozCancelFullScreen || //FireFox
            document.webkitExitFullscreen || //Chrome等
            document.webkitExitFullscreen; //IE11
        if (exitMethod) {
            exitMethod.call(document);
        } else if (typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
        changeVideoWrapSize();
        $(".jyd-videoPlayer").css("padding-top", "0");
        $(".jyd-videoControlBar").show();
        $(".jyd-videoControlBar").css("position", "static");
        $(".jyd-newPicBox").css("position", "relative");
        $(".jyd-newPicBox").css("bottom", "0");
        $(".jyd-exitFullScreen").css("display", "none");
        $(".jyd-fullScreen").css("display", "inline-block");
        $(".jyd-videoPlayerCover").hide();
    }

    function changeVideoWrapSizeFS() {
        var screenWidth = window.screen.width;
        var screenHeight = window.screen.height;

        var video1WrapWidth = screenWidth * 0.5;
        var video1WrapHeight = parseInt(video1WrapWidth) * 9 / 16;
        $(".jyd-leftWrap-doubleScreen").css("height", video1WrapHeight);

        $(".jyd-videoCover").css("height", video1WrapHeight);
        $(".jyd-videoPart").css("height", video1WrapHeight);
        $(".jyd-videoPlayer").css("padding-top", (screenHeight - video1WrapHeight) / 2 + "px");
        $(".jyd-rightWrap-doubleScreen").css("height", video1WrapHeight);
        $(".jyd-coverPlayBtn").css("margin-top", video1WrapHeight / 2 - 50);
        $(".jyd-coverWaitingBtn").css("margin-top", video1WrapHeight / 2 - 50);

        // $(".jyd-videoControlBar").css("display", "none");
        $(".jyd-videoControlBar").css("position", "absolute");
        $(".jyd-videoControlBar").css("bottom", "0");
        $(".jyd-newPicBox").css("position", "absolute");
        $(".jyd-newPicBox").css("bottom", "50px");
    }
    function fullScreen(fullScreenSight) {
        if (fullScreenSight == 1) {
            if (video1 .requestFullscreen) {
                video1 .requestFullscreen();
            } else if (video1 .mozRequestFullScreen) {
                video1 .mozRequestFullScreen();
            } else if (video1 .webkitRequestFullScreen) {
                video1 .webkitRequestFullScreen();
            }
            changeVoice(1);
        }
        else if (fullScreenSight == 2) {
            if (video2 .requestFullscreen) {
                video2 .requestFullscreen();
            } else if (video2 .mozRequestFullScreen) {
                video2 .mozRequestFullScreen();
            } else if (video2 .webkitRequestFullScreen) {
                video2 .webkitRequestFullScreen();
            }
            changeVoice(2);
        }
    }
    $("#jyd-fullScreen").click(function(){
        $(this).css("display", "none");
        $(".jyd-exitFullScreen").css("display", "inline-block");
        var theElement = document.getElementById("jyd-videoPlayer");
        startFullScreen(theElement);
    });
    $("#jyd-exitFullScreen").click(function(){
        exitFull();
    });
    $("#jyd-video1Wrap").dblclick(function(){
        canChangeSight = 0;
        setTimeout(function () {
            canChangeSight = 1;
        }, 500);
        fullScreen(1);
    });
    $("#jyd-video2Wrap").dblclick(function(){
        canChangeSight = 0;
        setTimeout(function () {
            canChangeSight = 1;
        }, 500);
        fullScreen(2);
    });

    //打开静音
    function unMute() {
        var curR = currentAudio;
        changeVoice(curR);
    }

    //倍速播放
    $("#jyd-speed200").click(function(){
        video1.playbackRate = 2;
        video2.playbackRate = 2;
        $("#jyd-playSpeed").children("span").text("当前倍速：2.0X");
    });
    $("#jyd-speed150").click(function(){
        video1.playbackRate = 1.5;
        video2.playbackRate = 1.5;
        $("#jyd-playSpeed").children("span").text("当前倍速：1.5X");
    });
    $("#jyd-speed125").click(function(){
        video1.playbackRate = 1.25;
        video2.playbackRate = 1.25;
        $("#jyd-playSpeed").children("span").text("当前倍速：1.25X");
    });
    $("#jyd-speed100").click(function(){
        video1.playbackRate = 1;
        video2.playbackRate = 1;
        $("#jyd-playSpeed").children("span").text("当前倍速：1.0X");
    });
    $("#jyd-speed075").click(function(){
        video1.playbackRate = 0.75;
        video2.playbackRate = 0.75;
        $("#jyd-playSpeed").children("span").text("当前倍速：0.75X");
    });

    //静音
    $("#jyd-muteBtn").click(function(event){
        event.stopPropagation();
        if (volumeState == 1) {
            currentVolumeBar.style.width = '0px';
            video1.volume = 0;
            video2.volume = 0;
            $("#jyd-muteBtn").removeClass("jyd-unMuteIcon");
            $("#jyd-muteBtn").addClass("jyd-muteIcon");
            volumeState = 0;
        }
        else if (volumeState == 0) {
            currentVolumeBar.style.width = lastVolume * 100 + 'px';
            video1.volume = lastVolume;
            video2.volume = lastVolume;
            $("#jyd-muteBtn").removeClass("jyd-muteIcon");
            $("#jyd-muteBtn").addClass("jyd-unMuteIcon");
            volumeState = 1;
            unMute();
        }
    });

    //页面交互效果
    $("#jyd-radioShift").click(function(event){
        event.stopPropagation();
        if ($(".jyd-radioShiftBox").css('display') == 'none'){
            $(".jyd-radioShiftBox").slideDown(200);
            $(".jyd-speedShiftBox").slideUp(200);
        }
        else {
            $(".jyd-radioShiftBox").slideUp(200);
        }
    });
    $("#jyd-playSpeed").click(function(event){
        event.stopPropagation();
        if ($(".jyd-speedShiftBox").css('display') == 'none'){
            $(".jyd-speedShiftBox").slideDown(200);
            $(".jyd-radioShiftBox").slideUp(200);
        }
        else {
            $(".jyd-speedShiftBox").slideUp(200);
        }
    });
    $(document).click(function(){
        $(".jyd-radioShiftBox").slideUp(200);
        $(".jyd-speedShiftBox").slideUp(200);
    });
    // 控件区鼠标悬浮交互
    // $(".jyd-videoPlayer").hover(function(){
    //     $(this).children(".jyd-videoControlBar").show();
    //     var nowVideoPartHeight = $(".jyd-videoPart").css("height");
    //     $(".jyd-videoPart").css("height", parseInt(nowVideoPartHeight) - 50 + "px");
    //     $(".jyd-rightBottomWrap").css("bottom", "-50px");
    // }, function(){
    //     $(this).children(".jyd-videoControlBar").hide();
    //     var newVideoPartHeight = $(".jyd-videoPart").css("height");
    //     var trueVideoHeight = $(".jyd-leftWrap-doubleScreen").css("height");
    //     if (newVideoPartHeight >= trueVideoHeight) {
    //
    //     }
    //     else {
    //         $(".jyd-videoPart").css("height", parseInt(newVideoPartHeight) + 50 + "px");
    //     }
    // });

    //检测网速
    function testNetSpeed() {
        if (video1.buffered.length && theSize) {
            var timeRangesIndex = 0;
            var timeRanges = video1.buffered;
            for (var i = 0; i < timeRanges.length; i ++) {
                if (video1.currentTime > timeRanges.start(i) && video1.currentTime < timeRanges.end(i)) {
                    timeRangesIndex = i;
                }
            }
            var lastEndTime = timeRanges.end(timeRangesIndex);
            var bufferdTime = 0;
            // console.log(lastEndTime);
            setInterval(function () {
                timeRangesIndex = 0;
                timeRanges = video1.buffered;
                for (var i = 0; i < timeRanges.length; i ++) {
                    if (video1.currentTime > timeRanges.start(i) && video1.currentTime < timeRanges.end(i)) {
                        timeRangesIndex = i;
                    }
                }
                bufferdTime ++;
                // console.log(bufferdTime, 'bufferdTime');
                // console.log(timeRanges.end(timeRangesIndex), 'last');
                // console.log(lastEndTime, 'lastEndTime');
                if (timeRanges.end(timeRangesIndex) > lastEndTime) {
                    var bufferdChange = timeRanges.end(timeRangesIndex) - lastEndTime;
                    var bufferdTrueChange = (bufferdChange / totalT) * theSize;
                    var bufferSpeed = Math.round(bufferdTrueChange / bufferdTime);
                    if (bufferSpeed > 1024 && bufferSpeed < 5000) {
                        bufferSpeedM = Math.round((bufferSpeed / 1024) * 100) / 100;
                        document.getElementById("jyd-coverWaitingBufferSpeed").innerText = bufferSpeedM + 'MB/s';
                    }
                    else if (bufferSpeed > 5000) {
                        bufferSpeedM = Math.round((bufferSpeed / 1024) * 100) / 100;
                        document.getElementById("jyd-coverWaitingBufferSpeed").innerText = '大于5MB/s';
                    }
                    else if (bufferSpeed < 1024 && bufferSpeed > 0) {
                        document.getElementById("jyd-coverWaitingBufferSpeed").innerText = bufferSpeed + 'kB/s';
                    }
                    // console.log(bufferSpeed + 'kB/s');
                    lastEndTime = timeRanges.end(timeRangesIndex);
                    bufferdTime = 0;
                }
            }, 1000)
        }
    }

    //获取打点数据
    function getPicInfo() {
        $.ajax({
            method: 'get',
            url: getPicInfoUrl,
            data: {
                // method: 'getPicInfo',
                id: getPicInfoId
            },
            success: function (data) {
                var picInfo = eval('(' + data + ')').result;
                if (enablePic == "yes") {
                    newSetPicInfo(picInfo);
                }
                else if (enablePic == "simple") {
                    setPicInfo(picInfo);
                }
            },
            error: function () {
                alert("获取打点信息失败");
                // var picInfo = [{"time":16,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/16.jpg&g=16.jpg&yspf=E:/Root","name":"机械设计总论"},{"time":35,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/35.jpg&g=35.jpg&yspf=E:/Root","name":"第一章总论"},{"time":54,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/54.jpg&g=54.jpg&yspf=E:/Root","name":"1.1机械设计课程的性质与任务"},{"time":56,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/56.jpg&g=56.jpg&yspf=E:/Root","name":"1.1.1本课程的研究对象"},{"time":57,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/57.jpg&g=57.jpg&yspf=E:/Root","name":"1.1机械设计课程的性质与任务"},{"time":63,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/63.jpg&g=63.jpg&yspf=E:/Root","name":"1.1.1本课程的研究对象"},{"time":87,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/87.jpg&g=87.jpg&yspf=E:/Root","name":"机械零件的分类\t专用零件:"},{"time":114,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/114.jpg&g=114.jpg&yspf=E:/Root","name":"学习本课程的注意事项\t1）正确对......"},{"time":169,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/169.jpg&g=169.jpg&yspf=E:/Root","name":"需求调研"},{"time":214,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/214.jpg&g=214.jpg&yspf=E:/Root","name":"\t\t\t1.2机械设计的一般步骤1.2.2......."},{"time":235,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/235.jpg&g=235.jpg&yspf=E:/Root","name":"1.2机械设计图"},{"time":269,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/269.jpg&g=269.jpg&yspf=E:/Root","name":"lim\tSt"},{"time":286,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/286.jpg&g=286.jpg&yspf=E:/Root","name":"1.机械零件的计算准则\t3、寿命准......"},{"time":348,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/348.jpg&g=348.jpg&yspf=E:/Root","name":"1.4机械设计的最新进展\t干涉检查"},{"time":354,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/354.jpg&g=354.jpg&yspf=E:/Root","name":"1.4机械设计的最新进展\t底座网格......"}];
                // if (enablePic == "yes") {
                //     newSetPicInfo(picInfo);
                // }
                // else if (enablePic == "simple") {
                //     setPicInfo(picInfo);
                // }
            }
        })
    }

    //加载打点数据
    function setPicInfo(picInfo) {
        if (picInfo) {
            for (var i = 0; i < picInfo.length; i ++) {
                // console.log(picInfo[i].name, 'name');
                // console.log(picInfo[i].time, 'time');
                if (picInfo[i].time > startTime && picInfo[i].time < endTime) {
                    var pointLeft = Math.round((( picInfo[i].time - startTime ) / totalT ) * 100);
                    var insertPointDiv = "" +
                        "            <div class=\"jyd-picPoint\" style=\"left:" + pointLeft + "%\">" +
                        "                <div class=\"jyd-picPointImg\">" +
                        "                    <img src=\"" + picInfo[i].pic + "\" />" +
                        "                    <div class=\"jyd-picPointText\">" + picInfo[i].name + "</div>" +
                        "                </div>" +
                        "            </div>";
                    $("#jyd-processBar").append(insertPointDiv);
                }
            }
        }
    }

    //新打点
    function newSetPicInfo(picInfo) {
        if (picInfo) {
            for (var i = 0; i < picInfo.length; i ++) {
                if (picInfo[i].time > startTime && picInfo[i].time < endTime) {
                    var pointLeft = Math.round((( picInfo[i].time - startTime ) / totalT ) * 100);
                    var insertPointDiv = "" +
                        "            <div class=\"jyd-picPoint\" id=\"jyd-picPointIndex_" + i + "\" style=\"left:" + pointLeft + "%\">" +
                        "            </div>";
                    $("#jyd-processBar").append(insertPointDiv);
                    var insertPicInfoDiv = "" +
                        "            <div class=\"jyd-newPicInfoItem\" id=\"jyd-newPicInfoItem_" + picInfo[i].time + "\">" +
                        "               <img src=\"" + picInfo[i].pic + "\" draggable=\"false\" />" +
                        "               <div class=\"jyd-newPicInfoText\">" + picInfo[i].name + "</div>" +
                        "            </div>";
                    $(".jyd-newPicInnerBox").append(insertPicInfoDiv);
                }
            }
        }
        var dragMouseTruePositionX = 0;
        var downMouseTruePositionX = 0;
        $(".jyd-newPicInfoItem").click(function(){
            console.log(dragMouseTruePositionX - downMouseTruePositionX, 'move');
            if (dragMouseTruePositionX - downMouseTruePositionX < 3 && dragMouseTruePositionX - downMouseTruePositionX > -3) {
                var evalTime = $(this).attr("id").split("_")[1];
                video1.currentTime = evalTime;
                video2.currentTime = evalTime;
                video3.currentTime = evalTime;
            }
            dragMouseTruePositionX = 0;
            downMouseTruePositionX = 0;
        });
        $(".jyd-picPoint").hover(function() {
            var picPointIndex = $(this).attr("id").split("_")[1];
            $(".jyd-newPicInfoItem").eq(picPointIndex).addClass("onselectPic");
            goPicPointPosition(picPointIndex);
        },function () {
            var picPointIndex = $(this).attr("id").split("_")[1];
            $(".jyd-newPicInfoItem").eq(picPointIndex).removeClass("onselectPic");
        });
        var dragMousePositionX = 0;
        var downMousePositionX = 0;
        var theScrl;
        var dragBox = document.getElementById("jyd-newPicMiddleBox");
        dragBox.onmousedown = function(event) {
            downMousePositionX = event.offsetX;
            downMouseTruePositionX = event.clientX;
            dragMouseTruePositionX = event.clientX;
            theScrl = $(".jyd-newPicMiddleBox").scrollLeft();
            // console.log(downMousePositionX, 'downMousePositionX');
            dragBox.onmousemove = function(event) {
                dragMousePositionX = event.offsetX;
                dragMouseTruePositionX = event.clientX;
                // console.log(dragMousePositionX, 'dragMousePositionX');
                theScrl = theScrl - (dragMousePositionX - downMousePositionX);
                $(".jyd-newPicMiddleBox").scrollLeft(theScrl);
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            }
        };
        document.onmouseup = function(){
            $(".jyd-processBarTimeInfo").hide();
            dragBox.onmousemove = null; //弹起鼠标不做任何操作
            document.onmousemove = null; //弹起鼠标不做任何操作
        };
    }

    var movepx = option.movepx ? option.movepx : 3;
    var scrl;
    var holdRight;
    var holdLeft;

    //单击滚页按钮
    $(".jyd-newPicRightBtn").click(function(){
        scrl = $(".jyd-newPicMiddleBox").scrollLeft();
        scrl += movepx;
        $(".jyd-newPicMiddleBox").scrollLeft(scrl);

    });
    $(".jyd-newPicLeftBtn").click(function(){
        scrl = $(".jyd-newPicMiddleBox").scrollLeft();
        scrl -= movepx;
        $(".jyd-newPicMiddleBox").scrollLeft(scrl);

    });
    //按住滚页按钮
    $(".jyd-newPicRightBtn").mousedown(function(e){
        if (e.which == 1)
        {
            scrl = $(".jyd-newPicMiddleBox").scrollLeft();
            holdRight = setInterval(function() {
                scrl += movepx;
                $(".jyd-newPicMiddleBox").scrollLeft(scrl);
            }, 1);
        }
        else if (e.which == 2 || e.which == 3)
        {
            clearInterval(holdRight);
        }
    });
    $(".jyd-newPicRightBtn").mouseup(function(){
        clearInterval(holdRight);
    });
    $(".jyd-newPicRightBtn").mousemove(function(){
        clearInterval(holdRight);
    });
    $(".jyd-newPicLeftBtn").mousedown(function(e){
        if (e.which == 1)
        {
            scrl = $(".jyd-newPicMiddleBox").scrollLeft();
            holdLeft = setInterval(function() {
                scrl -= movepx;
                $(".jyd-newPicMiddleBox").scrollLeft(scrl);
            }, 1);
        }
        else if (e.which == 2 || e.which == 3)
        {
            clearInterval(holdLeft);
        }
    });
    $(".jyd-newPicLeftBtn").mouseup(function() {
        clearInterval(holdLeft);
    });
    $(".jyd-newPicLeftBtn").mousemove(function() {
        clearInterval(holdLeft);
    });

    //打点图片定位
    function goPicPointPosition(picPointIndex) {
        $(".jyd-newPicMiddleBox").stop();
        var pointOffsetX = $(".jyd-newPicInfoItem").eq(picPointIndex).offset().left;
        $(".jyd-newPicMiddleBox").animate({scrollLeft: pointOffsetX}, 1000);
    }

    //对外暴露方法
    return {
        //暂停播放
        stopVideo: function () {
            if(playState == 1) {
                video1.pause();
                video2.pause();
                $("#jyd-pauseState").removeClass("jyd-pauseIcon");
                $("#jyd-pauseState").addClass("jyd-startIcon");
                playState = 0;
                $(".jyd-videoCover").show();
                $(".jyd-videoWaitingCover").hide();
            }
        },
        //继续播放
        playVideo: function () {
            if(video1MetaLoad + video2MetaLoad == 2) {
                video1.play();
                video2.play();
                $(".jyd-videoCover").hide();
            }
            else if(video1MetaLoad + video2MetaLoad < 2) {
                video1.pause();
                video2.pause();
                $(".jyd-videoCover").hide();
                $(".jyd-videoWaitingCover").show();
            }
            $("#jyd-pauseState").removeClass("jyd-startIcon");
            $("#jyd-pauseState").addClass("jyd-pauseIcon");
            playState = 1;
        },
        //获取播放时间点
        playCurrentTime: function () {
            var theCurrentTime = Math.floor(video1.currentTime);
            return theCurrentTime;
        },
        //跳转到播放时间点
        playStartPoint: function (evalTime) {
            video1.currentTime = evalTime;
            video2.currentTime = evalTime;
        },
        //开启剪辑功能
        startCutting: function () {
            if(playState == 1) {
                video1.pause();
                video2.pause();
                $("#jyd-pauseState").removeClass("jyd-pauseIcon");
                $("#jyd-pauseState").addClass("jyd-startIcon");
                playState = 0;
                $(".jyd-videoCover").show();
                $(".jyd-videoWaitingCover").hide();
            }
            $("#jyd-currentProcessBar").hide();
            $(".jyd-picPoint").hide();
            $(".jyd-radioShift").hide();
            $(".jyd-playSpeed").hide();
            $(".jyd-processBar").css("width", "calc(100% - 400px)");
            var insertCuttingBar = "" +
                "            <div class=\"jyd-picCuttingBar\" id=\"jyd-picCuttingBarStart\" style=\"left:0%\">" +
                "               <div class=\"jyd-picCuttingHandleUp\"></div>" +
                "            </div>" +
                "            <div class=\"jyd-picCuttingBar\" id=\"jyd-picCuttingBarEnd\" style=\"left:100%\">" +
                "               <div class=\"jyd-picCuttingHandleDown\"></div>" +
                "            </div>";
            $("#jyd-processBar").append(insertCuttingBar);
            $(".jyd-picCuttingBar").mousedown(function(event){
                event.stopPropagation();
            });
            processBarWidth = parseInt($("#jyd-processBar").css("width"));
            var startPosition = 0;
            var endPostion = processBarWidth;
            mousePositionX = 0;
            var startBar = document.getElementById("jyd-picCuttingBarStart");
            startBar.onmousedown = function(event) {
                var that = document.getElementById("jyd-processBar");
                var event = event || window.event;
                document.onmousemove = function(event){
                    var event = event || window.event;
                    mousePositionX = event.clientX - that.offsetLeft;
                    if(mousePositionX < 0){
                        mousePositionX = 0;
                    }
                    else if(mousePositionX > endPostion){
                        mousePositionX = endPostion;
                    }
                    video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    video2.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    allLoad();
                    startBar.style.left = mousePositionX + "px";
                    startPosition = mousePositionX;
                    cuttingStartTime = totalT * startPosition / processBarWidth + parseInt(startTime);
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                }
            }
            var endBar = document.getElementById("jyd-picCuttingBarEnd");
            endBar.onmousedown = function(event) {
                var that = document.getElementById("jyd-processBar");
                var event = event || window.event;
                document.onmousemove = function(event){
                    var event = event || window.event;
                    mousePositionX = event.clientX - that.offsetLeft;
                    if(mousePositionX < startPosition){
                        mousePositionX = startPosition;
                    }
                    else if(mousePositionX > processBarWidth){
                        mousePositionX = processBarWidth;
                    }
                    video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    video2.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    allLoad();
                    endBar.style.left = mousePositionX + "px";
                    endPostion = mousePositionX;
                    cuttingEndTime = totalT * endPostion / processBarWidth + parseInt(startTime);
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                }
            }
        },
        //取消剪辑功能
        cancelCutting: function () {
            $("#jyd-currentProcessBar").show();
            $(".jyd-picPoint").show();
            $(".jyd-picCuttingBar").remove();
        },
        //完成剪辑功能
        completeCutting: function() {
            var cuttingInfo = {
                theStartTime: cuttingStartTime,
                theEndTime: cuttingEndTime
            };
            console.log(cuttingInfo);
            $("#jyd-currentProcessBar").show();
            $(".jyd-picPoint").show();
            $(".jyd-picCuttingBar").remove();
        },
        //获取剪辑开始时间
        getCuttingStartTime: function() {
            if (cuttingStartTime) {
                return Math.round(cuttingStartTime);
            }
            else {
                return 0;
            }
        },
        //获取剪辑结束时间
        getCuttingEndTime: function() {
            if (cuttingEndTime) {
                return Math.round(cuttingEndTime);
            }
            else {
                return totalT;
            }
        },
        //获取缓冲信息
        getBufferedInfo: function() {
            var video1Buffered = video1.buffered;
            var video2Buffered = video2.buffered;
            var logText = "";
            logText += "当前缓冲信息：";
            logText += "\n\t老师画面加载时段：";
            for (var i1 = 0; i1 < video1Buffered.length; i1 ++) {
                logText += "\n\t\t第" + (i1 + 1) + "段：" + video1Buffered.start(i1) + "-" + video1Buffered.end(i1);
            }
            logText += "\n\t课件画面加载时段：";
            for (var j1 = 0; j1 < video2Buffered.length; j1 ++) {
                logText += "\n\t\t第" + (j1 + 1) + "段：" + video2Buffered.start(j1) + "-" + video2Buffered.end(j1);
            }
            console.log(logText);
        },
        //开启自动获取缓冲信息
        getBufferedInfoAutoOpen: function() {
            video1.onprogress = function() {
                printBufferedInfo(1);
            };
            video2.onprogress = function() {
                printBufferedInfo(2);
            };
        },
        //关闭自动获取缓冲信息
        getBufferedInfoAutoClose: function() {
            video1.onprogress = null;
            video2.onprogress = null;
        }
    }
}

//sc:学生、课件两画面
function sightTypeSC(option, autoP) {
    var element = option.element;
    var teacherVideoUrl = option.teacherVideoUrl;
    var studentVideoUrl = option.studentVideoUrl;
    var courseVideoUrl = option.courseVideoUrl;
    var videoSize = option.videoSize;
    var getPicInfoUrl = option.getPicInfoUrl;
    var getPicInfoId = option.getPicInfoId;
    var cutStartTime = option.cutStartTime;
    var cutEndTime = option.cutEndTime;
    var enablePic = option.enablePic;

    var jydVideoPlayer = "" +
        "<div class=\"jyd-videoPlayer\" id=\"jyd-videoPlayer\">\n" +
        "    <div class=\"jyd-videoPlayerCover\"></div>" +
        "    <div class=\"jyd-videoPart\">\n" +
        "        <div class=\"jyd-videoCover\">\n" +
        "            <div class=\"jyd-coverPlayBtn\"></div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-videoWrap jyd-leftWrap-doubleScreen\" id=\"jyd-video1Wrap\">\n" +
        "            <div class=\"jyd-videoWaitingCover\">\n" +
        "                <div class=\"jyd-coverWaitingBtn\">" +
        "                   <div class=\"jyd-coverWaitingIcon\"></div>" +
        "                   <div class=\"jyd-coverWaitingText\">loading...</div>" +
        "                   <div class=\"jyd-coverWaitingBufferSpeed\" id=\"jyd-coverWaitingBufferSpeed\"></div>" +
        "                </div>\n" +
        "            </div>\n" +
        "            <video id=\"jyd-video1\"></video>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-videoWrap jyd-rightWrap-doubleScreen\" id=\"jyd-video2Wrap\">\n" +
        "            <div class=\"jyd-videoWaitingCover\">\n" +
        "                <div class=\"jyd-coverWaitingBtn\">" +
        "                   <div class=\"jyd-coverWaitingIcon\"></div>" +
        "                   <div class=\"jyd-coverWaitingText\">loading...</div>" +
        "                   <div class=\"jyd-coverWaitingBufferSpeed\" id=\"jyd-coverWaitingBufferSpeed\"></div>" +
        "                </div>\n" +
        "            </div>\n" +
        "            <video id=\"jyd-video2\"></video>\n" +
        "        </div>\n" +
        "    </div>\n";
        if (enablePic && enablePic == "yes") {
            jydVideoPlayer += "" +
                "<div class=\"jyd-newPicBox\">" +
                "    <div class=\"jyd-newPicMiddleBox\" id=\"jyd-newPicMiddleBox\">" +
                "       <div class=\"jyd-newPicInnerBox\"></div>" +
                "    </div>" +
                "    <div class=\"jyd-newPicLeftBtn\">《</div>" +
                "    <div class=\"jyd-newPicRightBtn\">》</div>" +
                "</div>";
        }
        jydVideoPlayer += "" +
        "    <div class=\"jyd-videoControlBar\">\n" +
        "        <div class=\"jyd-startAndPause jyd-startIcon\" id=\"jyd-pauseState\"></div>\n" +
        "        <div class=\"jyd-processBar\" id=\"jyd-processBar\">\n" +
        "            <div class=\"jyd-currentProcessBar\" id=\"jyd-currentProcessBar\">\n" +
        "                <div class=\"jyd-roundBar\">" +
        "                    <div class=\"jyd-processBarTimeInfo\">00:00:00</div>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-timeUpdateNow\" id=\"jyd-timeUpdateNow\">00:00:00</div>\n" +
        "        <div class=\"jyd-splitTimeUpdate\">/</div>\n" +
        "        <div class=\"jyd-timeUpdateAll\" id=\"jyd-timeUpdateAll\">00:00:00</div>\n" +
        "        <div class=\"jyd-fullScreen\" id=\"jyd-fullScreen\"></div>\n" +
        "        <div class=\"jyd-exitFullScreen\" id=\"jyd-exitFullScreen\"></div>\n" +
        "        <div class=\"jyd-volumeBar\" id=\"jyd-volumeBar\">\n" +
        "            <div class=\"jyd-currentVolumeBar\" id=\"jyd-currentVolumeBar\">\n" +
        "                <div class=\"jyd-volumeRoundBar\"></div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-muteBtn jyd-unMuteIcon\" id=\"jyd-muteBtn\"></div>\n" +
        "        <div class=\"jyd-radioShift\" id=\"jyd-radioShift\">\n" +
        "            <span>当前音源：学生</span>\n" +
        "            <div class=\"jyd-radioShiftBox\">\n" +
        "                <div id=\"jyd-studentVoice\">学生</div>\n" +
        "                <div id=\"jyd-courseVoice\">课件</div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-playSpeed\" id=\"jyd-playSpeed\">\n" +
        "            <span>当前倍速：1.0X</span>\n" +
        "            <div class=\"jyd-speedShiftBox\">\n" +
        "                <div id=\"jyd-speed200\">2.0X</div>\n" +
        "                <div id=\"jyd-speed150\">1.5X</div>\n" +
        "                <div id=\"jyd-speed125\">1.25X</div>\n" +
        "                <div id=\"jyd-speed100\">1.0X</div>\n" +
        "                <div id=\"jyd-speed075\">0.75X</div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>";

    var theDivDom = document.getElementById(element);
    theDivDom.innerHTML = jydVideoPlayer;

    var video1 = document.getElementById("jyd-video1");
    var video2 = document.getElementById("jyd-video2");

    var playState; //播放状态  1正在播放 0暂停
    var volumeState; //声音状态  1有声音 0静音
    var canFullScreen = 1; //禁用全屏flag  1可全屏 0禁用
    var canChangeSight = 1; //禁用切换主画面flag  1可切换 0禁用
    var currentVideo; //当前主画面  1学生 2课件
    var currentAudio; //当前声音线路  1学生 2课件
    var totalT; //视频总时长
    var theSize = parseInt(videoSize); //视频总大小(总和) 单位KB
    var startTime; //视频开始时间
    var endTime; //视频结束时间
    var firstCanplayState = 1; //初次加载状态
    var cuttingStartTime; //剪辑开始时间
    var cuttingEndTime; //剪辑结束时间

    //主画面线路  //视频加载
    var video1Url = studentVideoUrl;
    var video2Url = courseVideoUrl;
    currentVideo = 1;
    if(Hls.isSupported()) {
        hls1 = new Hls();
        hls1.loadSource(video1Url);
        hls1.attachMedia(video1);
        hls1.on(Hls.Events.MANIFEST_PARSED,function() {
            if (autoP) {
                video1.play();
                $(".jyd-videoCover").hide();
                $("#jyd-pauseState").removeClass("jyd-startIcon");
                $("#jyd-pauseState").addClass("jyd-pauseIcon");
                playState = 1;
            }
            else {
                video1.pause();
                playState = 0;
            }
        });
        // hls1.on(Hls.Events.ERROR, (event, data) => {
        //     sightTypeSingle('c');
        // });
        hls2 = new Hls();
        hls2.loadSource(video2Url);
        hls2.attachMedia(video2);
        hls2.on(Hls.Events.MANIFEST_PARSED,function() {
            if (autoP) {
                video2.play();
                $(".jyd-videoCover").hide();
                $("#jyd-pauseState").removeClass("jyd-startIcon");
                $("#jyd-pauseState").addClass("jyd-pauseIcon");
                playState = 1;
            }
            else {
                video2.pause();
                playState = 0;
            }
        });
        // hls1.on(Hls.Events.ERROR, (event, data) => {
        //     sightTypeSingle('s');
        // });
    }
    else {
        alert("请使用谷歌浏览器或360浏览器极速模式");
    }
    volumeState = 1;
    changeVoice(1);
    changeVideoWrapSize();


    // 缓冲进度
    // var timeRanges;
    // setInterval(function(){
    //     timeRanges = video1.buffered;
    //     console.log(timeRanges.end(0), '1');
    // }, '100');
    // setInterval(function(){
    //     timeRanges = video2.buffered;
    //     console.log(timeRanges.end(0), '2');
    // }, '100');
    // setInterval(function(){
    //     timeRanges = video3.buffered;
    //     console.log(timeRanges.end(0), '3');
    // }, '100');

    var video1Loading = 1;
    var video2Loading = 1;
    var video1MetaLoad = 0;
    var video2MetaLoad = 0;

    function allLoad() {
        if (video1MetaLoad + video2MetaLoad) {
            if (playState == 1) {
                // $(".jyd-videoWaitingCover").hide();
                // video1.play();
                // video2.play();
                video1Loading = 0;
                video2Loading = 0;
                testNetSpeed();
            }
        }
    }

    video1.onloadedmetadata = function() {
        video1MetaLoad = 1;
        if (playState == 0) {
            video1.pause();
        }
        allLoad();
    };
    video2.onloadedmetadata = function() {
        video2MetaLoad = 1;
        if (playState == 0) {
            video2.pause();
        }
        allLoad();
    };

    //测试缓冲进度
    function printBufferedInfo(sight) {
        var video1Buffered = video1.buffered;
        var video2Buffered = video2.buffered;
        var logText = "";
        if (sight == 1) {
            logText = "学生画面缓冲中...";
            logText += "\n学生画面缓冲信息：";
            for (var i1 = 0; i1 < video1Buffered.length; i1 ++) {
                logText += "\n\t第" + (i1 + 1) + "段：" + video1Buffered.start(i1) + "-" + video1Buffered.end(i1);
            }
            console.log(logText);
        }
        else if (sight == 2) {
            logText = "课件画面缓冲中...";
            logText += "\n课件画面缓冲信息：";
            for (var j1 = 0; j1 < video2Buffered.length; j1 ++) {
                logText += "\n\t第" + (j1 + 1) + "段：" + video2Buffered.start(j1) + "-" + video2Buffered.end(j1);
            }
            console.log(logText);
        }
    }

    function consoleLogFlag() {
        console.log(video1Loading, 'video1Loading');
        console.log(video2Loading, 'video2Loading');
    }

    video1.onwaiting = function() {
        // if (video1Loading + video2Loading == 0) {
            video1Loading = 1;
            // console.log(video1Loading + video2Loading + video3Loading, 'sum');
            // console.log('1loading');
            // video2.pause();
            // consoleLogFlag();
            $("#jyd-video1Wrap").children(".jyd-videoWaitingCover").show();
        // }
        // else{
        //     return false
        // }
    };
    video2.onwaiting = function() {
        // if (video1Loading + video2Loading == 0) {
            video2Loading = 1;
            // console.log(video1Loading + video2Loading + video3Loading, 'sum');
            // console.log('2loading');
            // video1.pause();
            // consoleLogFlag();
            $("#jyd-video2Wrap").children(".jyd-videoWaitingCover").show();
        // }
        // else{
        //     return false
        // }
    };

    function goOnPlay(){
        // console.log('goOn!');
        // consoleLogFlag();
        if (video1Loading + video2Loading == 0) {
            if (playState == 1) {
                // console.log('realyGoOn!');
                // $(".jyd-videoWaitingCover").hide();
                video1.play();
                video2.play();
            }
        }
    }

    video1.onplaying = function() {
        video1Loading = 0;
        $("#jyd-video1Wrap").children(".jyd-videoWaitingCover").hide();
        goOnPlay();
    };

    video2.onplaying = function() {
        video2Loading = 0;
        $("#jyd-video2Wrap").children(".jyd-videoWaitingCover").hide();
        goOnPlay();
    };

    //播放时间显示
    video1.addEventListener('canplay',function(){
        totalT = getTotalT(video1.duration);
        var videoDuration = formatTime(totalT);
        document.getElementById("jyd-timeUpdateAll").innerHTML = videoDuration;
        if (firstCanplayState) {
            video1.currentTime = startTime;
            video2.currentTime = startTime;
            if (enablePic == "yes" || enablePic == "simple") {
                getPicInfo();
            }
        }
        firstCanplayState = 0;
    });

    //剪辑时长校验
    function getTotalT(maxTime) {
        if (cutStartTime && cutStartTime > 0 && cutStartTime < maxTime) {
            if (cutEndTime && cutEndTime > cutStartTime && cutEndTime < maxTime) {
                startTime = cutStartTime;
                endTime = cutEndTime;
                return cutEndTime - cutStartTime;
            }
            else {
                startTime = cutStartTime;
                endTime = maxTime;
                return maxTime - cutStartTime;
            }
        }
        else {
            if (cutEndTime && cutEndTime > 0 && cutEndTime < maxTime) {
                startTime = 0;
                endTime = cutEndTime;
                return cutEndTime;
            }
            else {
                startTime = 0;
                endTime = maxTime;
                return maxTime;
            }
        }
    }

    video1.addEventListener('timeupdate',function() {
        var presentT = this.currentTime;
        // console.log(endTime, "endTime");
        // console.log(presentT, "presentT");
        if (presentT >= endTime) {
            video1.currentTime = startTime;
            video2.currentTime = startTime;
            if(playState == 1) {
                video1.pause();
                video2.pause();
                $("#jyd-pauseState").removeClass("jyd-pauseIcon");
                $("#jyd-pauseState").addClass("jyd-startIcon");
                playState = 0;
                $(".jyd-videoCover").show();
                $(".jyd-videoWaitingCover").hide();
            }
        }
        var videoCurrent = formatTime(presentT - startTime);
        document.getElementById("jyd-timeUpdateNow").innerHTML = videoCurrent;
        $(".jyd-processBarTimeInfo").text(videoCurrent);

        var percent = ( presentT - startTime ) / totalT * 100;
        document.getElementById("jyd-currentProcessBar").style.width = percent + '%';
    });

    function formatTime(t){
        var hh = parseInt(t / 3600);
        hh = hh < 10 ? '0' + hh : hh;
        var mm = parseInt(t % 3600 / 60);
        mm = mm < 10 ? '0' + mm : mm;
        var ss = parseInt(t % 60);
        ss = ss < 10 ? '0' + ss : ss;
        return hh + ':' + mm + ':' + ss;
    }

    //拖动进度条
    var mousePositionX = 0;
    var processBarWidth;
    var processBar = document.getElementById("jyd-processBar");
    var currentProcessBar = document.getElementById("jyd-currentProcessBar");
    processBar.onmousedown = function(event) {
        var that = this;
        $(".jyd-processBarTimeInfo").show();
        processBarWidth = parseInt($("#jyd-processBar").css("width"));
        var event = event || window.event;
        mousePositionX = event.clientX - this.offsetLeft;
        video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
        video2.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
        allLoad();
        currentProcessBar.style.width = mousePositionX + "px";
        document.onmousemove = function(event){
            var event = event || window.event;
            mousePositionX = event.clientX - that.offsetLeft;
            if(mousePositionX < 0){
                mousePositionX = 0;
            }
            else if(mousePositionX > processBarWidth){
                mousePositionX = processBarWidth;
            }
            video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
            video2.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
            allLoad();
            currentProcessBar.style.width = mousePositionX + "px";
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }
    };
    document.onmouseup = function(){
        $(".jyd-processBarTimeInfo").hide();
        document.onmousemove = null; //弹起鼠标不做任何操作
    };

    //拖动音量条
    var lastVolume = 1;
    var volumeMousePositionX = 0;
    var volumeBarWidth;
    var volumeBar = document.getElementById("jyd-volumeBar");
    var currentVolumeBar = document.getElementById("jyd-currentVolumeBar");
    volumeBar.onmousedown = function(event) {
        var that = this;
        volumeBarWidth = parseInt($("#jyd-volumeBar").css("width"));
        var event = event || window.event;
        volumeMousePositionX = event.clientX - this.offsetLeft;
        video1.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
        video2.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
        currentVolumeBar.style.width = volumeMousePositionX + "px";
        lastVolume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
        $("#jyd-muteBtn").removeClass("jyd-muteIcon");
        $("#jyd-muteBtn").addClass("jyd-unMuteIcon");
        volumeState = 1;
        unMute();
        document.onmousemove = function(event){
            var event = event || window.event;
            volumeMousePositionX = event.clientX - that.offsetLeft;
            if(volumeMousePositionX < 0){
                volumeMousePositionX = 0;
            }
            else if(volumeMousePositionX > volumeBarWidth){
                volumeMousePositionX = volumeBarWidth;
            }
            video1.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
            video2.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
            $("#jyd-muteBtn").removeClass("jyd-muteIcon");
            $("#jyd-muteBtn").addClass("jyd-unMuteIcon");
            currentVolumeBar.style.width = volumeMousePositionX + "px";
            lastVolume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
            volumeState = 1;
            unMute();
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }
    };

    //音源切换
    function changeVoice(theVoice){
        if (theVoice == 1) {
            video1.muted = false;
            video2.muted = true;
            currentAudio = 1;
            $("#jyd-radioShift").children("span").text("当前音源：学生");
        }
        else if (theVoice == 2) {
            video1.muted = true;
            video2.muted = false;
            currentAudio = 2;
            $("#jyd-radioShift").children("span").text("当前音源：课件");
        }
    }
    $("#jyd-studentVoice").click(function(event){
        event.stopPropagation();
        changeVoice(1);
        $(".jyd-radioShiftBox").slideUp(0);
    });
    $("#jyd-courseVoice").click(function(event){
        event.stopPropagation();
        changeVoice(2);
        $(".jyd-radioShiftBox").slideUp(0);
    });

    //画面比例自适应
    function changeVideoWrapSize(){
        var video1WrapWidth = $(".jyd-leftWrap-doubleScreen").css("width");
        var video1WrapHeight = parseInt(video1WrapWidth) * 9 / 16;
        $(".jyd-leftWrap-doubleScreen").css("height", video1WrapHeight);

        // var videoMaxHeight = parseInt($("#jyd-video1Wrap").css("height"));
        $(".jyd-videoCover").css("height", video1WrapHeight);
        $(".jyd-videoPart").css("height", video1WrapHeight);
        $(".jyd-rightWrap-doubleScreen").css("height", video1WrapHeight);
        $(".jyd-coverPlayBtn").css("margin-top", video1WrapHeight / 2 - 50);
        $(".jyd-coverWaitingBtn").css("margin-top", video1WrapHeight / 2 - 50);
    }
    window.onresize = changeVideoWrapSize();

    //播放及暂停
    $(".jyd-videoCover").click(function(){
        // if(video1MetaLoad + video2MetaLoad == 2) {
        //     video1.play();
        //     video2.play();
        //     $(".jyd-videoCover").hide();
        // }
        // else if(video1MetaLoad + video2MetaLoad < 2) {
        //     video1.pause();
        //     video2.pause();
        //     $(".jyd-videoCover").hide();
        //     $(".jyd-videoWaitingCover").show();
        // }
        video1.play();
        video2.play();
        $(this).hide();
        $("#jyd-pauseState").removeClass("jyd-startIcon");
        $("#jyd-pauseState").addClass("jyd-pauseIcon");
        playState = 1;
        testNetSpeed();
    });
    $("#jyd-pauseState").click(function(){
        if(playState == 1){
            video1.pause();
            video2.pause();
            $("#jyd-pauseState").removeClass("jyd-pauseIcon");
            $("#jyd-pauseState").addClass("jyd-startIcon");
            playState = 0
            $(".jyd-videoCover").show();
            $(".jyd-videoWaitingCover").hide();
        }
        else if(playState == 0){
            if(video1MetaLoad + video2MetaLoad == 2) {
                video1.play();
                video2.play();
                $(".jyd-videoCover").hide();
            }
            else if(video1MetaLoad + video2MetaLoad < 2) {
                video1.pause();
                video2.pause();
                $(".jyd-videoCover").hide();
                $(".jyd-videoWaitingCover").show();
            }
            $("#jyd-pauseState").removeClass("jyd-startIcon");
            $("#jyd-pauseState").addClass("jyd-pauseIcon");
            playState = 1;
        }
    });

    //主画面切换
    // function delayFullScreen() { //画面线路切换时禁止全屏
    //     canFullScreen = 0;
    //     setTimeout(function(){
    //         canFullScreen = 1;
    //     }, 100);
    // }
    $("#jyd-video1Wrap").click(function(){
        setTimeout(function () {
            if (canChangeSight) {
                var currV = currentVideo;
                if (currV == 1) {

                }
                else if (currV == 2) {
                    // delayFullScreen();
                    currentVideo = 1;
                    $("#jyd-video1Wrap").removeClass("jyd-rightWrap-doubleScreen");
                    $("#jyd-video1Wrap").addClass("jyd-leftWrap-doubleScreen");
                    $("#jyd-video2Wrap").removeClass("jyd-leftWrap-doubleScreen");
                    $("#jyd-video2Wrap").addClass("jyd-rightWrap-doubleScreen");
                    changeVoice(1);
                }
                changeVideoWrapSize();
                // var nowVideoPartHeight = $(".jyd-videoPart").css("height");
                // $(".jyd-videoPart").css("height", parseInt(nowVideoPartHeight) - 50 + "px");
            }
        }, 300);
    });
    $("#jyd-video2Wrap").click(function(){
        setTimeout(function () {
            if (canChangeSight) {
                var currV = currentVideo;
                if (currV == 1) {
                    // delayFullScreen();
                    currentVideo = 2;
                    $("#jyd-video1Wrap").removeClass("jyd-leftWrap-doubleScreen");
                    $("#jyd-video1Wrap").addClass("jyd-rightWrap-doubleScreen");
                    $("#jyd-video2Wrap").removeClass("jyd-rightWrap-doubleScreen");
                    $("#jyd-video2Wrap").addClass("jyd-leftWrap-doubleScreen");
                    changeVoice(2);
                }
                else if (currV == 2) {

                }
                changeVideoWrapSize();
                // var nowVideoPartHeight = $(".jyd-videoPart").css("height");
                // $(".jyd-videoPart").css("height", parseInt(nowVideoPartHeight) - 50 + "px");
            }
        }, 300);
    });


    //全屏
    var hideControlBoxInterval;
    var controlBarOnHover = 0;
    var picBoxOnHover = 0;
    var fullScreenMousePositionX = 0;
    var fullScreenMousePositionY = 0;
    var lastFullScreenMousePositionX = 0;
    var lastFullScreenMousePositionY = 0;
    function setHideControlBoxInterval(event) {
        hideControlBoxInterval = setInterval(function () {
            // console.log(fullScreenMousePositionX, 'x');
            // console.log(fullScreenMousePositionY, 'y');
            if (fullScreenMousePositionX == lastFullScreenMousePositionX && fullScreenMousePositionY == lastFullScreenMousePositionY) {
                if (controlBarOnHover == 0 && picBoxOnHover == 0) {
                    $(".jyd-videoControlBar").fadeOut(300);
                    $(".jyd-newPicBox").fadeOut(300);
                }
            }
            lastFullScreenMousePositionX = fullScreenMousePositionX;
            lastFullScreenMousePositionY = fullScreenMousePositionY;
        }, 2000);
        document.onmousemove = function(event) {
            fullScreenMousePositionX = event.clientX;
            fullScreenMousePositionY = event.clientY;
            $(".jyd-videoControlBar").show();
            $(".jyd-newPicBox").show();
        }
    }

    $(".jyd-videoControlBar").hover(function() {
        controlBarOnHover = 1;
    }, function() {
        controlBarOnHover = 0;
    });
    $(".jyd-newPicBox").hover(function() {
        picBoxOnHover = 1;
    }, function() {
        picBoxOnHover = 0;
    });

    function startFullScreen(el) {
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
            wscript;
        if(typeof rfs != "undefined" && rfs) {
            rfs.call(el);
            changeVideoWrapSizeFS();
            setHideControlBoxInterval(el);
            $(".jyd-videoPlayerCover").show();
            $(".jyd-videoPlayerCover").dblclick(function() {
                exitFull();
            });
            var fsFalg = 1;
            window.onresize = function() {
                if (fsFalg == 0) {
                    clearInterval(hideControlBoxInterval);
                    changeVideoWrapSize();
                    $(".jyd-videoPlayer").css("padding-top", "0");
                    $(".jyd-videoControlBar").show();
                    $(".jyd-videoControlBar").css("position", "static");
                    $(".jyd-newPicBox").css("position", "relative");
                    $(".jyd-newPicBox").css("bottom", "0");
                    $(".jyd-exitFullScreen").css("display", "none");
                    $(".jyd-fullScreen").css("display", "inline-block");
                    $(".jyd-videoPlayerCover").hide();
                }
                fsFalg = 0;
            };
        }
        if(typeof window.ActiveXObject != "undefined") {
            wscript = new ActiveXObject("WScript.Shell");
            if(wscript) {
                wscript.SendKeys("{F11}");
            }
        }
    }
    function exitFull() {
        // 判断各种浏览器，找到正确的方法
        var exitMethod = document.exitFullscreen || //W3C
            document.mozCancelFullScreen || //FireFox
            document.webkitExitFullscreen || //Chrome等
            document.webkitExitFullscreen; //IE11
        if (exitMethod) {
            exitMethod.call(document);
        } else if (typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
        changeVideoWrapSize();
        $(".jyd-videoPlayer").css("padding-top", "0");
        $(".jyd-videoControlBar").show();
        $(".jyd-videoControlBar").css("position", "static");
        $(".jyd-newPicBox").css("position", "relative");
        $(".jyd-newPicBox").css("bottom", "0");
        $(".jyd-exitFullScreen").css("display", "none");
        $(".jyd-fullScreen").css("display", "inline-block");
        $(".jyd-videoPlayerCover").hide();
    }

    function changeVideoWrapSizeFS() {
        var screenWidth = window.screen.width;
        var screenHeight = window.screen.height;

        var video1WrapWidth = screenWidth * 0.5;
        var video1WrapHeight = parseInt(video1WrapWidth) * 9 / 16;
        $(".jyd-leftWrap-doubleScreen").css("height", video1WrapHeight);

        $(".jyd-videoCover").css("height", video1WrapHeight);
        $(".jyd-videoPart").css("height", video1WrapHeight);
        $(".jyd-videoPlayer").css("padding-top", (screenHeight - video1WrapHeight) / 2 + "px");
        $(".jyd-rightWrap-doubleScreen").css("height", video1WrapHeight);
        $(".jyd-coverPlayBtn").css("margin-top", video1WrapHeight / 2 - 50);
        $(".jyd-coverWaitingBtn").css("margin-top", video1WrapHeight / 2 - 50);

        // $(".jyd-videoControlBar").css("display", "none");
        $(".jyd-videoControlBar").css("position", "absolute");
        $(".jyd-videoControlBar").css("bottom", "0");
        $(".jyd-newPicBox").css("position", "absolute");
        $(".jyd-newPicBox").css("bottom", "50px");
    }
    function fullScreen(fullScreenSight) {
        if (fullScreenSight == 1) {
            if (video1 .requestFullscreen) {
                video1 .requestFullscreen();
            } else if (video1 .mozRequestFullScreen) {
                video1 .mozRequestFullScreen();
            } else if (video1 .webkitRequestFullScreen) {
                video1 .webkitRequestFullScreen();
            }
            changeVoice(1);
        }
        else if (fullScreenSight == 2) {
            if (video2 .requestFullscreen) {
                video2 .requestFullscreen();
            } else if (video2 .mozRequestFullScreen) {
                video2 .mozRequestFullScreen();
            } else if (video2 .webkitRequestFullScreen) {
                video2 .webkitRequestFullScreen();
            }
            changeVoice(2);
        }
    }
    $("#jyd-fullScreen").click(function(){
        $(this).css("display", "none");
        $(".jyd-exitFullScreen").css("display", "inline-block");
        var theElement = document.getElementById("jyd-videoPlayer");
        startFullScreen(theElement);
    });
    $("#jyd-exitFullScreen").click(function(){
        exitFull();
    });
    $("#jyd-video1Wrap").dblclick(function(){
        canChangeSight = 0;
        setTimeout(function () {
            canChangeSight = 1;
        }, 500);
        fullScreen(1);
    });
    $("#jyd-video2Wrap").dblclick(function(){
        canChangeSight = 0;
        setTimeout(function () {
            canChangeSight = 1;
        }, 500);
        fullScreen(2);
    });

    //打开静音
    function unMute() {
        var curR = currentAudio;
        changeVoice(curR);
    }

    //倍速播放
    $("#jyd-speed200").click(function(){
        video1.playbackRate = 2;
        video2.playbackRate = 2;
        $("#jyd-playSpeed").children("span").text("当前倍速：2.0X");
    });
    $("#jyd-speed150").click(function(){
        video1.playbackRate = 1.5;
        video2.playbackRate = 1.5;
        $("#jyd-playSpeed").children("span").text("当前倍速：1.5X");
    });
    $("#jyd-speed125").click(function(){
        video1.playbackRate = 1.25;
        video2.playbackRate = 1.25;
        $("#jyd-playSpeed").children("span").text("当前倍速：1.25X");
    });
    $("#jyd-speed100").click(function(){
        video1.playbackRate = 1;
        video2.playbackRate = 1;
        $("#jyd-playSpeed").children("span").text("当前倍速：1.0X");
    });
    $("#jyd-speed075").click(function(){
        video1.playbackRate = 0.75;
        video2.playbackRate = 0.75;
        $("#jyd-playSpeed").children("span").text("当前倍速：0.75X");
    });

    //静音
    $("#jyd-muteBtn").click(function(event){
        event.stopPropagation();
        if (volumeState == 1) {
            currentVolumeBar.style.width = '0px';
            video1.volume = 0;
            video2.volume = 0;
            $("#jyd-muteBtn").removeClass("jyd-unMuteIcon");
            $("#jyd-muteBtn").addClass("jyd-muteIcon");
            volumeState = 0;
        }
        else if (volumeState == 0) {
            currentVolumeBar.style.width = lastVolume * 100 + 'px';
            video1.volume = lastVolume;
            video2.volume = lastVolume;
            $("#jyd-muteBtn").removeClass("jyd-muteIcon");
            $("#jyd-muteBtn").addClass("jyd-unMuteIcon");
            volumeState = 1;
            unMute();
        }
    });

    //页面交互效果
    $("#jyd-radioShift").click(function(event){
        event.stopPropagation();
        if ($(".jyd-radioShiftBox").css('display') == 'none'){
            $(".jyd-radioShiftBox").slideDown(200);
            $(".jyd-speedShiftBox").slideUp(200);
        }
        else {
            $(".jyd-radioShiftBox").slideUp(200);
        }
    });
    $("#jyd-playSpeed").click(function(event){
        event.stopPropagation();
        if ($(".jyd-speedShiftBox").css('display') == 'none'){
            $(".jyd-speedShiftBox").slideDown(200);
            $(".jyd-radioShiftBox").slideUp(200);
        }
        else {
            $(".jyd-speedShiftBox").slideUp(200);
        }
    });
    $(document).click(function(){
        $(".jyd-radioShiftBox").slideUp(200);
        $(".jyd-speedShiftBox").slideUp(200);
    });
    // 控件区鼠标悬浮交互
    // $(".jyd-videoPlayer").hover(function(){
    //     $(this).children(".jyd-videoControlBar").show();
    //     var nowVideoPartHeight = $(".jyd-videoPart").css("height");
    //     $(".jyd-videoPart").css("height", parseInt(nowVideoPartHeight) - 50 + "px");
    //     $(".jyd-rightBottomWrap").css("bottom", "-50px");
    // }, function(){
    //     $(this).children(".jyd-videoControlBar").hide();
    //     var newVideoPartHeight = $(".jyd-videoPart").css("height");
    //     var trueVideoHeight = $(".jyd-leftWrap-doubleScreen").css("height");
    //     if (newVideoPartHeight >= trueVideoHeight) {
    //
    //     }
    //     else {
    //         $(".jyd-videoPart").css("height", parseInt(newVideoPartHeight) + 50 + "px");
    //     }
    // });

    //检测网速
    function testNetSpeed() {
        if (video1.buffered.length && theSize) {
            var timeRangesIndex = 0;
            var timeRanges = video1.buffered;
            for (var i = 0; i < timeRanges.length; i ++) {
                if (video1.currentTime > timeRanges.start(i) && video1.currentTime < timeRanges.end(i)) {
                    timeRangesIndex = i;
                }
            }
            var lastEndTime = timeRanges.end(timeRangesIndex);
            var bufferdTime = 0;
            // console.log(lastEndTime);
            setInterval(function () {
                timeRangesIndex = 0;
                timeRanges = video1.buffered;
                for (var i = 0; i < timeRanges.length; i ++) {
                    if (video1.currentTime > timeRanges.start(i) && video1.currentTime < timeRanges.end(i)) {
                        timeRangesIndex = i;
                    }
                }
                bufferdTime ++;
                // console.log(bufferdTime, 'bufferdTime');
                // console.log(timeRanges.end(timeRangesIndex), 'last');
                // console.log(lastEndTime, 'lastEndTime');
                if (timeRanges.end(timeRangesIndex) > lastEndTime) {
                    var bufferdChange = timeRanges.end(timeRangesIndex) - lastEndTime;
                    var bufferdTrueChange = (bufferdChange / totalT) * theSize;
                    var bufferSpeed = Math.round(bufferdTrueChange / bufferdTime);
                    if (bufferSpeed > 1024 && bufferSpeed < 5000) {
                        bufferSpeedM = Math.round((bufferSpeed / 1024) * 100) / 100;
                        document.getElementById("jyd-coverWaitingBufferSpeed").innerText = bufferSpeedM + 'MB/s';
                    }
                    else if (bufferSpeed > 5000) {
                        bufferSpeedM = Math.round((bufferSpeed / 1024) * 100) / 100;
                        document.getElementById("jyd-coverWaitingBufferSpeed").innerText = '大于5MB/s';
                    }
                    else if (bufferSpeed < 1024 && bufferSpeed > 0) {
                        document.getElementById("jyd-coverWaitingBufferSpeed").innerText = bufferSpeed + 'kB/s';
                    }
                    // console.log(bufferSpeed + 'kB/s');
                    lastEndTime = timeRanges.end(timeRangesIndex);
                    bufferdTime = 0;
                }
            }, 1000)
        }
    }

    //获取打点数据
    function getPicInfo() {
        $.ajax({
            method: 'get',
            url: getPicInfoUrl,
            data: {
                // method: 'getPicInfo',
                id: getPicInfoId
            },
            success: function (data) {
                var picInfo = eval('(' + data + ')').result;
                if (enablePic == "yes") {
                    newSetPicInfo(picInfo);
                }
                else if (enablePic == "simple") {
                    setPicInfo(picInfo);
                }
            },
            error: function () {
                alert("获取打点信息失败");
                // var picInfo = [{"time":16,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/16.jpg&g=16.jpg&yspf=E:/Root","name":"机械设计总论"},{"time":35,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/35.jpg&g=35.jpg&yspf=E:/Root","name":"第一章总论"},{"time":54,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/54.jpg&g=54.jpg&yspf=E:/Root","name":"1.1机械设计课程的性质与任务"},{"time":56,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/56.jpg&g=56.jpg&yspf=E:/Root","name":"1.1.1本课程的研究对象"},{"time":57,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/57.jpg&g=57.jpg&yspf=E:/Root","name":"1.1机械设计课程的性质与任务"},{"time":63,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/63.jpg&g=63.jpg&yspf=E:/Root","name":"1.1.1本课程的研究对象"},{"time":87,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/87.jpg&g=87.jpg&yspf=E:/Root","name":"机械零件的分类\t专用零件:"},{"time":114,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/114.jpg&g=114.jpg&yspf=E:/Root","name":"学习本课程的注意事项\t1）正确对......"},{"time":169,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/169.jpg&g=169.jpg&yspf=E:/Root","name":"需求调研"},{"time":214,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/214.jpg&g=214.jpg&yspf=E:/Root","name":"\t\t\t1.2机械设计的一般步骤1.2.2......."},{"time":235,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/235.jpg&g=235.jpg&yspf=E:/Root","name":"1.2机械设计图"},{"time":269,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/269.jpg&g=269.jpg&yspf=E:/Root","name":"lim\tSt"},{"time":286,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/286.jpg&g=286.jpg&yspf=E:/Root","name":"1.机械零件的计算准则\t3、寿命准......"},{"time":348,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/348.jpg&g=348.jpg&yspf=E:/Root","name":"1.4机械设计的最新进展\t干涉检查"},{"time":354,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/354.jpg&g=354.jpg&yspf=E:/Root","name":"1.4机械设计的最新进展\t底座网格......"}];
                // if (enablePic == "yes") {
                //     newSetPicInfo(picInfo);
                // }
                // else if (enablePic == "simple") {
                //     setPicInfo(picInfo);
                // }
            }
        })
    }

    //加载打点数据
    function setPicInfo(picInfo) {
        if (picInfo) {
            for (var i = 0; i < picInfo.length; i ++) {
                // console.log(picInfo[i].name, 'name');
                // console.log(picInfo[i].time, 'time');
                if (picInfo[i].time > startTime && picInfo[i].time < endTime) {
                    var pointLeft = Math.round((( picInfo[i].time - startTime ) / totalT ) * 100);
                    var insertPointDiv = "" +
                        "            <div class=\"jyd-picPoint\" style=\"left:" + pointLeft + "%\">" +
                        "                <div class=\"jyd-picPointImg\">" +
                        "                    <img src=\"" + picInfo[i].pic + "\" />" +
                        "                    <div class=\"jyd-picPointText\">" + picInfo[i].name + "</div>" +
                        "                </div>" +
                        "            </div>";
                    $("#jyd-processBar").append(insertPointDiv);
                }
            }
        }
    }

    //新打点
    function newSetPicInfo(picInfo) {
        if (picInfo) {
            for (var i = 0; i < picInfo.length; i ++) {
                if (picInfo[i].time > startTime && picInfo[i].time < endTime) {
                    var pointLeft = Math.round((( picInfo[i].time - startTime ) / totalT ) * 100);
                    var insertPointDiv = "" +
                        "            <div class=\"jyd-picPoint\" id=\"jyd-picPointIndex_" + i + "\" style=\"left:" + pointLeft + "%\">" +
                        "            </div>";
                    $("#jyd-processBar").append(insertPointDiv);
                    var insertPicInfoDiv = "" +
                        "            <div class=\"jyd-newPicInfoItem\" id=\"jyd-newPicInfoItem_" + picInfo[i].time + "\">" +
                        "               <img src=\"" + picInfo[i].pic + "\" draggable=\"false\" />" +
                        "               <div class=\"jyd-newPicInfoText\">" + picInfo[i].name + "</div>" +
                        "            </div>";
                    $(".jyd-newPicInnerBox").append(insertPicInfoDiv);
                }
            }
        }
        var dragMouseTruePositionX = 0;
        var downMouseTruePositionX = 0;
        $(".jyd-newPicInfoItem").click(function(){
            console.log(dragMouseTruePositionX - downMouseTruePositionX, 'move');
            if (dragMouseTruePositionX - downMouseTruePositionX < 3 && dragMouseTruePositionX - downMouseTruePositionX > -3) {
                var evalTime = $(this).attr("id").split("_")[1];
                video1.currentTime = evalTime;
                video2.currentTime = evalTime;
                video3.currentTime = evalTime;
            }
            dragMouseTruePositionX = 0;
            downMouseTruePositionX = 0;
        });
        $(".jyd-picPoint").hover(function() {
            var picPointIndex = $(this).attr("id").split("_")[1];
            $(".jyd-newPicInfoItem").eq(picPointIndex).addClass("onselectPic");
            goPicPointPosition(picPointIndex);
        },function () {
            var picPointIndex = $(this).attr("id").split("_")[1];
            $(".jyd-newPicInfoItem").eq(picPointIndex).removeClass("onselectPic");
        });
        var dragMousePositionX = 0;
        var downMousePositionX = 0;
        var theScrl;
        var dragBox = document.getElementById("jyd-newPicMiddleBox");
        dragBox.onmousedown = function(event) {
            downMousePositionX = event.offsetX;
            downMouseTruePositionX = event.clientX;
            dragMouseTruePositionX = event.clientX;
            theScrl = $(".jyd-newPicMiddleBox").scrollLeft();
            // console.log(downMousePositionX, 'downMousePositionX');
            dragBox.onmousemove = function(event) {
                dragMousePositionX = event.offsetX;
                dragMouseTruePositionX = event.clientX;
                // console.log(dragMousePositionX, 'dragMousePositionX');
                theScrl = theScrl - (dragMousePositionX - downMousePositionX);
                $(".jyd-newPicMiddleBox").scrollLeft(theScrl);
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            }
        };
        document.onmouseup = function(){
            $(".jyd-processBarTimeInfo").hide();
            dragBox.onmousemove = null; //弹起鼠标不做任何操作
            document.onmousemove = null; //弹起鼠标不做任何操作
        };
    }

    var movepx = option.movepx ? option.movepx : 3;
    var scrl;
    var holdRight;
    var holdLeft;

    //单击滚页按钮
    $(".jyd-newPicRightBtn").click(function(){
        scrl = $(".jyd-newPicMiddleBox").scrollLeft();
        scrl += movepx;
        $(".jyd-newPicMiddleBox").scrollLeft(scrl);

    });
    $(".jyd-newPicLeftBtn").click(function(){
        scrl = $(".jyd-newPicMiddleBox").scrollLeft();
        scrl -= movepx;
        $(".jyd-newPicMiddleBox").scrollLeft(scrl);

    });
    //按住滚页按钮
    $(".jyd-newPicRightBtn").mousedown(function(e){
        if (e.which == 1)
        {
            scrl = $(".jyd-newPicMiddleBox").scrollLeft();
            holdRight = setInterval(function() {
                scrl += movepx;
                $(".jyd-newPicMiddleBox").scrollLeft(scrl);
            }, 1);
        }
        else if (e.which == 2 || e.which == 3)
        {
            clearInterval(holdRight);
        }
    });
    $(".jyd-newPicRightBtn").mouseup(function(){
        clearInterval(holdRight);
    });
    $(".jyd-newPicRightBtn").mousemove(function(){
        clearInterval(holdRight);
    });
    $(".jyd-newPicLeftBtn").mousedown(function(e){
        if (e.which == 1)
        {
            scrl = $(".jyd-newPicMiddleBox").scrollLeft();
            holdLeft = setInterval(function() {
                scrl -= movepx;
                $(".jyd-newPicMiddleBox").scrollLeft(scrl);
            }, 1);
        }
        else if (e.which == 2 || e.which == 3)
        {
            clearInterval(holdLeft);
        }
    });
    $(".jyd-newPicLeftBtn").mouseup(function() {
        clearInterval(holdLeft);
    });
    $(".jyd-newPicLeftBtn").mousemove(function() {
        clearInterval(holdLeft);
    });

    //打点图片定位
    function goPicPointPosition(picPointIndex) {
        $(".jyd-newPicMiddleBox").stop();
        var pointOffsetX = $(".jyd-newPicInfoItem").eq(picPointIndex).offset().left;
        $(".jyd-newPicMiddleBox").animate({scrollLeft: pointOffsetX}, 1000);
    }

    //对外暴露方法
    return {
        //暂停播放
        stopVideo: function () {
            if(playState == 1) {
                video1.pause();
                video2.pause();
                $("#jyd-pauseState").removeClass("jyd-pauseIcon");
                $("#jyd-pauseState").addClass("jyd-startIcon");
                playState = 0;
                $(".jyd-videoCover").show();
                $(".jyd-videoWaitingCover").hide();
            }
        },
        //继续播放
        playVideo: function () {
            if(video1MetaLoad + video2MetaLoad == 2) {
                video1.play();
                video2.play();
                $(".jyd-videoCover").hide();
            }
            else if(video1MetaLoad + video2MetaLoad < 2) {
                video1.pause();
                video2.pause();
                $(".jyd-videoCover").hide();
                $(".jyd-videoWaitingCover").show();
            }
            $("#jyd-pauseState").removeClass("jyd-startIcon");
            $("#jyd-pauseState").addClass("jyd-pauseIcon");
            playState = 1;
        },
        //获取播放时间点
        playCurrentTime: function () {
            var theCurrentTime = Math.floor(video1.currentTime);
            return theCurrentTime;
        },
        //跳转到播放时间点
        playStartPoint: function (evalTime) {
            video1.currentTime = evalTime;
            video2.currentTime = evalTime;
        },
        //开启剪辑功能
        startCutting: function () {
            if(playState == 1) {
                video1.pause();
                video2.pause();
                $("#jyd-pauseState").removeClass("jyd-pauseIcon");
                $("#jyd-pauseState").addClass("jyd-startIcon");
                playState = 0;
                $(".jyd-videoCover").show();
                $(".jyd-videoWaitingCover").hide();
            }
            $("#jyd-currentProcessBar").hide();
            $(".jyd-picPoint").hide();
            $(".jyd-radioShift").hide();
            $(".jyd-playSpeed").hide();
            $(".jyd-processBar").css("width", "calc(100% - 400px)");
            var insertCuttingBar = "" +
                "            <div class=\"jyd-picCuttingBar\" id=\"jyd-picCuttingBarStart\" style=\"left:0%\">" +
                "               <div class=\"jyd-picCuttingHandleUp\"></div>" +
                "            </div>" +
                "            <div class=\"jyd-picCuttingBar\" id=\"jyd-picCuttingBarEnd\" style=\"left:100%\">" +
                "               <div class=\"jyd-picCuttingHandleDown\"></div>" +
                "            </div>";
            $("#jyd-processBar").append(insertCuttingBar);
            $(".jyd-picCuttingBar").mousedown(function(event){
                event.stopPropagation();
            });
            processBarWidth = parseInt($("#jyd-processBar").css("width"));
            var startPosition = 0;
            var endPostion = processBarWidth;
            mousePositionX = 0;
            var startBar = document.getElementById("jyd-picCuttingBarStart");
            startBar.onmousedown = function(event) {
                var that = document.getElementById("jyd-processBar");
                var event = event || window.event;
                document.onmousemove = function(event){
                    var event = event || window.event;
                    mousePositionX = event.clientX - that.offsetLeft;
                    if(mousePositionX < 0){
                        mousePositionX = 0;
                    }
                    else if(mousePositionX > endPostion){
                        mousePositionX = endPostion;
                    }
                    video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    video2.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    allLoad();
                    startBar.style.left = mousePositionX + "px";
                    startPosition = mousePositionX;
                    cuttingStartTime = totalT * startPosition / processBarWidth + parseInt(startTime);
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                }
            }
            var endBar = document.getElementById("jyd-picCuttingBarEnd");
            endBar.onmousedown = function(event) {
                var that = document.getElementById("jyd-processBar");
                var event = event || window.event;
                document.onmousemove = function(event){
                    var event = event || window.event;
                    mousePositionX = event.clientX - that.offsetLeft;
                    if(mousePositionX < startPosition){
                        mousePositionX = startPosition;
                    }
                    else if(mousePositionX > processBarWidth){
                        mousePositionX = processBarWidth;
                    }
                    video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    video2.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    allLoad();
                    endBar.style.left = mousePositionX + "px";
                    endPostion = mousePositionX;
                    cuttingEndTime = totalT * endPostion / processBarWidth + parseInt(startTime);
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                }
            }
        },
        //取消剪辑功能
        cancelCutting: function () {
            $("#jyd-currentProcessBar").show();
            $(".jyd-picPoint").show();
            $(".jyd-picCuttingBar").remove();
        },
        //完成剪辑功能
        completeCutting: function() {
            var cuttingInfo = {
                theStartTime: cuttingStartTime,
                theEndTime: cuttingEndTime
            };
            console.log(cuttingInfo);
            $("#jyd-currentProcessBar").show();
            $(".jyd-picPoint").show();
            $(".jyd-picCuttingBar").remove();
        },
        //获取剪辑开始时间
        getCuttingStartTime: function() {
            if (cuttingStartTime) {
                return Math.round(cuttingStartTime);
            }
            else {
                return 0;
            }
        },
        //获取剪辑结束时间
        getCuttingEndTime: function() {
            if (cuttingEndTime) {
                return Math.round(cuttingEndTime);
            }
            else {
                return totalT;
            }
        },
        //获取缓冲信息
        getBufferedInfo: function() {
            var video1Buffered = video1.buffered;
            var video2Buffered = video2.buffered;
            var logText = "";
            logText += "当前缓冲信息：";
            logText += "\n\t学生画面加载时段：";
            for (var i1 = 0; i1 < video1Buffered.length; i1 ++) {
                logText += "\n\t\t第" + (i1 + 1) + "段：" + video1Buffered.start(i1) + "-" + video1Buffered.end(i1);
            }
            logText += "\n\t课件画面加载时段：";
            for (var j1 = 0; j1 < video2Buffered.length; j1 ++) {
                logText += "\n\t\t第" + (j1 + 1) + "段：" + video2Buffered.start(j1) + "-" + video2Buffered.end(j1);
            }
            console.log(logText);
        },
        //开启自动获取缓冲信息
        getBufferedInfoAutoOpen: function() {
            video1.onprogress = function() {
                printBufferedInfo(1);
            };
            video2.onprogress = function() {
                printBufferedInfo(2);
            };
        },
        //关闭自动获取缓冲信息
        getBufferedInfoAutoClose: function() {
            video1.onprogress = null;
            video2.onprogress = null;
        }
    }
}

//t:单画面
function sightTypeSingle(type, option, autoP) {
    var element = option.element;
    var teacherVideoUrl = option.teacherVideoUrl;
    var studentVideoUrl = option.studentVideoUrl;
    var courseVideoUrl = option.courseVideoUrl;
    var videoSize = option.videoSize;
    var getPicInfoUrl = option.getPicInfoUrl;
    var getPicInfoId = option.getPicInfoId;
    var cutStartTime = option.cutStartTime;
    var cutEndTime = option.cutEndTime;
    var enablePic = option.enablePic;

    var jydVideoPlayer = "" +
        "<div class=\"jyd-videoPlayer\" id=\"jyd-videoPlayer\">\n" +
        "    <div class=\"jyd-videoPart\">\n" +
        "        <div class=\"jyd-videoCover\">\n" +
        "            <div class=\"jyd-coverPlayBtn\"></div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-videoWaitingCover\">\n" +
        "            <div class=\"jyd-coverWaitingBtn\">" +
        "               <div class=\"jyd-coverWaitingIcon\"></div>" +
        "               <div class=\"jyd-coverWaitingText\">loading...</div>" +
        "               <div class=\"jyd-coverWaitingBufferSpeed\" id=\"jyd-coverWaitingBufferSpeed\"></div>" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-videoWrap jyd-Wrap-singleScreen\" id=\"jyd-video1Wrap\">\n" +
        "            <video id=\"jyd-video1\" preload='none'></video>\n" +
        "        </div>\n" +
        "    </div>\n";
        if (enablePic && enablePic == "yes") {
            jydVideoPlayer += "" +
                "<div class=\"jyd-newPicBox\">" +
                "    <div class=\"jyd-newPicMiddleBox\" id=\"jyd-newPicMiddleBox\">" +
                "       <div class=\"jyd-newPicInnerBox\"></div>" +
                "    </div>" +
                "    <div class=\"jyd-newPicLeftBtn\">《</div>" +
                "    <div class=\"jyd-newPicRightBtn\">》</div>" +
                "</div>";
        }
        jydVideoPlayer += "" +
        "    <div class=\"jyd-videoControlBar\">\n" +
        "        <div class=\"jyd-startAndPause jyd-startIcon\" id=\"jyd-pauseState\"></div>\n" +
        "        <div class=\"jyd-processBar\" id=\"jyd-processBar\">\n" +
        "            <div class=\"jyd-currentProcessBar\" id=\"jyd-currentProcessBar\">\n" +
        "                <div class=\"jyd-roundBar\">" +
        "                    <div class=\"jyd-processBarTimeInfo\">00:00:00</div>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-timeUpdateNow\" id=\"jyd-timeUpdateNow\">00:00:00</div>\n" +
        "        <div class=\"jyd-splitTimeUpdate\">/</div>\n" +
        "        <div class=\"jyd-timeUpdateAll\" id=\"jyd-timeUpdateAll\">00:00:00</div>\n" +
        "        <div class=\"jyd-fullScreen\" id=\"jyd-fullScreen\"></div>\n" +
        "        <div class=\"jyd-exitFullScreen\" id=\"jyd-exitFullScreen\"></div>\n" +
        "        <div class=\"jyd-volumeBar\" id=\"jyd-volumeBar\">\n" +
        "            <div class=\"jyd-currentVolumeBar\" id=\"jyd-currentVolumeBar\">\n" +
        "                <div class=\"jyd-volumeRoundBar\"></div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"jyd-muteBtn jyd-unMuteIcon\" id=\"jyd-muteBtn\"></div>\n" +
        // "        <div class=\"jyd-radioShift\" id=\"jyd-radioShift\">\n" +
        // "            <span>当前音源：老师</span>\n" +
        // "            <div class=\"jyd-radioShiftBox\">\n" +
        // "                <div id=\"jyd-teacherVoice\">老师</div>\n" +
        // "                <div id=\"jyd-studentVoice\">学生</div>\n" +
        // "            </div>\n" +
        // "        </div>\n" +
        "        <div class=\"jyd-playSpeed\" id=\"jyd-playSpeed\">\n" +
        "            <span>当前倍速：1.0X</span>\n" +
        "            <div class=\"jyd-speedShiftBox\">\n" +
        "                <div id=\"jyd-speed200\">2.0X</div>\n" +
        "                <div id=\"jyd-speed150\">1.5X</div>\n" +
        "                <div id=\"jyd-speed125\">1.25X</div>\n" +
        "                <div id=\"jyd-speed100\">1.0X</div>\n" +
        "                <div id=\"jyd-speed075\">0.75X</div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>";

    var theDivDom = document.getElementById(element);
    theDivDom.innerHTML = jydVideoPlayer;

    var video1 = document.getElementById("jyd-video1");

    var playState; //播放状态  1正在播放 0暂停
    var volumeState; //声音状态  1有声音 0静音
    var canFullScreen = 1; //禁用全屏flag  1可全屏 0禁用
    var canChangeSight = 1; //禁用切换主画面flag  1可切换 0禁用
    var currentVideo; //当前主画面
    var currentAudio; //当前声音线路
    var totalT; //视频总时长
    var theSize = parseInt(videoSize); //视频总大小(总和) 单位KB
    var startTime; //视频开始时间
    var endTime; //视频结束时间
    var firstCanplayState = 1; //初次加载状态
    var cuttingStartTime; //剪辑开始时间
    var cuttingEndTime; //剪辑结束时间

    //主画面线路  //视频加载
    var video1Url;
    if(type == 't') {
        video1Url = teacherVideoUrl;
    }
    else if(type == 's') {
        video1Url = studentVideoUrl;
    }
    else if(type == 'c') {
        video1Url = courseVideoUrl;
    }
    currentVideo = 1;
    if(Hls.isSupported()) {
        hls1 = new Hls();
        hls1.loadSource(video1Url);
        hls1.attachMedia(video1);
        hls1.on(Hls.Events.MANIFEST_PARSED,function() {
            if (autoP) {
                video1.play();
                $(".jyd-videoCover").hide();
                $("#jyd-pauseState").removeClass("jyd-startIcon");
                $("#jyd-pauseState").addClass("jyd-pauseIcon");
                playState = 1;
            }
            else {
                video1.pause();
                playState = 0;
            }
        });
    }
    else {
        alert("请使用谷歌浏览器或360浏览器极速模式");
    }
    volumeState = 1;
    changeVoice(1);
    changeVideoWrapSize();


    // 缓冲进度
    // var timeRanges;
    // setInterval(function(){
    //     timeRanges = video1.buffered;
    //     console.log(timeRanges.end(0), '1');
    // }, '100');
    // setInterval(function(){
    //     timeRanges = video2.buffered;
    //     console.log(timeRanges.end(0), '2');
    // }, '100');
    // setInterval(function(){
    //     timeRanges = video3.buffered;
    //     console.log(timeRanges.end(0), '3');
    // }, '100');

    var video1Loading = 1;
    var video1MetaLoad = 0;

    function allLoad() {
        if (video1MetaLoad) {
            if (playState == 1) {
                $(".jyd-videoWaitingCover").hide();
                video1.play();
                video1Loading = 0;
                testNetSpeed();
            }
        }
    }

    video1.onloadedmetadata = function() {
        video1MetaLoad = 1;
        allLoad();
    };

    //测试缓冲进度
    function printBufferedInfo(sight) {
        var video1Buffered = video1.buffered;
        var logText = "";
        if (sight == 1) {
            logText = "画面缓冲中...";
            logText += "\n画面缓冲信息：";
            for (var i1 = 0; i1 < video1Buffered.length; i1 ++) {
                logText += "\n\t第" + (i1 + 1) + "段：" + video1Buffered.start(i1) + "-" + video1Buffered.end(i1);
            }
            console.log(logText);
        }
    }

    function consoleLogFlag() {
        console.log(video1Loading, 'video1Loading');
    }

    video1.onwaiting = function() {
        if (video1Loading == 0) {
            video1Loading = 1;
            // console.log(video1Loading + video2Loading + video3Loading, 'sum');
            // console.log('1loading');
            // consoleLogFlag();
            $(".jyd-videoWaitingCover").show();
        }
        else{
            return false
        }
    };

    function goOnPlay(){
        // console.log('goOn!');
        // consoleLogFlag();
        if (video1Loading == 0) {
            if (playState == 1) {
                // console.log('realyGoOn!');
                $(".jyd-videoWaitingCover").hide();
                video1.play();
            }
        }
    }

    video1.onplaying = function() {
        video1Loading = 0;
        goOnPlay();
    };

    //播放时间显示
    video1.addEventListener('canplay',function(){
        totalT = getTotalT(video1.duration);
        var videoDuration = formatTime(totalT);
        document.getElementById("jyd-timeUpdateAll").innerHTML = videoDuration;
        if (firstCanplayState) {
            video1.currentTime = startTime;
            if (enablePic == "yes" || enablePic == "simple") {
                getPicInfo();
            }
        }
        firstCanplayState = 0;
    });

    //剪辑时长校验
    function getTotalT(maxTime) {
        if (cutStartTime && cutStartTime > 0 && cutStartTime < maxTime) {
            if (cutEndTime && cutEndTime > cutStartTime && cutEndTime < maxTime) {
                startTime = cutStartTime;
                endTime = cutEndTime;
                return cutEndTime - cutStartTime;
            }
            else {
                startTime = cutStartTime;
                endTime = maxTime;
                return maxTime - cutStartTime;
            }
        }
        else {
            if (cutEndTime && cutEndTime > 0 && cutEndTime < maxTime) {
                startTime = 0;
                endTime = cutEndTime;
                return cutEndTime;
            }
            else {
                startTime = 0;
                endTime = maxTime;
                return maxTime;
            }
        }
    }

    video1.addEventListener('timeupdate',function() {
        var presentT = this.currentTime;
        // console.log(endTime, "endTime");
        // console.log(presentT, "presentT");
        if (presentT >= endTime) {
            video1.currentTime = startTime;
            if(playState == 1) {
                video1.pause();
                $("#jyd-pauseState").removeClass("jyd-pauseIcon");
                $("#jyd-pauseState").addClass("jyd-startIcon");
                playState = 0;
                $(".jyd-videoCover").show();
                $(".jyd-videoWaitingCover").hide();
            }
        }
        var videoCurrent = formatTime(presentT - startTime);
        document.getElementById("jyd-timeUpdateNow").innerHTML = videoCurrent;
        $(".jyd-processBarTimeInfo").text(videoCurrent);

        var percent = ( presentT - startTime ) / totalT * 100;
        document.getElementById("jyd-currentProcessBar").style.width = percent + '%';
    });

    function formatTime(t){
        var hh = parseInt(t / 3600);
        hh = hh < 10 ? '0' + hh : hh;
        var mm = parseInt(t % 3600 / 60);
        mm = mm < 10 ? '0' + mm : mm;
        var ss = parseInt(t % 60);
        ss = ss < 10 ? '0' + ss : ss;
        return hh + ':' + mm + ':' + ss;
    }

    //拖动进度条
    var mousePositionX = 0;
    var processBarWidth;
    var processBar = document.getElementById("jyd-processBar");
    var currentProcessBar = document.getElementById("jyd-currentProcessBar");
    processBar.onmousedown = function(event) {
        var that = this;
        $(".jyd-processBarTimeInfo").show();
        processBarWidth = parseInt($("#jyd-processBar").css("width"));
        var event = event || window.event;
        mousePositionX = event.clientX - this.offsetLeft;
        video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
        allLoad();
        currentProcessBar.style.width = mousePositionX + "px";
        document.onmousemove = function(event){
            var event = event || window.event;
            mousePositionX = event.clientX - that.offsetLeft;
            if(mousePositionX < 0){
                mousePositionX = 0;
            }
            else if(mousePositionX > processBarWidth){
                mousePositionX = processBarWidth;
            }
            video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
            allLoad();
            currentProcessBar.style.width = mousePositionX + "px";
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }
    };
    document.onmouseup = function(){
        $(".jyd-processBarTimeInfo").hide();
        document.onmousemove = null; //弹起鼠标不做任何操作
    };

    //拖动音量条
    var lastVolume = 1;
    var volumeMousePositionX = 0;
    var volumeBarWidth;
    var volumeBar = document.getElementById("jyd-volumeBar");
    var currentVolumeBar = document.getElementById("jyd-currentVolumeBar");
    volumeBar.onmousedown = function(event) {
        var that = this;
        volumeBarWidth = parseInt($("#jyd-volumeBar").css("width"));
        var event = event || window.event;
        volumeMousePositionX = event.clientX - this.offsetLeft;
        video1.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
        currentVolumeBar.style.width = volumeMousePositionX + "px";
        lastVolume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
        $("#jyd-muteBtn").removeClass("jyd-muteIcon");
        $("#jyd-muteBtn").addClass("jyd-unMuteIcon");
        volumeState = 1;
        unMute();
        document.onmousemove = function(event){
            var event = event || window.event;
            volumeMousePositionX = event.clientX - that.offsetLeft;
            if(volumeMousePositionX < 0){
                volumeMousePositionX = 0;
            }
            else if(volumeMousePositionX > volumeBarWidth){
                volumeMousePositionX = volumeBarWidth;
            }
            video1.volume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
            $("#jyd-muteBtn").removeClass("jyd-muteIcon");
            $("#jyd-muteBtn").addClass("jyd-unMuteIcon");
            currentVolumeBar.style.width = volumeMousePositionX + "px";
            lastVolume = Math.round((volumeMousePositionX / volumeBarWidth) * 100) / 100;
            volumeState = 1;
            unMute();
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }
    };

    //音源切换
    function changeVoice(theVoice){
        if (theVoice == 1) {
            video1.muted = false;
            currentAudio = 1;
        }
    }

    //画面比例自适应
    function changeVideoWrapSize(){
        // var video1WrapWidth = $(".jyd-leftWrap").css("width");
        // video1WrapWidth = parseInt(video1WrapWidth) * 9 / 16;
        // $(".jyd-leftWrap").css("height", video1WrapWidth);

        var videoMaxHeight = parseInt($("#jyd-video1Wrap").css("height"));
        $(".jyd-videoCover").css("height", videoMaxHeight);
        $(".jyd-videoPart").css("height", videoMaxHeight);
        $(".jyd-coverPlayBtn").css("margin-top", videoMaxHeight / 2 - 50);
        $(".jyd-coverWaitingBtn").css("margin-top", videoMaxHeight / 2 - 50);
    }
    window.onresize = changeVideoWrapSize();

    //播放及暂停
    $(".jyd-videoCover").click(function(){
        if(video1MetaLoad == 1) {
            video1.play();
            $(".jyd-videoCover").hide();
        }
        else if(video1MetaLoad < 1) {
            video1.pause();
            $(".jyd-videoCover").hide();
            $(".jyd-videoWaitingCover").show();
        }
        $("#jyd-pauseState").removeClass("jyd-startIcon");
        $("#jyd-pauseState").addClass("jyd-pauseIcon");
        playState = 1;
        testNetSpeed();
    });
    $("#jyd-pauseState").click(function(){
        if(playState == 1){
            video1.pause();
            $("#jyd-pauseState").removeClass("jyd-pauseIcon");
            $("#jyd-pauseState").addClass("jyd-startIcon");
            playState = 0
            $(".jyd-videoCover").show();
            $(".jyd-videoWaitingCover").hide();
        }
        else if(playState == 0){
            if(video1MetaLoad == 1) {
                video1.play();
                $(".jyd-videoCover").hide();
            }
            else if(video1MetaLoad < 1) {
                video1.pause();
                $(".jyd-videoCover").hide();
                $(".jyd-videoWaitingCover").show();
            }
            $("#jyd-pauseState").removeClass("jyd-startIcon");
            $("#jyd-pauseState").addClass("jyd-pauseIcon");
            playState = 1;
        }
    });

    //主画面切换
    // function delayFullScreen() { //画面线路切换时禁止全屏
    //     canFullScreen = 0;
    //     setTimeout(function(){
    //         canFullScreen = 1;
    //     }, 100);
    // }
    // $("#jyd-video1Wrap").click(function(){
    //     var currV = currentVideo;
    //     if (currV == 1) {
    //
    //     }
    //     else if (currV == 2) {
    //         delayFullScreen();
    //         currentVideo = 1;
    //         $("#jyd-video1Wrap").removeClass("jyd-rightWrap-doubleScreen");
    //         $("#jyd-video1Wrap").addClass("jyd-leftWrap-doubleScreen");
    //         $("#jyd-video2Wrap").removeClass("jyd-leftWrap-doubleScreen");
    //         $("#jyd-video2Wrap").addClass("jyd-rightWrap-doubleScreen");
    //         changeVoice(1);
    //     }
    // });
    // $("#jyd-video2Wrap").click(function(){
    //     var currV = currentVideo;
    //     if (currV == 1) {
    //         delayFullScreen();
    //         currentVideo = 2;
    //         $("#jyd-video1Wrap").removeClass("jyd-leftWrap-doubleScreen");
    //         $("#jyd-video1Wrap").addClass("jyd-rightWrap-doubleScreen");
    //         $("#jyd-video2Wrap").removeClass("jyd-rightWrap-doubleScreen");
    //         $("#jyd-video2Wrap").addClass("jyd-leftWrap-doubleScreen");
    //         changeVoice(2);
    //     }
    //     else if (currV == 2) {
    //
    //     }
    // });


    //全屏
    function fullScreen() {
        if (currentVideo == 1) {
            if (video1 .requestFullscreen) {
                video1 .requestFullscreen();
            } else if (video1 .mozRequestFullScreen) {
                video1 .mozRequestFullScreen();
            } else if (video1 .webkitRequestFullScreen) {
                video1 .webkitRequestFullScreen();
            }
            changeVoice(1);
        }
    }
    $("#jyd-fullScreen").click(function(){
        fullScreen();
    });
    $("#jyd-video1Wrap").dblclick(function(){
        if (currentVideo == 1 && canFullScreen == 1) {
            fullScreen();
        }
    });

    //打开静音
    function unMute() {
        var curR = currentAudio;
        changeVoice(curR);
    }

    //倍速播放
    $("#jyd-speed200").click(function(){
        video1.playbackRate = 2;
        $("#jyd-playSpeed").children("span").text("当前倍速：2.0X");
    });
    $("#jyd-speed150").click(function(){
        video1.playbackRate = 1.5;
        $("#jyd-playSpeed").children("span").text("当前倍速：1.5X");
    });
    $("#jyd-speed125").click(function(){
        video1.playbackRate = 1.25;
        $("#jyd-playSpeed").children("span").text("当前倍速：1.25X");
    });
    $("#jyd-speed100").click(function(){
        video1.playbackRate = 1;
        $("#jyd-playSpeed").children("span").text("当前倍速：1.0X");
    });
    $("#jyd-speed075").click(function(){
        video1.playbackRate = 0.75;
        $("#jyd-playSpeed").children("span").text("当前倍速：0.75X");
    });

    //静音
    $("#jyd-muteBtn").click(function(event){
        event.stopPropagation();
        if (volumeState == 1) {
            currentVolumeBar.style.width = '0px';
            video1.volume = 0;
            $("#jyd-muteBtn").removeClass("jyd-unMuteIcon");
            $("#jyd-muteBtn").addClass("jyd-muteIcon");
            volumeState = 0;
        }
        else if (volumeState == 0) {
            currentVolumeBar.style.width = lastVolume * 100 + 'px';
            video1.volume = lastVolume;
            $("#jyd-muteBtn").removeClass("jyd-muteIcon");
            $("#jyd-muteBtn").addClass("jyd-unMuteIcon");
            volumeState = 1;
            unMute();
        }
    });

    //页面交互效果
    $("#jyd-radioShift").click(function(event){
        event.stopPropagation();
        if ($(".jyd-radioShiftBox").css('display') == 'none'){
            $(".jyd-radioShiftBox").slideDown(200);
            $(".jyd-speedShiftBox").slideUp(200);
        }
        else {
            $(".jyd-radioShiftBox").slideUp(200);
        }
    });
    $("#jyd-playSpeed").click(function(event){
        event.stopPropagation();
        if ($(".jyd-speedShiftBox").css('display') == 'none'){
            $(".jyd-speedShiftBox").slideDown(200);
            $(".jyd-radioShiftBox").slideUp(200);
        }
        else {
            $(".jyd-speedShiftBox").slideUp(200);
        }
    });
    $(document).click(function(){
        $(".jyd-radioShiftBox").slideUp(200);
        $(".jyd-speedShiftBox").slideUp(200);
    });
    // 控件区鼠标悬浮交互
    // $(".jyd-videoPlayer").hover(function(){
    //     $(this).children(".jyd-videoControlBar").show();
    //     var nowVideoPartHeight = $(".jyd-videoPart").css("height");
    //     $(".jyd-videoPart").css("height", parseInt(nowVideoPartHeight) - 50 + "px");
    //     $(".jyd-rightBottomWrap").css("bottom", "-50px");
    // }, function(){
    //     $(this).children(".jyd-videoControlBar").hide();
    //     var newVideoPartHeight = $(".jyd-videoPart").css("height");
    //     $(".jyd-videoPart").css("height", parseInt(newVideoPartHeight) + 50 + "px");
    //     $(".jyd-rightBottomWrap").css("bottom", "0");
    // });

    //检测网速
    function testNetSpeed() {
        if (video1.buffered.length && theSize) {
            var timeRangesIndex = 0;
            var timeRanges = video1.buffered;
            for (var i = 0; i < timeRanges.length; i ++) {
                if (video1.currentTime > timeRanges.start(i) && video1.currentTime < timeRanges.end(i)) {
                    timeRangesIndex = i;
                }
            }
            var lastEndTime = timeRanges.end(timeRangesIndex);
            var bufferdTime = 0;
            // console.log(lastEndTime);
            setInterval(function () {
                timeRangesIndex = 0;
                timeRanges = video1.buffered;
                for (var i = 0; i < timeRanges.length; i ++) {
                    if (video1.currentTime > timeRanges.start(i) && video1.currentTime < timeRanges.end(i)) {
                        timeRangesIndex = i;
                    }
                }
                bufferdTime ++;
                // console.log(bufferdTime, 'bufferdTime');
                // console.log(timeRanges.end(timeRangesIndex), 'last');
                // console.log(lastEndTime, 'lastEndTime');
                if (timeRanges.end(timeRangesIndex) > lastEndTime) {
                    var bufferdChange = timeRanges.end(timeRangesIndex) - lastEndTime;
                    var bufferdTrueChange = (bufferdChange / totalT) * theSize;
                    var bufferSpeed = Math.round(bufferdTrueChange / bufferdTime);
                    if (bufferSpeed > 1024 && bufferSpeed < 5000) {
                        bufferSpeedM = Math.round((bufferSpeed / 1024) * 100) / 100;
                        document.getElementById("jyd-coverWaitingBufferSpeed").innerText = bufferSpeedM + 'MB/s';
                    }
                    else if (bufferSpeed > 5000) {
                        bufferSpeedM = Math.round((bufferSpeed / 1024) * 100) / 100;
                        document.getElementById("jyd-coverWaitingBufferSpeed").innerText = '大于5MB/s';
                    }
                    else if (bufferSpeed < 1024 && bufferSpeed > 0) {
                        document.getElementById("jyd-coverWaitingBufferSpeed").innerText = bufferSpeed + 'kB/s';
                    }
                    // console.log(bufferSpeed + 'kB/s');
                    lastEndTime = timeRanges.end(timeRangesIndex);
                    bufferdTime = 0;
                }
            }, 1000)
        }
    }

    //获取打点数据
    function getPicInfo() {
        $.ajax({
            method: 'get',
            url: getPicInfoUrl,
            data: {
                // method: 'getPicInfo',
                id: getPicInfoId
            },
            success: function (data) {
                var picInfo = eval('(' + data + ')').result;
                if (enablePic == "yes") {
                    newSetPicInfo(picInfo);
                }
                else if (enablePic == "simple") {
                    setPicInfo(picInfo);
                }
            },
            error: function () {
                alert("获取打点信息失败");
                // var picInfo = [{"time":16,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/16.jpg&g=16.jpg&yspf=E:/Root","name":"机械设计总论"},{"time":35,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/35.jpg&g=35.jpg&yspf=E:/Root","name":"第一章总论"},{"time":54,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/54.jpg&g=54.jpg&yspf=E:/Root","name":"1.1机械设计课程的性质与任务"},{"time":56,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/56.jpg&g=56.jpg&yspf=E:/Root","name":"1.1.1本课程的研究对象"},{"time":57,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/57.jpg&g=57.jpg&yspf=E:/Root","name":"1.1机械设计课程的性质与任务"},{"time":63,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/63.jpg&g=63.jpg&yspf=E:/Root","name":"1.1.1本课程的研究对象"},{"time":87,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/87.jpg&g=87.jpg&yspf=E:/Root","name":"机械零件的分类\t专用零件:"},{"time":114,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/114.jpg&g=114.jpg&yspf=E:/Root","name":"学习本课程的注意事项\t1）正确对......"},{"time":169,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/169.jpg&g=169.jpg&yspf=E:/Root","name":"需求调研"},{"time":214,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/214.jpg&g=214.jpg&yspf=E:/Root","name":"\t\t\t1.2机械设计的一般步骤1.2.2......."},{"time":235,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/235.jpg&g=235.jpg&yspf=E:/Root","name":"1.2机械设计图"},{"time":269,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/269.jpg&g=269.jpg&yspf=E:/Root","name":"lim\tSt"},{"time":286,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/286.jpg&g=286.jpg&yspf=E:/Root","name":"1.机械零件的计算准则\t3、寿命准......"},{"time":348,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/348.jpg&g=348.jpg&yspf=E:/Root","name":"1.4机械设计的最新进展\t干涉检查"},{"time":354,"pic":"http://223.72.155.19:88/ve/download.shtml?p=qxktRpShot&parentDir=qxktRpShot&f=20201027245045/4AEFC283DA334473BDFE6A51A831BCDA/354.jpg&g=354.jpg&yspf=E:/Root","name":"1.4机械设计的最新进展\t底座网格......"}];
                // if (enablePic == "yes") {
                //     newSetPicInfo(picInfo);
                // }
                // else if (enablePic == "simple") {
                //     setPicInfo(picInfo);
                // }
            }
        })
    }

    //加载打点数据
    function setPicInfo(picInfo) {
        if (picInfo) {
            for (var i = 0; i < picInfo.length; i ++) {
                // console.log(picInfo[i].name, 'name');
                // console.log(picInfo[i].time, 'time');
                if (picInfo[i].time > startTime && picInfo[i].time < endTime) {
                    var pointLeft = Math.round((( picInfo[i].time - startTime ) / totalT ) * 100);
                    var insertPointDiv = "" +
                        "            <div class=\"jyd-picPoint\" style=\"left:" + pointLeft + "%\">" +
                        "                <div class=\"jyd-picPointImg\">" +
                        "                    <img src=\"" + picInfo[i].pic + "\" />" +
                        "                    <div class=\"jyd-picPointText\">" + picInfo[i].name + "</div>" +
                        "                </div>" +
                        "            </div>";
                    $("#jyd-processBar").append(insertPointDiv);
                }
            }
        }
    }

    //新打点
    function newSetPicInfo(picInfo) {
        if (picInfo) {
            for (var i = 0; i < picInfo.length; i ++) {
                if (picInfo[i].time > startTime && picInfo[i].time < endTime) {
                    var pointLeft = Math.round((( picInfo[i].time - startTime ) / totalT ) * 100);
                    var insertPointDiv = "" +
                        "            <div class=\"jyd-picPoint\" id=\"jyd-picPointIndex_" + i + "\" style=\"left:" + pointLeft + "%\">" +
                        "            </div>";
                    $("#jyd-processBar").append(insertPointDiv);
                    var insertPicInfoDiv = "" +
                        "            <div class=\"jyd-newPicInfoItem\" id=\"jyd-newPicInfoItem_" + picInfo[i].time + "\">" +
                        "               <img src=\"" + picInfo[i].pic + "\" draggable=\"false\" />" +
                        "               <div class=\"jyd-newPicInfoText\">" + picInfo[i].name + "</div>" +
                        "            </div>";
                    $(".jyd-newPicInnerBox").append(insertPicInfoDiv);
                }
            }
        }
        var dragMouseTruePositionX = 0;
        var downMouseTruePositionX = 0;
        $(".jyd-newPicInfoItem").click(function(){
            console.log(dragMouseTruePositionX - downMouseTruePositionX, 'move');
            if (dragMouseTruePositionX - downMouseTruePositionX < 3 && dragMouseTruePositionX - downMouseTruePositionX > -3) {
                var evalTime = $(this).attr("id").split("_")[1];
                video1.currentTime = evalTime;
                video2.currentTime = evalTime;
                video3.currentTime = evalTime;
            }
            dragMouseTruePositionX = 0;
            downMouseTruePositionX = 0;
        });
        $(".jyd-picPoint").hover(function() {
            var picPointIndex = $(this).attr("id").split("_")[1];
            $(".jyd-newPicInfoItem").eq(picPointIndex).addClass("onselectPic");
            goPicPointPosition(picPointIndex);
        },function () {
            var picPointIndex = $(this).attr("id").split("_")[1];
            $(".jyd-newPicInfoItem").eq(picPointIndex).removeClass("onselectPic");
        });
        var dragMousePositionX = 0;
        var downMousePositionX = 0;
        var theScrl;
        var dragBox = document.getElementById("jyd-newPicMiddleBox");
        dragBox.onmousedown = function(event) {
            downMousePositionX = event.offsetX;
            downMouseTruePositionX = event.clientX;
            dragMouseTruePositionX = event.clientX;
            theScrl = $(".jyd-newPicMiddleBox").scrollLeft();
            // console.log(downMousePositionX, 'downMousePositionX');
            dragBox.onmousemove = function(event) {
                dragMousePositionX = event.offsetX;
                dragMouseTruePositionX = event.clientX;
                // console.log(dragMousePositionX, 'dragMousePositionX');
                theScrl = theScrl - (dragMousePositionX - downMousePositionX);
                $(".jyd-newPicMiddleBox").scrollLeft(theScrl);
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            }
        };
        document.onmouseup = function(){
            $(".jyd-processBarTimeInfo").hide();
            dragBox.onmousemove = null; //弹起鼠标不做任何操作
            document.onmousemove = null; //弹起鼠标不做任何操作
        };
    }

    var movepx = option.movepx ? option.movepx : 3;
    var scrl;
    var holdRight;
    var holdLeft;

    //单击滚页按钮
    $(".jyd-newPicRightBtn").click(function(){
        scrl = $(".jyd-newPicMiddleBox").scrollLeft();
        scrl += movepx;
        $(".jyd-newPicMiddleBox").scrollLeft(scrl);

    });
    $(".jyd-newPicLeftBtn").click(function(){
        scrl = $(".jyd-newPicMiddleBox").scrollLeft();
        scrl -= movepx;
        $(".jyd-newPicMiddleBox").scrollLeft(scrl);

    });
    //按住滚页按钮
    $(".jyd-newPicRightBtn").mousedown(function(e){
        if (e.which == 1)
        {
            scrl = $(".jyd-newPicMiddleBox").scrollLeft();
            holdRight = setInterval(function() {
                scrl += movepx;
                $(".jyd-newPicMiddleBox").scrollLeft(scrl);
            }, 1);
        }
        else if (e.which == 2 || e.which == 3)
        {
            clearInterval(holdRight);
        }
    });
    $(".jyd-newPicRightBtn").mouseup(function(){
        clearInterval(holdRight);
    });
    $(".jyd-newPicRightBtn").mousemove(function(){
        clearInterval(holdRight);
    });
    $(".jyd-newPicLeftBtn").mousedown(function(e){
        if (e.which == 1)
        {
            scrl = $(".jyd-newPicMiddleBox").scrollLeft();
            holdLeft = setInterval(function() {
                scrl -= movepx;
                $(".jyd-newPicMiddleBox").scrollLeft(scrl);
            }, 1);
        }
        else if (e.which == 2 || e.which == 3)
        {
            clearInterval(holdLeft);
        }
    });
    $(".jyd-newPicLeftBtn").mouseup(function() {
        clearInterval(holdLeft);
    });
    $(".jyd-newPicLeftBtn").mousemove(function() {
        clearInterval(holdLeft);
    });

    //打点图片定位
    function goPicPointPosition(picPointIndex) {
        $(".jyd-newPicMiddleBox").stop();
        var pointOffsetX = $(".jyd-newPicInfoItem").eq(picPointIndex).offset().left;
        $(".jyd-newPicMiddleBox").animate({scrollLeft: pointOffsetX}, 1000);
    }

    //对外暴露方法
    return {
        //暂停播放
        stopVideo: function () {
            if(playState == 1) {
                video1.pause();
                $("#jyd-pauseState").removeClass("jyd-pauseIcon");
                $("#jyd-pauseState").addClass("jyd-startIcon");
                playState = 0;
                $(".jyd-videoCover").show();
                $(".jyd-videoWaitingCover").hide();
            }
        },
        //继续播放
        playVideo: function () {
            if(video1MetaLoad == 1) {
                video1.play();
                $(".jyd-videoCover").hide();
            }
            else if(video1MetaLoad < 1) {
                video1.pause();
                $(".jyd-videoCover").hide();
                $(".jyd-videoWaitingCover").show();
            }
            $("#jyd-pauseState").removeClass("jyd-startIcon");
            $("#jyd-pauseState").addClass("jyd-pauseIcon");
            playState = 1;
        },
        //获取播放时间点
        playCurrentTime: function () {
            var theCurrentTime = Math.floor(video1.currentTime);
            return theCurrentTime;
        },
        //跳转到播放时间点
        playStartPoint: function (evalTime) {
            video1.currentTime = evalTime;
        },
        //开启剪辑功能
        startCutting: function () {
            if(playState == 1) {
                video1.pause();
                $("#jyd-pauseState").removeClass("jyd-pauseIcon");
                $("#jyd-pauseState").addClass("jyd-startIcon");
                playState = 0;
                $(".jyd-videoCover").show();
                $(".jyd-videoWaitingCover").hide();
            }
            $("#jyd-currentProcessBar").hide();
            $(".jyd-picPoint").hide();
            $(".jyd-radioShift").hide();
            $(".jyd-playSpeed").hide();
            $(".jyd-processBar").css("width", "calc(100% - 400px)");
            var insertCuttingBar = "" +
                "            <div class=\"jyd-picCuttingBar\" id=\"jyd-picCuttingBarStart\" style=\"left:0%\">" +
                "               <div class=\"jyd-picCuttingHandleUp\"></div>" +
                "            </div>" +
                "            <div class=\"jyd-picCuttingBar\" id=\"jyd-picCuttingBarEnd\" style=\"left:100%\">" +
                "               <div class=\"jyd-picCuttingHandleDown\"></div>" +
                "            </div>";
            $("#jyd-processBar").append(insertCuttingBar);
            $(".jyd-picCuttingBar").mousedown(function(event){
                event.stopPropagation();
            });
            processBarWidth = parseInt($("#jyd-processBar").css("width"));
            var startPosition = 0;
            var endPostion = processBarWidth;
            mousePositionX = 0;
            var startBar = document.getElementById("jyd-picCuttingBarStart");
            startBar.onmousedown = function(event) {
                var that = document.getElementById("jyd-processBar");
                var event = event || window.event;
                document.onmousemove = function(event){
                    var event = event || window.event;
                    mousePositionX = event.clientX - that.offsetLeft;
                    if(mousePositionX < 0){
                        mousePositionX = 0;
                    }
                    else if(mousePositionX > endPostion){
                        mousePositionX = endPostion;
                    }
                    video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    allLoad();
                    startBar.style.left = mousePositionX + "px";
                    startPosition = mousePositionX;
                    cuttingStartTime = totalT * startPosition / processBarWidth + parseInt(startTime);
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                }
            }
            var endBar = document.getElementById("jyd-picCuttingBarEnd");
            endBar.onmousedown = function(event) {
                var that = document.getElementById("jyd-processBar");
                var event = event || window.event;
                document.onmousemove = function(event){
                    var event = event || window.event;
                    mousePositionX = event.clientX - that.offsetLeft;
                    if(mousePositionX < startPosition){
                        mousePositionX = startPosition;
                    }
                    else if(mousePositionX > processBarWidth){
                        mousePositionX = processBarWidth;
                    }
                    video1.currentTime = totalT * mousePositionX / processBarWidth + parseInt(startTime);
                    allLoad();
                    endBar.style.left = mousePositionX + "px";
                    endPostion = mousePositionX;
                    cuttingEndTime = totalT * endPostion / processBarWidth + parseInt(startTime);
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                }
            }
        },
        //取消剪辑功能
        cancelCutting: function () {
            $("#jyd-currentProcessBar").show();
            $(".jyd-picPoint").show();
            $(".jyd-picCuttingBar").remove();
        },
        //完成剪辑功能
        completeCutting: function() {
            var cuttingInfo = {
                theStartTime: cuttingStartTime,
                theEndTime: cuttingEndTime
            };
            console.log(cuttingInfo);
            $("#jyd-currentProcessBar").show();
            $(".jyd-picPoint").show();
            $(".jyd-picCuttingBar").remove();
        },
        //获取剪辑开始时间
        getCuttingStartTime: function() {
            if (cuttingStartTime) {
                return Math.round(cuttingStartTime);
            }
            else {
                return 0;
            }
        },
        //获取剪辑结束时间
        getCuttingEndTime: function() {
            if (cuttingEndTime) {
                return Math.round(cuttingEndTime);
            }
            else {
                return totalT;
            }
        },
        //获取缓冲信息
        getBufferedInfo: function() {
            var video1Buffered = video1.buffered;
            var logText = "";
            logText += "当前缓冲信息：";
            logText += "\n\t画面加载时段：";
            for (var i1 = 0; i1 < video1Buffered.length; i1 ++) {
                logText += "\n\t\t第" + (i1 + 1) + "段：" + video1Buffered.start(i1) + "-" + video1Buffered.end(i1);
            }
            console.log(logText);
        },
        //开启自动获取缓冲信息
        getBufferedInfoAutoOpen: function() {
            video1.onprogress = function() {
                printBufferedInfo(1);
            };
        },
        //关闭自动获取缓冲信息
        getBufferedInfoAutoClose: function() {
            video1.onprogress = null;
        }
    }
}
