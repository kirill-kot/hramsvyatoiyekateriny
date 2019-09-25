$(document).ready(function() {
  $('.main-slider').slick({
    infinite: true,
    arrows: true,
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 300
  });

  // $('.news-slider').slick({
  //   infinite: false,
  //   arrows: false,
  //   dots: true,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   speed: 300
  // });

  // $('.ekaterina-slider').slick({
  //   infinite: false,
  //   arrows: true,
  //   dots: true,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   speed: 300
  // });


  var videos = document.querySelectorAll('video');
  var behavior = document.querySelector('#behavior');

  if (location.search === '?enabled=false') {
  	behavior.innerHTML = '(module disabled everywhere via <code>?enabled=false</code>';
  } else if (location.search === '?enabled=true') {
  	enableVideos(true);
  	behavior.innerHTML = '(module enabled everywhere (whether it’s necessary or not) via <code>?enabled=true</code>)';
  } else {
  	enableVideos();
  }

  function enableButtons(video) {
  	var playBtn = video.parentNode.querySelector('.play');
  	var fullscreenButton = video.parentNode.querySelector('.fullscreen');

  	if (playBtn) {
  		playBtn.addEventListener('click', function () {
  			if (video.paused) {
  				video.play();
  			} else {
  				video.pause();
  			}
  		});
  	}

  	if (fullscreenButton) {
  		fullscreenButton.addEventListener('click', function () {
  			video.webkitEnterFullScreen();
  		});
  	}
  }

  // debug events
  function debugEvents(video) {
  	[
  		'loadstart',
  		'progress',
  		'suspend',
  		'abort',
  		'error',
  		'emptied',
  		'stalled',
  		'loadedmetadata',
  		'loadeddata',
  		'canplay',
  		'canplaythrough',
  		'playing', // fake event
  		'waiting',
  		'seeking',
  		'seeked',
  		'ended',
  	// 'durationchange',
  		'timeupdate',
  		'play', // fake event
  		'pause', // fake event
  	// 'ratechange',
  	// 'resize',
  	// 'volumechange',
  		'webkitbeginfullscreen',
  		'webkitendfullscreen',
  	].forEach(function (event) {
  		video.addEventListener(event, function () {
  			// console.info('@', event);
  		});
  	});
  }

  function enableVideos(everywhere) {
  	for (var i = 0; i < videos.length; i++) {
  		window.enableInlineVideo(videos[i], {everywhere: everywhere});
  		enableButtons(videos[i]);
  		debugEvents(videos[i]);
  	}
  }

    function getOS() {
        var userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null;

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        }

        return os;
    }
    if(getOS() === 'Android'){
      $('.video-container-desktop').attr('src', $('.video-container-desktop').attr('data-src-android'));
    }
    if(getOS() === 'iOS'){
        $('.video-container-desktop').attr('src', $('.video-container-desktop').attr('data-src-ios'));
    }
    else {
        $('.video-container-desktop').attr('src', $('.video-container-desktop').attr('data-src-pc'));
    }


    function loadPostMobile(post_id){
        str = '&post_id=' + post_id + '&action=mobile_posts_ajax';
        $.ajax({
            type: "POST",
            dataType: 'html',
            url: ajax_more.ajaxurl,
            data: str,
            beforeSend: function(){
                console.log(str);
            },
            success: function(data){
                // if($(data).length){
                $('.main-slider').empty();
                $('.post_holder').empty();
                $('.mobile_menu').find('.post_holder_10').append(data);
                // }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + " :: " + textStatus + " :: " + errorThrown);
            }
        });
        return false;
    }

    function loadPageMobile(page_id){
        str = '&page_id=' + page_id + '&action=mobile_load_ajax';
        console.log(str);
        $.ajax({
            type: "POST",
            dataType: 'html',
            url: ajax_more.ajaxurl,
            data: str,
            beforeSend: function(){},
            success: function(data){
                    $('.main-slider').empty();
                    $('.post_holder').empty();
                    $('.mobile_menu').find('.post_holder_' + page_id).append(data);
                    if(page_id === 10){
                        $('.ajax_single_news').on('click', function(y){
                            y.preventDefault();
                            loadPostMobile($(this).data('post-id'));
                        });
                    }
           },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + " :: " + textStatus + " :: " + errorThrown);
            }
        });
        return false;
    }

    if($(window).width() < 1024){
    $(window).scroll(function(){
        var header = $('#header'),
            scroll = $(window).scrollTop();

        if (scroll >= 200) header.addClass('fixed');
        else header.removeClass('fixed');
    });
        $('.mobile_menu .menuitem').on('click', function(e){
            e.preventDefault();
            $('.mobile_menu li').each(function(){
                $(this).removeClass('active');
            });
            $(this).parent().addClass('active');
            loadPageMobile($(this).data('id'));
        });

        $('.anchor_link').click(function(e) {
            e.preventDefault();
            var id  = $(this).attr('href'),
                top = $(id).offset().top - 200;
            var kuda = $('#hist3').scrollTop() + top;
            $('#hist3').animate({scrollTop: kuda}, 1000);
        });
    } else {
        $('#mobile').empty();

        $('.anchor_link').click(function(e) {
            e.preventDefault();
            var id  = $(this).attr('href'),
                top = $(id).offset().top - 30;

            $('body,html').animate({scrollTop: top}, 1000);
        });
    }



});
