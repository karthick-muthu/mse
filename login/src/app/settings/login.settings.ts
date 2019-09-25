export const LoginSettings = {
    LOGO_URL: 'assets/common/images/mindspark-logo.png',
    LOGO_URL_TRANS: 'assets/common/images/logo.png',
    LOGOTINY_URL: 'assets/common/images/mindspark-logo-white-short.png',
    COPYRIGHT: '© 2009-2018, Educational Initiatives Pvt. Ltd.',
    SITE_NAME: 'Mindspark',
    DOB_MIN_YEAR: 1942,
    ONBOARDING_MODULES: 'assets/help/html5/index.html',
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
    REDIRECT_CODE: {
        'login': '/auth/login',
        'setpasswordafterreset': '/auth/reset-password',
        'closecontent': '/topics',
        'contentpage': '/topics/content',
        'loginbase': '/auth/',
        'home': '/home',
        'StudentDashboard': '/home',
        'TeacherDashboard': '/teachershome',
    },
    LOGIN_VARIANTS: ['getlandingpage', 'requestpasswordreset', 'validateuserdetailsforpasswordreset', 'checkusername', 'validatepassword'],
    GRADES_FOR_THEME: {
        lowergrade: '1',
        highergrade: '2'
    },
    PASSWORD_TYPES: ['text', 'picture'],
    PASSWORD_REGEX: '[a-zA-Z0-9@_.]+',
    USERNAME_REGEX: '[a-zA-Z0-9@_.\-]+',
    PRODUCT_LIST: ['ms1', 'ms2', 'ms3'],
    PRODUCTS_IMAGES: ['assets/common/images/mathsSubject.png', 'assets/common/images/englishSubject.png', 'assets/common/images/scienceSubject.png']
};
