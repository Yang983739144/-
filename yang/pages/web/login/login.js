var n = require("../../../api.js"), e = getApp();

Page({
    data: {},
    onLoad: function(n) {
        e.pageOnLoad(this);
    },
    onReady: function() {
        e.pageOnReady(this);
    },
    onShow: function() {
        e.pageOnShow(this);
    },
    onHide: function() {
        e.pageOnHide(this);
    },
    onUnload: function() {
        e.pageOnUnload(this);
    },
    loginSubmit: function() {
        var o = this.options.scene || !1;
        if (!o) return wx.showModal({
            title: "提示",
            content: "无效的Token，请刷新页面后重新扫码登录",
            showCancel: !1,
            success: function(n) {
                n.confirm && wx.redirectTo({
                    url: "/pages/index/index"
                });
            }
        }), !1;
        wx.showLoading({
            title: "正在处理",
            mask: !0
        }), e.request({
            url: n.user.web_login + "&token=" + o,
            success: function(n) {
                wx.hideLoading(), wx.showModal({
                    title: "提示",
                    content: n.msg,
                    showCancel: !1,
                    success: function(n) {
                        n.confirm && wx.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    }
});