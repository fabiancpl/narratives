/**
 * author : İlker YILMAZ
 * url : https://github.com/kuantal/Multiple-circular-player
 * inspired by https://github.com/frumbert/circular-player
 */
(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.lunar = factory();
    }
})(this, function () {

    'use strict';

    var lunar = {};

    lunar.hasClass = function (elem, name) {
        return new RegExp('(\\s|^)' + name + '(\\s|$)').test(elem.attr('class'));
    };

    lunar.addClass = function (elem, name) {
        !lunar.hasClass(elem, name) && elem.attr('class', (!!elem.getAttribute('class') ? elem.getAttribute('class') + ' ' : '') + name);
    };

    lunar.removeClass = function (elem, name) {
        var remove = elem.attr('class').replace(new RegExp('(\\s|^)' + name + '(\\s|$)', 'g'), '$2');
        lunar.hasClass(elem, name) && elem.attr('class', remove);
    };

    lunar.toggleClass = function (elem, name) {
        lunar[lunar.hasClass(elem, name) ? 'removeClass' : 'addClass'](elem, name);
    };

    lunar.className = function (elem, name) {
        elem.attr('class', name);
        console.log('className', elem);
    };

    return lunar;

});

(function ($) {

    var _ = {

        cursorPoint: function (evt, el) {
            _.settings.pt.x = evt.clientX;
            _.settings.pt.y = evt.clientY;
            var playObject  = el.find('svg').attr('id');
            playObject      = document.getElementById(playObject);
            return _.settings.pt.matrixTransform(playObject.getScreenCTM().inverse());
        },

        angle: function (ex, ey) {
            var dy    = ey - 50; // 100;
            var dx    = ex - 50; // 100;
            var theta = Math.atan2(dy, dx); // range (-PI, PI]
            theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
            theta     = theta + 90; // in our case we are animating from the top, so we offset by the rotation value;
            if (theta < 0) theta = 360 + theta; // range [0, 360)
            return theta;
        },

        setGraphValue: function (obj, val, el) {

            var audioObj = el.find(_.settings.audioObj),
                pc       = _.settings.pc,
                dash     = pc - parseFloat(((val / audioObj[0].duration) * pc), 10);

            $(obj).css('strokeDashoffset', dash);

            if (val === 0) {
                $(obj).addClass(obj, 'done');
                if (obj === $(_.settings.progress)) $(obj).attr('class', 'ended');
            }
        },

        reportPosition: function (el, audioId) {
            var progress = el.find(_.settings.progress),
                audio    = el.find(_.settings.audioObj);

            _.setGraphValue(progress, audioId.currentTime, el);

            var id = audioId.id.replace( 'audio', '' );
            if ( id.startsWith( 'E-' ) ) {
                var currentTime = Math.trunc( audioId.currentTime );
                console.log( currentTime );

                var quotient = Math.floor( currentTime / 60 );
                var remainder = currentTime % 60;
                var time = ( ( quotient <= 9 ) ? '0' + quotient : quotient ) + ':' + ( ( remainder <= 9 ) ? '0' + remainder : remainder )
                console.log( time  );

                var audios = data[ 'audios' ].filter( audio => audio[ 'scene' ] == id );
                var character_id = audios.filter( audio => ( currentTime >= audio[ 'start_sec' ] ) && ( currentTime <= audio[ 'end_sec' ] ) )[ 0 ][ 'character' ];
                var character = data[ 'characters' ].filter( character => character[ 'id' ] == character_id )[ 0 ][ 'character' ];
                console.log( character );

                d3.select( '#popup_time_char_' + id )
                    .text( time + '  -  ' + character );

            }
            
        },

        stopAllSounds: function () {

            document.addEventListener('play', function (e) {
                var audios = document.getElementsByTagName('audio');
                for (var i = 0, len = audios.length; i < len; i++) {
                    if (audios[i] != e.target) {
                        audios[i].pause();
                    }
                    if (audios[i] != e.target) $(audios[i]).parent('div').find('.playing').attr('class', 'paused');
                }
            }, true);
        },

        settings: {},

        /**
         * Main Function for plugin
         * @param options
         */
        init: function (options) {

            /**
             * Default Options
             */

            var id = options[ 'id' ];
            var color = options[ 'color' ];

            var template = ['<svg viewBox="0 0 120 120" id="playable" version="1.1" xmlns="http://www.w3.org/2000/svg" width="34" height="34" data-play="playable" class="not-started playable">',
                '<g class="shape">',
                '<circle class="progress-track" cx="55" cy="55" r="47.45" stroke="' + color + '" stroke-opacity="1" stroke-linecap="round" fill="none" stroke-width="10"/>',
                '<circle class="precache-bar" cx="55" cy="55" r="47.45" stroke="' + color + '" stroke-opacity="1" stroke-linecap="round" fill="none" stroke-width="10" transform="rotate(-90 55 55)"/>',
                '<circle class="progress-bar" cx="55" cy="55" r="47.45" stroke="' + color + '" stroke-opacity="1" stroke-linecap="round" fill="none" stroke-width="10" transform="rotate(-90 55 55)"/>',
                '</g>',
                '<circle class="controls" cx="55" cy="55" r="45" stroke="none" fill="#000000" opacity="0.0" pointer-events="all"/>',
                '<g class="control pause">',
                '<line x1="40" y1="35" x2="40" y2="65" stroke="' + color + '" fill="none" stroke-width="8" stroke-linecap="round" transform="scale(1.1)" />',
                '<line x1="60" y1="35" x2="60" y2="65" stroke="' + color + '" fill="none" stroke-width="8" stroke-linecap="round" transform="scale(1.1)" />',
                '</g>',
                '<g class="control play">',
                '<polygon points="45,35 65,50 45,65" fill="' + color + '" stroke-width="0" transform="scale(1.1)"></polygon>',
                '</g>',
                '<g class="control stop">',
                '<rect x="35" y="35" width="30" height="30" stroke="#000000" fill="none" stroke-width="1" transform="scale(1.1)" />',
                '</g>',
                '</svg>'];

            template = template.join(' ');
            
            $.each(this, function (a, b) {
                
                var audio = $(this).find('audio');
                audio.attr('id', 'audio' + id);
                template = template.replace('width="34"','width="'+ audio.data('size')  +'"');
                template = template.replace('height="34"','height="'+ audio.data('size')  +'"');
                template = template.replace('id="playable"', 'id="playable' + id + '"');
                $(this).append(template);
                
            });

            var svgId = $(this).find('svg').attr('id');
            svgId     = document.getElementById(svgId);

            _.defaults = {
                this        : this,
                thisSelector: this.selector.toString(),
                playObj     : 'playable',
                progress    : '.progress-bar',
                precache    : '.precache-bar',
                audioObj    : 'audio',
                controlsObj : '.controls',
                pt          : svgId.createSVGPoint(),
                pc          : 298.1371428256714 // 2 pi r                                
            };

            lunar = {};

            _.settings = $.extend({}, _.defaults, options);

            $(_.settings.controlsObj).on('click', function (e) {

                //var el = $(e.currentTarget).closest($(_.settings.thisSelector));
                var el = $(e.currentTarget).closest($('#player_' + id + ' .mediPlayer'));

                var obj = {
                    el         : el,
                    activeAudio: el.find(_.settings.audioObj),
                    playObj    : el.find('[data-play]'),
                    precache   : el.find(_.settings.precache)
                };

                obj.class = obj.playObj.attr('class');
                switch (obj.class.replace('playable', '').trim()) {

                    case 'not-started':
                        _.stopAllSounds();
                        obj.activeAudio[0].play();
                        var audioId = document.getElementById(obj.activeAudio.attr('id'));
                        audioId.addEventListener('timeupdate', function (e) {
                            _.reportPosition(el, audioId)
                        });
                        obj.playObj.attr('class', 'playing');
                        break;
                    case 'playing':
                        obj.playObj.attr('class', 'playable paused');
                        obj.activeAudio[0].pause();
                        $(audioId).off('timeupdate');
                        break;
                    case 'paused':
                        obj.playObj.attr('class', 'playable playing');
                        obj.activeAudio[0].play();
                        break;
                    case 'ended':
                        obj.playObj.attr('class', 'not-started playable');
                        obj.activeAudio.off('timeupdate', _.reportPosition);
                        break;
                }
            });

            $(_.defaults.audioObj).on('progress', function (e) {
                if (this.buffered.length > 0) {
                    var end = this.buffered.end(this.buffered.length - 1);
                    var cache = $(e.currentTarget).parent().find(_.settings.precache),
                        el    = $(this).closest($(_.settings.thisSelector));
                    _.setGraphValue(cache, end, el);
                }
            });

        }

    };

    // Add Plugin to Jquery
    $.fn.mediaPlayer = function (methodOrOptions) {
        if (_[methodOrOptions]) {
            return _[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return _.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.mediaPlayer');
        }
    };
})(jQuery);