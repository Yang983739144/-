var e = require("../../api.js"), d = getApp();

Page({
    data: {
        order_refund: null,
        express_index: null
    },
    onLoad: function(n) {
        d.pageOnLoad(this);
        var r = this;
        wx.showLoading({
            title: "正在加载"
        }), d.request({
            url: e.order.refund_detail,
            data: {
                order_refund_id: n.id
            },
            success: function(e) {
                0 == e.code && r.setData({
                    order_refund: e.data
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    viewImage: function(e) {
        var d = this, n = e.currentTarget.dataset.index;
        wx.previewImage({
            current: d.data.order_refund.refund_pic_list[n],
            urls: d.data.order_refund.refund_pic_list
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    copyinfo: function(e) {
        wx.setClipboardData({
            data: e.target.dataset.info,
            success: function(e) {
                wx.showToast({
                    title: "复制成功！",
                    icon: "success",
                    duration: 2e3,
                    mask: !0
                });
            }
        });
    },
    bindExpressPickerChange: function(e) {
        this.setData({
            express_index: e.detail.value
        });
    },
    sendFormSubmit: function(d) {
        var n = this;
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: e.order.refund_send,
            method: "POST",
            data: {
                order_refund_id: n.data.order_refund.order_refund_id,
                express: null !== n.data.express_index ? n.data.order_refund.express_list[n.data.express_index].name : "",
                express_no: d.detail.value.express_no
            },
            success: function(e) {
                wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(d) {
                        0 == e.code && wx.redirectTo({
                            url: "/pages/order-refund-detail/order-refund-detail?id=" + n.data.order_refund.order_refund_id
                        });
                    }
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    }
});