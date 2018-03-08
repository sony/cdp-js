﻿(function (global) {
    var frameworks = ["cdp"];
    if (null != global.orientation) {
        frameworks.push("cordova");
    }
    require(frameworks, function (CDP) {
        CDP.initialize()
            .done(function () {
            // start application
            require(["app"], function (app) { return app.main(); });
        });
    });
})(this);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9hcHAvc2NyaXB0cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFDLFVBQUMsTUFBTTtJQUNKLElBQU0sVUFBVSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzdCLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNELE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBQyxHQUFHO1FBQ3BCLEdBQUcsQ0FBQyxVQUFVLEVBQUU7YUFDWCxJQUFJLENBQUM7WUFDRixvQkFBb0I7WUFDcEIsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBQyxHQUFHLElBQUssT0FBQSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQVYsQ0FBVSxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiKChnbG9iYWwpID0+IHtcclxuICAgIGNvbnN0IGZyYW1ld29ya3MgPSBbXCJjZHBcIl07XHJcbiAgICBpZiAobnVsbCAhPSBnbG9iYWwub3JpZW50YXRpb24pIHtcclxuICAgICAgICBmcmFtZXdvcmtzLnB1c2goXCJjb3Jkb3ZhXCIpO1xyXG4gICAgfVxyXG4gICAgcmVxdWlyZShmcmFtZXdvcmtzLCAoQ0RQKSA9PiB7XHJcbiAgICAgICAgQ0RQLmluaXRpYWxpemUoKVxyXG4gICAgICAgICAgICAuZG9uZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBzdGFydCBhcHBsaWNhdGlvblxyXG4gICAgICAgICAgICAgICAgcmVxdWlyZShbXCJhcHBcIl0sIChhcHApID0+IGFwcC5tYWluKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KSh0aGlzKTtcclxuIl19