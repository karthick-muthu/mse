FrameworkApp.directive('lastpage', function () {
    return {
        restrict: 'C',
        link: function ($scope, $rootScope, elem, attrs) {
        },
        controller: function ($scope, $rootScope,$timeout) {
            $rootScope.pageStatusList[$rootScope.currentTopic][$rootScope.currentPage] = "1";
			$rootScope.isLastPage = true;
			$timeout(function(){
				$rootScope.isNextButtonDisabled = true;				
			});
			$scope.certificate = true;
			$scope.togglePage = function(){
				if($scope.certificate){
					$scope.certificate = false;				
				}else{
					$scope.certificate = true;
				}
			};
			$scope.print = function(){
				setTimeout(function(){
					window.print();	
				},500);
			}
			if($rootScope.CourseConfig.AppType.toLowerCase() != 'scorm1.2'){
				$rootScope.ScormnUsername = "Dummy Name";
			}
			$rootScope.assesmentPercentageScore = Math.round(($rootScope.assesmentScore / $rootScope.CourseConfig.AvailableAssessmentQuestion) * 100);
        }
    }
});

	
	(function() {

  FrameworkApp.directive('onlyLettersInput', onlyLettersInput);
  
  function onlyLettersInput() {
      return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
          function fromUser(text) {
            var transformedInput = text.replace(/[^a-zA-Z .]/g, '');
            //console.log(transformedInput);
            if (transformedInput !== text) {
              ngModelCtrl.$setViewValue(transformedInput);
              ngModelCtrl.$render();
            }
            return transformedInput;
          }
          ngModelCtrl.$parsers.push(fromUser);
        }
      };
    };

})();

FrameworkApp.directive('gotoPage', function () {
	$rootScope.assesmentScore = 0;	
    return {
        restrict: 'C',
        link: function ($scope, $rootScope, elem, attrs) {
        },
        controller: function ($scope, $rootScope) {
            $scope.gotoPageNum = function (e) {			
				if(e > 1){
					$rootScope.loadScreen($rootScope.currentModule, $rootScope.currentTopic, (e-1));
				}
				else{
					$rootScope.loadScreen($rootScope.currentModule, $rootScope.currentTopic, 0);
				}
            }
		$rootScope.gotoPage = true;
		$rootScope.isNextButtonDisabled = true;
		
        }
    }
});


FrameworkApp.directive('myPostRepeatDirective', function () {
    return function (scope, element, attrs) {
        if (scope.$last) {
            $('.-accordion').asAccordion({
                namespace: '-accordion',
                // accordion theme. WIP
            });
        }
    }
});

FrameworkApp.directive('verticalAccordian', function () {
		var counter = 0;
	    return {
        restrict: 'C',
		controller:function($rootScope){		
				if($rootScope.pageStatusList[$rootScope.currentTopic][$rootScope.currentPage]=="1"){
					setTimeout(function(){$(".dummyClas").parents("v-pane-header").addClass("visited")},1000);
					}       
            
		},
        link: function ($rootScope, scope, element, attrs) {
			$('.vAccordion--default').click(function(){
				counter = $(".visited").length;
				var len = $('v-pane-header').length;				
				if(counter === len){
					$rootScope.markVisitedPage();
				}					
			});
			$('v-pane-header').click(function(){
				
				
			});
		}
		
	}
});

FrameworkApp.directive('btnClickType3', function () {
	var tempVisited = '';
    return {
        restrict: 'CA',
        link: function ($scope, $rootScope, elem, attrs) {
			tempVisited = '';
        },
        controller: function ($scope, $rootScope,$timeout,$interval) {	
			$scope.disableClose = true;		
			if($rootScope.pageStatusList[$rootScope.currentTopic][$rootScope.currentPage]=="1"){
				$(".btnClickType3").addClass("visited");
				$scope.disableClose = false;
			}
			var tempVisit = '';
			var counter = 0 ;
			var timer;
			var timer1;
			$scope.clicked  = false;
			$scope.openpopup = false;
			
			$scope.active  = 1;
			$scope.disableNextBtn  = 1;
			$scope.count = 1;
			$scope.tCount = 0;
			$scope.showBluePatch = false;
			$scope.showGiveUp = false;
            $scope.clickCounter = [];
			$(".accordian-panel").hide();
            $scope.loadcontent = function (event, pItem,_type) {
				if($rootScope.pageStatusList[$rootScope.currentTopic][$rootScope.currentPage]!="1"){
					timer1 = $timeout(function(){
						$scope.disableClose = false;
					},3000);
				}else{
					$scope.disableClose = false;
				}
				$rootScope.checkInternet($rootScope.selectedLang);
				$scope.openpopup = true;
				$(".accordian-panel").show();
				$scope.count = parseInt(pItem.id);
				var flag = $('.clickables');
				if(!$(flag[0]).hasClass("markCompleted"))
				$(flag[0]).addClass("markCompleted");
				$(flag[pItem.id-1]).removeClass("markCompleted");
				$(tempVisit).addClass("markCompleted");
				tempVisit = $(flag[pItem.id-1]);
				$(".btnClickType3").removeClass("selected");
				$($(".btnClickType3")[$scope.count-1]).addClass("selected");
                $scope.Buttontext = pItem.text;
				$scope.clicked = true;
				$scope.checkCompletion($scope.count-1);
				if($scope.clickCounter.length > 0){
					$(tempVisited).addClass("visited");					
				}
				tempVisited = $(event.currentTarget);
				if(_type === "cType"){
					if($scope.clickCounter.indexOf(0) == -1){
						$scope.clickCounter.push(0);
					}
				}
			}
			$scope.onClickSend = function(){
				$scope.sendDisable=true;
				$scope.firstPopup=true;
				$scope.enableNext=true;
				$scope.disableNextBtn=0;
				$scope.$apply()
			}
			$scope.close = function(){
				$rootScope.checkInternet($rootScope.selectedLang);
				$(tempVisited).addClass("visited");
				$scope.openpopup = false;
				$scope.disableClose = true;
			};			
			$scope.onNextBack = function (state) {
				$rootScope.checkInternet($rootScope.selectedLang);
				if(state == 'back'){
					if(timer)
						$interval.cancel(timer)
					if($scope.count < 2) {
						return;
						$scope.Buttontext = $rootScope.CourseContent.btn_click_learn[$scope.count-1].text;
					}else{
						$scope.count--;
						$scope.Buttontext = $rootScope.CourseContent.btn_click_learn[$scope.count-1].text;						
					}
				}
				else if(state == 'next'){
					if($scope.count > $rootScope.CourseContent.btn_click_learn.length-1) return;//$scope.count = 0; //return;;
						$scope.count++;
						$scope.Buttontext = $rootScope.CourseContent.btn_click_learn[$scope.count-1].text;	
					$scope.showBluePatch = true;
					if($scope.count > $rootScope.CourseContent.btn_click_learn.length-1){
						$scope.timeShow = 0;
						timer = $interval(function(){
							$scope.timeShow++;
							if($scope.timeShow >= $rootScope.CourseContent.totalTIme){
								$scope.showGiveUp = true;	
								$interval.cancel(timer)								
							}
						},1000);
						
						$scope.$on('$destroy', function(){
							$interval.cancel(timer)
						});
						if(!$rootScope.CourseContent.btn_click_learn[$scope.count-1].sbBtn)
							$rootScope.markVisitedPage();
					}
				}
				
				var flag = $('.clickables');
				if(!$(flag[0]).hasClass("markCompleted"))
					$(flag[0]).addClass("markCompleted");
				$(flag[$scope.count-1]).removeClass("markCompleted");
				$(tempVisit).addClass("markCompleted");
				tempVisit = $(flag[$scope.count-1]);
				
				$scope.active = $scope.count;
			if(!$rootScope.CourseContent.btn_click_learn[$scope.count-1].sbBtn)
				$scope.checkCompletion($scope.count-1);
				if($scope.clickCounter.indexOf(0) == -1){
					$scope.clickCounter.push(0);
				}
			}
		
			$scope.getDisabledclass = function(id){
				if($scope.disableNextBtn==1 || id==2){
					return 'disabled';
					
				}
					
			}
			$scope.checkCompletion = function(_val){
				if($scope.clickCounter.indexOf(_val) == -1)
					$scope.clickCounter.push(_val)
				if($scope.clickCounter.length == $rootScope.CourseContent.btn_click_learn.length)
					$scope.markVisitedPage();
			};
			$scope.download = function(){
			};
			$scope.$on('$destroy', function(){
				$timeout.cancel(timer1)
			});
		}
    }
});


