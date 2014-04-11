'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', ["$scope", function($scope) {
  	$scope.pics = [];
    $scope.tags = [
      {
        name:"Harihar",
        count:0,
        color:"blue"
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

  	var num_pics_registered = 0;
  	for(var i = 1; i <=50; i++){
  		$scope.pics.push({
        src:"../assets/pictures/pic"+i+".jpg",
        selected_class:"unselected_image"
      });
  	}

    $scope.init = function(){
    	num_pics_registered += 1;
    	if(num_pics_registered == $scope.pics.length){
    		$('.gridly').gridly({
	      		base: 60, // px
	      		gutter: 20, // px
	      		columns: 13
	    	});
    	}
    };

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
