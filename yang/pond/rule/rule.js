var e = require("../../api.js"),
    t = getApp();
Page({
    data: {},
    onLoad: function(a) {
        var s = this;
        t.pageOnLoad(this), t.request({
            url: e.pond.setting,
            success: function(e) {
                0 != e.code || s.setData({
                    rule: e.data.rule
                })
            }
        })
    }
});