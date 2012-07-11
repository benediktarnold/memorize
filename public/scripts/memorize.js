function arrayShuffle() {
    var tmp, rand;
    for (var i = 0; i < this.length; i++) {
        rand = Math.floor(Math.random() * this.length);
        tmp = this[i];
        this[i] = this[rand];
        this[rand] = tmp;
    }
}

Array.prototype.shuffle = arrayShuffle;

var count = 0;

$(document).ready(function() {
    var socket = io.connect('http://localhost');
    socket.on('news', function(data) {
        console.log(data);
        socket.emit('my other event', {
            my: 'data'
        });
    });
    $.getJSON('http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?&format=json', function(data) {
        //var copy = data.items.slice();
        var pictures = [];
        console.log(data.items);
        for (i = 0; i < 8; i++) {
            var pic = {
                id: i,
                url: data.items[i].media.m
            }
            pictures.push(pic);
            pictures.push(pic);
        }
        pictures.shuffle();
        var picture = 0;
        for (i = 0; i < 4; i++) {
            //var row = $('<div class="row-fluid"></div>');
            //$('#memory').append(row);
            for (j = 0; j < 4; j++) {
                $('#memory').append('<div id="square_' + picture + '" class="cont card" data-key="' + pictures[picture].id + '">' + '<div class="square front"></div>' + '<div class="square back" style="background-image:url(' + pictures[picture].url + ')"></div>' + '</div>');
                console.log(picture);
                picture++;
            }
        }

        $('.cont').click(function(e) {
            var flippedContainers = $('.flip');
            if ($(this).hasClass('flip')) {
                $(this).removeClass('flip');
            } else if (flippedContainers.length < 2) {
                $(this).addClass('flip');
                socket.emit('flip', {
                    key: $(this).attr('data-key')
                });
            }

            flippedContainers = $('.flip');
            if (flippedContainers.length == 2) {
                if ($(flippedContainers[0]).attr('data-key') == $(flippedContainers[1]).attr('data-key')) {
                    window.setTimeout(function() {
                        $(flippedContainers).removeClass('cont').children().hide();
                    }, 2000);
                    socket.emit('match', {
                        key: $(flippedContainers[0]).attr('data-key')
                    });
                }
                console.log('two containers flipped');
                window.setTimeout(function() {
                    flippedContainers.removeClass('flip');
                }, 2000);
                count++;
                $('#result').text(count);
            }

            if ($('.cont').length == 0) {
                var name = prompt("Wie heißt du?", "");
                var highscore = $.parseJSON(localStorage.getItem('highscore'));
                if (!highscore) {
                    highscore = [];
                }
                highscore.push({
                    name: name,
                    score: count
                });
                localStorage.setItem('highscore', JSON.stringify(highscore));
            }
        });
    });

});