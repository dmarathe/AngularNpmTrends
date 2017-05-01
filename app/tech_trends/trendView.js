'use strict';

angular.module('myApp.trendView', ['ngRoute', 'nvd3'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/trendView', {
    templateUrl: 'tech_trends/trendView.html',
    controller: 'TrendCtrl'
  });
}])

.controller('TrendCtrl', ['$scope', 'npmTrends', function($scope, npmTrends) {
  var tech = ['react', 'angular', 'backbone', 'ember', 'jquery', 'vue'];
  var map = {}

   $scope.technologies = [{key:'react', class:'blue',value:'ReactJS'}, {key:'angular', class:'orange', value:'AngularJS'}, {key:'backbone', class:'green', value:'Backbone.JS'}, {key:'ember', class:'red', value:'EmberJS'}, {key:'jquery', class:'purple',value:'JQuery'}, {key:'vue', class:'brown', value:'Vue.js'}]
  var removedTech = [];
  var colorMap = {react : "#1F77B4", angular : "#FF7F0E", backbone : "#2CA02C", ember : "#D62728", jquery : "#9467BD", vue : "#8C564B"}
  $scope.options = {
    chart: {
      type: 'cumulativeLineChart',
      height: 450,
      margin : {
        top: 80,
        right: 120,
        bottom: 60,
        left: 125
      },
      x: function(d){ return d[0]; },
      y: function(d){ return d[1]; },
      average: function(d) { return d.mean/100; },

      color: function(d){
        // var k = d.key
        return colorMap[d.key];
      },
      duration: 300,
      useInteractiveGuideline: true,
      clipVoronoi: false,

      xAxis: {
        axisLabel: 'X Axis',
        tickFormat: function(d) {
            return d3.time.format('%m/%d/%y')(new Date(d))
        },
        showMaxMin: true,
        staggerLabels: true
      },

      yAxis: {
        axisLabel: 'Y Axis',
        tickFormat: function(d){
            return d3.format(',.1%')(d);
        },
        showMaxMin: true,
        axisLabelDistance: 20
      }
    }
  };
  function indexOfObject(a,key){
    for(var i = 0; i < a.length; i++){
      if(a[i].key === key){
        return  i; 
      }
    }
    return -1;
  }
  // $scope.data = [];
  $scope.updateData = function(){
    //console.log(this.obj);
    var data = $scope.data;
    var key = this.obj.key
    var present =indexOfObject(data,key)
    if(present === -1){
       var j = indexOfObject(removedTech,key);
       $scope.data = data.concat(removedTech.splice(j,1));
    }else{
      removedTech = removedTech.concat(data.splice(present,1));
    }
  }
  npmTrends.getAllCounts(tech).then(function(data){
    console.log(data);
    $scope.data = data;
  }, function failure(reason){
    console.log(reason);
  })
}]);