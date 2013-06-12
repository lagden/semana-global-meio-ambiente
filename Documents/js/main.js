// Avoid `console` errors in browsers that lack a console.
if (!(window.console && console.log)) {
    (function() {
        var noop = function() {};
        var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
        var length = methods.length;
        var console = window.console = {};
        while (length--) {
            console[methods[length]] = noop;
        }
    }());
}

var currLanguage = String(window.parent.document.documentElement.lang).split('-')[0] || 'pt';
console.log(currLanguage);

;
(function(window) {

    'use strict';

    var $ = window.jQuery;
    var $introducao = $('#txtSemanaIntroducao').html(db.introducao[currLanguage]);

    // Infografico
    function InfograficoSemanaGlobalMeioAmbiente(dados, lingua, path) {
        this.dados = dados.infografico;
        this.path = path || '../Documents/images/';
        this.lingua = lingua || 'pt';
        this.$view = $('#infoGraficoSemanaFrame');
        this.view = {
            ico: this.$view.find('> .media > .media__img:eq(0)'),
            content: this.$view.find('> .media > .media__body:eq(0)'),
        };
        this.atual = null;
        this.init();
    };

    InfograficoSemanaGlobalMeioAmbiente.prototype.init = function() {
        var that = this;
        $.each(that.dados, function(i, v) {
            that.view.ico.append(that.ico(v));
            that.view.content.append(that.content(v, i));
        });
        this.atual = that.view.content.find(':eq(0)');
        console.log(this.atual);
        this.listener();
    };

    InfograficoSemanaGlobalMeioAmbiente.prototype.ico = function(v) {
        return $('<img src="' + this.path + 'blank.gif" alt="" class="bl infografico-ico-' + v.css + '">').data('item', v.css);
    }

    InfograficoSemanaGlobalMeioAmbiente.prototype.content = function(v, pos) {
        console.log(pos);
        var css = (pos > 0) ? 'bl hidden' : 'bl';
        return $('<div class="' + css + ' infografico-' + v.css + '">' + v.info[this.lingua] + '</div>');
    }

    InfograficoSemanaGlobalMeioAmbiente.prototype.listener = function() {
        var that = this;
        this.view.ico.on('click', '> img', {
            "that": that
        }, that.swap);
    }

    InfograficoSemanaGlobalMeioAmbiente.prototype.swap = function(ev) {
        var that = ev.data.that,
            $this = $(this),
            item = that.view.content.find('> .infografico-' + $this.data('item') + ':eq(0)');

        TweenMax.to(that.atual, .5, {
            opacity: 0,
            onComplete: function() {
                that.atual.addClass('hidden');
                item.css({
                    "opacity": 0
                }).removeClass('hidden');
                TweenMax.to(item, .5, {
                    opacity: 1,
                    onComplete: function() {
                        that.atual = item;
                    }
                });
            }
        });
    }

    function AccordionSemana(dados, lingua, path) {
        this.dados = dados.exemplo;
        this.path = path || '../Documents/images/';
        this.lingua = lingua || 'pt';
        this.$view = $('#accordionSemana');
        this.init();
    }

    AccordionSemana.prototype.init = function() {
        var that = this;
        $.each(that.dados.accordion, function(i, v) {
            that.$view.append('<h3 class="handler"><i class="ico-bullet-right"></i>' +  v.handler[that.lingua] + '</h3>');
            that.$view.append('<div class="contentSemanaAccordion">' +  v.body[that.lingua] + '</div>');
        });
        this.$view.find('.contentSemanaAccordion').slideUp();
        this.$view.find('.handler').data('open', true);
        this.listener();
    };

    AccordionSemana.prototype.listener = function() {
        var that = this;
        this.$view.on('click', '> .handler', {
            "that": that
        }, that.toggle);
    };

    AccordionSemana.prototype.toggle = function(ev) {
        var that = ev.data.that,
            $this = $(this);

        var toggle = $this.data('open');
        console.log(toggle);

        $(this).next(':eq(0)').slideToggle({
            duration: 400,
            queue: false,
            complete: function() {
                var i = $this.find('> i:eq(0)');
                if( $this.data('open') )
                {
                    $this.addClass('active');
                    i.removeClass('ico-bullet-right').addClass('ico-bullet-down');
                }
                else
                {
                    $this.removeClass('active');
                    i.removeClass('ico-bullet-down').addClass('ico-bullet-right');
                }
                $this.data('open', !toggle);
            }
        });
    };

    // Global
    window.InfograficoSemanaGlobalMeioAmbiente = InfograficoSemanaGlobalMeioAmbiente;
    window.AccordionSemana = AccordionSemana;

})(window);

// Video
$('#videoSemana').append('\
<a href="' + db.video[currLanguage].link + '" title="' + db.video[currLanguage].alt + '">\
<img class="bl" src="' + pathImg + db.video[currLanguage].img + '" alt="' + db.video[currLanguage].alt + '">\
</a>');

// Preload
$('#preloadImgsSemana').imagesLoaded()
    .always(function(instance) {
    console.log('always: all images loaded');
    runSemana();
})
    .done(function(instance) {
    console.log('done: all images successfully loaded');
})
    .fail(function() {
    console.log('fail: all images loaded, at least one is broken');
})
    .progress(function(instance, image) {
    var result = image.isLoaded ? 'loaded' : 'broken';
    console.log('image is ' + result + ' for ' + image.img.src);
});

// Executa
var infograficoSemanaGlobalMeioAmbiente;
var accordionSemana;

function runSemana() {
    infograficoSemanaGlobalMeioAmbiente = new InfograficoSemanaGlobalMeioAmbiente(db, currLanguage, pathImg);
    accordionSemana = new AccordionSemana(db, currLanguage, pathImg);
}

// Method Ga

function gaUpdate(track, evento, slug) {
    evento = evento || 'clique';
    slug = slug || 'coloque-o-slug';
    if (_gaq) {
        _gaq.push(['_trackEvent', slug, evento, track]);
        console.log(track, evento, slug);
    }
}