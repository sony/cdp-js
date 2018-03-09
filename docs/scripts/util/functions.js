define(["require", "exports", "underscore", "highlight"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        Utils.activateAllExternalLinks = function ($parents) {
            // アンカータグを探す
            var $links = $parents.find("a");
            $links.each(function (index, elem) {
                var $link = $(elem);
                var href = $link.attr("href").toLowerCase();
                // http:// or https:// で始まる場合は外部リンクとして扱う
                // mailto で始まる場合は、デフォルトの動作をさせる
                if (href) {
                    if (href.indexOf("http://") === 0 ||
                        href.indexOf("https://") === 0) {
                        $link.attr({
                            "target": "_blank",
                            "rel": "external",
                            "data-no-vclick-handle": "true",
                        });
                    }
                    else if (href.indexOf("mailto") === 0) {
                        $link.attr({
                            "rel": "external",
                            "data-no-vclick-handle": "true",
                        });
                    }
                }
            });
        };
        /**
         * `string`を <code>string</code> に置換する
         * @param  $parents
         */
        Utils.activateInlineCode = function ($parents) {
            // p, li タグを探す
            var $elems = $parents.find("p, li");
            $elems.each(function (index, elem) {
                var $elem = $(elem);
                var html = $elem.html();
                // "`" で分割する
                var splits = html.split("`");
                var count = splits.length;
                var newHtml = "";
                // <code> </code> を挿入
                for (var i = 0; i < count; i++) {
                    newHtml += splits[i];
                    if (i % 2 === 0 && i < count - 2) {
                        newHtml += "<code>";
                    }
                    else if (i % 2 === 1) {
                        newHtml += "</code>";
                    }
                }
                $elem.html(newHtml);
            });
        };
        /**
         * hignlight.js を有効化する
         */
        Utils.activateHighlight = function ($parents) {
            // <pre class="hljspre"></pre> の中身を HTML エスケープし、<code> で wrap する
            var $hljspre = $parents.find(".hljspre");
            $hljspre.each(function (index, elem) {
                var $elem = $(elem);
                var className = $elem.attr("class");
                var html = $elem.html();
                var $code = $("<code />").html(_.escape(html));
                if (className) {
                    $code.addClass(className);
                }
                $code.removeClass("hljspre");
                $elem.empty();
                $elem.append($code);
            });
            // <pre><code>...</code></pre> を探す
            var $elems = $parents.find("pre code");
            $elems.each(function (index, elem) {
                window.hljs.highlightBlock(elem);
            });
        };
        return Utils;
    }());
    exports.Utils = Utils;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXBwL3NjcmlwdHMvdXRpbC9mdW5jdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBR0E7UUFBQTtRQWdGQSxDQUFDO1FBL0VVLDhCQUF3QixHQUEvQixVQUFnQyxRQUFnQjtZQUM1QyxZQUFZO1lBQ1osSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQUMsS0FBSyxFQUFFLElBQUk7Z0JBQ3BCLElBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEIsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDOUMsd0NBQXdDO2dCQUN4Qyw4QkFBOEI7Z0JBQzlCLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ04sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO3dCQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pDLEtBQUssQ0FBQyxJQUFJLENBQUM7NEJBQ1AsUUFBUSxFQUFFLFFBQVE7NEJBQ2xCLEtBQUssRUFBRSxVQUFVOzRCQUNqQix1QkFBdUIsRUFBRSxNQUFNO3lCQUNsQyxDQUFDLENBQUM7b0JBQ1AsQ0FBQztvQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0QyxLQUFLLENBQUMsSUFBSSxDQUFDOzRCQUNQLEtBQUssRUFBRSxVQUFVOzRCQUNqQix1QkFBdUIsRUFBRSxNQUFNO3lCQUNsQyxDQUFDLENB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bnQiOlsiaW1wb3J0IFwiaGlnaGxpZ2h0XCI7XHJcbmltcG9ydCAqIGFzIF8gZnJvbSBcInVuZGVyc2NvcmVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVdGlscyB7XHJcbiAgICBzdGF0aWMgYWN0aXZhdGVBbGxFeHRlcm5hbExpbmtzKCRwYXJlbnRzOiBKUXVlcnkpOiB2b2lkIHtcclxuICAgICAgICAvLyDjgqLjg7Pjgqvjg7zjgr/jgrDjgpLmjqLjgZlcclxuICAgICAgICBjb25zdCAkbGlua3MgPSAkcGFyZW50cy5maW5kKFwiYVwiKTtcclxuICAgICAgICAkbGlua3MuZWFjaCgoaW5kZXgsIGVsZW0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgJGxpbmsgPSAkKGVsZW0pO1xyXG4gICAgICAgICAgICBjb25zdCBocmVmID0gJGxpbmsuYXR0cihcImhyZWZcIikudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgLy8gaHR0cDovLyBvciBodHRwczovLyDjgaflp4vjgb7jgovloLTlkIjjga/lpJbpg6jjg6rjg7Pjgq/jgajjgZfjgabmibHjgYZcclxuICAgICAgICAgICAgLy8gbWFpbHRvIOOBp+Wni+OBvuOCi+WgtOWQiOOBr+OAgeODh+ODleOCqeODq+ODiOOBruWLleS9nOOCkuOBleOBm+OCi1xyXG4gICAgICAgICAgICBpZihocmVmKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaHJlZi5pbmRleE9mKFwiaHR0cDovL1wiKSA9PT0gMCB8fFxyXG4gICAgICAgICAgICAgICAgICAgIGhyZWYuaW5kZXhPZihcImh0dHBzOi8vXCIpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxpbmsuYXR0cih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0XCI6IFwiX2JsYW5rXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVsXCI6IFwiZXh0ZXJuYWxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLW5vLXZjbGljay1oYW5kbGVcIjogXCJ0cnVlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhyZWYuaW5kZXhPZihcIm1haWx0b1wiKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRsaW5rLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlbFwiOiBcImV4dGVybmFsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YS1uby12Y2xpY2staGFuZGxlXCI6IFwidHJ1ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBgc3RyaW5nYOOCkiA8Y29kZT5zdHJpbmc8L2NvZGU+IOOBq+e9ruaPm+OBmeOCi1xyXG4gICAgICogQHBhcmFtICAkcGFyZW50c1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYWN0aXZhdGVJbmxpbmVDb2RlKCRwYXJlbnRzOiBKUXVlcnkpOiB2b2lkIHtcclxuICAgICAgICAvLyBwLCBsaSDjgr/jgrDjgpLmjqLjgZlcclxuICAgICAgICBjb25zdCAkZWxlbXMgPSAkcGFyZW50cy5maW5kKFwicCwgbGlcIik7XHJcbiAgICAgICAgJGVsZW1zLmVhY2goKGluZGV4LCBlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtID0gJChlbGVtKTtcclxuICAgICAgICAgICAgY29uc3QgaHRtbCA9ICRlbGVtLmh0bWwoKTtcclxuICAgICAgICAgICAgLy8gXCJgXCIg44Gn5YiG5Ymy44GZ44KLXHJcbiAgICAgICAgICAgIGNvbnN0IHNwbGl0cyA9IGh0bWwuc3BsaXQoXCJgXCIpO1xyXG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IHNwbGl0cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBuZXdIdG1sID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIC8vIDxjb2RlPiA8L2NvZGU+IOOCkuaMv+WFpVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIG5ld0h0bWwgKz0gc3BsaXRzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgJSAyID09PSAwICYmIGkgPCBjb3VudCAtIDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdIdG1sICs9IFwiPGNvZGU+XCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgJSAyID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3SHRtbCArPSBcIjwvY29kZT5cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkZWxlbS5odG1sKG5ld0h0bWwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGlnbmxpZ2h0LmpzIOOCkuacieWKueWMluOBmeOCi1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYWN0aXZhdGVIaWdobGlnaHQoJHBhcmVudHM6IEpRdWVyeSk6IHZvaWQge1xyXG4gICAgICAgIC8vIDxwcmUgY2xhc3M9XCJobGpzcHJlXCI+PC9wcmU+IOOBruS4rei6q+OCkiBIVE1MIOOCqOOCueOCseODvOODl+OBl+OAgTxjb2RlPiDjgacgd3JhcCDjgZnjgotcclxuICAgICAgICBjb25zdCAkaGxqc3ByZSA9ICRwYXJlbnRzLmZpbmQoXCIuaGxqc3ByZVwiKTtcclxuICAgICAgICAkaGxqc3ByZS5lYWNoKChpbmRleCwgZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkZWxlbSA9ICQoZWxlbSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9ICRlbGVtLmF0dHIoXCJjbGFzc1wiKTtcclxuICAgICAgICAgICAgY29uc3QgaHRtbCA9ICRlbGVtLmh0bWwoKTtcclxuICAgICAgICAgICAgY29uc3QgJGNvZGUgPSAkKFwiPGNvZGUgLz5cIikuaHRtbChfLmVzY2FwZShodG1sKSk7XHJcbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgICRjb2RlLmFkZENsYXNzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJGNvZGUucmVtb3ZlQ2xhc3MoXCJobGpzcHJlXCIpO1xyXG4gICAgICAgICAgICAkZWxlbS5lbXB0eSgpO1xyXG4gICAgICAgICAgICAkZWxlbS5hcHBlbmQoJGNvZGUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyA8cHJlPjxjb2RlPi4uLjwvY29kZT48L3ByZT4g44KS5o6i44GZXHJcbiAgICAgICAgY29uc3QgJGVsZW1zID0gJHBhcmVudHMuZmluZChcInByZSBjb2RlXCIpO1xyXG4gICAgICAgICRlbGVtcy5lYWNoKChpbmRleCwgZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICAoPGFueT53aW5kb3cpLmhsanMuaGlnaGxpZ2h0QmxvY2soZWxlbSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXX0=