FrameworkApp.directive('resultpage', function () {
    return {
        restrict: 'AC',
        link: function ($scope, $rootScope, elem, attrs) {
        },
        controller: function ($scope, $rootScope) {
			var currentTime = new Date();
			var month = currentTime.getMonth() + 1;
			var day = currentTime.getDate();
			var year = currentTime.getFullYear();
			$scope.dateString=month + "/" + day + "/" + year;
			$(".menu-contain").css("pointer-events", "all");
			$('.menu-contain').css('opacity','1');
            $rootScope.assesmentStarted = false;
            $rootScope.pageStatusList[$rootScope.currentModule][$rootScope.currentTopic][$rootScope.currentPage] = "1";
            if ($rootScope.assesmentAttempted < $rootScope.CourseConfig.MaxAssesmentAttempt)
                $rootScope.showTryAgain = true;
            else
                $rootScope.showTryAgain = false;

            $rootScope.assesmentPercentageScore = Math.round(($rootScope.assesmentScore / $rootScope.CourseConfig.AvailableAssessmentQuestion) * 100);
			//console.log($rootScope.assesmentPercentageScore);			
			
			if ($rootScope.CourseConfig.AppType.toLowerCase() == 'scorm1.2') {
				if($rootScope.assesmentPercentageScore >= $rootScope.CourseConfig.MasteryScore){	
					parent.SCORM_SetScore($rootScope.assesmentPercentageScore);
					parent.SCORM_SetPassed();
				}                
				else {			
					parent.SCORM_SetScore($rootScope.assesmentPercentageScore);
					parent.SCORM_SetFailed();
				}				
				parent.SCORM_CallLMSCommit();
            }
            $scope.retakeAssesment = function () {
                $rootScope.assesmentScore = 0;
                $rootScope.assesmentQuestionIndex = [];
				$scope.questionsArray[0] = Math.ceil(Math.random()*5);
				$rootScope.quizCounter = $scope.questionsArray[0];
				//console.log($rootScope.quizCounter)
                $rootScope.assesmentStarted = true;
                $rootScope.isNextButtonDisabled = false;
                $rootScope.isPrevButtonDisabled = true;
                $rootScope.isLastQuestion = false;
				$rootScope.asmntScoreArray = [2,2,2,2,2];
				//$rootScope.loadVisualMenu();
				$rootScope.showResumeBtn = false;
				$rootScope.assesmentQuestionIndex[0] = 1;
				$rootScope.loadScreen($rootScope.currentModule, $rootScope.currentTopic, 0)
            }
			
			$scope.proceedToCertficate = function () {
				$scope.gotoNextPage();
				 $rootScope.isLastQuestion = false;
			};

        }
    }
});



