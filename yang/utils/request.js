module.exports = function(a) {
    a.data || (a.data = {});
    var t = wx.getStorageSync("access_token");
    t && (a.data.access_token = t), a.data._uniacid = this.siteInfo.uniacid, a.data._acid = this.siteInfo.acid, 
    a.data._version = this._version, "undefined" != typeof wx && (a.data._platform = "wx"), 
    "undefined" != typeof my && (a.data._platform = "my"), wx.request({
        url: a.url,
        header: a.header || {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: a.data || {},
        method: a.method || "GET",
        dataType: a.dataType || "json",
        success: function(t) {
            -1 == t.data.code ? getApp().login() : -2 == t.data.code ? wx.redirectTo({
                url: "/pages/store-disabled/store-disabled"
            }) : a.success && a.success(t.data);
        },
        fail: function(t) {
            console.warn("--- request fail >>>"), console.warn(t), console.warn("<<< request fail ---");
            var e = getApp();
            e.is_on_launch ? (e.is_on_launch = !1, wx.showModal({
                title: "网络请求出错",
                content: t.errMsg,
                showCancel: !1,
                success: function(t) {
                    t.confirm && a.fail && a.fail(t);
                }
            })) : (wx.showToast({
                title: t.errMsg,
                image: "/images/icon-warning.png"
            }), a.fail && a.fail(t));
        },
        complete: function(t) {
            200 != t.statusCode && t.data.code && 500 == t.data.code && wx.showModal({
                title: "系统错误",
                content: t.data.data.type + "\r\n事件ID:" + t.data.data.event_id,
                cancelText: "关闭",
                confirmText: "复制",
                success: function(e) {
                    e.confirm && wx.setClipboardData({
                        data: t.data.data.type + "\r\n事件ID:" + t.data.data.event_id + "\r\n " + a.url
                    });
                }
            }), a.complete && a.complete(t);
        }
    });
};