lineService = function($http, $q, $modal) {


  settings = {
    server_url: "http://localhost",
    port: 8080
  }

  var getLinesHist = function(urlImage, top, left, bottom, right) {

    var data_send = {
      "url": urlImage,
      "top": top,
      "bottom": bottom,
      "left": left,
      "right": right,
    };

    var d = $q.defer();
    var service_url = settings.server_url + ":" + settings.port + "/segmentation/textline/hist";
    console.log("Sending request", service_url, data_send);
    $http({
      method: 'POST',
      url: service_url,
      data: data_send,
    }).success(function(data) {
      console.log("Histogram textline segmentation successful", data);
      d.resolve(data);
    }).error(function(data, status) {
      console.log("Something is wrong", data, status);
    });

    return d.promise;

  };

  var getLinesGabor = function(urlImage, top, left, bottom, right, linkingRectWidth, linkingRectHeight) {

    var data_send = {
      "url": urlImage,
      "top": top,
      "bottom": bottom,
      "left": left,
      "right": right,
      "linkingRectWidth": linkingRectWidth,
      "linkingRectHeight": linkingRectHeight
    };

    var d = $q.defer();
    var service_url = settings.server_url + ":" + settings.port + "/segmentation/textline/gabor";
    console.log("Sending request", service_url, data_send);
    $http({
      method: 'POST',
      url: service_url,
      data: data_send,
    }).success(function(data) {
      console.log("Gabor textline segmentation successful", data);
      d.resolve(data);
    }).error(function(data, status) {
      console.log("Something is wrong", data, status);
    });

    return d.promise;

  };

  return {
    getLinesHist: getLinesHist,
    getLinesGabor: getLinesGabor
  }


}

teiService = function($http, $q) {


  var teiModel = {
    listOfPages: [],
    teiInfo: null,

  };
  var currentPage = null;

  var loadJSONModel = function(model_url) {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: model_url,

      }).success(function(data) {
        console.log("Loading the model", data);
        d.resolve(data);
      }).error(function(data, status) {
        console.log("Error when loading the model", data, status);
      });

      return d.promise;
    }
    // Stores the teiModel
  return {
    teiModel: teiModel,
    currentPage: currentPage,
    loadJSONModel: loadJSONModel

  }


}

// This service is used for open a model window asking for something

questionService = function($modal) {

  confirm = function(title, message) {
    var modalInstance = $modal.open({
      templateUrl: 'snippets/modalTemplate.html',
      controller: function($scope, $modalInstance, title, message) {
        $scope.message = message;
        $scope.title = title;
        $scope.ok = function() {
          $modalInstance.close();
        };
        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };
      },
      //size: size,
      resolve: {
        message: function() {
          return message;
        },
        title: function() {
          return title;
        }
      }
    });

    return modalInstance.result;
  };

  return {
    confirm: confirm
  }
}