FrameworkApp.directive('samc', function ($rootScope,$timeout) {
    return {
        restrict: 'AE',
        scope: {},
        template: '<ng-include src="getTemplateUrl()"/>',
        link: function (scope, elem, attrs) {
            var template = attrs.templateUrl;
            scope.getTemplateUrl = function () {
                return '../html5/Views/kc/' + template + '.html';
            };
                if (attrs.assesment == "true") {
					$(".menu-contain").css("pointer-events", "none");
					$('.menu-contain').css('opacity','0.5');
					$rootScope.isPrevButtonDisabled = true;
					$rootScope.isNextButtonDisabled = true;
					$(".next").removeClass("animNxt");
				}
            scope.selection = 1;
            scope.isBranching = false;
            scope.disableButton = true;
            scope.start = function () {
                scope.id = 0;
                scope.attempt = 0;
                scope.disableInput = false;
                scope.quizOver = false;
                scope.inProgress = true;
                scope.getQuestion();
                scope.feedbackToggle = false;
                scope.buttonText = $rootScope.CourseContent.submitText;
                scope.maxAttempt = $rootScope.CourseContent.maximumAttempt;
                scope.feedback = "";
                scope.feedback_bg = $rootScope.CourseContent.feedback_bg_path;
				
            };
			
			scope.manageQuestion = function(){
				
			};

            scope.reset = function () {
                scope.inProgress = false;
                scope.score = 0;
            };

            scope.onOptionSelected = function (pIndex) {
                if ($('input[name=answer]:checked').length > 0)
                    scope.disableButton = false;
                else
                    scope.disableButton = true;
                if ($(".kc-option").children().hasClass("option-selected")) {
                    $(".kc-option").children().removeClass("option-selected");
                }
                $("#options label").eq(pIndex).addClass("option-selected");

            };

            scope.getQuestion = function () {
                scope.options = $rootScope.CourseContent.question;
            };

            scope.checkAnswer = function () {
				$rootScope.blinkQuizWrapper=true;
                if (scope.buttonText == $rootScope.CourseContent.submitText) {
                    if (attrs.feedback == "true")
                        scope.feedbackToggle = true;
                    if (!$('input[name=answer]:checked').length) return;
                    if ($('input[name=answer]:checked').attr("correct") == "true") {
                        if (attrs.assesment == "true"){
                            $rootScope.assesmentScore++;		
							$rootScope.asmntScoreArray[$rootScope.quizCounter-1] = 1;
							$rootScope.isAnswered = true;
						}
                        scope.feedback = $rootScope.CourseContent.correct_feedback;
                        scope.disableButton = true;
                        scope.disableInput = true;
                        if (!$rootScope.CourseContent.branchingScreen)
                            $rootScope.markVisitedPage();
                        else {
                            scope.isBranching = true;
                        }
                    } else {
                        scope.feedback = $rootScope.CourseContent.incorrect_feedback;
						if(attrs.assesment == "true"){
							$rootScope.asmntScoreArray[$rootScope.quizCounter-1] = 0;
							$rootScope.isAnswered = true;
						}
                        if (scope.attempt < scope.maxAttempt - 1) {
                            scope.buttonText = $rootScope.CourseContent.resetText;
                            scope.disableInput = true;

                        }
                    }
                    if (attrs.tickmark == "true")
                        scope.checkUserAnswer();
                    scope.attempt++;
                }
                else {
                    scope.feedbackToggle = false;
                    $('input[name=answer]:checked').parent().parent().removeClass("correct");
                    $('input[name=answer]:checked').parent().parent().removeClass("in-correct");
                    $('input[name=answer]:checked').attr('checked', false);
                    scope.buttonText = $rootScope.CourseContent.submitText;
                    scope.disableInput = false;
                    scope.disableButton = true;
                    if ($(".kc-option").children().hasClass("option-selected")) {
                        $(".kc-option").children().removeClass("option-selected");
                    }

                }
                scope.answerMode = false;
                if (scope.attempt >= scope.maxAttempt) {
                    scope.disableInput = true;
                    scope.disableButton = true;
                    if (!$rootScope.CourseContent.branchingScreen)
                        $rootScope.markVisitedPage();
                    else {
                        scope.isBranching = true;
                    }
                    if (attrs.tickmark == "true")
                        scope.showAnswer();
                }
            };

            scope.checkUserAnswer = function () {
                if ($('input[name=answer]:checked').attr("correct") == "true") {
                    $('input[name=answer]:checked').parent().parent().addClass("correct")
                }
                else {
                    $('input[name=answer]:checked').parent().parent().addClass("in-correct")
                }
				
				//console.log("attrs.assesment "+attrs.assesment)
				if(attrs.assesment == "true"){
					scope.checkQuizCompletion();
				}
					
            };
			
			scope.checkQuizCompletion = function(){
				if($rootScope.currentPageNumber == $rootScope.totalPages-1){
					$rootScope.assesmentAttempted++;
					$timeout(function(){
						$rootScope.isLastQuestion = true;	
						$rootScope.pageStatusList[$rootScope.currentModule][$rootScope.currentTopic][$rootScope.currentPage+1] = "1"						
					},1000);
				}
			};
			
            scope.showAnswer = function () {
                var checkAnswer = document.getElementsByName('answer');
                for (var i = 0; i < checkAnswer.length; i++) {
                    if ($(checkAnswer[i]).attr("correct") == "true") {
                        $(checkAnswer[i]).parent().parent().addClass("correct");
						$('.kc-option-label').css('cursor', 'default');
                    }
                }
            }
            scope.nextQuestion = function () {
                scope.id++;
                scope.getQuestion();
            };
            scope.reset();
            scope.start();
        }
    }
});

