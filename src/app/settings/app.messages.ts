export const AppMessageSettings = {
    /* tslint:disable:max-line-length */
    higherLevelCleared: 'concepts in higher level completed!',
    remedialSuccess: 'overcame difficulty by putting in effort',
    accurateClusterSuccess: 'you learned some concepts extremely well',
    challengeMsg: 'i love challenges',

    /* Questions Page Messages Starts */
    startConceptCondition1: {
        beforeSubmit: {
            where: 'ribbonGreen',
            action: 'close',
            messages: {
                default: [
                    `read explanation carefully`,
                    `read the explanation carefully`,
                    `reading explanation carefully`
                ]
            }
        }
    },
    startPedagogyChild: {
        beforeSubmit: {
            where: 'pedagogyProgress',
            action: 'dropdown',
            messages: {
                default: []
            }
        }
    },
    remedialFlow1_Cluster: {
        beforeSubmit: {
            where: 'overlay',
            action: 'lets_start',
            messages: {
                default: [
                    // `revise basic concepts`,
                    // `revise the concept`
                    `remedialFlow1`
                ]
            }
        }
    },
    remedialFlow1_Remedial: {
        beforeSubmit: {
            where: 'overlay',
            action: 'lets_start',
            messages: {
                default: [
                    // `activity to help`,
                    // `do an activity`
                    `remedialFlow1`
                ]
            }
        }
    },
    remedialFlow2: {
        beforeSubmit: {
            where: 'overlay',
            action: 'lets_start',
            messages: {
                // default: [`read every explanation`]
                default: [`remedialFlow2`]
            }
        }
    },
    remedialFlow3: {
        beforeSubmit: {
            where: 'overlay',
            action: 'lets_start',
            messages: {
                // default: [`concept requires effort`]
                default: [`remedialFlow3`]
            }
        }
    },
    remedialConceptFailure: {
        beforeSubmit: {
            where: 'overlay',
            action: 'continue',
            messages: {
                // default: [`mistakes help develop brain`]
                default: [`remedialFailure`]
            }
        }
    },
    remedialConceptSuccess: {
        beforeSubmit: {
            where: 'overlay',
            action: 'continue',
            messages: {
                default: [
                    // `you put a lot of hard work`,
                    // `great effort result are showing`,
                    // `you decided to continue`,
                    // `more you try more you learn`
                    `remedialSuccess`
                ]
            }
        }
    },
    remedialFlowCompletion: {
        beforeSubmit: {
            where: 'ribbonGreen',
            action: 'close',
            messages: {
                default: [`mathematicians dont give up`]
            }
        }
    },
    higherLevelConceptSuccess: {
        beforeSubmit: {
            where: 'ribbonGreen',
            action: 'close',
            messages: {
                default: [
                    `your extra effort really helped`,
                    `you meet all challenges`,
                    `great to see you work hard`
                ]
            }
        }
    },
    sdlCarefulMsg: {
        afterSubmit: {
            where: 'ribbonGreen',
            action: 'close',
            conditions: ['result_false'],
            messages: {
                result_false: [
                    `you can do better`,
                    `ask doubts to leave behind`,
                    `try carefully to overcome`
                ]
            }
        }
    },
    sdlPassInLastAttempt: {
        afterSubmit: {
            where: 'ribbonGreen',
            action: 'close',
            conditions: ['result_true', 'result_false'],
            messages: {
                result_true: [
                    `mathematicians solve hard problems`,
                    `mathematicians persist in solving problems`
                ],
                result_false: [
                    `ask doubts to leave behind`
                ]
            }
        }
    },
    completeConceptMastery: {
        beforeSubmit: {
            where: 'ribbonGreen',
            action: 'close',
            // conditions: ['result_true'],
            messages: {
                default: [
                    `know this concept well`,
                    `solved every question carefully`
                ]
            }
        }
    },
    challengeAttempt1: {
        afterSubmit: {
            where: 'ribbonGreen',
            action: 'close',
            conditions: ['result_true', 'result_false'],
            messages: {
                result_true: [
                    `tough question but did great`,
                    `your efforts paid off`,
                    `indeed a tough question`,
                    `challenges build your brain`
                ],
                result_false: [
                    `students find this tough`
                ]
            }
        }
    },
    challengeAttempt2: {
        afterSubmit: {
            where: 'ribbonGreen',
            action: 'close',
            conditions: ['result_true'],
            messages: {
                result_true: [
                    `you thought really hard`,
                    `your efforts are paying off`
                ]
            }
        }
    },
    bonusChallenge: {
        beforeSubmit: {
            where: 'ribbonGreen',
            action: 'close',
            messages: {
                default: [`earned you bonus`]
            }
        }
    },
    cqExhausted: {
        beforeSubmit: {
            where: 'overlay',
            action: 'okay',
            messages: {
                default: [`no more challenge questions`]
            }
        }
    },
    alphabetInNumericBlank: {
        beforeSubmit: {
            where: 'ribbonRed',
            action: 'close',
            messages: {
                default: [`enter numbers only`]
            }
        }
    },
    moreThanOneTrial: {
        beforeSubmit: {
            where: 'ribbonGreen',
            action: 'close',
            messages: {
                default: [`answer incorrect`]
            }
        }
    },
    submitEmptyBlank: {
        beforeSubmit: {
            where: 'ribbonRed',
            action: 'close',
            messages: {
                default: [`specify answer`]
            }
        }
    }
    /* Questions Page Messages Ends */

    /*
     * Discarded messages.
    challengeWrongFirstAttempt: {
        messages: [`Many students find this tough, so don't worry. You will get another try on this challenge question. You will see the answer only after your second try.`],
        displayAt: 'beforeShowNextContent',
        type: 'ribbonGreen',
        action: 'close'
    },
    completeTimedTestSuccess: {
        messages: [
            `Hey, you know what, you tried well and that makes all the difference. Nice work!`,
            `Hey, you know what, this was a very strong attempt! Good work!`
        ],
        displayAt: 'beforeShowNextContent',
        type: 'overlay',
        action: 'continue'
    },
    completeTimedTestFailure: {
        messages: [
            `Hey, trying this again might help you improve your speed.`,
            `Hey, you can do better if you repeat.`
        ],
        displayAt: 'beforeShowNextContent',
        type: 'overlay',
        action: 'continue_retry'
    },
    testInProgress: {
        messages: [`We often perform better if we attempt a worksheet in one go.`],
        displayAt: 'beforeShowNextContent',
        type: 'overlay',
        action: 'exit_continue'
    },
    quitHigherLevel: {
        messages: [`Would you continue doing higher level next time?`],
        displayAt: 'beforeShowNextContent',
        type: 'overlay',
        action: 'yes_no'
    },
    submitWithoutAnswering: {
        messages: ['The answer has not been entered.'],
        displayAt: 'beforeShowNextContent',
        type: 'ribbonRed',
        action: 'close'
    },
    conditionalAlert: {
        messages: [],
        displayAt: 'beforeShowNextContent',
        type: 'ribbonGreen',
        action: 'close'
    }, */
};
