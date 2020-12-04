/*  Table of Contents 
01. MENU ACTIVATION
02. MOBILE NAVIGATION ACTIVATION
03. FLEXSLIDER LANDING PAGE
04. SCROLL TO TOP BUTTON
05. Registration Page On/Off Clickable Items
*/

jQuery(document).ready(function ($) {
    "use strict";

    /*
=============================================== 01. MENU ACTIVATION  ===============================================
*/
    jQuery(
        "nav#site-navigation-pro ul.sf-menu, nav#sidebar-nav ul.sf-menu"
    ).superfish({
        popUpSelector: "ul.sub-menu, .sf-mega", // within menu context
        delay: 200, // one second delay on mouseout
        speed: 0, // faster \ speed
        speedOut: 200, // speed of the closing animation
        animation: { opacity: "show" }, // animation out
        animationOut: { opacity: "hide" }, // adnimation in
        cssArrows: true, // set to false
        autoArrows: true, // disable generation of arrow mark-up
        disableHI: true,
    });

    /* Sticky Landing Page Header */
    $("header.sticky-header").scrollToFixed({
        minWidth: 768,
    });

    /* Remove Fixed Heading on Mobile */
    $(window)
        .resize(function () {
            var width_progression = $(document).width();
            if (width_progression < 768) {
                $("header.sticky-header").trigger("detach.ScrollToFixed");
            }
        })
        .resize();

    /* Sitcky Video Sidebar */
    $("nav#sidebar-nav.sticky-sidebar-js").hcSticky({
        top: 0,
    });

    /*
=============================================== 02. MOBILE NAVIGATION ACTIVATION  ===============================================
*/
    $("#mobile-bars-icon-pro").click(function (e) {
        e.preventDefault();
        $("#mobile-navigation-pro").slideToggle(350);
        $("header#masthead-pro").toggleClass("active-mobile-icon-pro");
        $("header#videohead-pro").toggleClass("active-mobile-icon-pro");
    });

    $("ul#mobile-menu-pro").slimmenu({
        resizeWidth: "90000",
        collapserTitle: "Menu",
        easingEffect: "easeInOutQuint",
        animSpeed: 350,
        indentChildren: false,
        childrenIndenter: "- ",
    });

    /*
=============================================== 03. FLEXSLIDER LANDING PAGE  ===============================================
*/
    $(".progression-studios-slider").flexslider({
        slideshow: true /* Autoplay True/False */,
        slideshowSpeed: 8000 /* Autoplay Speed */,
        animation: "fade" /* Slideshow Transition Animation */,
        animationSpeed: 800 /* Slide Transition Speed */,
        directionNav: true /* Left/Right Navigation True/False */,
        controlNav: true /* Bullet Navigaion True/False */,
        prevText: "",
        nextText: "",
    });

    /*
=============================================== 04. SCROLL TO TOP BUTTON  ===============================================
*/

    // browser window scroll (in pixels) after which the "back to top" link is shown
    var offset = 150,
        //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
        offset_opacity = 1200,
        //duration of the top scrolling animation (in ms)
        scroll_top_duration = 700,
        //grab the "back to top" link
        $back_to_top = $("#pro-scroll-top");

    //hide or show the "back to top" link
    $(window).scroll(function () {
        $(this).scrollTop() > offset
            ? $back_to_top.addClass("cd-is-visible")
            : $back_to_top.removeClass("cd-is-visible cd-fade-out");
        if ($(this).scrollTop() > offset_opacity) {
            $back_to_top.addClass("cd-fade-out");
        }
    });

    //smooth scroll to top
    $back_to_top.on("click", function (event) {
        event.preventDefault();
        $("body,html").animate({ scrollTop: 0 }, scroll_top_duration);
    });

    /*
=============================================== 05. Registration Page On/Off Clickable Items  ===============================================
*/

    $("ul.registration-invite-friends-list li").click(function () {
        $(this)
            .closest("ul.registration-invite-friends-list li")
            .toggleClass("active");
    });

    $("ul.registration-genres-choice li").click(function () {
        $(this)
            .closest("ul.registration-genres-choice li")
            .toggleClass("active");
    });

    //webkitURL is deprecated but nevertheless
    URL = window.URL || window.webkitURL;

    var gumStream; //stream from getUserMedia()
    var rec; //Recorder.js object
    var input; //MediaStreamAudioSourceNode we'll be recording

    // shim for AudioContext when it's not avb.
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext; //audio context to help us record

    function utf8Decode(utf8String) {
        if (typeof utf8String != "string")
            throw new TypeError("parameter ‘utf8String’ is not a string");
        // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
        const unicodeString = utf8String
            .replace(
                /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
                function (c) {
                    // (note parentheses for precedence)
                    var cc =
                        ((c.charCodeAt(0) & 0x0f) << 12) |
                        ((c.charCodeAt(1) & 0x3f) << 6) |
                        (c.charCodeAt(2) & 0x3f);
                    return String.fromCharCode(cc);
                }
            )
            .replace(
                /[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
                function (c) {
                    // (note parentheses for precedence)
                    var cc =
                        ((c.charCodeAt(0) & 0x1f) << 6) |
                        (c.charCodeAt(1) & 0x3f);
                    return String.fromCharCode(cc);
                }
            );
        return unicodeString;
    }

    function createDownloadLink(blob) {
        var url = URL.createObjectURL(blob);

        //name of .wav file to use during upload and download (without extendion)
        var filename = new Date().getTime();
        var audioId = "";
        var access_token = "";

        var xhr = new XMLHttpRequest();
        xhr.onload = function (e) {
            if (this.readyState === 4) {
                console.log("Server returned: ", e.target.responseText);

                let parsed_json = JSON.parse(e.target.responseText);
                audioId = parsed_json["id"];
                access_token = parsed_json["key"];
                console.log(audioId);
                console.log(access_token);

                let socket = new WebSocket(
                    "wss://vaisapis.vais.vn/analytic/v1/monitor/ws/audio-status?audio_id=" +
                        audioId
                );

                socket.onopen = function (e) {
                    console.log("[open] Connection established");
                };

                socket.onmessage = function (event) {
                    alert(`[message] Data received from server: ${event.data}`);
                };

                socket.onclose = function (event) {
                    if (event.wasClean) {
                        console.log(
                            `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
                        );

                        var xhr = new XMLHttpRequest();
                        xhr.withCredentials = false;

                        xhr.addEventListener("readystatechange", function () {
                            if (this.readyState === 4) {
                                console.log(this.responseText);
                                let parsed_data = JSON.parse(this.responseText);
                                var str = utf8Decode(parsed_data.data[0].text);
                                console.log(str);
                            }
                        });

                        xhr.open(
                            "GET",
                            "https://vaisapis.vais.vn/analytic/v1/texts?audio_id=" +
                                audioId
                        );
                        xhr.setRequestHeader(
                            "Api-key",
                            "2ff05476-352b-11eb-bf66-0242ac120004"
                        );
                        // xhr.setRequestHeader(
                        //     "token",
                        //     "5fc87c34b4e02536e1899e31"
                        // );

                        xhr.send();
                    } else {
                        // e.g. server process killed or network down
                        // event.code is usually 1006 in this case
                        console.log("[close] Connection died");
                    }
                };

                socket.onerror = function (error) {
                    console.log(`[error] ${error.message}`);
                };
            }
        };
        var fd = new FormData();
        fd.append("audio_data", blob, filename);
        xhr.open("POST", "upload.php", true);
        xhr.send(fd);
    }

    $("#micro-button").on("click", function () {
        var icon = $(this).find("i");
        if (icon.hasClass("fa-microphone")) {
            var constraints = { audio: true, video: false };
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then(function (stream) {
                    console.log(
                        "getUserMedia() success, stream created, initializing Recorder.js ..."
                    );
                    audioContext = new AudioContext();

                    /*  assign to gumStream for later use  */
                    gumStream = stream;

                    /* use the stream */
                    input = audioContext.createMediaStreamSource(stream);

                    /* 
					Create the Recorder object and configure to record mono sound (1 channel)
					Recording 2 channels  will double the file size
				*/
                    rec = new Recorder(input, { numChannels: 1 });

                    //start the recording process
                    rec.record();
                })
                .catch(function (err) {
                    //enable the record button if getUserMedia() fails
                    $(this).find("i").toggleClass("fa-microphone fa-stop");
                    return;
                });
        } else {
            rec.stop();

            //stop microphone access
            gumStream.getAudioTracks()[0].stop();
            rec.exportWAV(createDownloadLink);
        }

        $(this).find("i").toggleClass("fa-microphone fa-stop");
        // if ($(this).find("i").text() == "add") {
        //     $(this).find("i").text("remove");
        // } else {
        //     $(this).find("i").text("add");
        // }
    });
});
