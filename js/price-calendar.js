(function ($) {
    $.fn.extend({
        priceCalendar: function (option) {
            // 默认设置
            var defaultOption = {
                date: new Date()
            }
            option = $.extend(defaultOption, option);

            var that  = $(this);
            that.append(outerHTML());
            var daysData = getDaysData(option.date);
            showCalendar(daysData);

            // 上个月
            $(".cal-prev").click(function () {
                var year = +$(".cal-year").text();
                var month = $(".cal-month").text() - 1;
                if (month < 1) {
                    year -= 1;
                    month = 12;
                }
                console.log(typeof year, typeof month, year, month);

                var date = new Date(year, month-1,1);
                showCalendar(getDaysData(date));
            });

            // 下一月
            $(".cal-next").click(function () {
                var year = +$(".cal-year").text();
                var month = +$(".cal-month").text() + 1;
                if (month > 12) {
                    year += 1;
                    month = 1;
                }
                console.log(typeof year, typeof month, year, month);

                var date = new Date(year, month-1,1);
                showCalendar(getDaysData(date));
            });

            // 修改该月默认价格
            $("#cal-month-price").change(function () {
                var price = $(this).val();
                var reg = /^[1-9]\d*$/;
                if (!reg.test(price)) {
                    alert("请输入正整数！");
                    $(this).val("").focus();
                    return;
                }
                var days = $("#cal-set dd");
                days.each(function (idx, ele) {
                    var defaultFlag = $(ele).attr("data-default");
                    if (defaultFlag === "true") {
                        $(ele).children(".cal-price").html("￥" + price);
                    }
                });
            });

            // 修改某日价格
            $("#cal-set").on("click", "dd", function () {
                $(this).children(".cal-price").replaceWith('<input type="text" class="cal-price-input">');
                $(this).children(".cal-price-input").focus();
            });
            $("#cal-set").on("blur", "dd", function () {
                var price = $(this).children(".cal-price-input");
                var reg = /^[1-9]\d*$/;
                if (!reg.test(price.val())) {
                    alert("请输入正整数！");
                    price.val("").focus();
                    return;
                }
                $(this).children(".cal-price-input").replaceWith('<span class="cal-price">￥' + price.val() + '</span>');
                $(this).attr("data-default", false);
            });

            // 获取该月第一天是星期几
            function getFirstDay(date) {
                date = date || new Date();
                date.setDate(1);
                return date.getDay();
            }

            // 获取该月的天数
            function getCountDays(date) {
                date = date || new Date();
                date.setMonth(date.getMonth() +1);
                date.setDate(0);
                return date.getDate();
            }

            // 获取要显示的日期数据
            function getDaysData(date) {
                date = date || new Date();
                console.log(date)
                var firstDay = getFirstDay(date);
                var countDays = getCountDays(date);

                var daysData = [];
                for (var i = 0, len = countDays; i < len; i++) {
                    daysData.push({
                        day: i + 1,
                        special: "",
                        week: (i + firstDay)%7,
                        price: "",
                        default: true
                    });
                }
                daysData.year = date.getFullYear();
                daysData.month = date.getMonth() + 1;
                return daysData;
            }

            // 显示日历
            function showCalendar(data) {
                $("#cal-set").children("dd").remove();
                var calHTML = '<dd style="margin-left: ' + 70*parseInt(data[0].week) + 'px" data-default="' + data[0].default + '">' + 
                        '<span class="cal-day">' + data[0].day + '</span>' +
                        '<span class="cal-special">' + data[0].special + '</span>' +
                        '<span class="cal-price">' + (data[0].price === "" ? "" : "￥" + data[0].price) + '</span>' +
                    '</dd>';
                for (var i = 1, len = data.length; i < len; i++) {
                    calHTML += '<dd data-default="' + data[i].default + '">' + 
                        '<span class="cal-day">' + data[i].day + '</span>' +
                        '<span class="cal-special">' + data[i].special + '</span>' +
                        '<span class="cal-price">' + (data[0].price === "" ? "" : "￥" + data[0].price) + '</span>' +
                    '</dd>';
                };
                $(".cal-year").html(data.year);
                $(".cal-month").html(data.month);

                console.log("显示之前：", data.year, data.month);
                $("#cal-set").append(calHTML);
            }






            function outerHTML() {
                var html = '<div id="cal-set-ctn">' +
                                 '   <h2>' +
                                 '       <span class="cal-prev">&lt;</span>' +
                                 '       <span class="cal-date">' +
                                 '           <span class="cal-year"></span> 年' +
                                 '           <span class="cal-month"></span> 月' +
                                 '       </span>' +
                                 '       <span class="cal-next">&gt;</span>' +
                                 '   </h2>' +
                                 '   <div class="cal-setting">设置当月默认价格<input type="text" id="cal-month-price">元</div>' +
                                 '   <dl id="cal-set">' +
                                 '       <dt><strong>日</strong></dt>' +
                                 '       <dt>一</dt>' +
                                 '       <dt>二</dt>' +
                                 '       <dt>三</dt>' +
                                 '       <dt>四</dt>' +
                                 '       <dt>五</dt>' +
                                 '       <dt><strong>六</strong></dt>' +
                                 '   </dl>' +
                                 '   <div class="cal-buttons">' +
                                 '      <button class="cal-cancel">取消</button>' +
                                 '      <button class="cal-save">确定</button>' +
                                 '   </div>' +
                                 '</div>';
                return html;
            }
        }
    })
})(jQuery)