FrameworkApp.directive('mamc', function ($rootScope,$timeout) {
    return {
        restrict: 'E',
        scope: {},
        template: '<ng-include src="getTemplateUrl()"/>',
        link: function (scope, elem, attrs) {
            var template = attrs.templateUrl;
            scope.getTemplateUrl = function () {
                return '../html5/Views/kc/' + template + '.html';
            };
            if (attrs.assesment == "true") {
                $rootScope.isPrevButtonDisabled = true;
                $rootScope.isNextButtonDisabled = true;
				$(".menu-contain").css("pointer-events", "none");
				$('.menu-contain').css('opacity','0.5');
				$(".next").removeClass("animNxt");
            }
            scope.selection = 1;
            scope.correctAnswer = [];
            scope.userAnswer = [];
            scope.options = "";
            scope.disableButton = true;
            scope.isBranching = false;
            scope.start = function () {
                scope.id = 0;
                scope.attempt = 0;
                scope.disableInput = false;
                scope.quizOver = false;
                scope.inProgress = true;
                scope.getQuestion();
                scope.feedbackToggle = false;
                scope.buttonText = $rootScope.CourseContent.submitText;
                scope.maxAttempt = $rootScope.CourseContent.maximumAttempt;
                scope.feedback = "";
                scope.feedback_bg = $rootScope.CourseContent.feedback_bg_path;
                scope.popuptext = $rootScope.CourseContent.popupcontent;
				scope.openpopup = false;

            };

            scope.reset = function () {
                scope.inProgress = false;
                scope.score = 0;
            };

            scope.onOptionSelected = function (pIndex) {
                if ($('input[name=answer]:checked').length > 1)
                    scope.disableButton = false;
                else
                    scope.disableButton = true;
                if ($("#options label").eq(pIndex).hasClass("option-selected")) {
                    $("#options label").eq(pIndex).removeClass("option-selected");
                }
                else {
                    $("#options label").eq(pIndex).addClass("option-selected");
                }
				// updated by Pritha
				scope.disableButton = false;
            };

            scope.getQuestion = function () {
                scope.options = $rootScope.CourseContent.question;
                for (i = 0; i < scope.options.length; i++) {
                    if (scope.options[i].isCorrect == true)
                        scope.correctAnswer.push(1);
                    else
                        scope.correctAnswer.push(0);
                }
            };

            scope.checkAnswer = function () {
				$rootScope.blinkQuizWrapper=true;
                if (scope.buttonText == $rootScope.CourseContent.submitText) {
                    if (attrs.feedback == "true")
                        scope.feedbackToggle = true;
                    var AnswerList = document.getElementsByName('answer');
                    for (var i = 0; i < AnswerList.length; i++) {
                        if (AnswerList[i].checked) {
                            scope.userAnswer.push(1);
                        }
                        else {
                            scope.userAnswer.push(0);
                        }
                    }
                    if (!$('input[name=answer]:checked').length) return;
				    var tottalCorrectAns = 0;
					var tottaluserAns = 0;
					var tottaluserIncorrectAnswer =0;
					for(var k = 0;k < scope.options.length;k++){
						if(scope.correctAnswer[k]==1){tottalCorrectAns++;}
						if(scope.correctAnswer[k]== scope.userAnswer[k] &&  scope.userAnswer[k] ==1){
							tottaluserAns++;							
						}						
						if(scope.userAnswer[k]==1){
							if(scope.userAnswer[k]!=scope.correctAnswer[k]){
							tottaluserIncorrectAnswer++;
							}							
						}					
					}
                    if (JSON.stringify(scope.correctAnswer) == JSON.stringify(scope.userAnswer) && attrs.assesment == "true") {	//check both if answer is correct and assessment is true
                        if (attrs.assesment == "true")
							{
								$rootScope.assesmentScore++;
								$rootScope.asmntScoreArray[$rootScope.quizCounter-1] = 1;
								$rootScope.isAnswered = true;
							}
                        scope.feedback = $rootScope.CourseContent.correct_feedback;
                        scope.disableButton = true;
                        scope.disableInput = true;
                        if (!$rootScope.CourseContent.branchingScreen)
                            $rootScope.markVisitedPage();
                        else {
                            scope.isBranching = true;
                        }
                    }
					else{
						$rootScope.asmntScoreArray[$rootScope.quizCounter-1] = 0;
							$rootScope.isAnswered = true;
						 scope.feedback = $rootScope.CourseContent.incorrect_feedback;
                        if (scope.attempt < scope.maxAttempt - 1) {
                            scope.buttonText = $rootScope.CourseContent.resetText;
                            scope.disableInput = true;
                        }							
						}                       
                    }
					if (attrs.assesment != "true"){
							if(tottalCorrectAns == tottaluserAns && tottaluserIncorrectAnswer==0 ){
								scope.feedback = $rootScope.CourseContent.correct_feedback;
								if (scope.attempt < scope.maxAttempt - 1) {
									scope.buttonText = $rootScope.CourseContent.resetText;
									scope.disableInput = true;
								}		
							}
							else if(tottaluserAns>=1 && tottaluserIncorrectAnswer==0){
								scope.feedback = $rootScope.CourseContent.partial_correct_feedback;
								if (scope.attempt < scope.maxAttempt - 1) {
									scope.buttonText = $rootScope.CourseContent.resetText;
									scope.disableInput = true;
								}	 		
							}
							else{								
								scope.feedback = $rootScope.CourseContent.incorrect_feedback;
								if (scope.attempt < scope.maxAttempt - 1) {
									scope.buttonText = $rootScope.CourseContent.resetText;
									scope.disableInput = true;
								}	
							}
						}
				if (attrs.tickmark == "true"){
					scope.checkUserAnswer();
					scope.attempt++;
				}
                else {
                    scope.feedbackToggle = false;
                    $('input[name=answer]:checked').attr('checked', false);
                    scope.buttonText = $rootScope.CourseContent.submitText;
                    scope.disableInput = false;
                    scope.userAnswer = [];
                    scope.disableButton = true;
                    $('input[name=answer]').parent().parent().removeClass("correct");
                    $('input[name=answer]').parent().parent().removeClass("in-correct");
                    if ($(".kc-option").children().hasClass("option-selected")) {
                        $(".kc-option").children().removeClass("option-selected");
                    }
                }
                scope.answerMode = false;
                if (scope.attempt >= scope.maxAttempt) {
                    scope.disableInput = true;
                    scope.disableButton = true;
                    if (!$rootScope.CourseContent.branchingScreen)
                        $rootScope.markVisitedPage();
                    else {
                        scope.isBranching = true;
                    }
                    if (attrs.tickmark == "true")
                        scope.showAnswer();
                }
				scope.openpopup = true;
				if (attrs.assesment == "true")
                       scope.checkQuizCompletion();
            };
			
			scope.checkQuizCompletion = function(){
				if($rootScope.currentPageNumber == $rootScope.totalPages-1){
					$rootScope.assesmentAttempted++;
					$timeout(function(){
						$rootScope.isLastQuestion = true;
						$rootScope.pageStatusList[$rootScope.currentModule][$rootScope.currentTopic][$rootScope.currentPage+1] = "1";
					},1000);
				}
			};

            scope.checkUserAnswer = function () {
                var checkAnswer = document.getElementsByName('answer');
                for (var i = 0; i < checkAnswer.length; i++) {
                    if (checkAnswer[i].checked) {
                        if (scope.correctAnswer[i] == 1) {
                            $(checkAnswer[i]).parent().parent().addClass("correct")
                        }
                        else {
                            $(checkAnswer[i]).parent().parent().addClass("in-correct")
                        }
                    }
                }
            };

            scope.showAnswer = function () {
                var checkAnswer = document.getElementsByName('answer');
                for (var i = 0; i < checkAnswer.length; i++) {
                    if (scope.correctAnswer[i] == 1) {
                        $(checkAnswer[i]).parent().parent().addClass("correct");
						$('.kc-option-label').css('cursor', 'default');
                    }
                }
            };

            scope.nextQuestion = function () {
                scope.id++;
                scope.getQuestion();
            };
            scope.reset();
            scope.start();
        }
    }

});

