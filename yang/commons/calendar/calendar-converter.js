var a, n, e;

getApp();

Page({
    data: {},
    onLoad: function(t) {
        var r = new Date(), o = r.getFullYear(), c = r.getMonth() + 1;
        n = r.getDate();
        var g, i = r.getDay(), S = 7 - (n - i) % 7;
        1 == c || 3 == c || 5 == c || 7 == c || 8 == c || 10 == c || 12 == c ? g = 31 : 4 == c || 6 == c || 9 == c || 11 == c ? g = 30 : 2 == c && (g = (o - 2e3) % 4 == 0 ? 29 : 28), 
        null != wx.getStorageSync("calendarSignData") && "" != wx.getStorageSync("calendarSignData") || wx.setStorageSync("calendarSignData", new Array(g)), 
        null != wx.getStorageSync("calendarSignDay") && "" != wx.getStorageSync("calendarSignDay") || wx.setStorageSync("calendarSignDay", 0), 
        a = wx.getStorageSync("calendarSignData"), e = wx.getStorageSync("calendarSignDay"), 
        this.setData({
            year: o,
            month: c,
            nbsp: S,
            monthDaySize: g,
            date: n,
            calendarSignData: a,
            calendarSignDay: e
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    register_rule: function() {
        this.setData({
            register_rule: !0
        });
    },
    hideModal: function() {
        this.setData({
            register_rule: !1
        });
    },
    calendarSign: function() {
        a[n] = n, e += 1, wx.setStorageSync("calendarSignData", a), wx.setStorageSync("calendarSignDay", e), 
        wx.showToast({
            title: "签到成功",
            icon: "success",
            duration: 2e3
        }), this.setData({
            calendarSignData: a,
            calendarSignDay: e
        });
    }
});