
'use strict';

jTS.prototype = Object.create(Array.prototype);
jTS.prototype.constructor = jTS;

jTS.fn = jTS.prototype;

/**
 *
 * @param set {Array}
 * @param selector {Object}
 */
jTS.ts = function(set, selector){

    /*jTS constructor fingerprint*/

    for (let i = 0; i < set.length; i++) {

        this.push(set[i]);

    }

    this.selector = selector;

};

jTS.ts.prototype = Object.create(jTS.prototype);
jTS.ts.prototype.constructor = jTS.ts;

const _ = jTS;

/**
 *
 * @param selector {*}
 * @return {jTS}
 */
function jTS(/*string || number || window || document || Node List || DOM Element || jTS || Array[Any] || Function*/selector) {

    if (typeof selector === 'function') {

        setDocumentReady(selector);
        return null;

    }

    let set = init(selector);

    return new jTS.ts(set, selector);

    function init(/*String || Number || Window || Document || Node List || DOM Element || jTS Object || Array[Object]*/selector) {

        let set = [];

        if (!selector) {

            /*Don' t do anything*/

        }
        else {

            parseSelector(selector);

        }

        function parseSelector(selector) {

            let constructor = String(selector.constructor);

            if (selector === window) {

                set.push(window);

            }
            else if (selector === document) {

                set.push(document);

            }
            else if (constructor.match(/NodeList/) || constructor.match(/HTMLCollection/)) {

                for (let i = 0; i < selector.length; i++) {

                    if (selector[i].nodeType !== 3) {

                        set.push(selector[i]);

                    }

                }

            }
            else if (constructor.match(/HTML[a-zA-z]+Element/) || constructor.match(/SVG[a-zA-z]+Element/) || constructor.match(/HTMLElement/)) {

                set.push(selector);

            }
            else if (constructor.match(/Array/)) {

                parseSelectorArray(selector);

            }
            else if (constructor.match(/String/)) {

                parseStringSelector(selector);

            }
            else if (constructor.match(/Number/)) {

                parseStringSelector(String(selector));

            }
            else if(constructor.match(/\/\*jTS constructor fingerprint\*\//)){

                selector.each(function(i,e){

                    set.push(e);

                });

            }
            else {

                console.log('not-a-valid-selector : ' + selector);

            }

        }

        function parseSelectorArray(selector) {

            for (let i = 0; i < selector.length; i++) {

                parseSelector(selector[i]);

            }

        }

        function parseStringSelector(selector) {

            if (selector.match(/^</)) {

                createElement(selector);

            }
            else {

                try {

                    let element = document.querySelectorAll(selector);

                    if (element && element.length !== 0) {

                        parseSelector(element);

                    }

                }
                catch (e) {

                    //do nothing

                }

            }

        }

        function createElement(selector) {

            let canvas = document.createElement('div');

            if (selector.match(/^<thead/) || selector.match(/^<tbody/) || selector.match(/^<tfoot/)) {

                canvas = document.createElement('table');

            }
            else if (selector.match(/^<tr/)) {

                canvas = document.createElement('tbody');

            }
            else if (selector.match(/^<td/) || selector.match(/^<th/)) {

                canvas = document.createElement('tr');

            }

            canvas.innerHTML = selector;

            for (let i = 0; i < canvas.childNodes.length; i++) {

                set.push(canvas.childNodes[i]);

            }

        }

        return set;

    }

    function setDocumentReady(f) {

        if (window.addEventListener) {

            window.addEventListener('load', f, false)

        }
        else if (window.attachEvent) {

            window.attachEvent('load', f);

        }
    }

}





/*AJAX PACKAGE*/

/**
 *
 * @param colorScheme {Object}
 * @param configuration {Object}
 * @return {jTS}
 */
jTS.fn.gearsProgress =/*jTS*/function (/*Object literal || Null*/colorScheme,/*Object literal*/configuration) {

    const t = this;

    if(t.length === 0){

        return t;

    }

    const GEAR_ONE_SR = 0;
    const GEAR_TWO_SR = 18;
    const GEAR_THREE_SR = 23;
    const ROTATION_VR = 5;

    let color_one =    colorScheme && colorScheme.gear_one_color ? colorScheme.gear_one_color : '#ff0000';
    let color_two =    colorScheme && colorScheme.gear_two_color ? colorScheme.gear_two_color : '#00ff00';
    let color_three =  colorScheme && colorScheme.gear_three_color ? colorScheme.gear_three_color : '#0000ff';
    let color_bg =     colorScheme && colorScheme.container_color ? colorScheme.container_color : 'rgba(0,0,0,0.8)';
    let progress_color = colorScheme && colorScheme.progress_color ? colorScheme.progress_color :'#ff0000';
    let resizeID = null;
    let inAnimation = true;

    let container =  document.createElement('div');
    let gear_one =   _('<div id="gear_one_jts_gears_progress"><i class="fa fa-cog" style="position:absolute;top:0;left:0;"></i></div>').css({
        'color' : color_one
    });
    let gear_two =   _('<div id="gear_two_jts_gears_progress"><i class="fa fa-cog" style="position:absolute;top:0;left:0;"></i></div>').css({
        'color' : color_two
    });
    let gear_three = _('<div id="gear_three_jts_gears_progress"><i class="fa fa-cog" style="position:absolute;top:0;left:0;"></i></div>').css({
        'color' : color_three
    });

    let gear_one_Rotation =   GEAR_ONE_SR;
    let gear_two_Rotation =   GEAR_TWO_SR;
    let gear_three_Rotation = GEAR_THREE_SR;

    addListeners();
    addGraphic();

    function activateProgress(){

        let progressBar = document.createElement('div');

        _(progressBar).css({

            'height' : 50,
            'position' : 'absolute',
            'left' : 0,
            'bottom' : 0,
            'background-color' : progress_color,
            'width' : 0

        });

        _(container).append(progressBar);
        _(window).on(jTS.built_in_events.jREQUEST_PROGRESS_EVENT,function(e){

            let width = 100 * (e.data.original_event.loaded / e.data.original_event.total);
            _(progressBar).css('width',width + '%');

        });
        _(window).on(jTS.built_in_events.jREQUEST_END_EVENT,function(e){

            dispose();

        });

        jTS.jRequest(configuration.url,configuration.request_configuration);

    }

    function addGraphic() {

        let css = {

            'position':'fixed',
            'left': 0,
            'top': 0,
            'z-index':10000,
            'width': '100%',
            'height': '100vh',
            'background-color': color_bg,

        };

        gear_one.css('transform', 'rotateZ(' + GEAR_ONE_SR + 'deg)');
        gear_two.css('transform', 'rotateZ(' + GEAR_TWO_SR + 'deg)');
        gear_three.css('transform', 'rotateZ(' + GEAR_THREE_SR + 'deg)');

        _(container).attr('id', 'jts_gears_progress').css(css);
        _(container).append(gear_one);
        _(container).append(gear_two);
        _(container).append(gear_three);

        setGearsSize();

        _('body').append(container);

        if(configuration && configuration.show_progress){

            activateProgress();

        }

        requestAnimationFrame(animateGears);

    }

    function addListeners(){

        _(window).bind('resize.jts_gears_progress',function(){

            clearTimeout(resizeID);

            resizeID = setTimeout(function(){

                setGearsSize();

            },100);

        });

    }

    function animateGears() {

        gear_one_Rotation +=   ROTATION_VR;
        gear_two_Rotation -=   ROTATION_VR;
        gear_three_Rotation -= ROTATION_VR;

        gear_one.css('transform', 'rotateZ(' + gear_one_Rotation + 'deg)');
        gear_two.css('transform', 'rotateZ(' + gear_two_Rotation + 'deg)');
        gear_three.css('transform', 'rotateZ(' + gear_three_Rotation + 'deg)');

        if(inAnimation) {

            requestAnimationFrame(animateGears);

        }

    }

    function dispose(){

        inAnimation = false;

        _(window).unbind('.jts_gears_progress');
        _(window).off(jTS.built_in_events.jREQUEST_PROGRESS_EVENT);
        _(window).off(jTS.built_in_events.jREQUEST_END_EVENT);

        _(container).dispose();

    }

    function getGearsSize(index, width) {

        const INDEX_DELAY = 6;
        const INDEX_T_DELAY = 11;

        const SIZES_SET = [0, 415, 737, 1025, 1981, 10000, 120, 150, 180, 200, 230, 120, 150,180,200,230];

        if (width >= SIZES_SET[index] && width < SIZES_SET[index + 1]) {

            return {'gear_size':SIZES_SET[index + INDEX_DELAY],'font_size':SIZES_SET[index + INDEX_T_DELAY]}

        }
        else {

            return getGearsSize(index + 1, width);

        }

    }

    function setGearsSize() {

        let width =  _(window).width();
        let height = _(window).height();

        let sizes =     getGearsSize(0, width);
        let gear_size = sizes.gear_size;
        let font_size = sizes.font_size;

        let one_left =     Math.round((width * 0.5) - (gear_size * 0.89));
        let one_top =      Math.round((height * 0.5) - (gear_size * 0.5));
        let two_left =     Math.round((width * 0.5) - (gear_size * 0.15));
        let two_top =      Math.round((height * 0.5) - (gear_size * 1.06));
        let three_left =   Math.round((width * 0.5) - (gear_size * 0.030));
        let three_top =    Math.round((height * 0.5) - (gear_size * 0.100));

        let gearCss = {

            'width': gear_size,
            'height': gear_size,
            'position': 'absolute'

        };

        gear_one.css(gearCss).css({ 'left': one_left, 'top': one_top, 'font-size': font_size });
        gear_two.css(gearCss).css({ 'left': two_left, 'top': two_top, 'font-size': font_size });
        gear_three.css(gearCss).css({ 'left': three_left, 'top': three_top, 'font-size': font_size });

    }

    return t;

};

/**
 *
 * @param url {string}
 * @param success {Function}
 * @param errorOrData {Function}
 * @return {void}
 */
jTS.jJSON = /*void*/function (/*string*/url,/*Function*/ success,/*Function*/ errorOrData) {

    if (arguments.length < 2) {

        console.log('invalid-arguments-list @ jTS.jJSON');
        return;

    }

    let successCB = success;
    let errorCB = function (e) { console.log(e); };
    let postData = {};

    if (arguments.length === 3) {

        errorCB = arguments[2];

    }

    /*if (arguments.length === 4) {

        errorCB = arguments[2];
        postData = arguments[3];

    }

    let form = new FormData();

    for (let n in postData) {

        if(postData.hasOwnProperty(n)){

            form.append(n, postData[n]);

        }

    }*/

    let r = new XMLHttpRequest();

    r.open('get', url);
    //r.setRequestHeader('X-CSRF-TOKEN', '');

    r.onreadystatechange = function () {

        if (r.readyState === 4) {

            if (r.status === 200) {

                let currentObject;

                try {


                    currentObject = JSON.parse(r.response);


                }
                catch (e) {

                    errorCB('return-only-JSON-format @jTS.jJSON');

                }

                if (currentObject) {

                    successCB(currentObject);

                }

            }
            else {

                errorCB('request-server-error @ jTS.jJSON');

            }

        }

    };

    r.send(null);

};

/**
 *
 * @param url {string}
 * @param configuration {Object}
 */
jTS.jRequest = /*void*/function (/*string*/url,/*Object literal*/configuration) {

    const MAXIMUM_ATTEMPTS = 3;

    let method =    configuration && configuration.method ? configuration.method : 'get';
    let successCB = configuration && configuration.success ? configuration.success : function (d) { console.log(d) };
    let errorCB =   configuration && configuration.error ? configuration.error : function (e) { console.log(e) };
    let type =      configuration && configuration.type ? configuration.type : 'download';
    let data =      configuration && configuration.data ? configuration.data : {};
    let csrfToken = configuration && configuration.csrf_token ? configuration.csrf_token : null;
    let attempt =   configuration && configuration.attempt ? configuration.attempt : 0;

    let dataForm = null;

    if (method.toLowerCase() === 'post') {

        dataForm = new FormData();

        for (let n in data) {

            dataForm.append(n,data[n]);

        }

    }

    let r = new XMLHttpRequest();

    r.open(method, url);

    if(csrfToken){

        r.setRequestHeader('X-CSRF-TOKEN', csrfToken);

    }

    if (url.toLowerCase().match(/.jpg$/) || url.toLowerCase().match(/.jpg?/) ||
        url.toLowerCase().match(/.png$/) || url.toLowerCase().match(/.png?/) ||
        url.toLowerCase().match(/.tiff$/) || url.toLowerCase().match(/.tiff?/) ||
        url.toLowerCase().match(/.gif$/) || url.toLowerCase().match(/.gif?/)) {

        r.responseType = 'arraybuffer';

    }

    r.onreadystatechange = function () {

        if (r.readyState === 4) {

            if (r.status === 200 || r.status === 201) {

                successCB(r.response);

            }
            else {

                attempt += 1;

                if(attempt < MAXIMUM_ATTEMPTS){

                    console.log(`REQUEST ATTEMPT #${attempt} FAIL`);

                    configuration = configuration ? configuration : {};
                    configuration.attempt = attempt;

                    jTS.jRequest(url,configuration);

                }else{

                    errorCB('request-server-error @jTS.jRequest');

                }

            }

        }

    };

    r.addEventListener('loadstart',
        function (e) {

            _(window).emits(jTS.built_in_events.jREQUEST_START_EVENT, { 'original_event': e });

        });

    r.addEventListener('loadend',
        function (e) {

            _(window).emits(jTS.built_in_events.jREQUEST_END_EVENT, { 'original_event': e });

        });

    r.onerror = function (error) {

        attempt++;

        if(attempt < MAXIMUM_ATTEMPTS){

            console.log(`REQUEST ATTEMPT #${attempt} FAIL`);

            configuration = configuration ? configuration : {};
            configuration.attempt = attempt;

            jTS.jRequest(url,configuration);

        }else{

            errorCB('request-server-error @jTS.jRequest');

        }

    };

    switch (type) {

        case 'download':
            r.onprogress = progress;
            break;
        case 'upload':
            r.upload.onprogress = progress;
            break;
        default:
            r.onprogress = progress;
            break;

    }

    try{

        r.send(dataForm);

    }catch(e){

        attempt += 1;

        if(attempt < MAXIMUM_ATTEMPTS){

            console.log(`REQUEST ATTEMPT #${attempt} FAIL`);

            configuration = configuration ? configuration : {};
            configuration.attempt = attempt;

            jTS.jRequest(url,configuration);

        }else{

            errorCB('request-server-error @jTS.jRequest');

        }

    }

    function progress(e) {

        _(window).emits(jTS.built_in_events.jREQUEST_PROGRESS_EVENT, {'original_event':e});

    }

};

/**
 *
 * @param urls {*}
 * @param success {Function}
 * @param error {Function}
 * @return {jTS}
 */
jTS.fn.load = /*jTS*/function (/*string || Array[string]*/urls,/*Function*/ success,/*Function*/ error) {

    const t = this;

    let successCB = null;
    let errorCB = null;
    let responses = [];

    if (arguments.length === 2) {

        if (typeof arguments[1] === 'function') {

            successCB = arguments[1];

        }

    }

    if (arguments.length === 3) {

        if (typeof arguments[1] === 'function') {

            successCB = arguments[1];

        }

        if (typeof arguments[2] === 'function') {

            errorCB = arguments[2];

        }

    }

    if (typeof arguments[0] === 'string') {

        urls = [urls];

    }

    let index = 0;

    pushResponse(index);

    function pushResponse(index) {

        if (index < urls.length) {

            let r = new XMLHttpRequest();

            r.open('get', urls[index]);

            r.onreadystatechange = function () {

                if (r.readyState === 4) {

                    if (r.status === 200) {

                        let contentType = String(r.getResponseHeader("Content-Type"));

                        if (contentType.indexOf("html") !== -1) {

                            responses.push(r.responseText);
                            pushResponse(index + 1);

                        }
                        else {

                            if (errorCB) {

                                errorCB('load-only-html-files @jTS.load');

                            }

                        }

                    }
                    else {

                        if (errorCB) {

                            errorCB('request-server-error-for-index-' + index + ' @jTS.load');

                        }

                    }

                }

            };

            r.onerror = function (e) {

                if (errorCB) {

                    errorCB(e);

                }

            };

            r.send(null);

        }
        else {

            t.each(displayResponse);

        }

    }

    function displayResponse(i, e) {

        if (responses.length === 1 || i >= responses.length) {

            parseResponse(responses[0], 0);

        }
        else {

            parseResponse(responses[i], i);

        }

        function parseResponse(val, index) {

            e.innerHTML = '';

            let canvas = document.createElement('div');

            canvas.innerHTML = val;

            let counter = canvas.childNodes.length;

            for (let h = 0; h < counter; h++) {

                if (canvas.childNodes[0]) {

                    e.appendChild(canvas.childNodes[0]);

                }

            }

            if (successCB) {

                successCB(responses[index], i, e);

            }

        }

    }

    return this;

};

/*END AJAX PACKAGE*/





/*ANIMATION PACKAGE*/

/**
 *
 * @param d {int}
 * @param configuration {Object}
 * @return {jTS}
 */
jTS.fn.hide = /*jTS*/function (/*int*/d,/*Object literal*/configuration) {

    const t = this;

    const TIME_GAP = 100;

    let property = 'opacity';
    let easing = 'linear';

    if (arguments.length === 0) {

        t.each(function (i, e) {

            if (_(e).css('display') === 'none' || _(e).attr('jts_hidden') || _(e).attr('jts_showed')) {

                return;

            }

            jTS.originalStyles.push([e, _(e).attr('style')]);

            _(e).css('display', 'none');

        });

    }
    else if (arguments.length === 1 && typeof arguments[0] === 'number') {

        t.each(fade);

    }
    else if (arguments.length === 2 && typeof arguments[0] === 'number' && typeof arguments[1] === 'object') {

        property = configuration.method === 'slide' ? 'height' : property;
        easing = configuration.easing ? configuration.easing : easing;

        if (configuration.method === 'fade' || !(configuration.method)) {

            t.each(fade);

        }
        else if (configuration.method === 'slide') {

            t.each(slide);

        }

    }
    else {

        console.log('invalid-arguments-list @ jTS.hide');

    }

    function fade(i, e) {

        if (_(e).css('display') === 'none' || _(e).attr('jts_hidden') || _(e).attr('jts_showed')) {

            return;

        }

        jTS.originalStyles.push([e, _(e).attr('style')]);

        _(e).attr('jts_hidden', true);

        if (configuration && configuration.startCB) {

            configuration.startCB(i, e);

        }

        let originalStyle = _(e).attr('style');
        let style = null;

        if (originalStyle) {

            if (originalStyle.match('opacity:')) {

                style = originalStyle;

            }
            else {

                style = originalStyle + 'opacity:' + _(e).css('opcacity') + ';';

            }

        }
        else {

            originalStyle = '';
            style = 'opacity:' + _(e).css('opcacity') + ';';

        }

        _(e).attr('style', style);
        _(e).css('transition', property + ' ' + (d / 1000) + 's ' + easing + ' 0s');

        setTimeout(function () {

            _(e).css('opacity', 0);

        }, 1);

        setTimeout(function () {

            if (_(e).attr('jts_hidden')) {

                _(e).attr('style', originalStyle);
                _(e).css('display', 'none');
                e.attributes.removeNamedItem('jts_hidden');

                if (configuration && configuration.endCB) {

                    configuration.endCB(i, e);

                }

            }

        }, d + TIME_GAP);

    }

    function slide(i, e) {

        if (_(e).css('display') === 'none' || _(e).attr('jts_hidden') || _(e).attr('jts_showed')) {

            return;

        }

        jTS.originalStyles.push([e, _(e).attr('style')]);

        _(e).attr('jts_hidden', true);

        if (configuration && configuration.startCB) {

            configuration.startCB(i, e);

        }

        let wrapper = document.createElement('div');
        let originalStyle = _(e).attr('style') || '';

        let parent = _(e).offsetPs();

        let wrapperCss = {

            'overflow': 'hidden',
            'box-shadow': _(e).css('box-shadow'),
            'height': _(e).outerHeight(),
            'width': _(e).outerWidth(),
            'float': _(e).css('float'),
            'margin-left': _(e).css('margin-left'),
            'margin-right': _(e).css('margin-right'),
            'margin-bottom': _(e).css('margin-bottom'),
            'margin-top': _(e).css('margin-top'),
            'border-radius': _(e).css('border-radius'),
            'left': _(e).css('left'),
            'top': _(e).css('top'),
            'right': _(e).css('right'),
            'bottom': _(e).css('bottom'),
            'position': _(e).css('position'),
            'z-index': _(e).css('z-index'),
            'padding' : 0

        };

        let eCss = {

            'margin-left': 0,
            'margin-right': 0,
            'margin-bottom': 0,
            'margin-top': 0,
            'box-shadow': 'none',
            'border-radius': 0,
            'width': '100%',
            'left': 0,
            'top': 0,
            'right': 0,
            'bottom': 0,
            'position': 'absolute',
            'z-index': 0

        };

        _(wrapper).css(wrapperCss).addClass('jts_hide_wrapper');
        parent.before(wrapper, e);
        _(wrapper).append(e);
        _(e).css(eCss);
        _(wrapper).css('transition', property + ' ' + (d / 1000) + 's ' + easing + ' 0s');

        setTimeout(function () {

            _(wrapper).css('height', 0);

        }, TIME_GAP * 0.3);

        setTimeout(function () {

            if (_(e).attr('jts_hidden')) {

                _(e).attr('style', originalStyle);
                _(e).css('display', 'none');
                parent.before(e, wrapper);
                parent[0].removeChild(wrapper);
                e.attributes.removeNamedItem('jts_hidden');

                if (configuration && configuration.endCB) {

                    configuration.endCB(i, e);

                }

            }

        }, d + (TIME_GAP * 2));

    }

    return this;

};

/**
 *
 * @param duration {int}
 * @param draw {Function}
 * @param options {Object}
 * @return {void}
 */
jTS.jAnimate = /*void*/function (/*int*/duration,/*Function*/draw,/*Object*/options) {

    let start = performance.now();
    let n = options.coefficient || 1;
    let delay = options.delay || 0;
    let elapsed = 0;
    let enabled = false;
    let paused = false;
    let timing;

    switch (options.timing_function){

        case 'linear' :
            timing = linear;
            break;
        case 'accelerate' :
            timing = accelerate;
            break;
        case 'arc' :
            timing = arc;
            break;
        case 'bowShooting' :
            timing = bowShooting;
            break;
        case 'bounce' :
            timing = bounce;
            break;
        case 'elastic' :
            timing = elastic;
            break;
        default :
            timing = linear;
            break;

    }

    if(options.ease_out){

        timing = makeEaseOut(timing);

    }else if(options.ease_in_out){

        timing = makeEaseInOut(timing);

    }

    let target = _(`<div class="jAnimate_target"></div>`);

    target.on(jTS.built_in_events.jANIMATE_PAUSE,() => paused = true);
    target.on(jTS.built_in_events.jANIMATE_RESUME,() => {

        start = performance.now() - elapsed;
        paused = false;

    });

    startAnimation();

    function startAnimation() {

        requestAnimationFrame(function animate(time){

            if(!paused){

                elapsed = time - start;

            }

            if(elapsed >= delay && !enabled){

                start = time;
                enabled = true;

            }

            if(enabled && !paused){

                let fraction = (time - start) / duration;

                if(fraction > 1){

                    fraction = 1;

                }

                let progress = timing(fraction,n);

                if(options.reverse){

                    progress = 1 - progress;

                }

                draw(progress);

                if (fraction < 1){

                    requestAnimationFrame(animate);

                }else{

                    target.off(jTS.built_in_events.jANIMATE_PAUSE);
                    target.off(jTS.built_in_events.jANIMATE_RESUME);

                    if(options.callback){

                        options.callback();

                    }

                }

            }else{

                requestAnimationFrame(animate);

            }

        });

    }

    function linear(fraction){

        return fraction;

    }

    function accelerate(fraction,n) {

        return Math.pow(fraction, n);

    }

    function arc(fraction) {

        return 1 - Math.sin(Math.acos(fraction));

    }

    function bowShooting(fraction , n) {

        return Math.pow(fraction, 2) * ((n + 1) * fraction - n);

    }

    function bounce(fraction) {

        for (let a = 0, b = 1, result; 1; a += b, b /= 2) {

            if (fraction >= (7 - 4 * a) / 11) {

                return -Math.pow((11 - 6 * a - 11 * fraction) / 4, 2) + Math.pow(b, 2);

            }

        }

    }

    function elastic(fraction , n) {

        return Math.pow(2, 10 * (fraction - 1)) * Math.cos(20 * Math.PI * n / 3 * fraction);

    }

    function makeEaseOut(timing) {

        return function(fraction,n) {

            return 1 - timing(1 - fraction , n);

        }

    }

    function makeEaseInOut(timing) {

        return function(fraction , n) {

            if (fraction < .5){

                return timing(2 * fraction , n) / 2;

            }else{

                return (2 - timing(2 * (1 - fraction) , n)) / 2;

            }

        }

    }

};

/**
 *
 * @param windowW {boolean}
 * @param nColumns {Array}
 * @param items {int}
 * @return {jTS}
 */
jTS.fn.masonry = /*jTS*/function(/*boolean*/windowW,/*Array[int]*/nColumns,/*int*/items){

    const t = this;

    if(t.length === 0){

        return t;

    }

    let container = t.offsetPs();
    let initialized = false;
    let containerWidth = 0;
    let columns = 0;
    let currentWidth = 0;
    let columnsHeight = [];
    let orderedItems = null;
    let display = items;

    setElementsWidth();
    init();

    function init(){

        /*Don't know if want to use this function*/
        //updateOrder();

        t.each(function(i,e){

            _(e).css({

                'position' : 'absolute' ,
                'transition' : 'left 0.5s ease-out , top 0.5s ease-out',
                'height' : 'auto',

            });

        });

        computeMasonry();
        addListeners();

        if(!initialized){

            initialized = true;
            _(window).emits(jTS.built_in_events.jMASONRY_READY);

        }

    }

    function addListeners(){

        _(window).bind('resize.jts_masonry_events',function(e){

            computeMasonry();

        });

        _(window).on(jTS.built_in_events.jMASONRY_RESIZE,function(e){

            if(e.data.display){

                display = e.data.display;

            }

            computeMasonry();

        });

        _(window).on(jTS.built_in_events.jEXTERNAL_RESIZE,function(e){

            computeMasonry();

        });

    }

    function computeMasonry(){

        setElementsWidth();

        columnsHeight = [];

        for(let i = 0; i < columns ; i++){

            columnsHeight[i] = 0;

        }

        t.each(function(i,e){

            if(i === 0){

                currentWidth = _(e).outerWidth();

            }

            let x = Math.floor(i % columns) * currentWidth;

            _(e).css('left',x).css('top',columnsHeight[Math.floor(i % columns)]);

            if(!display || i < display){

                columnsHeight[Math.floor(i % columns)] +=  Math.floor(_(e).outerHeight());

            }

        });

        container.css('height',getColumnHeight());

    }

    function getColumnHeight(){

        let height = 0;

        for(let i = 0; i < columnsHeight.length ; i++){

            if(columnsHeight[i] > height){

                height = columnsHeight[i]

            }

        }

        return height;

    }

    function getContainerWidth(){

        if(windowW){

            return _(window).outerWidth();

        }
        else{

            return container.outerWidth();

        }

    }

    function setElementsWidth(){

       containerWidth =  getContainerWidth();
       columns = containerWidth <= 414 ? 1 : (containerWidth <= 812 ? 2 : (containerWidth <= 1024 ? 3 : 4));

       if(nColumns){

           columns = containerWidth <= 414 ? nColumns[0] : (containerWidth <= 812 ? nColumns[1] : (containerWidth <= 1024 ? nColumns[2] : nColumns[3]));

       }

       let width = Math.round(containerWidth / columns);

        t.each(function(i,e){

            let currentWidth = Math.floor(i % columns) === columns - 1 ? containerWidth - (width * Math.floor(i % columns)) : width;

            _(e).css('width' , currentWidth);

        });

    }

    function updateOrder() {

        let temporaryArray = [];

        if(!initialized){

            t.each(function(i,e){

                temporaryArray.push(e);

            });

        }
        else{

            for(let i = 0 ; i < orderedItems.length ; i++){

                let random = Math.floor(Math.random() * orderedItems.length);

                temporaryArray.push(orderedItems[random]);
                orderedItems.splice(random,1);
                i--;

            }

        }

        orderedItems = null;
        orderedItems = _(temporaryArray);

    }

    return this;

};

/**
 *
 * @param configuration {Object}
 * @return {jTS}
 */
jTS.fn.particlesFX = /*jTS*/function(/*Object literal*/configuration){

    const t = this;

    //Function is designed for one canvas at time
    if(t.length !== 1 || t[0].tagName.toLowerCase() !== 'canvas'){

        return t;

    }

    //Device pixel ratio
    let ratio = window.devicePixelRatio || 1;

    //Constants
    let PARTICLES_NUMBER = configuration && configuration.particles_number ? configuration.particles_number : [150,80,50];
    let PARTICLE_SIZE = configuration && configuration.particles_size? configuration.particles_size : 15;
    let PARTICLE_MIN_SIZE = configuration && configuration.particles_min_size ? configuration.particles_min_size : 5;
    let FRAME_RATE = 16;
    let VELOCITY = 2 * ratio;
    let VELOCITY_SCALE = 1;
    let BOUNDARY_GAP = 30 * ratio;
    let MINIMUM_DISTANCE = configuration && configuration.minimum_distance ? configuration.minimum_distance * configuration.minimum_distance : 150 * 150;
    let POINTER_MINIMUM_DISTANCE = configuration && configuration.pointer_minimum_distance ? configuration.pointer_minimum_distance * configuration.pointer_minimum_distance : 180 * 180;
    let POINTER_MINIMUM_DISTANCE_ROOT_SQUARE = configuration && configuration.pointer_minimum_distance ? configuration.pointer_minimum_distance : 180;
    let MEDIUM_SCREEN_SIZE = 736;
    let SMALL_SCREEN_SIZE = 414;
    let RESIZE_DELAY = 100;

    //general variables;
    let canvas = t[0];
    let container = t.offsetPs();
    let brush = canvas.getContext('2d');
    let particles = [];
    let stageWidth = 0;
    let stageHeight = 0;
    let pointerActive = false;
    let pointerX = 0;
    let pointerY = 0;
    let resizeID = null;

    //The Particle Object Class
    Particle.prototype = Object.create({});
    Particle.prototype.constructor = Particle;

    function Particle(x,y,size){

        this.x = x;
        this.y = y;
        this.size = size;

        //Set particle velocity
        this.vX = VELOCITY * ((Math.random() * (VELOCITY_SCALE - -VELOCITY_SCALE)) + -VELOCITY_SCALE);
        this.vY = VELOCITY * ((Math.random() * (VELOCITY_SCALE - -VELOCITY_SCALE)) + -VELOCITY_SCALE);

    }

    Particle.prototype.update = function(pointerX , pointerY){

        //Update particle position
        this.x += this.vX;
        this.y += this.vY;

        //Check if particle is out of boundaries
        if(this.x < 0 - BOUNDARY_GAP || this.x > stageWidth + BOUNDARY_GAP){

            this.x = this.x < 0 ? stageWidth + BOUNDARY_GAP : 0 - BOUNDARY_GAP;

        }

        if(this.y < 0 - BOUNDARY_GAP || this.y > stageHeight + BOUNDARY_GAP){

            this.y = this.y < 0 ? stageHeight + BOUNDARY_GAP : 0 - BOUNDARY_GAP;

        }

        //Check pointer interaction
        let dX = pointerX - this.x;
        let dY = pointerY - this.y;
        let distance = dX * dX + dY * dY;

        if(distance < POINTER_MINIMUM_DISTANCE  && pointerActive){

            let radians = Math.atan2(dY,dX);

            this.x = pointerX - (POINTER_MINIMUM_DISTANCE_ROOT_SQUARE * Math.cos(radians));
            this.y = pointerY - (POINTER_MINIMUM_DISTANCE_ROOT_SQUARE * Math.sin(radians));

        }

    };

    setSize();
    init();
    addListeners();
    animate();

    _(canvas).emits(jTS.built_in_events.jPARTICLES_FX_READY);

    function addListeners(){

        _(window).bind('resize.jts_particles_fx_events',function(){

            clearTimeout(resizeID);

            resizeID = setTimeout(function(){

                setSize();
                init();

            },RESIZE_DELAY);

        }).bind('mousemove.jts_particles_fx_events',function(e){

            let pointerLocalCoordinates = getPointerLocalCoordinates(e.globalX,e.globalY);

            pointerX = pointerLocalCoordinates.x;
            pointerY = pointerLocalCoordinates.y;

        });

        _(canvas).bind('mouseover.jts_particles_fx_events',function(e){

            pointerActive = true;

        }).bind('mouseout.jts_particles_fx_events',function(e){

            pointerActive = false;

        });

    }

    function animate(){

        //Clear the stage
        brush.clearRect(0,0,stageWidth,stageHeight);
        brush.fillStyle = configuration && configuration.color ? ('rgba(' + configuration.color[0] + ',' + configuration.color[1] + ',' + configuration.color[2] + ',0.5)') : 'rgba(207,207,207,0.5)';

        for(let i = 0; i < particles.length; i++){

            let particle = particles[i];

            //Draw particle
            brush.beginPath();
            brush.arc(particle.x,particle.y,particle.size * 0.5,0,Math.PI * 2);
            brush.closePath();
            brush.fill();

            for(let l = i + 1 ; l < particles.length; l++){

                let other = particles[l];

                let dX = other.x - particle.x;
                let dY = other.y - particle.y;
                let distance = dX * dX + dY * dY;

                //If two particles are close enough draw connection line
                if(distance < (MINIMUM_DISTANCE * ratio)){

                    let styleData = getBrushStyle(distance);

                    brush.lineWidth = styleData.lineWidth;
                    brush.strokeStyle = configuration && configuration.color ? ('rgba(' + configuration.color[0] + ',' + configuration.color[1] + ',' + configuration.color[2] + ',' + styleData.opacity + ')') : 'rgba(207,207,207,' + styleData.opacity + ')';

                    brush.beginPath();
                    brush.moveTo(particle.x,particle.y);
                    brush.lineTo(other.x,other.y);
                    brush.closePath();
                    brush.stroke()

                }

            }

            //Update particle position for new frame
            particle.update(pointerX,pointerY);

        }

        setTimeout(function(){

            animate();

        },FRAME_RATE);

    }

    function getBrushStyle(distance){

        let opacity = "0";
        let lineWidth = 0;

        if(distance >= (MINIMUM_DISTANCE * ratio) * 0.8){

            opacity = '0.1';
            lineWidth = 0.2;

        }
        else if(distance < (MINIMUM_DISTANCE * ratio) * 0.8 && distance >= (MINIMUM_DISTANCE * ratio) * 0.6){

            opacity = '0.2';
            lineWidth = 0.3;

        }
        else if(distance < (MINIMUM_DISTANCE * ratio) * 0.6 && distance >= (MINIMUM_DISTANCE * ratio) * 0.4){

            opacity = '0.3';
            lineWidth = 0.4;

        }
        else if(distance < (MINIMUM_DISTANCE * ratio) * 0.4 && distance >= (MINIMUM_DISTANCE * ratio) * 0.2){

            opacity = '0.4';
            lineWidth = 0.4;

        }
        else{

            opacity = '0.5';
            lineWidth = 0.5;

        }

        return {'opacity':opacity,'lineWidth':lineWidth * ratio};

    }

    function getParticleSize(startSize){

        startSize = startSize * ratio;

        let random = Math.ceil(Math.random() * startSize);
        let size = random - Math.floor(Math.random() * (startSize * 0.5));

        size = size  < (PARTICLE_MIN_SIZE * ratio) ? (PARTICLE_MIN_SIZE * ratio) : size;

        return size;

    }

    function getPointerLocalCoordinates(x,y){

        let parent = canvas;

        while(parent){

            x -= parent.offsetLeft;
            y -= parent.offsetTop;

            parent = parent.offsetParent;

        }

        return {'x':x * ratio,'y':y * ratio};

    }

    function init(){

        makeParticle(0);

        //This make a new particle
        function makeParticle(index){

            //How many particles based on stage size
            let numberIndex = container.outerWidth() > MEDIUM_SCREEN_SIZE ? 0 : (container.outerWidth() <= SMALL_SCREEN_SIZE ? 2 : 1 );

            if(index < PARTICLES_NUMBER[numberIndex]){

                let particle = new Particle(Math.random() * stageWidth , Math.random() * stageHeight , getParticleSize(PARTICLE_SIZE));

                particles.push(particle);
                makeParticle(index + 1);

            }

        }

    }

    function setSize(){

        //Reset particles if necessary
        particles = [];

        //Reset stage size
        if(container != null){

            stageWidth =  container.outerWidth();
            stageHeight = container.outerHeight();

        }
        else{

            stageWidth =  _(window).outerWidth();
            stageHeight = _(window).outerHeight();

        }

        stageWidth = stageWidth * ratio;
        stageHeight = stageHeight * ratio;

        canvas.width = stageWidth;
        canvas.height = stageHeight;

    }

    return this;

};

/**
 *
 * @param d {int}
 * @param configuration {Object}
 * @return {jTS}
 */
jTS.fn.show = /*jTS*/function (/*int*/d,/*Object literal*/configuration) {

    const t = this;

    const TIME_GAP = 100;

    let property = 'opacity';
    let easing = 'linear';

    if (arguments.length === 0) {

        t.each(function (i, e) {

            if (_(e).css('display') !== 'none' || _(e).attr('jts_hidden') || _(e).attr('jts_showed')) {

                return;

            }

            setElementStyle(e);

        });

    }
    else if (arguments.length === 1 && typeof arguments[0] === 'number') {

        t.each(fade);

    }
    else if (arguments.length === 2 && typeof arguments[0] === 'number' && typeof arguments[1] === 'object') {

        property = configuration.method === 'slide' ? 'height' : property;
        easing = configuration.easing ? configuration.easing : easing;

        if (configuration.method === 'fade' || !(configuration.method)) {

            t.each(fade);

        }
        else if (configuration.method === 'slide') {

            t.each(slide);

        }

    }
    else {

        console.log('invalid-arguments-list @jTS.show');

    }

    function fade(i, e) {

        if (_(e).css('display') !== 'none' || _(e).attr('jts_hidden') || _(e).attr('jts_showed')) {

            return;

        }

        _(e).attr('jts_showed', true);

        if (configuration && configuration.startCB) {

            configuration.startCB(i, e);

        }

        let originalOpacity = parseFloat(_(e).css('opacity'));

        setElementStyle(e);
        jTS.originalStyles.push([e, _(e).attr('style')]);

        _(e).css('opacity', 0);
        _(e).css('transition', property + ' ' + (d / 1000) + 's ' + easing + ' 0s');

        setTimeout(function () {

            if (_(e).length > 0) {

                _(e).css('opacity', originalOpacity);

            }

        }, 1);

        setTimeout(function () {

            if (_(e).attr('jts_showed')) {

                setElementStyle(e);
                e.attributes.removeNamedItem('jts_showed');

                if (configuration && configuration.endCB) {

                    configuration.endCB(i, e);

                }

            }

        }, d + TIME_GAP);

    }

    function slide(i, e) {

        if (_(e).css('display') !== 'none' || _(e).attr('jts_hidden') || _(e).attr('jts_showed')) {

            return;

        }

        _(e).attr('jts_showed', true);

        if (configuration && configuration.startCB) {

            configuration.startCB(i, e);

        }

        setElementStyle(e);

        jTS.originalStyles.push([e, _(e).attr('style')]);

        let wrapper = document.createElement('div');
        let originalStyle = _(e).attr('style') || '';
        let height = _(e).outerHeight();

        let parent = _(e).offsetPs();

        let wrapperCss = {

            'overflow': 'hidden',
            'box-shadow': _(e).css('box-shadow'),
            'height': 0,
            'width': _(e).outerWidth(),
            'float': _(e).css('float'),
            'margin-top': _(e).css('margin-top'),
            'margin-left': _(e).css('margin-left'),
            'margin-right': _(e).css('margin-right'),
            'margin-bottom': _(e).css('margin-bottom'),
            'border-radius': _(e).css('border-radius'),
            'left': _(e).css('left'),
            'top': _(e).css('top'),
            'right': _(e).css('right'),
            'bottom': _(e).css('bottom'),
            'position': _(e).css('position'),
            'z-index': _(e).css('z-index'),
            'padding' : 0

        };

        let eCss = {

            'margin-left': 0,
            'margin-right': 0,
            'margin-bottom': 0,
            'margin-top': 0,
            'box-shadow': 'none',
            'border-radius': 0,
            'width': '100%',
            'left': 0,
            'top': 0,
            'right': 0,
            'bottom': 0,
            'position': 'absolute',
            'z-index' : 0

        };

        _(wrapper).css(wrapperCss).addClass('jts_hide_wrapper');
        parent.before(wrapper, e);

        _(wrapper).append(e);
        _(e).css(eCss);

        _(wrapper).css('transition', property + ' ' + (d / 1000) + 's ' + easing + ' 0s');

        setTimeout(function () {

            if (_(e).attr('jts_showed')) {

                _(wrapper).css('height', height);

            }

        },TIME_GAP * 0.3);

        setTimeout(function () {

            if (_(e).attr('jts_showed')) {

                parent.before(e, wrapper);
                parent[0].removeChild(wrapper);
                setElementStyle(e);
                e.attributes.removeNamedItem('jts_showed');

                if (configuration && configuration.endCB) {

                    configuration.endCB(i, e);

                }

            }

        }, d + (TIME_GAP * 2));

    }

    function setElementStyle(e) {

        let style = _(e).attr('style');

        for (let i = 0 ; i < jTS.originalStyles.length; i++) {

            if (jTS.originalStyles[i][0] === e) {

                style = jTS.originalStyles[i][1];

                jTS.originalStyles.splice(i, 1);
                break;

            }

        }

        style = style ? style : '';

        if (style.match('display:none;') || style.match('display: none;')) {

            style = style.replace(/display:\s?none;/, '');

        }
        else if(style.match('display : none;')){

            style = style.replace(/display : none;/, '');

        }

        _(e).attr('style', style);

    }

    return this;

};

/**
 *
 * @param animationsUrl {string}
 * @param configuration {Object}
 * @return {jTS}
 */
jTS.fn.showcase =/*jTS*/ function (/*string*/animationsUrl,/*Object literal*/configuration) {

    const t = this;

    if(t.length === 0){

        return t;

    }

    t.each(function(i,e){

        _(e).css('opacity',0);

    });

    let container = t.offsetPs()[0];
    let animations;
    let currentAnimation;

    let usedAnimations = [];
    let fakeLoaderContainer = document.createElement('div');
    let showcaseID = new Date().getTime() + "_" + Math.floor(Math.random() * 500);

    _(container).css('overflow', 'hidden');

    jTS.jJSON(animationsUrl, function (data) {

        animations = data.animations;
        loadPictures();

    });

    function loadPictures() {

        let bar = document.createElement('div');

        let barCSS = {

            'position': 'absolute',
            'height': 10,
            'width': 0,
            'left': 0,
            'bottom': 0,
            'background-color': '#ffba00'

        };

        _(bar).addClass('jts_showcase_bar_' + showcaseID).css(barCSS);
        _(container).append(bar);

        t.each(pushPicture);

        function pushPicture(i,e) {

            let img = new Image();
            img.src = _(e).attr("src");
            img.alt = "showcase_img";

            //this for real loading
            _(fakeLoaderContainer).append(img);
            _(e).dispose();

            let percentage = (100 * ((i + 1) / (t.length - 1))) + '%';

            _('.jts_showcase_bar_' + showcaseID).css('width', percentage);

            if(i === t.length - 1){

                addFakeContainer();

            }

        }

        function addFakeContainer(){

            //this for real loading
            _(fakeLoaderContainer).css('display', 'none').attr('id', 'jts_showcase_flc_' + showcaseID);
            _('.jts_showcase_bar_' + showcaseID).dispose();
            _('body').append(fakeLoaderContainer);

            setShowcase();

        }

    }

    function setShowcase() {

        let START_FADE_IN_DURATION = 3;
        let FADE_IN_DELAY = 100;
        let READY_DELAY = (START_FADE_IN_DURATION * 1000) + 100;
        let ANIMATION_DELAY = configuration.animationDelay || 5000;
        let START_ANIMATION_DELAY = 200;
        let RESET_DELAY = 200;
        let SLIDE_DELAY = 10;
        let BACK_DELAY_T = 1000;
        let BACK_DELAY_S = 1500;
        let TEXT_OUT_LEFT = -300;
        let TEXT_IN_LEFT = 80;

        let fadeID = null;
        let readyID = null;
        let animationID = null;
        let startAnimationID = null;
        let disposeID = null;
        let resetID = null;
        let slideID = null;
        let backSID = null;
        let backTID = null;

        let currentIndex = 0;
        let nextIndex = 1;
        let inAnimation = false;
        let paused = false;

        let textContainer;
        let subtitleContainer;
        let titleContainer;
        let link;
        let previousButton;
        let nextButton;
        let pauseButton;

        let currentImageDiv = document.createElement('div');
        let nextImageDiv = document.createElement('div');

        _(currentImageDiv).attr('id', 'jts_cid_' + showcaseID).css({ 'position': 'absolute', 'z-index': 0, 'width' : '100%' , 'height' : '100%' , 'top' : 0 , 'left' : 0 ,'opacity': 0, 'transition': 'opacity ' + START_FADE_IN_DURATION + 's ease-out' });
        _(nextImageDiv).attr('id', 'jts_nid_' + showcaseID).css({ 'position': 'absolute', 'z-index': 1 , 'width' : '100%' , 'height' : '100%' , 'top' : 0 , 'left' : 0});

        let currentImageCanvas = document.createElement('canvas');
        let currentImageBrush = currentImageCanvas.getContext('2d');

        _(currentImageCanvas).attr({ 'id': 'jts_cic_' + showcaseID, 'alt': 'showcase_img' }).css({ 'position': 'absolute', 'top' : 0 , 'left' : 0 ,'width' : '100%' , 'height' : '100%'});

        resize(false);
        drawCurrentImage();
        addListeners();

        _(currentImageDiv).append(currentImageCanvas);
        _(container).append([currentImageDiv, nextImageDiv]);

        fadeIn();

        function addControls() {

            let CONTROLS_DELAY = 200;

            let controlsActivator = document.createElement('div');
            let controlsID = null;

            previousButton = document.createElement('div');
            nextButton = document.createElement('div');
            pauseButton = document.createElement('div');

            let activatorCss = {

                'position': 'absolute',
                'width': '100%',
                'height': 65,
                'z-index': 10,
                'left' : 0 ,
                'bottom' : 0

            };

            let commonsButtonCSS = {

                'position': 'absolute',
                'width': 50,
                'height': 50,
                'cursor': 'pointer',
                'border-radius': configuration && configuration.controls &&  configuration.controls.radius ? configuration.controls.radius : 3,
                'background-color' : configuration && configuration.controls &&  configuration.controls.background ? configuration.controls.background : 'rgba(255,255,255,0.5)',
                'color' : configuration && configuration.controls &&  configuration.controls.color ? configuration.controls.color :  '#303030' ,
                'font-size' : 40 ,
                'text-align' : 'center',
                'bottom': 15,
                'padding' : '3px 0px 0px 0px',
                'box-shadow' : configuration && configuration.controls &&  configuration.controls.shadow ? configuration.controls.shadow : '2px 2px 5px 0px rgba(0,0,0,0.3)',
                'transition' : 'bottom 0.5s ease-out'

            };

            _(controlsActivator).css(activatorCss);
            _(previousButton).attr('id', 'jts_showcase_previous_button_' + showcaseID).append('<i class="fa fa-step-backward"></i>').addClass('jts_showcase_controls_buttons');
            _(nextButton).attr('id', 'jts_showcase_next_button_' + showcaseID).append('<i class="fa fa-step-forward"></i>').addClass('jts_showcase_controls_buttons');
            _(pauseButton).attr('id', 'jts_showcase_pause_button_' + showcaseID).append('<i class="fa fa-pause"></i>').addClass('jts_showcase_controls_buttons');

            _(previousButton).css(commonsButtonCSS).css('left' , 25);
            _(pauseButton).css(commonsButtonCSS).css('left' , 'calc(50% - 12px)');
            _(nextButton).css(commonsButtonCSS).css('right' , 25);

            _(controlsActivator).append([previousButton,pauseButton,nextButton]);
            _(container).append(controlsActivator);

            if(!jTS.jMobile()){

                controlsID = setTimeout(function(){

                    _('.jts_showcase_controls_buttons').css('bottom' , -65);

                },CONTROLS_DELAY * 5);

            }

            _(controlsActivator).bind('mouseover.jts_showcase_' + showcaseID , function(e){

                clearTimeout(controlsID);
                _('.jts_showcase_controls_buttons').css('bottom' , 15);

            }).bind('mouseout.jts_showcase_' + showcaseID , function(e){

                controlsID = setTimeout(function(){

                    _('.jts_showcase_controls_buttons').css('bottom' , -65);

                },CONTROLS_DELAY);

            });

            _([previousButton, pauseButton , nextButton]).bind('click.jts_showcase_' + showcaseID, activateTransition);

            function activateTransition(e) {

                if (inAnimation) {

                    return;

                }

                clearTimeout(animationID);
                animationID = null;

                let id = _(this).attr('id');

                if (id.match('previous_button')) {

                    nextIndex = currentIndex === 0 ? t.length - 1 : currentIndex - 1;
                    unpause();

                }
                else if(id.match('next_button')){

                    unpause();

                }
                else if(id.match('pause_button')){

                    if(!paused){

                        paused = true;
                        _(pauseButton).html('').append('<i class="fa fa-play"></i>');

                    }
                    else{

                        unpause();

                    }

                }

                function unpause(){

                    paused = false;

                    _(pauseButton).html('').append('<i class="fa fa-pause"></i>');
                    coreAnimation(currentAnimation);

                }

                _(window).emits(jTS.built_in_events.jSHOWCASE_CONTROLS_PRESSED);

            }

        }

        function addListeners() {

            _(window).bind('resize.jts_showcase_' + showcaseID, function (e) {

                if (!getRootN()) {

                    return;

                }

                resize(true);

            });

            _(window).bind('click.jts_showcase_' + showcaseID, function (e) {

                if (!getRootN()) {}

            })

        }

        function addText() {

            textContainer = document.createElement('div');
            subtitleContainer = document.createElement('div');
            titleContainer = document.createElement('div');
            link = document.createElement('a');

            let containerCSS = {

                'position': 'absolute',
                'bottom': 80,
                'width': '150%',
                'z-index': 11,
                'overflow': 'visible'

            };

            let textCSS = {

                'position': 'absolute',
                'width': '100%',
                'left': TEXT_OUT_LEFT,
                'opacity': 0

            };

            let subtitleCSS = {

                'position': 'absolute',
                'width': '100%',
                'left': TEXT_OUT_LEFT,
                'top': 0,
                'opacity': 0,
                'color': configuration && configuration.text && configuration.text.subtitle_color ? configuration.text.subtitle_color : '#303030',
                'font-weight' : configuration && configuration.text && configuration.text.subtitle_weight ? configuration.text.subtitle_weight : 700

            };

            let linkCSS = {

                'text-decoration': 'none',
                'color': configuration && configuration.text && configuration.text.link_color ? configuration.text.link_color : '#ffffff',
                'font-weight' : configuration && configuration.text && configuration.text.link_weight ? configuration.text.link_weight : 700

            };

            let linkAttr = {

                'id': 'jts_showcase_a_' + showcaseID,
                'class': configuration && configuration.text && configuration.text.font_class ? configuration.text.font_class : 'ts-font-elegance',
                'href': configuration.text.link[currentIndex],
                'target': '_blank'

            };

            _(textContainer).attr('id', 'jts_showcase_text_' + showcaseID).css(containerCSS);
            _(subtitleContainer).attr('id', 'jts_showcase_ts_' + showcaseID).css(subtitleCSS);
            _(titleContainer).attr('id', 'jts_showcase_tt_' + showcaseID).css(textCSS);
            _(link).attr(linkAttr).css(linkCSS).html(configuration.text.title[currentIndex]);

            _(subtitleContainer).html(configuration.text.subtitle[currentIndex]);
            _(titleContainer).append(link);

            _(textContainer).append([subtitleContainer, titleContainer]);

            setTextSize();

            _(container).append(textContainer);

            slideID = setTimeout(function () {

                slideText(TEXT_IN_LEFT, 0.8);

            }, SLIDE_DELAY);

        }

        function coreAnimation(animation) {

            inAnimation = true;

            if (configuration && configuration.show_text) {

                slideText(TEXT_OUT_LEFT, 0);

            }

            let SMALL_SCREEN = 736;

            let tiles = [];
            let canvases = [];

            let containerWidth = _(container).outerWidth();
            let containerHeight = _(container).outerHeight();

            let numberOfTiles = containerWidth <= SMALL_SCREEN ? animation.tiles[0] : animation.tiles[1];
            let columns = containerWidth <= SMALL_SCREEN ? animation.columns[0] : animation.columns[1];
            let rows = containerWidth <= SMALL_SCREEN ? animation.rows[0] : animation.rows[1];
            let disposeDelay = containerWidth <= SMALL_SCREEN ? animation.dispose_delay[0] : animation.dispose_delay[1];

            let tileWidth = Math.round(containerWidth / columns);
            let tileHeight = Math.round(containerHeight / rows);
            let lastTileWidth = containerWidth - (tileWidth * (columns - 1));
            let lastTileHeight = containerHeight - (tileHeight * (rows - 1));

            setTiles(0);

            let pos = null;
            let size = null;
            let opacity = null;
            let transform = null;

            if (animation.double) {

                setTiles(1);

            }

            if (animation.start_pos) {

                pos = containerWidth <= SMALL_SCREEN ? animation.start_pos[0] : animation.start_pos[1];

            }

            if (animation.start_size) {

                size = containerWidth <= SMALL_SCREEN ? animation.start_size[0] : animation.start_size[1];

            }

            if (animation.start_opacity) {

                opacity = containerWidth <= SMALL_SCREEN ? animation.start_opacity[0] : animation.start_opacity[1];

            }

            if (animation.start_transform) {

                transform = containerWidth <= SMALL_SCREEN ? animation.start_transform[0] : animation.start_transform[1];

            }

            let transition = containerWidth <= SMALL_SCREEN ? animation.transition[0] : animation.transition[1];

            setCanvases(0);

            if (animation.double) {

                setCanvases(1);

            }

            startAnimationID = setTimeout(startAnimation, START_ANIMATION_DELAY);

            function setCanvases(canvasIndex) {

                let image = animation.double && canvasIndex === 0 ? t[currentIndex] : t[nextIndex];
                let add = canvasIndex > 0 ? numberOfTiles : 0;
                let cropData = getImageSizeAndOffset(image);
                let cropWidth = tileWidth * (cropData.width / containerWidth);
                let cropHeight = tileHeight * (cropData.height / containerHeight);

                for (let i = 0; i < numberOfTiles; i++) {

                    let cropCurrentW = Math.floor(i % columns) === columns - 1 ? _(tiles[i]).outerWidth() * (cropData.width / containerWidth) : cropWidth;
                    let cropCurrentH = Math.floor(i / columns) === rows - 1 ? _(tiles[i]).outerHeight() * (cropData.height / containerHeight) : cropHeight;

                    if (cropCurrentW > image.naturalWidth) {

                       // cropCurrentW = image.naturalWidth;

                    }

                    if (cropCurrentH > image.naturalHeight) {

                       // cropCurrentH = image.naturalHeight;

                    }

                    let canvas = document.createElement('canvas');
                    canvas.setAttribute('id', animation.name + '_canvas_' + canvasIndex + i + showcaseID);

                    canvas.width = cropCurrentW;
                    canvas.height = cropCurrentH;

                    let css = {

                        'position': 'absolute',
                        'width': '100%',
                        'height': '100%',
                        'z-index': canvasIndex > 0 ? 1 : 2,
                        'transition': transition[i]

                    };

                    if (pos) {

                        css.left = pos[i + (add * (canvasIndex * 2))];
                        css.top = pos[(i + numberOfTiles) + (add * (canvasIndex * 2))];

                    }

                    if (size) {

                        css.width = size[i + (add * (canvasIndex * 2))];
                        css.height = size[(i + numberOfTiles) + (add * (canvasIndex * 2))];

                    }

                    if (opacity) {

                        css.opacity = opacity[i + add];

                    }

                    if (transform) {

                        css.transform = transform[i + add];

                    }

                    _(canvas).css(css);

                    let drawX = (Math.floor(i % columns) * cropWidth) + cropData.offsetX;
                    let drawY = (Math.floor(i / columns) * cropHeight) + cropData.offsetY;
                    let b = canvas.getContext('2d');

                    b.drawImage(
                        image,
                        drawX, drawY, cropCurrentW, cropCurrentH,
                        0, 0, canvas.width, canvas.height
                    );

                    _(tiles[i + add]).append(canvas);
                    canvases.push(canvas);

                }

            }

            function setTiles(tileIndex) {

                for (let i = 0; i < numberOfTiles; i++) {

                    let tileX = Math.floor(i % columns) * tileWidth;
                    let tileY = Math.floor(i / columns) * tileHeight;

                    let tileCurrentW = Math.floor(i % columns) === columns - 1 ? lastTileWidth : tileWidth;
                    let tileCurrentH = Math.floor(i / columns) === rows - 1 ? lastTileHeight : tileHeight;

                    let tile = document.createElement('div');
                    tile.setAttribute('id', animation.name + '_tile_' + tileIndex + i + showcaseID);

                    let css = {

                        'position': 'absolute',
                        'width': tileCurrentW,
                        'height': tileCurrentH,
                        'left': tileX,
                        'top': tileY,
                        'overflow': animation.overflow

                    };

                    _(tile).css(css);

                    _(nextImageDiv).append(tile);
                    tiles.push(tile);

                }

            }

            function startAnimation() {

                if (!animation.back_visible) {

                    _(currentImageDiv).css('visibility', 'hidden');

                }

                startTransition();

                function startTransition() {

                    let add = animation.double ? 2 : 1;

                    let pos = null;
                    let size = null;
                    let opacity = null;
                    let transform = null;

                    if (animation.stop_pos) {

                        pos = containerWidth <= SMALL_SCREEN ? animation.stop_pos[0] : animation.stop_pos[1];

                    }

                    if (animation.stop_size) {

                        size = containerWidth <= SMALL_SCREEN ? animation.stop_size[0] : animation.stop_size[1];

                    }

                    if (animation.stop_opacity) {

                        opacity = containerWidth <= SMALL_SCREEN ? animation.stop_opacity[0] : animation.stop_opacity[1];

                    }

                    if (animation.stop_transform) {

                        transform = containerWidth <= SMALL_SCREEN ? animation.stop_transform[0] : animation.stop_transform[1];

                    }

                    for (let i = 0 ; i < canvases.length; i++) {

                        let css = {};

                        if (pos) {

                            css.left = pos[i];
                            css.top = pos[i + (numberOfTiles * add)];

                        }

                        if (size) {

                            css.width = size[i];
                            css.height = size[i + (numberOfTiles * add)];

                        }

                        if (opacity) {

                            css.opacity = opacity[i];

                        }

                        if (transform) {

                            css.transform = transform[i]

                        }

                        _(canvases[i]).css(css);

                    }

                    _(window).emits(jTS.built_in_events.jSHOWCASE_ANIMATION_START);

                    disposeID = setTimeout(clearAnimation, disposeDelay);

                }

            }

            function clearAnimation() {

                if (configuration && configuration.show_text) {

                    _(subtitleContainer).html(configuration.text.subtitle[nextIndex]);
                    _(link).attr('href', configuration.text.link[nextIndex]).html(configuration.text.title[nextIndex]);

                    slideText(TEXT_IN_LEFT, 0.8);

                }

                currentIndex = nextIndex;
                nextIndex = nextIndex === t.length - 1 ? 0 : nextIndex + 1;

                drawCurrentImage();

                _(currentImageDiv).css('visibility', 'visible');

                resetID = setTimeout(function () {

                    nextImageDiv.innerHTML = '';
                    _(window).emits(jTS.built_in_events.jSHOWCASE_ANIMATION_END);
                    setNextAnimation();

                }, RESET_DELAY);

            }

        }

        function drawCurrentImage(){

            let cropData = getImageSizeAndOffset(t[currentIndex]);

            currentImageBrush.clearRect(0,0,currentImageCanvas.width,currentImageCanvas.height);

            currentImageBrush.drawImage(
                t[currentIndex],
                cropData.offsetX,cropData.offsetY,cropData.width,cropData.height,
                0,0,currentImageCanvas.width,currentImageCanvas.height
            );

        }

        function fadeIn() {

            fadeID = setTimeout(innerFadeIn, FADE_IN_DELAY);

            function innerFadeIn(){

                _(currentImageDiv).css('opacity', 1);

                readyID = setTimeout(function () {

                    _(window).emits(jTS.built_in_events.jSHOWCASE_READY);

                    setNextAnimation();

                    if (configuration && configuration.controllable) {

                        addControls();

                    }

                    if (configuration && configuration.show_text) {

                        addText();

                    }

                }, READY_DELAY);


            }

        }

        function getImageSizeAndOffset(image){

            let containerWidth = _(container).outerWidth();
            let containerHeight = _(container).outerHeight();
            let originalWidth = image.naturalWidth;
            let originalHeight = image.naturalHeight;

            let width , height , offsetX , offsetY;

            if (containerWidth >= containerHeight) {

                parseHeight(containerWidth);

            }
            else {


                parseWidth(containerHeight);

            }

            offsetX = Math.abs((containerWidth * 0.5) - (width * 0.5));
            offsetY = Math.abs((containerHeight * 0.5) - (height * 0.5));

            function parseHeight(w) {

                width = w;
                height = originalHeight * (w / originalWidth);

                if (height < containerHeight) {

                    parseHeight(w + 1);

                }

            }

            function parseWidth(h) {

                height = h;
                width = originalWidth * (h / originalHeight);

                if (width < containerWidth) {

                    parseWidth(h + 1);

                }

            }

            let cropWidth = containerWidth * (originalWidth / width);
            let cropHeight = containerHeight * (originalHeight / height);

            offsetX = offsetX * (originalWidth / width);
            offsetY = offsetY * (originalHeight / height);

            return { 'width': cropWidth, 'height': cropHeight, 'offsetX': offsetX, 'offsetY': offsetY };

        }

        function getRootN() {

            let e_parent = container;
            let r_parent = e_parent;

            while (e_parent) {

                e_parent = _(e_parent).offsetPs()[0];

                if (e_parent) {

                    r_parent = e_parent;

                }

            }

            if (r_parent.nodeName.toLowerCase() !== '#document') {

                _(window).unbind('.jts_showcase_' + showcaseID);

                if (previousButton && nextButton) {

                    _([previousButton, nextButton]).unbind('click');

                }

                return false;

            }
            else {

                return true;

            }

        }

        function resize(needRedraw) {

            let containerWidth = _(container).outerWidth();
            let containerHeight = _(container).outerHeight();

            currentImageCanvas.width = containerWidth * devicePixelRatio;
            currentImageCanvas.height = containerHeight * devicePixelRatio;

            if(needRedraw && !inAnimation){

                drawCurrentImage();

            }

            if (configuration && configuration.show_text) {

                if (_('#jts_showcase_text_' + showcaseID)) {

                    setTextSize();

                }

            }

        }

        function setNextAnimation() {

            if (animations.length === 0) {

                for (let i = 0; i < usedAnimations.length; i++) {

                    animations.push(usedAnimations[i]);

                }

                usedAnimations.length = 0;

            }

            let animationIndex = Math.floor(Math.random() * animations.length);
            currentAnimation = animations[animationIndex];

            usedAnimations.push(animations[animationIndex]);
            animations.splice(animationIndex, 1);

            inAnimation = false;

            animationID = setTimeout(function () {

                coreAnimation(currentAnimation);

            }, ANIMATION_DELAY);

        }

        function setTextSize() {


            let WIDTH_SET = [0, 360, 560, 760, 1000, 1400, 10000];

            let CONTAINER_LEFT = [15, 30, 50, 60, 65, 65];
            let CONTAINER_HEIGHT = [62, 83, 95, 106, 116, 120];
            let SUBTITLE_HEIGHT = [20, 25, 28, 28, 30, 30];
            let SUBTITLE_FONT = [16, 21, 23, 23, 25, 25];
            let TITLE_HEIGHT = [47, 65, 77, 89, 101, 105];
            let TITLE_TOP = [15, 18, 18, 17, 15, 15];
            let LINK_FONT = [40, 55, 65, 76, 85, 90];

            let w = _(container).outerWidth();

            for (let i = 0; i < WIDTH_SET.length - 1; i++) {

                if (w > WIDTH_SET[i] && w <= WIDTH_SET[i + 1]) {

                    _(textContainer).css({ 'height': CONTAINER_HEIGHT[i], 'left': CONTAINER_LEFT[i] });
                    _(subtitleContainer).css({ 'height': SUBTITLE_HEIGHT[i], 'font-size': SUBTITLE_FONT[i] });
                    _(titleContainer).css({ 'height': TITLE_HEIGHT[i], 'top': TITLE_TOP[i] });
                    _(link).css('font-size', LINK_FONT[i]);
                    break;

                }

            }

        }

        function slideText(left, opacity) {


            clearTimeout(backTID);
            clearTimeout(backSID);

            let css = {

                'left': left,
                'opacity': opacity

            };

            _('#jts_showcase_ts_' + showcaseID).css('transition', 'opacity 1s ease-out 0.3s , left 1s ease-out 0.3s');
            _('#jts_showcase_tt_' + showcaseID).css('transition', 'opacity 1s ease-out 0s , left 1s ease-out 0s');
            _('#jts_showcase_ts_' + showcaseID).css(css);
            _('#jts_showcase_tt_' + showcaseID).css(css);

            if (left > 0) {

                backTID = setTimeout(function () {

                    _('#jts_showcase_tt_' + showcaseID).css('transition', 'opacity 0.5s ease-out , left 0.8s ease-in-out');
                    _('#jts_showcase_tt_' + showcaseID).css('left', 0).css('opacity', 1);

                }, BACK_DELAY_T);

                backSID = setTimeout(function () {

                    _('#jts_showcase_ts_' + showcaseID).css('transition', 'opacity 0.5s ease-out , left 0.8s ease-in-out');
                    _('#jts_showcase_ts_' + showcaseID).css('left', 0).css('opacity', 1);

                }, BACK_DELAY_S);

            }

        }

    }

    return this;

};

/**
 *
 * @param delay {int}
 * @return {jTS}
 */
jTS.fn.simpleSlide =/*jTS*/ function(/*int*/delay){

    const t = this;

    if(t.length === 0){

        return t;

    }

    if(delay && delay < 3000){

        delay = 3000;

    }

    let container = t.offsetPs();
    let containerWidth = _(container).outerWidth();
    let containerHeight = _(container).outerHeight();
    let showedImageIndex = 0;
    let resizeID = null;
    let slideDelay = delay ? delay : 10000;
    let slideID = new Date().getTime() + "_" + Math.floor(Math.random() * 500);

    container.css("background-color","#ffffff");

    setPicturesSize();
    setShowedImage();
    addListeners();
    startSlide();

    function addListeners(){

        _(window).bind('resize.jts_simple_slide_events_' + slideID,function(){

            clearTimeout(resizeID);

            resizeID = setTimeout(function(){

                containerWidth = _(container).outerWidth();
                containerHeight = _(container).outerHeight();

                setPicturesSize();

            },200);

        });

    }

    function getImageSize(img) {

        let originalWidth = img.naturalWidth;
        let originalHeight = img.naturalHeight;

        let data = null;

        if(containerWidth >= containerHeight){

            data = parseHeight(containerWidth);

        }
        else{

            data = parseWidth(containerHeight);

        }

        function parseHeight(width) {

            let w = width;
            let h = originalHeight * (w/originalWidth);

            if(h <= containerHeight){

                return parseHeight(width + 2);

            }
            else{

                return {'width':w,'height':h};

            }

        }

        function parseWidth(height) {

            let h = height;
            let w = originalWidth * (h/originalHeight);

            if(w <= containerWidth){

                return parseWidth(height + 2);

            }
            else{

                return {'width':w,'height':h};

            }

        }

        return data;

    }

    function setPicturesSize() {

        t.each(setSizeAndPosition);

    }

    function setShowedImage(){

        t.css({
            'transition': 'none',
            'opacity': 0
        });

        t.each(function(i,e){

            if(i === showedImageIndex){

                _(e).css('opacity',1);

            }

        });

    }

    function setSizeAndPosition(i,e) {

        let size = getImageSize(e);
        let width = size.width;
        let height = size.height;

        _(e).css({

            'width':width,
            'height':height,
            'left': (containerWidth * 0.5) - (width * 0.5),
            'top' : (containerHeight * 0.5) - (height * 0.5),
            'position' : 'absolute'

        });

    }

    function startSlide(){

        setTimeout(function(){

            _(t[showedImageIndex]).css('transition', 'opacity 0.7s linear');

            setTimeout(function(){

                _(t[showedImageIndex]).css('opacity',0);
                showedImageIndex = showedImageIndex + 1 === t.length ? 0 : showedImageIndex + 1;
                _(t[showedImageIndex]).css('transition', 'opacity 0.7s linear');

            },10);

            setTimeout(function(){

                _(t[showedImageIndex]).css('opacity',1);

            },1010);

            setTimeout(function(){

                setShowedImage();
                startSlide();

            },1710);

        },slideDelay);

    }

    return this;

};

/**
 *
 * @param configuration {Object}
 * @return {jTS}
 */
jTS.fn.touchScroll = /*jTS*/ function(/*Object literal*/configuration){

    const t = this;

    t.each(activate);

    function activate(i,e){

        /*Constants*/
        const stepWidth = configuration.step_width;
        const totalWidth = configuration.total_width;
        const stepVx = configuration.step_vx;/*higher value increase the easing time*/
        const showHandle = configuration.show_handle;
        const steps = Math.ceil(totalWidth / stepWidth);
        const jElement = _(e);

        /*Position variables*/
        let stepIndex = 0;
        let stepsPositions = [];
        let translateX = 0;
        let targetPos = 0;
        let transitionTime = 0;
        let handle;
        let handleTranslateX;

        /*Moving variables*/
        let startTouch = 0;
        let endTouch = 0;
        let currentX = 0;
        let currentY = 0;
        let previousX = 0;
        let previousY = 0;
        let vX = 0;
        let vY = 0;

        /*Find every step position*/
        for(let i = 0; i < steps; i++){

            stepsPositions.push(stepWidth * i);

        }

        /*Initialize handle if needed*/
        if(showHandle){


            handle = _(`<div class="jts-touch-scroll-handle"></div>`).css({

                'position' : 'absolute',
                'top' : 0,
                'left' : 0,
                'height' : 5,
                'width' : stepWidth * (stepWidth / totalWidth),
                'border-radius' : 5,
                'opacity' : 0,
                'background-color' : '#9e9e9e'

            }).addClass(configuration.handle_class ? configuration.handle_class : '');

            jElement.offsetPs().append(handle);

        }

        jElement.mouseDown(function(e){

            e.preventDefault();

            /*Reset transitions*/
            _(this).css({

                transition : 'unset'

            });

            if(showHandle && stepWidth < totalWidth){

                handle.css({

                    'transition' : 'opacity 1.5s ease-out',
                    'opacity' : 1,

                });

            }

            startTouch = new Date().getTime();

            /*Initialize mouse position*/
            currentX = e.type === 'mousedown' ? e.screenX : e.touches[0].clientX;
            currentY = e.type === 'mousedown' ? e.screenY: e.touches[0].clientY;

            previousX = currentX;
            previousY = currentY;

            _(window).mouseMove('touch_scroll_events',function(e){

                currentX = e.type === 'mousemove' ? e.screenX : e.touches[0].clientX;
                currentY = e.type === 'mousemove' ? e.screenY: e.touches[0].clientY;

                /*Compute vX and vY*/
                vX = currentX - previousX;
                vY = currentY - previousY;

                previousX = currentX;
                previousY = currentY;

                /*Check if vX need to be reduced */
                if(translateX > 0 && vX > 0 || translateX + totalWidth < stepWidth && vX < 0){

                    vX = Math.cos(Math.atan2(vY,vX)) * 0.5;

                }

                translateX += vX;

                /*Apply translate*/
                jElement.css({

                    transform : `translateX(${translateX}px)`

                });

                if(showHandle && stepWidth < totalWidth){

                    translateHandle();

                }

                /*Compute the slider step index*/
                stepIndex = Math.floor(Math.abs(translateX - (stepWidth * 0.5)) / stepWidth);


            }).mouseUp('touch_scroll_events',function(e){

                endTouch = new Date().getTime();

                _(window).unbind('.touch_scroll_events');

                /*Compute translate x and transition time*/
                targetPos = -stepsPositions[stepIndex];
                transitionTime = stepVx * (Math.abs(targetPos - translateX) / stepWidth);
                translateX = targetPos;

                /*Apply translate*/
                jElement.css({

                    transition : `transform ${transitionTime}s ease-out`,
                    transform : `translateX(${targetPos}px)`

                });

                if(showHandle && stepWidth < totalWidth){

                    handle.css({

                        'transition' : `transform ${transitionTime}s ease-out , opacity 1.5s ease-out`,
                        'opacity' : 0

                    });

                    translateHandle();

                }

                /*Emits an event with the current step index for outside listeners*/
                _(window).emits(jTS.built_in_events.jTOUCH_SCROLL_STEP,{'current_step' : stepIndex});


            });


        });

        function translateHandle(){

            handleTranslateX = Math.abs(translateX) * (stepWidth / totalWidth);
            handleTranslateX = translateX > 0 ? 0 : (translateX + totalWidth < stepWidth ? stepWidth - handle.outerWidth() : handleTranslateX);

            handle.css({

                transform : `translateX(${handleTranslateX}px)`

            });

        }

    }

    return t;

};

/*END ANIMATION PACKAGE*/





/*CORE PACKAGE*/

/**
 *
 * @return {jTS}
 */
jTS.fn.clone = /*jTS*/function () {

    const t = this;

    let e = [];

    t.each(pushE);

    function pushE(index, element) {

        let clone = element.cloneNode(true);

        e.push(clone);

    }

    return _(e);

};

/**
 *
 * @return {jTS}
 */
jTS.fn.first = /*jTS*/ function(){

    const t = this;

    return t.length  > 0 ?_(t[0]) : t;

};

/**
 *
 * @param list {Array}
 * @param sortFlags {string}
 * @param sortProperty {string}
 * @return {Array}
 */
jTS.jSort = /*Array[number || string || Object literal]*/function (/*Array[number || string || Object literal]*/list,/*string*/sortFlags,/*string*/sortProperty) {

    for (let i = 0; i < 1 ;i++){

        for (let l = 1 ; l < list.length; l++) {

            if (typeof list[i] !== typeof list[l]) {

                console.log('can-not-sort-multiple-types @ jTS.jSort');
                return list;

            }

        }

    }

    let direction =      'a';
    let caseSensitive =  'i';
    let oProperty =      null;

    if (arguments.length > 1 &&  arguments[1] != null  && typeof arguments[1] === 'string') {

        let flags = sortFlags.split('|');

        for(let h = 0; h < flags.length; h++){

            flags[h] = flags[h].toLowerCase().trim();

        }


        if (flags[0] === 'a' || flags[0] === 'd') {

            direction = flags[0];

        }
        else if (flags[0] === 's' || flags[0] === 'i') {

            caseSensitive = flags[0];

        }

        if (flags[1] && (flags[1] === 'a' || flags[1] === 'd')) {

            direction = flags[1];

        }
        else if (flags[1] && (flags[1] === 's' || flags[1] === 'i')) {

            caseSensitive = flags[1];

        }

        if(flags.length === 1 && flags[0].length > 1 && typeof list[0] === 'object'){

            oProperty = flags[0];

        }

    }

    if (arguments.length > 2 && typeof arguments[2] === 'string') {

        oProperty = arguments[2];

    }

    let value =  null;

    sortArray();

    function sortArray() {

        sort(0);

        function sort(index) {

            value = list[index];

            for (let i = index + 1 ; i < list.length ; i++) {

                let currentValue = list[i];

                let valueA = typeof list[0] === 'number' ? value : (typeof list[0] === 'string' ? parseString(value) : getObjectValue(value));
                let valueB = typeof list[0] === 'number' ? currentValue : (typeof list[0] === 'string' ? parseString(currentValue) : getObjectValue(currentValue));

                let a = direction === 'a' ? valueB : valueA;
                let b = direction === 'a' ? valueA : valueB;

                if(a == null || b == null){

                    return;

                }

                if (a < b) {

                    updateValue(i, index);

                }

            }

            if (index < list.length - 1) {

                sort(index + 1);

            }

        }

    }

    function getObjectValue(object) {

        if (typeof object !== 'object' || oProperty == null || object[oProperty] === undefined) {

            console.log('error-in-object-sorting @ jTS.jSort');
            return null;

        }

        return typeof object[oProperty] === 'string' ? parseString(object[oProperty]) : object[oProperty];

    }

    function parseString(string) {

        return caseSensitive === 's' ?  string : string.toLowerCase();

    }

    function updateValue(i,index) {

        value = list[i];

        list.splice(i, 1);
        list.splice(index, 0, value);

    }

    return list;

};

/**
 *
 * @param string {string}
 * @param startIndex {int}
 * @param contentOrLength {*}
 * @return {string}
 */
jTS.jStringSplice = /*string*/function (/*string*/string,/*int*/startIndex ,/*string || int*/contentOrLength) {

    let parsed = '';

    if (typeof arguments[0] !== 'string') {

        console.log('incorrect-string-value @ jTS.jStringSplice');
        return;

    }

    if (typeof arguments[1] !== 'number') {

        console.log('incorrect-startIndex-value @ jTS.jStringSplice');
        return;

    }

    if (typeof arguments[2] === 'string') {

        add();

    }
    else if (typeof arguments[2] === 'number') {

        dispose();

    }
    else {

        console.log('unexpected_value @ jTS.jStringSplice');
        return;

    }

    function add() {

        let sIndex = startIndex < 0 ? 0 : startIndex;

        let first =  string.substr(0, sIndex);
        let second = string.substr(sIndex);

        parsed = first + contentOrLength + second;

    }

    function dispose() {

        let sIndex = startIndex < 0 ? 0 : startIndex;

        let first =  string.substr(0, sIndex);
        let second = string.substr(sIndex);

        second =  second.substr(contentOrLength);
        parsed =  first + second;

    }

    return parsed;

};

/**
 *
 * @return {jTS}
 */
jTS.fn.last = /*jTS*/ function(){

    const t = this;

    return t.length > 0 ? _(t[t.length - 1]) : t;

};

/**
 *
 * @param n {int}
 * @return {*}
 */
jTS.fn.raw = /*HTMLElement*/ function(/*int*/n){

    let t = this;

    if(arguments.length === 0 || typeof arguments[0] !== 'number' || parseInt(n) < 0 || parseInt(n) > t.length - 1){

        return t;

    }

    return t[parseInt(n)];

};

/**
 *
 * @param jTSObject {jTS}
 * @return {jTS}
 */
jTS.fn.weld = /*jTS*/function (/*jTS*/jTSObject) {

    const t = this;

    let e = [];

    t.each(pushElement);
    jTSObject.each(pushElement);

    function pushElement(index, element) {

        e.push(element);

    }

    return _(e);

};

/*END CORE PACKAGE*/





/*CSS PACKAGE*/

/**
 *
 * @param classToAdd {string}
 * @return {jTS}
 */
jTS.fn.addClass = /*jTS*/function (/*string*/classToAdd) {

    const t = this;

    let classArray = classToAdd.trim().split(' ');

    t.each(addValue);

    function addValue(i, e) {

        let oldClass = e.getAttribute('class');
        let oldClassArray = [];

        if(oldClass){

            oldClass = oldClass.trim();
            oldClassArray = oldClass.split(' ');

        }

        for(let i = 0; i < classArray.length; i++){

            if(oldClassArray.indexOf(classArray[i]) !== -1){

                classArray.splice(i,1);
                i--;

            }

        }

        let parsedClass = (oldClass ? oldClass + ' ' : '') + classArray.join(' ');

        e.setAttribute('class', parsedClass);

    }

    return this;

};

/**
 *
 * @param classToAdd {string}
 * @return {jTS}
 */
jTS.fn.addClassRecursive = /*jTS*/function (/*string*/classToAdd) {

    const t = this;

    t.each(addValue);

    function addValue(i, e) {

        const NODE_TYPE = 1;

        if (e.nodeType === NODE_TYPE) {

            _(e).addClass(classToAdd);

            let children = _(e.childNodes);

            children.addClassRecursive(classToAdd);

        }

    }

    return this;

};

/**
 *
 * @param properties {*}
 * @param value {*}
 * @return {*}
 */
jTS.fn.css = /*jTS || CSS value*/function (/*string || Object literal*/properties,/*string || number*/value) {

    const t = this;

    if(t.length ===0){

        return t;

    }

    if (arguments.length === 1 && typeof arguments[0] === 'string') {

        return getProperty(properties);

    }
    else if (arguments.length === 1 && typeof arguments[0] === 'object') {

        setProperties(properties);

    }
    else if (arguments.length === 2 && typeof arguments[0] === 'string') {

        let propertiesObject = {};

        propertiesObject[properties] = value;
        setProperties(propertiesObject);

    }
    else{

        console.log('arguments-list-error @ jTS.css');
        return t;

    }

    function getProperty(p) {

        let value;

        switch (p) {

            case 'bottom':
                value = getPropertyValue(t[0], p) || t[0].offsetParent.getBoundingClientRect().height - (t[0].offsetTop + t[0].getBoundingClientRect().height) + 'px';
                break;
            case 'height':
                value = t[0].getBoundingClientRect().height + 'px';
                break;
            case 'left':
                value = getPropertyValue(t[0], p) || t[0].offsetLeft + 'px';
                break;
            case 'margin':
                value = JSON.stringify({
                    'left': getPropertyValue(t[0], 'margin-left'), 'top': getPropertyValue(t[0], 'margin-top'),
                    'right': getPropertyValue(t[0], 'margin-right'), 'bottom': getPropertyValue(t[0], 'margin-bottom')
                });
                break;
            case 'padding':
                value = JSON.stringify({
                    'left': getPropertyValue(t[0], 'padding-left'), 'top': getPropertyValue(t[0], 'padding-top'),
                    'right': getPropertyValue(t[0], 'padding-right'), 'bottom': getPropertyValue(t[0], 'padding-bottom')
                });
                break;
            case 'right':
                value = getPropertyValue(t[0], p) || t[0].offsetParent.getBoundingClientRect().width - (t[0].offsetLeft + t[0].getBoundingClientRect().width) + 'px';
                break;
            case 'top':
                value = getPropertyValue(t[0], p) || t[0].offsetTop + 'px';
                break;
            case 'width':
                value = t[0].getBoundingClientRect().width + 'px';
                break;
            default:
                value = getPropertyValue(t[0], p);
                break;

        }

        function getPropertyValue(e, p) {

            return e.style[parsePropertyName(p)] || getFromComputed(e, p) || getFromStyles(e, p) || jTS.cssMap[p];

        }

        function getFromComputed(e, p) {

            return getComputedStyle(e).getPropertyValue(p);

        }

        function getFromStyles(e, p) {

            let classList = e.getAttribute('class');
            let id = e.getAttribute('id');
            let tag = e.tagName;

            if (classList) {

                classList = classList.split(' ');

            }
            else {

                classList = [];

            }

            let stylesObjects = document.styleSheets;

            if (stylesObjects) {

                for (let i = stylesObjects.length - 1 ; i >= 0 ; i--) {

                    let rulesSet = stylesObjects[i].cssRules || stylesObjects[i].rules;

                    if (rulesSet) {

                        for (let l = rulesSet.length - 1 ; l >= 0 ; l--) {

                            let rule = rulesSet[l];

                            if (rule && rule.type === 1) {

                                let selectorText = rule.selectorText;
                                let classFlag = false;

                                for (let h = 0; h < classList.length; h++) {

                                    if (selectorText.slice(1) === classList[h]) {

                                        classFlag = true;
                                        break;

                                    }

                                }

                                if (selectorText === '#' + id || classFlag || selectorText === t.selector || selectorText === tag || selectorText === '*') {

                                    let style = rule.style;

                                    if (style) {

                                        let css = style[p];

                                        if (css) {

                                            return css;

                                        }

                                    }

                                }

                            }

                        }

                    }

                }

            }

            return null;

        }

        return value;

    }

    function setProperties(p) {

        t.each(function (i, e) {

            for (let cssProperty in p) {

                if(p.hasOwnProperty(cssProperty)){

                    let v = (typeof p[cssProperty]).toLowerCase() === 'number' ? getValueExtension(cssProperty, p[cssProperty]) : String(p[cssProperty]);

                    e.style.setProperty(cssProperty,v,'');

                }

            }

        });

        function getValueExtension(n, v) {

            let PROPERTIES_SET = ['z-index', 'opacity', 'font-weight', 'line-height', 'fill-opacity', 'column-count'];

            let flag = false;

            for (let i = 0; i < PROPERTIES_SET.length ; i++) {

                if (n === PROPERTIES_SET[i]) {

                    flag = true;
                    break;

                }

            }

            if (!flag) {

                v = v + 'px';

            }

            return v;

        }

    }

    function parsePropertyName(p) {

        let array = p.split('-');
        let name = array[0];

        function addChunk(name, index) {

            if (array.length === 1) {

                return name;

            }

            name += array[index].charAt(0).toUpperCase() + array[index].slice(1);

            if (index === array.length - 1) {

                return name;

            }
            else {

                return addChunk(name, index + 1);

            }

        }

        return addChunk(name, 1);

    }

    return this;

};

/**
 *
 * @param left {*}
 * @param top {*}
 * @return {*}
 */
jTS.fn.documentCoordinates = /*Object literal || jTS*/ function (/*string || number*/left, /*string || number*/top) {

    const t = this;

    if(t.length === 0){

        return t;

    }

    if (arguments.length === 0) {

        return getCoordinates();

    }
    else {

        let flag = true;

        if (arguments[0] != null) {

            if (typeof arguments[0] !== 'number' && typeof arguments[0] !== 'string') {

                console.log('not-valid-parameters-list @documentCoordinates');
                flag = false;

            }

        }

        if (arguments[1]) {

            if (typeof arguments[1] !== 'number' && typeof arguments[1] !== 'string') {

                console.log('not-valid-parameters-list @documentCoordinates');
                flag = false;

            }

        }

        processArguments();

        if((left && isNaN(left)) || (top && isNaN(top))){

            flag = false;

        }

        if (flag) {

            t.each(assignArguments);

        }

    }

    function processArguments() {

        if (left) {

            if (typeof left === 'string') {

                left = parseFloat(left);

            }

        }

        if (top) {

            if (typeof top === 'string') {

                top = parseFloat(top);

            }

        }

    }

    function assignArguments(i, e) {

        let p = e.offsetParent;

        while (p) {

            if (left || left === 0) {

                left -= p.offsetLeft;

            }

            if (top || top === 0) {

                top -= p.offsetTop;

            }

            p = p.offsetParent;

        }

        if (left || left === 0) {

            left = left + 'px';
            e.style.left = left;

        }
        else {

            e.style.left = e.offsetLeft + 'px';

        }

        if (top || top === 0) {

            top = top + 'px';
            e.style.top = top;

        }
        else {

            e.style.top = e.offsetTop + 'px';

        }

        e.style.position = 'absolute';

    }

    function getCoordinates() {

        let coordinates = t.first().elementGlobalPosition();

        return {

            "left": coordinates.x,
            "top": coordinates.y

        }

    }

    return this;

};

/**
 *
 * @param classToFind {string}
 * @return {boolean}
 */
jTS.fn.hasClass = /*boolean*/function (/*string*/classToFind) {

    const t = this;

    if(t.length === 0){

        return false;

    }

    let classValue = classToFind.trim().split(' ')[0];
    let oldClass = t[0].getAttribute('class');
    let oldClassArray = oldClass ? oldClass.split(' ') :  [];

    return oldClassArray.indexOf(classValue) !== -1;

};

/**
 *
 * @param value {*}
 * @return {*}
 */
jTS.fn.height = /*number || jTS*/function (/*number || string*/value) {

    const t = this;

    if(t.length === 0){

        return t;

    }

    if (t[0] === window) {

        return window.innerHeight;

    }

    if (t[0] === document) {

        return _('html').outerHeight();

    }

    if (arguments.length !== 0) {

        t.each(function (index, element) {

            let e = _(element);
            let box = e.css('box-sizing');

            switch (box) {
                case 'border-box':
                    e.css('height', computeBorder(e));
                    break;
                case 'content-box':
                    e.css('height', value);
                    break;
                case 'padding-box':
                    e.css('height', computePadding(e));
                    break;

            }

        });

    }
    else {

        let e = _(t[0]);
        let border = parseFloat(e.css('border-top-width')) + parseFloat(e.css('border-bottom-width'));
        let padding = parseFloat(e.css('padding-top')) + parseFloat(e.css('padding-bottom'));
        return ((t[0].getBoundingClientRect().height - border) - padding);

    }

    function computeBorder(e) {

        let border = parseFloat(e.css('border-top-width')) + parseFloat(e.css('border-bottom-width'));
        let padding = parseFloat(e.css('padding-top')) + parseFloat(e.css('padding-bottom'));
        let gap = border + padding;

        if (typeof value === 'number') {

            return value + gap;

        }
        else {

            let suffix = value.substring(value.length - 1);

            if (suffix === 'x') {

                return parseFloat(value) + gap;

            }
            else {

                return 'calc(' + parseFloat(value) + '% + ' + gap + 'px)';

            }

        }

    }

    function computePadding(e) {

        let padding = parseFloat(e.css('padding-top')) + parseFloat(e.css('padding-bottom'));

        if (typeof value === 'number') {

            return value + padding;

        }
        else {

            let suffix = value.substring(value.length - 1);

            if (suffix === 'x') {

                return parseFloat(value) + padding;

            }
            else {

                return 'calc(' + parseFloat(value) + '% + ' + padding + 'px)';

            }

        }

    }

    return this;

};

/**
 *
 * @param left {*}
 * @param top {*}
 * @return {*}
 */
jTS.fn.localCoordinates = /*Object literal|| jTS*/function (/*string || number*/left,/*string || number*/top) {

    const t = this;

    if(t.length === 0){

        return t;

    }

    if (arguments.length === 0) {

        return getCoordinates();

    }
    else {

        let flag = true;

        if (arguments[0] != null) {

            if (typeof arguments[0] !== 'number' && typeof arguments[0] !== 'string') {

                console.log('not-valid-parameters-list @localCoordinates');
                flag = false;

            }

        }

        if (arguments[1]) {

            if (typeof arguments[1] !== 'number' && typeof arguments[1] !== 'string') {

                console.log('not-valid-parameters-list @localCoordinates');
                flag = false;

            }

        }

        processArguments();

        if((left && isNaN(left)) || (top && isNaN(top))){

            flag = false;

        }

        if (flag) {

            t.each(assignArguments);

        }

    }

    function processArguments() {

        if (left || left === 0) {

            if (typeof left === 'string') {

                left = parseFloat(left);

            }

        }

        if (top || top === 0) {

            if (typeof top === 'string') {

                top = parseFloat(top);

            }

        }

    }

    function assignArguments(i, e) {

        if (left || left === 0) {

            left = left + 'px';
            e.style.left = left;

        }
        else {

            e.style.left = e.offsetLeft + 'px';

        }

        if (top || top === 0) {

            top = top + 'px';
            e.style.top = top;

        }
        else {

            e.style.top = e.offsetTop + 'px';

        }

    }

    function getCoordinates() {

        return {

            "left": t[0].offsetLeft,
            "top": t[0].offsetTop

        }

    }

    return this;

};

/**
 *
 * @param valueOrMargin {*}
 * @return {*}
 */
jTS.fn.outerHeight = /*number || jTS*/function (/*number || string || boolean*/valueOrMargin) {

    const t = this;

    if(t.length === 0){

        return t;

    }

    if (t[0] === window) {

        return window.innerHeight;

    }

    if (t[0] === document) {

        return _('html').outerHeight();

    }

    if (arguments.length !== 0) {

        if (typeof arguments[0] === 'boolean') {

            let e = _(t[0]);
            let marginHeight = valueOrMargin ? parseFloat(e.css('margin-top')) + parseFloat(e.css('margin-bottom')) : 0;

            return t[0].getBoundingClientRect().height + marginHeight;

        }
        else {

            t.each(function (index, element) {

                let e = _(element);
                let box = e.css('box-sizing');

                switch (box) {
                    case 'border-box':
                        e.css('height', valueOrMargin);
                        break;
                    case 'content-box':
                        e.css('height', computeContent(e));
                        break;
                    case 'padding-box':
                        e.css('height', computePadding(e));
                        break;

                }

            });

        }

    }
    else {

        return t[0].getBoundingClientRect().height;

    }

    function computeContent(e) {

        let border = parseFloat(e.css('border-top-width')) + parseFloat(e.css('border-bottom-width'));
        let padding = parseFloat(e.css('padding-top')) + parseFloat(e.css('padding-bottom'));
        let gap = border + padding;

        if (typeof valueOrMargin === 'number') {

            return valueOrMargin - gap;

        }
        else {

            let suffix = valueOrMargin.substring(valueOrMargin.length - 1);

            if (suffix === 'x') {

                return parseFloat(valueOrMargin) - gap;

            }
            else {

                return 'calc(' + parseFloat(valueOrMargin) + '% - ' + gap + 'px)';

            }

        }

    }

    function computePadding(e) {

        let border = parseFloat(e.css('border-top-width')) + parseFloat(e.css('border-bottom-width'));

        if (typeof valueOrMargin === 'number') {

            return valueOrMargin - border;

        }
        else {

            let suffix = valueOrMargin.substring(valueOrMargin.length - 1);

            if (suffix === 'x') {

                return parseFloat(valueOrMargin) - border;

            }
            else {

                return 'calc(' + parseFloat(valueOrMargin) + '% - ' + border + 'px)';

            }

        }

    }

    return this;

};

/**
 *
 * @param valueOrMargin {*}
 * @return {*}
 */
jTS.fn.outerWidth = /*number || jTS*/function (/*number || string || boolean*/valueOrMargin) {

    const t = this;

    if(t.length === 0){

        return t;

    }

    if (t[0] === window) {

        return window.innerWidth;

    }

    if (t[0] === document) {

        return _('html').outerWidth();

    }

    if (arguments.length !== 0) {

        if (typeof arguments[0] === 'boolean') {

            let e = _(t[0]);
            let marginWidth = valueOrMargin ? parseFloat(e.css('margin-left')) + parseFloat(e.css('margin-right')) : 0;

            return t[0].getBoundingClientRect().width + marginWidth;

        }
        else {

            t.each(function (index, element) {

                let e = _(element);
                let box = e.css('box-sizing');

                switch (box) {
                    case 'border-box':
                        e.css('width', valueOrMargin);
                        break;
                    case 'content-box':
                        e.css('width', computeContent(e));
                        break;
                    case 'padding-box':
                        e.css('width', computePadding(e));
                        break;

                }

            });

        }

    }
    else {

        return t[0].getBoundingClientRect().width;

    }

    function computeContent(e) {

        let border = parseFloat(e.css('border-left-width')) + parseFloat(e.css('border-right-width'));
        let padding = parseFloat(e.css('padding-left')) + parseFloat(e.css('padding-right'));
        let gap = border + padding;

        if (typeof valueOrMargin === 'number') {

            return valueOrMargin - gap;

        }
        else {

            let suffix = valueOrMargin.substring(valueOrMargin.length - 1);

            if (suffix === 'x') {

                return parseFloat(valueOrMargin) - gap;

            }
            else {

                return 'calc(' + parseFloat(valueOrMargin) + '% - ' + gap + 'px)';

            }

        }

    }

    function computePadding(e) {

        let border = parseFloat(e.css('border-left-width')) + parseFloat(e.css('border-right-width'));

        if (typeof valueOrMargin === 'number') {

            return valueOrMargin - border;

        }
        else {

            let suffix = valueOrMargin.substring(valueOrMargin.length - 1);

            if (suffix === 'x') {

                return parseFloat(valueOrMargin) - border;

            }
            else {

                return 'calc(' + parseFloat(valueOrMargin) + '% - ' + border + 'px)';

            }

        }

    }

    return this;

};

/**
 *
 * @param value {*}
 * @return {*}
 */
jTS.fn.paddingHeight = /*number || jTS*/function (/*number || string*/value) {

    const t = this;

    if(t.length === 0){

        return t;

    }

    if (t[0] === window) {

        return window.innerHeight;

    }

    if (t[0] === document) {

        return _('html').outerHeight();

    }

    if (arguments.length !== 0) {

        t.each(function (index, element) {

            let e = _(element);
            let box = e.css('box-sizing');

            switch (box) {
                case 'border-box':
                    e.css('height', computeBorder(e));
                    break;
                case 'content-box':
                    e.css('height', computeContent(e));
                    break;
                case 'padding-box':
                    e.css('height', value);
                    break;

            }

        });

    }
    else {

        let e = _(t[0]);
        let border = parseFloat(e.css('border-top-width')) + parseFloat(e.css('border-bottom-width'));
        return t[0].getBoundingClientRect().height - border;

    }

    function computeBorder(e) {

        let border = parseFloat(e.css('border-top-width')) + parseFloat(e.css('border-bottom-width'));

        if (typeof value === 'number') {

            return value + border;

        }
        else {

            let suffix = value.substring(value.length - 1);

            if (suffix === 'x') {

                return parseFloat(value) + border;

            }
            else {

                return 'calc(' + parseFloat(value) + '% + ' + border + 'px)';

            }

        }

    }

    function computeContent(e) {

        let padding = parseFloat(e.css('padding-top')) + parseFloat(e.css('padding-bottom'));

        if (typeof value === 'number') {

            return value - padding;

        }
        else {

            let suffix = value.substring(value.length - 1);

            if (suffix === 'x') {

                return parseFloat(value) - padding;

            }
            else {

                return 'calc(' + parseFloat(value) + '% - ' + padding + 'px)';

            }

        }

    }

    return this;

};

/**
 *
 * @param value {*}
 * @return {*}
 */
jTS.fn.paddingWidth = /*number || jTS*/function (/*number || string*/value) {

    const t = this;

    if(t.length === 0){

        return t;

    }

    if (t[0] === window) {

        return window.innerWidth;

    }

    if (t[0] === document) {

        return _('html').outerWidth();

    }

    if (arguments.length !== 0) {

        t.each(function (index, element) {

            let e = _(element);
            let box = e.css('box-sizing');

            switch (box) {
                case 'border-box':
                    e.css('width', computeBorder(e));
                    break;
                case 'content-box':
                    e.css('width', computeContent(e));
                    break;
                case 'padding-box':
                    e.css('width', value);
                    break;

            }

        });

    }
    else {

        let e = _(t[0]);
        let border = parseFloat(e.css('border-left-width')) + parseFloat(e.css('border-right-width'));
        return t[0].getBoundingClientRect().width - border;

    }

    function computeBorder(e) {

        let border = parseFloat(e.css('border-left-width')) + parseFloat(e.css('border-right-width'));

        if (typeof value === 'number') {

            return value + border;

        }
        else {

            let suffix = value.substring(value.length - 1);

            if (suffix === 'x') {

                return parseFloat(value) + border;

            }
            else {

                return 'calc(' + parseFloat(value) + '% + ' + border + 'px)';

            }

        }

    }

    function computeContent(e) {

        let padding = parseFloat(e.css('padding-left')) + parseFloat(e.css('padding-right'));

        if (typeof value === 'number') {

            return value - padding;

        }
        else {

            let suffix = value.substring(value.length - 1);

            if (suffix === 'x') {

                return parseFloat(value) - padding;

            }
            else {

                return 'calc(' + parseFloat(value) + '% - ' + padding + 'px)';

            }

        }

    }

    return this;

};

/**
 *
 * @param classToRemove {string}
 * @return {jTS}
 */
jTS.fn.removeClass = /*jTS*/function (/*string*/classToRemove) {

    const t = this;

    let classToRemoveArray = classToRemove.trim().split(' ');

    t.each(rValue);

    function rValue(i, e) {

        let oldClass = e.getAttribute('class');
        let oldClassArray = oldClass ? oldClass.split(' ') : [];

        for(let i = 0; i < classToRemoveArray.length ; i++){

            let classToR = classToRemoveArray[i].trim();

            if(oldClassArray.indexOf(classToR) !== -1){

                oldClassArray.splice(oldClassArray.indexOf(classToR),1);

            }

        }

        e.setAttribute('class', oldClassArray.join(' ').trim());

    }

    return this;

};

/**
 *
 * @param left {*}
 * @param top {*}
 * @return {*}
 */
jTS.fn.screenCoordinates = /*Object literal|| jTS*/ function (/*string || number*/left, /*string || number*/top) {

    const t = this;

    if(t.length === 0){

        return t;

    }

    let pageOffset = getPageOffset();

    if (arguments.length === 0) {

        return getCoordinates();

    }
    else {

        let flag = true;

        if (arguments[0] != null) {

            if (typeof arguments[0] !== 'number' && typeof arguments[0] !== 'string') {

                console.log('not-valid-parameters-list @jTSscreenCoordinates');
                flag = false;

            }

        }

        if (arguments[1]) {

            if (typeof arguments[1] !== 'number' && typeof arguments[1] !== 'string') {

                console.log('not-valid-parameters-list @jTSscreenCoordinates');
                flag = false;

            }

        }

        processArguments();

        if((left && isNaN(left)) || (top && isNaN(top))){

            flag = false;

        }

        if (flag) {

            t.each(assignArguments);

        }

    }

    function assignArguments(i, e) {

        let p = e.offsetParent;

        while (p) {

            if (left || left === 0) {

                left -= p.offsetLeft;

            }

            if (top || top === 0) {

                top -= p.offsetTop;

            }

            p = p.offsetParent;

        }

        if (left ||  left === 0) {

            left += pageOffset.x;
            left = left + 'px';
            e.style.left = left;

        }
        else {

            e.style.left = e.offsetLeft + 'px';

        }

        if (top || top === 0) {

            top += pageOffset.y;
            top = top + 'px';
            e.style.top = top;

        }
        else {

            e.style.top = e.offsetTop + 'px';

        }

        e.style.position = 'absolute';

    }

    function getCoordinates() {

        let coordinates = t.first().elementGlobalPosition();

        return {

            "left" : coordinates.x - pageOffset.x,
            "top" : coordinates.y - pageOffset.y

        }

    }

    function getPageOffset() {

        let w = window;
        let d = document;

        let scrollX = w.pageXOffset || d.documentElement.scrollLeft || d.body.scrollLeft;
        let scrollY = w.pageYOffset || d.documentElement.scrollTop || d.body.scrollTop;

        return { 'x': scrollX, 'y': scrollY };

    }

    function processArguments() {

        if (left || left === 0) {

            if (typeof left === 'string') {

                left = parseFloat(left);

            }

        }

        if (top || top === 0) {

            if (typeof top === 'string') {

                top = parseFloat(top);

            }

        }

    }

    return this;

};

/**
 *
 * @param classToToggle {string}
 * @return {jTS}
 */
jTS.fn.toggleClass = /*jTS*/function (/*string*/classToToggle) {

    const t = this;

    let classArray = classToToggle.split(' ');

    t.each(toggleVal);

    function toggleVal(i, e) {

        for(let i = 0; i < classArray.length; i++){

            if (_(e).hasClass(classArray[i].trim())) {

                _(e).removeClass(classArray[i].trim());

            }
            else {

                _(e).addClass(classArray[i].trim());

            }

        }

    }

    return this;

};

/**
 *
 * @param value {*}
 * @return {*}
 */
jTS.fn.width = /*number || jTS*/function (/*number || string*/value) {

    const t = this;

    if(t.length === 0){

        return t;

    }

    if (t[0] === window) {

        return window.innerWidth;

    }

    if (t[0] === document) {

        return _('html').outerWidth();

    }

    if (arguments.length !== 0) {

        t.each(function (index, element) {

            let e = _(element);
            let box = e.css('box-sizing');

            switch (box) {
                case 'border-box':
                    e.css('width', computeBorder(e));
                    break;
                case 'content-box':
                    e.css('width', value);
                    break;
                case 'padding-box':
                    e.css('width', computePadding(e));
                    break;

            }

        });

    }
    else {

        let e = _(t[0]);
        let border = parseFloat(e.css('border-left-width')) + parseFloat(e.css('border-right-width'));
        let padding = parseFloat(e.css('padding-left')) + parseFloat(e.css('padding-right'));

        return ((t[0].getBoundingClientRect().width - border) - padding);

    }

    function computeBorder(e) {

        let border = parseFloat(e.css('border-left-width')) + parseFloat(e.css('border-right-width'));
        let padding = parseFloat(e.css('padding-left')) + parseFloat(e.css('padding-right'));
        let gap = border + padding;

        if (typeof value === 'number') {

            return value + gap;

        }
        else {

            let suffix = value.substring(value.length - 1);

            if (suffix === 'x') {

                return parseFloat(value) + gap;

            }
            else {

                return 'calc(' + parseFloat(value) + '% + ' + gap + 'px)';

            }

        }

    }

    function computePadding(e) {

        let padding = parseFloat(e.css('padding-left')) + parseFloat(e.css('padding-right'));

        if (typeof value === 'number') {

            return value + padding;

        }
        else {

            let suffix = value.substring(value.length - 1);

            if (suffix === 'x') {

                return parseFloat(value) + padding;

            }
            else {

                return 'calc(' + parseFloat(value) + '% + ' + padding + 'px)';

            }

        }

    }

    return this;

};

/*END CSS PACKAGE*/




/*DOM HANDLING PACKAGE*/

/**
 *
 * @param value {boolean}
 * @return {*}
 */
jTS.fn.active = /*boolean || jTS*/ function(/*boolean*/value){

    const t = this;

    if(arguments.length === 1){

        t.attr('active',value);

        return t;

    }else{

        return t.attr('active');

    }

};

/**
 *
 * @param content {*}
 * @param after {*}
 * @return {jTS}
 */
jTS.fn.append = /*jTS*/function (/*DOM Element || Node List || string || number || Array[Any] || jTS*/content, /*string || DOM Element*/after) {

    const t = this;

    let jTSObject = [];
    let constructor = String(content.constructor);

    if (constructor.match(/\/\*jTS constructor fingerprint\*\//)) {

        jTSObject = content;

    }
    else {

        jTSObject = _(content);

    }

    if (jTSObject.length === 0 && constructor.match(/String/)) {

        jTSObject = [];
        parseChildNodes(content);

    }

    if (jTSObject.length === 0 && constructor.match(/Number/)) {

        jTSObject = [];
        parseChildNodes(content.toString());

    }

    if (constructor.match(/Array/)) {

        jTSObject = [];

        for (let i = 0; i < content.length; i++) {

            let currentObject = _(content[i]);

            if (currentObject.length === 0 && (typeof content[i] === 'string' || typeof content[i] === 'number')) {

                parseChildNodes(content[i].toString());

            }
            else if (currentObject.length > 0) {

                currentObject.each(function (i, e) {

                    jTSObject.push(e);

                });

            }

        }

    }

    function parseChildNodes(val) {

        let canvas = document.createElement('div');

        canvas.innerHTML = val;

        for (let i = 0; i < canvas.childNodes.length ; i++) {

            jTSObject.push(canvas.childNodes[i]);

        }

    }

    t.each(addList);

    function addList(index, e) {

        let target = null;
        let children = null;
        let flag = false;

        if (after) {

            target = _(after);

            if (target.length > 0) {

                children = e.childNodes;

            }

        }

        if (children) {

            for (let i = 0; i < children.length; i++) {

                let child = children[i];

                for (let n = 0; n < target.length; n++) {

                    if (child === target[n]) {

                        flag = true;
                        target = child;
                        break;

                    }

                }

            }

        }

        if (flag) {

            for (let l = 0; l < jTSObject.length; l++) {

                let clone = null;

                if (index === 0) {

                    clone = jTSObject[l];

                }
                else {

                    clone = jTSObject[l].cloneNode(true);

                }

                if (jTSObject[l].nodeType !== 3) {

                    target.insertAdjacentElement('afterend', clone);

                }
                else {

                    target.insertAdjacentText('afterend', clone.textContent);

                }

                target = clone;

            }

        }
        else {

            for (let h = 0; h < jTSObject.length; h++) {

                let clone = null;

                if (index === 0) {

                    clone = jTSObject[h];

                }
                else {

                    clone = jTSObject[h].cloneNode(true);

                }

                e.appendChild(clone);

            }

        }

    }

    return this;

};

/**
 *
 * @param content {*}
 * @return {jTS}
 */
jTS.fn.appendOut = /*jTS*/function (/*DOM Element || Node List || string || number || Array[Any] || jTS*/content) {

    const t = this;

    let jTSObject = [];
    let constructor = String(content.constructor);

    if (constructor.match(/\/\*jTS constructor fingerprint\*\//)) {

        jTSObject = content;

    }
    else {

        jTSObject = _(content);

    }

    if (jTSObject.length === 0 && constructor.match(/String/)) {

        jTSObject = [];
        parseChildNodes(content);

    }

    if (jTSObject.length === 0 && constructor.match(/Number/)) {

        jTSObject = [];
        parseChildNodes(content.toString());

    }

    if (constructor.match(/Array/)) {

        jTSObject = [];

        for (let i = 0; i < content.length; i++) {

            let currentObject = _(content[i]);

            if (currentObject.length === 0 && (typeof content[i] === 'string' || typeof content[i] === 'number')) {

                parseChildNodes(content[i].toString());

            }
            else if (currentObject.length > 0) {

                currentObject.each(function (i, e) {

                    jTSObject.push(e);

                });

            }

        }

    }

    function parseChildNodes(val) {

        let canvas = document.createElement('div');

        canvas.innerHTML = val;

        for (let i = 0; i < canvas.childNodes.length ; i++) {

            jTSObject.push(canvas.childNodes[i]);

        }

    }

    t.each(addList);

    function addList(index, e) {

        let target = e;

        for (let i = 0; i < jTSObject.length; i++) {

            let clone = null;

            if (index === 0) {

                clone = jTSObject[i];

            }
            else {

                clone = jTSObject[i].cloneNode(true);

            }

            if (jTSObject[i].nodeType !== 3) {

                target.insertAdjacentElement('afterend', clone);

            }
            else {

                target.insertAdjacentText('afterend', clone.textContent);

            }

            target = clone;

        }

    }

    return this;

};

/**
 *
 * @param attributes {*}
 * @param value {*}
 * @return {*}
 */
jTS.fn.attr = /*jTS || string || boolean*/function (/*string || Object literal*/attributes, /*string || number*/value) {

    const t = this;

    if(t.length === 0){

        return t;

    }

    if (arguments.length === 1 && typeof arguments[0] === 'string') {

        return getAttribute(attributes);

    }
    else if (arguments.length === 1 && typeof arguments[0] === 'object') {

        setAttributes(attributes);

    }
    else if (arguments.length === 2 && typeof arguments[0] === 'string') {

        let currentObject = {};

        currentObject[attributes] = value;
        setAttributes(currentObject);

    }
    else {

        console.log('incorrect-arguments-list @jTS.attr');

    }

    function getAttribute(a) {

        for (let i = 0; i < jTS.boolean.value_attribute.length; i++) {

            if (jTS.boolean.value_attribute[i] === a) {

                if(t[0].getAttribute(a) || t[0].attributes[a]){

                    return true;

                }

                return t[0][a];

            }

        }

        return t[0].getAttribute(a);

    }

    function setAttributes(a) {

        t.each(function (i, e) {

            for (let attributeName in a) {

                if(a.hasOwnProperty(attributeName)){

                    let flag = false;
                    let attribute = e.getAttributeNode(attributeName) || document.createAttribute(attributeName);

                    for (let i = 0; i < jTS.boolean.value_attribute.length; i++) {

                        if (jTS.boolean.value_attribute[i] === attributeName) {

                            e[attributeName] = Boolean(a[attributeName]);
                            flag = true;

                            if (Boolean(a[attributeName])) {

                                if (!e.getAttributeNode(attributeName)) {

                                    e.setAttributeNode(attribute);

                                }

                            }
                            else {

                                if (e.getAttributeNode(attributeName)) {

                                    e.attributes.removeNamedItem(attributeName);

                                }

                            }

                            break;

                        }

                    }

                    if (!flag) {

                        attribute.value = a[attributeName];

                        if (jTS.jBrowser() === 'IE' && attributeName.toLocaleLowerCase() === 'type') {

                            /*this only for IE bug*/
                            e.setAttribute('type', a[attributeName]);

                        }
                        else {

                            e.setAttributeNode(attribute);

                        }

                    }

                }

            }

        });

    }

    return this;

};

/**
 *
 * @param content {*}
 * @param previousTo {*}
 * @return {jTS}
 */
jTS.fn.before = /*jTS*/function (/*DOM Element || Node List || string || number || Array[Any] || jTS*/content, /*String || DOM element*/previousTo) {

    const t = this;

    let jTSObject = [];
    let constructor = String(content.constructor);

    if (constructor.match(/\/\*jTS constructor fingerprint\*\//)) {

        jTSObject = content;

    }
    else {

        jTSObject = _(content);

    }

    if (jTSObject.length === 0 && constructor.match(/String/)) {

        jTSObject = [];
        parseChildNodes(content);

    }

    if (jTSObject.length === 0 && constructor.match(/Number/)) {

        jTSObject = [];
        parseChildNodes(content.toString());

    }

    if (constructor.match(/Array/)) {

        jTSObject = [];

        for (let i = 0; i < content.length; i++) {

            let currentObject = _(content[i]);

            if (currentObject.length === 0 && (typeof content[i] === 'string' || typeof content[i] === 'number')) {

                parseChildNodes(content[i].toString());

            }
            else if (currentObject.length > 0) {

                currentObject.each(function (i, e) {

                    jTSObject.push(e);

                });

            }

        }

    }

    function parseChildNodes(val) {

        let canvas = document.createElement('div');

        canvas.innerHTML = val;

        for (let i = 0; i < canvas.childNodes.length ; i++) {

            jTSObject.push(canvas.childNodes[i]);

        }

    }

    t.each(addList);

    function addList(index, e) {

        let target = null;
        let children = null;
        let flag = false;

        if (previousTo) {

            target = _(previousTo);

            if (target) {

                children = e.childNodes;

            }

        }

        if (children) {

            for (let i = 0; i < children.length; i++) {

                let child = children[i];

                for (let n = 0; n < target.length; n++) {

                    if (child === target[n]) {

                        target = child;
                        flag = true;
                        break;

                    }

                }

            }

        }

        if (!flag) {

            target = e.childNodes[0];

        }

        if (target) {

            for (let l = 0; l < jTSObject.length; l++) {

                let clone = null;

                if (index === 0) {

                    clone = jTSObject[l];

                }
                else {

                    clone = jTSObject[l].cloneNode(true);

                }

                e.insertBefore(clone, target);

            }

        }
        else {

            for (let h = 0; h < jTSObject.length; h++) {

                let clone = null;

                if (index === 0) {

                    clone = jTSObject[h];

                }
                else {

                    clone = jTSObject[h].cloneNode(true);

                }

                e.appendChild(clone);

            }

        }

    }

    return this;

};

/**
 *
 * @param content {*}
 * @return {jTS}
 */
jTS.fn.beforeOut = /*jTS*/function (/*DOM Element || Node List || string || number || Array[Any] || jTS*/content) {

    const t = this;

    let jTSObject = [];
    let constructor = String(content.constructor);

    if (constructor.match(/\/\*jTS constructor fingerprint\*\//)) {

        jTSObject = content;

    }
    else {

        jTSObject = _(content);

    }

    if (jTSObject.lenght === 0 && constructor.match(/String/)) {

        jTSObject = [];
        parseChildNodes(content);

    }

    if (jTSObject.lenght === 0 && constructor.match(/Number/)) {

        jTSObject = [];
        parseChildNodes(content.toString());

    }

    if (constructor.match(/Array/)) {

        jTSObject = [];

        for (let i = 0; i < content.length; i++) {

            let currentObject = _(content[i]);

            if (currentObject.length === 0 && (typeof content[i] === 'string' || typeof content[i] === 'number' )) {

                parseChildNodes(content[i].toString());

            }
            else if (currentObject.length > 0) {

                currentObject.each(function (i, e) {

                    jTSObject.push(e);

                });

            }

        }

    }

    function parseChildNodes(val) {

        let canvas = document.createElement('div');

        canvas.innerHTML = val;

        for (let i = 0; i < canvas.childNodes.length ; i++) {

            jTSObject.push(canvas.childNodes[i]);

        }

    }

    t.each(addList);

    function addList(index, e) {

        for (let i = 0; i < jTSObject.length; i++) {

            let clone = null;

            if (index === 0) {

                clone = jTSObject[i];

            }
            else {

                clone = jTSObject[i].cloneNode(true);

            }

            _(e).offsetPs()[0].insertBefore(clone, e);

        }

    }

    return this;

};

/**
 *
 * @param value {boolean}
 * @return {*}
 */
jTS.fn.disabled = /*boolean || jTS*/ function(/*boolean*/value){

    const t = this;

    if(arguments.length === 1){

        t.attr('disabled',value);

        return t;

    }else{

        return t.attr('disabled');

    }

};

/**
 *
 * @return {jTS}
 */
jTS.fn.dispose = /*jTS*/function () {

    let t = this;

    t.each(disposeElement);

    function disposeElement(i, e) {

        _(e).offsetPs()[0].removeChild(e);

    }

    return this;

};

/**
 *
 * @param content {*}
 * @return {*}
 */
jTS.fn.html = /*jTS || string*/function (/*DOM Element || Node List || string || number || Array[Any] || jTS*/content) {

    const t = this;

    if(t.length === 0){

        return t;

    }

    if (content !== '' && !content) {

        return String(t[0].innerHTML).trim();

    }

    let jTSObject = [];
    let constructor = String(content.constructor);

    if (constructor.match(/\/\*jTS constructor fingerprint\*\//)) {

        jTSObject = content;

    }
    else {

        jTSObject = _(content);

    }

    if (jTSObject.length === 0 && constructor.match(/String/)) {

        jTSObject = [];
        parseChildNodes(content);

    }

    if (jTSObject.length === 0 && constructor.match(/Number/)) {

        jTSObject = [];
        parseChildNodes(content.toString());

    }

    if (constructor.match(/Array/)) {

        jTSObject = [];

        for (let i = 0; i < content.length; i++) {

            let currentObject = _(content[i]);

            if (currentObject.length === 0 && (typeof content[i] === 'string' || typeof content[i] === 'number')) {

                parseChildNodes(content[i].toString());

            }
            else if (currentObject.length > 0) {

                currentObject.each(function (i, e) {

                    jTSObject.push(e);

                });

            }

        }

    }

    function parseChildNodes(val) {

        let canvas = document.createElement('div');

        canvas.innerHTML = val;

        for (let i = 0; i < canvas.childNodes.length ; i++) {

            jTSObject.push(canvas.childNodes[i]);

        }

    }

    t.each(addHTML);

    function addHTML(index, element) {

        element.innerHTML = '';

        for (let i = 0; i < jTSObject.length; i++) {

            let clone = jTSObject[i].cloneNode(true);

            element.appendChild(clone);

        }

    }

    return this;

};

/**
 *
 * @return {string}
 */
jTS.jBrowser = /*string*/function () {

    let browser;

    if (navigator.userAgent.indexOf('Firefox') !== -1) {

        browser = 'firefox';

    }
    else if (navigator.userAgent.indexOf('Edg') !== -1) {

        browser = 'edge';

    }
    else if (navigator.userAgent.indexOf('Chrome') !== -1 && navigator.userAgent.indexOf('Edg') === -1 && navigator.userAgent.indexOf('OPR') === -1) {

        browser = 'chrome';

    }
    else if (navigator.userAgent.indexOf('OPR') !== -1) {

        browser = 'opera';

    }
    else if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {

        browser = 'safari';

    }
    else if (navigator.userAgent.indexOf('Trident') !== -1) {

        browser = 'IE';
    }

    return browser;

};

/**
 *
 * @param loaderFile {string}
 * @return {void}
 */
jTS.jImages = /*void*/function (/*string*/loaderFile) {

    let container = document.createElement('div');

    jTS.jJSON(loaderFile, load);

    function load(data) {

        let array;

        for (let name in data) {

            if(data.hasOwnProperty(name)){

                array = data[name];

                loadImage(0);

            }

        }

        function loadImage(index) {

            if (index < array.length) {

                let image = new Image();
                let src = array[index];

                image.src = String(name + array[index]);
                image.alt = String(new Date().getTime() + '_' + index);

                _(container).append(image);

                loadImage(index + 1);

            }


        }

        //this for real loading
        _(container).css('display', 'none').attr('id', 'jts_j_images_' + new Date().getTime());
        _('body').append(container);

    }

};

/**
 *
 * @return {boolean}
 */
jTS.jMobile = /*boolean*/function () {

    return window.navigator.userAgent.indexOf('iPhone') !== -1 || window.navigator.userAgent.indexOf('iPad') !== -1 || window.navigator.userAgent.indexOf('Android') !== -1;

};

/**
 *
 * @param element {*}
 * @param single {boolean}
 * @return {jTS}
 */
jTS.fn.wrap = /*jTS*/function (/*string || DOM Element || Node List || jTS*/element , /*boolean*/single) {

    const t = this;

    let jTSObject = [];
    let constructor = String(element.constructor);

    if (constructor.match(/\/\*jTS constructor fingerprint\*\//)) {

        jTSObject = element;

    }
    else {

        jTSObject = _(element);

    }

    if (jTSObject.length === 0) {

        console.log('can-not-create-wrap-element @jTS.wrap');

    }

    let parent = t.first().offsetPs()[0];
    let sibling = t.first()[0].previousElementSibling;
    let wrapper = jTSObject[0].cloneNode(true);
    let target = findChildren(wrapper);

    t.each(function (i, e) {

        if(!single){

            parent = _(e).offsetPs()[0];
            sibling = e.previousElementSibling;
            wrapper = jTSObject[0].cloneNode(true);
            target = findChildren(wrapper);

        }

        _(target).append(e);

        if(sibling){

            _(parent).append(wrapper, sibling);

        }
        else{

            _(parent).before(wrapper);

        }


    });

    function findChildren(node) {

        let flag = false;

        if (node.childNodes.length !== 0) {

            for (let i = 0; i < node.childNodes.length; i++) {

                if (node.childNodes[i].nodeType !== 3) {

                    flag = true;
                    node = node.childNodes[i];
                    break;

                }

            }

        }

        if (flag) {

            return findChildren(node);

        }
        else {

            return node;

        }

    }

    return this;

};

/*END DOM HANDLING PACKAGE*/





/*EVENTS FLOW PACKAGE*/

/**
 *
 * @param eventType {string}
 * @param callback {Function}
 * @param data {Object}
 * @return {jTS}
 */
jTS.fn.bind = /*jTS*/function (/*string*/eventType,/*Function*/callback,/*Object literal*/data) {

    const t = this;

    let typeNamespaceArray = eventType.split('.');
    let eventsList =         typeNamespaceArray[0].split(' ');
    let namespace =          typeNamespaceArray.length > 1 ? typeNamespaceArray[1] : 'none';

    for (let i = 0; i < eventsList.length; i++) {

        if (!jTS.flow.events[eventsList[i]]) {

            let config = false;

            if (eventsList[i].match('touch') || eventType.match('mousewheel') || eventType.match('DOMMouseScroll') || eventType.match('MozMousePixelScroll')) {

                config = { 'passive': false };

            }

            window.addEventListener(eventsList[i], callerF, config);

            jTS.flow.events[eventsList[i]] = true;

        }

        if (!jTS.flow.listeners[eventsList[i] + '-' + namespace]) {

            jTS.flow.stackIndex[eventsList[i] + '-' + namespace] = 0;
            jTS.flow.listeners[eventsList[i] + '-' + namespace] = [];

        }

    }

    function callerF(e) {

        let setName = [];

        for (let n in jTS.flow.listeners) {

            if(jTS.flow.listeners.hasOwnProperty(n)){

                if (String(n).split('-')[0].match(e.type)) {

                    setName.push(String(n));

                }

            }

        }

        e.immediatePropS =     false;
        e.propagationStopped = false;
        e.propagationSO =      null;

        let target = e.target;

        if (target !== window && target !== document) {

            while (target) {

                triggerListener(target);
                target = _(target).offsetPs()[0];

            }

        }

        target = document;
        triggerListener(target);

        target = window;
        triggerListener(target);

        function triggerListener(target) {

            for (let i = 0; i < setName.length; i++) {

                jTS.flow.stackIndex[setName[i]] = 0;

                findListener(jTS.flow.stackIndex[setName[i]],i);

                setName = [];

                for (let n in jTS.flow.listeners) {

                    if(jTS.flow.listeners.hasOwnProperty(n)){

                        if (String(n).split('-')[0].match(e.type)) {

                            setName.push(String(n));

                        }

                    }

                }

            }

            function findListener(index,forIndex) {

                if (index < jTS.flow.listeners[setName[forIndex]].length) {

                    let l = jTS.flow.listeners[setName[forIndex]][index];

                    if (target === l.element && l.type.match(e.type) && (!l.executed)) {

                        if (!e.immediatePropS) {

                            let flag = true;

                            if (e.propagationStopped && e.propagationSO !== l.element) {

                                flag = false;

                            }

                            if (flag) {

                                let jTSEvent = new jTS.flow.Event(e, l, data);

                                l.executed = true;
                                l.callback.call(l.element, jTSEvent);

                            }

                        }

                    }

                    jTS.flow.stackIndex[setName[forIndex]] += 1;

                    if (jTS.flow.stackIndex[setName[forIndex]] < 0) {

                        jTS.flow.stackIndex[setName[forIndex]] = 0;

                    }

                    findListener(jTS.flow.stackIndex[setName[forIndex]],forIndex);

                }
                else {

                    for (let m = 0; m < jTS.flow.listeners[setName[forIndex]].length; m++) {

                        jTS.flow.listeners[setName[forIndex]][m].executed = false;

                    }

                }

            }

        }

        jTS.flow.clearFlow();

    }

    t.each(addListener);

    function addListener(index, e) {

        for (let i = 0; i < eventsList.length; i++) {

            let listener = {

                'type': eventsList[i],
                'element': e,
                'index': index,
                'callback': callback,
                'namespace': namespace,
                'executed': false

            };

            jTS.flow.listeners[eventsList[i] + '-' + namespace].push(listener);

        }

    }

    return this;

};

/**
 *
 * @param namespace {string}
 * @param handler {Function}
 * @param data {Object}
 * @return {jTS}
 */
jTS.fn.click = /*jTS*/function(/*string*/namespace,/*Function*/handler,/*Object literal*/data){

    const t = this;

    let clickNamespace;
    let clickHandler;
    let clickData;

    if((typeof arguments[0]).toLowerCase() === 'string'){

        clickNamespace = '.' + namespace;
        clickHandler = handler;

        if(arguments.length === 3){

            clickData = data;

        }

    }else if((typeof arguments[0]).toLowerCase() === 'function'){

        clickNamespace = '';
        clickHandler = arguments[0];

        if(arguments.length === 2){

            clickData = arguments[1];

        }

    }

    t.bind(`click${clickNamespace}`,clickHandler,clickData);

    return t;

};

/**
 *
 * @param type {string}
 * @param data {Object}
 * @return {jTS}
 */
jTS.fn.emits = /*jTS*/function (/*string*/type,/*Object literal*/data) {

    const t = this;

    if (!data) {

        data = {};

    }

    jTS.jFlow.jStackIndex = 0;

    executeQuery(jTS.jFlow.jStackIndex);

    function executeQuery(index) {

        if (index < jTS.jFlow.jListeners.length) {

            let l = jTS.jFlow.jListeners[index];

            if (l.type === type) {

                if ((!l.once || l.counter === 0) && !l.executed) {

                    let event = new jTS.jFlow.jEvent(type, t, l.element, data);

                    l.executed = true;

                    l.callback.call(l.element, event);

                    l.counter += 1;

                }

            }

            jTS.jFlow.jStackIndex = index + 1;
            jTS.jFlow.jStackIndex -= jTS.jFlow.unbindIndex;
            jTS.jFlow.unbindIndex = 0;

            if (jTS.jFlow.jStackIndex < 0) {

                jTS.jFlow.jStackIndex = 0;

            }

            executeQuery(jTS.jFlow.jStackIndex);

        }
        else {

            for (let m = 0; m < jTS.jFlow.jListeners.length; m++) {

                jTS.jFlow.jListeners[m].executed = false;

            }

        }

    }

    return this;

};

/**
 *
 * @param namespace {string}
 * @param handler {Function}
 * @param data {Object}
 * @return {jTS}
 */
jTS.fn.mouseDown = /*jTS*/function(/*string*/namespace,/*Function*/handler,/*Object literal*/data){

    const t = this;

    let mouseDownNamespace;
    let mouseDownHandler;
    let mouseDownData;
    let event = jTS.jMobile() ? 'touchstart' : 'mousedown';

    if((typeof arguments[0]).toLowerCase() === 'string'){

        mouseDownNamespace = '.' + namespace;
        mouseDownHandler = handler;

        if(arguments.length === 3){

            mouseDownData = data;

        }

    }else if((typeof arguments[0]).toLowerCase() === 'function'){

        mouseDownNamespace = '';
        mouseDownHandler = arguments[0];

        if(arguments.length === 2){

            mouseDownData = arguments[1];

        }

    }

    t.bind(`${event}${mouseDownNamespace}`,mouseDownHandler,mouseDownData);

    return t;

};

/**
 *
 * @param namespace {string}
 * @param handler {Function}
 * @param data {Object}
 * @return {jTS}
 */
jTS.fn.mouseMove = /*jTS*/function(/*string*/namespace,/*Function*/handler,/*Object literal*/data){

    const t = this;

    let mouseMoveNamespace;
    let mouseMoveHandler;
    let mouseMoveData;
    let event = jTS.jMobile() ? 'touchmove' : 'mousemove';

    if((typeof arguments[0]).toLowerCase() === 'string'){

        mouseMoveNamespace = '.' + namespace;
        mouseMoveHandler = handler;

        if(arguments.length === 3){

            mouseMoveData = data;

        }

    }else if((typeof arguments[0]).toLowerCase() === 'function'){

        mouseMoveNamespace = '';
        mouseMoveHandler = arguments[0];

        if(arguments.length === 2){

            mouseMoveData = arguments[1];

        }

    }

    t.bind(`${event}${mouseMoveNamespace}`,mouseMoveHandler,mouseMoveData);

    return t;

};

/**
 *
 * @param namespace {string}
 * @param handler {Function}
 * @param data {Object}
 * @return {jTS}
 */
jTS.fn.mouseOut = /*jTS*/function(/*string*/namespace,/*Function*/handler,/*Object literal*/data){

    const t = this;

    let mouseOutNamespace;
    let mouseOutHandler;
    let mouseOutData;
    let event = jTS.jMobile() ? 'touchend' : 'mouseout';

    if((typeof arguments[0]).toLowerCase() === 'string'){

        mouseOutNamespace = '.' + namespace;
        mouseOutHandler = handler;

        if(arguments.length === 3){

            mouseOutData = data;

        }

    }else if((typeof arguments[0]).toLowerCase() === 'function'){

        mouseOutNamespace = '';
        mouseOutHandler = arguments[0];

        if(arguments.length === 2){

            mouseOutData = arguments[1];

        }

    }

    t.bind(`${event}${mouseOutNamespace}`,mouseOutHandler,mouseOutData);

    return t;

};

/**
 *
 * @param namespace {string}
 * @param handler {Function}
 * @param data {Object}
 * @return {jTS}
 */
jTS.fn.mouseOver = /*jTS*/function(/*string*/namespace,/*Function*/handler,/*Object literal*/data){

    const t = this;

    let mouseOverNamespace;
    let mouseOverHandler;
    let mouseOverData;
    let event = jTS.jMobile() ? 'touchstart' : 'mouseover';

    if((typeof arguments[0]).toLowerCase() === 'string'){

        mouseOverNamespace = '.' + namespace;
        mouseOverHandler = handler;

        if(arguments.length === 3){

            mouseOverData = data;

        }

    }else if((typeof arguments[0]).toLowerCase() === 'function'){

        mouseOverNamespace = '';
        mouseOverHandler = arguments[0];

        if(arguments.length === 2){

            mouseOverData = arguments[1];

        }

    }

    t.bind(`${event}${mouseOverNamespace}`,mouseOverHandler,mouseOverData);

    return t;

};

/**
 *
 * @param namespace {string}
 * @param handler {Function}
 * @param data {Object}
 * @return {jTS}
 */
jTS.fn.mouseUp = /*jTS*/function(/*string*/namespace,/*Function*/handler,/*Object literal*/data){

    const t = this;

    let mouseUpNamespace;
    let mouseUpHandler;
    let mouseUpData;
    let event = jTS.jMobile() ? 'touchend' : 'mouseup';

    if((typeof arguments[0]).toLowerCase() === 'string'){

        mouseUpNamespace = '.' + namespace;
        mouseUpHandler = handler;

        if(arguments.length === 3){

            mouseUpData = data;

        }

    }else if((typeof arguments[0]).toLowerCase() === 'function'){

        mouseUpNamespace = '';
        mouseUpHandler = arguments[0];

        if(arguments.length === 2){

            mouseUpData = arguments[1];

        }

    }

    t.bind(`${event}${mouseUpNamespace}`,mouseUpHandler,mouseUpData);

    return t;

};

/**
 *
 * @param typeOrFamily {string}
 * @return {jTS}
 */
jTS.fn.off = /*jTS*/function (/*string*/typeOrFamily) {

    const t = this;

    let types = '';
    let family = '';
    let isFamily = false;
    let isEvent = false;

    jTS.jFlow.unbindIndex = 0;

    if (typeOrFamily.match(/^\./)) {

        family = typeOrFamily.substring(1);
        isFamily = true;

    }
    else if (typeOrFamily.match(/\w+\.\w+/)) {

        types = typeOrFamily.split('.')[0];
        family = typeOrFamily.split('.')[1];
        isFamily = true;
        isEvent = true;

    }
    else {

        types = typeOrFamily;
        isEvent = true;

    }

    t.each(unbindListener);

    function unbindListener(index, element) {

        if (isFamily && !isEvent) {

            for (let i = 0; i < jTS.jFlow.jListeners.length; i++) {

                let listener = jTS.jFlow.jListeners[i];

                let regExp = '\\s' + listener.surname + '\\s';
                let regExp2 = '\\s' + listener.surname + '$';
                let regExp3 = '^' + listener.surname + '\\s';
                let regExp4 = '^' + listener.surname + '$';

                if (listener.element === element && (family.match(RegExp(regExp)) || family.match(RegExp(regExp2)) || family.match(RegExp(regExp3)) || family.match(RegExp(regExp4)))) {

                    jTS.jFlow.jListeners.splice(i, 1);
                    jTS.jFlow.unbindIndex += 1;
                    i -= 1;

                }

            }

        }
        else if (isFamily && isEvent) {

            for (let i = 0; i < jTS.jFlow.jListeners.length; i++) {

                let listener = jTS.jFlow.jListeners[i];

                let regExp = '\\s' + listener.surname + '\\s';
                let regExp2 = '\\s' + listener.surname + '$';
                let regExp3 = '^' + listener.surname + '\\s';
                let regExp4 = '^' + listener.surname + '$';
                let regExp5 = '\\s' + listener.type + '\\s';
                let regExp6 = '\\s' + listener.type + '$';
                let regExp7 = '^' + listener.type + '\\s';
                let regExp8 = '^' + listener.type + '$';

                if (listener.element === element && (family.match(RegExp(regExp)) || family.match(RegExp(regExp2)) || family.match(RegExp(regExp3)) || family.match(RegExp(regExp4))) &&
                    (types.match(RegExp(regExp5)) || types.match(RegExp(regExp6)) || types.match(RegExp(regExp7)) || types.match(RegExp(regExp8)))) {

                    jTS.jFlow.jListeners.splice(i, 1);
                    jTS.jFlow.unbindIndex += 1;
                    i -= 1;

                }

            }

        }
        else if (isEvent && !isFamily) {

            for (let i = 0; i < jTS.jFlow.jListeners.length; i++) {

                let listener = jTS.jFlow.jListeners[i];

                let regExp = '\\s' + listener.type + '\\s';
                let regExp2 = '\\s' + listener.type + '$';
                let regExp3 = '^' + listener.type + '\\s';
                let regExp4 = '^' + listener.type + '$';

                if (listener.element === element && (types.match(RegExp(regExp)) || types.match(RegExp(regExp2)) || types.match(RegExp(regExp3)) || types.match(RegExp(regExp4)))) {

                    jTS.jFlow.jListeners.splice(i, 1);
                    jTS.jFlow.unbindIndex += 1;
                    i -= 1;

                }

            }

        }

    }

    return this;

};

/**
 *
 * @param type {string}
 * @param callback {Function}
 * @return {jTS}
 */
jTS.fn.on = /*jTS*/function (/*string*/type,/*Function*/callback) {

    const t = this;

    let typesAndNamespaces = type.split('.');
    let types = typesAndNamespaces[0].split(' ');
    let namespace = typesAndNamespaces.length > 1 ? typesAndNamespaces[1] : 'none';

    t.each(addListener);

    function addListener(i, e) {

        for (let i = 0; i < types.length; i++) {

            let l = {

                'type': types[i],
                'callback': callback,
                'namespace': namespace,
                'element': e,
                'once': false,
                'counter': 0,
                'executed': false

            };

            jTS.jFlow.jListeners.push(l);

        }

    }

    return this;

};

/**
 *
 * @param type {string}
 * @param callback {Function}
 * @return {jTS}
 */
jTS.fn.once = /*jTS*/function (/*string*/type,/*Function*/callback) {

    const t = this;

    let typesAndNamespace = type.split('.');
    let types = typesAndNamespace[0].split(' ');
    let namespace = typesAndNamespace.length > 1 ? typesAndNamespace[1] : 'none';

    t.each(addListener);

    function addListener(i, e) {

        for (let i = 0; i < types.length; i++) {

            let l = {

                'type': types[i],
                'callback': callback,
                'namespace': namespace,
                'element': e,
                'once': true,
                'counter': 0,
                'executed': false

            };

            jTS.jFlow.jListeners.push(l);

        }

    }

    return this;

};

/**
 *
 * @param namespace {string}
 * @param handler {Function}
 * @param data {Object}
 * @return {jTS}
 */
jTS.fn.scroll = /*jTS*/function(/*string*/namespace,/*Function*/handler,/*Object literal*/data){

    const t = this;

    let scrollNamespace;
    let scrollHandler;
    let scrollData;
    let event = jTS.jMobile() ? 'touchmove' : 'mousewheel DOMMouseScroll MozMousePixelScroll';

    if((typeof arguments[0]).toLowerCase() === 'string'){

        scrollNamespace = '.' + namespace;
        scrollHandler = handler;

        if(arguments.length === 3){

            scrollData = data;

        }

    }else if((typeof arguments[0]).toLowerCase() === 'function'){

        scrollNamespace = '';
        scrollHandler = arguments[0];

        if(arguments.length === 2){

            scrollData = arguments[1];

        }

    }

    t.bind(`${event}${scrollNamespace}`,scrollHandler,scrollData);
    t.each((i,e) => {

        e.onscroll = scrollHandler;

    });

    return t;

};

/**
 *
 * @param typeOrFamily {string}
 * @return {jTS}
 */
jTS.fn.unbind = /*jTS*/function (/*string*/typeOrFamily) {

    const t = this;

    let types = [];
    let family = [];
    let list = [];

    if (typeOrFamily.match(/^\./)) {

        family = typeOrFamily.substring(1).split(' ');

        for (let n in jTS.flow.listeners) {

            if(jTS.flow.listeners.hasOwnProperty(n)){

                for (let i = 0; i < family.length; i++) {

                    if (String(n).match(RegExp('-' + family[i] + '$'))) {

                        list.push(String(n))

                    }

                }

            }

        }

    }
    else if (typeOrFamily.match(/\w+\.\w+/)) {

        types = typeOrFamily.split('.')[0].split(' ');
        family = typeOrFamily.split('.')[1].split(' ');

        for (let n in jTS.flow.listeners) {

            if(jTS.flow.listeners.hasOwnProperty(n)){

                for (let l = 0; l < types.length; l++) {

                    for (let h = 0; h < family.length; h++) {

                        if (String(n) === types[l] + '-' + family[h]) {

                            list.push(String(n))

                        }

                    }

                }

            }

        }

    }
    else {

        types = typeOrFamily.split(' ');

        for (let n in jTS.flow.listeners) {

            if(jTS.flow.listeners.hasOwnProperty(n)){

                for (let m = 0; m < types.length; m++) {

                    if (String(n).match(RegExp('^' + types[m] + '-'))) {

                        list.push(String(n));

                    }

                }

            }

        }

    }

    t.each(disposeListener);

    function disposeListener(i, e) {

        for (let i = 0; i < list.length; i++) {

            let lSet = jTS.flow.listeners[list[i]];

            for (let l = 0; l < lSet.length; l++) {

                let listener = lSet[l];

                if (listener.element === e) {

                    lSet.splice(l, 1);
                    jTS.flow.stackIndex[list[i]] -= 1;
                    l -= 1;

                }

            }

        }

    }

    return this;

};

/*END EVENTS FLOW PACKAGE*/





/*FORMS PACKAGE*/

/**
 *
 * @param add {Object}
 * @param filter {string}
 * @return {Object}
 */
jTS.fn.serialize = /*Object literal*/function (/*Object literal*/add,/*string*/filter) {

    const t = this;

    let toAdd =     null;
    let toFilter =  null;

    if (arguments.length === 1) {

        if (typeof arguments[0] === 'string') {

            toFilter = arguments[0];

        }
        else {

            toAdd = arguments[0];

        }

    }
    else if (arguments.length === 2) {

        toAdd =     add;
        toFilter =  filter;

    }

    let types = {

        'select'         : 0,
        'textarea'       : 0,
        'optgroup'       : 0,
        'option'         : 0,
        'text'           : 0,
        'checkbox'       : 0,
        'password'       : 0,
        'radio'          : 0,
        'color'          : 0,
        'date'           : 0,
        'file'           : 0,
        'datetime-local' : 0,
        'email'          : 0,
        'month'          : 0,
        'number'         : 0,
        'range'          : 0,
        'search'         : 0,
        'tel'            : 0,
        'image'          : 0,
        'time'           : 0,
        'url'            : 0,
        'week'           : 0,
        'hidden'         : 0

    };

    let object = {};

    let elements = [];
    let values =   [];
    let names =    [];

    t.each(pushSet);
    _(elements).each(getValues);
    fillObject(0);

    if (toAdd) {

        addValues();

    }

    function pushSet(index, element) {

        if(element === window){

            element = _('body')[0];

        }

        recursivePush(0, [element]);

        function recursivePush(i, set) {

            if (!set) {

                return;

            }

            if (i < set.length) {

                if (set[i].nodeType === 1 && ((set[i].tagName).toLowerCase() === 'input' || (set[i].tagName).toLowerCase() === 'select' || (set[i].tagName).toLowerCase() === 'textarea' || (set[i].tagName).toLowerCase() === 'optgroup' || (set[i].tagName).toLowerCase() === 'option')) {

                    let flag = false;

                    let name = _(set[i]).attr('name');

                    if (name) {

                        for (let k = 0; k < names.length; k++) {

                            if (name === names[k]) {

                                flag = true;
                                break;

                            }

                        }

                        names.push(name);

                    }

                    if (toFilter) {

                        if (toFilter.match(RegExp(set[i].tagName, 'i')) || toFilter.match(RegExp(_(set[i]).attr('type'), 'i')) || toFilter.match(RegExp(name))) {

                            flag = true;

                        }

                    }

                    if (!flag) {

                        elements.push(set[i]);

                    }

                }
                else {

                    recursivePush(0, set[i].childNodes);

                }

                recursivePush(i + 1, set);

            }

        }

    }

    function getValues(index, element) {

        values.push(_(element).value());

    }

    function fillObject(index) {

        if (index < elements.length) {

            let tag = (elements[index].tagName).toLowerCase();
            let type = tag === 'select' || tag === 'textarea' || tag === 'optgropup' || tag === 'option' ? '' : _(elements[index]).attr('type');
            let name = getName(elements[index], tag, type);
            let value = values[index];

            if (tag === 'select' || type === 'checkbox' || type === 'file' || tag === 'optgroup' || tag === 'option') {

                parseValue(name, value);

            }
            else {

                object[name] = values[index];

            }

            fillObject(index + 1);

        }

    }

    function addValues() {

        for (let n in toAdd) {

            if(toAdd.hasOwnProperty(n)){

                parseValue(n, toAdd[n]);

            }

        }

    }

    function getName(e, tag, type) {

        let id = type || tag;
        let idCounter = types[id] === 0 ? '' : '_' + types[id];
        let parsedType = type ? '_' + type : '';
        let name = _(e).attr('name') || 'serialized_' + tag + parsedType + idCounter;

        if (!_(e).attr('name')) {

            types[id] = types[id] + 1;

        }

        return name;

    }

    function parseValue(name, value) {

        if (!value) {

            object[name] = false;
            return;

        }

        let constructor = String(value.constructor);

        if (constructor.match(/Array/) || constructor.match(/FileList/)) {

            for (let i = 0; i < value.length; i++) {

                let id = i === 0 ? '' : '_v' + i;

                object[name + id] = value[i];

            }

        }
        else {

            object[name] = value;

        }

    }

    return object;

};

/**
 *
 * @param val {*}
 * @return {*}
 */
jTS.fn.value = /*jTS || string || Array || boolean || FileList*/function (/*Any || Array[Any]*/val) {

    const t = this;

    let constructor = null;

    if(t.length === 0){

        return t;

    }

    if (arguments.length === 0) {

        return getValue();

    }
    else {

        if (val !== null) {

            constructor = String(val.constructor);

        }

        t.each(setValue);

    }

    function getValue() {

        let tag = (t[0].tagName).toLowerCase();

        switch (tag) {

            case 'select':
            case 'option':
            case 'optgroup':
                return getSelect();
            case 'input':
                if (t[0].type === 'checkbox') {
                    return getCheckbox();
                }
                else if (t[0].type === 'radio') {
                    return getRadio();
                }
                else if (t[0].type === 'file') {
                    return t[0].files.length === 0 ? getSingle() : t[0].files;
                }
                else {
                    return getSingle();
                }
            case 'textarea':
            case 'li':
            case 'param':
            case 'progress':
            case 'button':
                return getSingle();
            default:
                return null;

        }

        function getSingle() {

            return t[0].value;

        }

        function getSelect() {

            let array = [];

            let options;

            if (tag === 'select') {

                options = [];

                for (let n = 0; n < t[0].childNodes.length; n++) {

                    let node = t[0].childNodes[n];

                    if (node.nodeType === 1 && (node.tagName).toLowerCase() === 'option') {

                        options.push(node);

                    }
                    else if (node.nodeType === 1 && (node.tagName).toLowerCase() === 'optgroup') {

                        for (let b = 0; b < node.childNodes.length; b++) {

                            if (node.childNodes[b].nodeType === 1) {

                                options.push(node.childNodes[b]);

                            }

                        }

                    }

                }

            }
            else if (tag === 'optgroup') {

                options = t[0].childNodes;

            }
            else if (tag === 'option') {

                options = [t[0]];

            }


            for (let i = 0; i < options.length; i++) {

                if (options[i].nodeType === 1) {

                    if ((options[i].tagName).toLowerCase() === 'option' && options[i].selected) {

                        array.push(options[i].value);

                    }

                }

            }

            return array.length > 0 ? array : false;

        }

        function getCheckbox() {

            let name = _(t[0]).attr('name');

            if (name) {

                let list = document.querySelectorAll('input[type=checkbox][name=' + name + ']');

                if (list.length > 1) {

                    let array = [];

                    for (let i = 0; i < list.length; i++) {

                        if (list[i].checked) {

                            array.push(list[i].value);

                        }

                    }

                    if (array.length > 0) {

                        return array;

                    }

                }

            }

            return t[0].checked ? t[0].value : false;

        }

        function getRadio() {

            let name = _(t[0]).attr('name');

            if (name) {

                let list = document.querySelectorAll('input[type=radio][name=' + name + ']');

                if (list.length > 1) {

                    for (let i = 0; i < list.length; i++) {

                        if (list[i].checked) {

                            return list[i].value;

                        }

                    }

                }

            }

            return t[0].checked ? t[0].value : false;

        }

    }

    function setValue(index, element) {

        let tag = (element.tagName).toLowerCase();

        switch (tag) {

            case 'select':
            case 'option':
            case 'optgroup':
                setSelect();
                break;
            case 'input':
                if (element.type === 'checkbox' || element.type === 'radio') {

                    setRadioOrCheckbox();

                }
                else {

                    setSingle();

                }
                break;
            case 'textarea':
            case 'li':
            case 'param':
            case 'progress':
            case 'button':
                setSingle();
                break;
            default:
                break;

        }

        function setSingle() {

            let parsedValue = null;

            if (constructor != null) {

                parsedValue = constructor.match(/Array/) ? val[0] : val;

            }

            element.value = parsedValue;

        }

        function setSelect() {

            let options;

            if (tag === 'select') {

                options = [];

                for (let n = 0; n < element.childNodes.length; n++) {

                    let node = element.childNodes[n];

                    if (node.nodeType === 1 && (node.tagName).toLowerCase() === 'option') {

                        options.push(node);

                    }
                    else if (node.nodeType === 1 && (node.tagName).toLowerCase() === 'optgroup') {

                        for (let b = 0; b < node.childNodes.length; b++) {

                            if (node.childNodes[b].nodeType === 1) {

                                options.push(node.childNodes[b]);

                            }

                        }

                    }

                }

            }
            else if (tag === 'optgroup') {

                options = element.childNodes;

            }
            else if (tag === 'option') {

                options = [element];

            }

            if (constructor.match(/Array/)) {

                for (let i = 0; i < options.length; i++) {

                    _(options[i]).attr('selected', false);

                    for (let l = 0; l < val.length; l++) {

                        if (options[i].value === String(val[l])) {

                            _(options[i]).attr('selected', true);

                            break;

                        }

                    }

                }

            }
            else {

                for (let h = 0; h < options.length; h++) {

                    _(options[h]).attr('selected', false);

                    if (options[h].value === String(val)) {

                        _(options[h]).attr('selected', true);

                    }

                }

            }

        }

        function setRadioOrCheckbox() {

            if (constructor.match(/Array/)) {

                for (let i = 0; i < val.length; i++) {

                    if (String(val[i]) === element.value) {

                        _(element).attr('checked', true);

                        break;

                    }

                }

            }
            else {

                if (String(val) === element.value) {

                    _(element).attr('checked', true);

                }

            }

        }

    }

    return this;

};

/*END FORMS PACKAGE*/





/*TOOLS PACKAGE*/

/**
 *
 * @return {jTS}
 */
jTS.fn.centerImage = /*JTS*/function () {

    const t = this;

    t.each(setPositionAndSize);

    function setPositionAndSize(i,e) {

        let tag = e.tagName.toLowerCase();

        if (!(tag === 'img' || tag === 'div')) {

            return;

        }

        let image = null;
        let flag =  false;

        if (tag === 'img') {

            image = e;
            flag =  true;

        }
        else {

            let nodes = e.children;

            for (let i = 0; i < nodes.length; i++) {

                if (nodes[i].nodeType === 1 && nodes[i].tagName.toLowerCase() === 'img') {

                    image = nodes[i];
                    flag =  true;

                    break;

                }

            }

        }

        if (!flag) {

            return;

        }

        _(image).css('position', 'absolute');

        let imageOriginalWidth =  0;
        let imageOriginalHeight = 0;

        let imgLoader = new Image();

        imgLoader.onload = function () {

            imageOriginalWidth =  this.naturalWidth  || this.originalWidth;
            imageOriginalHeight = this.naturalHeight || this.originalHeight;

            query();

        };

        let parent = _(image).offsetPs()[0];

        if (parent === document.querySelector('body')) {

            parent = window;

        }

        let parentWidth =  _(parent).outerWidth();
        let parentHeight = _(parent).outerHeight();

        imgLoader.src = image.src;

        function query() {

            _(image).css(getValues(parentWidth,parentHeight));

        }

        function getValues(parentWidth,parentHeight) {

            let imageWidth = 0 , imageHeight = 0, imageLeft , imageTop ;

            if (parentWidth >= parentHeight) {

                parseHeight(parentWidth);

            }
            else {


                parseWidth(parentHeight);

            }

            imageLeft = (parentWidth * 0.5) - (imageWidth * 0.5);
            imageTop = (parentHeight * 0.5) - (imageHeight * 0.5);

            function parseHeight(width) {

                imageWidth = width;
                imageHeight = imageOriginalHeight * (width / imageOriginalWidth);

                if (imageHeight < parentHeight) {

                    parseHeight(width + 1);

                }

            }

            function parseWidth(height) {

                imageHeight = height;
                imageWidth = imageOriginalWidth * (height / imageOriginalHeight);

                if (imageWidth < parentWidth) {

                    parseWidth(height + 1);

                }

            }

            return { 'width': imageWidth, 'height': imageHeight, 'left': imageLeft, 'top': imageTop };

        }

    }

    return t;

};

/**
 *
 * @param configuration {Object}
 * @return {jTS}
 */
jTS.fn.colorPicker = /*jTS*/function (/*Object literal*/configuration) {

    const t = this;

    let SATURATION_BRIGHTNESS_SIZE = 130, HUE_CONTAINER_HEIGHT = 130, HUE_RANGE = 360;
    let DARK_STYLE = 0 , LIGHT_STYLE = 1 , DEEP_DARK_STYLE = 2;

    let backgroundColor =  ['#333333', '#cecdcd', '#111111'];
    let hueSelectorImage = ['huesdark.png', 'hueslight.png', 'huesdark.png'];
    let valueNameBG =      ['#262323', '#f3f3f3', '#333333'];
    let valueValueBG =     ['#ffffff', '#333333', '#ffffff'];
    let textColor =        ['#6ba9d7', '#000000', '#f50069'];
    let valueColor =       ['#000000', '#ffffff', '#000000'];
    let style =            DARK_STYLE;

    switch (configuration.style) {

        case 'dark':
        case 'dark-round':
            style = DARK_STYLE;
            break;
        case 'light':
        case 'light-round':
            style = LIGHT_STYLE;
            break;
        case 'deep-dark':
        case 'deep-dark-round':
            style = DEEP_DARK_STYLE;
            break;

    }

    t.each(setPicker);

    function setPicker(index, element) {

        _(element).css('cursor', 'pointer');

        let container, startRGBColor, startHSBColor;

        let pickerOut = false;
        let parsedID = '' + new Date().getTime() + index;

        _(element).bind('click.jts_picker_events_' + parsedID, function (e) {

            if (!pickerOut) {

                pickerOut = true;

                startRGBColor = parseRGBColor(element);
                startHSBColor = rGBtoHSB(startRGBColor);

                addInterface(e);

            }

        });

        function addInterface(e) {

            container = document.createElement('div');

            let css = {

                'position': 'absolute',
                'box-shadow': '0px 2px 2px 0px rgba(0,0,0,0.3)',
                'top': e.screenY + (window.pageYOffset || document.documentElement.scrollTop),
                'left': e.screenX,
                'z-index': 500,
                'width': 300,
                'height': 210,
                'background-color': backgroundColor[style],
                'border-radius': (configuration.style).match('round') ? 10 : 0

            };

            _(container).attr('id', 'jts_picker_container_' + parsedID).css(css);
            _(container).load(configuration.path + 'color_picker/picker_html.html', initPicker);

        }

        function initPicker() {

            _('body').append(container);

            _('#jts_picker_container_' + parsedID + ' .jts_picker_value , #jts_picker_container_' + parsedID + ' .jts_picker_selector').each(function (i, e) {

                _(e).attr('id', _(e).attr('id') + '_' + parsedID);

            });

            _('#jts_picker_container_' + parsedID + ' .jts_picker_shade_image').attr('src', configuration.path + 'color_picker/shade.png');
            _('#jts_picker_container_' + parsedID + ' .jts_picker_sbs_image').attr('src', configuration.path + 'color_picker/sbselector.png');
            _('#jts_picker_container_' + parsedID + ' .jts_picker_hue_image').attr('src', configuration.path + 'color_picker/hue.png');
            _('#jts_picker_container_' + parsedID + ' .jts_picker_hues_image').attr('src', configuration.path + 'color_picker/' + hueSelectorImage[style]);
            _('#jts_picker_container_' + parsedID + ' .jts_picker_name_rgb').css({ 'background-color': valueNameBG[style], 'color': textColor[style] });
            _('#jts_picker_container_' + parsedID + ' .jts_picker_value').css({ 'background-color': valueValueBG[style], 'color': valueColor[style] });
            _('#jts_picker_container_' + parsedID + ' .jts_picker_compare_container div').css('color', textColor[style]);
            _('#jts_picker_container_' + parsedID + ' .jts_picker_submit').css({ 'background-color': valueNameBG[style], 'color': textColor[style] });

            let rgbColor = 'rgb(' + startRGBColor[0] + ',' + startRGBColor[1] + ',' + startRGBColor[2] + ')';

            _('#jts_picker_container_' + parsedID + ' .jts_picker_table').css('background-color', 'hsl(' + startHSBColor[0] + ', 100% , 50%)');
            _('#jts_picker_container_' + parsedID + ' .jts_picker_current_color').css('background-color', rgbColor);
            _('#jts_picker_container_' + parsedID + ' .jts_picker_next_color').css('background-color', rgbColor);

            _('#jts_red_val_' + parsedID).html(String(startRGBColor[0]));
            _('#jts_green_val_' + parsedID).html(String(startRGBColor[1]));
            _('#jts_blue_val_' + parsedID).html(String(startRGBColor[2]));
            _('#jts_exadecimal_val_' + parsedID).html(String(rGBtoEXADECIMAL(startRGBColor)));

            let sbX = SATURATION_BRIGHTNESS_SIZE * (startHSBColor[1] / 100);
            let sbY = SATURATION_BRIGHTNESS_SIZE * (startHSBColor[2] / 100);
            sbY = SATURATION_BRIGHTNESS_SIZE + (-sbY);

            let hueY = startHSBColor[0] * (HUE_CONTAINER_HEIGHT / HUE_RANGE);
            hueY = HUE_CONTAINER_HEIGHT + (-hueY);

            _('#jts_sb_selector_' + parsedID).css({ 'left': sbX, 'top': sbY });
            _('#jts_hue_selector_' + parsedID).css('top', hueY);

            setPickerListeners();

        }

        function setPickerListeners() {

            let mobile = jTS.jMobile();
            let mousedown = mobile ? 'touchstart' : 'mousedown';
            let mousemove = mobile ? 'touchmove' : 'mousemove';
            let mouseup = mobile ? 'touchend' : 'mouseup';

            let currentX, currentY, previousX, previousY, vX, vY;

            _(container).bind(mousedown + '.jts_picker_event_' + parsedID, function (e) {

                e.preventDefault();

                if (e.target.getAttribute('id') === 'jts_picker_container_' + parsedID) {

                    currentX = mobile ? e.touches[0].clientX : e.screenX;
                    currentY = mobile ? e.touches[0].clientY : e.screenY;
                    previousX = mobile ? e.touches[0].clientX : e.screenX;
                    previousY = mobile ? e.touches[0].clientY : e.screenY;

                    _(window).bind(mousemove + '.jts_picker_event_' + parsedID, function (e) {

                        e.preventDefault();

                        currentX = mobile ? e.touches[0].clientX : e.screenX;
                        currentY = mobile ? e.touches[0].clientY : e.screenY;

                        vX = currentX - previousX;
                        vY = currentY - previousY;

                        previousX = currentX;
                        previousY = currentY;


                        let target = document.querySelector('#jts_picker_container_' + parsedID);

                        let x = target.offsetLeft;
                        let y = target.offsetTop;

                        x += vX;
                        y += vY;

                        target.style.left = x + 'px';
                        target.style.top = y + 'px';


                    });
                    _(window).bind(mouseup + '.jts_picker_event_' + parsedID, function (e) {

                        _(window).unbind('.jts_picker_event_' + parsedID);

                    });

                }

            });

            _('#jts_sb_selector_' + parsedID).bind(mousedown + '.jts_picker_event_' + parsedID, function (e) {

                e.preventDefault();

                currentX = mobile ? e.touches[0].clientX : e.screenX;
                currentY = mobile ? e.touches[0].clientY : e.screenY;
                previousX = mobile ? e.touches[0].clientX : e.screenX;
                previousY = mobile ? e.touches[0].clientY : e.screenY;

                _(window).bind(mousemove + '.jts_picker_event_' + parsedID, function (e) {

                    e.preventDefault();

                    currentX = mobile ? e.touches[0].clientX : e.screenX;
                    currentY = mobile ? e.touches[0].clientY : e.screenY;

                    let localX = e.globalX, localY = e.globalY;

                    let localParent = document.querySelector('#jts_sb_selector_' + parsedID).offsetParent;

                    while (localParent) {

                        localX -= localParent.offsetLeft;
                        localY -= localParent.offsetTop;

                        localParent = localParent.offsetParent;

                    }

                    vX = currentX - previousX;
                    vY = currentY - previousY;

                    previousX = currentX;
                    previousY = currentY;


                    let target = document.querySelector('#jts_sb_selector_' + parsedID);

                    let x = target.offsetLeft;
                    let y = target.offsetTop;

                    x += vX;
                    y += vY;

                    x = localX < 0 ? 0 : (localX > SATURATION_BRIGHTNESS_SIZE ? SATURATION_BRIGHTNESS_SIZE : x);
                    y = localY < 0 ? 0 : (localY > SATURATION_BRIGHTNESS_SIZE ? SATURATION_BRIGHTNESS_SIZE : y);
                    x = x < 0 ? 0 : (x > SATURATION_BRIGHTNESS_SIZE ? SATURATION_BRIGHTNESS_SIZE : x);
                    y = y < 0 ? 0 : (y > SATURATION_BRIGHTNESS_SIZE ? SATURATION_BRIGHTNESS_SIZE : y);

                    target.style.left = x + 'px';
                    target.style.top = y + 'px';

                    let data = computeColors(x, y, document.querySelector('#jts_hue_selector_' + parsedID).offsetTop);

                    if (configuration.update) {

                        _(element).css('background-color', data.rgb_string);

                    }

                    updatePicker(data);
                    _(element).emits(jTS.built_in_events.jCOLOR_PICKER_UPDATED , data);

                });
                _(window).bind(mouseup + '.jts_picker_event_' + parsedID, function (e) {

                    _(window).unbind('.jts_picker_event_' + parsedID);

                });

            });

            _('#jts_hue_selector_' + parsedID).bind(mousedown + '.jts_picker_event_' + parsedID, function (e) {

                e.preventDefault();

                currentY = mobile ? e.touches[0].clientY : e.screenY;
                previousY = mobile ? e.touches[0].clientY : e.screenY;

                _(window).bind(mousemove + '.jts_picker_event_' + parsedID, function (e) {

                    e.preventDefault();

                    currentY = mobile ? e.touches[0].clientY : e.screenY;

                    let localY = e.globalY;

                    let localParent = document.querySelector('#jts_hue_selector_' + parsedID).offsetParent;

                    while (localParent) {

                        localY -= localParent.offsetTop;

                        localParent = localParent.offsetParent;

                    }

                    vY = currentY - previousY;

                    previousY = currentY;


                    let target = document.querySelector('#jts_hue_selector_' + parsedID);

                    let y = target.offsetTop;

                    y += vY;

                    y = localY < 0 ? 0 : (localY > HUE_CONTAINER_HEIGHT ? HUE_CONTAINER_HEIGHT : y);
                    y = y < 0 ? 0 : (y > HUE_CONTAINER_HEIGHT ? HUE_CONTAINER_HEIGHT : y);

                    target.style.top = y + 'px';

                    let sb = document.querySelector('#jts_sb_selector_' + parsedID);
                    let data = computeColors(sb.offsetLeft, sb.offsetTop, y);

                    if (configuration.update) {

                        _(element).css('background-color', data.rgb_string);

                    }

                    updatePicker(data);
                    _(element).emits(jTS.built_in_events.jCOLOR_PICKER_UPDATED, data);

                });
                _(window).bind(mouseup + '.jts_picker_event_' + parsedID, function (e) {

                    _(window).unbind('.jts_picker_event_' + parsedID);

                });

            });

            _('#jts_picker_container_' + parsedID + ' .jts_picker_shade_image').bind(mouseup + '.jts_picker_event_' + parsedID, function (e) {

                let localX = e.localX, localY = e.localY;

                let localParent = this;

                while (localParent) {

                    localX -= localParent.offsetLeft;
                    localY -= localParent.offsetTop;

                    localParent = localParent.offsetParent;

                }

                _('#jts_sb_selector_' + parsedID).css({ 'left': localX, 'top': localY });

                let data = computeColors(localX, localY, document.querySelector('#jts_hue_selector_' + parsedID).offsetTop);

                if (configuration.update) {

                    _(element).css('background-color', data.rgb_string);

                }

                updatePicker(data);
                _(element).emits(jTS.built_in_events.jCOLOR_PICKER_UPDATED, data);

            });

            _('#jts_picker_container_' + parsedID + ' .jts_picker_hue_image').bind(mouseup + '.jts_picker_event_' + parsedID, function (e) {

                let localY = e.localY;

                let localParent = this;

                while (localParent) {

                    localY -= localParent.offsetTop;

                    localParent = localParent.offsetParent;

                }

                _('#jts_hue_selector_' + parsedID).css('top', localY);

                let sb = document.querySelector('#jts_sb_selector_' + parsedID);
                let data = computeColors(sb.offsetLeft, sb.offsetTop, localY);

                if (configuration.update) {

                    _(element).css('background-color', data.rgb_string);

                }

                updatePicker(data);
                _(element).emits(jTS.built_in_events.jCOLOR_PICKER_UPDATED , data);

            });

            _('#jts_picker_container_' + parsedID + ' .jts_picker_submit').bind(mouseup + '.jts_picker_event_' + parsedID, function (e) {

                _(container).unbind('.jts_picker_event_' + parsedID);
                _('#jts_sb_selector_' + parsedID).unbind('.jts_picker_event_' + parsedID);
                _('#jts_hue_selector_' + parsedID).unbind('.jts_picker_event_' + parsedID);
                _('#jts_picker_container_' + parsedID + ' .jts_picker_shade_image').unbind('.jts_picker_event_' + parsedID);
                _('#jts_picker_container_' + parsedID + ' .jts_picker_hue_image').unbind('.jts_picker_event_' + parsedID);
                _('#jts_picker_container_' + parsedID + ' .jts_picker_submit').unbind('.jts_picker_event_' + parsedID);

                _(container).dispose();

                pickerOut = false;

            });

        }

        function updatePicker(data) {

            _('#jts_picker_container_' + parsedID + ' .jts_picker_table').css('background-color', 'hsl(' + data.hsl[0] + ', 100% , 50%)');
            _('#jts_red_val_' + parsedID).html(String(data.rgb[0]));
            _('#jts_green_val_' + parsedID).html(String(data.rgb[1]));
            _('#jts_blue_val_' + parsedID).html(String(data.rgb[2]));
            _('#jts_exadecimal_val_' + parsedID).html(data.hexadecimal);
            _('#jts_picker_container_' + parsedID + ' .jts_picker_next_color').css('background-color', data.rgb_string);

        }

    }

    function parseRGBColor(e) {

        let style = getComputedStyle(e);
        let color = style.getPropertyValue("background-color");
        color = color.indexOf('rgba') !== -1 ? 'rgb(255,0,0)' : color;

        let rgbPrefixLength = 4;
        let subString = color.substring(rgbPrefixLength, color.length - 1);
        let array = subString.split(',');

        return parse(array, 0);

        function parse(a, i) {

            if (i < a.length) {

                a[i] = parseInt(a[i]);
                return parse(a, i + 1);

            }
            else {

                return a;

            }

        }

    }

    function rGBtoHSB(rgb) {

        let hue = 0;
        let saturation = 0;
        let brightness = 0;

        /*Convert the RGB values to the range 0-1, this can be done by dividing the value by 255 for 8-bit color depth*/
        let r = rgb[0] / 255;
        let g = rgb[1] / 255;
        let b = rgb[2] / 255;

        /*Find the minimum and maximum values of R, G and B. e delta*/
        let valoreMassimo = Math.max(r, g);
        valoreMassimo = Math.max(valoreMassimo, b);
        let valoreMinimo = Math.min(r, g);
        valoreMinimo = Math.min(valoreMinimo, b);
        let delta = valoreMassimo - valoreMinimo;

        /*Now calculate the Luminace*/
        brightness = Math.round(valoreMassimo * 100);

        /*The next step is to find the saturation and hue se delta != 0*/
        if (delta !== 0) {

            /*trova saturazione*/
            saturation = Math.round(delta / valoreMassimo * 100);
            /*calcolo hue*/
            let deltaH = delta / 2;
            let deltaR = ((valoreMassimo - r) / 6) + deltaH;
            deltaR /= delta;
            let deltaG = ((valoreMassimo - g) / 6) + deltaH;
            deltaG /= delta;
            let deltaB = ((valoreMassimo - b) / 6) + deltaH;
            deltaB /= delta;

            /*The Hue formula is depending on what RGB color channel is the max value.*/
            if (valoreMassimo === r) {

                hue = deltaB - deltaG;

            }
            else if (valoreMassimo === g) {

                hue = (1 / 3) + deltaR - deltaB;

            }
            else if (valoreMassimo === b) {

                hue = (2 / 3) + deltaG - deltaR;

            }

            if (hue < 0) {

                hue += 1;

            }
            if (hue > 1) {

                hue -= 1;
            }

            hue *= 360;
            hue = Math.round(hue);
        }

        return [hue, saturation, brightness];

    }

    function rGBtoEXADECIMAL(rgb) {

        let value = '';

        for (let i = 0; i < rgb.length; i++) {

            let hex = rgb[i].toString(16);
            hex = hex.length === 1 ? '0' + hex : hex;

            value += hex;

        }

        return value;

    }

    function rGBtoHSL(rgb) {

        /*Convert the RGB values to the range 0-1, this can be done by dividing the value by 255 for 8-bit color depth*/
        let r = rgb[0] / 255;
        let g = rgb[1] / 255;
        let b = rgb[2] / 255;

        /*Find the minimum and maximum values of R, G and B.*/
        let valoreMassimo = Math.max(r, g);
        valoreMassimo = Math.max(valoreMassimo, b);
        let valoreMinimo = Math.min(r, g);
        valoreMinimo = Math.min(valoreMinimo, b);

        /*Now calculate the Luminace value by adding the max and min values anddivide by 2.*/
        let luminance = (valoreMinimo + valoreMassimo) / 2;
        let luminanceRow = luminance;
        luminance = Math.round(luminance * 100);

        /*The next step is to find the Saturation.
        If Luminance is smaller then 0.5, then Saturation = (max-min)/(max+min)
        If Luminance is bigger then 0.5. then Saturation = ( max-min)/(2.0-max-min)*/
        let saturation = 0;
        if (luminance >= 0.5) {

            saturation = (valoreMassimo - valoreMinimo) / (2.0 - valoreMassimo + valoreMinimo);

        }
        else {

            saturation = (valoreMassimo - valoreMinimo) / (valoreMassimo + valoreMinimo);

        }

        saturation = Math.round(saturation * 100);

        /*The next step is to find the hue.
        The Hue formula is depending on what RGB color channel is the max value.
        If Red is max, then Hue = (G-B)/(max-min)
        If Green is max, then Hue = 2.0 + (B-R)/(max-min)
        If Blue is max, then Hue = 4.0 + (R-G)/(max-min)*/
        let hue = 0;
        if (valoreMassimo === r) {

            hue = (g - b) / (valoreMassimo - valoreMinimo);

        }
        else if (valoreMassimo === g) {

            hue = 2.0 + (b - r) / (valoreMassimo - valoreMinimo);

        }
        else if (valoreMassimo === b) {

            hue = 4.0 + (r - g) / (valoreMassimo - valoreMinimo);

        }
        /*The Hue value you get needs to be multiplied by 60 to convert it to degrees on the color circle
        If Hue becomes negative you need to add 360 to, because a circle has 360 degrees.*/
        hue = Math.round(hue * 60);
        if (hue < 0) {

            hue += 360;

        }

        return [Math.round(hue), Math.round(saturation), Math.round(luminance)];

    }

    function hSBtoRGB(hsb) {

        let r = 0;
        let g = 0;
        let bRGB = 0;

        let h = (hsb[0] / 360);
        let s = (hsb[1] / 100);
        let b = (hsb[2] / 100);
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = b * (1 - s);
        let q = b * (1 - f * s);
        let t = b * (1 - (1 - f) * s);

        let _r, _g, _b;

        switch (i % 6) {

            case 0: _r = b; _g = t; _b = p; break;
            case 1: _r = q; _g = b; _b = p; break;
            case 2: _r = p; _g = b; _b = t; break;
            case 3: _r = p; _g = q; _b = b; break;
            case 4: _r = t; _g = p; _b = b; break;
            case 5: _r = b; _g = p; _b = q; break;

        }

        _r = Math.floor(_r * 255);
        _g = Math.floor(_g * 255);
        _b = Math.floor(_b * 255);

        r = _r;
        g = _g;
        bRGB = _b;

        return [r, g, bRGB];

    }

    function computeColors(sbX, sbY, hueY) {

        let h = hueY * (HUE_RANGE / HUE_CONTAINER_HEIGHT);
        h = HUE_RANGE + (-h);

        let s = sbX * (100 / SATURATION_BRIGHTNESS_SIZE);
        let b = sbY * (100 / SATURATION_BRIGHTNESS_SIZE);
        b = 100 + (-b);

        let hsb = [h, s, b];
        let rgb = hSBtoRGB(hsb);
        let hsl = rGBtoHSL(rgb);
        let hexadecimal = rGBtoEXADECIMAL(rgb);
        let rgbString = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
        let hslString = "hsl(" + hsl[0] + "," + hsl[1] + "%," + hsl[2] + "%)";

        return {

            'hsb': hsb,
            'hsl': hsl,
            'rgb': rgb,
            'hexadecimal': hexadecimal,
            'hsl_string': hslString,
            'rgb_string': rgbString

        };

    }

    return this;

};

/**
 *
 * @param file {File}
 * @param callback {Function}
 * @param configuration {Object}
 * @return {jTS}
 */
jTS.fn.cropper = /*jTS*/function (/*File*/file ,/*Function*/callback ,/*Object literal*/configuration) {

    const t = this;

    let BYTES_SIZE = 1024 * 1024 * 10;
    let BORDER_VX = 350;

    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {

        console.log('accepts-only-.jpg-.png-.gif-files @jTSCropper');
        return;

    }

    if (file.size > BYTES_SIZE) {

        console.log('max-size-allowed-10MB @jTSCropper');
        return;

    }

    let onMobile = jTS.jMobile();
    let cropperID = new Date().getTime() + "" + Math.floor(Math.random() * 500);

    let mousedown = onMobile ? 'touchstart' : 'mousedown';
    let mousemove = onMobile ? 'touchmove' : 'mousemove';
    let mouseup =   onMobile ? 'touchend' : 'mouseup';

    let originalWidth;
    let originalHeight;
    let originalBlobSrc;
    let type;
    let name;
    let extension;
    let image;
    let currentWidth;
    let currentHeight;
    let imageWidth;
    let imageHeight;
    let base;
    let cropBase;
    let croppedImage;
    let cropSpot;
    let cropBorder;
    let controls;
    let doneB;
    let closeB;
    let resetB;
    let sizeLabel;

    let cropperHandlesArray = [];
    let reader = new FileReader();

    reader.readAsArrayBuffer(file);

    reader.onload = function () {

        let blob = new Blob([reader.result]);
        let src = window.URL.createObjectURL(blob);

        type = file.type;
        originalBlobSrc = src;
        name = file.name.split('.')[0];
        extension = '.' + file.name.split('.')[1];

        setImage();

    };

    function addCropper() {

        let offsetParent = document.querySelector('body');

        base = document.createElement('div');
        cropBase = document.createElement('div');
        cropSpot = document.createElement('div');
        cropBorder = document.createElement('div');
        controls = document.createElement('div');
        doneB = document.createElement('div');
        closeB = document.createElement('div');
        resetB = document.createElement('div');
        sizeLabel = document.createElement('div');

        croppedImage = new Image();
        croppedImage.alt = 'jts_cropper_img';
        croppedImage.src = image.src;

        _(base).css({

            'position': 'fixed',
            'left': 0,
            'top': 0,
            'z-index': 100,
            'background-color': 'rgba(255,255,225,0)'

        }).addClass('jts_cropper_' + cropperID).attr('id', 'jts_cropper_base_' + cropperID);

        _(cropBase).css({

            'position': 'absolute',
            'left': 0,
            'top': 0,
            'z-index': 100,
            'background-color': configuration && configuration.overflow_background ? configuration.overflow_background : 'rgba(255,0,0,0.6)'

        }).addClass('jts_cropper_' + cropperID);

        _(croppedImage).css({

            'position': 'absolute'

        }).addClass('jts_cropper_' + cropperID);

        _(cropSpot).css({

            'position': 'absolute',
            'overflow': 'hidden',
            'z-index': 105,
            'background-color': configuration && configuration.crop_background ? configuration.crop_background : '#ffffff'

        }).addClass('jts_cropper_' + cropperID);

        _(cropBorder).css({

            'position': 'absolute',
            'z-index': 110

        }).addClass('jts_cropper_' + cropperID).addClass('jts_cropper_border_' + cropperID);

        _(controls).css({

            'position': 'absolute',
            'z-index': 150,
            'height': 50,
            'bottom': 50,
            'width': 190,
            'overflow': 'visible',
            'left': 'calc(50% - 95px)'

        }).addClass('jts_cropper_' + cropperID);

        _(resetB).css({

            'left': 0,
            'background-color' : configuration && configuration.controls_background ? configuration.controls_background : 'rgba(255,255,255,0.5)',
            'color' : configuration && configuration.controls_color ? configuration.controls_color : '#303030',
            'box-shadow' : configuration && configuration.controls_shadow ? configuration.controls_shadow : '2px 2px 5px 0px rgba(0,0,0,0.3)',
            'border-radius' : configuration && configuration.controls_radius ? configuration.controls_radius : 3

        }).addClass('jts-crop-control').append('<i class="fab fa-rev"></i>');

        _(doneB).css({

            'left': 70,
            'background-color' : configuration && configuration.controls_background ? configuration.controls_background : 'rgba(255,255,255,0.5)',
            'color' : configuration && configuration.controls_color ? configuration.controls_color : '#303030',
            'box-shadow' : configuration && configuration.controls_shadow ? configuration.controls_shadow : '2px 2px 5px 0px rgba(0,0,0,0.3)',
            'border-radius' : configuration && configuration.controls_radius ? configuration.controls_radius : 3


        }).addClass('jts-crop-control').append('<i class="fa fa-check-double"></i>');

        _(closeB).css({

            'left': 140,
            'background-color' : configuration && configuration.controls_background ? configuration.controls_background : 'rgba(255,255,255,0.5)',
            'color' : configuration && configuration.controls_color ? configuration.controls_color : '#303030',
            'box-shadow' : configuration && configuration.controls_shadow ? configuration.controls_shadow : '2px 2px 5px 0px rgba(0,0,0,0.3)',
            'border-radius' : configuration && configuration.controls_radius ? configuration.controls_radius : 3


        }).addClass('jts-crop-control').append('<i class="fa fa-times-circle"></i>');

        _(sizeLabel).css({

            'position' : 'absolute',
            'top' : -87,
            'left' : 'calc(50% - 75px)',
            'border-radius': 3,
            'color' : '#f1f1f1',
            'background-color' : '#000000',
            'padding' : 10,
            'font-size' : 15,
            'box-shadow' : '2px 2px 5px 0px rgba(0,0,0,0.3)',
            'font-family' : 'Helvetica',
            'width': 150,
            'text-align':'center'

        }).addClass('jts-crop-size-label');

        let borderColor = configuration && configuration.border_color ? configuration.border_color : '#ffffff'

        let style = '<style type="text/css" id="cropper_style_' + cropperID + '">' +
            '.jts_cropper_border_' + cropperID + '::before{' +
            'width:100%;height:100%;z-index:3;content:"";' +
            'position:absolute;left:0;top:0;' +
            'background-image : linear-gradient(90deg , ' + borderColor + ' , ' + borderColor + ' 50% , transparent 50% , transparent) , ' +
            'linear-gradient(90deg , ' + borderColor + ' , ' + borderColor + ' 50% , transparent 50% , transparent); ' +
            'background-position : top left , bottom right; ' +
            'background-size : 50px 1px , 50px 1px;' +
            'background-repeat : repeat-x , repeat-x;' +
            'animation-delay:0s; animation-direction:normal;' +
            'animation-iteration-count:infinite;animation-timing-function:linear;' +
            'animation-fill-mode:initial;animation-name:cropper-border-tb;' +
            '}' +
            '@keyframes cropper-border-tb{100%{background-position:top right , bottom left;}}' +
            '.jts_cropper_border_' + cropperID + '::after{' +
            'width:100%;height:100%;z-index:3;content:"";' +
            'position:absolute;left:0;top:0;' +
            'background-image : linear-gradient(transparent , transparent 50% , ' + borderColor + ' 50% , ' + borderColor + ' ) , ' +
            'linear-gradient(transparent , transparent 50% , ' + borderColor + ' 50% , ' + borderColor + ' );' +
            'background-position : top right , bottom left; ' +
            'background-size : 1px 50px , 1px 50px;' +
            'background-repeat : repeat-y , repeat-y;' +
            'animation-delay:0s; animation-direction:normal;' +
            'animation-iteration-count:infinite;animation-timing-function:linear;' +
            'animation-fill-mode:initial;animation-name:cropper-border-lr;' +
            '}' +
            '@keyframes cropper-border-lr{100%{background-position:bottom right , top left;}}' +
            '.jts-crop-size-label::after{content:"";position: absolute; top : 100%; left: calc(50% - 15px);border:solid 15px transparent;border-top-color:#000000 ;}' +
            '</style>';
        let styleBA = '<style type="text/css" id="cropper_style_ba_' + cropperID + '">' +
            '.jts_cropper_border_' + cropperID + '::before{animation-duration:' + Math.floor((imageWidth / BORDER_VX) * 100) / 100 + 's;}' +
            '.jts_cropper_border_' + cropperID + '::after{animation-duration:' + Math.floor((imageHeight / BORDER_VX) * 100) / 100 + 's;}' +
            '</style>';

        _('head').append([style, styleBA]);

        _(cropSpot).append(croppedImage);
        _(controls).append([doneB, resetB, closeB]);
        _(cropBorder).append(sizeLabel);
        _(base).append([image, cropBase, cropSpot, cropBorder, controls]);
        _(offsetParent).append(base);

        _('.jts-crop-control').css({

            'position': 'absolute',
            'width': 50,
            'height': 50,
            'top': 0,
            'cursor': 'pointer',
            'font-size' : 40,
            'padding' : '3px 0px 0px 0px',
            'text-align' : 'center'

        });

        setSize();
        addLiquidFunctions();
        setListeners();

    }

    function addLiquidFunctions() {

        let MINIMUM_SIZE = 100;

        let nameSet = ['lh', 'th', 'rh', 'bh', 'tlh', 'trh', 'blh', 'brh', 'mover'];
        let cssSet = [
            { 'width': 30, 'height': 30, 'left': -15, 'top': 'calc(50% - 15px)', 'cursor': 'ew-resize' },
            { 'width': 30, 'height': 30, 'left': 'calc(50% - 15px)', 'top': -15, 'cursor': 'ns-resize' },
            { 'width': 30, 'height': 30, 'right': -15, 'top': 'calc(50% - 15px)', 'cursor': 'ew-resize' },
            { 'width': 30, 'height': 30, 'left': 'calc(50% - 15px)', 'bottom': -15, 'cursor': 'ns-resize' },
            { 'width': 30, 'height': 30, 'left': -15, 'top': -15, 'cursor': 'nw-resize' },
            { 'width': 30, 'height': 30, 'right': -15, 'top': -15, 'cursor': 'ne-resize' },
            { 'width': 30, 'height': 30, 'left': -15, 'bottom': -15, 'cursor': 'sw-resize' },
            { 'width': 30, 'height': 30, 'right': -15, 'bottom': -15, 'cursor': 'se-resize' },
            { 'width': 50, 'height': 50, 'left': 'calc(50% - 25px)', 'top': 'calc(50% - 25px)', 'cursor': 'move' }
        ];

        createHandles(0);

        function createHandles(index) {

            if (index < nameSet.length) {

                let handle = document.createElement('div');

                let css = {

                    'background-color': configuration && configuration.handles_color ? configuration.handles_color : 'rgba(255,255,255,0.5)',
                    'position': 'absolute',
                    'z-index': 10

                };

                handle.setAttribute('name', nameSet[index]);
                handle.setAttribute('class', 'jts_cropper_handle_' + cropperID);

                _(handle).css(css).css(cssSet[index]);
                _(cropBorder).append(handle);

                cropperHandlesArray.push(handle);

                createHandles(index + 1);

            }

        }

        let cX, cY, pX, pY, vX, vY, handle;

        _('.jts_cropper_handle_' + cropperID).bind(mousedown + '.jts_cropper_handle_liquid_' + cropperID,
            function (e) {

                e.preventDefault();

                pX = onMobile ? e.originalEvent.touches[0].clientX : e.originalEvent.clientX;
                pY = onMobile ? e.originalEvent.touches[0].clientY : e.originalEvent.clientY;

                handle = _(e.target).attr('name');

                _(window).bind(mousemove + '.jts_cropper_handle_liquid_' + cropperID ,
                    function (e) {

                        cX = onMobile ? e.originalEvent.touches[0].clientX : e.originalEvent.clientX;
                        cY = onMobile ? e.originalEvent.touches[0].clientY : e.originalEvent.clientY;

                        vX = cX - pX;
                        vY = cY - pY;

                        pX = cX;
                        pY = cY;

                        switch (handle) {
                            case 'lh':
                                vX = -vX; vY = 0; break;
                            case 'th':
                                vX = 0; vY = -vY; break;
                            case 'rh':
                                vY = 0; break;
                            case 'bh':
                                vX = 0; break;
                            case 'tlh':
                                vX = -vX; vY = -vY; break;
                            case 'trh':
                                vY = -vY; break;
                            case 'blh':
                                vX = -vX; break;
                            case 'brh':
                                break;
                            case 'mover':
                                break;
                        }

                        liquidResize(vX, vY, e);

                    }).bind(mouseup + '.jts_cropper_handle_liquid_' + cropperID ,

                    function (e) {

                        _(window).unbind('.jts_cropper_handle_liquid_' + cropperID);

                    });

            });

        function liquidResize(vX, vY, e) {

            let w = _(cropBorder).outerWidth();
            let h = _(cropBorder).outerHeight();

            let left = cropBorder.offsetLeft;
            let top = cropBorder.offsetTop;

            let x = left;
            let y = top;

            if (handle !== 'mover') {

                if ((e.ctrlKey && e.shiftKey) && (handle === 'trh' || handle === 'tlh' || handle === 'brh' || handle === 'blh')) {

                    if (Math.abs(vX) > Math.abs(vY)) {

                        vY = vX;

                    }
                    else {

                        vX = vY;

                    }


                }

                let right = left + w;
                let bottom = top + h;

                if (w + vX < MINIMUM_SIZE) {

                    w = MINIMUM_SIZE;

                }
                else if (right + vX > image.offsetLeft + _(image).outerWidth() && (handle === 'rh' || handle === 'trh' || handle === 'brh')) {

                    w = (image.offsetLeft + _(image).outerWidth()) - left;

                }
                else if (left + -vX < image.offsetLeft && (handle === 'lh' || handle === 'tlh' || handle === 'blh')) {

                    w = right - image.offsetLeft;

                }
                else {

                    w += vX;

                }

                if (h + vY < MINIMUM_SIZE) {

                    h = MINIMUM_SIZE;

                }
                else if (bottom + vY > image.offsetTop + _(image).outerHeight() && (handle === 'blh' || handle === 'bh' || handle === 'brh')) {

                    h = (image.offsetTop + _(image).outerHeight()) - top;

                }
                else if (top + -vY < image.offsetTop && (handle === 'th' || handle === 'tlh' || handle === 'trh')) {

                    h = bottom - image.offsetTop;

                }
                else {

                    h += vY;

                }

                switch (handle) {
                    case 'lh':
                        x = right - w;
                        break;
                    case 'th':
                        y = bottom - h;
                        break;
                    case 'tlh':
                        x = right - w;
                        y = bottom - h;
                        break;
                    case 'trh':
                        y = bottom - h;
                        break;
                    case 'blh':
                        x = right - w;
                        break;
                }


            }
            else {

                x += vX;
                y += vY;
                checkBorder();

            }

            let css = {

                'width': w,
                'height': h,
                'left': x,
                'top': y

            };

            _(cropBorder).css(css);


            synchronizes();

            function synchronizes() {

                _(cropSpot).css({

                    'width': _(cropBorder).outerWidth(),
                    'height': _(cropBorder).outerHeight(),
                    'left': cropBorder.offsetLeft,
                    'top': cropBorder.offsetTop

                });

                _(croppedImage).css({

                    'left': image.offsetLeft - cropSpot.offsetLeft,
                    'top': image.offsetTop - cropSpot.offsetTop

                });

                _(sizeLabel).html('<span>width : ' + w + 'px</span><br><span>height : ' + h + 'px</span>');

                let styleBA = '.jts_cropper_border_' + cropperID + '::before{animation-duration:' + Math.floor((w / BORDER_VX) * 100) / 100 + 's;}' +
                    '.jts_cropper_border_' + cropperID + '::after{animation-duration:' + Math.floor((h / BORDER_VX) * 100) / 100 + 's;}';

                _('#cropper_style_ba_' + cropperID).html(styleBA);

            }

            function checkBorder() {

                if (x < image.offsetLeft) {

                    x = image.offsetLeft;

                }

                if (y < image.offsetTop) {

                    y = image.offsetTop;

                }

                if (x + _(cropBorder).outerWidth() > image.offsetLeft + _(image).outerWidth()) {

                    x = (image.offsetLeft + _(image).outerWidth()) - _(cropBorder).outerWidth();

                }

                if (y + _(cropBorder).outerHeight() > image.offsetTop + _(image).outerHeight()) {

                    y = (image.offsetTop + _(image).outerHeight()) - _(cropBorder).outerHeight();

                }

            }

        }

    }

    function croppingDone(){

        let cropX = cropBorder.offsetLeft - image.offsetLeft;
        let cropY = cropBorder.offsetTop - image.offsetTop;
        let cropW = _(cropBorder).outerWidth();
        let cropH = _(cropBorder).outerHeight();

        let parsedCX = Math.round(cropX * (originalWidth / imageWidth));
        let parsedCY = Math.round(cropY * (originalHeight / imageHeight));
        let parsedCW = Math.round(cropW * (originalWidth / imageWidth));
        let parsedCH = Math.round(cropH * (originalHeight / imageHeight));

        let canvas = document.createElement('canvas');

        canvas.width = parsedCW;
        canvas.height = parsedCH;

        let brush = canvas.getContext('2d');

        brush.drawImage(image, parsedCX, parsedCY, parsedCW, parsedCH, 0, 0, canvas.width, canvas.height);

        let src = canvas.toDataURL(type, 1.0);
        let r = new XMLHttpRequest();

        r.open('get', src);

        r.responseType = 'arraybuffer';
        r.onreadystatechange = function () {

            if (r.readyState === 4) {

                if (r.status === 200) {

                    let blob = new Blob([r.response], { 'type': type });
                    let blobSRC = URL.createObjectURL(blob);
                    let croppedImage = new Image();

                    blob.lastModified = new Date().getTime();
                    blob.lastModifiedDate = new Date();
                    blob.name = name + extension;

                    croppedImage.alt = 'jts_cropped_image';
                    croppedImage.src = blobSRC;

                    let data = {

                        'image_original_width': originalWidth,
                        'image_original_height': originalHeight,
                        'image_original': image,
                        'image_cropped': croppedImage,
                        'file_original': file,
                        'file_cropped': blob,
                        'type': type,
                        'src_original': originalBlobSrc,
                        'src_crop': blobSRC,
                        'crop_x': parsedCX,
                        'crop_y': parsedCY,
                        'crop_width': parsedCW,
                        'crop_height': parsedCH,
                        'extension': extension,
                        'file_name': name

                    };

                    if (callback) {

                        callback(data);

                    }

                    _(window).emits(jTS.built_in_events.jCROPPER_DONE, data);
                    dispose();

                }
                else {

                    console.log('unknown-error @jTSCropper');
                    dispose();

                }

            }

        };

        r.send(null);

    }

    function dispose() {

        _(window).unbind('.jts_cropper_events_' + cropperID);
        _(resetB).unbind('.jts_cropper_events_' + cropperID);
        _(closeB).unbind('.jts_cropper_events_' + cropperID);
        _(doneB).unbind('.jts_cropper_events_' + cropperID);
        _(cropperHandlesArray).unbind('.jts_cropper_handle_liquid_' + cropperID);
        _('#cropper_style_ba_' + cropperID).dispose();
        _('#cropper_style_' + cropperID).dispose();

        if (_(base).offsetPs().length > 0) {

            _(base).dispose();

        }

    }

    function findSize() {

        let SIZE_GAP = 60;

        currentWidth = _(window).outerWidth();
        currentHeight = _(window).outerHeight();

        let data = getData(currentWidth - SIZE_GAP, currentHeight - SIZE_GAP);

        imageWidth = Math.round(data.width);
        imageHeight = Math.round(data.height);

        function getData(w, h) {

            if (w > originalWidth) {

                w = originalWidth;

            }

            if (h > originalHeight) {

                h = originalHeight;

            }

            let width, height;

            let data = {};

            if (originalWidth > originalHeight) {

                parseW(w);

            }
            else {

                parseH(h);

            }

            function parseW(w) {

                width = w;
                height = originalHeight * (width / originalWidth);

                if (height > currentHeight - SIZE_GAP) {

                    parseW(w - 1);

                }

            }

            function parseH(h) {

                height = h;
                width = originalWidth * (height / originalHeight);

                if (width > currentWidth - SIZE_GAP) {

                    parseH(h - 1);

                }

            }

            data.width = width;
            data.height = height;

            return data;

        }

    }

    function getRootN() {

        let e_parent = base;
        let r_parent = e_parent;

        while (e_parent) {

            e_parent = _(e_parent).offsetPs()[0];

            if (e_parent) {

                r_parent = e_parent;

            }

        }

        if (r_parent.nodeName.toLowerCase() !== '#document') {

            dispose();
            return false;

        }
        else {

            return true;

        }

    }

    function setImage() {

        image = new Image();

        image.alt = 'jts_cropper_img';
        image.onload = function () {

            originalWidth = this.naturalWidth || this.width;
            originalHeight = this.naturalHeight || this.height;

            _(window).bind('resize.jts_cropper_events_' + cropperID ,
                function () {

                    if (!getRootN()) {

                        return;

                    }

                    findSize();
                    setSize();

                });

            _(window).bind('click.jts_cropper_events_' + cropperID,
                function () {

                    if (!getRootN()) {

                        return;

                    }

                });

            findSize();
            addCropper();

        };

        image.src = originalBlobSrc;

        _(image).css('position', 'absolute').addClass('jts_cropper_' + cropperID);

    }

    function setListeners() {

        _(resetB).bind(mouseup + '.jts_cropper_events_' + cropperID , function (e) {

            findSize();
            setSize();

        });

        _(closeB).bind(mouseup + '.jts_cropper_events_' + cropperID , function (e) {

            dispose();
            _(window).emits(jTS.built_in_events.jCROPPER_ONLY_CLOSED);

        });

        _(doneB).bind(mouseup + '.jts_cropper_events_' + cropperID, function (e) {

            croppingDone();

        });

    }

    function setSize() {

        _(base).css({

            'width': currentWidth,
            'height': currentHeight

        });

        _(image).css({

            'width': imageWidth,
            'height': imageHeight,
            'left': Math.round((currentWidth * 0.5) - (imageWidth * 0.5)),
            'top': Math.round((currentHeight * 0.5) - (imageHeight * 0.5))

        });

        _(cropBase).css({

            'width': currentWidth,
            'height': currentHeight

        });

        _(cropSpot).css({

            'width': imageWidth,
            'height': imageHeight,
            'left': Math.round((currentWidth * 0.5) - (imageWidth * 0.5)),
            'top': Math.round((currentHeight * 0.5) - (imageHeight * 0.5))

        });

        _(croppedImage).css({

            'width': imageWidth,
            'height': imageHeight,
            'left': image.offsetLeft - cropSpot.offsetLeft,
            'top': image.offsetTop - cropSpot.offsetTop

        });

        _(cropBorder).css({

            'width': imageWidth,
            'height': imageHeight,
            'left': Math.round((currentWidth * 0.5) - (imageWidth * 0.5)),
            'top': Math.round((currentHeight * 0.5) - (imageHeight * 0.5))

        });

        _(sizeLabel).html('<span>width : ' + parseInt(imageWidth) + 'px</span><br><span>height : ' + parseInt(imageHeight) + 'px</span>');

        let styleBA = '.jts_cropper_border_' + cropperID + '::before{animation-duration:' + Math.floor((imageWidth / BORDER_VX) * 100) / 100 + 's;}' +
            '.jts_cropper_border_' + cropperID + '::after{animation-duration:' + Math.floor((imageHeight / BORDER_VX) * 100) / 100 + 's;}';

        _('#cropper_style_ba_' + cropperID).html(styleBA);

    }

    return this;

};

/**
 *
 * @param configuration {Object}
 * @return {jTS}
 */
jTS.fn.datePicker = /*jTS*/function(/*Object literal*/ configuration){

    let Y_GAP = 5;
    let MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let WEEK_DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];
    let DATE_FORMAT = configuration && configuration.format ? configuration.format : 'd/m/y';
    let PRESS_DELAY = 150;

    addStyles();

    this.each(function(i,e){

        addDatePickerFeatures(i,e);

    });

    function addDatePickerFeatures(i,e) {

        let pickerOpen = false;
        let element = e;
        let jElement = _(e);
        let mousePressed = false;
        let pressID = null;

        jElement.bind('keydown keyup.jts_date_picker_events',function(e){

            e.preventDefault();

        });

        jElement.bind('click.jts_date_picker_events',showPicker);

        function showPicker(e){

            e.preventDefault();

            if(!pickerOpen){

                pickerOpen = true;
                openPicker();

            }

        }

        function openPicker(){

            let currentDate = null;
            let currentMonth = null;
            let currentYear = null;
            let currentDay = null;

            let pickerBox = _('<div class="date_picker_box"></div>');
            let previousButton = _('<div class="dp_previous_button dp_top_button"><i class="fa fa-caret-square-left"></i></div>');
            let nextButton = _('<div class="dp_next_button dp_top_button"><i class="fa fa-caret-square-right"></i></div>');
            let monthYearTop = _('<div class="dp_top_month_year ts-font-elegance"></div>');
            let monthDaysBox = _('<div class="dp_month_days_box"></div>');

            let currentShowedDays = [];

            setMainBoard();

            setCoordinates();

            if(configuration && configuration.onBeforePicker){

                configuration.onBeforePicker(pickerBox);

            }

            _('body').append(pickerBox);
            setCurrentData();
            setListeners();

            function activateShowedDays(){

                currentShowedDays.forEach(function(e){

                    e.bind('click.jts_ts_date_picker_events',function(e){

                        let date = _(this).attr('data-date_ref');

                        jElement.value(date);
                        disposePicker();

                    });

                });

            }

            function deactivateShowedDays(){

                currentShowedDays.forEach(function(e){

                    e.unbind('click');

                });

            }

            function disposePicker(){

                pickerBox.unbind('mousedown mouseup');
                previousButton.unbind('click');
                nextButton.unbind('click');
                jElement.unbind('focusout.jts_date_picker_events');

                deactivateShowedDays();

                pickerBox.hide(300,{

                    'method' : 'fade',
                    'endCB' : function(){

                        pickerBox.dispose();
                        pickerOpen = false;

                    }

                });

            }

            function getCoordinates(){

                let parent = element;
                let x = 0;
                let y = 0;

                while(parent){

                    x += parent.offsetLeft;
                    y += parent.offsetTop;
                    parent= parent.offsetParent;

                }

                return {'x':x,'y':y};

            }

            function getFormattedDate(currentDayDate){

                let currentDayString = "";
                let isTheSameDate = false;

                if(DATE_FORMAT === 'd/m/y'){

                    currentDayString = currentDayDate.getDate() + "/" + (currentDayDate.getMonth() + 1) + "/" + currentDayDate.getFullYear();

                    if(currentDayString === currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear()) {

                        isTheSameDate = true;

                    }

                }
                else if(DATE_FORMAT === 'y/m/d'){

                    currentDayString = currentDayDate.getFullYear() + "/" + (currentDayDate.getMonth() + 1) + "/" + currentDayDate.getDate();

                    if(currentDayString === currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getDate()) {

                        isTheSameDate = true;

                    }

                }

                return {'currentDayDateString' : currentDayString , 'isTheSameDate' : isTheSameDate};

            }

            function getNextMonth(){

                currentMonth = currentMonth + 1 === 12 ? 0 : currentMonth + 1;
                currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;

                setHeaderText();
                deactivateShowedDays();
                setMonthDays();

            }

            function getPreviousMonth(){

                currentMonth = currentMonth - 1 === -1 ? 11 : currentMonth - 1;
                currentYear = currentMonth === 11 ? currentYear -1 : currentYear;

                setHeaderText();
                deactivateShowedDays();
                setMonthDays();

            }

            function pressPreviousMonth() {

                if(mousePressed){

                    getPreviousMonth();

                    pressID = setTimeout(pressPreviousMonth,PRESS_DELAY);

                }

            }

            function pressNextMonth() {

                if(mousePressed){

                    getNextMonth();

                    pressID = setTimeout(pressNextMonth,PRESS_DELAY);

                }

            }

            function setCoordinates(){

                let coordinates = getCoordinates();

                pickerBox.css({'top':coordinates.y + jElement.outerHeight() + Y_GAP,'left':coordinates.x});

            }

            function setCurrentData(){

                let data = jElement.value();

                if(data !== ""){

                    data = data.split("/");

                    if(DATE_FORMAT === 'd/m/y'){

                        currentDate = new Date(parseInt(data[2]),parseInt(data[1] - 1),parseInt(data[0]));

                    }
                    else if(DATE_FORMAT === 'y/m/d'){

                        currentDate = new Date(parseInt(data[0]),parseInt(data[1] - 1),parseInt(data[2]));

                    }

                }
                else{

                    currentDate = new Date();

                }

                currentMonth = currentDate.getMonth();
                currentYear = currentDate.getFullYear();
                currentDay = currentDate.getDate();

                setHeaderText();
                setMonthDays();

            }

            function setHeaderText(){

                monthYearTop.html(MONTHS[currentMonth].toUpperCase() + ' ' + currentYear);

            }

            function setListeners(){

                pickerBox.bind('mousedown mouseup.jts_date_picker_events',function(e){

                    e.preventDefault();

                });

                previousButton.bind('click.jts_date_picker_events',function(e){

                    getPreviousMonth();

                });

                nextButton.bind('click.jts_date_picker_events',function(e){

                    getNextMonth();

                });

                previousButton.mouseDown('jts_date_picker_events',(e) => {

                    mousePressed = true;

                    pressID = setTimeout(pressPreviousMonth,PRESS_DELAY);

                });

                nextButton.mouseDown('jts_date_picker_events',(e) => {

                    mousePressed = true;

                    pressID = setTimeout(pressNextMonth,PRESS_DELAY);

                });

                previousButton.mouseUp('jts_date_picker_events',(e) => {

                    mousePressed = false;

                    clearTimeout(pressID);

                });

                nextButton.mouseUp('jts_date_picker_events',(e) => {

                    mousePressed = false;

                    clearTimeout(pressID);

                });

                jElement.bind('focusout.jts_date_picker_events',function(e){

                    disposePicker();

                });

            }

            function setMainBoard(){

                let pickerHeader = _('<div class="date_picker_header"></div>');

                let weekDaysRow = _('<div class="dp_week_days_row"></div>');

                for(let i = 0; i < WEEK_DAYS.length; i++){

                    let weekDayTh = _('<div class="dp_week_day_th ts-font-elegance">' + WEEK_DAYS[i] + '</div>');

                    if(configuration && configuration.onBeforeWeekDays){

                        configuration.onBeforeWeekDays(weekDayTh);

                    }

                    weekDaysRow.append(weekDayTh);

                }

                if(configuration && configuration.onBeforeInterface){

                    configuration.onBeforeInterface(pickerHeader,previousButton,monthYearTop,nextButton);

                }

                pickerHeader.append(previousButton).append(monthYearTop).append(nextButton);
                pickerBox.append(pickerHeader).append(weekDaysRow).append(monthDaysBox);

            }

            function setMonthDays(){

                monthDaysBox.html('');
                currentShowedDays = [];

                let daysInCurrentMonth = new Date(currentYear,currentMonth + 1,0).getDate();
                let startGap = new Date(currentYear,currentMonth,1).getDay();

                for(let i = 0; i < startGap; i++){

                    let fakeDay = _('<div class="dp_fake_day"></div>');

                    monthDaysBox.append(fakeDay);

                }

                for(let l = 0; l < daysInCurrentMonth; l++){

                    let currentDayDate = new Date(currentYear,currentMonth,(l + 1));
                    let formattedData = getFormattedDate(currentDayDate);

                    let realDay = _('<div class="dp_real_day"></div>');

                    let dayInner = _('<div class="dp_inner_day ts-font-elegance" data-date_ref="' + formattedData.currentDayDateString + '">' + (l + 1) + '</div>');

                    if(formattedData.isTheSameDate){

                        dayInner.addClass("dp_current_highlighted_day");

                    }

                    if(configuration && configuration.onShowDay){

                        configuration.onShowDay(currentDayDate,dayInner,realDay);

                    }

                    realDay.append(dayInner);
                    monthDaysBox.append(realDay);
                    currentShowedDays.push(dayInner);

                }

                activateShowedDays();

            }

        }

    }

    function addStyles(){

        let pickerStyle = '<style type="text/css" id="date_picker_style">' +
                '.date_picker_box{position: absolute;width: 300px;height: 300px;border-radius: 5px;' +
                'z-index: 1;background-color: #ffffff;border: solid 1px #b2b2b2;box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.3);' +
                'padding: 5px;}.date_picker_header {position: relative;width: 100%;height: 50px;border-radius: 5px;' +
                'background-color: #e5e5e5;}.dp_top_button {position: relative;width: 50px;height: 100%;font-size: 40px;' +
                'color: #f1f1f1;cursor: pointer;padding: 3px 5px;float: left;}.dp_top_month_year {position: relative;' +
                'height: 100%;width: calc(100% - 100px);color: #fbfbfb;text-align: center;font-size: 21px;font-weight: 700;' +
                'float: left;padding: 15px 0 0 0;}.dp_week_days_row {width: 100%;height: 30px;position: relative;' +
                'margin: 5px 0;}.dp_week_day_th {position: relative;float: left;height: 100%;width: calc(100% / 7);' +
                'text-align: center;padding: 3px;font-size: 18px;font-weight: 600;}' +
                '.dp_month_days_box {position: relative;width: 100%;height: 200px;}.dp_fake_day, .dp_real_day {' +
                'position: relative;float: left;width: calc(100% / 7);height: 33px;padding: 2px;}' +
                '.dp_inner_day {position: relative;height: 100%;width: 100%;font-size: 15px;font-weight: 600;' +
                'color: #a1a1a1;padding: 3px;border-radius: 3px;border: solid 1px #b2b2b2;cursor: pointer;' +
                'background-color: #f1f1f1;}.dp_inner_day:hover {background-color: #63dbff;color: #ffffff;}' +
                '.dp_current_highlighted_day {background-color: #63dbff;color: #ffffff;}.dp_disabled {' +
                'pointer-events: none;opacity: 0.2 !important;cursor: initial !important;background-color: #f1f1f1 !important;' +
                'color: #a1a1a1 !important;border: solid 1px #b2b2b2 !important;}' +
                '</style>';

        _('head').append(pickerStyle);

    }

    return this;

};

/**
 *
 * @param itemsToShow {int}
 * @param configuration {Object}
 * @return {jTS}
 */
jTS.fn.pagination = /*jTS*/function(/*Int*/itemsToShow,/*Object literal*/configuration){

    let t = this;

    if(t.length === 0){

        return this

    }

    let pageSize = itemsToShow;
    let container = t.offsetPs();
    let interfaceContainer = configuration && configuration.interfaceParent ? _(configuration.interfaceParent) : container;
    let pages = Math.ceil(t.length / pageSize);
    let startIndex = 0;
    let pageIndex = 0;
    let interfaceBox = null;

    addStyles();
    displayItems();
    addInterface();
    updateInterface();

    _(window).emits(jTS.built_in_events.jPAGINATION_PAGE_CHANGE,{

        items_displayed : itemsToShow,
        page_index : pageIndex + 1,
        total_pages : pages

    });


    _(window).on(jTS.built_in_events.jPAGINATION_UPDATE_ITEMS,updateItemsToShow);
    _(window).on(jTS.built_in_events.jPAGINATION_FILTER_SORT_ITEMS,filterSortItems);

    function addInterface(){

        let interfaceBoxClass = configuration && configuration.interface_box_class ? configuration.interface_box_class : "";
        let previousNextButtonClass = configuration && configuration.previous_next_page_class ? configuration.previous_next_page_class : "";
        let pageButtonClass = configuration && configuration.page_button_class ? configuration.page_button_class : "";
        let previousLabel = configuration && configuration.previous_label ? configuration.previous_label : "PREVIOUS";
        let nextLabel = configuration && configuration.next_label ? configuration.next_label : "NEXT";

        interfaceBox = _('<div class="jts_pagination_interface_box_class ' + interfaceBoxClass  + '"></div>');
        let previousButton = _('<div class="jts_pagination_previous_next_button_class ' + previousNextButtonClass  + '" id="jts_pagination_previous_button">' + previousLabel + '</div>');
        let nextButton = _('<div class="jts_pagination_previous_next_button_class ' +  previousNextButtonClass + '" id="jts_pagination_next_button">' + nextLabel + '</div>');

        interfaceBox.append(previousButton);

        for(let i = 0; i < pages ; i++){

            interfaceBox.append('<div class="jts_pagination_page_button ' + pageButtonClass + '" data-index_ref="' + i + '">' + (i + 1) + '</div>');

        }

        interfaceBox.append(nextButton);
        interfaceContainer.append(interfaceBox);

        addListeners();

    }

    function addListeners() {

        _('#jts_pagination_previous_button').bind('click.jts_pagination_events',function(e){
            goToPreviousPage();
        });

        _('#jts_pagination_next_button').bind('click.jts_pagination_events',function(e){
            goToNextPage();
        });

        _('.jts_pagination_page_button').bind('click.jts_pagination_events',function(e){

            goToPage(parseInt(_(this).attr('data-index_ref')));

        });

    }

    function addStyles(){

        let interfaceBoxClass = configuration && configuration.interface_box_class ? '' : '.jts_pagination_interface_box_class{' +
            'width:100%!important;display:block!important;position:relative!important;height:auto!important;padding:15px!important;float:left!important;}';

        let previousNextButtonClass = configuration && configuration.previous_next_page_class ? '' : '.jts_pagination_previous_next_button_class{' +
            'width:150px!important;display:block!important;position:relative!important;height:50px!important;padding:13px 5px 0px 5px!important;font-size:20px!important;font-weight:700!important;' +
            'color:#bebebe!important;border:solid 1px #bebebe!important;background-color:#ffffff!important;cursor:pointer!important;font-family:Helvetica!important;' +
            'margin:5px 10px!important;float:left!important;text-align:center!important;}' +
            '.jts_pagination_previous_next_button_class:hover{background-color:#000000!important;color:#ffffff!important;border-color:#ffffff!important;}' +
            '.jts_pagination_previous_next_button_class[active]{box-shadow:2px 2px 5px 0px rgba(0,0,0,0.5)!important;background-color:#000000!important;color:#ffffff!important;border-color:#ffffff!important;}' +
            '.jts_pagination_previous_next_button_class[disabled]{opacity:0.3!important;pointer-events:none!important;}';

        let pageButtonClass = configuration && configuration.page_button_class ? '' : '.jts_pagination_page_button{' +
            'width:50px!important;display:block!important;position:relative!important;height:50px!important;padding:13px 5px 0px 5px!important;font-size:20px!important;font-weight:700!important;' +
            'color:#bebebe!important;border:solid 1px #bebebe!important;background-color:#ffffff!important;cursor:pointer!important;font-family:Helvetica!important;' +
            'margin:5px 10px!important;float:left!important;text-align:center!important;}' +
            '.jts_pagination_page_button:hover{background-color:#000000!important;color:#ffffff!important;border-color:#ffffff!important;}' +
            '.jts_pagination_page_button[active]{box-shadow:2px 2px 5px 0px rgba(0,0,0,0.5)!important;background-color:#000000!important;color:#ffffff!important;border-color:#ffffff!important;}';

        let paginationStyle = '<style id="jts_pagination_style" type="text/css">' +
            interfaceBoxClass +
            previousNextButtonClass +
            pageButtonClass +
            '</style>';

        _('head').append(paginationStyle);

    }

    function clearContainer() {

        container.html("");

    }

    function displayItems() {

        clearContainer();

        let lastIndex = startIndex + pageSize;
        for(let index = startIndex ; index < t.length && index < lastIndex; index++){

            container.append(t[index]);

        }

        if(interfaceBox != null){

            interfaceContainer.append(interfaceBox);

        }

    }

    function goToNextPage(){

        pageIndex = pageIndex + 1;
        startIndex = pageIndex * pageSize;
        displayItems();
        updateInterface();
        _(window).emits(jTS.built_in_events.jPAGINATION_PAGE_CHANGE,{

            items_displayed : itemsToShow,
            page_index : pageIndex + 1,
            total_pages : pages

        });

    }

    function goToPage(index){

        pageIndex = index;
        startIndex = pageIndex * pageSize;
        displayItems();
        updateInterface();
        _(window).emits(jTS.built_in_events.jPAGINATION_PAGE_CHANGE,{

            items_displayed : itemsToShow,
            page_index : pageIndex + 1,
            total_pages : pages

        });

    }

    function goToPreviousPage(){

        pageIndex = pageIndex - 1;
        startIndex = pageIndex * pageSize;
        displayItems();
        updateInterface();
        _(window).emits(jTS.built_in_events.jPAGINATION_PAGE_CHANGE,{

            items_displayed : itemsToShow,
            page_index : pageIndex + 1,
            total_pages : pages

        });

    }

    function removeListeners(){

        _('#jts_pagination_previous_button').unbind('click');

        _('#jts_pagination_next_button').unbind('click');

        _('.jts_pagination_page_button').unbind('click');

    }

    function resetInterface(){

        removeListeners();
        interfaceContainer.html("");
        addInterface();

    }

    function filterSortItems(e){

        t = e.data.filtered_sorted_items;

        startIndex = 0;
        pageIndex = 0;
        pages = Math.ceil(t.length / pageSize);
        displayItems();
        resetInterface();
        updateInterface();

        _(window).emits(jTS.built_in_events.jPAGINATION_PAGE_CHANGE,{

            items_displayed : itemsToShow,
            page_index : pageIndex + 1,
            total_pages : pages

        });

    }

    function updateInterface(){

        if(pages === 1 || pageIndex === 0 || t.length === 0){

            _('#jts_pagination_previous_button').attr('disabled',true);

        }else{

            _('#jts_pagination_previous_button').attr('disabled',false);

        }

        _('.jts_pagination_page_button').attr('active',false);
        _('.jts_pagination_page_button[data-index_ref="' + pageIndex + '"]').attr('active',true);

        if(pages === 1 || pageIndex === pages - 1 || t.length === 0){

            _('#jts_pagination_next_button').attr('disabled',true);

        }else{

            _('#jts_pagination_next_button').attr('disabled',false);

        }


    }

    function updateItemsToShow(e){

        pageSize = e.data.items_displayed;
        startIndex = 0;
        pageIndex = 0;
        pages = Math.ceil(t.length / pageSize);
        displayItems();
        resetInterface();
        updateInterface();

        _(window).emits(jTS.built_in_events.jPAGINATION_PAGE_CHANGE,{

            items_displayed : itemsToShow,
            page_index : pageIndex + 1,
            total_pages : pages

        });

    }

    return this;

};

/**
 *
 * @param isLiquid {boolean}
 * @param configuration {Object}
 * @return {jTS}
 */
jTS.fn.scrollingLiquidBox = /*jTS*/function (/*boolean*/isLiquid , /*Object literal*/configuration) {

    const t = this;

    if(t.length === 0){

        return t;

    }

    let onMobile =      jTS.jMobile();
    let boxID =         new Date().getTime() + "_" + Math.floor(Math.random() * 500);
    let container =     t[0];
    let slidingBox =    document.createElement('div');
    let scrollMarker =  document.createElement('div');
    let onNoScroll =    false;
    let inSliding =     false;
    let alreadyLiquid = false;
    let size =          false;
    let currentY =      0;

    let previousContainerX = 0;
    let previousContainerY = 0;

    let previousContainerWidth;
    let previousContainerHeight;
    let previousParentWidth;
    let previousParentHeight;
    let previousSlidingBoxHeight;

    let liquidHandlesArray = [];

    let mousedown = onMobile ? 'touchstart' : 'mousedown';
    let mouseover = onMobile ? 'touchstart' : 'mouseover';
    let mousemove = onMobile ? 'touchmove' : 'mousemove';
    let mouseout =  onMobile ? 'touchend' : 'mouseout';
    let mouseup =   onMobile ? 'touchend' : 'mouseup';

    let slidingBoxCSS = {

        'position' : 'absolute',
        'padding'  : configuration && configuration.padding ? configuration.padding : 0,
        'height'   : 'auto',
        'width'    : '100%',
        'top'      : 0,
        'left'     : 0,
        'z-index'  : 3

    };

    let scrollMarkerCss = {

        'position'         : 'absolute',
        'right'            : 0,
        'top'              : 0,
        'width'            : configuration && configuration.scroll_marker_width ? configuration.scroll_marker_width : 20,
        'box-shadow'       : configuration && configuration.scroll_marker_shadow ? configuration.scroll_marker_shadow : '-5px 5px 5px 0px rgba(0, 0, 0, 0.3)',
        'background-color' : configuration && configuration.scroll_marker_background ? configuration.scroll_marker_background : '#0eb7da',
        'border-radius'    : configuration && configuration.scroll_marker_radius ? configuration.scroll_marker_radius : 5,
        'cursor'           : 'pointer',
        'z-index'          : 15

    };

    liquid();

    function addLiquidFunctions() {

        let MINIMUM_SIZE = 100;

        let containerWidth =  _(container).outerWidth();
        let containerHeight = _(container).outerHeight();

        let parentBorderSizeX = parseInt(_(container).offsetPs().css('border-left-width'));
        let parentBorderSizeY = parseInt(_(container).offsetPs().css('border-top-width'));
        let parentBoxSizing =   _(container).offsetPs().css('box-sizing');

        parentBorderSizeX = parentBorderSizeX ? parentBorderSizeX : 0;
        parentBorderSizeY = parentBorderSizeX ? parentBorderSizeY : 0;

        let nameSet = ['lh', 'th', 'rh', 'bh', 'tlh', 'trh', 'blh', 'brh', 'mover'];
        let cssSet = [
            { 'width': 10, 'height': '100%', 'left': 0, 'top': 0, 'cursor': 'ew-resize' },
            { 'width': '100%', 'height': 10, 'left': 0, 'top': 0, 'cursor': 'ns-resize' },
            { 'width': 10, 'height': '100%', 'right': 0, 'top': 0, 'cursor': 'ew-resize' },
            { 'width': '100%', 'height': 10, 'left': 0, 'bottom': 0, 'cursor': 'ns-resize' },
            { 'width': 30, 'height': 30, 'left': 0, 'top': 0, 'cursor': 'nw-resize' },
            { 'width': 30, 'height': 30, 'right': 0, 'top': 0, 'cursor': 'ne-resize' },
            { 'width': 30, 'height': 30, 'left': 0, 'bottom': 0, 'cursor': 'sw-resize' },
            { 'width': 30, 'height': 30, 'right': 0, 'bottom': 0, 'cursor': 'se-resize' },
            { 'width': 100, 'height': 100, 'left': 'calc(50% - 50px)', 'top': 'calc(50% - 50px)', 'cursor': 'move' }
        ];

        createHandles(0);

        function createHandles(index) {

            if (index < nameSet.length) {

                let handle = document.createElement('div');

                let css = {

                    'background-color': 'transparent',
                    'position': 'absolute',
                    'z-index': 10

                };

                handle.setAttribute('name', nameSet[index]);
                handle.setAttribute('class', 'jts_liquid_box_handle_' + boxID);

                _(handle).css(css).css(cssSet[index]);
                _(container).append(handle);

                liquidHandlesArray.push(handle);

                createHandles(index + 1);

            }

        }


        let cX, cY, pX, pY, vX, vY, handle;

        _('.jts_liquid_box_handle_' + boxID).bind(mousedown + '.jts_liquid_box_liquid_handle_' + boxID,
            function (e) {

                e.preventDefault();

                pX = onMobile ? e.originalEvent.touches[0].clientX : e.originalEvent.clientX;
                pY = onMobile ? e.originalEvent.touches[0].clientY : e.originalEvent.clientY;

                handle = _(e.target).attr('name');

                _(window).bind(mousemove + '.jts_liquid_box_liquid_handle_' + boxID,
                    function (e) {

                        cX = onMobile ? e.originalEvent.touches[0].clientX : e.originalEvent.clientX;
                        cY = onMobile ? e.originalEvent.touches[0].clientY : e.originalEvent.clientY;

                        vX = cX - pX;
                        vY = cY - pY;

                        pX = cX;
                        pY = cY;

                        switch (handle) {
                            case 'lh':
                                vX = -vX; vY = 0; break;
                            case 'th':
                                vX = 0; vY = -vY; break;
                            case 'rh':
                                vX = vX; vY = 0; break;
                            case 'bh':
                                vX = 0; vY = vY; break;
                            case 'tlh':
                                vX = -vX; vY = -vY; break;
                            case 'trh':
                                vX = vX; vY = -vY; break;
                            case 'blh':
                                vX = -vX; vY = vY; break;
                            case 'brh':
                                vX = vX; vY = vY; break;
                            case 'mover':
                                vX = vX; vY = vY; break;
                        }

                        liquidResize(vX, vY);

                    }).bind(mouseup + '.jts_liquid_box_liquid_handle_' + boxID,
                    function (e) {

                        _(window).unbind('.jts_liquid_box_liquid_handle_' + boxID);

                    });

            }).bind(mouseover + '.jts_liquid_box_liquid_handle_' + boxID,
            function (e) {

                _(e.target).css('background-color', 'rgba(71, 171, 198,0.8)');

            }).bind(mouseout + '.jts_liquid_box_liquid_handle_' + boxID,
            function (e) {

                _(e.target).css('background-color', 'transparent');

            });

        function liquidResize(vX, vY) {

            let w = _(container).outerWidth();
            let h = _(container).outerHeight();

            let left = container.offsetLeft;
            let top = container.offsetTop;

            alreadyLiquid = true;

            if (jTS.jBrowser() === 'firefox' && parentBoxSizing === 'border-box') {

                left -= parentBorderSizeX;
                top -= parentBorderSizeY;

            }

            let x = left;
            let y = top;

            if (handle !== 'mover') {

                let right = left + w;
                let bottom = top + h;

                w += vX;
                h += vY;

                w = w < MINIMUM_SIZE ? MINIMUM_SIZE : w;
                h = h < MINIMUM_SIZE ? MINIMUM_SIZE : h;

                switch (handle) {
                    case 'lh':
                        x = right - w; break;
                    case 'th':
                        y = bottom - h; break;
                    case 'tlh': x = right - w; y = bottom - h; break;
                    case 'trh':
                        y = bottom - h; break;
                    case 'blh':
                        x = right - w; break;
                }

            }
            else {

                x += vX;
                y += vY;

            }

            previousContainerWidth = w;
            previousContainerHeight = h;
            previousContainerX = x;
            previousContainerY = y;

            let css = {

                'width': w,
                'height': h,
                'left': x,
                'top': y,
                'margin': '0px',
                'position': 'absolute'

            };

            _(container).css(css);
            _(container).emits(jTS.built_in_events.jLIQUID_BOX_RESIZE);

        }

    }

    function desktopScroll(e) {

        let SCROLL_VY = 130;

        let dY = -(e.originalEvent.wheelDelta) || e.originalEvent.detail;

        let vY = dY < 0 ? -SCROLL_VY : SCROLL_VY;

        let containerHeight = _(container).outerHeight();
        let sliderHeight = _(slidingBox).outerHeight();

        let y = parseInt(slidingBox.offsetTop) - vY;
        if (y > 0 || sliderHeight < containerHeight) {

            y = 0;

        }
        else if (y < containerHeight - sliderHeight) {

            y = containerHeight - sliderHeight;

        }

        currentY = y;

        _(slidingBox).css('top', y);
        setMarkerY(containerHeight, sliderHeight, Math.abs(y));

    }

    function getRootN() {

        let e_parent = container;
        let r_parent = e_parent;

        while (e_parent) {

            e_parent = _(e_parent).offsetPs()[0];

            if (e_parent) {

                r_parent = e_parent;

            }

        }

        if (r_parent.nodeName.toLowerCase() !== '#document') {

            _(window).unbind('.jts_liquid_box_events_' + boxID);
            _(container).unbind('.jts_liquid_box_events_' + boxID);
            _(container).off(jTS.built_in_events.jLIQUID_BOX_RESIZE);

            /*WARNING this is hardcoded WARNING*/
            delete jTS.flow.listeners[mousedown + '-jts_liquid_box_events_' + boxID]

            if (liquidHandlesArray.length > 0) {

                _(liquidHandlesArray).unbind('.jts_liquid_box_liquid_handle_' + boxID);

            }

        }

    }

    function liquid() {

        _(container).addClass('jts_liquid_box_' + boxID).css('overflow', 'hidden');
        _(slidingBox).addClass('jts_liquid_box_slider_' + boxID).css(slidingBoxCSS);
        _(scrollMarker).addClass('jts_liquid_box_marker' + boxID).css(scrollMarkerCss);
        _(slidingBox).append(_(container).html());
        _(container).html('').append(slidingBox);
        _(container).append(scrollMarker);

        _(container).addClassRecursive('jts_liquid_box_no_scroll_' + boxID);
        _(slidingBox).addClassRecursive('jts_liquid_box_touch_scroll_' + boxID);

        previousContainerWidth =   _(container).outerWidth();
        previousContainerHeight =  _(container).outerHeight();
        previousParentWidth =      _(container).offsetPs().outerWidth();
        previousParentHeight =     _(container).offsetPs().outerHeight();
        previousSlidingBoxHeight = _(slidingBox).outerHeight();

        setSize();
        setListeners();

        if (isLiquid) {

            addLiquidFunctions();

        }

    }

    function scrollWithMarker(vY) {

        let y = scrollMarker.offsetTop;
        let markerHeight = _(scrollMarker).outerHeight();
        let containerHeight = _(container).outerHeight();

        y += vY;
        if (y < 0) {

            y = 0;

        }
        else if (y > containerHeight - markerHeight) {

            y = containerHeight - markerHeight;

        }

        _(scrollMarker).css('top', y);
        setBoxY(containerHeight, y);

    }

    function scrollWithTouch(vY) {

        let y = slidingBox.offsetTop;
        let containerHeight = _(container).outerHeight();
        let sliderHeight = _(slidingBox).outerHeight();

        y += vY;
        if (y > 0 || sliderHeight < containerHeight) {

            y = 0;

        }
        else if (y < containerHeight - sliderHeight) {

            y = containerHeight - sliderHeight;

        }

        currentY = y;

        _(slidingBox).css('top', y);
        setMarkerY(containerHeight, sliderHeight, Math.abs(y));

    }

    function setBoxY(containerHeight, y) {

        let sliderHeight = _(slidingBox).outerHeight();

        y = y * (sliderHeight / containerHeight);

        currentY = -y;

        _(slidingBox).css('top', -y);

    }

    function setListeners() {

        _(window).bind('resize.' + 'jts_liquid_box_events_' + boxID,
            function (e) {

                if (!getRootN()) {

                    return;

                }

                setSize(e);

            });

        _(window).bind('click.jts_liquid_box_events_' + boxID,
            function () {

                if (!getRootN()) {

                    return;

                }

            });

        _(container).on(jTS.built_in_events.jLIQUID_BOX_RESIZE,setSize);


        _(container).bind(mouseover + '.jts_liquid_box_events_' + boxID,
            function (e) {

                onNoScroll = true;

            }).bind(mouseout + '.jts_liquid_box_events_' + boxID,
            function (e) {

                if (!_(e.relatedTarget) || !_(e.relatedTarget).hasClass('jts_liquid_box_no_scroll_' + boxID)) {

                    onNoScroll = false;

                }

            });

        _(window).bind('mousewheel DOMMouseScroll MozMousePixelScroll.' + 'jts_liquid_box_events_' + boxID,
            function (e) {

                if (onNoScroll) {

                    e.preventDefault();
                    desktopScroll(e);

                }

            });

        _(scrollMarker).bind(mousedown + '.jts_liquid_box_events_' + boxID,
            function (e) {

                e.preventDefault();

                let currentY;
                let previousY;
                let vY;

                previousY = onMobile ? e.originalEvent.touches[0].clientY : e.originalEvent.clientY;

                _(window).bind(mousemove + '.jts_liquid_box_events_' + boxID,
                    function (e) {

                        currentY = onMobile ? e.originalEvent.touches[0].clientY : e.originalEvent.clientY;
                        vY = currentY - previousY;
                        previousY = currentY;

                        scrollWithMarker(vY);

                    }).bind(mouseup + '.jts_liquid_box_events_' + boxID,
                    function (e) {

                        _(window).unbind(mousemove + '.jts_liquid_box_events_' + boxID);
                        _(window).unbind(mouseup + '.jts_liquid_box_events_' + boxID);

                    });

            });

        //IF ON MOBILE
        if (onMobile) {

            let MIN_VY = 5;

            _('.' + 'jts_liquid_box_touch_scroll_' + boxID).bind(mousedown + '.jts_liquid_box_events_' + boxID,
                function (e) {

                    let currentY;
                    let previousY;
                    let vY;
                    let dVY = 0;//this for keep vY value for slow down scroll when touch end;

                    previousY = e.originalEvent.touches[0].clientY;
                    currentY = previousY;

                    _(window).bind(mousemove + '.jts_liquid_box_events_' + boxID,
                        function (e) {

                            e.preventDefault();

                            currentY = e.originalEvent.touches[0].clientY;
                            vY = currentY - previousY;
                            previousY = currentY;

                            dVY = vY === 0 ? dVY : vY;

                            scrollWithTouch(vY);

                        }).bind(mouseup + '.jts_liquid_box_events_' + boxID,
                        function (e) {

                            _(window).unbind(mousemove + '.jts_liquid_box_events_' + boxID);
                            _(window).unbind(mouseup + '.jts_liquid_box_events_' + boxID);

                            if (Math.abs(dVY) > MIN_VY) {

                                slowSlideFromTouch(dVY);

                            }

                        });

                });

        }

    }

    function setMarkerHeight() {

        let containerHeight = _(container).outerHeight();
        let sliderHeight = _(slidingBox).outerHeight();

        let height = Math.round(containerHeight * (containerHeight / sliderHeight));
        let display = 'block';

        if (sliderHeight < containerHeight) {

            display = 'none';

        }

        let css = {

            'height': height,
            'display': display

        };

        _(scrollMarker).css(css);

    }

    function setMarkerY(containerHeight, sliderHeight, y) {

        y = y * (containerHeight / sliderHeight);

        _(scrollMarker).css('top', y);

    }

    function setSize(e) {

        setMarkerHeight();

        if (size) {

            setSliderYFromResize(e);

        }

        if (!size) {

            size = true;

        }

    }

    function slowSlideFromTouch(vY) {

        //let FRICTION = 0.92;
        let startVY = vY;

        inSliding = true;

        jTS.jAnimate(1000,slowSlide,{

            timing_function : 'linear',
            reverse : true

        });

        //slowSlide();

        function slowSlide(progress) {

            if (Math.abs(vY) > 0.2) {

                vY = startVY * progress;

                scrollWithTouch(vY);

                //vY *= FRICTION;
                //setTimeout(slowSlide,16);

            }
            else {

                vY = 0;
                inSliding = false;

            }

        }

    }

    function setSliderYFromResize(e) {

        let containerWidth =  _(container).outerWidth();
        let containerHeight = _(container).outerHeight();
        let containerParentWidth = _(container).offsetPs().outerWidth();
        let containerParentHeight = _(container).offsetPs().outerHeight();
        let sliderHeight = _(slidingBox).outerHeight();

        let boxY = currentY * (sliderHeight / previousSlidingBoxHeight);

        if (sliderHeight < containerHeight) {

            boxY = 0;

        }
        if (boxY > 0) {

            boxY = 0;

        }
        else if (!(sliderHeight < containerHeight) && boxY < containerHeight - sliderHeight) {

            boxY = containerHeight - sliderHeight;

        }

        if (alreadyLiquid && e.type !== jTS.built_in_events.jLIQUID_BOX_RESIZE) {

            let x = previousContainerX * (containerParentWidth / previousParentWidth);
            let y = previousContainerY * (containerParentHeight / previousParentHeight);

            let posCss = {

                'left': x,
                'top': y

            };

            previousContainerX = x;
            previousContainerY = y;

            _(container).css(posCss);

        }

        previousSlidingBoxHeight = sliderHeight;
        previousContainerWidth = containerWidth;
        previousContainerHeight = containerHeight;
        previousParentWidth = containerParentWidth;
        previousParentHeight = containerParentHeight;
        currentY = boxY;

        setMarkerY(containerHeight, sliderHeight, -boxY);
        _(slidingBox).css('top', boxY);

    }

    return this;

};

/**
 *
 * @param configuration {Object}
 * @return {void}
 */
jTS.fn.shell = /*void*/function (/*Object literal*/configuration) {

    const t = this;

    if(t.length === 0){

        return null;

    }

    let HANDLE_SIZE = 10;
    let OL_LEFT_GAP = 45;
    let V_GAP = 10;
    let SCROLL_X_EASING = 0.3;
    let SCROLL_Y_EASING = 18;

    let color =           configuration && configuration.color ? configuration.color : '#5acc06';
    let bColor =          configuration && configuration.background_color ? configuration.background_color : '#101010';
    let runColor =        configuration && configuration.run_color ? configuration.run_color : '#2b2b2b';
    let filterFunction =  configuration && configuration.filter_function ? configuration.filter_function : function (par) { return par; };
    let shellID =         new Date().getTime() + "_" + Math.round(Math.random() * 1000) ;

    let tShell =           t[0];
    let shellWidth =       _(tShell).outerWidth();
    let shellHeight =      _(tShell).outerHeight();
    let olPreviousX =      0;
    let olPreviousY =      0;
    let rightBound =       shellWidth;
    let xHandleReset =     false;
    let yHandleReset =     false;

    let focused =     true;
    let currentLi =   null;
    let currentVal =  [''];
    let grid =        [[]];


    let colIndex =    -1;
    let rowIndex =     0;

    _(tShell).css({

        'background-color' : bColor,
        'overflow'         : 'hidden',
        'position'         : _(tShell).css('position') === 'static' || _(tShell).css('position') === 'relative' ? 'relative' : 'absolute'

    }).addClass('jts_shell_element');

    let ol =      document.createElement('div');
    let li =      document.createElement('div');
    let blink =   document.createElement('div');
    let gap =     document.createElement('div');
    let run =     document.createElement('div');
    let vHandle = document.createElement('div');
    let oHandle = document.createElement('div');

    let style = "<style id='jts_shell_style_" + shellID +"'  type='text/css'>" +
        "#jts_shell_ol_" + shellID + "{list-style:none;border:none;counter-reset:jts_shell_number;position:absolute;padding-top:10px;width:auto;}" +
        "#jts_shell_ol_" + shellID + " div.li{counter-increment:jts_shell_number;font-size:15px;font-family:Verdana;position:relative;border-left:solid 1px " + color + ";padding-left:5px;left:45px;}" +
        "#jts_shell_ol_" + shellID + " div.li::before{display:block;content:counter(jts_shell_number);color:" + color + ";width:39px;text-align:right;left:-45px;position:absolute;}" +
        "#jts_shell_ol_" + shellID + " div.li span.fake{color:transparent;display:inline;position:relative;}" +
        "#jts_shell_ol_" + shellID + " div.li div{position:relative;height:18px;width:auto;color:" + color + ";display:inline;}" +
        "#jts_shell_blink_" + shellID + "{border-left:1px solid " + color + ";animation-duration:0.5s;animation-direction:alternate;animation-iteration-count:infinite;animation-timing-function:linear;animation-name:jts_blink;}" +
        "#jts_shell_run_" + shellID + "{position:absolute;width:50px;height:50px;border-radius:2px;background-color:" + runColor + ";color:" + color + ";cursor:pointer;font-size:23px;text-align:center;border:solid 2px " + color + ";padding-top:10px;z-index:2;}" +
        "@keyframes jts_blink{0%{opacity:1;}50%{opacity:1;}51%{opacity:0;}100%{opacity:0;}}" +
        "</style>";

    _(ol).attr('id', 'jts_shell_ol_' + shellID).addClass('jts_shell_element');
    _(li).addClass('jts_shell_element li');
    _(blink).attr('id', 'jts_shell_blink_' + shellID).addClass('jts_shell_element');
    _(gap).attr('id', 'jts_shell_gap_' + shellID).addClass('jts_shell_element').html('gap');
    _(run).attr('id', 'jts_shell_run_' + shellID).addClass('jts_shell_element ts-font-helvetica').html('run');
    _(vHandle).attr('id', 'jts_vh_' + shellID).addClass('jts_shell_element').css({ 'height': 0, 'width': HANDLE_SIZE, 'top': 0,'left':shellWidth - HANDLE_SIZE});
    _(oHandle).attr('id', 'jts_oh_' + shellID).addClass('jts_shell_element').css({ 'height': HANDLE_SIZE, 'width': 0, 'left': 0 ,'top':shellHeight - HANDLE_SIZE});


    _([vHandle, oHandle]).css({

        'position'         : 'absolute',
        'background-color' : color,
        'border-radius'    : 2,
        'z-index'          : 3,
        'cursor'           : 'pointer',
        'display'          : 'none',
        'opacity'          : 0.5,
        'box-shadow'       : '0px 0px 3px 3px rgba(255,255,255,0.5)'

    });

    _(blink).css({

        'z-index'  : 10,
        'width'    : 'auto',
        'height'   : 20

    });

    _(gap).css({

        'width'    : 35,
        'opacity'  : 0,
        'position' : 'relative'

    });

    _(run).css({

        'top' : shellHeight - 50,
        'left': shellWidth - 50

    });

    _('head').append(style);

    _(ol).append(li);
    _(blink).append(gap);
    _(li).append(blink);
    _(tShell).append(ol);
    _(tShell).append([run,vHandle,oHandle]);

    currentLi = li;

    setListeners();

    function executeCode() {

        let val = '';

        for (let i = 0; i < currentVal.length; i++) {

            val += currentVal[i] + (i === currentVal.length - 1 ? '' : '\n');

        }

        try {

            eval(filterFunction(String(val)));

        }
        catch (e) {

            console.log('code-error @jTSShell');

        }


    }

    function getRootN() {

        let e_parent = tShell;
        let r_parent = e_parent;

        while (e_parent) {

            e_parent = _(e_parent).offsetPs()[0];

            if (e_parent) {

                r_parent = e_parent;

            }

        }

        if (r_parent.nodeName.toLowerCase() !== '#document') {

            _(window).unbind('.jts_shell_events_' + shellID);
            _(tShell).unbind('.jts_shell_events_' + shellID);
            _(tShell).off(jTS.built_in_events.jSHELL_RESIZE);
            _(oHandle).unbind('mousedown');
            _(vHandle).unbind('mousedown');
            _(run).unbind('click');

            /*WARNING this is hardcoded WARNING*/
            delete jTS.flow.listeners['mousemove-jts_shell_events_' + shellID];

            return false;

        }
        else {

            return true;

        }

    }

    function insertText(e) {

        e.preventDefault();

        let posCode = getPosCode();

        switch (e.keyCode) {

            case 8:
                back(posCode);
                break;
            case 13:
                enter(posCode);
                break;
            case 35:
                gotoEndLine();
                break;
            case 36:
                gotoStartLine();
                break;
            case 37:
                left(posCode);
                break;
            case 38:
                up(posCode);
                break;
            case 39:
                right(posCode);
                break;
            case 40:
                down(posCode);
                break;
            default:
                insert();
                break;

        }

        function getPosCode() {

            let nodes =  currentLi.children;
            let code =   null;

            if (colIndex === -1 && nodes.length === 1) {

                code = 1;

            }
            else if (colIndex === -1 && nodes.length > 1) {

                code = 2;

            }
            else if (colIndex !== -1 && nodes[nodes.length - 1] !== blink) {

                code = 3;

            }
            else if (colIndex !== -1 && nodes[nodes.length - 1] === blink) {

                code = 4;

            }

            return code;

        }

        function back(code) {

            switch (code) {

                case 1:
                    backUp();
                    break;
                case 2:
                    backUnite();
                    break;
                case 3:
                case 4:
                    disposeOne();
                    break;

            }

        }

        function enter(code) {

            switch (code) {

                case 2:
                    addLiUp();
                    break;
                case 3:
                    splitLi();
                    break;
                case 1:
                case 4:
                    addLiDown();
                    break;

            }

            _(ol).css('left', 0);

        }

        function left(code) {

            switch (code) {

                case 1:
                case 2:
                    moveUp();
                    break;
                case 3:
                case 4:
                    moveLeft();
                    break;

            }

        }

        function up(code) {

            moveUp();

        }

        function right(code) {

            switch (code) {

                case 2:
                case 3:
                    moveRight();
                    break;
                case 1:
                case 4:
                    moveDown();
                    break;


            }

        }

        function down(code) {

            moveDown();

        }

        function insert() {

            if (e.originalEvent.key.length > 1) {

                return;

            }

            if (xHandleReset) {

                resetXHandle();

            }

            if (yHandleReset) {

                resetYHandle();

            }

            _(blink).css('position', 'absolute');

            let canvas =   document.createElement('div');
            let opacity =  e.keyCode === 32 ? 0 : 1;

            canvas.innerHTML = e.keyCode === 32 ? 'ff' : e.originalEvent.key;

            _(canvas).addClass('jts_shell_element').css('opacity', opacity);
            _(currentLi).before(canvas, blink);

            colIndex +=    1;

            grid[rowIndex].splice(colIndex,0,canvas);

            currentVal[rowIndex] = jTS.jStringSplice(currentVal[rowIndex],colIndex,e.originalEvent.key);

            scrollRight();
            setHandleX();

        }//OK

        //sub functions
        function backUp() {

            if (yHandleReset) {

                resetYHandle();

            }

            if (rowIndex === 0) {

                return;

            }

            rowIndex -= 1;
            currentLi = document.querySelector('#jts_shell_ol_' + shellID).children[rowIndex];

            _(currentLi.children[currentLi.children.length - 1]).dispose();
            _(currentLi).append(blink);

            colIndex = grid[rowIndex].length - 1;

            _(document.querySelector('#jts_shell_ol_' + shellID).children[rowIndex + 1]).dispose();
            grid.splice(rowIndex + 1, 1);
            currentVal.splice(rowIndex + 1, 1);

            let pos = grid[rowIndex].length === 0 ? 'relative' : 'absolute';

            _(blink).css('position', pos);

            setOl();
            scrollUp();
            setHandleX();
            setHandleY();

        }//OK

        function backUnite(){

            if (yHandleReset) {

                resetYHandle();

            }

            if (rowIndex === 0) {

                return;

            }

            rowIndex -=       1;
            colIndex =        grid[rowIndex].length - 1;
            grid[rowIndex] =  grid[rowIndex].concat(grid[rowIndex + 1]);
            currentLi =       document.querySelector('#jts_shell_ol_' + shellID).children[rowIndex];

            _(currentLi.children[currentLi.children.length - 1]).dispose();
            _(currentLi).append(blink);
            _(currentLi).append(grid[rowIndex + 1], blink);
            grid.splice(rowIndex + 1, 1);
            _(document.querySelector('#jts_shell_ol_' + shellID).children[rowIndex + 1]).dispose();

            currentVal[rowIndex] = currentVal[rowIndex] + currentVal[rowIndex + 1];

            currentVal.splice(rowIndex + 1, 1);

            setOl();
            scrollUp();
            setHandleX();
            setHandleY();

        }//OK

        function disposeOne() {

            if (xHandleReset) {

                resetXHandle();

            }

            if (yHandleReset) {

                resetYHandle();

            }

            _(grid[rowIndex][colIndex]).dispose();
            grid[rowIndex].splice(colIndex,1);

            currentVal[rowIndex] =  jTS.jStringSplice(currentVal[rowIndex],colIndex, 1);
            colIndex -=             1;

            let pos = colIndex === -1 && grid[rowIndex].length === 0 ? 'relative' : 'absolute';

            _(blink).css('position', pos);

            scrollLeft();
            setHandleX();

        }//OK

        function addLiDown() {

            if (yHandleReset) {

                resetYHandle();

            }

            let span =  "<span class='fake jts_shell_element'>fake</fake>";
            let nLi =   document.createElement('div');

            _(currentLi).append(span);
            _(ol).append(nLi, currentLi);

            currentLi =    nLi;
            rowIndex +=    1;
            colIndex =    -1;

            _(currentLi).append(blink).addClass('jts_shell_element li');
            grid.splice(rowIndex, 0, []);
            currentVal.splice(rowIndex, 0, '');

            _(blink).css('position', 'relative');

            resetOl();
            scrollDown();
            setHandleX();
            setHandleY();

        }//OK

        function addLiUp() {

            if (yHandleReset) {

                resetYHandle();

            }

            let span = "<span class='fake jts_shell_element'>fake</fake>";
            let nLi =  document.createElement('div');

            _(currentLi).append(span);
            _(ol).before(nLi, currentLi);

            currentLi = nLi;
            colIndex =  -1;

            _(currentLi).append(blink).addClass('jts_shell_element li');
            grid.splice(rowIndex, 0, []);
            currentVal.splice(rowIndex, 0, '');

            _(blink).css('position', 'relative')

            resetOl();
            scrollUp();
            setHandleX();
            setHandleY();

        }//OK

        function splitLi() {

            if (yHandleReset) {

                resetYHandle();

            }

            let span =          "<span class='fake jts_shell_element'>fake</fake>";
            let nLi =           document.createElement('div');
            let rightContent =  [];
            let leftContent =   [];

            for (let i = 0; i <= colIndex; i++){

                rightContent.push(grid[rowIndex][i]);

            }

            for (let l = colIndex + 1 ; l < grid[rowIndex].length ; l++) {

                leftContent.push(grid[rowIndex][l]);

            }

            _(currentLi).html('');
            _(currentLi).append(rightContent).append(span);
            _(nLi).append(leftContent);

            _(ol).append(nLi, currentLi);

            currentLi = nLi;

            _(currentLi).before(blink).addClass('jts_shell_element li');

            grid[rowIndex] = rightContent;

            grid.splice(rowIndex + 1, 0, leftContent);

            let rightVal = currentVal[rowIndex].substr(0,colIndex + 1);
            let leftVal =  currentVal[rowIndex].substr(colIndex + 1);

            currentVal[rowIndex] = rightVal;

            currentVal.splice(rowIndex + 1, 0, leftVal);

            colIndex =   -1;
            rowIndex += 1;

            resetOl();
            scrollDown();
            setHandleX();
            setHandleY();

        }//OK

        function moveUp() {

            if (yHandleReset) {

                resetYHandle();

            }

            if (rowIndex === 0) {

                return;

            }

            let span = "<span class='fake jts_shell_element'>fake</fake>";

            _(currentLi).append(span);

            rowIndex -= 1;
            currentLi = document.querySelector('#jts_shell_ol_' + shellID).children[rowIndex];

            _(currentLi.children[currentLi.children.length - 1]).dispose();

            colIndex = grid[rowIndex].length - 1;

            _(currentLi).append(blink);

            let pos = grid[rowIndex].length === 0 ? 'relative' : 'absolute';

            _(blink).css('position', pos);

            setOl();
            scrollUp();
            setHandleX();
            setHandleY();

        }//OK

        function moveLeft() {

            if (xHandleReset) {

                resetXHandle();

            }

            if (yHandleReset) {

                resetYHandle();

            }

            _(currentLi).before(blink, grid[rowIndex][colIndex]);

            colIndex -= 1;

            scrollLeft();
            setHandleX();

        }//OK

        function moveDown() {

            if (yHandleReset) {

                resetYHandle();

            }

            if(rowIndex + 1 === grid.length){

                return;

            }

            let span = "<span class='fake jts_shell_element'>fake</fake>";

            _(currentLi).append(span);

            rowIndex += 1;
            currentLi = document.querySelector('#jts_shell_ol_' + shellID).children[rowIndex];

            _(currentLi.children[currentLi.children.length - 1]).dispose();

            colIndex = - 1;

            _(currentLi).before(blink);

            let pos = grid[rowIndex].length === 0 ? 'relative' : 'absolute';

            _(blink).css('position', pos);

            resetOl();
            scrollDown();
            setHandleX();
            setHandleY();

        }//OK

        function moveRight() {

            if (xHandleReset) {

                resetXHandle();

            }

            if (yHandleReset) {

                resetYHandle();

            }

            _(currentLi).append(blink, grid[rowIndex][colIndex + 1]);

            colIndex += 1;

            scrollRight();
            setHandleX();

        }//OK

        function gotoEndLine(){

            if (yHandleReset) {

                resetYHandle();

            }

            _(currentLi).append(blink);

            colIndex = grid[rowIndex].length - 1;

            setOl();
            setHandleX();

        }//OK

        function gotoStartLine() {

            if (yHandleReset) {

                resetYHandle();

            }

            _(currentLi).before(blink);

            colIndex = -1;

            resetOl();
            setHandleX();

        }//OK

    }

    function moveHandleX(vX) {

        let width = _(oHandle).outerWidth();
        let x =     _(oHandle).localCoordinates().left;

        x += vX;

        if (x < 0) {

            x = 0

        }
        else if(x + width > shellWidth){

            x = shellWidth - width;

        }

        _(oHandle).css('left',x);

        setOlPositionX(x);

    }

    function moveHandleY(vY) {

        let height = _(vHandle).outerHeight();
        let y = _(vHandle).localCoordinates().top;

        y += vY;

        if (y < 0) {

            y = 0

        }
        else if (y + height > shellHeight) {

            y = shellHeight - height;

        }

        _(vHandle).css('top', y);

        setOlPositionY(y);

    }

    function resizeDealerZ(){

        shellWidth =  _(tShell).outerWidth();
        shellHeight = _(tShell).outerHeight();

        _(run).css({

            'top': shellHeight - 50,
            'left': shellWidth - 50,

        });

        _(oHandle).css('top', shellHeight - HANDLE_SIZE);
        _(vHandle).css('left', shellWidth - HANDLE_SIZE);

        _(ol).css({

            'left': 0,
            'top' : 0

        });

        rightBound = shellWidth;

        setHandleX();
        setHandleY();

        xHandleReset = true;
        yHandleReset = true;

    }

    function resetOl() {

        rightBound = shellWidth;

        _(ol).css('left', 0);

    }

    function resetXHandle() {

        xHandleReset = false;

        setOl();

    }

    function resetYHandle() {

        yHandleReset = false;

        let liOffset  =  _(currentLi).localCoordinates().top;
        let targetPos =  V_GAP;
        let olHeight =   _(ol).outerHeight();

        let olOffset = -(liOffset - targetPos);

        if (olOffset + olHeight + V_GAP < shellHeight) {

            olOffset = -((olHeight - shellHeight) + V_GAP);

        }

        if (olOffset > 0) {

            olOffset = 0;

        }

        _(ol).css('top', olOffset);

        setHandleY();

    }

    function scrollDown() {

        let liPos =    _(currentLi).localCoordinates().top;
        let olOffset = _(ol).localCoordinates().top;

        if ((liPos + SCROLL_Y_EASING) - Math.abs(olOffset) > shellHeight) {

            olOffset =  -(liPos - (shellHeight - V_GAP - SCROLL_Y_EASING));

            _(ol).css('top', olOffset);

        }

    }

    function scrollLeft() {

        let blinkPos = _(blink).localCoordinates().left;
        let olLeft =   _(ol).localCoordinates().left;
        let olWidth =  _(ol).outerWidth();

        if (blinkPos - Math.abs(olLeft + OL_LEFT_GAP) < OL_LEFT_GAP) {

            let gap = shellWidth * SCROLL_X_EASING;

            olLeft += gap;
            rightBound -= gap;

            _(ol).css('left', olLeft);

            if (olLeft > 0) {

                resetOl();

            }

        }

        if (olWidth + OL_LEFT_GAP  < shellWidth) {

            resetOl();

        }

    }

    function scrollRight() {


        let blinkPos = _(blink).localCoordinates().left;

        if (blinkPos + OL_LEFT_GAP > rightBound) {

            let gap    = shellWidth * SCROLL_X_EASING;
            let olLeft = _(ol).localCoordinates().left - gap;

            rightBound += gap;

            _(ol).css('left', olLeft);

        }

    }

    function scrollUp() {

        let liPos =    _(currentLi).localCoordinates().top;
        let olOffset = _(ol).localCoordinates().top;
        let olHeight = _(ol).outerHeight();

        if ( liPos - Math.abs(olOffset) <= 0) {

            olOffset = -(liPos - V_GAP);

            _(ol).css('top', olOffset);

        }

        if (olOffset + olHeight + V_GAP < shellHeight) {

            olOffset = -(olHeight - (shellHeight - V_GAP));

            if (olOffset > 0) {

                olOffset = 0;

            }

            _(ol).css('top', olOffset);

        }

    }

    function setHandleX() {

        let olWidth =  _(ol).outerWidth() + OL_LEFT_GAP;
        let olOffset = _(ol).localCoordinates().left;

        if (olWidth > shellWidth) {

            let totalWidth =  olWidth + (shellWidth * SCROLL_X_EASING);
            let handleWidth = shellWidth * (shellWidth / totalWidth);
            let handlePos =   Math.abs(olOffset) * (shellWidth / totalWidth);

            _(oHandle).css({

                'display' : 'block',
                'left'    : handlePos,
                'width'   : handleWidth

            });

        }
        else {

            _(oHandle).css('display', 'none');

        }

    }

    function setHandleY() {

        let olHeight = _(ol).outerHeight() + V_GAP;

        if (olHeight > shellHeight) {

            let olOffset =      Math.abs(_(ol).localCoordinates().top);
            let handleHeight =  shellHeight * (shellHeight / olHeight);
            let handlePos =     olOffset * (shellHeight / olHeight);

            _(vHandle).css({

                'display' : 'block',
                'top'     : handlePos,
                'height'  : handleHeight

            });

        }
        else {

            _(vHandle).css('display', 'none');

        }

    }

    function setListeners() {

        _(window).bind('keydown.jts_shell_events_' + shellID, insertText);

        _(tShell).bind('click.jts_shell_events_' + shellID, function (e) {

            if (!focused) {

                focused = true;

                _(window).bind('keydown.jts_shell_events_' + shellID, insertText);

            }

            _(blink).css({'visibility':'visible'});

        });

        _(window).bind('click.jts_shell_events_' + shellID, function (e) {

            if (!getRootN()) {

                return;

            }

            if (!_(e.target).hasClass('jts_shell_element')) {

                focused = false;

                _(blink).css({ 'visibility': 'hidden'});
                _(window).unbind('keydown.jts_shell_events_' + shellID);

            }

        });

        _(window).bind('resize.jts_shell_events_' + shellID, function () {

            if (!getRootN()) {

                return;

            }

            resizeDealerZ();

        });

        _('.jts_shell_element').bind('mousemove.jts_shell_events_' + shellID, function (e) {

            e.preventDefault();

        });

        _(oHandle).bind('mousedown.jts_shell_events_' + shellID, function (e) {

            let vX, cX, pX;

            pX = jTS.jMobile() ? e.originalEvent.touches[0].clientX : e.screenX;

            _(window).bind('mousemove.jts_shell_ohandle',
                function (e) {

                    e.preventDefault();

                    cX = jTS.jMobile() ? e.originalEvent.touches[0].clientX : e.screenX;
                    vX = cX - pX;
                    pX = cX;
                    xHandleReset = true;

                    moveHandleX(vX);

                });

            _(window).bind('mouseup.jts_shell_ohandle',
                function (e) {

                    _(window).unbind('.jts_shell_ohandle');

                });

        });

        _(vHandle).bind('mousedown.jts_shell_events_' + shellID, function (e) {

            let vY, cY, pY;

            pY = jTS.jMobile() ? e.originalEvent.touches[0].clientY : e.screenY;

            _(window).bind('mousemove.jts_shell_vhandle',
                function (e) {

                    e.preventDefault();

                    cY = jTS.jMobile() ? e.originalEvent.touches[0].clientY : e.screenY;
                    vY = cY - pY;
                    pY = cY;
                    yHandleReset = true;

                    moveHandleY(vY);

                });

            _(window).bind('mouseup.jts_shell_vhandle',
                function (e) {

                    _(window).unbind('.jts_shell_vhandle');

                });

        });

        _(run).bind('click', function () {

            executeCode();

        });

        _(tShell).on(jTS.built_in_events.jSHELL_RESIZE, function () {

            resizeDealerZ();

        });

    }

    function setOl() {

        let blinkPos  = _(blink).localCoordinates().left + OL_LEFT_GAP;

        if (blinkPos <= shellWidth) {

            resetOl();

        }
        else {

            rightBound = blinkPos + (shellWidth * SCROLL_X_EASING);

            let olOffset = blinkPos - (shellWidth * (1 - SCROLL_X_EASING));
            _(ol).css('left', -olOffset);

        }


    }

    function setOlPositionX(x) {

        let totalWidth = _(ol).outerWidth() + OL_LEFT_GAP + (shellWidth * SCROLL_X_EASING);
        let olOffset =   x * (totalWidth /shellWidth);

        _(ol).css('left', -olOffset);

        olPreviousX = -olOffset;

    }

    function setOlPositionY(y) {

        let olHeight = _(ol).outerHeight() + V_GAP;
        let olOffset = y * (olHeight / shellHeight);

        _(ol).css('top', -olOffset);

        olPreviousY = -olOffset;

    }

};

/**
 *
 * @param configuration {Object}
 * @return {jTS}
 */
jTS.fn.worldMap =/*jTS*/ function(/*Object literal*/configuration){

    class ViewingTransformer {
        /**
         * Initialize the transformer.
         * @param {int} maxScale - Maximum map scale
         * @param {int} minScale - Minimum map scale
         * @param {Element} svg - An svg element from which matrices can be created.
         */
        constructor(minScale , maxScale , svg) {

            this.minimumScale = minScale || 1;
            this.maximumScale = maxScale || 20;
            this.lowerScale = Math.floor(this.minimumScale * 100) / 100;
            this.svg = svg || document.createElementNS('http://www.w3.org/2000/svg', 'svg');

            // This is the viewing transformation matrix, which starts at identity.
            this.vtm = this.createSVGMatrix();

        }

        /**
         * Helper method to create a new SVGMatrix instance.
         */
        createSVGMatrix() {

            return this.svg.createSVGMatrix();

        }

        /**
         * Scale the vtm.
         * @param {Number} scaleX - The amount to scale in the x direction.
         * @param {Number} scaleY - The amount to scale in the y direction.
         * @param {Object} origin - The origin point at which the scale should be centered.
         */
        scale(scaleX, scaleY , origin) {

            let possibleVtm = this.createSVGMatrix().translate(origin.x, origin.y).scale(scaleX, scaleY).translate(-origin.x, -origin.y).multiply(this.vtm);

            if(possibleVtm.a < this.minimumScale || possibleVtm.d < this.minimumScale){

                origin.x = 0;
                origin.y = 0;
                scaleX = this.minimumScale;
                scaleY = this.minimumScale;

                this.vtm = this.createSVGMatrix();

            }else if(possibleVtm.a > this.maximumScale || possibleVtm.d > this.maximumScale){

                return this.vtm;

            }
            // Order is important -- read this from the bottom to the top.
            // 1) Post multiply onto the current matrix.
            // 2) Translate such that the origin is at (0, 0).
            // 3) Scale by the provided factors at the origin.
            // 4) Put the origin back where it was.
            this.vtm = this.createSVGMatrix()
                .translate(origin.x, origin.y)
                .scale(scaleX, scaleY)
                .translate(-origin.x, -origin.y)
                .multiply(this.vtm);

            return this.vtm;

        }

        setZoomAndPosition(scaleX, scaleY , origin,translate){

            this.vtm = this.createSVGMatrix()
                .translate(origin.x, origin.y)
                .scale(scaleX, scaleY)
                .translate(-translate.x, -translate.y)
                .multiply(this.vtm);

            return this.vtm;

        }

        translateSvg(vX,vY,boundaries){

            let oldScaleX = this.vtm.a;
            let oldScaleY = this.vtm.d;

            if(Math.floor(oldScaleX * 100) / 100 === this.lowerScale || Math.floor(oldScaleY * 100) / 100 === this.lowerScale){

                return this.vtm;

            }

            this.vtm = this.createSVGMatrix()
                .translate(this.vtm.e + vX, this.vtm.f + vY);

            this.vtm.a = oldScaleX;
            this.vtm.d = oldScaleY;

            if(this.vtm.e > 0){

                this.vtm.e = 0;

            }

            if(this.vtm.e + boundaries.x < boundaries.xe){

                this.vtm.e = boundaries.xe - boundaries.x;

            }

            if(this.vtm.f > 0){

                this.vtm.f = 0;

            }

            if(this.vtm.f + boundaries.y < boundaries.ye){

                this.vtm.f = boundaries.ye - boundaries.y;

            }

            return this.vtm;

        }

    }

    let t = this;
    let resizeID = null;
    let mousedown = jTS.jMobile() ? 'touchstart' : 'mousedown';
    let mouseup = jTS.jMobile() ? 'touchend' : 'mouseup';
    let mousemove = jTS.jMobile() ? 'touchmove' : 'mousemove';
    let overMap = false;
    let zoomPosAndOrigin = [];

    addStyle();

    t.load(configuration.map_url,function(content,index,element){

        activateMap(index,element);

    });

    function activateMap(index,element){

        addLabel();
        activate();

        function activate(){

            if(!_(element).attr('id')){

                _(element).attr('id','jts_world_map_' + configuration.ID + '_' + i);

            }

            _(element).attr('data-id',`${configuration.ID}-${index}`);

            if(configuration.styleClass){

                _(element).addClass(configuration.styleClass);

            }

            _(element).css({

                overflow : 'hidden'

            });

            zoomPosAndOrigin[index] = {

                zoom : 0,
                x : 0,
                y: 0

            };

            initializeElement(element);

            addListeners();

        }

        function addLabel(){

            let label = _(`<div class="world-map-label ts-font-helvetica" data-id="${configuration.ID}-${index}"></div>`);

            _('body').append(label);

        }

        function addListeners(){

            if(index === 0){

                _(window).bind('resize.world_map_events_' + configuration.ID,function(){

                    clearTimeout(resizeID);

                    resizeID = setTimeout(function () {

                        t.each(function(i,e){

                            disposeElement(e);
                            initializeElement(e);

                        });

                    },1500);

                });

                _(window).on(jTS.built_in_events.jEXTERNAL_RESIZE + '.world_map_events_' + configuration.ID,function(e){

                    resizeID = setTimeout(function () {

                        t.each(function(i,e){

                            disposeElement(e);
                            initializeElement(e);

                        });

                    },1500);

                });

            }

        }

        function disposeElement(e) {

            _('#' + _(e).attr('id') + ' svg path').unbind('.world_map_events');
            _(e).unbind('.world_map_events');
            _('#' + _(e).attr('id') + '_plus').unbind('.world_map_events');
            _('#' + _(e).attr('id') + '_minus').unbind('.world_map_events');
            _('.world-map-controls').dispose();
            _(e).off(jTS.built_in_events.jWORLD_MAP_SET_ZOOM_AND_POSITION);

        }

        function globalToLocal(e,x,y){

            let parent = e;

            while(parent){

                x -= parent.offsetLeft;
                y -= parent.offsetTop;

                parent = parent.offsetParent;

            }

            return {x:x,y:y};

        }

        function initializeElement(element){

            let minimumScale = 1;
            let maximumScale = configuration.maxScale ? configuration.maxScale : 20;
            let transform = false;

            let svg = document.querySelector('#' + _(element).attr('id') + ' svg');
            let g = document.querySelector('#' + _(element).attr('id') + ' svg g');
            let viewingTransformer = null;

            g.transform.baseVal.appendItem(g.transform.baseVal.createSVGTransformFromMatrix(svg.createSVGMatrix()));

            setSize();
            attachListeners();

            function addControls(){

                let controls = '<div class="world-map-controls ' + (configuration.overrideControlsClass ? configuration.overrideControlsClass : '') + (jTS.jMobile() ? ' controls-visible' : '') + '" id="' + _(element).attr('id') + '_controls' + '">' +
                    '<div class="minus ts-grid-fixed" id="' + _(element).attr('id') + '_minus' + '"><i class="fa fa-minus"></i></div>' +
                    '<div class="plus ts-grid-fixed" id="' + _(element).attr('id') + '_plus' + '"><i class="fa fa-plus"></i></div>' +
                    '</div>';

                _(element).append(controls);

            }

            function attachListeners(){

                _('#' + _(element).attr('id') + ' svg path').bind('mouseover.world_map_events',function(e){

                    let name = _(this).attr('data-name');
                    let flag = configuration.flags_url + '/' + _(this).attr('data-flag');
                    let dataID = _(element).attr('data-id');

                    overMap = true;

                    if(configuration.showLabel !== false){

                        _(`.world-map-label[data-id="${dataID}"]`).html('<div class="span ts-grid-fixed">' + name + '</div><div class="img ts-grid-fixed"><img alt="img" src="' + flag + '"></div>');
                        _(`.world-map-label[data-id="${dataID}"]`).css('opacity',1);

                    }

                }).bind('mouseout.world_map_events',function (e) {

                    overMap = false;

                    if(configuration.showLabel !== false){

                        let dataID = _(element).attr('data-id');

                        _(`.world-map-label[data-id="${dataID}"]`).css('opacity',0);

                    }

                });

                _(element).bind('mousewheel DOMMouseScroll MozMousePixelScroll.world_map_events',function(e){

                    e.preventDefault();

                    // The zoom direction (in or out).
                    let dir = e.originalEvent.deltaY < 0 ? 1 : -1;

                    // How much to zoom, maintaining aspect ratio.
                    let scaleX = 1 + .1 * dir;
                    let scaleY = scaleX * svg.height.baseVal.value / svg.width.baseVal.value;

                    let coordinates = globalToLocal(element,e.globalX,e.globalY);
                    // The mouse coordinates.
                    let origin = {

                        x: coordinates.x,
                        y: coordinates.y

                    };

                    // Get the new matrix.
                    let mat = viewingTransformer.scale(scaleX, scaleY, origin);

                    // Set the matrix on the group.
                    g.transform.baseVal.getItem(0).setMatrix(mat);


                });

                _('#' + _(element).attr('id') + '_minus').bind(mousedown + '.world_map_events',function(e){

                    transform = true;
                    transformSvg(0.9);

                }).bind(mouseup + '.world_map_events',function(e){

                    transform = false;

                });

                _('#' + _(element).attr('id') + '_plus').bind(mousedown + '.world_map_events',function(e){

                    transform = true;
                    transformSvg(1.1);

                }).bind(mouseup + '.world_map_events',function(e){

                    transform = false;

                });

                _(element).bind(mousedown + '.world_map_events',function(e){

                    let pointerX = jTS.jMobile() ? e.originalEvent.touches[0].clientX : e.globalX;
                    let pointerY = jTS.jMobile() ? e.originalEvent.touches[0].clientY : e.globalY;
                    let previousX = pointerX;
                    let previousY = pointerY;
                    let vX = 0;
                    let vY = 0;

                    if(!_(e.target).hasClass('minus') && !_(e.target).hasClass('plus')){

                        _(element).addClass('world-draggable');
                        _(window).bind(mousemove + '.world_drag',function (e) {

                            pointerX = jTS.jMobile() ? e.originalEvent.touches[0].clientX : e.globalX;
                            pointerY = jTS.jMobile() ? e.originalEvent.touches[0].clientY : e.globalY;

                            vX = pointerX - previousX;
                            vY = pointerY - previousY;

                            previousX = pointerX;
                            previousY = pointerY;

                            panSvg(vX,vY);

                        }).bind(mouseup + '.world_drag',function (e) {

                            _(element).removeClass('world-draggable');
                            _(window).unbind('.world_drag');

                        });

                    }

                }).bind('mouseover.world_map_events',function (e) {

                    _('#' + _(element).attr('id') + '_controls').attr('active',true);

                }).bind('mouseout.world_map_events',function (e) {

                    _('#' + _(element).attr('id') + '_controls').attr('active',false);

                });

                _(element).bind(mousemove + '.world_map_events_' + + configuration.ID,function(e){

                    if(overMap && configuration.showLabel !== false){

                        let dataID = _(element).attr('data-id');

                        _(`.world-map-label[data-id="${dataID}"]`).css({

                            top : e.screenY,
                            left : e.screenX,

                        });

                    }

                });

                _(element).on(jTS.built_in_events.jWORLD_MAP_SET_ZOOM_AND_POSITION,function(e){

                    if(e.emitter[0] === element){

                        setZoomAndPosition(e.data);

                    }

                });

                _(element).emits(jTS.built_in_events.jWORLD_MAP_LOADED);

            }

            function panSvg(vX,vY) {

                let boundaries = {

                    x : _(g).outerWidth(),
                    y : _(g).outerHeight(),
                    xe : _(element).outerWidth(),
                    ye : _(element).outerHeight()

                };
                let mat = viewingTransformer.translateSvg(vX,vY,boundaries);

                g.transform.baseVal.getItem(0).setMatrix(mat);

            }

            function resetElement(){

                viewingTransformer = new ViewingTransformer(minimumScale,maximumScale);

                let origin = {

                    x: 0,
                    y: 0

                };

                let mat = viewingTransformer.scale(minimumScale,minimumScale, origin);

                g.transform.baseVal.getItem(0).setMatrix(mat);

                if(zoomPosAndOrigin[index].zoom !== 0){

                    setZoomAndPosition(zoomPosAndOrigin[index]);

                }

                addControls();

            }

            function setSize(){

                let WIDTH_REF = 725;
                let HEIGHT_REF = 360;
                let SCALE_REF = 0.8;

                let width = _(element).outerWidth();
                let height = width * (HEIGHT_REF / WIDTH_REF);

                minimumScale = SCALE_REF * (width / WIDTH_REF);

                _('#' + _(element).attr('id') + ' svg').attr({

                    'width' : width,
                    'height' : height,

                });

                resetElement();

            }

            function setZoomAndPosition(data) {

                const WIDTH_REF = 725;
                const HEIGHT_REF = 360;

                let scaleX = data.zoom > maximumScale ? maximumScale : data.zoom;
                let scaleY = scaleX * svg.height.baseVal.value / svg.width.baseVal.value;
                let translateX = (data.x * (svg.width.baseVal.value / WIDTH_REF)) - (svg.width.baseVal.value * 0.5);
                let translateY = (data.y  * (svg.height.baseVal.value / HEIGHT_REF)) - (svg.height.baseVal.value * 0.5);

                let origin = {

                    x : svg.width.baseVal.value * 0.5,
                    y : svg.height.baseVal.value * 0.5

                };

                let translate = {

                    x : translateX + (svg.width.baseVal.value * 0.5),
                    y : translateY + (svg.height.baseVal.value * 0.5)

                };

                viewingTransformer = new ViewingTransformer(minimumScale,maximumScale);

                let resetMat = viewingTransformer.scale(minimumScale,minimumScale,{x : 0 , y : 0});
                g.transform.baseVal.getItem(0).setMatrix(resetMat);

                let mat = viewingTransformer.setZoomAndPosition(scaleX, scaleY,origin,translate);
                g.transform.baseVal.getItem(0).setMatrix(mat);

                zoomPosAndOrigin[index] = data;

            }

            function transformSvg(scale){

                if(transform){


                    let scaleX = scale;
                    let scaleY = scaleX * svg.height.baseVal.value / svg.width.baseVal.value;

                    let origin = {

                        x: svg.width.baseVal.value * 0.5,
                        y: svg.height.baseVal.value * 0.5

                    };

                    let mat = viewingTransformer.scale(scaleX, scaleY, origin);

                    g.transform.baseVal.getItem(0).setMatrix(mat);

                    setTimeout(function(){

                        transformSvg(scale);

                    },16);

                }

            }

        }

    }

    function addStyle(){

        let zIndex = configuration.label_index || 100;
        let backGroundColor = configuration.label_background || '#0d0d0d';
        let color = configuration.label_color || '#f9f9f9';
        let borderRadius = configuration.label_radius || '5px';

        if(_('#world-map-style').length === 0){

            let style = '<style type="text/css" id="world-map-style">' +
                '.world-map-label{position: fixed;z-index: ' + zIndex + ';padding: 5px 20px;height: 50px; white-space: nowrap;background-color: ' + backGroundColor + ';opacity: 0;transition: opacity 0.5s ease-out;pointer-events: none;border-radius: ' + borderRadius + ';transform: translateX(-50%) translateY(-65px);}' +
                '.world-map-label div.span{padding:10px 0 0 0;height:40px;font-size: 15px;font-weight:600;color: ' + color + '}' +
                '.world-map-label div.img{overflow: hidden;width: 40px;height: 40px;margin-left: 10px;border-radius: 50%;position: relative;}' +
                '.world-map-label div.img img{position: absolute;width: 100%;height: 100%;object-fit: cover;}' +
                '.world-map-label:after{content: "";border: solid 15px transparent;border-top-color: #0d0d0d;position: absolute;bottom:-28px;left: calc(50% - 15px)}' +
                '.world-map-controls{position: absolute;z-index: 1;top: 10px; left: 10px;opacity: 0;transition: opacity 0.5s ease-out 1s;width: 70px;height: 30px;}' +
                '.world-map-controls[active]{opacity: 1;}' +
                '.world-map-controls .minus{width: 30px;height: 30px;border-radius: 50%;background-color: rgba(255,255,255,0.5);color:#0d0d0d;text-align: center;font-size: 18px;margin-right: 10px;cursor: pointer;padding: 5px 0 0 0;}' +
                '.world-map-controls .plus{width: 30px;height: 30px;border-radius: 50%;background-color: rgba(255,255,255,0.5);color:#0d0d0d;text-align: center;font-size: 18px;cursor: pointer;padding: 5px 0 0 0;}' +
                '.controls-visible{opacity: 1!important;}' +
                '.world-draggable{cursor: grabbing!important;}' +
                '</style>';

            _('head').append(style);

        }

    }

    return t;

};

/**
 *
 * @param zoomSize {int}
 * @param configuration {Object}
 * @return {jTS}
 */
jTS.fn.zoom = /*jTS*/function (/*int*/zoomSize , /*Object literal*/configuration) {

    const t = this;

    let BORDER = 'solid 1px ' + (configuration && configuration.border_color ? configuration.border_color : '#efefef');
    let SIDE_HIGHLIGHTED = configuration && configuration.highlight_color ? '0px 0px 8px 0px ' +  configuration.highlight_color : '0px 0px 8px 0px rgba(255,137,0,1)';
    let UNDER_BAR_HEIGHT = 55;
    let IS_CLICK = 130;
    let BORDER_GAP = 15;
    let CANVAS_SIZE = 2024;
    let SQUARE_SIZE = zoomSize || 180;
    let BUTTON_SIZE = 512;
    let RESIZE_DELAY = 50;

    let sideImages = [];
    let sideImgElements = [];
    let imagesInfo = [];
    let srcDB =    [];
    let zoomID = new Date().getTime() + "_" + Math.floor(Math.random() * 500);

    let incrementalIndex = -1;

    t.each(function (i, e) {

        if (e.tagName.toLowerCase() === 'img') {

            if (srcDB.indexOf(e.src) === -1) {

                incrementalIndex++;
                pushImage(incrementalIndex , e);

            }

            _(e).bind('click.jts_zoom_events_' + zoomID, function (event) {

                addZoom(e, event);

            }).css('cursor', 'pointer');

        }

        function pushImage(i, e) {

            let imgC = document.createElement('div');
            let imgI = new Image();

            _(imgI).css({

                'width': '100%',
                'height': 'auto',
                'position': 'relative'

            }).attr({

                'alt': 'side_img',
                'src': e.src,
                'id': 'jts_zoom_side_img_' + i,
                'index_ref': i

            }).addClass('jts_zoom_side_img');

            _(imgC).css({

                'border': BORDER,
                'height': 'auto',
                'margin-bottom': 5,
                'cursor': 'pointer'

            }).attr('id', 'jts_zoom_side_container_' + i).addClass('col-pp-12 jts_zoom_side_img_container').append(imgI);

            srcDB.push(e.src);

            sideImages.push(imgC);
            sideImgElements.push(imgI);
            storeImgInfo(i, e);

        }

        function storeImgInfo(i, e) {

            let info = {};
            let name = e.src.split('/');

            name = name[name.length - 1];
            info.name = name;

            imagesInfo.push(info);

            if (_(e).attr('info_address')) {

                getInfo(_(e).attr('info_address'));

            }else if(_(e).attr('zoom_data')){

                let zoomInfo = JSON.parse(_(e).attr('zoom_data'));

                for (let n in zoomInfo) {

                    if(zoomInfo.hasOwnProperty(n)){

                        imagesInfo[i][n] = zoomInfo[n];

                    }

                }

            }
            else {

                setInfo();

            }

            function getInfo(address) {

                jTS.jJSON(address,
                    function (d) {

                        for (let n in d) {

                            if(d.hasOwnProperty(n)){

                                imagesInfo[i][n] = d[n];

                            }

                        }

                    },
                    function (e) {

                        setInfo();

                    });

            }

            function setInfo() {

                jTS.jRequest(e.src, {

                    'success': function (d) {

                        let b = new Blob([d]);

                        imagesInfo[i].size = b.size;

                    }

                });

            }

        }

    });

    function addZoom(e, event) {

        let imageIndex = srcDB.indexOf(e.src);
        let onMobile = jTS.jMobile();

        let container = document.createElement('div');
        let innerContainer = document.createElement('div');
        let rowUp = document.createElement('div');
        let rowDown = document.createElement('div');
        let sideBar = document.createElement('div');
        let containerLeftOuterBox = document.createElement('div');
        let containerRightOuterBox = document.createElement('div');
        let containerLeft = document.createElement('div');
        let containerRight = document.createElement('div');
        let square = document.createElement('div');
        let imageInfo = document.createElement('div');
        let imageCanvas = document.createElement('canvas');
        let brush = imageCanvas.getContext('2d');
        let dpr = 5;
        let underBar = document.createElement('div');
        let titleText = document.createElement('div');
        let previousButton = document.createElement('div');
        let nextButton = document.createElement('div');
        let disposeButton = document.createElement('div');

        let mousedown = onMobile ? 'touchstart' : 'mousedown';
        let mousemove = onMobile ? 'touchmove' : 'mousemove';
        let mouseup = onMobile ? 'touchend' : 'mouseup';
        let mouseover = onMobile ? 'touchstart' : 'mouseover';
        let mouseout = onMobile ? 'touchend' : 'mouseout';

        let startMT = 0;
        let endMT = 0;

        let leftIMG = new Image();

        _(container).css({

            'background-color': configuration && configuration.overlay_color ? configuration.overlay_color : 'rgba(0,0,0,0.6)',
            'position': 'fixed',
            'top': 0,
            'left': 0,
            'z-index': 100

        });

        _(innerContainer).css({

            'background-color': 'rgb(255,255,255)',
            'position': 'absolute',
            'border-radius': configuration && (configuration.main_radius || configuration.main_radius === 0) ? configuration.main_radius : 5,
            'height': 'auto',
            'padding': 15,
            'box-shadow' : configuration && configuration.main_shadow ? configuration.main_shadow : '2px 2px 10px 0px rgba(0,0,0,0.6)'

        });

        _([rowUp, rowDown]).addClass('row');

        _(sideBar).css({

            'border': BORDER,
            'border-radius': configuration && (configuration.sub_radius || configuration.sub_radius === 0) ? configuration.main_radius : 5,

        }).addClass('ts-hide-pp col-pl-1');



        _(containerLeft).css({

            'border': BORDER,
            'border-radius': configuration && (configuration.sub_radius || configuration.sub_radius === 0) ? configuration.sub_radius : 5,
            'box-shadow' : configuration && configuration.sub_shadow ? configuration.sub_shadow : '2px 2px 5px 0px rgba(0,0,0,0.3)'

        }).addClass('col-pp-12');

        _(containerRight).css({

            'border': BORDER,
            'border-radius': configuration && (configuration.sub_radius || configuration.sub_radius === 0) ? configuration.sub_radius : 5,
            'box-shadow' : configuration && configuration.sub_shadow ? configuration.sub_shadow : '2px 2px 5px 0px rgba(0,0,0,0.3)'

        }).addClass('col-pp-12');

        _(containerLeftOuterBox).css({

            'margin-bottom': 15,
            'overflow' : 'visible'

        }).addClass('col-pp-12 col-pl-5h ts-hpd-5').append(containerLeft);

        _(containerRightOuterBox).css({

            'margin-bottom': 15,
            'overflow' : 'visible'

        }).addClass('col-pp-12 col-pl-5h ts-hpd-5').append(containerRight);

        _(square).css({

            'background-color': configuration && configuration.square_color ? configuration.square_color : 'rgba(255,137,0,0.3)',
            'visibility': 'hidden',
            'width': SQUARE_SIZE,
            'height': SQUARE_SIZE,
            'position': 'absolute',
            'z-index': 10

        }).attr({

            'id': 'jts_zoom_square'

        });

        _(underBar).css({

            'height': UNDER_BAR_HEIGHT,
            'overflow': 'visible'

        }).addClass('col-pp-12');

        _(leftIMG).css({

            'position': 'absolute',
            'border': BORDER

        }).attr({

            'alt': 'left_img',
            'src': srcDB[imageIndex]

        }).addClass('jts_zoom_left_img');

        imageCanvas.width = CANVAS_SIZE;
        imageCanvas.height = CANVAS_SIZE;
        previousButton.width = BUTTON_SIZE;
        previousButton.height = BUTTON_SIZE;
        nextButton.width = BUTTON_SIZE;
        nextButton.height = BUTTON_SIZE;
        disposeButton.width = BUTTON_SIZE;
        disposeButton.height = BUTTON_SIZE;

        _(imageCanvas).css({

            'width': '100%',
            'height': '100%',
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'display': 'none',
            'z-index': 1

        }).addClass('jts_zoom_canvas');

        _(imageInfo).css({

            'width': '100%',
            'height': '100%',
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'padding': Math.floor(BORDER_GAP * 0.5),
            'z-index': 0

        }).addClass('jts_zoom_info');

        _(titleText).css({

            'height': '100%',
            'margin-right': 10,
            'margin-left': 10,
            'padding': 7,
            'font-size': 30

        }).addClass('ts-hide-pp col-pl-6 col-tab-7').addClass(configuration && configuration.font_class ? configuration.font_class : 'ts-font-helvetica' );

        _(previousButton).css({

            'width': UNDER_BAR_HEIGHT,
            'height': '100%',
            'margin-right': 10,
            'border-radius': configuration && (configuration.sub_radius || configuration.sub_radius === 0) ? configuration.main_radius : 5,
            'box-shadow' : configuration && configuration.sub_shadow ? configuration.sub_shadow : '2px 2px 5px 0px rgba(0,0,0,0.3)',
            'cursor': 'pointer',
            'background-color' : configuration && configuration.buttons_background ? configuration.buttons_background : '#ebebeb',
            'color' : configuration && configuration.buttons_color ? configuration.buttons_color : '#000000',
            'text-align' : 'center',
            'font-size' : 30,
            'padding' : '13px 0px 0px 0px'

        }).addClass('ts-grid-fixed');

        _(nextButton).css({

            'width': UNDER_BAR_HEIGHT,
            'height': '100%',
            'margin-right': 10,
            'border-radius': configuration && (configuration.sub_radius || configuration.sub_radius === 0) ? configuration.main_radius : 5,
            'box-shadow' : configuration && configuration.sub_shadow ? configuration.sub_shadow : '2px 2px 5px 0px rgba(0,0,0,0.3)',
            'cursor': 'pointer',
            'background-color' : configuration && configuration.buttons_background ? configuration.buttons_background : '#ebebeb',
            'color' : configuration && configuration.buttons_color ? configuration.buttons_color : '#000000',
            'text-align' : 'center',
            'font-size' : 30,
            'padding' : '13px 0px 0px 0px'

        }).addClass('ts-grid-fixed');

        _(disposeButton).css({

            'width': UNDER_BAR_HEIGHT,
            'height': '100%',
            'border-radius': configuration && (configuration.sub_radius || configuration.sub_radius === 0) ? configuration.main_radius : 5,
            'box-shadow' : configuration && configuration.sub_shadow ? configuration.sub_shadow : '2px 2px 5px 0px rgba(0,0,0,0.3)',
            'cursor': 'pointer',
            'background-color' : configuration && configuration.dispose_background ? configuration.dispose_background : '#f12f0a',
            'color' : configuration && configuration.dispose_color ? configuration.dispose_color : '#f1f1f1',
            'text-align' : 'center',
            'font-size' : 30,
            'padding' : '13px 0px 0px 0px'

        }).addClass('ts-grid-fixed ts-grid-right');

        _(containerLeft).append([leftIMG, square]);
        _(containerRight).append([imageInfo, imageCanvas]);
        _(rowUp).append([sideBar, containerLeftOuterBox, containerRightOuterBox]);
        _(underBar).append([previousButton, nextButton, titleText, disposeButton]);
        _(rowDown).append(underBar);
        _(innerContainer).append([rowUp, rowDown]);
        _(container).append(innerContainer);
        _('body').append(container);

        setSize();
        setListeners();

        _(sideBar).append(sideImages).scrollingLiquidBox(false,{

            'padding': 5,
            'scroll_marker_background ': configuration && configuration.scroll_color ? configuration.scroll_color : 'rgba(165,165,165,0.5)',
            'scroll_marker_width': 10

        });

        setAddedListeners();
        loadInfo();
        drawButtons();

        function canvasDraw(x, y, z) {

            let mX = x - leftIMG.offsetLeft;
            let mY = y - leftIMG.offsetTop;

            let width = _(leftIMG).outerWidth();
            let height = _(leftIMG).outerHeight();

            let oW = sideImgElements[imageIndex].naturalWidth || sideImgElements[imageIndex].width;
            let oH = sideImgElements[imageIndex].naturalHeight || sideImgElements[imageIndex].height;

            let cropX = mX * (oW / width);
            let cropY = mY * (oH / height);
            let cropW = z * (oW / width);
            let cropH = z * (oH / height);

            _(imageCanvas).css('display', 'block');

            /*
            CANVAS RULE : the crop pixels are stretched to CANVAS.width and CANVAS.height ,
            after stretched to CANVAS css width and height
            */

            brush.fillStyle = '#ffffff';

            brush.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
            brush.fillRect(0, 0, imageCanvas.width, imageCanvas.height);
            brush.drawImage(sideImgElements[imageIndex], cropX, cropY, cropW, cropH, 0, 0, imageCanvas.width, imageCanvas.height);

        }

        function displayInfo(info) {

            let index = 0;
            let box = document.createElement('div');

            _(box).css({

                'position': 'relative',
                'width': '100%',
                'height': '100%',
                'border': BORDER

            }).attr('id', 'jts_zoom_info_' + zoomID);

            let table = document.createElement('table');

            table.cellSpacing = 0;
            table.cellPadding = 5;

            for (let n in info) {

                if(info.hasOwnProperty(n)){

                    let tr = document.createElement('tr');
                    let tdLeft = document.createElement('td');
                    let tdCenter = document.createElement('td');
                    let tdRight = document.createElement('td');

                    let value = String(info[n]);

                    _(tdLeft).html(n).css({

                        'vertical-align': 'top',
                        'font-size': 23

                    }).addClass(configuration && configuration.font_class ? configuration.font_class : 'ts-font-helvetica');

                    _(tdCenter).html(':').css({

                        'vertical-align': 'top',
                        'font-size': 21

                    });

                    _(tdRight).html(value).css({

                        'vertical-align': 'top',
                        'font-size': 16,
                        'font-style': 'italic',
                        'padding-top': 9,
                        'width': '100%'
                    });

                    _(tr).append([tdLeft, tdCenter, tdRight]).css({

                        'background-color': index % 2 == 0 ? '#f1f1f1' : '#e1e1e1'

                    });

                    _(table).append(tr);

                    index++;

                }

            }

            _(table).css({

                'border': 'none',

            }).addClass('ts-font-helvetica');

            _(box).append(table);
            _(imageInfo).html(box);

            _('#jts_zoom_info_' + zoomID).scrollingLiquidBox(false,{

                'scroll_marker_background': configuration && configuration.scroll_color ? configuration.scroll_color : 'rgba(165,165,165,0.5)',
                'scroll_marker_width' : 10

            });

            _(titleText).html(String(info.name));

        }

        function dispose() {

            _(window).unbind('.jts_zoom_events_' + zoomID);
            _('.jts_zoom_side_img').unbind('.jts_zoom_events_' + zoomID);
            _(leftIMG).unbind('.jts_zoom_events_' + zoomID);
            _(square).unbind('.jts_zoom_events_' + zoomID);
            _(previousButton).unbind('.jts_zoom_events_' + zoomID);
            _(nextButton).unbind('.jts_zoom_events_' + zoomID);
            _(disposeButton).unbind('.jts_zoom_events_' + zoomID);
            _('.jts_zoom_side_img_container').css('box-shadow', 'none');

            _(container).dispose();

        }

        function drawButtons() {

            _('#jts_zoom_side_container_' + imageIndex).css('box-shadow', SIDE_HIGHLIGHTED);

            _(previousButton).html('').append('<i class="fa fa-step-backward"></i>');
            _(nextButton).html('').append('<i class="fa fa-step-forward"></i>');
            _(disposeButton).html('').append('<i class="fa fa-times-circle"></i>');

        }

        function getInnerWidth(w) {

            let MARKER = [0, 415, 737, 1025, 1981, 10000];
            let SIZE = [w - 65, w - 40, w - 40, w - 100, w - 200];

            for (let i = 0 ; i < MARKER.length - 1 ; i++) {

                if (w >= MARKER[i] && w < MARKER[i + 1]) {

                    return SIZE[i];

                }

            }

        }

        function getSquarePos(e) {

            let data = {};

            let x = onMobile ? e.touches[0].clientX : e.screenX;
            let y = onMobile ? e.touches[0].clientY : e.screenY;

            let container = e.target.offsetParent;

            while (container) {

                x -= container.offsetLeft;
                y -= container.offsetTop;

                container = container.offsetParent;

            }

            data.x = x;
            data.y = y;

            return data;

        }

        function gotoNextImage() {

            let nIndex = imageIndex;

            for (let i = nIndex + 1 ; i < sideImages.length ; i++) {

                if (sideImages[i]) {

                    nIndex = i;
                    break;

                }

            }

            if (nIndex === imageIndex) {

                return;

            }

            setNextImage(nIndex);
            setLeftIMG();
            loadInfo();

        }

        function gotoPreviousImage() {

            let nIndex = imageIndex;

            for (let i = nIndex - 1 ; i >= 0 ; i--) {

                if (sideImages[i]) {

                    nIndex = i;
                    break;

                }

            }

            if (nIndex === imageIndex) {

                return;

            }

            setNextImage(nIndex);
            setLeftIMG();
            loadInfo();

        }

        function loadInfo() {

            displayInfo(imagesInfo[imageIndex]);

        }

        function setAddedListeners() {

            _('.jts_zoom_side_img').bind(mousedown + '.jts_zoom_events_' + zoomID,
                function (e) {

                    startMT = e.time;

                });

            _('.jts_zoom_side_img').bind(mouseup + '.jts_zoom_events_'  + zoomID,
                function (e) {

                    endMT = e.time;

                    if (endMT - startMT <= IS_CLICK) {

                        setNextImage(parseInt(_(e.target).attr('index_ref')));
                        setLeftIMG();
                        loadInfo();

                    }

                });

            _(leftIMG).bind(mouseover + '.jts_zoom_events_' + zoomID,
                function (e) {

                    _(square).css('visibility', 'visible');

                    setSquarePos(e);

                    _(window).bind(mouseout + '.jts_zoom_events_' + zoomID,
                        function (e) {

                            if (e.relatedTarget !== leftIMG && e.relatedTarget !== square) {

                                _(window).unbind(mouseout + '.jts_zoom_events_' + zoomID);

                                _(square).css('visibility', 'hidden');
                                _(imageCanvas).css('display', 'none');

                            }

                        });

                });

            _([leftIMG, square]).bind(mousemove + '.jts_zoom_events_' + zoomID,
                function (e) {

                    if (e.target === leftIMG || e.target === square) {

                        e.preventDefault();
                        setSquarePos(e);

                    }

                });

            _(previousButton).bind('click.jts_zoom_events_' + zoomID,
                function (e) {

                    gotoPreviousImage();

                });

            _(nextButton).bind('click.jts_zoom_events_' + zoomID,
                function (e) {

                    gotoNextImage();

                });

            _(disposeButton).bind('click.jts_zoom_events_' + zoomID,
                function (e) {

                    dispose();

                });

        }

        function setLeftIMG() {

            let containerW = _(containerLeft).outerWidth();
            let containerH = _(containerLeft).outerHeight();

            let oW = sideImgElements[imageIndex].naturalWidth || sideImgElements[imageIndex].width;
            let oH = sideImgElements[imageIndex].naturalHeight || sideImgElements[imageIndex].height;

            let data = getSizeData(containerW - BORDER_GAP, containerH - BORDER_GAP);

            _(leftIMG).css(data);

            let squareSize = data.width < SQUARE_SIZE || data.height < SQUARE_SIZE ? (data.width > data.height ? data.height : data.width) : SQUARE_SIZE;

            _(square).css({

                'width': squareSize,
                'height': squareSize

            });

            function getSizeData(width, height) {

                let data = {};

                let w, h;

                if (oW > oH) {

                    getHeight(width);

                }
                else {

                    getWidth(height);

                }

                if (w > oW && h > oH) {

                    w = oW;
                    h = oH;

                }

                data.width = Math.round(w);
                data.height = Math.round(h);
                data.left = Math.floor((containerW * 0.5) - (w * 0.5));
                data.top = Math.floor((containerH * 0.5) - (h * 0.5));

                function getHeight(val) {

                    w = val;
                    h = oH * (w / oW);

                    if (h > height) {

                        getHeight(val - 1);

                    }

                }

                function getWidth(val) {

                    h = val;
                    w = oW * (h / oH);

                    if (w > width) {

                        getWidth(val - 1);

                    }

                }

                return data;

            }

        }

        function setListeners() {

            _(window).bind('resize.jts_zoom_events_' + zoomID,
                function () {

                    setSize();

                });

        }

        function setNextImage(nIndex) {

            _('#jts_zoom_side_container_' + imageIndex).css('box-shadow', 'none');

            imageIndex = nIndex;

            _('#jts_zoom_side_container_' + imageIndex).css('box-shadow', SIDE_HIGHLIGHTED);
            _(leftIMG).attr('src', srcDB[imageIndex]);

        }

        function setSize() {

            let w = _(window).width();
            let h = _(window).height();

            _(container).css({

                'width': w,
                'height': h

            });

            let innerW = getInnerWidth(w);

            _(innerContainer).css({

                'width': innerW,
                'left': (w * 0.5) - (innerW * 0.5)

            });

            _([sideBar, containerLeft, containerRight]).css('height', _(containerLeft).outerWidth());

            setLeftIMG();

            imageCanvas.width = _(containerRight).outerWidth() * dpr;
            imageCanvas.height = _(containerRight).outerHeight() * dpr;

            let innerY = (h * 0.5) - (_(innerContainer).outerHeight() * 0.5);

            _(innerContainer).css('top', innerY);

            /*this should solve side handle issues*/
            setTimeout(function () {

                _(window).emits(jTS.built_in_events.jLIQUID_BOX_RESIZE);


            }, RESIZE_DELAY);

        }

        function setSquarePos(e) {

            let squarePos = getSquarePos(e);
            let squareSize = _(square).outerWidth();

            let x = squarePos.x - (squareSize * 0.5);
            let y = squarePos.y - (squareSize * 0.5);

            let leftBound = leftIMG.offsetLeft;
            let rightBound = leftBound + _(leftIMG).outerWidth();
            let topBound = leftIMG.offsetTop;
            let bottomBound = topBound + _(leftIMG).outerHeight();

            x = x < leftBound ? leftBound : (x + squareSize > rightBound ? rightBound - squareSize : x);
            y = y < topBound ? topBound : (y + squareSize > bottomBound ? bottomBound - squareSize : y);

            _(square).css({

                'left': x,
                'top': y

            });

            canvasDraw(x, y, squareSize);

        }

    }

    return this;

};

/*END TOOLS PACKAGE*/





/*TRAVERSING PACKAGE*/

/**
 *
 * @param callback {Function}
 * @return {jTS}
 */
jTS.fn.each = /*jTS Object*/ function (/*Function*/ callback) {

    const t = this;

    loop(0);

    function loop(index) {

        if (index < t.length) {

            callback(index, t[index]);
            loop(index + 1);

        }

    }

    return this;

};

/**
 *
 * @return {jTS}
 */
jTS.fn.even = /*jTS*/function () {

    const t = this;

    let e = [];

    t.each(filter);

    function filter(index, element) {

        if ((index + 1) % 2 === 0) {

            e.push(element);

        }

    }

    return _(e);

};

/**
 *
 * @return {Object}
 */
jTS.fn.elementGlobalPosition = /*Object literal*/function(){

    let parent = this;
    let x = 0;
    let y = 0;

    while(parent[0] !== document && parent[0] !== window){

        if(!parent.hasClass('row')){

            x += parent[0].offsetLeft + parseInt(parent.css('border-left-width'));
            y += parent[0].offsetTop + parseInt(parent.css('border-top-width'));

        }

        parent = parent.offsetPs();

    }

    return {x : x , y : y};

};

/**
 *
 * @param x {int}
 * @param y {int}
 * @return {Object}
 */
jTS.fn.globalToLocalPoint =/*Object literal*/ function(/*int*/x,/*int*/y){

    let parent = this;

    while(parent[0] !== document && parent[0] !== window ){

        if(!parent.hasClass('row')){

            x -= parent[0].offsetLeft;
            y -= parent[0].offsetTop;

        }

        parent = parent.offsetPs();

    }

    return { x : x , y : y};

};

/**
 *
 * @return {jTS}
 */
jTS.fn.odd = /*jTS*/function () {

    const t = this;

    let e = [];

    t.each(filter);

    function filter(index, element) {

        if ((index + 1) % 2 !== 0) {

            e.push(element);

        }

    }

    return _(e);

};

/**
 *
 * @return {jTS}
 */
jTS.fn.offsetPs = /*jTS*/function () {

    const t = this;

    let jTSObject = [];

    t.each(function (i, e) {

        let flag = false;

        let parent = e === document.querySelector('body') ? document.querySelector('html') : e.parentNode;

        if (parent == null) {

            flag = true;

        }

        for (let h = 0 ; h < jTSObject.length; h++) {

            if (jTSObject[h] === parent) {

                flag = true;
                break;

            }

        }

        if (!flag) {

            jTSObject.push(parent);

        }

    });

    return _(jTSObject);

};

/*END TRAVERSING PACKAGE*/





/*HELPERS SECTION*/

jTS.boolean = {

    "value_attribute": [
        'active',
        'async',
        /*'autocomplete',*/
        'autofocus',
        'autoplay',
        'checked',
        'compact',
        'contenteditable',
        'controls',
        'default',
        'defer',
        'disabled',
        'enabled',
        'expanded',
        'formNoValidate',
        'frameborder',
        'hidden',
        'indeterminate',
        'ismap',
        'loop',
        'multiple',
        'muted',
        'nohref',
        'noresize',
        'noshade',
        'novalidate',
        'nowrap',
        'open',
        'readonly',
        'required',
        'reversed',
        'scoped',
        'scrolling',
        'seamless',
        'selected',
        'sortable',
        'spellcheck',
        'translate'
    ]

};

jTS.built_in_events = {
    'jANIMATE_PAUSE' : 'jAnimate_pause',
    'jANIMATE_RESUME' : 'jAnimate_resume',
    'jCOLOR_PICKER_UPDATED' : 'jColor_picker_updated',
    'jCROPPER_DONE' : 'jCropper_done',
    'jCROPPER_ONLY_CLOSED' : 'jCropper_only_closed',
    'jEXTERNAL_RESIZE' : 'jExternal_resize',
    'jLIQUID_BOX_RESIZE' : 'jLiquid_box_resize',
    'jMASONRY_READY' : 'jMasonry_ready',
    'jMASONRY_RESIZE' : 'jMasonry_resize',
    'jPAGINATION_FILTER_SORT_ITEMS' : 'jPagination_filter_sort_items',
    'jPAGINATION_PAGE_CHANGE' : 'jPagination_page_change',
    'jPAGINATION_UPDATE_ITEMS' : 'jPagination_update_items',
    'jPARTICLES_FX_READY' : 'jParticles_fx_ready',
    'jREQUEST_END_EVENT' : 'jRequest_end_event',
    'jREQUEST_PROGRESS_EVENT' : 'jRequest_progress_event',
    'jREQUEST_START_EVENT' : 'jRequest_start_event',
    'jSHELL_RESIZE' : 'jShell_resize',
    'jSHOWCASE_ANIMATION_START' : 'jShowcase_animation_start',
    'jSHOWCASE_ANIMATION_END' : 'jShowcase_animation_end',
    'jSHOWCASE_CONTROLS_PRESSED' : 'jShowcase_controls_pressed',
    'jSHOWCASE_READY' : 'jShowcase_ready',
    'jTOUCH_SCROLL_STEP' : 'jTouch_scroll_step',
    'jWORLD_MAP_LOADED' : 'jWorld_map_loaded',
    'jWORLD_MAP_SET_ZOOM_AND_POSITION' : 'jWorld_map_set_position'
};

jTS.cssMap = {

    'align-content': 'stretch',
    'align-items': 'stretch',
    'align-self': 'auto',
    'all': 'none',
    'animation': 'composed',
    'animation-delay': '0s',
    'animation-direction': 'normal',
    'animation-duration': '0s',
    'animation-fill-mode': 'none',
    'animation-iteration-count': '1',
    'animation-name': 'none',
    'animation-play-state': 'running',
    'animation-timing-function': 'ease',
    'backface-visibility': 'visible',
    'background': 'composed',
    'background-attachment': 'scroll',
    'background-blend-mode': 'normal',
    'background-clip': 'border-box',
    'background-color': 'rgba(255,255,255,0)',
    'background-image': 'none',
    'background-origin': 'padding-box',
    'background-position': '0% 0%',
    'background-repeat': 'repeat',
    'background-size': 'auto',
    'border': 'composed',
    'border-bottom': 'composed',
    'border-bottom-color': 'rgb(255,255,255)',
    'border-bottom-left-radius': '0px',
    'border-bottom-right-radius': '0px',
    'border-bottom-style': 'none',
    'border-bottom-width': '0px',
    'border-collapse': 'separate',
    'border-color': 'rgb(255,255,255)',
    'border-image': 'none',
    'border-image-outset': '0',
    'border-image-repeat': 'stretch',
    'border-smage-slice': '100%',
    'border-smage-source': 'none',
    'border-image-width': '1',
    'border-left': 'composed',
    'border-left-color': 'rgb(255,255,255)',
    'border-left-style': 'none',
    'border-left-width': '0px',
    'border-radius': '0px',
    'border-right': 'composed',
    'border-right-color': 'rgb(255,255,255)',
    'border-right-style': 'none',
    'border-right-width': '0px',
    'border-spacing': '2px',
    'border-style': 'none',
    'border-top': 'composed',
    'border-top-color': 'rgb(255,255,255)',
    'border-top-left-radius': '0px',
    'border-top-right-radius': '0px',
    'border-top-style': 'none',
    'border-top-width': '0px',
    'border-width': '0px',
    'box-decoration-break': 'slice',
    'box-shadow': 'none',
    'box-sizing': 'content-box',
    'caption-side': 'top',
    'caret-color': 'auto',
    'clear': 'none',
    'clip': 'auto',
    'color': 'auto',
    'column-count': 'auto',
    'column-fill': 'balance',
    'column-gap': 'normal',
    'column-rule': 'composed',
    'column-rule-color': 'rgb(255,255,255)',
    'column-rule-style': 'none',
    'column-rule-width': '0px',
    'column-span': 'none',
    'column-width': 'auto',
    'columns': 'auto auto',
    'content': 'normal',
    'counter-increment': 'none',
    'counter-reset': 'none',
    'cursor': 'auto',
    'direction': 'ltr',
    'display': 'auto',
    'empty-cells': 'show',
    'filter': 'none',
    'flex': 'composed',
    'flex-basis': 'auto',
    'flex-direction': 'row',
    'flex-flow': 'row nowrap',
    'flex-grow': '1',
    'flex-shrink': '1',
    'flax-wrap': 'nowrap',
    'float': 'none',
    'font': 'composed',
    'font-family': 'auto',
    'font-kerning': 'auto',
    'font-size': 'medium',
    'font-size-adjust': 'none',
    'font-stretch': 'normal',
    'font-style': 'normal',
    'font-variant': 'normal',
    'font-weight': 'normal',
    'grid': 'composed',
    'grid-area': 'composed',
    'grid-auto-columns': 'auto',
    'grid-auto-flow': 'row',
    'grid-auto-rows': 'auto',
    'grid-column': 'composed',
    'grid-column-end': 'auto',
    'grid-column-gap': '0',
    'grid-column-start': 'auto',
    'grid-gap': 'composed',
    'grid-row': 'composed',
    'grid-row-end': 'auto',
    'grid-row-gap': '0',
    'grid-row-start': 'auto',
    'grid-template': 'composed',
    'grid-template-areas': 'none',
    'grid-template-columns': 'none',
    'grid-template-rows': 'none',
    'hanging-puntuaction': 'none',
    'justify-content': 'flex-start',
    'letter-spacing': 'normal',
    'line-height': 'normal',
    'line-style': 'composed',
    'line-style-image': 'none',
    'line-style-position': 'outside',
    'line-style-type': 'disc',
    'margin-bottom': '0px',
    'margin-left': '0px',
    'margin-right': '0px',
    'margin-top': '0px',
    'max-height': 'none',
    'max-width': 'none',
    'min-height': 'none',
    'min-width': 'none',
    'object-fit': 'fill',
    'opacity': '1',
    'order': '0',
    'otuline': 'composed',
    'outline-color': 'invert',
    'outline-offset': '0',
    'outline-style': 'none',
    'outline-width': '0px',
    'overflow': 'visible',
    'overflow-x': 'visible',
    'overflow-y': 'visible',
    'padding-bottom': '0px',
    'padding-left': '0px',
    'padding-right': '0px',
    'padding-top': '0px',
    'page-break-after': 'auto',
    'page-break-before': 'auto',
    'page-break-inside': 'auto',
    'perspective': 'none',
    'perspective-origin': '50% 50%',
    'pointer-events': 'auto',
    'position': 'static',
    'quotes': 'none',
    'resize': 'none',
    'tab-size': '8',
    'table-layout': 'auto',
    'text-align': 'left',
    'text-align-last': 'auto',
    'text-decoration': 'composed',
    'text-decoration-color': 'rgb(255,255,255)',
    'text-decoration-line': 'none',
    'text-decoration-style': 'solid',
    'text-indent': '0',
    'text-justify': 'auto',
    'text-overflow': 'clip',
    'text-shadow': 'none',
    'text-transform': 'none',
    'transform': 'none',
    'transform-origin': '50% 50% 0',
    'transform-style': 'flat',
    'transition': 'composed',
    'transition-delay': '0s',
    'transition-duration': '0s',
    'transition-property': 'all',
    'transition-timing-function': 'ease',
    'unicode-bidi': 'normal',
    'user-select': 'auto',
    'vertical-align': 'baseline',
    'visibility': 'visible',
    'white-space': 'normal',
    'word-break': 'normal',
    'word-spacing': 'normal',
    'word-wrap': 'normal',
    'z-index': 'auto'

};

jTS.flow = {

    "clearFlow": function () {

        for (let n in jTS.flow.listeners) {

            if(jTS.flow.listeners.hasOwnProperty(n)){

                if (jTS.flow.listeners[n].length === 0) {

                    delete jTS.flow.listeners[n];

                }

            }

        }

    },
    "events"    : {},
    "Event" : function (e, listener, data) {

        let t = this;

        this.changedTouches = e.changedTouches;
        this.ctrlKey = e.ctrlKey;
        this.currentTarget = listener.element;
        this.data = data;
        this.elementSetIndex = listener.index;
        this.globalX = e.pageX;
        this.globalY = e.pageY;
        this.keyCode = e.keyCode;
        this.localX = e.offsetX;
        this.localY = e.offsetY;
        this.originalEvent = e;
        this.relatedTarget = e.relatedTarget;
        this.screenX = e.clientX || e.x;
        this.screenY = e.clientY || e.y;
        this.shiftKey = e.shiftKey;
        this.target = e.target;
        this.time = new Date().getTime();
        this.type = e.type;
        this.touches = e.touches;

        this.preventDefault = function () { e.preventDefault(); };
        this.stopImmediatePropagation = function () { e.stopImmediatePropagation(); e.immediatePropS = true; };
        this.stopPropagation = function () { e.stopPropagation(); e.propagationStopped = true; e.propagationSO = listener.element; };
        this.isDefaultPrevented = function () { return e.defaultPrevented; };
        this.isImmediatePropagationStopped = function () { return e.immediatePropS; };
        this.isPropagationStopped = function () { return e.propagationStopped; };

        if (e.type === 'touchstart') {

            if (e.touches[0]) {

                t.globalX = e.touches[0].pageX;
                t.globalY = e.touches[0].pageY;
                t.screenX = e.touches[0].clientX;
                t.screenY = e.touches[0].clientY;

                let localCoordinates = _(t.target).globalToLocalPoint(t.globalX,t.globalY);

                t.localX = localCoordinates.x;
                t.localY = localCoordinates.y;

            }

        }else if(e.type === 'touchmove'){

            if (e.touches[0]) {

                t.globalX = e.touches[0].pageX;
                t.globalY = e.touches[0].pageY;
                t.screenX = e.touches[0].clientX;
                t.screenY = e.touches[0].clientY;

                let localCoordinates = _(t.target).globalToLocalPoint(t.globalX,t.globalY);

                t.localX = localCoordinates.x;
                t.localY = localCoordinates.y;

            }

        }else if(e.type === 'touchend'){

            if (e.changedTouches[0]) {

                t.globalX = e.changedTouches[0].pageX;
                t.globalY = e.changedTouches[0].pageY;
                t.screenX = e.changedTouches[0].clientX;
                t.screenY = e.changedTouches[0].clientY;

                let localCoordinates = _(t.target).globalToLocalPoint(t.globalX,t.globalY);

                t.localX = localCoordinates.x;
                t.localY = localCoordinates.y;

            }

        }

    },
    "listeners" : {},
    "stackIndex": {}

};

jTS.jFlow = {

    "jListeners": [],
    "jEvent": function (type, emitter, currentTarget, data) {

        let t = this;

        this.type = type;
        this.emitter = emitter;
        this.currentTarget = currentTarget;
        this.data = data ? data : {};

    },
    "jStackIndex": 0,
    "unbindIndex": 0

};

jTS.originalStyles = [];

/*END HELPERS SECTION*/