FrameworkApp.directive('conversation', function () {
    return {
        restrict: 'A',
        link: function ($scope, $rootScope, elem, attrs) {
        },
        controller: function ($scope, $rootScope,$timeout,$interval){
			var count = 0;
			var cnvrnTimer = null;
			var isPlaying = false;
			var sbBtClcked = [];
			$scope.isPlaying = isPlaying;
			$scope.visitedArray = [];
			$scope.c = 0;
			$scope.subPopup = false;
			$scope.showSbPP = false;
			$scope.disableOpt = false;
			$scope.page1 = true;
			$scope.openHotword = false;
			$scope.showRetry = false;
			$scope.hotwordText = '';
			$scope.popupText = '';
			$scope.disableClose = true;
			if($rootScope.pageStatusList[$rootScope.currentTopic][$rootScope.currentPage] == "1")
				$scope.disableClose = false;
			$scope.checkState = function(i){
				//checkTime();
				if(i>$scope.c && $scope.visitedArray.indexOf(i) == -1 && $rootScope.pageStatusList[$rootScope.currentTopic][$rootScope.currentPage] == "0"){
					return "disabled";
				}
				if(i==$scope.c){
					return "activebtn";
				}
			};
			var timer;
			$timeout.cancel(timer);
			function checkTime(_val){
				 timer = $timeout(function(){
					console.log("----------"+_val)
					$($('.nav-btns')[_val+1]).removeClass('disabled');
				},2000);
			}
			checkTime($scope.c);
			
			function startScreen(){
				cnvrnTimer = $interval(function(){
					count++;
					var getTime = $rootScope.CourseContent.screen[$scope.c].timer?$rootScope.CourseContent.screen[$scope.c].timer:2;
						getTime = parseInt(getTime);
					var isSubBtn = $rootScope.CourseContent.screen[$scope.c].subBtn;
					if(isSubBtn){
						$scope.isPlaying = false;
						isPlaying = false;
						$interval.cancel(cnvrnTimer);
					}
					if($scope.visitedArray.indexOf($scope.c) == -1)
						$scope.visitedArray.push($scope.c);
					if(count >= getTime && !isSubBtn){
						$('.speach-bubble').fadeOut(300,function(){
							$scope.c++;	
							$scope.$apply();
							$('.speach-bubble').fadeIn(500);							
						});
						sbBtClcked = [];
						$scope.showSbPP = false;
						if($scope.c >= $rootScope.CourseContent.screen.length)
							$scope.c = 0;
						count = 0;
					}
					chkCompletion();
				},1000);				
			}
			
			$scope.getcCntent = function(i){
				if(!$rootScope.CourseContent.screen[0].subBtn && $scope.visitedArray.indexOf(0) == -1)
					$scope.visitedArray.push(0);
				$('.speach-bubble').fadeOut(300,function(){
					$scope.c = i;
					$timeout.cancel(timer);
					if(!$rootScope.CourseContent.screen[i].subBtn)
						checkTime($scope.c);
					$scope.$apply();
					$('.speach-bubble').fadeIn(500);
				});				
				var isSubBtn = $rootScope.CourseContent.screen[i].subBtn;					
				count = 0;
				
				if(isSubBtn){
					$scope.isPlaying = false;
					isPlaying = false;
					$interval.cancel(cnvrnTimer);
				}	
				if($scope.visitedArray.indexOf(i) == -1 && !isSubBtn)
					$scope.visitedArray.push(i);
				chkCompletion();
				$scope.showSbPP = false;
				$scope.subPopup = false;
				
			}
			
			function chkCompletion(){
				var isCompleted = $scope.visitedArray.length >= $rootScope.CourseContent.screen.length;
				
				if(isCompleted){
					$rootScope.markVisitedPage();
					$scope.isPlaying = false;
					isPlaying = false;
					return true;
				}else{
					return false;					
				}
			}
			
			$scope.openSubPopup = function(ind,item,isObj){
				$(event.currentTarget).addClass("selected-answer");
				$scope.subPopup = true;
				$scope.popupText = item.popupText;
				var sbBtnCnt = $rootScope.CourseContent.screen[$scope.c].subBtn;
					sbBtnCnt = parseInt(sbBtnCnt);
					if(sbBtClcked.indexOf(ind) == -1)
						sbBtClcked.push(ind);
					if(sbBtClcked.length >= sbBtnCnt){
						if($scope.visitedArray.indexOf($scope.c) == -1)
							$scope.visitedArray.push($scope.c);
						checkTime($scope.c);
					}
					$scope.disableClose = true;
					if($rootScope.pageStatusList[$rootScope.currentTopic][$rootScope.currentPage]!="1"){
						timer1 = $timeout(function(){
							$scope.disableClose = false;
						},3000);
					}else{
						$scope.disableClose = false;
					}
					chkCompletion();
			};
			
			$scope.closeSub = function(){
				$scope.subPopup = false;
				var isSubBtn = $rootScope.CourseContent.screen[$scope.c].subBtn;
				var sbBtnCnt = $rootScope.CourseContent.screen[$scope.c].subBtn;
					sbBtnCnt = parseInt(sbBtnCnt);
			};
		
			
			$scope.hotword = function(key,id,itemNum){
				$scope.disableClose = true;
				if($rootScope.pageStatusList[$rootScope.currentTopic][$rootScope.currentPage]!="1"){
					timer1 = $timeout(function(){
						$scope.disableClose = false;
					},3000);
				}else{
					$scope.disableClose = false;
				}
				$scope.openHotword = true;
				$scope.hotwordText = $rootScope.CourseContent[key];
				if(itemNum){
					var sbBtnCnt = $rootScope.CourseContent.screen[itemNum].subBtn;
				}else{
					var sbBtnCnt = $rootScope.CourseContent.screen[$scope.c].subBtn;					
				}
					sbBtnCnt = parseInt(sbBtnCnt);
				if(sbBtClcked.indexOf(id) == -1)
					sbBtClcked.push(id);
				if(sbBtClcked.length >= sbBtnCnt){
					if(itemNum){
						if($scope.visitedArray.indexOf(itemNum) == -1)
							$scope.visitedArray.push(itemNum);
						checkTime($scope.c);
					}
					else if($scope.visitedArray.indexOf($scope.c) == -1)
							$scope.visitedArray.push($scope.c);
						checkTime($scope.c);
					chkCompletion();
				}
			}
			
			$scope.closeHotword = function(key){
				$scope.openHotword = false;
				$scope.hotwordText = '';
			};
			var currentAttempt = 0;
			$scope.sbPop = function(){
				$scope.disableClose = true;
				if($rootScope.pageStatusList[$rootScope.currentTopic][$rootScope.currentPage]!="1"){
					timer1 = $timeout(function(){
						$scope.disableClose = false;
					},3000);
				}else{
					$scope.disableClose = false;
				}
					currentAttempt++;
				var maxAttempt = $rootScope.CourseContent.screen[$scope.c].maxAttempt || 1;
				var isSelectedCorrect = $(event.currentTarget).hasClass('correct-ans');
				if(isSelectedCorrect || currentAttempt >= maxAttempt){
					$(event.currentTarget).addClass("selected-answer");
					$scope.showSbPP = true;
					$scope.disableOpt = true;
					if($scope.visitedArray.indexOf($scope.c) == -1){
						$scope.visitedArray.push($scope.c);
						checkTime($scope.c);
					}
					chkCompletion();					
				}else{
					$scope.showRetry = true;
					$(event.currentTarget).parent().children().addClass('disabled');
				}
				
			}		
				
			$scope.tryAgain = function(){
				$scope.showRetry = false;
				$('.lst-wrapper').find('li').removeClass('disabled');
			};
			
			$scope.closeSbPop = function(){
				$scope.showSbPP = false;
			};
			
			$scope.$on('$destroy', function(){
				$interval.cancel(cnvrnTimer)
				$timeout.cancel(timer);
			});
        }
    }
});

