import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import * as _ from 'lodash';
import { SharedService } from '../../shared.service';

@Injectable()
export class QuestionDisplayReformService {
    correctAnswer: string[];
    from: string;
    userAnswer: string[];
    questionIndex: any;
    displayContent: any;
    questionService: any;
    questionInitiate: any;
    contentType: any;
    data: any;

    contentManipulation: any = null;
    constructor(private sharedService: SharedService) {
        this.displayContent = [];
        this.questionIndex = 0;
        this.sharedService.getTrailFrom().subscribe(result => {
            this.from = result.from;
        });
    }

    // to get alphabet
    generateOptionString(index) {
        if (index !== null && index !== undefined) {
            index = parseInt(index.toString(), 10);
            return String.fromCharCode(65 + index);
        }
    }

    initContentService(trailList) {
        this.displayContent = [];
        if (trailList.length > 0) {
            if (window['ContentService'] !== undefined) {
                this.contentManipulation = window['ContentService'];
                this.setQuestionsContent(trailList);
            } else {
                setTimeout(() => this.initContentService(trailList), 200);
            }
        }
    }

    loadJS(): Promise<any> {
        const response = { result: 'failed' };
        if (typeof (window['ContentService']) === 'undefined') {
            const appBaseURL = _.get(environment, 'appBaseURL', '');
            const dynamicScripts = [appBaseURL + 'assets/js/contentService.js?v=' + environment.releaseVersion];
            try {
                for (let i = 0; i < dynamicScripts.length; i++) {
                    const node = document.createElement('script');
                    node.src = dynamicScripts[i];
                    node.type = 'text/javascript';
                    node.async = false;
                    node.charset = 'utf-8';
                    document.getElementsByTagName('head')[0].appendChild(node);
                }
                response.result = 'success';
            } catch (error) { }

        } else {
            response.result = 'loaded';
        }
        return Promise.resolve(response);
    }

    private setQuestionsContent(content) {
        if (this.contentManipulation) {
            for (let i = 0; i < content.length; i++) {
                this.contentType = _.get(content[i], 'contentType', null);

                this.contentType = (this.contentType !== null) ? this.contentType : 'question';

                if (this.from === 'messageTrail') {
                    this.data = _.get(content[i], 'contentData', {});
                } else {
                    this.data = _.get(content[i], 'data', {});
                }
                if (!_.isEmpty(this.data)) {
                    this.data = _.isArray(this.data) ? this.data : [this.data];
                    this.questionInitiate = new this.contentManipulation(this.data);
                    this.questionService = this.questionInitiate[this.questionIndex];
                    this.displayContent.push(this.generateDisplayContent(this.questionService, content[i]));
                }
            }
        }
    }

    getQuestionsContent() {
        return this.displayContent;
    }

    private generateDisplayContent(questionService, content) {
        let displayContent = questionService.getDisplayObjectForView();
        displayContent.contentType = this.contentType;
        displayContent.templateContent = questionService.getTemplate();
        const userAttemptData = _.get(content, 'userAttemptData', {});
        if (this.from === 'favourites') {
            displayContent.explanation = questionService.getExplanation();
        } else {
            let userAnswer = [];
            displayContent.userAnswer = questionService.getUserAnswer(userAttemptData);
            console.log(displayContent);
            if (displayContent.question) {
                displayContent.question.replace(/\[(blank\_[0-9]*)\]/g, function (match, a) {
                    if (userAttemptData.userResponse && userAttemptData.userResponse[a] && userAttemptData.userResponse[a] !== null)
                        userAnswer.push(userAttemptData.userResponse[a].userAnswer);
                    else
                        userAnswer.push('');
                    displayContent.userAnswer.userAnswer = userAnswer;
                });
            }
            this.userAnswer = _.split(displayContent.userAnswer.userAnswer, ',');
        }
        if (this.questionService.getContentType() === 'question') {
            let correctAnswer = [];
            let context = this;
            displayContent.correctAnswer = this.questionService.getCorrectAnswerForView();
            displayContent.question.replace(/\[(blank\_[0-9]*)\]/g, function (match, a) {
                correctAnswer.push(context.questionService.getCorrectAnswerForView()[a]);
            });
            if (correctAnswer.length > 0) {
                displayContent.correctAnswer = correctAnswer;
            }
            this.correctAnswer = _.split(displayContent.correctAnswer, ',');
        }
        displayContent = this.reformDisplayContent(displayContent);
        return displayContent;
    }

