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
  },
  addLineManage (context, data) {
    return http.sendPost({action: 'line.addLineManage', data: data})
  },
  getLineManageList (context, data) {
    return http.sendPost({action: 'line.getLineManageList', data: data})
  },
  removeLine (context, data) {
    return http.sendPost({action: 'line.removeLine', data: data})
  },
  smsNotice (context, data) {
    return http.sendPost({action: 'line.smsNotice', data: data})
  },
  addOrUpdateCity (context, data) {
    return http.sendPost({action: 'line.updateOrAddCity', data: data})
  },
  addOrUpdateFleet (context, data) {
    return http.sendPost({action: 'fleet.addOrUpdateFleet', data: data})
  },
  getFleetList (context, data) {
    return http.sendPost({action: 'fleet.getFleetList', data: data})
  },
  removeFleet (context, data) {
    return http.sendPost({action: 'fleet.removeFleet', data: data})
  },
  getCarList (context, data) {
    return http.sendPost({action: 'fleet.getCarList', data: data})
  },
  addOrUpdateCar (context, data) {
    return http.sendPost({action: 'fleet.addOrUpdateCar', data: data})
  },
  removeCar (context, data) {
    return http.sendPost({action: 'fleet.removeCar', data: data})
  },
  distributionFleet (context, data) {
    return http.sendPost({action: 'fleet.distributionFleet', data: data})
  }
};

export default actions;

