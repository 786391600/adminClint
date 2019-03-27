import http from '../http.js'
const actions = {
  getCommodityList (context, data) {
    return http.sendPost({action: 'commodity.getCommodityList', data: data})
  },
  addCommodity (context, data) {
    return http.sendPost({action: 'commodity.addCommodity', data: data})
  },
  removeCommodity (context, data) {
    return http.sendPost({action: 'commodity.removeCommodity', data: data})
  },
  getOrderList (context, data) {
    return http.sendPost({action: 'order.getOrderList', data: data})
  },
  removeImage(context, data) {
    return http.sendPost({action: 'commodity.removeImage', data: data})
  },
  addActivity (context, data) {
    return http.sendPost({action: 'activity.addActivity', data: data})
  },
  getActivityList (context, data) {
    return http.sendPost({action: 'activity.getActivityList', data: data})
  },
  removeActivity (context, data) {
    return http.sendPost({action: 'activity.removeActivity', data: data})
  },
  addMerchants (context, data) {
    return http.sendPost({action: 'merchants.addMerchants', data: data})
  },
  getMerchantsList (context, data) {
    return http.sendPost({action: 'merchants.getMerchantsList', data: data})
  },
  removeMerchants (context, data) {
    return http.sendPost({action: 'merchants.removeMerchants', data: data})
  },
  addArticle (context, data) {
    return http.sendPost({action: 'article.addArticle', data: data})
  },
  getArticleList (context, data) {
    return http.sendPost({action: 'article.getArticleList', data: data})
  }
};

export default actions;

