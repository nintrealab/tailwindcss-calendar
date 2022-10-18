/*!
 * Evo Calendar - Simple and Modern-looking Event Calendar Plugin
 *
 * Licensed under the MIT License
 * 
 * Version: 1.1.2
 * Author: Edlyn Villegas
 * Docs: https://edlynvillegas.github.com/evo-calendar
 * Repo: https://github.com/edlynvillegas/evo-calendar
 * Issues: https://github.com/edlynvillegas/evo-calendar/issues
 * 
 */

;(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';
    var EvoCalendar = window.EvoCalendar || {};
    
    EvoCalendar = (function() {
        var instanceUid = 0;
        function EvoCalendar(element, settings) {
            var _ = this;
            _.defaults = {
                theme: null,
                format: 'mm/dd/yyyy',
                titleFormat: 'MM yyyy',
                eventHeaderFormat: 'MM d, yyyy',
                firstDayOfWeek: 0,
                language: 'en',
                todayHighlight: false,
                sidebarDisplayDefault: true,
                sidebarToggler: true,
                eventDisplayDefault: true,
                eventListToggler: true,
                calendarEvents: null
            };
            _.options = $.extend({}, _.defaults, settings);

            _.initials = {
                default_class: $(element)[0].classList.value,
                validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
                dates: {
                    en: {
                        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                        noEventForToday: "No event for today.. so take a rest! :)",
                        noEventForThisDay: "No event for this day.. so take a rest! :)"
                    },
                    km: {
                        days: ["អាទិត្យ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បត្តិ៍", "សុក្រ", "សៅរ៍"],
                        daysShort: ["អាទិត្យ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បត្តិ៍", "សុក្រ", "សៅរ៍"],
                        daysMin: ["អា", "ច", "អ", "ព", "ព្រ", "ស", "ស"],
                        months: ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"],
                        monthsShort: ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"],
                        noEventForToday: "ថ្ងៃនេះអត់មានកម្មវិធីអីទេ សម្រាកសិនទៅ! :)",
                        noEventForThisDay: "ថ្ងៃនេះអត់មានកម្មវិធីអីទេ សម្រាកសិនទៅ! :)"
                        
                    }
                }
            }
            _.initials.weekends = {
                sun: _.initials.dates[_.options.language].daysShort[0],
                sat: _.initials.dates[_.options.language].daysShort[6]
            }


            // Format Calendar Events into selected format
            if(_.options.calendarEvents != null) {
                for(var i=0; i < _.options.calendarEvents.length; i++) {
                    // If event doesn't have an id, throw an error message
                    if(!_.options.calendarEvents[i].id) {
                        console.log("%c Event named: \""+_.options.calendarEvents[i].name+"\" doesn't have a unique ID ", "color:white;font-weight:bold;background-color:#e21d1d;");
                    }
                    if(_.isValidDate(_.options.calendarEvents[i].date)) {
                        _.options.calendarEvents[i].date = _.formatDate(_.options.calendarEvents[i].date, _.options.format)
                    }
                }
            }

            // Global variables
            _.startingDay = null;
            _.monthLength = null;
            
            // CURRENT
            _.$current = {
                month: (isNaN(this.month) || this.month == null) ? new Date().getMonth() : this.month,
                year: (isNaN(this.year) || this.year == null) ? new Date().getFullYear() : this.year,
                date: _.formatDate(_.initials.dates[_.defaults.language].months[new Date().getMonth()]+' '+new Date().getDate()+' '+ new Date().getFullYear(), _.options.format)
            }

            // ACTIVE
            _.$active = {
                month: _.$current.month,
                year: _.$current.year,
                date: _.$current.date,
                event_date: _.$current.date,
                events: []
            }

            // LABELS
            _.$label = {
                days: [],
                months: _.initials.dates[_.defaults.language].months,
                days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            }

            // HTML Markups (template)
            _.$markups = {
                calendarHTML: '',
                mainHTML: '',
                sidebarHTML: '',
                eventHTML: ''
            }
            // HTML DOM elements
            _.$elements = {
                calendarEl: $(element),
                innerEl: null,
                sidebarEl: null,
                eventEl: null,

                sidebarToggler: null,
                eventListToggler: null,

                activeDayEl: null,
                activeMonthEl: null,
                activeYearEl: null
            }
            _.$breakpoints = {
                tablet: 768,
                mobile: 425
            }

            _.formatDate = $.proxy(_.formatDate, _);
            _.selectDate = $.proxy(_.selectDate, _);
            _.selectMonth = $.proxy(_.selectMonth, _);
            _.selectYear = $.proxy(_.selectYear, _);
            _.selectEvent = $.proxy(_.selectEvent, _);
            _.toggleSidebar = $.proxy(_.toggleSidebar, _);
            _.toggleEventList = $.proxy(_.toggleEventList, _);
            
            _.instanceUid = instanceUid++;

            _.init(true);
        }

        return EvoCalendar;

    }());

    // Initialize plugin
    EvoCalendar.prototype.init = function(init) {
        var _THIS = this;
        var windowW = $(window).width();
        
        if (!$(_THIS.$elements.calendarEl).hasClass('calendar-initialized')) {
            $(_THIS.$elements.calendarEl).addClass('evo-calendar calendar-initialized');
            if (windowW <= _THIS.$breakpoints.tablet) { // tablet/mobile
                $(_THIS.$elements.calendarEl).addClass('sidebar-hide event-hide'); // close sidebar and event list on load
            } else {
                if (!_THIS.options.sidebarDisplayDefault) $(_THIS.$elements.calendarEl).addClass('sidebar-hide'); // set sidebar visibility on load
                if (!_THIS.options.eventDisplayDefault) $(_THIS.$elements.calendarEl).addClass('event-hide'); // set event-hide visibility on load
            }
            if (_THIS.options.theme) _THIS.setTheme(_THIS.options.theme); // set calendar theme
            _THIS.buildTheBones(); // start building the calendar components
        }
    };
    
    // Destroy plugin
    EvoCalendar.prototype.destroy = function() {
        var _THIS = this;
        // code here
        _THIS.destroyEventListener();
        if (_THIS.$elements.calendarEl) {
            _THIS.$elements.calendarEl.removeClass('calendar-initialized');
            _THIS.$elements.calendarEl.removeClass('evo-calendar');
            _THIS.$elements.calendarEl.removeClass('sidebar-hide');
            _THIS.$elements.calendarEl.removeClass('event-hide');
        }
        _THIS.$elements.calendarEl.empty();
        _THIS.$elements.calendarEl.attr('class', _THIS.initials.default_class);
        $(_THIS.$elements.calendarEl).trigger("destroy", [_THIS])
    }

    // Limit title (...)
    EvoCalendar.prototype.limitTitle = function(title, limit) {
        var newTitle = [];
        limit = limit === undefined ? 18 : limit;
        if ((title).split(' ').join('').length > limit) {
            var t = title.split(' ');
            for (var i=0; i<t.length; i++) {
                if (t[i].length + newTitle.join('').length <= limit) {
                    newTitle.push(t[i])
                }
            }
            return newTitle.join(' ') + '...'
        }
        return title;
    }
            
    // Parse format (date)
    EvoCalendar.prototype.parseFormat = function(format) {
        var _ = this;
        if (typeof format.toValue === 'function' && typeof format.toDisplay === 'function')
            return format;
        // IE treats \0 as a string end in inputs (truncating the value),
        // so it's a bad format delimiter, anyway
        var separators = format.replace(_.initials.validParts, '\0').split('\0'),
            parts = format.match(_.initials.validParts);
        if (!separators || !separators.length || !parts || parts.length === 0){
            console.log("%c Invalid date format ", "color:white;font-weight:bold;background-color:#e21d1d;");
        }
        return {
            separators: separators, 
            parts: parts
        };
    };
    
    // Format date
    EvoCalendar.prototype.formatDate = function(date, format, language) {
        var _THIS = this;
        if (!date) return '';
        language = language ? language : _THIS.defaults.language
        if (typeof format === 'string')
            format = _THIS.parseFormat(format);
        if (format.toDisplay)
            return format.toDisplay(date, format, language);

        var ndate = new Date(date);

        var val = {
            d   : ndate.getDate(),
            D   : _THIS.initials.dates[language].daysShort[ndate.getDay()],
            DD  : _THIS.initials.dates[language].days[ndate.getDay()],
            m   : ndate.getMonth() + 1,
            M   : _THIS.initials.dates[language].monthsShort[ndate.getMonth()],
            MM  : _THIS.initials.dates[language].months[ndate.getMonth()],
            yy  : ndate.getFullYear().toString().substring(2),
            yyyy: ndate.getFullYear()
        };
        
        val.dd = (val.d < 10 ? '0' : '') + val.d;
        val.mm = (val.m < 10 ? '0' : '') + val.m;
        date = [];

        var seps = $.extend([], format.separators);
        for (var i=0, cnt = format.parts.length; i <= cnt; i++){
            if (seps.length)
                date.push(seps.shift());
            date.push(val[format.parts[i]]);
        }
        return date.join('');
    };

    // Get dates between two dates
    EvoCalendar.prototype.getBetweenDates = function(dates) {
        var _THIS = this, betweenDates = [];
        for (var x = 0; x < _THIS.monthLength; x++) {
            var active_date = _THIS.formatDate(_THIS.$label.months[_THIS.$active.month] +' '+ (x + 1) +' '+ _THIS.$active.year, _THIS.options.format);
            if (_THIS.isBetweenDates(active_date, dates)) {
                betweenDates.push(active_date);
            }
        }
        return betweenDates;
    };

    // Check if date is between the passed calendar date 
    EvoCalendar.prototype.isBetweenDates = function(active_date, dates) {
        var sd, ed;
        if (dates instanceof Array) {
            sd = new Date(dates[0]);
            ed = new Date(dates[1]);
        } else {
            sd = new Date(dates);
            ed = new Date(dates);
        }
        if (sd <= new Date(active_date) && ed >= new Date(active_date)) {
            return true;
        }
        return false;
    }
    
    //  Check if event has the same event type in the same date
    EvoCalendar.prototype.hasSameDayEventType = function(date, type) {
        var _THIS = this, eventLength = 0;

        for (var i = 0; i < _THIS.options.calendarEvents.length; i++) {
            if (_THIS.options.calendarEvents[i].date instanceof Array) {

                var arr = _THIS.getBetweenDates(_THIS.options.calendarEvents[i].date);
                
                for (var x = 0; x < arr.length; x++) {
                    if(date === arr[x] && type === _THIS.options.calendarEvents[i].type) {
                        eventLength++;
                    }
                }

            } 
            else {

                if(date === _THIS.options.calendarEvents[i].date && type === _THIS.options.calendarEvents[i].type) {
                    eventLength++;
                }
            }
        }

        if (eventLength > 0) {
            return true;
        }
        return false;
    }
    
    // Set calendar theme
    EvoCalendar.prototype.setTheme = function(themeName) {
        var _THIS = this;
        var prevTheme = _THIS.options.theme;
        _THIS.options.theme = themeName.toLowerCase().split(' ').join('-');

        if (_THIS.options.theme) $(_THIS.$elements.calendarEl).removeClass(prevTheme);
        if (_THIS.options.theme !== 'default') $(_THIS.$elements.calendarEl).addClass(_THIS.options.theme);
    }

    // Called in every resize
    EvoCalendar.prototype.resize = function() {
        var _THIS = this;
        var hasSidebar = !_THIS.$elements.calendarEl.hasClass('sidebar-hide');
        var hasEvent = !_THIS.$elements.calendarEl.hasClass('event-hide');
        var windowW = $(window).width();

        if (windowW <= _THIS.$breakpoints.tablet && windowW > _THIS.$breakpoints.mobile) {
            
            if(hasSidebar) _THIS.toggleSidebar();
            if(hasEvent) _THIS.toggleEventList();

            $(window)
                .off('click.evocalendar.evo-' + _THIS.instanceUid)
                .on('click.evocalendar.evo-' + _THIS.instanceUid, $.proxy(_THIS.toggleOutside, _THIS));
        } else if (windowW <= _THIS.$breakpoints.mobile) {

            if(hasSidebar) _THIS.toggleSidebar(false);
            if(hasEvent) _THIS.toggleEventList(false);

            $(window)
                .off('click.evocalendar.evo-' + _THIS.instanceUid)
        } else {
            $(window)
                .off('click.evocalendar.evo-' + _THIS.instanceUid);
        }
    }

    // Initialize event listeners
    EvoCalendar.prototype.initEventListener = function() {
        var _THIS = this;

        // resize
        $(window)
            .off('resize.evocalendar.evo-' + _THIS.instanceUid)
            .on('resize.evocalendar.evo-' + _THIS.instanceUid, $.proxy(_THIS.resize, _THIS));

        // IF sidebarToggler: set event listener: toggleSidebar
        if(_THIS.options.sidebarToggler) {
            _THIS.$elements.sidebarToggler
            .off('click.evocalendar')
            .on('click.evocalendar', _THIS.toggleSidebar);
        }
        
        // IF eventListToggler: set event listener: toggleEventList
        if(_THIS.options.eventListToggler) {
            _THIS.$elements.eventListToggler
            .off('click.evocalendar')
            .on('click.evocalendar', _THIS.toggleEventList);
        }

        // set event listener for each month
        _THIS.$elements.sidebarEl.find('[data-month-val]')
        .off('click.evocalendar')
        .on('click.evocalendar', _THIS.selectMonth);

        // set event listener for year
        _THIS.$elements.sidebarEl.find('[data-year-val]')
        .off('click.evocalendar')
        .on('click.evocalendar', _THIS.selectYear);

        // set event listener for every event listed
        _THIS.$elements.eventEl.find('[data-event-index]')
        .off('click.evocalendar')
        .on('click.evocalendar', _THIS.selectEvent);
    };
    
    // Destroy event listeners
    EvoCalendar.prototype.destroyEventListener = function() {
        var _THIS = this;
        
        $(window).off('resize.evocalendar.evo-' + _THIS.instanceUid);
        $(window).off('click.evocalendar.evo-' + _THIS.instanceUid);
        
        // IF sidebarToggler: remove event listener: toggleSidebar
        if(_THIS.options.sidebarToggler) {
            _THIS.$elements.sidebarToggler
            .off('click.evocalendar');
        }
        
        // IF eventListToggler: remove event listener: toggleEventList
        if(_THIS.options.eventListToggler) {
            _THIS.$elements.eventListToggler
            .off('click.evocalendar');
        }

        // remove event listener for each day
        _THIS.$elements.innerEl.find('.calendar-day').children()
        .off('click.evocalendar')

        // remove event listener for each month
        _THIS.$elements.sidebarEl.find('[data-month-val]')
        .off('click.evocalendar');

        // remove event listener for year
        _THIS.$elements.sidebarEl.find('[data-year-val]')
        .off('click.evocalendar');

        // remove event listener for every event listed
        _THIS.$elements.eventEl.find('[data-event-index]')
        .off('click.evocalendar');
    };
    
    // Calculate days (incl. monthLength, startingDays based on :firstDayOfWeekName)
    EvoCalendar.prototype.calculateDays = function() {
        var _THIS = this, nameDays, weekStart, firstDay;
        _THIS.monthLength = _THIS.$label.days_in_month[_THIS.$active.month]; // find number of days in month
        if (_THIS.$active.month == 1) { // compensate for leap year - february only!
            if((_THIS.$active.year % 4 == 0 && _THIS.$active.year % 100 != 0) || _THIS.$active.year % 400 == 0){
                _THIS.monthLength = 29;
            }
        }
        nameDays = _THIS.initials.dates[_THIS.options.language].daysShort;
        weekStart = _THIS.options.firstDayOfWeek;
        
        while (_THIS.$label.days.length < nameDays.length) {
            if (weekStart == nameDays.length) {
                weekStart=0;
            }
            _THIS.$label.days.push(nameDays[weekStart]);
            weekStart++;
        }
        firstDay = new Date(_THIS.$active.year, _THIS.$active.month).getDay() - weekStart;
        _THIS.startingDay = firstDay < 0 ? (_THIS.$label.days.length + firstDay) : firstDay;
    }

    // Build the bones! (incl. sidebar, inner, events), called once in every initialization
    EvoCalendar.prototype.buildTheBones = function() {
        var _THIS = this;
        _THIS.calculateDays();
        
        if (!_THIS.$elements.calendarEl.html()) {
            var markup;
            markup = `
                <div class="calendar-sidebar">
                    <div class="calendar-year">
                        <button class="icon-button" role="button" data-year-val="prev" title="Previous year">
                            <span class="chevron-arrow-left">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008" stroke="#ffffff" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </span>
                        </button>
                        &nbsp;<p></p>&nbsp;
                        <button class="icon-button" role="button" data-year-val="next" title="Next year">
                            <span class="chevron-arrow-right">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.91003 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.91003 4.08008" stroke="#ffffff" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </span>
                        </button>
                    </div>
                    <div class="month-list">
                        <ul class="calendar-months"> `;
                            for(var i = 0; i < _THIS.$label.months.length; i++) {
                                markup += `<li class="month" role="button" data-month-val="${i}"> ${_THIS.initials.dates[_THIS.options.language].months[i]}</li>`;
                            }
            markup +=   `</ul>
                    </div>
                </div>
                <div class="calendar-inner">
                    <table class="calendar-table">
                        <tr>
                            <th colspan="7" class="current-date"></th>
                        </tr>
                        <tr class="calendar-header">`;
                        for(var i = 0; i < _THIS.$label.days.length; i++ ){
                            var headerClass = "calendar-header-day";
                            if (_THIS.$label.days[i] === _THIS.initials.weekends.sat || _THIS.$label.days[i] === _THIS.initials.weekends.sun) {
                                headerClass += ' --weekend';
                            }
                            markup += `<td class="${headerClass}">${_THIS.$label.days[i]}</td>`;
                        }
            markup +=`  </tr>
                    </table>
                </div>
                <div class="calendar-events">
                    <div class="event-header"></div>
                    <div class="event-list"></div>
                </div>
            `;

            _THIS.$elements.calendarEl.html(markup);

            if (!_THIS.$elements.sidebarEl) _THIS.$elements.sidebarEl = $(_THIS.$elements.calendarEl).find('.calendar-sidebar');
            if (!_THIS.$elements.innerEl) _THIS.$elements.innerEl = $(_THIS.$elements.calendarEl).find('.calendar-inner');
            if (!_THIS.$elements.eventEl) _THIS.$elements.eventEl = $(_THIS.$elements.calendarEl).find('.calendar-events');

            if(_THIS.options.sidebarToggler) {
                $(_THIS.$elements.sidebarEl).append(`
                    <button id="sidebarToggler" type="button" class="icon-button">
                        <svg width="17" height="17" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H21" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M3 12H21" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M3 18H21" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                `);
                if(!_THIS.$elements.sidebarToggler) {
                    _THIS.$elements.sidebarToggler = $(_THIS.$elements.sidebarEl).find('button#sidebarToggler');
                }
            }
            if(_THIS.options.eventListToggler) {
                $(_THIS.$elements.calendarEl).append(`
                    <button id="eventListToggler" type="button" class="icon-button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.91003 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.91003 4.08008" stroke="#ffffff" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                `);
                if(!_THIS.$elements.eventListToggler) {
                    _THIS.$elements.eventListToggler = $(_THIS.$elements.calendarEl).find('#eventListToggler');
                }
            }
        }

        _THIS.buildSidebarYear();
        _THIS.buildSidebarMonths();
        _THIS.buildCalendar();
        _THIS.buildEventList();
        _THIS.initEventListener();

        _THIS.resize();
    }

    // Build Event: Event list
    EvoCalendar.prototype.buildEventList = function() {
        var _THIS = this, markup, hasEventToday = false;
        
        _THIS.$active.events = [];
        // Event date
        var title = _THIS.formatDate(_THIS.$active.date, _THIS.options.eventHeaderFormat, _THIS.options.language);
        _THIS.$elements.eventEl.find('.event-header').text(title);
        // Event list
        var eventListEl = _THIS.$elements.eventEl.find('.event-list');
        // Clear event list item(s)
        if (eventListEl.children().length > 0) eventListEl.empty();
        if (_THIS.options.calendarEvents) {
            for (var i = 0; i < _THIS.options.calendarEvents.length; i++) {
                if(_THIS.isBetweenDates(_THIS.$active.date, _THIS.options.calendarEvents[i].date)) {
                    eventAdder(_THIS.options.calendarEvents[i])
                }
                else if (_THIS.options.calendarEvents[i].everyYear) {
                    var d = new Date(_THIS.$active.date).getMonth() + 1 + ' ' + new Date(_THIS.$active.date).getDate();
                    var dd = new Date(_THIS.options.calendarEvents[i].date).getMonth() + 1 + ' ' + new Date(_THIS.options.calendarEvents[i].date).getDate();
                    // var dates = [_THIS.formatDate(_THIS.options.calendarEvents[i].date[0], 'mm/dd'), _THIS.formatDate(_THIS.options.calendarEvents[i].date[1], 'mm/dd')];

                    if(d==dd) {
                        eventAdder(_THIS.options.calendarEvents[i])
                    }
                }
            };
        }
        function eventAdder(event) {
            hasEventToday = true;
            _THIS.addEventList(event)
        }
        // IF: no event for the selected date
        if(!hasEventToday) {
            markup = '<div class="event-empty">';
            if (_THIS.$active.date === _THIS.$current.date) {
                markup += `<p>${_THIS.initials.dates[_THIS.options.language].noEventForToday}</p>`;
            } else {
                markup += `<p>${_THIS.initials.dates[_THIS.options.language].noEventForThisDay}</p>`;
            }
            markup += '</div>';
        }
        eventListEl.append(markup)
    }

    // Add single event to event list
    EvoCalendar.prototype.addEventList = function(eventData) {
        var _THIS = this, markup;
        var eventListEl = _THIS.$elements.eventEl.find('.event-list');
        if (eventListEl.find('[data-event-index]').length === 0) eventListEl.empty();
        _THIS.$active.events.push(eventData);

        markup = ` 
        <div class="event-container" role="button" data-event-index="${(eventData.id)}">
            <div class="event-icon">
                <dot-icon ${eventData.color? `style="background-color:${eventData.color}"`:`class="event-bullet-${eventData.type}"`}></dot-icon>
            </div>

            <div class="event-info">
                <h1 class="event-title">${_THIS.limitTitle(eventData.name)}</h1>
                <p class="event-desc">${eventData.description ? eventData.description:''}</p>
            </div>
            ${eventData.badge ? 
                `<div class="badge-event" ${ eventData.color ? 
                    `style="border: 1px solid ${eventData.color}; color:${eventData.color}"` : 
                    `class="event-bullet-${eventData.type}"
                `}>${eventData.badge}</div>` : ``
            }
        </div>`;

        eventListEl.append(markup);

        _THIS.$elements.eventEl.find('[data-event-index="'+(eventData.id)+'"]')
        .off('click.evocalendar')
        .on('click.evocalendar', _THIS.selectEvent);
    }

    // Remove single event to event list
    EvoCalendar.prototype.removeEventList = function(eventData) {
        var _THIS = this, markup;
        var eventListEl = _THIS.$elements.eventEl.find('.event-list');
        if (eventListEl.find('[data-event-index="'+eventData+'"]').length === 0) return; // event not in active events
        eventListEl.find('[data-event-index="'+eventData+'"]').remove();
        if (eventListEl.find('[data-event-index]').length === 0) {
            eventListEl.empty();
            if (_THIS.$active.date === _THIS.$current.date) {
                markup = `<p>${_THIS.initials.dates[_THIS.options.language].noEventForToday}</p>`;
            } else {
                markup = `<p>${_THIS.initials.dates[_THIS.options.language].noEventForThisDay}</p>`;
            }
            eventListEl.append(markup)
        }
    }
    
    // Build Sidebar: Year text
    EvoCalendar.prototype.buildSidebarYear = function() {
        var _THIS = this;
        
        _THIS.$elements.sidebarEl.find('.calendar-year > p').text(_THIS.$active.year);
    }

    // Build Sidebar: Months list text
    EvoCalendar.prototype.buildSidebarMonths = function() {
        var _THIS = this;
        
        _THIS.$elements.sidebarEl.find('.calendar-months > [data-month-val]').removeClass('active-month');
        _THIS.$elements.sidebarEl.find('.calendar-months > [data-month-val="'+_THIS.$active.month+'"]').addClass('active-month');
    }

    // Build Calendar: Title, Days
    EvoCalendar.prototype.buildCalendar = function() {
        var _THIS = this, markup, title;
        
        _THIS.calculateDays();

        title = _THIS.formatDate(new Date(_THIS.$label.months[_THIS.$active.month] +' 1 '+ _THIS.$active.year), _THIS.options.titleFormat, _THIS.options.language);
        _THIS.$elements.innerEl.find('.calendar-table th').text(title);

        _THIS.$elements.innerEl.find('.calendar-body').remove(); // Clear days
        
        markup += '<tr class="calendar-body">';
                    var day = 1;
                    for (var i = 0; i < 9; i++) { // this loop is for is weeks (rows)
                        for (var j = 0; j < _THIS.$label.days.length; j++) { // this loop is for weekdays (cells)
                            if (day <= _THIS.monthLength && (i > 0 || j >= _THIS.startingDay)) {
                                var dayClass = "calendar-day";
                                if (_THIS.$label.days[j] === _THIS.initials.weekends.sat || _THIS.$label.days[j] === _THIS.initials.weekends.sun) {
                                    dayClass += ' --weekend'; // add '--weekend' to sat sun
                                }
                                markup += '<td class="'+dayClass+'">';

                                var thisDay = _THIS.formatDate(_THIS.$label.months[_THIS.$active.month]+' '+day+' '+_THIS.$active.year, _THIS.options.format);
                                markup += '<div class="day" role="button" data-date-val="'+thisDay+'">'+day+'</div>';
                                day++;
                            } else {
                                markup += '<td>';
                            }
                            markup += '</td>';
                        }
                        if (day > _THIS.monthLength) {
                            break; // stop making rows if we've run out of days
                        } else {
                            markup += '</tr><tr class="calendar-body">'; // add if not
                        }
                    }
                    markup += '</tr>';
        _THIS.$elements.innerEl.find('.calendar-table').append(markup);

        if(_THIS.options.todayHighlight) {
            _THIS.$elements.innerEl.find("[data-date-val='" + _THIS.$current.date + "']").addClass('calendar-today');
        }
        
        // set event listener for each day
        _THIS.$elements.innerEl.find('.calendar-day').children()
        .off('click.evocalendar')
        .on('click.evocalendar', _THIS.selectDate)

        var selectedDate = _THIS.$elements.innerEl.find("[data-date-val='" + _THIS.$active.date + "']");
        
        if (selectedDate) {
            // Remove active class to all
            _THIS.$elements.innerEl.children().removeClass('calendar-active');
            // Add active class to selected date
            selectedDate.addClass('calendar-active');
        }
        if(_THIS.options.calendarEvents != null) { // For event indicator (dots)
            _THIS.buildEventIndicator();
        }
    };

    // Add event indicator/s (dots)
    EvoCalendar.prototype.addEventIndicator = function(event) {
        var _ = this, htmlToAppend, thisDate;
        var eventDate = event.date;
        var type = event.type;
        // console.log(event)
        if (eventDate instanceof Array) {
            if (event.everyYear) {
                for (var x=0; x<eventDate.length; x++) {
                    eventDate[x] = _.formatDate(new Date(eventDate[x]).setFullYear(_.$active.year), _.options.format);
                }
            }
            var active_date = _.getBetweenDates(eventDate);
            
            for (var i=0; i<active_date.length; i++) {
                appendDot(active_date[i]);
            }
        } else {
            if (event.everyYear) {
                eventDate = _.formatDate(new Date(eventDate).setFullYear(_.$active.year), _.options.format);
            }
            appendDot(eventDate);
        }

        function appendDot(date) {
            thisDate = _.$elements.innerEl.find('[data-date-val="'+date+'"]');

            if (thisDate.find('span.event-indicator').length === 0) {
                thisDate.append('<span class="event-indicator"></span>');
            }

            if (thisDate.find('span.event-indicator > .type-bullet > .type-'+type).length === 0) {
                htmlToAppend = '<div class="type-bullet"><div ';
                
                if (event.color) {
                    htmlToAppend += 'style="background-color:'+event.color+'"'
                } else {
                    htmlToAppend += 'class="type-'+event.type+'"'
                }
                htmlToAppend += '</div></div>';
                thisDate.find('.event-indicator').append(htmlToAppend);
            }
        }      
    };
    
    //  Remove event indicator/s (dots)
    EvoCalendar.prototype.removeEventIndicator = function(event) {
        var _THIS = this;
        var eventDate = event.date;
        var type = event.type;

        if (eventDate instanceof Array) {
            var activeDate = _THIS.getBetweenDates(eventDate);
            
            for (var i=0; i<activeDate.length; i++) {
                removeDot(activeDate[i]);
            }
        } else {
            removeDot(eventDate);
        }

        function removeDot(date) {
            // Check if no '.event-indicator', 'cause nothing to remove
            if (_THIS.$elements.innerEl.find('[data-date-val="'+date+'"] span.event-indicator').length === 0) {
                return;
            }

            // // If has no type of event, then delete 
            if (!_THIS.hasSameDayEventType(date, type)) {
                _THIS.$elements.innerEl.find('[data-date-val="'+date+'"] span.event-indicator > .type-bullet > .type-'+type).parent().remove();
            }
        }
    };
    
    /****************
    *    METHODS    *
    ****************/

    // Build event indicator on each date
    EvoCalendar.prototype.buildEventIndicator = function() {
        var _THIS = this;
        
        // prevent duplication
        _THIS.$elements.innerEl.find('.calendar-day > day > .event-indicator').empty();
        
        for (var i = 0; i < _THIS.options.calendarEvents.length; i++) {
            _THIS.addEventIndicator(_THIS.options.calendarEvents[i]);
        }
    };

    //  Select event
    EvoCalendar.prototype.selectEvent = function(event) {
        var _THIS = this;
        var el = $(event.target).closest('.event-container');
        var id = $(el).data('eventIndex');
        var index = _THIS.options.calendarEvents.map(function (event) { return event.id }).indexOf(id);
        var modifiedEvent = _THIS.options.calendarEvents[index];
        if (modifiedEvent.date instanceof Array) {
            modifiedEvent.dates_range = _THIS.getBetweenDates(modifiedEvent.date);
        }
        // console.log(modifiedEvent)
        $(_THIS.$elements.calendarEl).trigger("selectEvent", [_THIS.options.calendarEvents[index]])
    }

    //  Select year
    EvoCalendar.prototype.selectYear = function(event) {
        var _THIS = this;
        var el, yearVal;
        var windowW = $(window).width();
        var hasSidebar = !_THIS.$elements.calendarEl.hasClass('sidebar-hide');

        if (typeof event === 'string' || typeof event === 'number') {
            if ((parseInt(event)).toString().length === 4) {
                yearVal = parseInt(event);
            }
        } else {
            el = $(event.target).closest('[data-year-val]');
            yearVal = $(el).data('yearVal');
        }

        if(yearVal == "prev") {
            --_THIS.$active.year;
        } else if (yearVal == "next") {
            ++_THIS.$active.year;
        } else if (typeof yearVal === 'number') {
            _THIS.$active.year = yearVal;
        }
        
        if (windowW <= _THIS.$breakpoints.mobile) {
            if(hasSidebar) _THIS.toggleSidebar(false);
        }

        _THIS.buildSidebarYear();
        _THIS.buildCalendar();
    };

    // Select month
    EvoCalendar.prototype.selectMonth = function(event) {
        var _THIS = this;
        var windowW = $(window).width();
        var hasSidebar = !_THIS.$elements.calendarEl.hasClass('sidebar-hide');
        
        if (typeof event === 'string' || typeof event === 'number') {
            if (event >= 0 && event <=_THIS.$label.months.length) {
                // if: 0-11
                _THIS.$active.month = (event).toString();
            }
        } else {
            // if month is manually selected
            _THIS.$active.month = $(event.currentTarget).data('monthVal');
        }

        if (windowW <= _THIS.$breakpoints.tablet) {
            if(hasSidebar) _THIS.toggleSidebar(false);
        }
        
        _THIS.buildSidebarMonths();
        _THIS.buildCalendar();
        // EVENT FIRED: selectMonth
        $(_THIS.$elements.calendarEl).trigger("selectMonth", [_THIS.initials.dates[_THIS.options.language].months[_THIS.$active.month], _THIS.$active.month])
    };

    // Select specific date
    EvoCalendar.prototype.selectDate = function(event) {
        var _THIS = this;
        var oldDate = _THIS.$active.date;
        var date, year, month, activeDayEl, isSameDate;

        if (typeof event === 'string' || typeof event === 'number' || event instanceof Date) {
            date = _THIS.formatDate(new Date(event), _THIS.options.format)
            year = new Date(date).getFullYear();
            month = new Date(date).getMonth();
            
            if (_THIS.$active.year !== year) _THIS.selectYear(year);
            if (_THIS.$active.month !== month) _THIS.selectMonth(month);
            activeDayEl = _THIS.$elements.innerEl.find("[data-date-val='" + date + "']");
        } else {
            activeDayEl = $(event.currentTarget);
            date = activeDayEl.data('dateVal')
        }
        isSameDate = _THIS.$active.date === date;
        // Set new active date
        _THIS.$active.date = date;
        _THIS.$active.event_THISdate = date;
        // Remove active class to all
        _THIS.$elements.innerEl.find('[data-date-val]').removeClass('calendar-active');
        // Add active class to selected date
        activeDayEl.addClass('calendar-active');
        // Build event list if not the same date events built
        if (!isSameDate) _THIS.buildEventList();
        // EVENT FIRED: selectDate
        $(_THIS.$elements.calendarEl).trigger("selectDate", [_THIS.$active.date, oldDate])
    };
    
    // Return active date
    EvoCalendar.prototype.getActiveDate = function() {
        var _THIS = this;
        return _THIS.$active.date;
    }
    
    // Return active events
    EvoCalendar.prototype.getActiveEvents = function() {
        var _THIS = this;
        return _THIS.$active.events;
    }

    // Hide Sidebar/Event List if clicked outside
    EvoCalendar.prototype.toggleOutside = function(event) {
        var _THIS = this, hasSidebar, hasEvent, isInnerClicked;

        hasSidebar = !_THIS.$elements.calendarEl.hasClass('sidebar-hide');
        hasEvent = !_THIS.$elements.calendarEl.hasClass('event-hide');
        isInnerClicked = event.target === _THIS.$elements.innerEl[0];

        if (hasSidebar && isInnerClicked) _THIS.toggleSidebar(false);
        if (hasEvent && isInnerClicked) _THIS.toggleEventList(false);
    }

    // Toggle Sidebar
    EvoCalendar.prototype.toggleSidebar = function(event) {
        var _THIS = this, hasSidebar, hasEvent, windowW;
        windowW = $(window).width();

        if (event === undefined || event.originalEvent) {
            $(_THIS.$elements.calendarEl).toggleClass('sidebar-hide');
        } else {
            if(event) {
                $(_THIS.$elements.calendarEl).removeClass('sidebar-hide');
            } else {
                $(_THIS.$elements.calendarEl).addClass('sidebar-hide');
            }
        }

        if (windowW <= _THIS.$breakpoints.tablet && windowW > _THIS.$breakpoints.mobile) {
            hasSidebar = !_THIS.$elements.calendarEl.hasClass('sidebar-hide');
            hasEvent = !_THIS.$elements.calendarEl.hasClass('event-hide');
            if (hasSidebar && hasEvent) _THIS.toggleEventList();
        }
    };

    // Toggle Event list
    EvoCalendar.prototype.toggleEventList = function(event) {
        var _THIS = this, hasSidebar, hasEvent, windowW;
        windowW = $(window).width();

        if (event === undefined || event.originalEvent) {
            $(_THIS.$elements.calendarEl).toggleClass('event-hide');
        } else {
            if(event) {
                $(_THIS.$elements.calendarEl).removeClass('event-hide');
            } else {
                $(_THIS.$elements.calendarEl).addClass('event-hide');
            }
        }

        if (windowW <= _THIS.$breakpoints.tablet && windowW > _THIS.$breakpoints.mobile) {
            hasEvent = !_THIS.$elements.calendarEl.hasClass('event-hide');
            hasSidebar = !_THIS.$elements.calendarEl.hasClass('sidebar-hide');
            if (hasEvent && hasSidebar) _THIS.toggleSidebar();
        }
    };

    //  Add Calendar Event(s)
    EvoCalendar.prototype.addCalendarEvent = function(arr) {
        var _THIS = this;

        function addEvent(data) {
            if(!data.id) {
                console.log("%c Event named: \""+data.name+"\" doesn't have a unique ID ", "color:white;font-weight:bold;background-color:#e21d1d;");
            }

            if (data.date instanceof Array) {
                for (var j=0; j < data.date.length; j++) {
                    if(isDateValid(data.date[j])) {
                        data.date[j] = _THIS.formatDate(new Date(data.date[j]), _THIS.options.format);
                    }
                }
            } else {
                if(isDateValid(data.date)) {
                    data.date = _THIS.formatDate(new Date(data.date), _THIS.options.format);
                }
            }
            
            if (!_THIS.options.calendarEvents) _THIS.options.calendarEvents = [];
            _THIS.options.calendarEvents.push(data);
            // add to date's indicator
            _THIS.addEventIndicator(data);
            
            if (_THIS.$active.event_date === data.date) _THIS.addEventList(data);
            // _THIS.$elements.innerEl.find("[data-date-val='" + data.date + "']")

            function isDateValid(date) {
                if(_THIS.isValidDate(date)) {
                    return true;
                } else {
                    console.log("%c Event named: \""+data.name+"\" has invalid date ", "color:white;font-weight:bold;background-color:#e21d1d;");
                }
                return false;
            }
        }
        if (arr instanceof Array) { // Arrays of events
            for(var i=0; i < arr.length; i++) {
                addEvent(arr[i])
            }
        } else if (typeof arr === 'object') { // Single event
            addEvent(arr)
        }
    };

    // Remove Calendar Event(s)
    EvoCalendar.prototype.removeCalendarEvent = function(arr) {
        var _THIS = this;

        function deleteEvent(data) {
            // Array index
            var index = _THIS.options.calendarEvents.map(function (event) { return event.id }).indexOf(data);
            
            if (index >= 0) {
                var event = _THIS.options.calendarEvents[index];
                // Remove event from calendar events
                _THIS.options.calendarEvents.splice(index, 1);
                // remove to event list
                _THIS.removeEventList(data);
                // remove event indicator
                _THIS.removeEventIndicator(event);
            } else {
                console.log("%c "+data+": ID not found ", "color:white;font-weight:bold;background-color:#e21d1d;");
            }
        }
        if (arr instanceof Array) { // Arrays of index
            for(var i=0; i < arr.length; i++) {
                deleteEvent(arr[i])
            }
        } else { // Single index
            deleteEvent(arr)
        }
    };

    // Check if date is valid
    EvoCalendar.prototype.isValidDate = function(d){
        return new Date(d) && !isNaN(new Date(d).getTime());
    }

    $.fn.evoCalendar = function() {
        var _THIS = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _THIS.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _THIS[i].evoCalendar = new EvoCalendar(_THIS[i], opt);
            else
                ret = _THIS[i].evoCalendar[opt].apply(_THIS[i].evoCalendar, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _THIS;
    };

}));