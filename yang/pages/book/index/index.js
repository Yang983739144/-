var t = require("../../../api.js"), a = getApp(), o = 2;

Page({
    data: {
        cid: 0,
        scrollLeft: 600,
        scrollTop: 0,
        emptyGoods: 0,
        page_count: 0,
        cat_show: 1,
        cid_url: !1,
        quick_icon: !0
    },
    onLoad: function(t) {
        if (this.systemInfo = wx.getSystemInfoSync(), a.pageOnLoad(this), t.cid) {
            var o = t.cid;
            return console.log("cid=>" + o), this.setData({
                cid_url: !1
            }), void this.switchNav({
                currentTarget: {
                    dataset: {
                        id: t.cid
                    }
                }
            });
        }
        this.setData({
            cid_url: !0
        }), this.loadIndexInfo(this);
    },
    quickNavigation: function() {
        this.setData({
            quick_icon: !this.data.quick_icon
        });
        this.data.store;
        var t = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        });
        this.data.quick_icon ? t.opacity(0).step() : t.translateY(-55).opacity(1).step(), 
        this.setData({
            animationPlus: t.export()
        });
    },
    onReady: function() {},
    onShow: function() {
        a.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onShareAppMessage: function() {},
    loadIndexInfo: function(o) {
        var e = o;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), a.request({
            url: t.book.index,
            method: "get",
            success: function(t) {
                0 == t.code && (setTimeout(function() {
                    wx.hideLoading();
                }, 1e3), e.setData({
                    cat: t.data.cat,
                    banner: t.data.banner,
                    ad: t.data.ad,
                    goods: t.data.goods.list,
                    cat_show: t.data.cat_show,
                    page_count: t.data.goods.page_count
                }), t.data.goods.page >= t.data.goods.page_count && e.setData({
                    emptyGoods: 1
                }));
            }
        });
    },
    switchNav: function(e) {
        var s = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        });
        var i = 0;
        if (o = 2, i != e.currentTarget.dataset.id || 0 == e.currentTarget.dataset.id) {
            i = e.currentTarget.dataset.id;
            var n = this.systemInfo.windowWidth, d = e.currentTarget.offsetLeft, c = this.data.scrollLeft;
            c = d > n / 2 ? d : 0, s.setData({
                cid: i,
                page: 1,
                scrollLeft: c,
                scrollTop: 0,
                emptyGoods: 0,
                goods: [],
                show_loading_bar: 1
            }), a.request({
                url: t.book.list,
                method: "get",
                data: {
                    cid: i
                },
                success: function(t) {
                    if (0 == t.code) {
                        setTimeout(function() {
                            wx.hideLoading();
                        }, 1e3);
                        var a = t.data.list;
                        t.data.page_count >= t.data.page ? s.setData({
                            goods: a,
                            page_count: t.data.page_count,
                            row_count: t.data.row_count,
                            show_loading_bar: 0
                        }) : s.setData({
                            emptyGoods: 1
                        });
                    }
                }
            });
        }
    },
    onReachBottom: function(e) {
        var s = this;
        if (1 != s.data.emptyGoods && 1 != s.data.show_loading_bar) {
            s.setData({
                show_loading_bar: 1
            });
            var i = s.data.cid;
            a.request({
                url: t.book.list,
                method: "get",
                data: {
                    page: o,
                    cid: i
                },
                success: function(t) {
                    if (0 == t.code) {
                        var a = s.data.goods;
                        t.data.page >= o && Array.prototype.push.apply(a, t.data.list), t.data.page_count >= o ? s.setData({
                            goods: a,
                            page: t.data.page,
                            page_count: t.data.page_count,
                            row_count: t.data.row_count,
                            show_loading_bar: 0
                        }) : s.setData({
                            emptyGoods: 1
                        }), o++;
                    }
                }
            });
        }
    }
});