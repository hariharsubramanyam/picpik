'use strict';

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
    $scope.MODE_VISIBLE = 1;
    $scope.MODE_FAVORITE = 2;
    $scope.MODE_DELETED = 3;
    $scope.selected_pictures = [];
    $(".navbar-form").hide();
    $scope.pic_data = pic_data;
    $scope.favorite_pictures = [];
    $scope.deleted_pictures = [];
    $scope.tags = [
      {
        name:"Harihar",
        count:25,
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

    $scope.onTagButtonClick = function(){
      console.log("Tag button clicked");
      $("#tag_modal").modal("show");
    };

    $scope.onSelectButtonClick = function(){
      console.log("Select button clicked");
    };

    $scope.onPreviewButtonClick = function(){
      console.log("Preview button clicked");
    };

    $scope.onDeleteButtonClick = function(){
      for(var i = 0; i < $scope.selected_pictures.length; i++){
        $scope.selected_pictures[i].mode = $scope.MODE_DELETED;
      }
      $scope.deselectAll();
      $('.gridly').each(function(index, value){
        console.log(value);
      });
    };

    $scope.onGroupButtonClick = function(){
      console.log("Group button clicked");
    };


    $scope.init = function(pic){
      pic.selected_class = "unselected_image";
      pic.tags = [];
      pic.mode = $scope.MODE_VISIBLE;
    }

    $scope.numPics = function(){
      var num = 0;
      for(var i = 0; i < $scope.pic_data.length; i++){
        num += $scope.pic_data[i].pictures.length;
        for(var j = 0; j < $scope.pic_data[i].subgroups.length; j++){
          num += $scope.pic_data[i].subgroups[j].pictures.length;
        }
      }
      return num;
    };
    
    $scope.on_pic_click = function(pic){
      if(pic.selected_class == "selected_image"){
        pic.selected_class = "unselected_image";
        $scope.selected_pictures.splice($.inArray(pic, $scope.selected_pictures),1);
      }else{
        pic.selected_class = "selected_image";
        $scope.selected_pictures.push(pic);
      }
      if($scope.selected_pictures.length > 0){
        $(".navbar-form").show();
      }else{
        $(".navbar-form").hide();
      }
    };

    $scope.deselectAll = function(){
      for(var i = 0; i < $scope.selected_pictures.length; i++){
        $scope.selected_pictures[i].selected_class = "unselected_image";
      }
      $scope.selected_pictures = [];
      $(".navbar-form").hide();
    };

  }]);
