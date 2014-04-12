'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);
controllers.directive('myPostRepeatDirective', function() {
  return function(scope, element, attrs) {
    if (scope.$last){
      // iteration is complete, do whatever post-processing
      // is necessary
      $('.gridly.maingroup_gridly').gridly({
        base: 60, // px
        gutter: 20, // px
        columns: 15
      });

      $('.gridly.subgroup_gridly').gridly({
        base: 25, // px
        gutter: 5, // px
        columns: 20
      });
    }
  };
});
  controllers.controller('MyCtrl1', ["$scope", "$filter", function($scope, $filter) {
  	$scope.pics = [];
    $scope.pic_dimension = 140;
    $scope.tags = [
      {
        name:"Harihar",
        count:0,
        color:"blue",
      },
      {
        name:"Cosmos",
        count:30,
        color:"red"
      },
      {
        name:"Lars",
        count:50,
        color:"green"
      },
      {
        name:"Beneah",
        count:20,
        color:"orange"
      }
    ];

    var current_selected_image = null;
  	for(var i = 1; i <=50; i++){
  		$scope.pics.push({
        src:"../assets/pictures/pic"+i+".jpg",
        selected_class:"unselected_image",
        tags: []
      });
  	}

    $scope.pic_data = pic_data;


    $scope.init = function(){
      //draw_gridly();
    }

    $scope.numPics = function(){
      return $scope.pics.length;
    };
    
    $scope.on_pic_click = function(pic){
      if(pic.selected_class == "selected_image"){
        pic.selected_class = "unselected_image";
      }else{
        pic.selected_class = "selected_image";
      }
    };


  }]);