FrameworkApp.directive('conversationp14', function () {
    return {
        restrict: 'A',
        link: function ($scope, $rootScope, elem, attrs) {
        },
        controller: function ($scope, $rootScope,$timeout,$interval){
			var count = 0;
			var cnvrnTimer = null;
			var isPlaying = false;
			var sbBtClcked = [];
			$scope.isPlaying = isPlaying;
			$scope.visitedArray = [];
			$scope.c = 0;
			$scope.subPopup = false;
			$scope.showSbPP = false;
			$scope.disableOpt = false;
			$scope.disableClose = true;
			$scope.page1 = true;
			$scope.openHotword = false;
			$scope.showRetry = false;
			$scope.hotwordText = '';
			$scope.popupText = '';
			$scope.checkState = function(i){
				//checkTime();
				if(i>$scope.c && $scope.visitedArray.indexOf(i) == -1 && $rootScope.pageStatusList[$rootScope.currentTopic][$rootScope.currentPage] == "0"){
					return "disabled";
				}
				if(i==$scope.c){
					return "activebtn";
				}
			};
			var timer;
			$timeout.cancel(timer);
			function checkTime(_val){
				 timer = $timeout(function(){
					console.log("----------"+_val)
					$($('.nav-btns')[_val+1]).removeClass('disabled');
				},2000);
			}
			//checkTime($scope.c);
			
			function startScreen(){
				cnvrnTimer = $interval(function(){
					count++;
					var getTime = $rootScope.CourseContent.screen[$scope.c].timer?$rootScope.CourseContent.screen[$scope.c].timer:2;
						getTime = parseInt(getTime);
					var isSubBtn = $rootScope.CourseContent.screen[$scope.c].subBtn;
					if(isSubBtn){
						$scope.isPlaying = false;
						isPlaying = false;
						$interval.cancel(cnvrnTimer);
					}
					if($scope.visitedArray.indexOf($scope.c) == -1)
						$scope.visitedArray.push($scope.c);
					if(count >= getTime && !isSubBtn){
						$('.speach-bubble').fadeOut(300,function(){
							$scope.c++;	
							$scope.$apply();
							$('.speach-bubble').fadeIn(500);							
						});
						sbBtClcked = [];
						$scope.showSbPP = false;
						if($scope.c >= $rootScope.CourseContent.screen.length)
							$scope.c = 0;
						count = 0;
					}
					chkCompletion();
				},1000);				
			}
			
			$scope.getcCntent = function(i){
				if(!$rootScope.CourseContent.screen[0].subBtn && $scope.visitedArray.indexOf(0) == -1)
					$scope.visitedArray.push(0);
				$('.speach-bubble').fadeOut(300,function(){
					$scope.c = i;
					$timeout.cancel(timer);
					if(!$rootScope.CourseContent.screen[i].subBtn)
						checkTime($scope.c);
					$scope.$apply();
					$('.speach-bubble').fadeIn(500);
				});				
				var isSubBtn = $rootScope.CourseContent.screen[i].subBtn;					
				count = 0;
				
				if(isSubBtn){
					$scope.isPlaying = false;
					isPlaying = false;
					$interval.cancel(cnvrnTimer);
				}	
				if($scope.visitedArray.indexOf(i) == -1 && !isSubBtn)
					$scope.visitedArray.push(i);
				chkCompletion();
				$scope.showSbPP = false;
				$scope.subPopup = false;
				
			}
			
			function chkCompletion(){
				var isCompleted = $scope.visitedArray.length >= $rootScope.CourseContent.screen.length;
				
				if(isCompleted){
					$rootScope.markVisitedPage();
					$scope.isPlaying = false;
					isPlaying = false;
					return true;
				}else{
					return false;					
				}
			}
			
			$scope.openSubPopup = function(ind,item,isObj){
				$scope.disableClose = true;
				if($rootScope.pageStatusList[$rootScope.currentTopic][$rootScope.currentPage]!="1"){
					timer1 = $timeout(function(){
						$scope.disableClose = false;
					},3000);
				}else{
					$scope.disableClose = false;
				}
				$(event.currentTarget).addClass("selected-answer");
				$scope.subPopup = true;
				$scope.popupText = item.popupText;
				var sbBtnCnt = $rootScope.CourseContent.screen[$scope.c].subBtn;
					sbBtnCnt = parseInt(sbBtnCnt);
					if(sbBtClcked.indexOf(ind) == -1)
						sbBtClcked.push(ind);
					if(sbBtClcked.length >= sbBtnCnt){
						if($scope.visitedArray.indexOf($scope.c) == -1)
							$scope.visitedArray.push($scope.c);
						checkTime($scope.c);
					}
					chkCompletion();
			};
			
			$scope.closeSub = function(){
				$scope.subPopup = false;
				var isSubBtn = $rootScope.CourseContent.screen[$scope.c].subBtn;
				var sbBtnCnt = $rootScope.CourseContent.screen[$scope.c].subBtn;
					sbBtnCnt = parseInt(sbBtnCnt);
			};
		
			
			$scope.hotword = function(key,id,itemNum){
				$scope.disableClose = true;
				if($rootScope.pageStatusList[$rootScope.currentTopic][$rootScope.currentPage]!="1"){
					timer1 = $timeout(function(){
						$scope.disableClose = false;
					},3000);
				}else{
					$scope.disableClose = false;
				}
				$scope.openHotword = true;
				$scope.hotwordText = $rootScope.CourseContent[key];
				if(itemNum){
					var sbBtnCnt = $rootScope.CourseContent.screen[itemNum].subBtn;
				}else{
					var sbBtnCnt = $rootScope.CourseContent.screen[$scope.c].subBtn;					
				}
					sbBtnCnt = parseInt(sbBtnCnt);
				if(sbBtClcked.indexOf(id) == -1)
					sbBtClcked.push(id);
				if(sbBtClcked.length >= sbBtnCnt){
					if(itemNum){
						if($scope.visitedArray.indexOf(itemNum) == -1)
							$scope.visitedArray.push(itemNum);
						checkTime($scope.c);
					}
					else if($scope.visitedArray.indexOf($scope.c) == -1)
							$scope.visitedArray.push($scope.c);
						checkTime($scope.c);
					chkCompletion();
				}
			}
			
			$scope.closeHotword = function(key){
				$scope.openHotword = false;
				$scope.hotwordText = '';
			};
			var currentAttempt = 0;
			$scope.sbPop = function(){
				$scope.disableClose = true;
				if($rootScope.pageStatusList[$rootScope.currentTopic][$rootScope.currentPage]!="1"){
					timer1 = $timeout(function(){
						$scope.disableClose = false;
					},3000);
				}else{
					$scope.disableClose = false;
				}
					currentAttempt++;
				var maxAttempt = $rootScope.CourseContent.screen[$scope.c].maxAttempt || 1;
				var isSelectedCorrect = $(event.currentTarget).hasClass('correct-ans');
				if(isSelectedCorrect || currentAttempt >= maxAttempt){
					$(event.currentTarget).addClass("selected-answer");
					$scope.showSbPP = true;
					$scope.disableOpt = true;
					if($scope.visitedArray.indexOf($scope.c) == -1){
						$scope.visitedArray.push($scope.c);
						checkTime($scope.c);
					}
					chkCompletion();					
				}else{
					$scope.showRetry = true;
					$(event.currentTarget).parent().children().addClass('disabled');
				}
				
			}		
				
			$scope.tryAgain = function(){
				$scope.showRetry = false;
				$('.lst-wrapper').find('li').removeClass('disabled');
			};
			
			$scope.closeSbPop = function(){
				$scope.showSbPP = false;
			};
			
			$scope.$on('$destroy', function(){
				$interval.cancel(cnvrnTimer)
				$timeout.cancel(timer);
			});
        }
    }
});