    private reformDisplayContent(displayContent) {
        let outputQuestion = '';
        const questionPattern = new RegExp(/\[[a-zA-Z0-9_]+\]/g);
        const question = _.get(displayContent, 'question', '');
        const tempArray: any[] = question.split(questionPattern);
        const matches = question.match(questionPattern);
        for (let i = 0; i < tempArray.length; i++) {
            outputQuestion += tempArray[i] + this.generateElement(displayContent, matches, i);
        }
        outputQuestion = outputQuestion.replace(/<iframe/g, '<div class="block-iframe-parent">' +
            '<div class="block-iframe blocked"></div><iframe');
        outputQuestion = outputQuestion.replace(/<\/iframe>/g, '</iframe></div>');
        displayContent.questionField = outputQuestion;
        // if (!environment.production) { console.log('displayContent', displayContent); }
        return displayContent;
    }
    private generateElement(displayContent, matches, i) {
        const directAttributes = ['style', 'size', 'maxlength'];
        const elementWrapper = { 'start': '', 'end': '' };
        const userResult = _.get(displayContent, 'userAnswer.result', null);
        let thisFieldAnswerStatus = 'pass';
        let param = '';
        let element = '';
        let options = '';
        if (matches && matches[i]) {
            const match = matches[i].substr(1, (matches[i].length - 2));
            const ques_resp = _.get(displayContent, 'responseElements.' + match, {});
            const attributes = _.get(ques_resp, 'attributes', {});
            const ques_type = _.get(ques_resp, 'type', '');
            /* Set attributes for the element */

            if (userResult === 'fail') {
                if (this.userAnswer[i] !== this.correctAnswer[i]) {
                    thisFieldAnswerStatus = 'fail';
                }
            }
            if (this.from === 'topics') {
                const tempUserAnswer = (this.userAnswer[i]) ? this.userAnswer[i] : '';
                if (ques_type.toLowerCase() === 'blank') {
                    param = 'id="' + match + '" name="' + match + '" value="' + tempUserAnswer + '"class="'
                        + thisFieldAnswerStatus + '"';
                } else if (ques_type.toLowerCase() === 'dropdown' && this.from === 'topics') {
                    const dropdown_ans = _.get(ques_resp, 'correctAnswer', null);
                    param = 'id="' + match + '" name="' + match + '" selected="' + tempUserAnswer + '"class="'
                        + thisFieldAnswerStatus + '"';
                }
            }

            _.forEach(attributes, function (value, key) {
                switch (key.toLowerCase()) {
                    case 'style':
                    case 'size':
                    case 'maxlength':
                        param += ' ' + key.toLowerCase() + '="' + value + '"';
                        break;
                    case 'texttype':
                        elementWrapper.start = '<' + value + '>';
                        elementWrapper.end = '</' + value + '>';
                        break;
                    case 'numeric':
                        param += ' onkeydown="angularComponent.validateNumeric(' + match + ', event)"';
                        break;
                }
            });

            if (this.from === 'topics') {
                options += '<option value="' + i + '">' + this.userAnswer[i] + '</option>';
            }

            switch (ques_type.toLowerCase()) {
                case 'blank':
                    param += (!_.includes(param, 'size')) ? ' size="9"' : '';
                    element = '<input type="text" ' + param +
                        ' autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" disabled="true">';
                    break;
                case 'dropdown':
                    element = '<select ' + param + ' disabled ="true">' + options + '</select>';
                    break;
            }
        }
        element = elementWrapper.start + element + elementWrapper.end;
        return element;
    }
}
