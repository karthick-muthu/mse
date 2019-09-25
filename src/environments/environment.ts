// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  appBaseURL: "/",
  apiBaseURL: 'http://49.204.92.14:808/Mindspark/Framework/Mindspark/',
  //apiBaseURL: "https://staging.mindspark.in/Mindspark/Framework/Mindspark/",
  loginBaseURL: "/Mindspark/Login/",
  cdnBaseURL: "https://mindspark-rearch-assets.s3.amazonaws.com/",
  prerequisites: [
    {
      name: "www.aqad.in",
      url: "https://www.aqad.in/images/intiatives-icon.png",
      type: "image",
      status: "Not Loaded",
      loader: false
    },
    {
      name:
        "d2tl1spkm4qpax.cloudfront.net/content_images/sparkyForImageCheck.png",
      url:
        "http://d2tl1spkm4qpax.cloudfront.net/content_images/sparkyForImageCheck.png",
      type: "image",
      status: "Not Loaded",
      loader: false
    },
    {
      name:
        "mindspark-ei.s3.amazonaws.com/content_images/sparkyForImageCheck.png",
      url:
        "http://mindspark-ei.s3.amazonaws.com/content_images/sparkyForImageCheck.png",
      type: "image",
      status: "Not Loaded",
      loader: false
    },
    {
      name: "www.educationalinitiatives.com",
      url: "http://www.educationalinitiatives.com/ei-erp/images/EI_Logo.gif",
      type: "image",
      status: "Not Loaded",
      loader: false
    },
    {
      name: "www.mindspark.in",
      url:
        "https://www.mindspark.in/website_new/website_v1/images/mind-spark.png",
      type: "image",
      status: "Not Loaded",
      loader: false
    }
  ],
  releaseVersion: '2.3.2.12'
};
