$(document).ready(function () {
    //live only
    if ($("body .header").hasClass("useFixed")) {
        $("body").addClass("headerFixed");
    }

    initHeader9();

    $(".header .header9 .header9-close-btn").click(function () {
        $(".header .header9").hide();
        $("body.live").addClass("header9_closed");
        setCookie("header9_closed", 1, 1);
        realignHeader9();
    });
    if ($(".header").hasClass("useFixed")) {
        qv_on_scroll("init"); //scrolled page load시 init();

        var agent = navigator.userAgent.toLowerCase();
        if ((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
            $('body').scroll(function () { qv_on_scroll_ie(); });
        }
        else {
            window.onscroll = function () { qv_on_scroll(); };
        }

        //window.onscroll = function(){qv_on_scroll()};
    }

    // column 내 whitespace가 들어가있는 항목 정리
    $.each($('.column'), function () {
        if ($(this).html().trim() == '') { $(this).html(''); }
    });

    var login_require = "";
    if (login_require == 1) {
        $('#LoginModal').modal('show');
        $('#LoginModal .modal-header').append($('<div class="modal-header-title-sub">' + lang.requires_login + '</div>'));
    }

    removeSiteCopiedElement();

    initMobileHeader();
    initFixedContents();
    initMenu();
    initTabFrame();
    initSliderCallback();
    initSlider();
    initFullPageSlider();
    initSnSIconImage();
    initPolicyPrivacyModal();
    initJoinModal();
    initPageFadeEvent();
    initCalendar();
    initLnb();

    initNonScaledImageBox();

    initHeaderSideNav();
    initMobileHeaderMenu();

    initRss();

    initMouseoverObjects();
    initLanguageSelector();

    initDatabaseContents();

    initGrid();
    initFrameLink();
    initDday();
    initCountDown();
    initNotionContents();

});

$(window).bind("load", function () {
    initIframe();
});

function initNotionContents() {
    $('.iframe-notion-guide').remove()
}

function initDday(target) {
    // 2021.12.17(금) (정빈) D-day 기능
    const today = new Date()
    const todayTimeStamp = today.getTime()
    const ddayTarget = target ? target : $('#main_container .ddayBox')

    ddayTarget.each(function () {
        const ddayBox = $(this);
        const ddayArea = ddayBox.find('.dday-area')
        const userDdayTimeStamp = ddayArea.attr('data-dday')
        const ddayDistance = userDdayTimeStamp - todayTimeStamp
        const getDday = Math.floor(ddayDistance / (1000 * 60 * 60 * 24)) + 1

        if (isNaN(getDday)) {
            ddayArea.find('.dday-area-variable').text('-Day')
        } else {
            const ddayView = getDday >= 0 ? '-' + getDday : '+' + Math.abs(getDday)
            ddayArea.find('.dday-area-variable').text(ddayView)
        }
    })


}

function ddayGetDate(date) {
    const distance = new Date(date).getTime() - new Date().getTime()
    let dateObj = {}
    if (distance <= 0 || isNaN(distance)) {
        dateObj.setDays = '00'
        dateObj.setHours = '00'
        dateObj.setMinutes = '00'
        dateObj.setSeconds = '00'
    } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) - 9
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        dateObj.setDays = days > 9 ? days : '0' + days
        dateObj.setHours = hours > 9 ? hours : '0' + hours
        dateObj.setMinutes = minutes > 9 ? minutes : '0' + minutes
        dateObj.setSeconds = seconds > 9 ? seconds : '0' + seconds
    }
    return dateObj
}

// 글로벌 setInterval 관리
let countdownInterval = null
function initCountDown() {
    let isCountDownExist = false

    function ddayCountDown() {
        $('#main_container .ddayBox .view').each(function () {
            if ($(this).find('.dday-area-countdown').css('display') === 'block') {
                const vBox = $(this)
                const getDate = Number(vBox.find('.dday-area').attr('data-dday'))
                const setDays = ddayGetDate(getDate).setDays
                const setHours = ddayGetDate(getDate).setHours
                const setMinutes = ddayGetDate(getDate).setMinutes
                const setSeconds = ddayGetDate(getDate).setSeconds

                vBox.find('.dday-area').find('.days-value').text(setDays)
                vBox.find('.dday-area').find('.hours-value').text(setHours)
                vBox.find('.dday-area').find('.minutes-value').text(setMinutes)
                vBox.find('.dday-area').find('.seconds-value').text(setSeconds)
            }
        })
    }

    $('#main_container .ddayBox .view').each(function () {
        if ($(this).find('.dday-area-countdown').css('display') === 'block') {
            ddayCountDown()
            isCountDownExist = true
            return false
        }
    })

    if (isCountDownExist) {
        clearInterval(countdownInterval)
        countdownInterval = setInterval(ddayCountDown, 1000)
    }
}


function initFrameLink(target) {
    if (!target) {
        target = $('.frm, .box');
    }

    target.each(function () {
        const area = $(this);
        const href = area.attr('href');
        if (href) {
            let targetAttr = '';
            const target = area.attr('target');
            if (target && target !== '') {
                targetAttr = 'target="' + target + '"';
            }

            area.append('<a class="link-wrapper" href="' + href + '" ' + targetAttr + '></a>')
        }
    });
}

function initHeaderSearch() {
    /* 2021.11.01
     * 게시판 통합검색(헤더)
     */
    /* Search button */
    $('#main_container').delegate('.header-search-bar-button', 'click', function () {
        headerSearchAllBoard();
    });
    /* Search bar keyup */
    $('#main_container').delegate('#header-search-bar', 'keyup', function (event) {
        if (event.keyCode == 13) {
            headerSearchAllBoard();
        }
    });

    /* Search Icon */
    $('#main_container').delegate('.header-search-icon-button', 'click', function () {
        $('#main_container').append(
            '<div class="header-search-dialog">' +
            '<div class="header-search-dialog-close"></div>' +
            '<div class="header-search-dialog-body">' +
            '<div>' +
            '<input type="text" id="header-search-bar" placeholder="검색어를 입력해주세요."/>' +
            '<i class="fa fa-search header-search-bar-button"></i>' +
            '</div>' +
            '</div>' +
            '</div>'
        );
    });
    $('#main_container').delegate('.header-search-dialog-close', 'click', function () {
        $('.header-search-dialog').remove();
    })
}

function headerSearchAllBoard(page) {
    const targetPage = page ? page : 1;
    const keyword = $('#header-search-bar').val();
    if (keyword) {
        window.location = '/module/board/search.html?keyword=' + keyword + '&page=' + targetPage
    } else {
        alert('검색어를 입력해주세요.');
    }
}

function initGrid(target) {
    const gridBoxes = target ? target : $('.gridBox');
    if (gridBoxes.length > 0) {
        function setGridHeaderHeight(target, height) {
            const gridOption = target.data('gridOption');
            if (gridOption) {
                gridOption.api.setHeaderHeight(parseInt(height));
            }
        }

        function setGridRowHeight(target, height) {
            const gridOption = target.data('gridOption');
            if (gridOption) {
                gridOption.api.forEachNode(function (rowNode) {
                    rowNode.setRowHeight(parseInt(height));
                });
                gridOption.api.onRowHeightChanged();
            }
        }

        $.getScript('/js/xlsx/ag-grid.js', function () {
            gridBoxes.each(function () {
                const gridBox = $(this);
                const columnDefs = gridBox.attr('columnDefs');
                const rowData = gridBox.attr('rowData');
                if (columnDefs && rowData) {
                    gridBox.find('.grid-area').children().remove();

                    const _columnDefs = JSON.parse(columnDefs).map(function (r, i) {
                        r.lockPosition = true;
                        delete r.rowDrag;
                        return r;
                    });
                    const _gridOption = {
                        columnDefs: _columnDefs,
                        defaultColDef: {
                            minWidth: 110,
                            editable: false,
                            resizable: false,
                        },
                        domLayout: 'autoHeight',
                        cellStyle: { 'white-space': 'normal' },
                        rowData: JSON.parse(rowData),
                        animateRows: true,
                        scrollbarWidth: 4,
                    };

                    const gridElement = gridBox.find('.grid-area')[0];
                    new agGrid.Grid(gridElement, _gridOption);

                    gridBox.data('gridOption', _gridOption);

                    const gridHeightHeader = gridBox.attr('headerHeight');
                    if (gridHeightHeader) {
                        setGridHeaderHeight(gridBox, gridHeightHeader);
                    }

                    const gridRowHeight = gridBox.attr('rowHeight');
                    if (gridRowHeight) {
                        setGridRowHeight(gridBox, gridRowHeight);
                    }

                    gridBox.find('.grid-area').show();
                }
            })
        })
    }
}

function initIframe(elements) {
    $('.iframeBox').remove();
}

