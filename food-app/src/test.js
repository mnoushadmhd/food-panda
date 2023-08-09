function Dialog(html, options) {
    var defaults = { modal: false, id: false, show: false, resizable: false, pinnable: false };
    var pin_date = [];
    var options = $.extend(defaults, options);
    options.draggable = options.draggable ? options.draggable : !options.modal;
    options.id = options.id ? options.id : "dialog-" + Dialog.__count;
    var overlayId = options.id + "-overlay";
    var isShow = false;
    var hasFirstShow = false;
    var hasContent = false;
    var MIN_SIZE = { w: 400, h: 250 };
    var SHOW_CLOSE = typeof options.buttons === "undefined" || !$.isEmptyObject(options.buttons);
    var dialog = $(
        '<div id="' +
            options.id +
            '" class="dialog-box hidden ' +
            (options.className ? options.className : "") +
            (options.data_manager ? " data_manager_dialog " : "") +
            '">' +
            (SHOW_CLOSE ? '<div class="close" title="Close"></div>' : "") +
            (options.pinnable ? '<div class="pin" title="Pin Graph"></div>' : "") +
            (options.resizable
                ? '<div class="resize t"></div>' +
                  '<div class="resize l"></div>' +
                  '<div class="resize b"></div>' +
                  '<div class="resize r"></div>' +
                  '<div class="resize tl"></div>' +
                  '<div class="resize tr"></div>' +
                  '<div class="resize br"></div>' +
                  '<div class="resize bl"></div>'
                : "") +
            (options.title !== false && options.tab !== true
                ? '<div class="dialog-header">' + (options.data_manager !== true ? '<div class="dialog-title">' + (options.title ? options.title : "") + "</div>" : "") + "</div>" + '<div class="content cf"></div>'
                : '<div class="content content-nopadding"></div>') +
            "</div>"
    );
    var self = this;
    this.content = dialog.find(".content");
    this.dialog = dialog;
    var container = $("#dialogs");
    if (container.length) container.append(dialog);
    else $("body").append(dialog);
    var resetPos = function () {
        var css = { left: !options.left ? ($(window).width() - dialog.width()) / 2 + $(window).scrollLeft() : parseInt(options.left, 10), top: !options.top ? 62 + $(window).scrollTop() : parseInt(options.top, 10) };
        if (container.length) {
            var offset = container.offset();
            css.left -= offset.left;
            css.top -= offset.top;
        }
        if (options.width) {
            if (self.content.hasClass("content-nopadding")) css.width = options.width;
            else css.width = options.width + 20;
        }
        dialog.css(css);
        if (!options.resizable) {
        }
    };
    this.resetPos = resetPos;
    this.setTitle = function (title) {
        title = title || "";
        dialog.find(".dialog-title").text(title);
    };
    this.setSize = function (_size, animate) {
        var size = $.extend(options, _size);
        if (typeof animate !== "undefined" && animate === false) {
            dialog.addClass("no-animation");
        }
        if (self.content.hasClass("content-nopadding")) {
            if (size.width) {
                dialog.css("width", options.width);
            }
            if (size.height) {
                dialog.css("height", options.height);
            }
        } else {
            if (size.width) {
                this.content.css("width", options.width);
                dialog.css("width", options.width + 20);
            }
            if (size.height) {
                this.content.css("height", options.height);
                dialog.css("height", options.height + 55);
            }
        }
        if (typeof animate !== "undefined" && animate === false) {
            setTimeout(function () {
                dialog.removeClass("no-animation");
            }, 500);
        }
    };
    this.show = function () {
        if (!hasContent) {
            this.setContent(html);
        }
        if (options.modal !== false) {
            options.modal.css({ "z-index": ++Dialog.__zindex, display: "block" });
            setTimeout(function () {
                $("html").addClass("modal");
            }, 10);
            $(window).on("resize.dialog", function () {
                moveDialog();
            });
        } else {
            $(document).on("keydown.dialog" + options.id, function (e) {
                if (e.keyCode === 27 && !$("html").hasClass("login")) {
                    var topmost = 0;
                    var topmost_index = 0;
                    $(".dialog-box").each(function (index) {
                        if (!$(this).hasClass("hidden") && $(this).css("z-index") > topmost) {
                            topmost = $(this).css("z-index");
                            topmost_index = index;
                        }
                    });
                    if ($(".dialog-box").eq(topmost_index).children(".close").length) {
                        $(".dialog-box").eq(topmost_index).data("dialog").hide();
                    }
                    e.stopImmediatePropagation();
                }
            });
        }
        dialog
            .css("z-index", ++Dialog.__zindex)
            .removeClass("hidden")
            .trigger("dialog.onShow");
        isShow = true;
        if (!hasFirstShow) {
            hasFirstShow = true;
            resetPos();
        }
    };
    this.hide = function () {
        if (!isShow) return;
        if (typeof options.beforeHide === "function" && !options.beforeHide()) return;
        dialog.addClass("hidden").trigger("dialog.onHide");
        isShow = false;
        if (options.modal !== false) {
            options.modal.fadeOut(200);
            setTimeout(function () {
                $("html").removeClass("modal");
            }, 10);
            $(window).off("resize.dialog");
        } else {
            $(document).off("keydown.dialog" + options.id);
        }
        if (typeof options.afterHide === "function") {
            options.afterHide();
        }
    };
    this.showOrHide = function () {
        if (!isShow) this.show();
        else this.hide();
    };
    this.setHeaderMainMenu = function () {
        if (options.data_manager !== true) return;
        var header_html =
            '<div class="data_manager_header">' +
            '<a class="button button_light_alt" title="Back to main menu">' +
            "<span><div></div></span>" +
            "</a>" +
            '<span class="titles">' +
            '<div class="title">' +
            options.title +
            "</div> " +
            (typeof options.subtitle !== "undefined" ? '<div class="subtitle">' + options.subtitle + "</div>" : "") +
            "</span>" +
            "</div>";
        if (options.tab) {
            self.content.prepend(header_html);
        } else {
            self.content.prev().prepend(header_html);
        }
    };
    this.setContent = function (c) {
        if (typeof c === "undefined") return;
        if (!hasContent) {
            if (c instanceof jQuery) {
                this.content.append(c);
            } else {
                switch (c.substring(0, 1)) {
                    case "#":
                        this.content.append($(c).removeClass("hidden"));
                        break;
                    case "/":
                        Utils.status({ id: "dialog-opening", text: "Opening" });
                        self.content.addClass("opening");
                        var ajax = $.ajax({
                            url: c,
                            cache: false,
                            success: function (response) {
                                self.content.append(response);
                                self.content.removeClass("opening");
                                dialog.off("dialog.onHide.setContent");
                            },
                        });
                        dialog.on("dialog.onHide.setContent", function (e) {
                            ajax.abort();
                            hasContent = false;
                            $(this).unbind(e);
                        });
                        break;
                    default:
                        this.content.append(c);
                }
            }
            hasContent = true;
            if (options.show) {
                setTimeout(this.show, 0);
            }
            if (typeof ajax !== "undefined") {
                ajax.done(function () {
                    resetPos();
                    self.setHeaderMainMenu();
                }).always(function () {
                    Utils.status({ id: "dialog-opening" });
                });
            } else {
                self.setHeaderMainMenu();
            }
        }
    };
    this.pin = function (e) {
        if (typeof e === "undefined") {
            var pin_icon = self.dialog.children(".pin");
        } else {
            var pin_icon = $(this);
        }
        if (pin_icon.hasClass("pin-active")) return;
        pin_icon.addClass("pin-active");
        var dialog_id = self.dialog.attr("id");
        self.dialog.attr("id", dialog_id + "-pinned-" + +new Date()).addClass(dialog_id);
    };
    var init = function () {
        if (options.modal) {
            options.modal = $("#dialog-overlay");
            if (options.modal.length === 0) options.modal = $('<div id="dialog-overlay"></div>').prependTo($("#dialogs"));
        }
        dialog.css({ zIndex: ++Dialog.__zindex, position: "absolute" });
        dialog.on("click", ".close", self.hide);
        dialog.on("click", ".pin", self.pin);
        let largestZIndex = 0;
        $('.dialog-box').on("click", function(event) {
        $('.dialog-box').each(function() {
            const zIndex = parseInt($(this).css('z-index'));
            if (!isNaN(zIndex) && zIndex > largestZIndex) {
            largestZIndex = zIndex;
            }
        });
         const clickedElement = $(this);
         clickedElement.css('z-index', largestZIndex + 1);       
        });
        dialog.on("mousedown touchstart", function (event) {
            var $this = $(event.target);
            var operation;
            if ($this.hasClass("resize")) {
                operation = resizeDialog;
                var resize_handle = event.target.className;
                var resize_event;
                if (resize_handle.indexOf("tl") > -1) resize_event = "tl";
                else if (resize_handle.indexOf("tr") > -1) resize_event = "tr";
                else if (resize_handle.indexOf("br") > -1) resize_event = "br";
                else if (resize_handle.indexOf("bl") > -1) resize_event = "bl";
                else if (resize_handle.indexOf("t") > -1) resize_event = "t";
                else if (resize_handle.indexOf("b") > -1) resize_event = "b";
                else if (resize_handle.indexOf("l") > -1) resize_event = "l";
                else if (resize_handle.indexOf("r") > -1) resize_event = "r";
                $("body").addClass("resizing-" + resize_event);
                dialog.addClass("resizing");
            } else if ($this.hasClass("ui-tabs-nav") || $this.hasClass("dialog-header") || $this.parent().hasClass("dialog-header")) {
                dialog.addClass("moving");
                operation = moveDialog;
            } else {
                return;
            }
            if (!options.draggable) return;
            event.preventDefault();
            // dialog.css("z-index", ++Dialog.__zindex);
            var height = dialog.height();
            var width = dialog.width();
            if (!event.pageX || !event.pageY) event = event.originalEvent;
            $(document).on(
                "mousemove touchmove",
                null,
                { left: event.pageX - dialog.position().left, top: event.pageY - dialog.position().top, height: height, width: width, position: dialog.position(), resize_event: resize_event, start_event: event },
                operation
            );
            $(document).on("mouseup touchend", function (e) {
                $("body").removeClass("no_selecting");
                document.onselectstart = function () {
                    return;
                };
                if (dialog.hasClass("resizing")) {
                    $("body").removeClass(function (i, css) {
                        return (css.match(/\bresizing-\S+/g) || []).join(" ");
                    });
                    dialog.removeClass("resizing");
                    dialog.trigger("dialog.resizeEnd");
                } else {
                    dialog.removeClass("moving");

                }
                $(this).off("mousemove touchmove", operation).off(e);
            });
            needHiddenObjHide();
        });
        this.setSize();
    };
    function moveDialog(e) {
        if (typeof e === "undefined") {
            if (options.modal) {
                resetPos();
                return;
            }
        }
        if (!e.pageX || !e.pageY) $.extend(e, { pageX: e.originalEvent.pageX, pageY: e.originalEvent.pageY });
        var css = { top: Math.max(47, e.pageY - e.data.top), left: e.pageX - e.data.left };
        dialog.css(css);
        return false;
    }
    function resizeDialog(e) {
        var css = {};
        if (!e.pageX || !e.pageY) $.extend(e, { pageX: e.originalEvent.pageX, pageY: e.originalEvent.pageY });
        switch (e.data.resize_event) {
            case "tl":
                var offset_x = e.pageX - e.data.start_event.pageX;
                var offset_y = e.pageY - e.data.start_event.pageY;
                css = { height: e.data.height - offset_y, width: e.data.width - offset_x, left: e.data.position.left + offset_x, top: e.data.position.top + offset_y };
                break;
            case "tr":
                var offset_y = e.pageY - e.data.start_event.pageY;
                css = { height: e.data.height - offset_y, width: e.data.width + e.pageX - e.data.start_event.pageX, top: e.data.position.top + offset_y };
                break;
            case "br":
                css = { height: e.data.height + e.pageY - e.data.start_event.pageY, width: e.data.width + e.pageX - e.data.start_event.pageX };
                break;
            case "bl":
                var offset_x = e.pageX - e.data.start_event.pageX;
                css = { height: e.data.height + e.pageY - e.data.start_event.pageY, width: e.data.width - offset_x, left: e.data.position.left + offset_x };
                break;
            case "t":
                var offset_y = e.pageY - e.data.start_event.pageY;
                css = { height: e.data.height - offset_y, top: e.data.position.top + offset_y };
                break;
            case "r":
                css = { width: e.data.width + e.pageX - e.data.start_event.pageX };
                break;
            case "b":
                css = { height: e.data.height + e.pageY - e.data.start_event.pageY };
                break;
            case "l":
                var offset_x = e.pageX - e.data.start_event.pageX;
                css = { width: e.data.width - offset_x, left: e.data.position.left + offset_x };
                break;
        }
        if (css.height) {
            if (css.height < MIN_SIZE.h) {
                css.height = MIN_SIZE.h;
                delete css.top;
            }
        }
        if (css.width) {
            if (css.width < MIN_SIZE.w) {
                css.width = MIN_SIZE.w;
                delete css.left;
            }
        }
        dialog.css(css);
        var content_css = {};
        if (self.content.hasClass("content-nopadding")) {
            if (css.width) content_css.width = css.width;
            if (css.height) content_css.height = css.height;
        } else {
            if (css.width) content_css.width = css.width - 20;
            if (css.height) content_css.height = css.height - 20 - 35;
        }
        self.content.css(content_css);
    }
    init.call(this);
    this.setContent(html);
    Dialog.__count++;
    Dialog.__zindex++;
    dialog.data("dialog", this);
    if (readCookie("ReadOnlyUser") == "5") {
        $("a.pin_default_image_remove,a.pin_default_image_tocanvas,a.remove,.canvas_add_to_binder,#make_default,.aaa_report_btn").addClass("myclass");
        $("#data_manager,#blog_general_search,#graph_thumb,#graph_large,#csv,#web_report,#graph_options,#viewedit_instrument,#instrument_show_on_map,#submit_editprofile,.preview_report,.refresh,.build_canvassheet,.webreport").removeClass(
            "myclass"
        );
        $(
            "#switch_instrument_tab,#blog_general_searchbtn,#job_image,#imrresbtn,#show_tbm_canvas_screen,.blog_aaa_morebtn,.blog_aaa_resetbtn,#blogaaasbtn,#imrrepsbtn,#imr_rest,#cross_sectionbutton,.preview_canvassheet,.aaablog_show_on_map,.aaablog_graph,#search_message_reset,.preview_canvas "
        ).removeClass("myclass");
        $("#add_legend_canvassheet,.remove").addClass("disabled");
        $("ul").find("#add_legend_canvassheet").css("pointer-events", "none");
        $(".save_r_setting,#button_save,#button_cancel,.cancel_new_revw_sett,#button_edit,.drp_button_style,#add_new_review,#revw_settings,.btn_add_instrum_config,.delete,.imrblog_post_delete ").css("visibility", "hidden");
        $("li.graph").find("a").removeClass("myclass");
        $(".highcharts-contextmenu").find("div:eq(3)").hide();
        $("#make_default").css("pointer-events", "none");
    }
}
Dialog.__zindex = 1100;
Dialog.__count = 1;
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
