angular.module('npmTrendsService', [])
  .service('npmTrends', function($http, $q) {
      this.getFormatedDate = function(date) {
        return date.toISOString().substring(0, 10);
      };

      this.getBasePackageUrl = function() {
        var today = new Date();
        var sevenDaysBack = new Date();
        sevenDaysBack.setDate(sevenDaysBack.getDate() -50);
        var url = 'https://api.npmjs.org/downloads/range/' + 
          this.getFormatedDate(sevenDaysBack) +
         ':' + this.getFormatedDate(today) + '/';

         return url;
      }

      this.getDownloadCount = function (package) {
          var defer = $q.defer();
          var url = this.getBasePackageUrl() +package;
          
          $http.get(url).then(function(response) {
            // process data for D3 format
            var info = response.data;
            values = [];
            angular.forEach(info.downloads, function(val){
              values.push([
                (new Date(val.day)).getTime(),
                val.downloads
              ]);
            })
            var data = {
              key: info.package,
              values: values
            };
            defer.resolve(data);
          }, function(response) {
            defer.reject(response);
          });

          return defer.promise;
      }

      // @param packages - array of package names
      this.getAllCounts = function(packages) {
        var defer = $q.defer();
        var allPackageInfoPromises = [];
        var _this = this;
        angular.forEach(packages, function(package) {
          allPackageInfoPromises.push(_this.getDownloadCount(package));
        });

        $q.all(allPackageInfoPromises).then(function(value){
          defer.resolve(value);
        }, function(reason) {
          defer.reject('Sorry there was problem fetching data');
        });
        return defer.promise;
      }
});