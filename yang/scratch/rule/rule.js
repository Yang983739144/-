var t = require("../../api.js"),
    e = getApp();
Page({
    data: {},
    onLoad: function(a) {
        var s = this;
        e.pageOnLoad(this), e.request({
            url: t.scratch.setting,
            success: function(t) {
                0 == t.code && s.setData({
                    rule: t.data.setting.rule
                })
            }
        })
    }
});