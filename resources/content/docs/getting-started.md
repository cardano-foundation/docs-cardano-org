<a name="contents"></a>
## Contents

1. [Dependencies](#dependencies)
1. [Setting up](#setting-up)
1. [Features](#features)
1. [Making changes](#making-changes)
1. [Architecture](#architecture)
1. [Project structure](#project-structure)
1. [CMS](#cms)
1. [Localisation](#localisation)
1. [Theming](#theming)
1. [Pages](#pages)
1. [Continuous integration](#continuous-integration)
1. [Unit testing](#unit-testing)

<a name="dependencies"></a>
## Dependencies

* Gatsby global installation (`npm i -g gatsby`)
* <a href="https://github.com/join" target="_blank">GitHub account</a>
* <a href="https://circleci.com/signup/" target="_blank">CircleCI account</a>
* <a href="https://app.netlify.com/" target="_blank">Netlify CMS account</a>

<a name="setting-up"></a>
## Setting up the site

``` bash
gatsby new <repository_name> git@github.com:input-output-hk/gatsby-iohk-starter.git
cd <repository_name>
./scripts/setup.sh
```

This script will assist in setting up <a href="https://circleci.com/" target="_blank">CircleCI</a>, <a href="https://www.netlifycms.org/" target="_blank">Netlify CMS</a> and <a href="https://pages.github.com/" target="_blank">GitHub pages</a>.

<a name="features"></a>
## Features

* Localisation
* Continuous integration
* Unit tests
* Theming
* CMS
* Production, staging and development environments with deployments

<a name="making-changes"></a>
## Making changes

Branch off of staging
``` bash
git checkout staging
git fetch && git pull
git checkout -b <feature_branch>
```
... make some changes ... push to origin `<feature_branch>`
Create a PR on GitHub for your new branch

* compare `<feature_branch>`
* base `staging`

Let CI run the build and Netlify will deploy a preview URL of the build. Once you are happy merge the branch. CI will then take over deployments on staging and create an automated `staging -> master` PR. Once you are happy with the changes in staging, merge the automated PR to get the changes into production.

<a name="architecture"></a>
## Architecture

* <a href="https://pages.github.com/" target="_blank">GitHub pages</a> is used to host the production site. Deployment is handled by <a href="https://circleci.com/" target="_blank">CircleCI</a> ([more info](#continuous-integration)). As part of the production deployment process access to the CMS on `/admin` is removed.
* <a href="https://www.netlifycms.org/" target="_blank">Netlify CMS</a> is used to host the staging site. The staging site is where all CMS changes are made as well as an area to preview any features/areas of the site before they reach production.
* <a href="https://circleci.com/" target="_blank">CircleCI</a> handles testing, builds and deployments at every step. Full configuration can be found in `.circleci/config.yml`.

There are 2 main flows to updating the site.

<a name="developer-changes-flow"></a>
### Flow (a) developer changes

See [making changes](#making-changes).

<a name="cms-changes-flow"></a>
### Flow (b) CMS changes

CMS changes occur via <a href="https://www.netlifycms.org/" target="_blank">Netlify CMS</a>. Netlify will commit changes to branches prefixed with `cms/` once changes are published they will be merged to staging. These changes are reflected in the staging environment. It is not possible for the CMS to directly update the production site.

In order for CMS changes to reach production the automated `staging -> master` PR needs to be merged.

<a name="project-structure"></a>
## Project structure

* All JavaScript and only JavaScript related to the site lives inside the `src/` directory.
* Components are organised in directories per page for non-reusable components, or in their own directory for reusable components.
* The project is linted following <a href="https://standardjs.com/" target="_blank">Standard JS</a> configuration. GitHooks will prevent commits which fail linting.
* As per the standard Gatsby setup pages live inside the `src/pages/` directory and are named according to their URI path ([more info on pages](#pages)).
* `src/state/` contains the sites global state making use of the <a href="https://reactjs.org/docs/context.html" target="_blank">React Context API</a>.
* `src/helpers/` are abstactions to external API's and libraries such as the DOM API.
* `Root.js` is the root component, it is used from within `gatsby-browser.js` and `gatsby-ssr.js`. It's purpose is to redirect to Netlify CMS when following a link via email to sign up.
* `App.js` is the component used to wrap all pages, it is used from within `gatsby-browser.js` and `gatsby-ssr.js`. This is in order to maintain global state.
* `static/` contains files bundled into the build process, these files are unprocessed and simply moved into `public/` on build. This contains the `admin/` directory used to access the CMS.
* `resources/` contains any resource used on the site that is not JavaScript, i.e. Markdown for content and images.

<a name="cms"></a>
## CMS

The site uses <a href="https://www.netlifycms.org/" target="_blank">Netlify CMS</a> for its content management system. All content for the site is contained inside `resources/content/` with the exception of files. These are contained in `static/`.

Netlify uses collections to defined editable content. In order to keep the collections configuration as small as possible content collections are grouped by folders with a language markdown file for each language ([more on localisation](#localisation)) with the exception of meta data.

Each page should have it's own markdown folder as well as folders for "global" sections of the site such as the header, footer and cookie consent banner. There is also a "meta" directory which contains meta data for each page and fallback meta data for the site.

<a name="meta-data"></a>
### Meta data

As stated above there is a "meta" directory containing meta data for the site and pages. There are three possible levels to define meta data each overriding the previous level. Ranking from most important to least important:

1. Component level
1. Page level
1. Site level

Meta data defined at a Site and Page level come via the markdown files for the Site and Pages respectively. Component level meta data is defined as a prop to the `<Layout />` component, this is useful for generated pages such as a blog, where the content changes dynamically following a template.

Meta data is defined in Markdown on the `head` key. It contains a `title` key for the `<title />` tag and an array of `meta` objects on the `meta` key. Each meta object ends up as either

``` html
<meta name='<meta.description>' content='<meta.content>' />
```
or
``` html
<meta name='<meta.description>' content='<meta.file>' />
```
or in the case of `og:` tags
``` html
<meta property='<meta.description>' content='<meta.content|meta.file>' />
```
in the HTML. This allows for the addition of any `<meta />` tag without explicitly defining each possible variant of meta tag. Allowing the `file` key also allows for tags such as `og:image` to be used with uploaded images on Netlify.

The `<Head />` component handles parsing and using meta data.

<a name="localisation"></a>
## Localisation

Localisation is determined in the `<LanguageProvider />` state component using the <a href="https://reactjs.org/docs/context.html" target="_blank">React Context API</a>.

On a first visit to the site if the user does not specify a language in the URL, e.g. they navigate to '/' or '/my-page' they will be redirected to the default language. The default language is resolved as follows:

* If there is a value set in local storage on the `lang` key then that value is used as the default language so long as it is a supported language on the site.
* The next available value comes from the users browser language available on <a href="https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/language" target="_blank">window.navigator.language</a>. If this value is supported by the site then it will be used.
* Finally the fallback will be to use the first supported language on the site, i.e. the first language defined in `avaliableLanguages` in `/site.config.json`.

Once a default language has been determined the site will redirect the URL accordingly and update the value in local storage for future visits to the site.

<a name="dates-and-times"></a>
### Dates and times

The <a href="https://momentjs.com/" target="_blank">moment.js</a> library is used to handle parsing dates and times. Moment localisation is setup once inside `src/bootstrap.js`. From there it is then possible to format dates and times using the <a href="https://momentjs.com/docs/#/parsing/string-format/" target="_blank">locale aware formats from moment.js</a>.

<a name="adding-a-new-language"></a>
### Adding a new language

In order to add a new language you will need to do the following:

1. Add the new language to the `availableLanguages` object in `/site.config.json`.
1. Include the correct locales for <a href="https://momentjs.com/" target="_blank">moment.js</a> inside `src/bootstrap.js`.
1. For each localised file within `resources/content/` you will need to copy an existing locale file in each folder and rename it using the "language code" set for the language in step one. You can then choose to translate those markdown file accordingly. The site will not work correctly without adding localised content for that language.

<a name="theming"></a>
## Theming

All styling is handled by themes. Themes are set using global state in a similar way to locale using the `<ThemeProvider />` using the <a href="https://reactjs.org/docs/context.html" target="_blank">React Context API</a>.

All available themes are exported from `src/config/themes/index.js`. On first visit to the site the first exported theme will be used. Any visits thereafter will use local storage and get the theme from the `theme` key provided it is a valid theme.

<a name="styled-components"></a>
### Styled components

We make use of the <a href="https://www.styled-components.com/docs/advanced" target="_blank">Theme provider</a> in styled components to pass our theme as a prop to all styled components. The theme provider wraps our page components inside `src/App.js`. It is then available in our styled components, example:

``` javascript
const MyTitle = `
  color: ${({ theme }) => theme.colors.myColor};
`
```

Image paths can also be used in styled components and they will be parsed and built correctly by the <a href="https://www.gatsbyjs.org/packages/gatsby-plugin-styled-components/" target="_blank">gatsby-plugin-styled-components</a> plugin automatically.

<a name="themed-images"></a>
### Themed images

If you need to pull in a themed image directly into JSX rather than styled components this is possible using the <a href="https://reactjs.org/docs/context.html" target="_blank">React Context API</a>. You can use the `<ThemeConsumer />` component to grab the current theme. Example:

``` javascript
<ThemeConsumer>
  {({ theme }) => (
    <img src={theme.images.myThemedImage} alt='Themed image' />
  )}
</ThemeConsumer>
```

<a name="pages"></a>
## Pages

All the sites pages are located inside `src/pages/` where the name of the file corresponds to the URI path. To prevent duplication of files per supported language there is some pre-processing inside `/gatsby-node.js` where it will duplicate each page for each supported language, with the exception of the 404 pages as we don't need `/en/404/`, `/fr/404/` etc.

<a name="creating-a-new-page"></a>
### Creating a new page

To create a new page simply create a new page file within the `src/pages/` directory and return a React component using the main `Layout` component to wrap your page or something else if it's more suitable.

If you want automatic meta data for your page create a corresponding markdown file for each available language in `resources/content/meta/` and fill out the `head` section to populate meta data. See [meta data](#meta-data) for more info.

<a name="continuous-integration"></a>
## Continuous integration

<a href="https://circleci.com/" target="_blank">CircleCI</a> is used for <a href="https://en.wikipedia.org/wiki/Continuous_integration" target="_blank">Continuous integration</a> and automated deployments. The configuration for CircleCI is available in `.circleci/config.yml`. The aim of CI is to ensure the code runs at each stage of it's lifecycle by testing and building the site. It is also responsible for automated deployments to production (GitHub pages).

<a name="unit-testing"></a>
## Unit testing

Unit testing has been setup using <a href="https://jestjs.io/" target="_blank">Jest</a> as the test runner. Any test files should be adjacent to the file they are testing suffixed with `.test`. Example:

``` javascript
src/components/MyComponent/index.js -> src/components/MyComponent/index.test.js
src/components/MyComponent/Query.js -> src/components/MyComponent/Query.test.js
```

Following this convention makes it easy to see what each test file is responsible for and also keeps import paths nice and simple.

Running tests

``` bash
npm test
```

<a name="snapshots"></a>
### Snapshots

Jest can use snapshots to verify code output, this is especially useful for making sure a React render function returns the correct JSX. You can simply do

``` javascript
expect(shallow(<MyComponent />)).toMatchSnapshot()
```

The output of `shallow(<MyComponent />)` is then written to a snapshot file (if one does not already exist). Thereafter any subsequent calls on `npm test` will compare the output of `shallow(<MyComponent />)` to the original snapshot. This is a convenient way of testing any breaking changes to components.

If a snapshot needs to be updated (make sure you didn't break anything first). Then you can simply run `npm test -- path/to/test/file --updateSnapshot`. Remember to commit the snapshots to the repository.

<a name="coverage"></a>
### Coverage

Jest also has built in coverage reporting `npm run coverage`. Coverage is written to the `coverage/` directory as well as output to the command line. You can then view the coverage in the browser using `npm run serve:coverage`.