function initDatabaseContents() {
    if ($('.databaseContentsBox').length > 0) {
        let DATABASE_CONTENTS = {};
        $.each($('.databaseContentsBox'), function () {
            const area = $(this).find('.dbc-area');
            const id = area.attr('data-id');
            const count = area.attr('data-count');
            const paging = area.attr('data-paging');
            const matrix = area.children('.dbc-item:first-of-type').clone();

            qvjax_direct(
                "select_database_contents",
                "/module/dbc/databaseContents.php",
                '&cid=' + id,
                function (data) {
                    if (data.length > 0) {
                        // const column_defs = JSON.parse(data[0].column_defs);
                        const row_data = JSON.parse(data[0].row_data.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t"));
                        const size = Math.ceil(row_data.length / count);
                        DATABASE_CONTENTS[id] = {
                            data: row_data,
                            size: size,
                        };

                        // let pagingHtml = '<div class="dbc-paging">';
                        for (let i = 1; i <= size; i++) {
                            // pagingHtml += '<span data-id="' + id + '" data-page="' + i + '" class="' + (i == 1 ? 'active' : '') + '">' + i + '</span>';
                            DATABASE_CONTENTS[id][i] = DATABASE_CONTENTS[id]['data'].slice(count * (i - 1), count * i);
                        }
                        // pagingHtml += '</div>';
                        if (paging == 1) {
                            // area.after(pagingHtml);
                            area.after('<div class="pager"><ol class="paging-btn-group"></ol></div>');
                            buildDatabaseContentsPagingHtml(DATABASE_CONTENTS[id], area, 1);
                        }


                        pagingDatabaseContents(DATABASE_CONTENTS[id][1], matrix, area);
                    }

                    area.show();
                },
                function (xhr) { }
            );
        });

        $('.databaseContentsBox').delegate('.pager li', 'click', function () {
            const area = $(this).parents('.databaseContentsBox').find('.dbc-area');
            const matrix = area.children('.dbc-item:first-of-type').clone();
            const id = area.attr('data-id');
            const page = $(this).attr('value');
            const databaseContents = DATABASE_CONTENTS[id];

            if (databaseContents) {
                buildDatabaseContentsPagingHtml(databaseContents, area, page);
                pagingDatabaseContents(databaseContents[page], matrix, area);

                if (isMobile()) {
                    const scrollY = area.offsetTop();
                    $("html, body").animate({ scrollTop: scrollY - 50 }, 500);
                }
            }
        });

        function buildDatabaseContentsPagingHtml(databaseContents, area, page) {
            var page = parseInt(page);
            var size = databaseContents.size;
            var pagingStart;
            var pagingEnd;
            var html = '';

            if (page - 2 <= 0) {
                pagingStart = 1;
                pagingEnd = Math.ceil(size) >= pagingStart + 4 ? 5 : Math.ceil(size);
            }
            else if (page + 2 >= Math.ceil(size)) {
                pagingStart = Math.ceil(size) - 4 <= 0 ? 1 : Math.ceil(size) - 4;
                pagingEnd = Math.ceil(size);
            }
            else {
                pagingStart = page - 2;
                pagingEnd = page + 2;
            }
            html += '<li class="paging-btn-group__item left" value="1">';
            html += '<i class="i-chevron-left"></i>';
            html += '</li>';
            for (var i = pagingStart; i <= pagingEnd; i++) {
                var buttonClassName = i == page ? 'btn btn--basic active' : 'btn btn--basic';
                html += '<li class="paging-btn-group__item" value="' + i + '">';
                html += '<button class="' + buttonClassName + '"><span>' + i;
                html += '</span></button></li>';
            }
            html += '<li class="paging-btn-group__item right" value="' + size + '">';
            html += '<i class="i-chevron-right"></i>';
            html += '</li>';

            area.next('.pager').find('.paging-btn-group').children('.paging-btn-group__item').remove();
            area.next('.pager').find('.paging-btn-group').append(html);
        }

        function pagingDatabaseContents(data, matrix, area) {
            const $frag = $(document.createDocumentFragment());
            area.children('.dbc-item').remove();
            $.each(data, function () {
                const clone = matrix.clone();
                const rowData = this;
                $.each(clone.find('.dbc-contents-item'), function () {
                    const connect = $(this).attr('data-connect');
                    const type = $(this).attr('data-type');

                    switch (type) {
                        case '1':
                        case '3':
                            $(this).find('p:last-of-type').text(rowData[connect]);
                            break;
                        case '2':
                            $(this).find('img').attr('src', rowData[connect]);
                            break;
                    }
                });
                clone.find('style').remove();
                clone.attr('data-id', this.id);
                $frag.append(clone);
            });
            area.append($frag);
        }


        $('body').delegate('.databaseContentsBox .dbc-area[data-detail="1"] .dbc-item', 'click', function () {
            const page = $(this).parents('.dbc-area').first().attr('data-id');
            const id = $(this).attr('data-id');

            if (page && id) {
                location = '/' + page + '?id=' + id;
            } else {
                alert('데이터 컨텐츠 설정 오류', page, id);
            }
        });
    }
}

function initLanguageSelector() {
    if ($('.header .languageSelectorBox').length > 0) {
        var LANGUAGE_CODE = { 'ko': '한국어', 'en': 'English', 'zh-chs': '中文(简体)', 'zh-cht': '中文(繁體)', 'ja': '日本語' };

        $('body').delegate('.language-selector.language-type-3', 'click', function () {
            if ($(this).find('.language-dropdown').length > 0) {
                $(this).find('.language-dropdown').remove();
            }
            else {
                var html = '<div class="language-dropdown">';
                $.each($(this).find('.language-selector-flag'), function () {
                    var lang = $(this).attr('data-lang');
                    var href = $(this).children('a').attr('href');
                    var target = $(this).children('a').attr('target') ? $(this).children('a').attr('target') : '_self';
                    html += '<div class="language-dropdown-item"><a href="' + href + '" target="' + target + '">' + LANGUAGE_CODE[lang] + '</a></div>';
                });
                html += '</div>';
            }
            $(this).append(html);

            // 2020.12.04 높이 지정 불필요함
            // var top = $(this).position().top + 40;
            // $('.language-dropdown').css('top', top);
        });
    }
}

function initMouseoverObjects() {

    function resizeMouseoverFrame(mouseoverFrame) {
        var before = mouseoverFrame.find('.mouseover-before').first();
        var after = mouseoverFrame.find('.mouseover-after').first();
        var mouseover_height = before.height() > after.height() ? before.height() : after.height();
        if (mouseover_height == 0) {
            var data_height = mouseoverFrame.attr('data-hei') ? parseInt(mouseoverFrame.attr('data-hei')) : 0;
            data_height = data_height == 0 ? mouseoverFrame.find('.imgBox:first').height() : data_height;
            mouseover_height = data_height;
        }

        if (mouseoverFrame.height() < mouseover_height) {
            var tb = mouseoverFrame.children('.view').children('.tb');
            // tb.height(mouseover_height);
            if (tb.length > 0) {
                tb.get(0).style.setProperty('height', mouseover_height + 'px', 'important');
            }
        }
    }

    $(window).bind("load", function () {
        // tb의 높이보다 하위 컨텐츠의 높이가 더 클 경우 tb의 높이를 맞춰준다.
        // mouseover 객체들이 absolute로 전환되기 때문에 높이를 수동으로 지정해주지 않으면 컨텐츠들이 겹치게 됨
        $.each($('#main_container .mouseover-frm'), function () {
            const mouseoverFrame = $(this);
            mouseoverFrame.find('.box').each(function (i, val) {
                $(val).addClass('displayed');
            });

            // mouseover frame 내 이미지를 모두 호출한 뒤 위치를 다시 잡아준다
            let loadCompleteCount = 0;
            const imageCore = $(this).find('.img-core');
            const imageCount = imageCore.length;
            if (imageCount === 0) {
                resizeMouseoverFrame(mouseoverFrame);
            } else {
                imageCore.each(function () {
                    const img = new Image();
                    const bg = $(this).css('background-image');
                    if (bg.indexOf('url(') === 0) {
                        img.src = bg.replace('url(', '').replace(')', '').replace(/\"/gi, "");
                        $(img).one('load', function () {
                            loadCompleteCount++;
                            if (loadCompleteCount === imageCount) {
                                resizeMouseoverFrame(mouseoverFrame);
                            }
                        })
                    } else {
                        loadCompleteCount++;
                        if (loadCompleteCount === imageCount) {
                            resizeMouseoverFrame(mouseoverFrame);
                        }
                    }
                })
            }
        });

        // 이미지 박스 전용 mouseover
        // 향후 실제 사용여부는 확인필요
        $.each($('#main_container .imgBox'), function () {
            var mouseover_image = $(this).find('.img-core').attr('data-mouseover-image');
            if (mouseover_image) {
                var image = $(this).find('.img-core');
                var dummy = $(this).find('.img-core-dummy');
                image.attr('data-default-image', image.css('background-image'));

                $(this).on('mouseenter', function () {
                    console.log('imgBox mouse enter');
                    image.css('background-image', image.attr('data-mouseover-image'));
                    dummy.attr('src', image.attr('data-mouseover-image').replace('url(', '').replace(')', '').replace(/\"/gi, ""))
                });

                $(this).on('mouseleave', function () {
                    console.log('imgBox mouse leave');
                    image.css('background-image', image.attr('data-default-image'));
                    dummy.attr('src', image.attr('data-default-image').replace('url(', '').replace(')', '').replace(/\"/gi, ""))
                });
            }
        });
    });
}

function initMobileFooterFixedContents() {
    if (isMobile() && $('.footer-fixed-contents').length > 0) {
        $(window).bind("load", function () {
            // fixed 크기만큼 페이지 최하단에 공백넣음
            var footer_fixed = $('.footer-fixed-contents');
            var empty_div = '<div style="height:' + footer_fixed.height() + 'px;"></div>';
            $('.footer-frame-mobile').after($(empty_div));
        });
    }
}

function initHeaderOverflowMenuResizeEvent() {
    var column;
    $.each($('#main_container .header .al-box'), function () {
        if ($(this).children('ul.mn-ul').length > 0 &&
            $(this).find('.mn-item').length > 0) {
            column = $(this);
        }
    });
    if (column) {
        headerOverflowMenuInit(column);
    }

    $(window).resize(function () {
        if (this.resizeTO) clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function () {
            $(this).trigger('resizeEnd');
        }, 100);
    });
    $(window).bind('resizeEnd', function () {
        if (column) {
            headerOverflowMenuInit(column);
        }
    });
}

function headerOverflowMenuInit(column) {
    if (column.children('ul.mn-ul').length == 0) { return; }

    var column_width = 0;
    var box_width = 0;
    var overflow_menu = [];

    var container = column.parents('#main_container');
    var menu = column.children('ul.mn-ul');
    var header_contents = column.parents('.header-contents').first();
    var header = header_contents.parent();
    var header_width = column.parent().css('width');
    if (header_width.indexOf('%') > -1) {
        // %로 리턴됨 -> px 값 계산해서 처리 (IE에서 가끔 %로 넘어옴)
        header_width = $(window).width() * parseInt(header_width) / 100;
    }
    else {
        // px로 리턴 -> 그대로 처리
        header_width = parseInt(header_width);
    }

    $.each(column.children('div.box'), function () {
        box_width += $(this).width();
        box_width += parseInt($(this).css('padding-left'))
        box_width += parseInt($(this).css('padding-right'))
    });
    column_width += box_width;

    container.find('.mn-item').removeClass('mn-item-overflow');
    $.each(menu.children('.mn-item').not('.mn-item-overflow-list'), function () {
        column_width += $(this).width();

        if (header_width < column_width + 110) {
            $(this).addClass('mn-item-overflow');
            overflow_menu.push($(this));
        }
    });

    if (overflow_menu.length > 0) {
        if (menu.find('headerstart').length == 0) { menu.prepend('<headerstart></headerstart>'); }
        if (menu.find('headerend').length == 0) { menu.append('<headerend></headerend>'); }

        if (menu.find('.mn-item-overflow-list').length == 0) {
            var html = '<li class="mn-item mn-item-overflow-list"> <a class="mn-link"><i class="icon-options" aria-hidden="true"></i></a> <div class="header-overflow-pop"><ul></ul></div></li>';
            menu.find('headerend').before($(html));
        }

        container.find('.header-overflow-pop ul li').remove();
        $.each(overflow_menu, function () {
            var clone = $(this).clone();
            menu.find('.header-overflow-pop ul').append(clone);
        });
    }
    else {
        container.find('.mn-item-overflow-list').remove();
    }
}


function initMobileHeaderMenu() {
    if ((isMobile() && window.innerWidth <= 767) && $('.header').length > 0) {
        // menu touch
        if ($('.header-mobile .column > ul.mn-ul').length > 0) {
            // 현재 활성화된 페이지의 메뉴 위치 잡기
            $(window).bind("load", function () {

                // 서브메뉴 추가
                if ($('.header-mobile .column > ul.mn-ul').data('sub')) {
                    if ($('.header-mobile .column > ul.mn-ul .mn-item.cur-mn-item > ul.sub-mn > li.mn-item').length > 0) { // 메인 메뉴 중에 cur-mn-item이 존재할 경우
                        var sub_mn = $('.header-mobile .column > ul.mn-ul .mn-item.cur-mn-item > ul.sub-mn');
                    }
                    else if ($('.header-mobile .column > ul.mn-ul .mn-item > ul.sub-mn > li.mn-item.cur-mn-item').length > 0) { // 서브 메뉴 중에 cur-mn-item이 존재할 경우
                        var sub_mn = $('.header-mobile .column > ul.mn-ul .mn-item > ul.sub-mn > li.mn-item.cur-mn-item').parent();
                    }
                    if (sub_mn) {
                        var header_contents = sub_mn.parents('.header-contents');
                        var sub_html = '<div class="col-xs-12 header-mobile-sub-menu" style="' +
                            'padding: 0 10px;' +
                            'margin-top: ' + header_contents.css('border-bottom-width') + ';' +
                            'border-bottom: ' + header_contents.css('border-bottom') + ';' +
                            '">' +
                            '<div class="al-box column al-l">' +
                            '<ul class="mn-ul tc box hsync" style="display: table-cell; transform: translate3d(0px, 0px, 0px); height: ' + $(header_contents).height() + 'px;">' +
                            '<div class="preview"></div>' +
                            '<headerstart></headerstart>' +
                            sub_mn.html() +
                            '<headerend></headerend>' +
                            '</ul>' +
                            '</div>' +
                            '</div>';
                        sub_html = $(sub_html).css('background', header_contents.css('background'));
                        sub_html = $(sub_html).css('border-bottom', header_contents.css('border-bottom'));
                        header_contents.append($(sub_html));

                        var header_cur = header_contents.parent();
                        var header_next = header_cur.next('div');
                        $.each(header_next, function () {
                            var top = 0;
                            $.each($(this).prev('div'), function () {
                                top += $(this).find('.header-contents').height();
                                top += $(this).find('.header-contents > div:last-child').height();
                            });
                            $(this).attr('data-top', top);
                            $(this).css('top', top);
                        });
                    }
                }

                if ($('.header-mobile .column > ul.mn-ul .mn-item.cur-mn-item').length > 0) {
                    var cur = $('.header-mobile .column > ul.mn-ul .mn-item.cur-mn-item').last();
                    var ul = cur.parents('ul.mn-ul').first();
                    var pos = cur[0].offsetLeft * -1;
                    var width = ul.parents('.column').parent().width();
                    var max = (ul.width() - width) * -1;
                    pos = pos < 0 ? pos : 0;
                    max = max < 0 ? max : 0;
                    pos = pos <= max ? max : pos;
                    ul.css('transform', 'translate3d(' + pos + 'px, 0, 0)');
                    ul.data('pos', pos);
                }

                var startPoint;
                $('#main_container').delegate('.header-mobile .column > ul.mn-ul', "touchstart", function (e) {
                    startPoint = e.originalEvent.touches[0].screenX;

                    var pos = parseInt($(this).data('pos'));
                    if (!pos) {
                        $(this).data('pos', 0);
                    }
                });
                $('#main_container').delegate('.header-mobile .column > ul.mn-ul', "touchmove", function (e) {
                    var event = e.originalEvent;
                    var x = event.touches[0].screenX;
                    var diff = x - startPoint;
                    var width = $(e.currentTarget).parents('.column').parent().width();
                    var max = ($(this).width() - width) * -1;

                    var pos = parseInt($(this).data('pos'));
                    pos += diff;
                    pos = pos < 0 ? pos : 0;
                    max = max < 0 ? max : 0;
                    pos = pos <= max ? max : pos;
                    $(this).css('transform', 'translate3d(' + pos + 'px, 0, 0)');
                });
                $('#main_container').delegate('.header-mobile .column > ul.mn-ul', "touchend", function () {
                    if ($(this).css('transform').indexOf('matrix') > -1) {
                        $(this).data('pos', $(this).css('transform').split(',')[4].trim());
                    }
                });
            });

            // 카테고리 항목 클릭 시 하위 페이지가 있으면
            // 해당 페이지 목록(header-mobile-sub-menu)을 동적으로 만들어준다
            $('#main_container').delegate('.header-mobile .al-box > .mn-ul > .mn-item > .mn-link:not([href])', 'click', function () {
                if ($('.header-mobile .column > ul.mn-ul').data('sub')) {
                    var sub_mn = $(this).siblings('ul.sub-mn');
                    if (sub_mn) {
                        $('.header-mobile-sub-menu').remove();

                        var header_contents = sub_mn.parents('.header-contents');
                        var sub_html = '<div class="col-xs-12 header-mobile-sub-menu" style="' +
                            'padding: 0 10px;' +
                            'margin-top: ' + header_contents.css('border-bottom-width') + ';' +
                            'border-bottom: ' + header_contents.css('border-bottom') + ';' +
                            '">' +
                            '<div class="al-box column al-l">' +
                            '<ul class="mn-ul tc box hsync" style="display: table-cell; transform: translate3d(0px, 0px, 0px); height: ' + $(header_contents).height() + 'px;">' +
                            '<div class="preview"></div>' +
                            '<headerstart></headerstart>' +
                            sub_mn.html() +
                            '<headerend></headerend>' +
                            '</ul>' +
                            '</div>' +
                            '</div>';
                        sub_html = $(sub_html).css('background', header_contents.css('background'));
                        sub_html = $(sub_html).css('border-bottom', header_contents.css('border-bottom'));
                        header_contents.append($(sub_html));

                        var header_cur = header_contents.parent();
                        var header_next = header_cur.next('div');
                        $.each(header_next, function () {
                            var top = 0;
                            $.each($(this).prev('div'), function () {
                                top += $(this).find('.header-contents').height();
                                top += $(this).find('.header-contents > div:last-child').height();
                            });
                            $(this).attr('data-top', top);
                            $(this).css('top', top);
                        });
                    }
                }
            });
        }

        // section merge
        // var section_merge = $('.header-mobile > .header1').data('section-merge');
        // if (section_merge == false || location.pathname.indexOf('/module/board') > -1) { // merge = false 거나 게시글 쓰기/읽기 에서는 헤더영역 확보
        //     var height = 0;
        //     $.each($('.header-mobile > div'), function() {
        //         height += parseInt($(this).attr('data-hei'));
        //     });
        //     $('#main_container > .body')[0].style.setProperty('margin-top', height + 'px', 'important');
        // }
        // else if (section_merge == true) {
        //     $('#main_container > .body')[0].style.setProperty('margin-top', 0, 'important');
        //     $('#main_container > .body > .frm')[0].style.setProperty('margin-top', 0, 'important');
        // }

        // $(window).bind("load",function() {});
        // section merge ver.2
        if ($('#main_container .body > mobile-header-section-merge').length > 0) {
            $('#main_container > .header-mobile').addClass('mobileHeaderSectionMerge');
            $('#main_container > .body')[0].style.setProperty('margin-top', 0, 'important');
            $('#main_container > .body > .frm')[0].style.setProperty('margin-top', 0, 'important');
        } else {
            $('#main_container > .header-mobile').removeClass('mobileHeaderSectionMerge');
            var height = 0;
            $.each($('.header-mobile > div'), function () {
                height += parseInt($(this).attr('data-hei'));
            });

            /* 2020.05.21 재헌
             * 서브메뉴가 존재할 때 해당 높이도 더해서 body에 margin-top을 부여
             */
            if ($('.header-mobile-sub-menu').length > 0) {
                height += $('.header-mobile-sub-menu').height();
            }

            $('#main_container > .body')[0].style.setProperty('margin-top', height + 'px', 'important');
        }
    }
}

function initHeaderSideNav() {
    $('#main_container').delegate('.header-side-nav-button', 'click', function () {
        $('.header-side-nav').toggleClass('active');

        if ($(this).parents('.header-mobile').length > 0) {
            $(this).parents('.header1, .header2, .header3, .header9').addClass('z-index-9999');
        }

        // header-side-nav 영역만큼 밀어내기
        // $('.body').css('width', "calc(100% - 500px)");
    });
    $('#main_container').delegate('.header-side-nav-close', 'click', function () {
        $('.header-side-nav').removeClass('active');

        if ($(this).parents('.header-mobile').length > 0) {
            setTimeout(function () {
                // 사이드 네비 닫히는 시간 0.3ms, z-index 빠지는 시간 0.5ms
                $(this).parents('.header1, .header2, .header3, .header9').removeClass('z-index-9999');
            }, 500)
        }

        // header-side-nav 영역만큼 밀어내기
        // $('.body').removeAttr('style');
    });

    /* 2020.03.16 재헌
     * language selector, header side nav 같은 별도의 창을 띄우는 헤더 요소가
     * header1, header2의 z-index 영향을 받아 위로 겹치거나 의도대로 동작하지 않는 문제를 수정
     */
    $('#main_container').delegate('.header > div', 'mouseenter', function () {
        if ($('.language-dropdown').length > 0 || $('.header-side-nav.active').length > 0) return;
        $(this).css('z-index', 2);
    });
    $('#main_container').delegate('.header > div', 'mouseleave', function () {
        if ($('.language-dropdown').length > 0 || $('.header-side-nav.active').length > 0) return;
        $(this).css('z-index', 1);
    });
}

// 이미지 중 모바일 높이가 지정되지 않은 항목들 및 부모 프레임 크기 지정
function initNonScaledImageBox() {
    if (!isMobile()) return;

    var image_count = 0;
    var target_count = 0;
    $.each($('.body .imgBox'), function () {
        if ($(this).parents('.col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11').length > 0) return;
        if ($(this).parents('.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11').length > 0) return;
        if ($(this).find('.mobile-box').length > 0) return;
        if ($(this).parents('.popup-container').length > 0) return;
        if ($(this).parents('.fixed-contents-layer').length > 0) return;
        if ($(this).parents('.tab-frm, .slider-frm').length > 0) return;

        var bg_size = $(this).find('.img-core').css('background-size');
        if (bg_size == 'contain') {
            image_count++;
        }
    });

    $.each($('.body .imgBox'), function () {
        if ($(this).parents('.col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11').length > 0) return;
        if ($(this).parents('.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11').length > 0) return;
        if ($(this).find('.mobile-box').length > 0) return;
        if ($(this).parents('.popup-container').length > 0) return;
        if ($(this).parents('.fixed-contents-layer').length > 0) return;
        if ($(this).parents('.tab-frm, .slider-frm').length > 0) return;

        var img_box = $(this);
        var bg_size = $(this).find('.img-core').css('background-size');
        var bg_image = $(this).find('.img-core').css('background-image');

        if (bg_image) {
            bg_image = bg_image.replace('url(', '').replace(')', '').replace(/\"/gi, "");
        }

        if (bg_size == 'contain') {
            var tmpImg = new Image();
            tmpImg.src = bg_image;
            $(tmpImg).one('load', function () {
                var ratio = tmpImg.width / tmpImg.height;
                var height_origin = img_box.height();
                var width_resize = window.innerWidth; // img_box.width()는 퍼센트로 출력되기때문에 window width로 대체
                var height_resize = width_resize / ratio;
                var diff = height_origin - height_resize;

                // 모바일 스크린보다 작은 이미지, 가로가 더 긴 이미지 등은 패스한다
                if (ratio > 1 || height_resize < window.innerHeight || height_origin * ratio < window.innerHeight) {
                    return;
                }

                img_box.height(height_resize);
                img_box.find('.img-core').height(height_resize);
                img_box.attr('data-m-hei', height_resize + 'px');
                img_box.data('diff', diff);
                target_count++;

                if (target_count == image_count) {
                    resizeNonScaledImageBoxUpperFrame();
                }
            });
        }
    });
}

function resizeNonScaledImageBoxUpperFrame() {
    $.each($('.body > .frm'), function () {
        var re = 0;
        var image_count = 0;
        $.each($(this).find('.box.imgBox'), function () {
            re += parseInt($(this).data('diff'));
            image_count++;
        });

        if (image_count > 0 && !isNaN(re)) {
            $.each($(this).find('.frm').andSelf(), function () {
                if ($(this).height() - re < 0) return;
                resetMobileFrameStyle($(this));
            });
        }
    });
}

function resetMobileFrameStyle($frm) {
    $frm.children('.view').children('.tb').css('height', 'auto');
}

function initRss() {
    if ($('.rssBox').length > 0) {
        $('.rssBox .rss-area > ul').remove();
        $('.rssBox .view').append($('<div class="qv-loader qv-loader-black" style="display: block;"></div>'));

        $(window).bind("load", function () {
            // jquery.rss.js 동적 호출
            $.getScript("/js/jquery.rss.js", function (data, textStatus, jqxhr) {
                $.each($('.rssBox'), function () {
                    var box = $(this);
                    var target = box.find('.rss-area');
                    var rss_url = target.attr('data-rss-url');
                    var limit = target.attr('data-contents-limit');

                    jQuery(function ($) {
                        target.rss(rss_url, {
                            limit: limit,
                            dateFormat: 'YYYY-MM-DD kk:mm',
                            entryTemplate: '<li><a href="{url}" target="_blank"><span class="rss-title">{title}</span><span class="rss-date">{nicetime}</span><span class="rss-body">{bodyPlain}..</span></a></li>',
                            tokens: {
                                nicetime: function (entry, tokens) {
                                    var createDateTime = new Date(tokens.date).getTime();
                                    var currentDateTime = new Date();
                                    var compareDateTime = currentDateTime.setDate(currentDateTime.getDate() - 1);
                                    if (createDateTime > compareDateTime) {
                                        return getNiceTime(createDateTime, new Date(), 1, true);
                                    }
                                    else {
                                        return tokens.date;
                                    }
                                },
                            },
                            success: function (data) { box.find('.qv-loader').remove(); },
                            error: function (xhr) { box.find('.qv-loader').remove(); },
                        })
                    })
                });
            });
        });
    }
}

function initLnb() {
    if ($('.lnbBox').length > 0) {
        $('.lnb-area .lnb-item[data-spid="1"]').addClass('active');
    }
}

// 모바일 터치 참고 https://fullcalendar.io/docs/longPressDelay
function initCalendar(elements) {
    if ($('.calendarBox').length > 0) {
        // calendar script 동적 호출
        $.getScript("/js/fullcalendar/moment.min.js", function (data, textStatus, jqxhr) {
            $.getScript("/js/fullcalendar/fullcalendar.min.js", function (data, textStatus, jqxhr) {
                $.getScript("/module/calendar/calendar.js", function (data, textStatus, jqxhr) {
                    if (elements) {
                        buildCalendar(elements);
                    } else {
                        $.each($('.calendarBox'), function () {
                            buildCalendar(this);
                        });
                    }
                });
            });
        });
    }
}

function initPageFadeEvent() {
    var page_effect = 0;
    if (page_effect == 1) {
        $('body').addClass('body-fade');
        $('.body-fade').delegate('a', 'click', function (e) {
            var target = $(this);
            var targetUrl = document.activeElement.href;
            if (target.attr('class').indexOf('cke') > -1) return;
            else if (target.attr('target') == '_blank') return;
            else if (target.attr('href') == undefined) return;
            else if (target.attr('href').indexOf('#sld') > -1) return;
            else if (target.attr('href').indexOf('#tab') > -1) return;
            else if (targetUrl === 'javascript:void(0)') return;
            else if (targetUrl == undefined) return;
            else if (targetUrl.substr(targetUrl.length - 1) == '#') return;
            else if (targetUrl != undefined && targetUrl != '') {
                e.preventDefault();
                $('body').fadeOut("fast", function () {
                    location.href = targetUrl;
                });
            }
        });
    }
}

function initJoinModal() {
    $('#main_container').delegate('a[href="/join"]', 'click', function () {
        if (NAVER_CLIENT_ID == '' && KAKAO_CLIENT_ID == '' && GOOGLE_CLIENT_ID == '') {
            location.href = "/join";
            return;
        }
        else {
            $('#JoinModal').modal('show');
            return false;
        }
    });
}

function initPolicyPrivacyModal() {
    $('#main_container').delegate('a[href="/policy_privacy"]', 'click', function () {
        if ($('#PolicyPrivacyModal').data('policy')) {
            $('#PolicyPrivacyModal').modal('show');
        }
        else {
            qvjax_direct(
                "select_terms",
                "/module/member/member.php",
                '',
                function (data) {
                    if (data.length > 0) {
                        var m = "privacy";
                        var text = $.grep(data, function (e) { return e.stms_type == m; })[0].stms_txt;
                        $('#policy-privacy-textarea').val(text);
                        $('#PolicyPrivacyModal').modal('show');
                        $('#PolicyPrivacyModal').data('policy', data);
                    }
                },
                function (xhr) { }
            );
        }

        return false;
    });
}

function removeSiteCopiedElement() { // 복제된 게시판, 폼 삭제처리
    $('#main_container .SiteCopiedElement').remove();
}

function initSnSIconImage() {
    $.each($('.sns-icon-image'), function () {
        if ($(this).width() < 40) {
            var bg = $(this).css('background-image');
            if (bg.toLowerCase().indexOf('color-30') > 0 || bg.toLowerCase().indexOf('color-30') > 0) { return; }

            if (bg.indexOf('-30') > -1) return;
            var convertSmall = bg.replace('Color', 'Color-30').replace('Black', 'Black-30');
            $(this).css('background-image', convertSmall);
        }
    });
}

function initSliderCallback() {
    $.each($('.slider-frm .carousel.slide'), function () {
        $(this).bind('slide.bs.carousel', function (e) {
            //$(this).find('.qv-ani-ele').toggleClass('qv-ani-ele qv-ani');
            $(e.relatedTarget).find('.qv-ani').toggleClass('qv-ani qv-ani-ele');

            $.each($(e.relatedTarget).find('.video-iframe'), function () {
                var src;
                if ($(this).attr('src')) {
                    src = $(this).attr('src').split('&timestamp=')[0];
                } else if ($(this).attr('data-src')) {
                    src = $(this).attr('data-src').split('&timestamp=')[0];
                }

                if (src) {
                    $(this).attr('src', src + '&timestamp=' + new Date().getTime());
                }
            });
        });
    });
}
function initSlider(element) {
    /* 2020.03.12 재헌
     * 슬라이드 배경 이미지는 초기화 시 미리 불러온다
     * 미리 불러오지 않으면 슬라이드 넘길 때 마다 흰 화면이 나타남
     */
    const target = element ? element : $('.slider-frm')

    $.each(target.find('.carousel-inner > .item > .frm'), function () {
        var url = $(this).css('background-image');
        if (url == 'none' || url.indexOf('url') == -1) return;
        else {
            var img = new Image();
            img.src = url.match(/url\(["']?([^"']*)["']?\)/)[1];
        }
    });

    // carousel 스윕
    $.each(target.not('.fullpage').find('.carousel'), function () {
        $.each($(this).find('.item'), function (i) {
            var active = i == 0 ? ' active' : '';
            $(this).attr('class', 'item' + active);
        });
        $(this).find('.carousel-indicators > li').removeClass('active');
        $(this).find('.carousel-indicators > li').first().addClass('active');

        $(this).carousel({ swipe: 200 });
        $(this).carousel(0);

        /* 2020.02.25 재헌
         * 자동 넘기기 시간 간격 조정
         */
        if ($(this).attr('data-slider-interval')) {
            var slider = $(this);
            var interval = parseInt($(this).attr('data-slider-interval'));
            interval = interval >= 1000 ? interval : 5000;
            var sliderInterval = setInterval(function () {
                slider.carousel("next");
            }, interval);
        }
    });
}
function initFullPageSlider() {
    if ($('#main_container > .body > .fullpage').length == 0) return;

    $.each($('.slider-frm.fullpage'), function () {
        $(this).find('.carousel.slide').carousel(0);
        $(this).find('.item').each(function (i, val) {
            if (i === 0) {
                $(val).addClass('active').removeAttr('style');
            } else {
                $(val).removeClass('active').attr('style', 'transform: translate3d(0px, 100%, 0px);');
            }
        })
    });

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
    if (!isMobile) {
        $('#main_container').delegate('.slider-frm.fullpage', 'mousewheel', function (e, delta) {
            //$('.slider-frm.fullpage').on('mousewheel', function (e, delta) {
            if (delta == undefined) { // 2019.01.02 delta 값이 undefined로 넘어와서 아래와 같이 처리
                if (e.originalEvent.wheelDelta > 0) delta = 1;
                else delta = -1;
            }

            var is_fullpage_scrolling = $(this).attr('data-scrolling') == "true" ? true : false;
            if (is_fullpage_scrolling) {
                e.preventDefault();
                return false;
            }
            $(this).attr('data-scrolling', true);

            var index = $(this).find('.carousel.slide .carousel-inner > .item.active').index() + 1;
            var total = $(this).find('.carousel.slide .carousel-inner > .item').length;
            var active_item = $(this).find('.carousel.slide .carousel-inner > .item.active');
            if (delta == 1) {
                if (index == 1) {
                    $(this).attr('data-scrolling', false);
                    return;
                }
                $(this).find('.carousel.slide').carousel("prev");

                var scrollY = parseInt(this.offsetTop);
                $("html, body").animate({ scrollTop: scrollY }, 300);

                // 2019-05-13 재헌
                // fullpage 위/아래 슬라이드 시 가끔씩 오동작 하는 부분이 있어서 스크립트로 제어함
                active_item.prev().removeAttr('style');
                active_item.css('transform', 'translate3d(0, 100%, 0)');
            }
            else {
                if (index == total) {
                    $(this).attr('data-scrolling', false);
                    return;
                }
                $(this).find('.carousel.slide').carousel("next");

                var scrollY = parseInt(this.offsetTop);
                $("html, body").animate({ scrollTop: scrollY }, 300);

                // 2019-05-13 재헌
                // fullpage 위/아래 슬라이드 시 가끔씩 오동작 하는 부분이 있어서 스크립트로 제어함
                active_item.next().removeAttr('style');
                active_item.css('transform', 'translate3d(0, -100%, 0)');
            }

            return false;
        });
    }
    else {
        // touchmove 이벤트 제거. 일부 브라우저에서 스크롤 오동작함 (safari)
        $('.slider-frm.fullpage').bind('touchmove', function (e) { e.preventDefault() });
        $('.slider-frm.fullpage').on('swipedown swipeup', function (e) {
            var is_fullpage_scrolling = $(this).attr('data-scrolling') == "true" ? true : false;
            if (is_fullpage_scrolling) {
                // e.preventDefault();
                return false;
            }
            $(this).attr('data-scrolling', true);

            var index = $(this).find('.carousel.slide .carousel-inner > .item.active').index() + 1;
            var total = $(this).find('.carousel.slide .carousel-inner > .item').length;
            var active_item = $(this).find('.carousel.slide .carousel-inner > .item.active');
            if (e.type == "swipedown") {
                if (index == 1) {
                    if ($(this).prev('.frm').length > 0) { //
                        var scrollY = parseInt($(this).prev('.frm').offset().top);
                        $("html, body").animate({ scrollTop: scrollY }, 200);
                    } else {
                        $("html, body").animate({ scrollTop: 0 }, 200);
                    }
                    $(this).attr('data-scrolling', false);
                    return;
                }
                $(this).find('.carousel.slide').carousel("prev");

                var scrollY = parseInt(this.offsetTop);
                $("html, body").animate({ scrollTop: scrollY }, 300);

                // 2019-05-13 재헌
                // fullpage 위/아래 슬라이드 시 가끔씩 오동작 하는 부분이 있어서 스크립트로 제어함
                active_item.prev().removeAttr('style');
                active_item.css('transform', 'translate3d(0, 100%, 0)');
            }
            else {
                if (index == total) {
                    var scrollY = parseInt(this.offsetTop + $(this).height());
                    $("html, body").animate({ scrollTop: scrollY }, 200);
                    $(this).attr('data-scrolling', false);
                    return;
                }
                $(this).find('.carousel.slide').carousel("next");

                var scrollY = parseInt(this.offsetTop);
                $("html, body").animate({ scrollTop: scrollY }, 300);

                // 2019-05-13 재헌
                // fullpage 위/아래 슬라이드 시 가끔씩 오동작 하는 부분이 있어서 스크립트로 제어함
                active_item.next().removeAttr('style');
                active_item.css('transform', 'translate3d(0, -100%, 0)');
            }

            return false;
        });
    }

    // 2019-05-13 재헌
    // fullpage 위/아래 슬라이드 시 가끔씩 오동작 하는 부분이 있어서 스크립트로 제어함
    $('#main_container').on('click', '.fullpage .carousel-indicators > li', function () {
        var fullpage = $(this).parents('.fullpage').first();
        fullpage.find('.carousel-inner > .item').removeAttr('style');

        var selected_item_num = $(this).attr('data-slide-to');
        var selected_item = $(fullpage.find('.carousel-inner > .item').get(selected_item_num));

        selected_item.prev('.item').css('transform', 'translate3d(0, -100%, 0)');
        selected_item.next('.item').css('transform', 'translate3d(0, 100%, 0)');
    });

    // transition init (ie : left, others : transition)
    $.each($('.fullpage .carousel-inner .item'), function () {
        $.each($(this).children('.frm'), function (i) {
            if (is_InternetExplorer()) {
                $(this).css('transform', 'none');
                $(this).css('left', parseInt(i * 100) + 'vw');
            }
            else {
                $(this).css('transform', 'translate3d(' + parseInt(i * 100) + 'vw,0,0)');
            }
            $(this).removeClass('active');
        });
    });

    $('#main_container').on('click', '.fullpage-slide-control', function () {
        var item = $(this).parent();
        var frames = $(item).children('.frm');
        var total_length = frames.length;
        var active_frm = frames.filter(function () { return $(this).hasClass('active'); });
        if (active_frm.length == 0) { active_frm = frames.first(); }
        var index = active_frm.index();

        if ($(this).hasClass('left')) {
            if (index == 0) {
                frames.removeClass('active');
                frames.last().addClass('active');
                $.each(frames, function (i) {
                    var idx = total_length - i - 1;
                    if (is_InternetExplorer()) {
                        $(this).css('left', '-' + parseInt(idx * 100) + 'vw');
                    }
                    else {
                        $(this).css('transform', 'translate3d(-' + parseInt(idx * 100) + 'vw,0,0)');
                    }
                });
            }
            else {
                $.each(frames, function (i) {
                    var left = (i - index + 1) * 100;
                    if (is_InternetExplorer()) {
                        $(this).css('left', left + 'vw');
                    }
                    else {
                        $(this).css('transform', 'translate3d(' + left + 'vw,0,0)');
                    }

                    $(this).removeClass('active');
                    if (i == index - 1) { $(this).addClass('active'); }
                });
            }
        }
        else if ($(this).hasClass('right')) {
            if (index == total_length - 1) {
                frames.removeClass('active');
                frames.first().addClass('active');
                $.each(frames, function (i) {
                    if (is_InternetExplorer()) {
                        $(this).css('left', parseInt(i * 100) + 'vw');
                    }
                    else {
                        $(this).css('transform', 'translate3d(' + parseInt(i * 100) + 'vw,0,0)');
                    }
                });
            }
            else {
                $.each(frames, function (i) {
                    var left = (i - index - 1) * 100;
                    if (is_InternetExplorer()) {
                        $(this).css('left', left + 'vw');
                    }
                    else {
                        $(this).css('transform', 'translate3d(' + left + 'vw,0,0)');
                    }
                    $(this).removeClass('active');
                    if (i == index + 1) { $(this).addClass('active'); }
                });
            }
        }
    });

    $('.fullpage').find('.carousel.slide').on('slid.bs.carousel', function () {
        var slider = $(this).parents('.fullpage');
        setTimeout(function () {
            $(slider).attr('data-scrolling', false);
        }, 550);
    });

    jQuery.fn.carousel.Constructor.TRANSITION_DURATION = 1000  // 2 seconds
}

function is_InternetExplorer() {
    var agent = navigator.userAgent.toLowerCase();
    return (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1);
}

function byteCheck(string) {
    var utf8length = 0;
    for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
            utf8length++;
        }
        else if ((c > 127) && (c < 2048)) {
            utf8length = utf8length + 2;
        }
        else {
            utf8length = utf8length + 3;
        }
    }
    return utf8length;
}


function initTabFrame() {
    // 2019.01.31
    $.each($('.tab-frm'), function () {
        $(this).find('.tab-frame-nav > ul > li').removeClass('active');
        //$(this).find('.tab-frame-nav > ul > li:first-child').addClass('active');
        $(this).find('.tab-frame-nav > ul > li:first-child > a').trigger('click');
    });

    // 2018.09.04 재헌
    // URL에 #tab- 형식의 값이 있으면 해당 탭을 활성화한다.
    var hash = location.hash;
    if (hash != undefined && hash != '') {
        if (hash.indexOf('tab-') < 0) { return; }
        if ($(hash).length == 0) { return; }

        var tab = $('a[href="' + hash + '"]');
        var nav = tab.closest('.tab-frame-nav');
        $.each(nav.find('li'), function () {
            $(this).children('a').attr('aria-expanded', false);
            $(this).removeClass('active');
        });

        tab.attr('aria-expanded', true);
        tab.parent().addClass('active');

        /* 2021.08.02
         * PC, 모바일 따로 구성하여 같은 id가 두 개 이상 있을 때
         * 둘 다 active 클래스 영향을 받도록 함
         */
        $('div[id="' + hash.replace(/#/g, '') + '"]').each(function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
        });
        // $(hash).siblings().removeClass('active');
        // $(hash).addClass('active');

        setTimeout(function () {
            $(window).scrollTop(nav.offset().top - $('.header').height());
            //            $('html, body').animate({
            //                scrollTop: nav.offset().top - 200
            //            }, 500);
        }, 500);

        /* 2020.03.19 재헌
         * 탭을 mobile_ele로 복사하여 넣은 경우 헤더의 탭 앵커가 동작하지 않기 때문에(id가 달라서)
         * 이름으로 찾아 활성화한다
         */
        if (isMobile()) {
            var tab_name = tab.first().text();
            $.each($('.mobile_ele .tab-frame-nav a'), function () {
                if ($(this).text() == tab_name) {
                    var id = $(this).attr('href');
                    $(this).parent().siblings().removeClass('active');
                    $(this).parent().addClass('active');
                    $('.mobile_ele ' + id).siblings().removeClass('active');
                    $('.mobile_ele ' + id).addClass('active');
                }
            });
        }
    }

    // 탭 내에 지도가 있으면 렌더링이 정상적으로 안되는 증상이 있음
    // 탭 클릭시 지도를 새로 렌더링 하도록 함
    $('#main_container').delegate('.tab-frm .tab-frame-nav li > a', 'click', function (e) {
        var frm = $(this).parents('.tab-frm').first();
        $.each(frm.find('.mapBox'), function () {
            var map = $(this);
            map.removeClass('map-rendering-complete');
            map.find('.qv-map').children().remove();
            setTimeout(function () {
                renderMapBox(map);
            }, 100);
        });
        $.each(frm.find('.mapListBox'), function () {
            var map = $(this);
            map.removeClass('map-list-rendering-complete');
            map.find('.qv-map-list').children().remove();
            setTimeout(function () {
                renderMapListBox(map);
            }, 100);
        });

        // 동일 페이지에 같은 아이디의 텝이 두개 이상 존재할 때
        var tab_id = $(this).attr('href').replace(/#/g, '');
        if ($('.tab-pane[id="' + tab_id + '"]').length > 0) {
            e.preventDefault();
            //frm.find('.tab-pane.active').removeClass('active');
            frm.find('.tab-content').first().children('.tab-pane.active').removeClass('active');
            frm.find('.tab-pane[id="' + tab_id + '"]').addClass('active');
        }


        // 탭 클릭 시 마우스오버 컨텐츠 Initialize
        $.each(frm.find('.mouseover-frm'), function () {
            var before = $(this).find('.mouseover-before').first();
            var after = $(this).find('.mouseover-after').first();
            var mouseover_height = before.height() > after.height() ? before.height() : after.height();

            if ($(this).height() < mouseover_height) {
                var tb = $(this).children('.view').children('.tb');
                tb.height(mouseover_height);
            }
        });

        initIframe(frm.find('.iframeBox'));
    });
}

$(window).on('hashchange', function (e) {
    var hash = window.location.hash;
    var oldUrl = e.originalEvent.oldURL;
    var newUrl = e.originalEvent.newURL;

    var oldUrl_noHash = oldUrl.indexOf('#') < 0 ? oldUrl : oldUrl.split('#')[0];
    var newUrl_noHash = newUrl.indexOf('#') < 0 ? newUrl : newUrl.split('#')[0];

    if (hash.indexOf('#tab') > -1 && (oldUrl_noHash == newUrl_noHash)) {
        window.location.href = newUrl;
        window.location.reload();
    }
});

// 픽스드 컨텐츠 초기화
function initFixedContents() {
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
    if (isMobile) {
        var fixed = $('body').find('.fixed-contents-layer.fixed-contents-show-mobile');
        $.each(fixed, function () {
            var top = this.style.top;
            var left = this.style.left;
            var bottom = this.style.bottom;
            var right = this.style.right;
            var ratio = 3;

            if (top != 'auto') { $(this).css('top', parseFloat(top) / ratio + 'px'); }
            if (left != 'auto') { $(this).css('left', parseFloat(left) / ratio + 'px'); }
            if (bottom != 'auto') { $(this).css('bottom', parseFloat(bottom) / ratio + 'px'); }
            if (right != 'auto') { $(this).css('right', parseFloat(right) / ratio + 'px'); }
        });
    }

    //Click event to scroll to top & bottom
    var didScroll = false;
    $('.body').delegate('.scrollToTop', 'click', function (e) {
        if (!didScroll) {
            didScroll = true;
            $('html, body').stop().animate({ scrollTop: 0 }, 500, 'swing', function () { didScroll = false; });
            return false;
        }
    });
    $('.body').delegate('.scrollToBottom', 'click', function (e) {
        if (!didScroll) {
            didScroll = true;
            $('html, body').stop().animate({ scrollTop: $('.body').height() }, 500, 'swing', function () { didScroll = false; });
            return false;
        }
    });
}
// 픽스트 컨텐츠 초기화 끝

// Youtube 자동 재생 시작
/*
 * mute 속성 안주면 자동재생 안됨. 현재 iframe src에 mute=1 속성 부여
 * https://stackoverflow.com/questions/40685142/youtube-autoplay-not-working
 */
//$(window).load(function() {
//    if ($('.video-iframe').length > 0) {
/*
 * Youtube API 로드
 * 2019.03.18 재헌 주석처리
 * Youtube API 미사용중. 아래 스크립트 때문에 반복재생이 안되는 문제 발생
 */
//        var tag = document.createElement('script');
//        tag.src = "https://www.youtube.com/iframe_api";
//        var firstScriptTag = document.getElementsByTagName('script')[0];
//        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//    }
//});


var player_list = [];
function onYouTubeIframeAPIReady() {
    $.each($('.video-iframe'), function () {
        if (this.src.indexOf('youtube') < 0) { return true; }

        var id = this.id;
        var player = new YT.Player(id, {
            events: {
                'onReady': onPlayerReady,
                'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
        player_list.push(player)
    });
}
function onPlayerReady(event) { event.target.playVideo(); }
function onPlayerPlaybackQualityChange(event) { }
function onPlayerStateChange(event) { }
function onPlayerError(event) { event.target.playVideo(); }
// Youtube 자동 재생 끝

function refreshInstagramAccessToken(access_token, callback) {
    qvjax_direct(
        "refresh_instagram_access_token",
        "/module/sns/instagram.php",
        "&access_token=" + access_token,
        function (data) {
            /* result 0 : 토큰 갱신 필요
             * result 1 : 정상
             */
            if (data.result == 0) {
                $.ajax({
                    type: "GET",
                    url: "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=" + access_token,
                    success: function (response) {
                        console.log('response', response);
                        callback();
                    },
                    error: function (xhr) {
                        console.log('[Instagram]\n토큰 갱신에 실패했습니다.\n관리자에게 문의해주세요.', xhr);
                        // if (xhr.responseJSON.error.code === 190) {}
                    }
                });
            } else if (data.result == 1) {
                callback();
            }
        },
        function (xhr) {
            console.log('xhr', xhr.responseText);
            callback();
        }
    )
}


// 모바일용 헤더 초기화
function initMobileHeader() {
    $('.header-mobile-nav-btn').on('click', function () {
        $('.header-mobile').addClass('active-side-nav');
    });

    $('.header-mobile-side-nav-close').on('click', function () {
        $('.header-mobile').removeClass('active-side-nav');
    });

    $('#main_container').delegate('.active-side-nav', 'click', function (e) {
        if ($(e.target).hasClass('header-mobile')) {
            $('.header-mobile').removeClass('active-side-nav');
        }
    });


    $('.header-mobile-side-nav, .header-side-nav').delegate('.mn-dropdown', 'click', function (e) {
        var parent = $(this).parent();
        if (parent.find('ul.sub-mn').length > 0 && !parent.hasClass('active')) {
            parent.addClass('active');
        }
        else {
            parent.removeClass('active');
        }
    });


    // 모바일에서 스크롤 할 때 헤더에 scroll클래스 추가
    $(window).on('scroll', function (e) {
        if ($(this).scrollTop() > 50) {
            $('.header-mobile').addClass('scroll');
        }
        else {
            $('.header-mobile').removeClass('scroll');
        }

        var scrollTop = $(this).scrollTop();
        var mobile_header = $('#main_container > .header-mobile > div');
        var mobile_header_fixed = $('#main_container > .header-mobile > div[data-scroll-fix="true"]');
        if (mobile_header.length != mobile_header_fixed.length) {
            $.each($('#main_container > .header-mobile > div[data-scroll-fix="true"]'), function () {
                var min = 0;
                var max = parseInt($(this).data('top'));
                var top = max - scrollTop;
                top = top <= min ? min : top;
                $(this).css('top', top + 'px');
            });
        }

        // 서브메뉴가 존재할 때 header merge 상태이면 
        // 스크롤 시 header-mobile-sub-menu 배경 색상을 투명에서 기존 색상으로 변경해주는 작업
        $.each($('#main_container > .header-mobile .header-mobile-sub-menu'), function () {
            $(this).css('background', $(this).parent().css('background'));
        });
    });
}
// 모바일용 헤드 초기화 끝

// 스크롤
var isScrolling = false;
function onScrollBefore() {
    if (isScrolling) {
        isScrolling = false;
        scrollChangeHeaderLogoImage('before');
    }
}

function onScrollAfter() {
    if (!isScrolling) {
        isScrolling = true;
        scrollChangeHeaderLogoImage('after');
    }
}

function scrollChangeHeaderLogoImage(e) {
    const logo = $('.header .logoBox .logo-img-core.scroll-change');
    if (logo && logo.length > 0) {
        const before = logo.attr('data-before');
        const after = logo.attr('data-after');
        const src = (e === 'before') ? before : after;

        if (before && after && src && (logo.attr('src') !== src)) {
            logo.attr('src', src);
        }
    }
}

function qv_on_scroll(t) {
    if (window.pageYOffset <= 120) {
        height_sync(".header .header1", 120);
        $("body").addClass("scrollBefore"); $("body").removeClass("scrollAfter"); if (typeof onScrollBefore === 'function') { onScrollBefore(); }
    }
    if (window.pageYOffset > 120) {
        height_sync(".header .header1", 80);
        $("body").removeClass("scrollBefore"); $("body").addClass("scrollAfter"); if (typeof onScrollAfter === 'function') { onScrollAfter(); }
    }
}

function qv_on_scroll_ie(t) {
    if ($('body').scrollTop() <= 120) {
        height_sync(".header .header1", 120);
        $("body").addClass("scrollBefore"); $("body").removeClass("scrollAfter");
    }
    if ($('body').scrollTop() > 120) {
        height_sync(".header .header1", 80);
        $("body").removeClass("scrollBefore"); $("body").addClass("scrollAfter");
    }
}

function height_sync(e, hei) { //fixed_scroll_js에서 사용
    // 2018.10.12 재헌
    // IE 에서 속도 이슈가 발생해 아래와 같이 조건 추가
    // hei 값이 변해야 style 수정하도록 함
    // if($(e).length>0) {
    if ($(e).length > 0 && $(e).height() != hei) {
        $(e).height(hei);  //hide의 경우에도 애니메이팅 효과를 위해, height를 0으로 설정
        $.each($(e).find(".hsync"), function () {
            if ($(this).parents('.header-side-nav').length > 0) { return; } // header-side-nav 하위 ul은 높이 수정하지 않아야 함
            $(this).height(hei);
            $(this).css("line-height", hei + "px");
        });
        $(e).find(".hsync-nlh").height(hei);
        $(e).find(".header-contents").height(hei);
        $(e).find(".img-view").height(hei);
        $(e).find(".img-core").css('max-height', hei + "px");
        $(e).find(".img-op").css('max-height', hei + "px");
        $(e).find(".logoBox .logo-img-core").css('max-height', hei + "px");

        if (hei < 1) {
            $(e).find(".header-contents").hide();
        } else {
            $(e).find(".header-contents").show();
        }
    }
}

function get_hd_obj() {
    var obj_hd = {};
    $(".header [class^=header]").each(function () {
        var header_class = $(this).attr('class');
        var cm;
        if (_cm = header_class.match(/(header)(\d+)(\s+)?$/)) {
            var hdn = parseInt(_cm[2]);
            obj_hd[hdn] = $(this).data('hei') + "," + $(this).data('scr-hei');
        }
    });
    return obj_hd;
}

function initHeader9() {
    if (getCookie("header9_closed") == 1) {
        $(".header .header9").hide(); //hide banner
        $("body.live").addClass("header9_closed");
    }

    var $top_frm = $("#main_container .body > .frm:not(.mobile_ele)").first();
    if ($top_frm.hasClass("headerSectionMerge")) {
        $("body").addClass("headerSectionMerge");
        $("body").addClass("scrollBefore");
    }

    if ($("body .header").hasClass("useFixed") && !$top_frm.hasClass("headerSectionMerge")) {
        var body_mg_t = $(".body").css("margin-top") ? $(".body").css("margin-top").replace("px", "") : 0;
        if (body_mg_t > 0) {
            var top_frm_mg_t = $top_frm.css("margin-top") ? $top_frm.css("margin-top").replace("px", "") : 0;
            if (top_frm_mg_t > 0) {
                var cal_top_frm_mg_t = parseInt(body_mg_t) + parseInt(top_frm_mg_t);
                $top_frm.css("margin-top", cal_top_frm_mg_t + "px");
                // console.log("top_frm mg-t:"+cal_top_frm_mg_t);
            }
        }
    }
}

function realignHeader9() {

    var $top_frm = $("#main_container .body > .frm:not(.mobile_ele)").first();

    if ($("body .header").hasClass("useFixed") && !$top_frm.hasClass("headerSectionMerge")) {
        var body_mg_t = $(".body").css("margin-top") ? $(".body").css("margin-top").replace("px", "") : 0;
        if (body_mg_t > 0) {
            $top_frm.css("margin-top", $("body .header").height() + "px");
        }
    }
}

function initMenu() {
    var query = qv_func.getUrlParams();
    if (location.pathname.indexOf('/module/board/read_form') > -1 && query.pn) {
        $(".header ul.mn-ul .mn-link, .header-mobile ul.mn-ul .mn-link").each(function (i, t) {
            if ($(t).attr('href') == "/" + query.pn) {
                $(t).parent().addClass("cur-mn-item");
            }
        });
    } else {
        $(".header ul.mn-ul .mn-link, .header-mobile ul.mn-ul .mn-link").each(function (i, t) {
            if ($(t).attr('href') == "/home") {
                $(t).parent().addClass("cur-mn-item");
            }
        });
    }

    //$(".header ul.mn-ul .mn-link, .header-mobile ul.mn-ul .mn-link").each(function(i,t){
    //    if($(t).attr('href')=="///"){
    //        $(t).parent().addClass("cur-mn-item");
    //    }
    //});
}

// 쿠키 생성
function setCookie(cName, cValue, cDay) {
    var expire = new Date();
    expire.setDate(expire.getDate() + cDay);
    cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
    if (typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
    document.cookie = cookies;
}

// 쿠키 가져오기
function getCookie(cName) {
    cName = cName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cName);
    var cValue = '';
    if (start != -1) {
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if (end == -1) end = cookieData.length;
        cValue = cookieData.substring(start, end);
    }
    return unescape(cValue);
}

$('.body').delegate('.fixed-contents-close', 'click', function (e) {
    $(this).parents('.fixed-contents-layer').first().remove();
});
$(document).ready(function () {
    if (!$('body').hasClass('body-fade')) {
        $('body').show();
    }
});

$(window).bind("load", function () {
    initContentsLazyLoad();

    if ($('body').hasClass('body-fade')) {
        $('body').fadeIn(300, 'linear');
    }

    initAnchor(document.location.pathname + document.location.search);


    if (!is_InternetExplorer()) {
        initAnimation();
    }

    setTimeout(function () { initHeaderOverflowMenuResizeEvent(); }, 500);

    // 템플릿에서 버튼 클릭되지 않도록 -> iframe 내부에서 호출되면 form, board 작성 불가, 주소 tpl 포함인 페이지에만 적용
    if (self !== top) {
        // in iframe (template)
        if (location.host.indexOf('tpl') == 0) {
            $('.form-contents-button, .board-write').css('pointer-events', 'none');
        }
        // in iframe (others)
        else { }
    }


    // initMaintainRatioImage();
    initMaintainRatioSlider();
    initBackgroundFullSizeVideo();

    if ($(window).width() < 767) {
        initImageBoxAutoResize();
    }
});

// 2022.01.21 주석처리
// 항상 원본비율 유지 옵션 추가로 인해 필요성 x
function initMaintainRatioImage() {
    if (isMobile() && $(window).width() < 767) return;
    var notAllowed = [
        '.mobile_ele',
        '.boxing',
        '.col-sm-1',
        '.col-sm-2',
        '.col-sm-3',
        '.col-sm-4',
        '.col-sm-5',
        '.col-sm-6',
        '.col-sm-7',
        '.col-sm-8',
        '.col-sm-9',
        '.col-sm-10',
        '.col-sm-11',
    ];

    $.each($('#main_container .body .imgBox'), function () {
        if ($(this).parents(notAllowed.join(',')).length > 0) return;
        var imgcore = $(this).find('.img-core');
        var backgroundSize = imgcore.css('background-size');
        var backgroundPosition = imgcore.css('background-position');

        if (backgroundSize == 'contain' && backgroundPosition == '50% 50%') {
            var url = $(this).find('.img-core').css('background-image').replace('url(', '').replace(')', '').replace(/\"/gi, "");
            // var height = $(this).attr('data-hei').replace(/px/g, '');
            var height = $(this).find('.img-core').height();
            $(this).height('auto');
            imgcore.hide();
            // max-height 지정에서 height 지정으로 변경됨
            // 이미지를 확대해서 저장했을 때 에디터화면과 다른 문제 (라이브에서는 원본크기 이상으로 늘어나지 않음)
            imgcore.after('<img class="img-core-dummy" src="' + url + '" style="max-width: 100%; max-height: ' + height + 'px;">')
        }
    });
}

function resizeMaintainRatioImage() {
    if (isMobile()) return;
    // var interval = setInterval(function() {
    //     if ($('#main_container').width() == 0) { return; }
    //     else {
    //         clearInterval(interval);
    //     }
    // }, 100);

    $.each($('#main_container .imgBox'), function () {
        var imgbox = $(this);
        var imgcore = $(this).find('.img-core');
        var ratio = imgcore.attr('data-ratio');
        var w = $(this).width();
        var w_data = $(this).attr('data-width');
        var background_size = imgcore.css('background-size');

        if (!$(this).hasClass('displayed')
            || (background_size != 'contain')
            || (w == w_data)
            || (!ratio)) {
            console.log(this.id, 'returned');
            return;
        }

        ratio = parseFloat(ratio);
        var ratio_box = imgcore.height() / imgcore.width();
        if (ratio_box > ratio) {
            imgcore.height(imgcore.width() * parseFloat(ratio));
            imgbox.height('auto');
            console.log('1', ratio_box, ratio);
        }
        else {
            imgcore.height(imgbox.attr('data-hei'));
            console.log('2', ratio_box, ratio);
        }

        // $(this).attr('data-width', w);
        // $(this).height('auto');
        // imgcore.height(imgcore.width() * parseFloat(ratio));
    });
}

function resizeMaintainRatioSlider() {
    /* 2020.03.18 재헌
     * IE, FF 에서 해당함수 호출 시 렌더링이 완료되지 않은 상태면 ratio 값을 잘못 측정하는 문제
     * 렌더링 완료 기준은 main_container의 width 값이 0인지 아닌지로 확인
     * 렌더링이 완료되지 않은 상태에서 호출되었다면 100ms 간격을 두고 함수 재호출
     */
    var w = $('#main_container').width();
    if (w == 0) {
        setTimeout(function () {
            resizeMaintainRatioSlider();
        }, 100);
        return;
    }

    $.each($('#main_container .slider-frm.maintain-ratio .frm, #main_container .slider-frm.maintain-ratio .box'), function () {
        var screenWidth = window.screen.width;
        // col-sm 비율까지 고려하려면 아래 코드 사용, 일단 main_container 하위 슬라이드만 적용할 것이라 사용하지 않음
        //var sliderFrame = $(this).parents('.slider-frm').first();
        // var column = sliderFrame.parent()[0].className.split(' ').filter(v => v.indexOf('col-sm') > -1);
        // if (column.length > 0) { // [col-sm-4..]
        //     var column_num = column[0].replace(/col-sm-/g, '');
        //     var column_ratio = 12 / column_num;
        //     screenWidth = screenWidth / column_ratio;
        // }

        var ratio = $(this).parents('.slider-frm').first().width() / screenWidth;
        // 상위에 프레임이 하나 더 있는 경우 width가 0으로 잡힌다
        ratio = ratio != 0 ? ratio : $(this).parents('.slider-frm').parent().width() / screenWidth;

        if (ratio > 0.1) { //IE11,FF load()전 width()값 못가져오는 case 예외처리
            var origin_height = parseInt($(this).data('origin-height'));
            var height = Math.floor(origin_height * ratio);

            if ($(this).hasClass('frm')) {
                if ($(this).parent().hasClass('item')) {
                    if (window.innerWidth <= 767) {
                        ratio = 1;
                        height = $(this).data('origin-height');
                        $(this).children('.view').css('transform-origin', '50% 50%');
                        $(this).css('background-position-y', '50%'); // frame 백그라운드 이미지 원복
                    }
                    $(this).parents('.carousel-inner').height(height);
                    $(this).children('.view').children('.tb').height(height);
                    $(this).children('.view').css('transform', 'scale(' + ratio + ')');

                    // column이 여러개인 경우 item의 높이가 column의 수 만큼 크게나와서 아래와 같이 보정
                    var itemHeight = $(this).parent('.item').height();
                    if (!$(this).parent('.item').hasClass('active')) {
                        itemHeight = itemHeight / $(this).children('.view').children('.tb').children('.row').children('.column').length;
                    }
                    //
                    if (itemHeight >= height) {
                        var diff = parseFloat(itemHeight - height);
                        var rate = itemHeight / 2;
                        var column_height = 0;
                        $.each($(this).children('.view').children('.tb').children('.row').children('.column'), function () {
                            var total = 0;
                            $.each($(this).children('.frm, .box'), function () {
                                total += parseInt($(this).data('origin-height'));
                            });
                            column_height = column_height < total ? total : column_height;
                        });
                        column_height = column_height * ratio;
                        column_height = height - column_height;
                        rate = rate - column_height;

                        // most 3
                        // var diff = parseFloat(itemHeight - height);
                        // var column_height = 0;
                        // $.each($(this).children('.view').children('.tb').children('.row').children('.column'), function() {
                        //     var total = 0;
                        //     $.each($(this).children('.frm, .box'), function() {
                        //         total += parseInt($(this).data('origin-height'));
                        //     });
                        //     column_height = column_height < total ? total : column_height;
                        // });
                        // var rate = (itemHeight + height - (column_height * ratio * 2)) / 2;

                        // most 2
                        // var diff = parseFloat(itemHeight - height);
                        // var rate = diff + diff * Math.sqrt((ratio - 0.5));

                        // most 1
                        // var diff = itemHeight - height;
                        // var rate = diff * (1 + Math.pow(ratio, 2) + (ratizo - 0.5));

                        if (window.innerWidth > 767) {
                            $(this).children('.view').css('transform-origin', '50% calc(50% - ' + Math.ceil(rate) + 'px)');
                            $(this).css('background-position-y', 'calc(50% - ' + parseFloat(diff / 2) + 'px)'); // frame 백그라운드 이미지 보정
                        }
                    }
                }
            }
            else {
                // $(this).height(height);

                // if ($(this).hasClass('imgBox')) {
                //     $(this).find('.img-core').height(height);
                // }
            }
        }
    });
}



function initMaintainRatioSlider() {
    if ($('#main_container .slider-frm.maintain-ratio').length > 0) {
        // ratio slider는 displayed 클래스를 붙여준다.
        $.each($('#main_container .slider-frm.maintain-ratio'), function () {
            var target = $(this).parents('.frm');
            $.merge(target, [$(this)]);
            $.merge(target, $(this).find('.frm, .box'));
            $.each(target, function () {
                $(this).addClass('displayed');
            });
        });

        // $.each($('#main_container .slider-frm.maintain-ratio .carousel-inner'), function() {
        //     $(this).css('height', 'auto');
        // });
        $.each($('#main_container .slider-frm.maintain-ratio .item > .frm > .view > .tb > .row > .column'), function () {
            $(this).css('height', 'auto');
            // $(this).css('min-height', 'auto');
        });
        $.each($('#main_container .slider-frm.maintain-ratio .column'), function () {
            $(this).css('min-height', 'auto');
        });
        $.each($('#main_container .slider-frm.maintain-ratio .frm, #main_container .slider-frm.maintain-ratio .box'), function () {
            var h = $(this).hasClass('frm') ? $(this).children('.view').children('.tb').height() : $(this).height();
            h = $(this).parent().hasClass('item') ? $(this).parents('.carousel-inner').height() : h;
            $(this).data('origin-height', h);
        });

        // 브라우저가 resize 될 때 마다 slider 크기를 조절한다
        $(window).resize(function () {
            resizeMaintainRatioSlider();
        });

        resizeMaintainRatioSlider();
    }
}

/* 2020.02.27 재헌
 * fixed - relative 기반
 */
function initAffixedFrame() {
    var affixedFrame = $('.body .frm[data-fixed="true"]');
    if (affixedFrame.length == 0) return;

    //data-fixed가 존재하는 frame에 z-index 할당
    //var zIndex = $('.body > .frm .frm[data-fixed="true"]').length + 10;
    var zIndex = $('.body .frm').length + 10;
    $.each($('.body .frm'), function () {
        $(this).css('z-index', zIndex--);
    });

    // 고정 컨텐츠의 초기값 지정 및 affixed 클래스 부여, 더미 생성
    $.each(affixedFrame, function () {
        // displayed 되지 않은 항목은 width, offsetTop 값을 가져오지 못하기 때문에
        // 자신과 부모 프레임에 displayed 클래스를 추가한다
        $.each($(this).parents('.frm').andSelf(), function () {
            $(this).addClass('displayed');
        });

        var offsetTop = $(this).offsetTop();
        var maxHeight = $('.header.useFixed').length > 0 ? 'calc(100vh - ' + offsetTop + 'px)' : '100vh';

        // $(this).css('width', $(this).width() + 'px');
        $(this).css('max-height', maxHeight);
        if (!$(this).is('.qv-ani, .qv-ani-ele')) {
            $(this).attr('data-origin-offset-top', offsetTop);
        }
        $(this).addClass('affixed');

        var height = $(this).height() +
            parseInt($(this).css('margin-top')) +
            parseInt($(this).css('margin-bottom')) +
            parseInt($(this).css('padding-top')) +
            parseInt($(this).css('padding-bottom'));
        $(this).after('<div class="affixed-dummy" id="dummy-' + this.id + '" style="height:' + height + 'px;"></div>');

        // $(this).parents('.frm').last().css('z-index', zIndex--);
        // $.each($('#fGYLWT').parents('.frm').andSelf(), function() {
        //    $(this).css('z-index', 15);
        // });
    });

    var scrollTarget = is_InternetExplorer() ? $('body') : $(document);
    scrollTarget.on('scroll', function () {
        var currentScrollTop = $(this).scrollTop();
        var topWithWindowHeight = $(this).scrollTop() + $(window).height();
        console.log(currentScrollTop);
        // 모바일 호환
        var header = (isMobile() && $('.header-mobile').length > 0) ? $('.header-mobile') : $('.header:not(.useFixed)');
        var footer = (isMobile() && $('.footer-frame-mobile').length > 0) ? $('.footer-frame-mobile') : $('.footer-frame');

        $.each(affixedFrame, function () {
            /* 2020.02.28 재헌
             * data-origin-offset-top 값이 없거나(qv-ani, qv-ani-ele), currentScrollTop이 0이면 재할당하여 수시로 값을 보정한다
             */
            if (!$(this).attr('data-origin-offset-top') || currentScrollTop == 0) {
                var offsetTop = $(this).offsetTop() - currentScrollTop;
                $(this).attr('data-origin-offset-top', offsetTop);
            }

            // 최상위 프레임
            if ($(this).parent().is('.body')) {
                if (header.length > 0 && header.height() > currentScrollTop) {
                    if (!$(this).is('.affixed-top')) {
                        $(this).removeClass(function (index, className) {
                            return (className.match(/(^|\s)affix\S+/g) || []).join(' ');
                        });
                        $(this).addClass('affixed-top');
                        $('.affixed-dummy#dummy-' + this.id).hide();

                        console.log('scroll - header');
                    }
                }
                // 스크롤 중 footer에 도달했을 때 (relative)
                else if (footer.length > 0 && footer.offsetTop() < topWithWindowHeight) {
                    if (!$(this).is('.affixed-bottom')) {
                        var relativePosition = $(window).height();
                        var offsetTop = footer.offsetTop() - relativePosition;
                        offsetTop = header.length > 0 ? offsetTop - header.height() : offsetTop;
                        $(this).css('top', offsetTop + 'px');
                        $(this).removeClass(function (index, className) {
                            return (className.match(/(^|\s)affix\S+/g) || []).join(' ');
                        });
                        $(this).addClass('affixed-bottom');
                        $('.affixed-dummy#dummy-' + this.id).hide();

                        console.log('scroll - footer');
                    }
                }
                // header, footer와 접하지 않을 때 (fixed)
                else {
                    var offsetTop = $(this).attr('data-origin-offset-top');
                    offsetTop = header.length > 0 ? offsetTop - header.height() : offsetTop;
                    // offsetTop = offsetTop < 0 ? 0 : offsetTop;
                    $(this).css('top', offsetTop + 'px');
                    $(this).css('width', $(this).width() + 'px');
                    $(this).removeClass(function (index, className) {
                        return (className.match(/(^|\s)affix\S+/g) || []).join(' ');
                    });
                    $(this).addClass('affixed');
                    $('.affixed-dummy#dummy-' + this.id).show();

                    console.log('scroll - main');
                }
            }
            // 하위 프레임
            else {
                var parentFrame = $(this).parents('.frm').last();

                // 스크롤 중 부모프레임 최상부에 도달했을 때
                var _offsetTop = parseInt($(this).attr('data-origin-offset-top'));
                if (_offsetTop > currentScrollTop) {
                    if (!$(this).is('.affixed-top')) {
                        $(this).removeClass(function (index, className) {
                            return (className.match(/(^|\s)affix\S+/g) || []).join(' ');
                        });
                        $(this).addClass('affixed-top');
                        $('.affixed-dummy#dummy-' + this.id).hide();
                    }

                    // offset top 갱신 (chrome, ie 에서 offsetTop 값이 다르게나오는 문제)
                    var offsetTop = $(this).offsetTop();
                    if (_offsetTop != offsetTop) {
                        $(this).attr('data-origin-offset-top', offsetTop);
                    }
                }
                // 스크롤 중 부모프레임 최하부에 도달했을 때
                else if (parentFrame.offsetTop() + parentFrame.height() < topWithWindowHeight) {
                    if (!$(this).is('.affixed-bottom') && !$(this).is('.affixed-top')) { // affixed-top 에서 바로 affixed-bottom 되는 케이스 없도록 함
                        var offsetTop = parentFrame.offsetTop() + parentFrame.height() - $(window).height() - parseInt($(this).attr('data-origin-offset-top'));
                        $(this).css('top', offsetTop + 'px');
                        $(this).removeClass(function (index, className) {
                            return (className.match(/(^|\s)affix\S+/g) || []).join(' ');
                        });
                        $(this).addClass('affixed-bottom');
                        $('.affixed-dummy#dummy-' + this.id).hide();
                    }
                }
                // 부모프레임 최상부,최하부에 접하지 않을 때
                else {
                    if (!$(this).is('.affixed')) {
                        $(this).css('top', '0px');
                        $(this).css('width', $(this).width() + 'px');
                        $(this).removeClass(function (index, className) {
                            return (className.match(/(^|\s)affix\S+/g) || []).join(' ');
                        });
                        $(this).addClass('affixed');
                        $('.affixed-dummy#dummy-' + this.id).show();
                    }
                }
            }
        });
    });
    window.scrollTo(window.scrollX, window.scrollY - 1);
}

function initContentsLazyLoad() {
    if (is_InternetExplorer() || $.browser.mozilla) {
        $('.body').removeClass('pl-h').addClass('pl-n');
        return;
    }

    var correctionValue = isMobile() ? 500 : 300;
    var contents = $('#main_container .body > .frm');
    var scrollTarget = is_InternetExplorer() ? $('body') : $(document);

    if (contents.length == 0) return;
    else {
        $.each(contents, function () {
            var offsetTop = $(this).offsetTop();
            var currentScrollTop = scrollTarget.scrollTop();
            if (offsetTop < $(window).height() + correctionValue + currentScrollTop) {
                $(this).find('.frm:not(".dp-none-important"), .box:not(".dp-none-important")').addClass('displayed');
            }
        });
    }

    var lastScrollTop = 0;
    scrollTarget.on('scroll', function () {
        var currentScrollTop = window.scrollY;
        // var currentScrollTop = $(this).scrollTop();
        //            var screenHeight = $(window).height();
        var screenHeight = window.innerHeight;
        var t = currentScrollTop;
        var b = currentScrollTop + screenHeight + correctionValue;

        if (currentScrollTop > lastScrollTop) { // scroll down
            $.each($('#main_container .body > .frm'), function () {
                var height = $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom'));
                var offsetTop = $(this).offsetTop();

                if (offsetTop + height < t) { }
                else if (offsetTop < b) {
                    $(this).find('.frm:not(".dp-none-important"), .box:not(".dp-none-important")').addClass('displayed');
                }
            });
        } else { // scroll up
            $.each($('#main_container .body > .frm'), function () {
                var height = $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom'));
                var offsetTop = $(this).offsetTop();

                if (offsetTop > b) { }
                else if (offsetTop + height > t) {
                    $(this).find('.frm:not(".dp-none-important"), .box:not(".dp-none-important")').addClass('displayed');
                }
            });
        }

        lastScrollTop = currentScrollTop;
    });
}

/* 2020.02.21 재헌
 * an-once 추가
 * 해당 클래스가 있으면 애니메이션이 단 한번만 실행된다.
 * (기존엔 스크롤했다가 다시 올라오면 애니메이션이 다시 실행 됨)
 */
function initAnimation() {
    var scrollTarget = is_InternetExplorer() ? $('body') : $(document);
    var ani = $('#main_container .qv-ani-ele, #main_container .qv-ani');
    if (ani.length == 0) return;
    else {
        $.each(ani, function () {
            var offsetTop = $(this).offsetTop();
            var offsetBottom = offsetTop + $(this).height();
            var currentScrollTop = getScrollY();
            var currentScrollBottom = currentScrollTop + $(window).height();

            // 부등호 < 에서 <= 로 모두 변경
            if ((offsetTop <= currentScrollTop && currentScrollTop <= offsetBottom) ||
                (offsetTop <= currentScrollBottom && currentScrollBottom <= offsetBottom) ||
                (currentScrollTop <= offsetTop && offsetBottom <= currentScrollBottom) ||
                (offsetTop <= currentScrollTop && currentScrollBottom <= offsetBottom)) {
                return;
            }
            else if ($(this).hasClass('qv-ani-ele')) {
                $(this).toggleClass('qv-ani-ele qv-ani');
            }

            //                if (offsetTop > $(window).height() &&
            //                    $(this).hasClass('qv-ani-ele')) {
            //                    $(this).toggleClass('qv-ani-ele qv-ani');
            //                }
        });
    }

    var lastScrollTop = 0;
    scrollTarget.on('scroll', function () {
        var currentScrollTop = getScrollY();
        // var currentScrollTop = $(this).scrollTop();
        //            var screenHeight = $(window).height();
        var screenHeight = window.innerHeight;
        var t = currentScrollTop;
        var b = currentScrollTop + screenHeight;

        if (currentScrollTop > lastScrollTop) { // scroll down
            $.each($('#main_container .qv-ani-ele, #main_container .qv-ani'), function () {
                var height = $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom'));
                var offsetTop = $(this).offsetTop();

                if (offsetTop + height < t) {
                    if ($(this).is('.qv-ani-ele.an-once')) {
                        $(this).removeClass('qv-ani').addClass('qv-ani-ele');
                    }
                    else if ($(this).hasClass('qv-ani-ele')) {
                        $(this).toggleClass('qv-ani-ele qv-ani');
                        //console.log(1);
                    }
                }
                else if (offsetTop < b) {
                    if ($(this).is('.qv-ani-ele.an-once')) {
                        $(this).removeClass('qv-ani').addClass('qv-ani-ele');
                    }
                    else if ($(this).hasClass('qv-ani')) {
                        $(this).toggleClass('qv-ani qv-ani-ele');
                        //console.log(2);
                    }
                }
            });
        } else { // scroll up
            $.each($('#main_container .qv-ani-ele, #main_container .qv-ani'), function () {
                var height = $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom'));
                var offsetTop = $(this).offsetTop();

                if (offsetTop > b) {
                    if ($(this).is('.qv-ani-ele.an-once')) {
                        $(this).removeClass('qv-ani').addClass('qv-ani-ele');
                    }
                    else if ($(this).hasClass('qv-ani-ele')) {
                        $(this).toggleClass('qv-ani-ele qv-ani');
                        //console.log(3);
                    }
                }
                else if (offsetTop + height > t) {
                    if ($(this).is('.qv-ani-ele.an-once')) {
                        $(this).removeClass('qv-ani').addClass('qv-ani-ele');
                    }
                    else if ($(this).hasClass('qv-ani')) {
                        $(this).toggleClass('qv-ani qv-ani-ele');
                        //console.log(4);
                    }
                }
            });
        }

        lastScrollTop = currentScrollTop;
    });
}

function initAnchor(href) {
    var page = href.slice(1, href.indexOf('?'));
    var query = qv_func.getUrlParams();
    var anchor = query.qvac;
    var anchor_mobile = query.qvmac;

    if (isMobile() && anchor_mobile) { anchor = anchor_mobile; }
    if ($('#' + anchor).length == 0) return;
    if (anchor && (QV_BASE_OBJ.spid == page || SITE_URL == page)) {
        // 앵커 동작 시 lazyload를 무시하고 displayed 클래스 부여
        $.each($('.body > .frm'), function () {
            $(this).find('.frm:not(".dp-none-important"), .box:not(".dp-none-important")').addClass('displayed');
        });

        if (is_InternetExplorer() && $("#" + anchor).offsetTop() == 0) { // ie에서 page load 시 offset 값을 가져오지 못하기 때문에 가져올때까지 setInterval 돌림
            var interval = null;
            interval = setInterval(function () {
                moveAnchor(anchor);
                clearInterval(interval);
            }, 100);
        }
        else {
            setTimeout(function () {
                moveAnchor(anchor);
            }, 100)
        }
    }
}

function moveAnchor(anchor) {
    var scrolltop = 0;
    var header_height_pc = 0;
    $.each($('.header > div[class*=header]'), function () {
        if ($(this).attr('data-scr-hei')) {
            header_height_pc += parseInt($(this).attr('data-scr-hei'));
        }
    });
    header_height_pc = header_height_pc == 0 ? $('.header').height() : header_height_pc;

    var header_height = isMobile() ? $('.header-mobile').height() : header_height_pc;

    /* 2021.09.28
     * 동일 아이디를 가진 anchor 객체가 존재하는 경우가 있음 (PC/Mobile)
     * 구분하여 각 환경에 맞게 앵커객체 할당
     */
    let anchorTarget = $('div[id="' + anchor + '"]').filter(function (i, a) {
        const mobileParents = $(a).parents('.mobile_ele');
        return isMobile() ? mobileParents.length > 0 : mobileParents.length === 0;
    });
    anchorTarget = anchorTarget.length > 0 ? anchorTarget : $('#' + anchor);

    if (anchorTarget.parents('.slider-frm').length > 0) {
        scrolltop = anchorTarget.parents('.slider-frm').offsetTop() - header_height;
        scrolltop = is_InternetExplorer() ? scrolltop + $('body').scrollTop() : scrolltop;

        var slider_index = anchorTarget.parents('.item').index();
        anchorTarget.parents('.carousel.slide').carousel(slider_index);
        anchorTarget.parents('.item').first().css('transform', 'translate3d(0, 0, 0)');

        if (anchorTarget.parents('.fullpage ').length > 0) {
            if (anchorTarget.parents('.item').prev('.item').length > 0) {
                anchorTarget.parents('.item').prev('.item').css('transform', 'translate3d(0, -100%, 0)');
            }
            if (anchorTarget.parents('.item').next('.item').length > 0) {
                anchorTarget.parents('.item').next('.item').css('transform', 'translate3d(0, 100%, 0)');
            }
        }
    }
    else if (anchorTarget.parents('.tab-frm').length > 0) {
        scrolltop = anchorTarget.parents('.tab-frm').offsetTop() - header_height;
        scrolltop = is_InternetExplorer() ? scrolltop + $('body').scrollTop() : scrolltop;

        if (anchor.indexOf('tab-') > -1) {
            var tab_id = anchor;
        }
        else {
            var tab_id = anchorTarget.parent()[0].id;
        }
        anchorTarget.parents('.tab-frm').find('a[href*="#' + tab_id + '"]').trigger('click');

        /* 2020.03.19 재헌
         * 탭을 mobile_ele로 복사하여 넣은 경우 헤더의 탭 앵커가 동작하지 않기 때문에(id가 달라서)
         * 이름으로 찾아 활성화한다
         */
        if (isMobile()) {
            var tab = anchorTarget.parents('.tab-frm');
            var target_tab = tab.find('a[href*="#' + tab_id + '"]');
            var tab_name = target_tab.text();
            $.each($('.mobile_ele .tab-frame-nav a'), function () {
                if ($(this).text() == tab_name) {
                    $(this).trigger('click');
                }
            });
        }
    }
    else {
        scrolltop = $("#" + anchor).offsetTop() - header_height;
        scrolltop = is_InternetExplorer() ? scrolltop + $('body').scrollTop() : scrolltop;
    }

    $('html, body').animate({
        scrollTop: scrolltop
    }, 700);


    // mn-link 클릭하면 header-side-nav 닫음
    if (isMobile() && $('.header-side-nav').hasClass('active')) {
        $('.header-side-nav').removeClass('active');

        if ($(this).parents('.header-mobile').length > 0) {
            $(this).parents('.header1, .header2, .header3, .header9').removeClass('z-index-9999');
        }
    }
}

//$('.mn-link').on('click', function() {
$('a[href*="qvac"]').on('click', function () {
    var href = $(this).attr('href');
    if (href != undefined && href != '') {
        var page = href.slice(1, href.indexOf('?'));
        var params = qv_func.getUrlParams('?' + href.split('?')[1]);
        var anchor = params.qvac;
        var anchor_mobile = params.qvmac;

        if (isMobile() && anchor_mobile) { anchor = anchor_mobile; }
        if ($('#' + anchor).length == 0) return;
        //side menu close
        if ($(this).parents(".header-mobile-side-nav").length > 0) {
            $('.header-mobile').removeClass('active-side-nav');
        }
        if (anchor && (QV_BASE_OBJ.spid == page || SITE_URL == page)) {
            // 앵커 동작 시 lazyload를 무시하고 displayed 클래스 부여
            $.each($('.body > .frm'), function () {
                $(this).find('.frm:not(".dp-none-important"), .box:not(".dp-none-important")').addClass('displayed');
            });

            if (is_InternetExplorer() && $("#" + anchor).offsetTop() == 0) { // ie에서 page load 시 offset 값을 가져오지 못하기 때문에 가져올때까지 setInterval 돌림
                var interval = null;
                interval = setInterval(function () {
                    moveAnchor(anchor);
                    clearInterval(interval);
                }, 100);
            }
            else {
                setTimeout(function () {
                    moveAnchor(anchor);
                }, 100)
            }
            return false;
        }
    }
});

$('a.mn-link[href*="tab"]').on('click', function (e) {
    var href = $(this).attr('href');
    if (href != undefined && href != '') {
        var page = href.slice(1, href.indexOf('#'));
        var anchor = href.split('#')[1];
        if ($('#' + anchor).length == 0) return;
        else {
            if (anchor && (QV_BASE_OBJ.spid == page || SITE_URL == page)) {
                e.preventDefault();
                moveAnchor(anchor);
            }
        }
    }
});

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
}

//원래 initHeaderOverflowMenuResizeEvent 위치


//var resize_frames = [];
function imageBoxAutoResize() {
    $.each($('#main_container .imgBox'), function () {
        var img_box = $(this);
        var bg_size = $(this).find('.img-core').css('background-size');
        var bg_image = $(this).find('.img-core').css('background-image');

        if (bg_image) {
            bg_image = bg_image.replace('url(', '').replace(')', '').replace(/\"/gi, "");
        }

        // displayed 클래스가 없으면 리사이징 하지않는다.
        if (!img_box.hasClass('displayed')) return;

        // 컬럼 2개 이상 존재하는 프레임에 속해있으면 리사이징 하지않는다.
        if (isMobile() || window.innerWidth <= 767) {
            if (img_box.parents('.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11').length > 0) return;
        }
        else {
            if (img_box.parents('.col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11').length > 0) return;
        }

        // 탭, 슬라이드 내의 이미지는 리사이징 하지않는다.
        if (img_box.parents('.tab-frm, .slider-frm').length > 0) return;

        if (bg_size == 'contain') {
            var tmpImg = new Image();
            tmpImg.src = bg_image;
            $(tmpImg).one('load', function () {
                var ratio = tmpImg.width / tmpImg.height;
                var height_origin = parseInt(getDataHeight(img_box));
                var width_resize = img_box.width();
                var height_resize = width_resize / ratio;
                height_resize = height_resize > height_origin ? height_origin : height_resize;

                var diff = height_origin - height_resize;
                //console.log(diff);

                if (height_origin === 0) return;
                else if (!isMobile() && window.innerWidth > 767) {
                    img_box.height(height_origin - diff);
                    img_box.find('.img-core').height(height_origin - diff);
                }
                else {
                    /*
                     * 모바일에서는 에디터 width 375px 기준으로 비율을 맞춰서 크기를 조정한다
                     * 모바일객체는 height important가 적용되어있는 경우가 많아 height 조정 시 important를 붙여줘야 함
                     */
                    var mobile_width = 375 - (parseInt(img_box.parents('.frm').last().css('padding-left')) * 2); // 에디터(375px) 기준
                    var mobile_ratio = mobile_width / height_origin;
                    img_box[0].style.setProperty('height', (width_resize / mobile_ratio) + 'px', 'important');
                    img_box.find('.img-core')[0].style.setProperty('height', (width_resize / mobile_ratio) + 'px', 'important');
                }
            });
        }
    });

    $.each($('.body > .frm'), function () {
        // 컬럼 2개 이상 존재하는 프레임에 속해있으면 리사이징 하지않는다.
        if (isMobile() || window.innerWidth <= 767) {
            if ($(this).parents('.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11').length > 0) return;
            if ($(this).find('.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11').length > 0) return;
        }
        else {
            if ($(this).parents('.col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11').length > 0) return;
            if ($(this).find('.col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11').length > 0) return;
        }


        // 탭, 슬라이드 내의 이미지는 리사이징 하지않는다.
        if ($(this).parents('.tab-frm, .slider-frm').length > 0) return;
        if ($(this).hasClass('tab-frm') || $(this).hasClass('slider-frm')) return;

        var re = 0;
        var image_count = 0;
        $.each($(this).find('.box.imgBox'), function () {
            // displayed 클래스가 없으면 리사이징 하지않는다.
            if (!$(this).hasClass('displayed')) return;

            // 컬럼 2개 이상 존재하는 프레임에 속해있으면 리사이징 하지않는다.
            if (isMobile() || window.innerWidth <= 767) {
                if ($(this).parents('.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11').length > 0) return;
            }
            else {
                if ($(this).parents('.col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11').length > 0) return;
            }

            // 탭, 슬라이드 내의 이미지는 리사이징 하지않는다.
            if ($(this).parents('.tab-frm, .slider-frm').length > 0) return;

            re += getDataHeight($(this)) - $(this).height();
            image_count++;
        });

        if (image_count > 0) {
            $.each($(this).find('.frm').andSelf(), function () {
                var h = getDataHeight($(this));
                if (h == 'auto' || h == 0 || re > h) return;
                if ($(this).is($('.body > .frm').first()) && $('.header').length > 0) {
                    $.each($('.header > div'), function () { // 헤더 크기가 가변적이기 때문에 data-hei 값을 가져다쓴다
                        var header_height = $(this).attr('data-hei');
                        if (header_height == '' || header_height == undefined) { return; }
                        h += parseInt(header_height);
                    });
                    //h += $('.header').height();
                } // 최상단 프레임은 헤더 높이 추가
                h -= re;
                //$(this).children('.view').children('.tb').height(h);
                if (isMobile() || window.innerWidth <= 767) {
                    $(this).css('height', 'auto');
                }
                else {
                    $(this).height(h);
                }
            });
        }
        image_count = 0;
    });

    //    $.each(resize_frames, function() {
    //        var frame = $('#' + this.id);
    //        var height_data = frame.attr('data-hei');
    //        if ((height_data == '' || height_data == undefined || height_data == null)) return;
    //        if (this.diff <= 0) return;
    //        var height_origin_frm = parseInt(height_data);
    //        frame.height(height_origin_frm - this.diff);
    //        console.log('id : ' + this.id + ' / diff : ' + (height_origin_frm - this.diff).toString());
    //
    //        this.diff = 0; // 프레임 높이 조정 후 diff:0 으로 할당
    //    });
}

function getDataHeight($obj) {
    var retval;
    if (window.innerWidth <= 767 || isMobile()) {
        retval = $obj.attr('data-m-hei');
    }
    else {
        retval = $obj.attr('data-hei');
    }

    if (retval == '' || retval == 'auto' || retval == undefined || retval == null || retval == 'NaNpx') {
        retval = $obj.height();
    }
    else {
        retval = parseInt(retval);
        retval -= parseInt($obj.css('margin-top'));
        retval -= parseInt($obj.css('margin-bottom'));
        retval -= parseInt($obj.css('padding-top'));
        retval -= parseInt($obj.css('padding-bottom'));
    }

    return retval;
}

function initImageBoxAutoResize() {
    $.each($('#main_container .frm'), function () {
        $(this).css('transition', '0.1s ease height');

        if ($(this).hasClass('tab-frm')) return;
        if ($(this).parents('.tab-frm').length > 0) return;
        if ($(this).hasClass('slider-frm')) return;
        if ($(this).parents('.slider-frm').length > 0) return;

        var hei = $(this).attr('data-hei');
        if (hei == '' || hei == 'auto' || hei == undefined || hei == null || hei == 'NaNpx') {
            hei = $(this).height();
            hei += parseInt($(this).css('margin-top'));
            hei += parseInt($(this).css('margin-bottom'));
            hei += parseInt($(this).css('padding-top'));
            hei += parseInt($(this).css('padding-bottom'));
            $(this).attr('data-hei', hei);
        }
        //            $(this).attr('data-hei', $(this).height());
    });

    $.each($('#main_container .imgBox'), function () {
        var m_hei = $(this).attr('data-m-hei');
        if (m_hei == '' || m_hei == 'auto' || m_hei == undefined || m_hei == null || m_hei == 'NaNpx') {
            m_hei = $(this).height();
            m_hei += parseInt($(this).css('margin-top'));
            m_hei += parseInt($(this).css('margin-bottom'));
            m_hei += parseInt($(this).css('padding-top'));
            m_hei += parseInt($(this).css('padding-bottom'));
            $(this).attr('data-m-hei', m_hei + 'px');
        }
    });

    $.each($('#main_container .imgBox .img-core'), function () {
        $(this).css('transition', 'none');
    });

    // 0.2초 마다 갱신
    setInterval(imageBoxAutoResize, 200);


    //        window.onresize = function(event) {
    //            imageBoxAutoResize();
    //        };
    //        $(window).bind('resizeEnd', function() {
    //            setTimeout(imageBoxAutoResize(), 50)
    //        });
}

function initBackgroundFullSizeVideo() {
    var backgroundVideo = $('.box-background-video-fullwidth .video-iframe');
    if (backgroundVideo.length == 0) { return; }
    else {
        var w = $('#main_container').width();
        if (w == 0) {
            setTimeout(function () {
                initBackgroundFullSizeVideo();
            }, 100);
            return;
        }
        else {
            resizeBackgroundFullSizeVideo();
            $(window).resize(function () {
                resizeBackgroundFullSizeVideo();
            });
        }
    }
}
function resizeBackgroundFullSizeVideo() {
    $.each($('.box-background-video-fullwidth .video-iframe'), function () {
        var $t = $(this).parents('.frm, .box').first();
        var w = $t.width();
        var h = $t.height();

        // 모바일에서 vimeo 배경설정 시 '소리 켜기' 버튼이 생기는 문제 때문에 전체 크기 상향 조정
        // if (isMobile()) {
        //     w += 100;
        //     h += 100;
        // }

        if ($t.parents('.slider-frm').length > 0) {
            w = $t.parents('.slider-frm').width();
            h = $t.parents('.slider-frm').height();
        }
        else if ($t.parents('.tab-frm').length > 0) {
            w = $t.parents('.tab-frm').width();
            h = $t.parents('.tab-frm').height();
        }
        else if (w == 0 || h == 0) {
            $t.addClass('displayed');
            $t.parents('.frm').addClass('displayed');
            w = $t.width();
            h = $t.height();
        }

        h += parseInt($t.css('padding-top'));
        h += parseInt($t.css('padding-bottom'));
        h += parseInt($t.css('margin-top'));
        h += parseInt($t.css('margin-bottom'));

        var resolution = 'resolution-320x180'; // default;
        var resolution_array = [
            { w: 320, h: 180 },
            { w: 480, h: 270 },
            { w: 640, h: 360 },
            { w: 800, h: 450 },
            { w: 864, h: 486 },
            { w: 960, h: 540 },
            { w: 1024, h: 576 },
            { w: 1152, h: 648 },
            { w: 1280, h: 720 },
            { w: 1366, h: 768 },
            { w: 1440, h: 810 },
            { w: 1600, h: 900 },
            { w: 1760, h: 990 },
            { w: 1920, h: 1080 },
            { w: 2048, h: 1152 },
            { w: 2560, h: 1440 },
            { w: 2880, h: 1620 },
            { w: 3200, h: 1800 },
            { w: 3840, h: 2160 },
            { w: 4096, h: 2304 },
            { w: 5120, h: 2880 },
        ];
        $.each(resolution_array.reverse(), function () {
            if (w > this.w || h > this.h) { return false; }
            else {
                resolution = 'resolution-' + this.w + 'x' + this.h;
            }
        });

        if ($(this).hasClass(resolution)) return;
        else {
            $(this).removeClass(function (index, className) {
                return (className.match(/(^|\s)resolution-\S+/g) || []).join(' ');
            });
            $(this).addClass(resolution);
        }
    });
}

function is_InternetExplorer() {
    var agent = navigator.userAgent.toLowerCase();
    return (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1);
}

/* 2020.03.11 재헌
 * IE, Chrome이 $t.offset().top 값을 다르게 출력하기 때문에 아래와 같이 처리
 */
const _ZOOM = Number(window.getComputedStyle(document.body).zoom);
$.fn.offsetTop = function () {
    if (_ZOOM === 1) {
        var offsetTop = $(this).offset().top - parseInt($(this).css('margin-top'));
        return is_InternetExplorer() ? offsetTop + $('body').scrollTop() : offsetTop;
    } else {
        return window.scrollY + (this[0].getBoundingClientRect().y * _ZOOM);
    }
};

function isIpadOS() {
    return navigator.maxTouchPoints &&
        navigator.maxTouchPoints > 2 &&
        /MacIntel/.test(navigator.platform);
}

function getScrollY() {
    if (isIpadOS()) {
        return window.scrollY / _ZOOM;
    } else {
        return window.scrollY;
    }
};

$.each($('iframe.video-iframe'), function () {
    var src = $(this).attr('data-src');
    if (!src) return;

    var loadingMask = '<div class="proceeding">' +
        '<div style="z-index: -1;" class="qv-loader qv-loader-black"></div>' +
        '</div>';
    $(this).before($(loadingMask));
});

$(window).bind("load", function () {
    $.each($('iframe.video-iframe'), function () {
        var src = $(this).attr('data-src');
        if (!src) return;

        $(this).on('load', function () {
            $(this).siblings('.proceeding').remove();
        });
        $(this).attr('src', src);
    });
});