FrameworkApp.directive('conversationwithstart', function () {
    return {
        restrict: 'A',
        link: function ($scope, $rootScope, elem, attrs) {
        },
        controller: function ($scope, $rootScope,$timeout,$interval){
			var count = 0;
			var cnvrnTimer = null;
			var isPlaying = false;
			var timer1;
			$scope.isPlaying = isPlaying;
			$scope.visitedArray = [];
			$scope.c = 0;
			$scope.subPopup = false;
			$scope.page1 = true;
			$scope.popupText = '';
			$scope.disableClose = true;
			if($rootScope.pageStatusList[$rootScope.currentTopic][$rootScope.currentPage] == 1){
				$scope.disableClose = false;
			}
			$scope.visitedArray.push($scope.c);
			$scope.checkState = function(i){
				//checkTime();
				if(i>$scope.c && $scope.visitedArray.indexOf(i) == -1 && $rootScope.pageStatusList[$rootScope.currentTopic][$rootScope.currentPage] == "0"){
					return "disabled";
				}
				if(i==$scope.c){
					return "activebtn";
				}
			};
			
			var timer;
			$timeout.cancel(timer);
			function checkTime(_val){
				 timer = $timeout(function(){
					console.log("----------"+_val)
					$($('.nav-btns')[_val+1]).removeClass('disabled');
				},2000);
			}
			
			
			function startScreen(){
				cnvrnTimer = $interval(function(){
					count++;
					var getTime = $rootScope.CourseContent.screen[$scope.c].timer?$rootScope.CourseContent.screen[$scope.c].timer:2;
						getTime = parseInt(getTime);
					if(count >= getTime){
						$scope.c++;
						if($scope.c >= $rootScope.CourseContent.screen.length)
							$scope.c = 0;
						if($scope.visitedArray.indexOf($scope.c) == -1)
							$scope.visitedArray.push($scope.c);
						count = 0;
						chkCompletion();
					}
				},1000);				
			}
			
			$scope.screenPlay = function(){
				$scope.page1 = false;
				$scope.isPlaying = isPlaying;
				checkTime($scope.c);
			};
			
			$scope.closeP1 = function(){
				$scope.page1 = true;
				$scope.c = 0;
			}
			
			$scope.getcCntent = function(i){
				$scope.c = i;
				count = 0;
				if($scope.visitedArray.indexOf($scope.c) == -1)
					$scope.visitedArray.push($scope.c);
				checkTime($scope.c);
				chkCompletion();
			}
			
			function chkCompletion(){
				var isCompleted = $scope.visitedArray.length >= $rootScope.CourseContent.screen.length;
				if(isCompleted){
					timer1 = $timeout(function(){
						$rootScope.markVisitedPage();
						$scope.disableClose = false;					
						$scope.isPlaying = false;
						isPlaying = false;
						$interval.cancel(cnvrnTimer);
						$timeout.cancel(timer1);
					},3000);
				}
			}
			
			$scope.openSubPopup = function(ind,item){
				$scope.subPopup = true;
				$scope.popupText = item.popupText;
			};
			
			$scope.closeSub = function(){
				$scope.subPopup = false;
			};
			
			$scope.$on('$destroy', function(){
				$interval.cancel(cnvrnTimer);
				$timeout.cancel(timer1);
			});
        }
    }
});


FrameworkApp.directive('createScenario', function () {
    return {
        restrict: 'AC',
        link: function ($scope, $rootScope, elem, attrs) {
        },
        controller: function ($scope, $rootScope,$timeout,$interval){
			$scope.loadScenarionScreen = function(ind,item){
				var pID = item.gotPage.split("_");
				var m = parseInt(pID[0]);
					m--;
				var t = parseInt(pID[1]);
					t--;
				var c = parseInt(pID[2]);
					c--;
				$rootScope.loadScreen(m,t,c);
			};
			
			$scope.checkCompleteion = function(ind,item){
				var status = "";
				var pID = item.gotPage.split("_");
				var c = parseInt(pID[2]);
				var pEndID = item.scnEnds.split("_");
				var cE = parseInt(pEndID[2]);
				var anyOneCompleted = false;
				var allCompleted = false;
				var sliceList = $rootScope.pageStatusList[$rootScope.currentTopic].slice(c-1,cE-1);
					allCompleted = (sliceList.indexOf("0") == -1);
					anyOneCompleted = (sliceList.indexOf("1") >= 0);
				if(allCompleted){
					status = "sc-visited";
				}else if(anyOneCompleted){
					status = "sc-in-progress";
				}else{
					status = "sc-not-started";
				}
				if($('.sc-visited').length == $rootScope.CourseContent.scenario.length){
					$rootScope.markVisitedPage();
					$rootScope.isNextButtonDisabled = false;					
				}
				//console.log()
				var isHasCls = $(".btn_"+(ind)).hasClass('sc-visited');
				if(ind > 0 && !isHasCls){
					if ($rootScope.CourseConfig.ForceNavigation)
						status +=" disable-scenario";
				}
				return status;
			}
		}
    }
});

