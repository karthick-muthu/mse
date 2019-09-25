export const ApiSettings = {
    API: {
        homeDetails: 'Student/GetHomeDetails',
        getNotifications: 'Student/GetNotifications',
        topics: {
            get: 'Student/GetMyTopics',
            open: 'Student/OpenTopic',
            highGrades: 'Student/GetTopicForOtherGrades',
            topicTrail: 'Student/GetTopicTrail',
            topicDetails: 'Student/GetTopicDetails'
        },
        worksheets: {
            get: 'Student/GetMyWorksheets',
            open: 'Student/OpenWorksheet',
            /* fetchWorksheet: 'Student/FetchWorksheetContent', */
            submitWorksheetQuestion: 'Student/SubmitWorksheetQuestion',
            quitWorksheet: 'Student/QuitWorksheet'
        },
        myDetails: {
            get: 'Student/GetMyDetails',
            update: 'Student/UpdateMyDetails',
            updateProfilePic: 'Student/UpdateProfilePic'
        },
        favouritesQuestion: {
            get: 'Student/GetFavouritesList',
            remove: 'Student/RemoveFromFavourities'
        },
        listActivity: 'Student/ListActivity',
        openActivity: 'Student/OpenActivity',
        getMyProgress: 'Student/GetMyProgress',
        getWorksheetReport: 'Student/GetWorksheetReport',
        getRewardInfo: 'Student/GetRewardInfo',
        mailBox: {
            getMailbox: 'Student/GetMailbox',
            getMessageTrail: 'Student/GetMessageTrail',
            writeToMindspark: 'Student/WriteToMindspark',
            replyToMessage: 'Student/ReplyToMessage',
            saveRating: 'Student/SaveRating',
            markNotificationAsRead: 'Student/MarkNotificationAsRead',
        },
        auth: {
            getMyPasswordType: 'Student/GetMyPasswordType',
            changePassword: 'Student/UpdateMyPassword',
            logout: 'Student/Logout'
        },
        question: {
            firstContent: 'Student/FetchFirstContent',
            submitAnswer: 'Student/SubmitQuestionAttempt',
            updateAnswer: 'Student/UpdateQuestionAttempt',
            submitActivity: 'Student/SubmitActivityAttempt',
            saveActivity: 'Student/SaveActivityAttempt',
            sessionReport: 'Student/GetTopicSessionReport',
            startTopicHigherLevel: 'Student/StartTopicHigherLevel',
            closeContent: 'Student/CloseContent',
            addToFavourities: 'Student/AddToFavourities',
            quitTopicHigherLevel: 'Student/QuitTopicHigherLevel',
            contentErrorLog: 'Student/ContentErrorLog',
            previewFetchFirstContent: 'Student/PreviewFetchFirstContent'
        }
    }
};
