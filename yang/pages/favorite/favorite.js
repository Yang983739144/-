var a = require("../../api.js"), t = getApp();

Page({
    data: {
        swiper_current: 0,
        goods: {
            list: null,
            is_more: !0,
            is_loading: !1,
            page: 1
        },
        topic: {
            list: null,
            is_more: !0,
            is_loading: !1,
            page: 1
        }
    },
    onLoad: function(a) {
        t.pageOnLoad(this), this.loadGoodsList({
            reload: !0,
            page: 1
        }), this.loadTopicList({
            reload: !0,
            page: 1
        });
    },
    tabSwitch: function(a) {
        var t = this, o = a.currentTarget.dataset.index;
        t.setData({
            swiper_current: o
        });
    },
    swiperChange: function(a) {
        this.setData({
            swiper_current: a.detail.current
        });
    },
    loadGoodsList: function(o) {
        var i = this;
        i.data.goods.is_loading || o.loadmore && !i.data.goods.is_more || (i.data.goods.is_loading = !0, 
        i.setData({
            goods: i.data.goods
        }), t.request({
            url: a.user.favorite_list,
            data: {
                page: o.page
            },
            success: function(a) {
                0 == a.code && (o.reload && (i.data.goods.list = a.data.list), o.loadmore && (i.data.goods.list = i.data.goods.list.concat(a.data.list)), 
                i.data.goods.page = o.page, i.data.goods.is_more = a.data.list.length > 0, i.setData({
                    goods: i.data.goods
                }));
            },
            complete: function() {
                i.data.goods.is_loading = !1, i.setData({
                    goods: i.data.goods
                });
            }
        }));
    },
    goodsScrollBottom: function() {
        var a = this;
        a.loadGoodsList({
            loadmore: !0,
            page: a.data.goods.page + 1
        });
    },
    loadTopicList: function(o) {
        var i = this;
        i.data.topic.is_loading || o.loadmore && !i.data.topic.is_more || (i.data.topic.is_loading = !0, 
        i.setData({
            topic: i.data.topic
        }), t.request({
            url: a.user.topic_favorite_list,
            data: {
                page: o.page
            },
            success: function(a) {
                0 == a.code && (o.reload && (i.data.topic.list = a.data.list), o.loadmore && (i.data.topic.list = i.data.topic.list.concat(a.data.list)), 
                i.data.topic.page = o.page, i.data.topic.is_more = a.data.list.length > 0, i.setData({
                    topic: i.data.topic
                }));
            },
            complete: function() {
                i.data.topic.is_loading = !1, i.setData({
                    topic: i.data.topic
                });
            }
        }));
    },
    topicScrollBottom: function() {
        var a = this;
        a.loadTopicList({
            loadmore: !0,
            page: a.data.topic.page + 1
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onReachBottom: function() {
        this.loadMoreGoodsList();
    }
});