FrameworkApp.directive('formvalidate',function(){
	return {
		restrict:'A',
        link: function ($scope, $rootScope, elem, attrs) {
        },
		controller:function($scope,$rootScope){
			var userName;
			if($rootScope.CourseConfig.AppType.toLowerCase() == 'scorm1.2') {
				userName = parent.SCORM_GetStudentName();
				userId = parent.SCORM_GetStudentID();
				userName = userName.split(',');
				userName = userName[1].trim()+' '+userName[0].trim();
			}else{
				userName = 'Offline Name';
				userId = 1111;
			}
			$scope.cantContinue = true;
			$scope.dsbleDeclare = false;
			$scope.page = 1;
			$scope.fName = userName;
			$scope.employeeNum = userId;
			$scope.country = '';
			$scope.customer = '';
			$scope.distributor = '';
			$scope.competitor = '';
			$scope.prsnl_rlnshp = '';
			$scope.any_relative = '';
			$scope.countryInput = '';
			$scope.coi_brg = '';
			$scope.pNC = '';
			$scope.brfDscrp = '';
			$scope.Company = '';
			$scope.Location = '';
			$scope.date = '';
			var updated = false;
			var glblYsExist = false;
			var userData = {};
			if($rootScope.isPassed[6].length > 1){
				var data = JSON.parse($rootScope.isPassed[6]);
				//$scope.fName = data.fName;
				//$scope.employeeNum = data.employeeNum;
				if(data.country !='Singapore' && data.country !='Indonesia' &&  data.country !='Thailand' &&  data.country !='Vietnam' &&  data.country !='China' && data.country !='India (ISC)' && data.country !='UAE'){
					$scope.countryInput = data.country;
					$scope.country = 'Others';
				}else{
					$scope.country = data.country;
				}
				$scope.customer = data.Q1_a;
				userData.Q1_a = data.Q1_a;
				$scope.distributor = data.Q1_b;
				userData.Q1_b = data.Q1_b;
				$scope.competitor = data.Q1_c;
				userData.Q1_c = data.Q1_c;
				$scope.prsnl_rlnshp = data.Q2_a;
				userData.Q2_a = data.Q2_a;
				$scope.any_relative = data.Q2_b;
				userData.Q2_b = data.Q2_b;
				$scope.coi_brg = data.Q3;
				userData.Q3 = data.Q3;
				$scope.pNC = data.pNC;
				updated = true;
				$scope.brfDscrp = data.brfDscrp;
				$scope.Company = data.Company;
				$scope.Location = data.Location;
				console.log(data)
				if($scope.customer.toLowerCase() == 'yes' || $scope.distributor.toLowerCase() == "yes" || $scope.competitor.toLowerCase() == "yes" || $scope.prsnl_rlnshp.toLowerCase() == 'yes' || $scope.any_relative.toLowerCase() == "yes" || $scope.coi_brg.toLowerCase() == "yes"){
					glblYsExist = true;
				}else{
					glblYsExist = false;
				}
			}
			if($scope.fName.length > 0 && $scope.employeeNum.toString().length >0 && $scope.country.length > 0){
					$scope.cantContinue = false;					
			}
			else{
				$scope.cantContinue = true;					
			}
			$scope.checkFilled = function(e){
				if($scope.fName.length > 0 && ($scope.employeeNum!=null && $scope.employeeNum.toString().length >0) &&  $scope.country.length > 0){
					$scope.cantContinue = false;					
				}
				else{
					$scope.cantContinue = true;					
				}
			};		
			
			$scope.checkFilled2 = function(){
				if($scope.pNC.length > 0 && $scope.brfDscrp.length >0 && $scope.Company.length > 0 && $scope.Location.length > 0){
					$scope.cantContinue = false;					
				}
				else{
					$scope.cantContinue = true;					
				}
			};	
			$scope.checkRadio = function(){
				$(event.target).parent().siblings('label').removeClass('option-selected');
				$(event.target).parent().addClass('option-selected');
				var dataKey = $(event.target).parents('form').data('key');
					userData[dataKey] = $(event.target).val();
				if($scope.customer && $scope.distributor && $scope.competitor){
					$scope.cantContinue = false;
				}		
				if($scope.customer.toLowerCase() == 'yes' || $scope.distributor.toLowerCase() == "yes" || $scope.competitor.toLowerCase() == "yes" || $scope.prsnl_rlnshp.toLowerCase() == 'yes' || $scope.any_relative.toLowerCase() == "yes" || $scope.coi_brg.toLowerCase() == "yes"){
					glblYsExist = true;
				}else{
					glblYsExist = false;
				}
			};		
			
			$scope.checkRadio2 = function(){
				$(event.target).parent().siblings('label').removeClass('option-selected');
				$(event.target).parent().addClass('option-selected');
				var dataKey = $(event.target).parents('form').data('key');
					userData[dataKey] = $(event.target).val();
				if($scope.prsnl_rlnshp && $scope.any_relative && $scope.coi_brg){
					$scope.cantContinue = false;
				}		
				if($scope.prsnl_rlnshp.toLowerCase() == 'yes' || $scope.any_relative.toLowerCase() == "yes" || $scope.coi_brg.toLowerCase() == "yes" || $scope.customer.toLowerCase() == 'yes' || $scope.distributor.toLowerCase() == "yes" || $scope.competitor.toLowerCase() == "yes"){
					glblYsExist = true;
				}else{
					glblYsExist = false;
				}	
			};
			
			$scope.goNext = function(){
				$scope.cantContinue = true;
				$scope.page++;
				if($scope.page == 4 && !glblYsExist){
					$scope.page++;
					$scope.pNC = '';
					$scope.brfDscrp = '';
					$scope.Company = '';
					$scope.Location = '';
				}				
				if($scope.prsnl_rlnshp && $scope.any_relative && $scope.coi_brg && $scope.page==3){
					$scope.cantContinue = false;
				}	
				if($scope.customer && $scope.distributor && $scope.competitor && $scope.page==2){
					$scope.cantContinue = false;
				}
				if($scope.fName.length > 0 && $scope.employeeNum.toString().length >0 && $scope.country.length > 0 && $scope.page==1){
					
				}
				if($scope.pNC.length > 0 && $scope.brfDscrp.length >0 && $scope.Company.length > 0 && $scope.Location.length > 0 && $scope.page==4){
					$scope.cantContinue = false;					
				}
			};
			
			$scope.goPrev = function(){
				$scope.cantContinue = false;
				$scope.dsbleDeclare = false;
				$scope.page--;
				if($scope.page == 4 && !glblYsExist){
					$scope.page--;
				}
			};
			
			$scope.declare = function(){
				$scope.dsbleDeclare = true;
				if($scope.country=='Others' && $scope.countryInput.length > 0){
					$scope.country = $scope.countryInput;
				}
				userData.fName = $scope.fName;
				userData.employeeNum = $scope.employeeNum;
				userData.country = $scope.country;
				userData.pNC = $scope.pNC;
				userData.brfDscrp = $scope.brfDscrp;
				userData.Company = $scope.Company;
				userData.Location = $scope.Location;
				userData.Q1_a = $scope.customer;
				userData.Q1_b = $scope.distributor;
				userData.Q1_c = $scope.competitor;
				userData.Q2_a = $scope.prsnl_rlnshp;
				userData.Q2_b = $scope.any_relative;
				userData.Q3 = $scope.coi_brg;
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!
				var yyyy = today.getFullYear();
				if(dd<10) {
					dd = '0'+dd
				} 
				if(mm<10) {
					mm = '0'+mm
				} 
				today = dd + '/' + mm + '/' + yyyy;
				userData.date = today;
				if(updated){
					userData.updated = 'Yes';					
				}
				else{
					userData.updated = 'No';
					//userData.date = '';
				}
				userData = JSON.stringify(userData);
				//$rootScope.isPassed[6] = '';
				$rootScope.isPassed[6] = userData;
				$rootScope.markVisitedPage();
				userData = JSON.parse(userData);
				if(userData.country !='Singapore' && userData.country !='Indonesia' &&  userData.country !='Thailand' &&  userData.country !='Vietnam' &&  userData.country !='China' && userData.country !='India (ISC)' && userData.country !='UAE'){
					$scope.countryInput = userData.country;
					$scope.country = 'Others';
				}else{
					$scope.country = userData.country;
				}
				userData = {};
			}
		}
	}
});


FrameworkApp.directive('introControl', function () {
    return {
        restrict: 'A',
        link: function ($scope, $rootScope, elem, attrs) {
        },
        controller: function ($scope, $rootScope,$timeout,$timeout) {	
			$scope.page2 = true;
			var vdo = document.getElementById("introVideo");
				vdo.load();
				vdo.play();
				vdo.addEventListener('ended', function(){
					$timeout(function(){
						$scope.startcourseFromIntro();
						$scope.$apply();							
					});
				});

        }
    }
});

FrameworkApp.directive('vdocontrol', function () {
    return {
        restrict: 'A',
        link: function ($scope, $rootScope, elem, attrs) {
        },
        controller: function ($scope, $rootScope,$timeout,$timeout) {
			$scope.openHotword = false;
			$scope.playVideo = function(){
				$scope.openHotword = true;
				$scope.closeEnable = false;
				if($rootScope.pageStatusList[$rootScope.currentTopic][$rootScope.currentPage] == "1"){
					$scope.closeEnable = true;
				}
				var a = document.getElementById('videoBox');
				setTimeout(function(){
					a.load();
					a.play();		
					a.addEventListener("ended",function(){
						$scope.closeEnable = true;
						$rootScope.markVisitedPage();				
						$rootScope.$apply();				
					});
				},1000);
				pauseAudio();
				$rootScope.disableAudio = true;
			}	
			$scope.closeVideo = function(){
				var a = document.getElementById('videoBox');
				a.pause();
				$scope.openHotword = false;
				plAudio();
				$rootScope.disableAudio = false;
			}
        }
    }
});