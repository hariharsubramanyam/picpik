'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', ["$scope", function($scope) {
  	$scope.pics = [];
    $scope.selected_pics = {};
  	var num_pics_registered = 0;
  	for(var i = 1; i <=50; i++){
  		$scope.pics.push("../assets/pictures/pic"+i+".jpg");
      $scope.selected_pics[$scope.pics[i]] = false;
  	}
    $scope.init = function(){
    	num_pics_registered += 1;
    	if(num_pics_registered == $scope.pics.length){
    		$('.gridly').gridly({
	      		base: 60, // px
	      		gutter: 20, // px
	      		columns: 12
	    	});
    	}
    };
    $scope.on_pick_click = function(pic_name){
      $scope.selected_pics[pic_name] = true;
    };

  }]);
