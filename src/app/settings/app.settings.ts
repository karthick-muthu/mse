export const AppSettings = {
    TOPIC_DEFAULT_IMAGE: 'assets/common/images/topicdefault.png',
    WORKSHEET_DEFAULT_IMAGE: 'assets/common/images/worksheetdefault.png',
    LOGO_URL: 'assets/common/images/mindspark-logo.png',
    LOGO_URL_TRANS: 'assets/common/images/logo.png',
    LOGOTINY_URL: 'assets/common/images/mindspark-logo-white-short.png',
    COPYRIGHT: '© 2009-2018, Educational Initiatives Pvt. Ltd.',
    SITE_NAME: 'Mindspark',
    RATING_CONFIG: 5,
    DOB_MIN_YEAR: 1942,
    TILE_TEXT_LIMIT: 40,
    TEXT_LIMIT: 40,
    ANIMAL_PASSWORD: {
        'img1': 'bear',
        'img2': 'dog',
        'img3': 'lion',
        'img4': 'panda',
        'img5': 'rabbit',
        'img6': 'tiger'
    },
    FOOD_PASSWORD: {
        'img1': 'cake',
        'img2': 'chips',
        'img3': 'chocolate',
        'img4': 'cottoncandy',
        'img5': 'icecream',
        'img6': 'popcorn'
    },
    QUESTIONS_ICON: {
        'topic': 'T',
        'worksheet': 'W',
        'practice': 'PR'
    },
    IMAGE_FORMAT: ['JPG', 'JPEG', 'PNG'],
    MAX_IMAGE_SIZE: 2,
    ERROR_PROFILE_IMAGE: ['assets/common/images/female.png', 'assets/common/images/male.png'],
    REDIRECT_CODE: {
        'redirectlogin': '/auth/login',
        'closecontent': '/topics',
        'worksheetlist': '/worksheets',
        'contentpage': '/content',
        'home': '/home',
        'starredquestions': '/my-mindspark/starred-questions',
        'StudentDashboard': '/home',
        'TeacherDashboard': '/teachershome',
    },
    GRADES_FOR_THEME: {
        lowergrade: '1',
        highergrade: '2'
    },
    PASSWORD_TYPES: ['text', 'picture'],
    PASSWORD_REGEX: '[a-zA-Z0-9@/_/.]+',
    IDLE_SESSION: {
        TIMEOUT: 540,
        WARNING_TIMEOUT: 60
    },
    LOGOUT_TYPES: [
        { type: 'regular', url: '' },
        { type: 'inactivity', url: 'error/inactivity' },
        { type: 'pageRefresh', url: 'error/pageRefresh' },
        { type: 'pageBack', url: 'error/pageBack' },
    ],
    BROWSER_VERSIONS: {
        CHROME: 60,
        FIREFOX: 55,
        EDGE: 13,
        IE: 10,
        SAFARI: 10
    },
    IFRAMETEMPLATES: ['game', 'interactive', 'introduction', 'enrichment', 'remedial'],
    FORMTEMPLATES: ['blank', 'dropdown', 'blank_dropdown'],
    ALLOWED_MODES: ['learn'],
    PAGINATION_LIMIT: 20,
    PAGINATION_MAX_SIZE: 5,
    NOTIFICATION_IMAGE_TYPES: ['assets/common/images/information.png', 'assets/common/images/redirection_alert.png',
        'assets/common/images/comment.png'],
    PROMOTIONAL_NOTIFICATIONS_ANIMATIONS: ['assets/common/gifs/birthdayLowerGrade.gif', 'assets/common/gifs/birthdayUpperGrade.gif',
        'assets/common/images/Sparkie_Star_promotional.png', 'assets/common/images/Sparkie_Champ_promotional.png'],
    SESSIONREPORT_ANIMATIONS: ['assets/common/gifs/GIFT-sparkie-shield-1-loop.gif', 'assets/common/gifs/GIFT-sparkie-1-loop.gif',
        'assets/common/gifs/GIFT-open-1-loop.gif'],
    OVERLAYCONTENT: {
        remedialFlow1: {
            image: 'assets/common/images/messages/effort-single.png',
            text: 'effort mode',
            class: 'effort'
        },
        remedialFlow2: {
            image: 'assets/common/images/messages/effort-double.png',
            text: 'effort mode double',
            class: 'effort'
        },
        remedialFlow3: {
            image: 'assets/common/images/messages/effort-triple.png',
            text: 'effort mode triple',
            class: 'effort'
        },
        remedialFailure: {
            image: 'assets/common/images/messages/effort-failure.png',
            text: 'effort mode',
            class: 'success'
        },
        remedialSuccess: {
            image: 'assets/common/images/messages/effort-success.png',
            text: 'effort mode',
            class: 'success'
        }
    }
};
