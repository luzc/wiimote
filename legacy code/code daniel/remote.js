(function(_global) {
    // Set global variables
    var welcome = document.getElementById('welcome');
    var play = document.getElementById('play');
    var frm_search = document.getElementById('frm_search');
    var txt_search = document.getElementById('txt_search');
    var btn_search = document.getElementById('btn_search');
    var videos = document.getElementById('videos');
    var loading = new Image();
    loading.src = 'images/loading.gif';
    
    function sendData(data) {
        data.id = window.location.hash.substring(1);
        var request = new XMLHttpRequest();
        var url = 'background.php?';
        var args = '';
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                args += key + '=' + encodeURIComponent(data[key]) + '&';
            }
        }
        
        request.onload = function(event) {
            if (this.status != 200) {
                alert('Trouble connecting. Please try again.');
            }
            /*
            if (this.status == 200 && this.responseXML) {
                response = this.responseXML;
            } else {
                console.error('Remote video player: Can\'t connect to the display page.');
                alert('You don\'t seem to be connected to a TV. Please load the TV page first.');
                response = false;
            }
            */
        };
  
        request.open('GET', url + args);        
        request.send();
        
        // Show video as playing if necessary
        if (data.videoId) {
            var allVideos = document.querySelectorAll('#videos li');
            for (var i = 0, len = allVideos.length; i < len; i++) {
                var video = allVideos[i];
                if (video.id === data.videoId) {
                    video.className = 'selected';
                } else {
                    video.className = '';
                }
            }
        }
    }    
    
    function showResults(xml) {
        play.innerHTML = 'Results: ' + xml;
    }
    
    function getVideos(query, callback) {
        btn_search.innerHTML = '<img src="images/loading.gif">';
        if (!query) {
            var url = 'https://gdata.youtube.com/feeds/api/standardfeeds/on_the_web?start-index=1&max-results=20&v=2&alt=json-in-script&format=5&callback=' + callback;
        } else {
            var url = 'http://gdata.youtube.com/feeds/api/videos?q=' + encodeURIComponent(query) + '&start-index=1&max-results=20&v=2&alt=json-in-script&callback=' + callback + '&format=5';
        }
        
        var jsonScript = document.createElement('script');
        jsonScript.src = url;
        document.body.appendChild(jsonScript);
    }
    
    frm_search.onsubmit = function(event) {
        event.preventDefault();
        var query = txt_search.value;
        if (query !== '') {
            getVideos(query, 'showMyVideos');
        }
        return false;
    };
    
    _global.addEventListener('DOMContentLoaded', function() {
        // Reset the user data on the server
        sendData({status: 'reset'});
        getVideos(false, 'showMyVideos');
    }, false);
    
    _global.showMyVideos = function(data) {
        videos.innerHTML = '';
        var entries = data.feed.entry || [];
        var ul = document.createElement('ul');

        var html = ['<ul>'];
        for (var i = 0; i < entries.length; i++) {
            var video = entries[i];
            var videoTitle = video.title.$t;
            var videoImg = video.media$group.media$thumbnail[0].url;
            var videoAuthor = video.author[0].name.$t;
            var videoId = video.id.$t.split(':')[3];
            
            var li = document.createElement('li');
            li.id = videoId;
            li.innerHTML = '<div class="videoImg"><img src="' + videoImg + '"></div><div class="videoDetails"><div class="videoTitle">' + videoTitle + '</div><div class="videoAuthor">by ' + videoAuthor + '</div></div>';
            li.onclick = function(event) {
                sendData({status: 'play', videoId: event.currentTarget.id});
            };
            ul.appendChild(li);
        }
        videos.appendChild(ul);
        
        btn_search.innerHTML = '<img src="images/search.png">';
        
        (window.innerHeight < 600) && !location.hash && setTimeout(function () {
          if (!pageYOffset) window.scrollTo(0, 1);
        }, 200);
    }
})(this);
