# IOHK Gatsby Starter

The [Gatsby](https://www.gatsbyjs.org/) starter template used by [IOHK](https://iohk.io/) to build front-end web assets.

```
gatsby new gatsby-starter-iohk-default https://github.com/input-output-hk/gatsby-starter-iohk-default
```

If you use VisualStudio Code then it's recommended that you download the [code tour](https://github.com/vsls-contrib/code-tour) extension to make use of the guided tours of the codebase. Otherwise the documentation below should be sufficient. The tours will be setup on `npm install`.

## Features

* Localization
* [Client side routing](#client-side-routing)
* Theming - multiple themes
* Netlify CMS
* Material UI
* Styled components
* Configured for Netlify hosting, compatible with other hosting options
* Fully configurable

## Scripts

* `npm run build` - runs a full static build
* `npm run build:netlify` - webpack build of Netlify CMS bundle in `netlify/index.js`
* `npm run build:netlify-prod` - production build of Netlify CMS bundle
* `npm run build:netlify-toml` - builds the `netlify.toml` configuration, generating config as well as combining with `.netlify.toml`
* `npm run ci` - CI task to perform for building, will run linter as well
* `npm run clean` - `gatsby clean`, the same as running `./node_modules/.bin/gatsby clean`
* `npm run create-pages` - custom script to create pages see [creating pages](#creating-pages)
* `npm run delete-pages` - custom script to delete pages see [deleting pages](#deleting-pages)
* `npm run develop` - `gatsby develop`, the same as running `./node_modules/.bin/gatsby develop`
* `npm run lint` - runs eslint on all `.js` files
* `npm run lint:changed` - used by git hook on pre-commit to detect bad code changes which fail linting
* `npm start` - proxy to `npm run develop`
* `npm run serve` - serves the static build in public and replicates server hosting on Netlify
* `npm run watch:netlify` - watches the Netlify folder and regenerates the Netlify bundle, useful for development on Netlify CMS configuration

## Configuration

The starter can be configured through the `package.json` file under the `gatsby-starter-iohk-default` key. All configuration is safe to delete. The configuration shipped with the starter is the default configuration that is used for missing configuration.

| Option | Notes |
| ------ | ----- |
| availableLanguages | Array of languages available on the site, used to build localized pages and content. |
| availableLanguages[].key | Language key, e.g. `en`, `en-us`, `fr`, `ja`, `zh-cn` etc. Corresponds with resource naming and URL construction. |
| availableLanguages[].label | Label for the language e.g. `English`, `English (US)`, `Français`, `日本語`, `简体中文`. |
| availableLanguages[].flag | Optional emoji flag for the language e.g. 🇺🇸, 🇫🇷, 🇯🇵, 🇨🇳 |
| availableLanguages[].locale | Locale for the language e.g. `en_US`, `fr_FR`, `zh_CN` etc. |
| alternativeLanguages | Array of alternative languages which resolve to an available language. |
| alternativeLanguages[].key | The language of the alternative language e.g. `en-gb`, `fr-fr` etc. |
| alternativeLanguages[].languageKey | The language to resolve to from availableLanguages e.g. `en`, `fr` |
| themes | List of themes, used in `src/themes.js` to resolve themes from [@input-output-hk/front-end-themes](https://npmjs.com/package/@input-output-hk/front-end-themes) by default and consumed by [@input-output-hk/front-end-core-components/components/Theme](https://github.com/input-output-hk/front-end-core-components/blob/master/docs/components/Theme.md). Behaviour can be changes in `src/themes.js` and  `src/App.js`. |
| ga | Google Analytics. |
| ga.trackingID | Tracking ID for GA property. Setup on [@input-output-hk/front-end-core-libraries analytics](https://github.com/input-output-hk/front-end-core-libraries/blob/master/docs/libraries/analytics.md). Analytics setup in `gatsby-browser.js`. |
| localization | Localization related configuration. |
| localization.createLocalizedPages | Boolean, whether to create localized pages or not on build. |
| localization.ignore | List of pages to ignore on build when creating localized pages |
| localization.createDefaultPages | Boolean, should default pages be created? For example the first language in `availableLanguages` being `en` - `/en/` and `/` will be created for the index page when createDefaultPages is true. |
| localization.useURL | Boolean, use the URL to store and read localization state? Used in `src/App.js` passed to [@input-output-hk/front-end-core-components/components/Language](https://github.com/input-output-hk/front-end-core-components/blob/master/docs/components/Language.md). |
| localization.useNavigator | Boolean, use the users OS language? Used in `src/App.js` passed to [@input-output-hk/front-end-core-components/components/Language](https://github.com/input-output-hk/front-end-core-components/blob/master/docs/components/Language.md). |
| localization.persistLang | Boolean, persist the language to local storage? Used in `src/App.js` passed to [@input-output-hk/front-end-core-components/components/Language](https://github.com/input-output-hk/front-end-core-components/blob/master/docs/components/Language.md). |
| routes | Array, list of client only routes handled by [@reach/router](https://www.npmjs.com/package/@reach/router). Netlify and Gatsby are automatically configured based on this configuration. |
| routes[].path | String, the path used by [@reach/router](https://reach.tech/router/tutorial/05-url-parameters). |
| routes[].component | String, the relative path to the component used to render the route from `src/routes/` minus the `.js` extension. For example `MyRoute` would resolve to `src/routes/MyRoute.js`. |

## Environment variables

* `UPLOADCARE_PUBLIC_KEY` - Required for Netlify CMS to interface with Uploadcare. If you don't want to use Uploadcare then you can edit the Netlify configuration in `netlify/index.js` to use something else or static files instead.
* `NODE_ENV` - Handled by default, set to `production` on `npm run build:netlify-prod` to configure Netlify CMS correctly on production/development environments. Limited testing can be carried out on Netlify CMS locally.
* `HEAD` - Taken from Netlify's build environment. `HEAD` points to the branch currently being built. Will integrate seamlessly with Netlify's hosting, but should you wish to host elsewhere then you will need to setup the `HEAD` environment variable in your choice of CI.
* `GATSBY_IOHK_STARTER_CONFIG` - Handled automatically, populated from the site configuration in `package.json`.
* `GATSBY_URL` - The URL the site is being served on. Resolved via Netlify's environment variables and `NODE_ENV`. It can also take a value from `static/CNAME`. For logic see `node/gatsby/onPreInit.js`. Explicitly setting this value will bypass any logic to resolve the value.
* `CONTEXT` - From Netlify's build environment. Used when resolving `GATSBY_URL`. When a Netlify build is detected the `GATSBY_URL` value is taken from `DEPLOY_URL`, also a Netlify environment variable.

## Templates

By default there is one template `src/templates/Main.js`. This will be the default template used by `src/components/Layout.js`. It is possible to create additional templates in `src/templates/` then utilize them in the existing `src/components/Layout.js` Layout.

For example a new template `src/templates/Blog.js`

```JavaScript
import React from 'react'
import PropTypes from 'prop-types'

const Blog = ({ children }) => (
  <div>
    <p>Blog template</p>
    ...
    <div>
      {children}
    </div>
  </div>
)

Blog.propTypes = {
  children: PropTypes.node.isRequired
}

export default Blog

```

Then utilizing this template in a new page `src/pages/blog.js`.

```JavaScript
import React from 'react'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Layout from '../components/Layout'
import Blog from '../templates/Blog'
import BlogPageQuery from '../queries/BlogPageQuery'

export default () => (
  <BlogPageQuery
    render={(content) => (
      <Layout template={Blog}>
        <Container maxWidth='lg'>
          <Box marginTop={6} marginBottom={10}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p>{content.default_content}</p>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Layout>
    )}
  />
)

```

## Creating pages

Creating pages with localized content and Netlify CMS configuration can be a chore, there's several files to create with boilerplate style code. In order to make it a bit simpler there is a script to allow you to create pages:

```bash
npm run create-pages -- /about/ /contact-us/ /projects/ /projects/project-a/ projects/project-a/additional-information/
```

The script accepts any amount of arguments with each argument treated as a path for the new page. The script is safe to run for pages that have already been created, it will not overwrite any existing files. The above command will create boilerplate content for each available language, a static query inside `src/queries/`, a page file inside `src/pages/` mapped to the path, a netlify collection in `netlify/collections/pages/` as well as updating the `netlify/collections/pages/index.js`, the relevant markdown files in `resources/content/pages/` and meta data markdown files in `resources/content/meta/` - for each page. The only thing left to do is write the code and map the content as required.

## Deleting pages

Deleting pages is just as easy as creating pages with the `npm run delete-pages` script. It will undo the work done in `npm run create-pages`. It accepts the same arguments as well:

```bash
npm run delete-pages -- /about/ /contact-us/ /projects/ /projects/project-a/ projects/project-a/additional-information/
```

## Global content

For content that isn't restricted to a single page, for example footer, header and navigation content there is a global content system in place. If you have a large site or large amount of global content then it may make sense to break up the content into multiple static queries for performance benefits.

The global content is located in `resources/content/global/` with a file for each language. The content is retrieved through the `GlobalContentQuery` in `src/queries/GlobalContentQuery.js` file.

There is a Netlify CMS collection for the global content within `netlify/collections/globalContent.js`.

## Meta data

Pages can optionally have a corresponding meta data content file for each language inside `resources/content/meta/`. When using the `npm run create-pages` script meta files for each language will be created. The naming convention is as follows (assuming a language of `en`):

* `/` -> `resources/content/meta/index-en.md`
* `/about/` -> `resources/content/meta/about-en.md`
* `/projects/project-a/additional-information/` -> `resources/content/meta/projects___project-a___additional-information-en.md`

The `/` is replaced with `___` except for the trailing and leading `/`.

The meta data is consumed inside the `Layout` component in `src/components/Layout/` and is forwarded to [@input-output-hk/front-end-core-components Head](https://github.com/input-output-hk/front-end-core-components/blob/master/docs/components/Head.md) using [react-helmet-async](https://npmjs.com/package/react-helmet-async).

## Netlify

To setup with Netlify hosting simply link your repository to Netlify creating a new site and set the build command to `npm run ci` and the publish directory to `public/`. The `ci` script will run linting as well as building the site and can be extended to run tests etc. should you wish to add automated testing.

To access the CMS go to `/admin/` and you will be redirected to the login/CMS page depending on your Netlify configuration.

## Uploadcare

The starter has integration with [Uploadcare](https://uploadcare.com/), but can be used without Uploadcare. To use Netlify CMS without Uploadcare edit the `netlify/index.js` config to replace the Uploadcare config with something else. For example choosing to host images locally:

```JavaScript
import backend from './backend'
import collections from './collections'
import { getBranch } from './helpers'

const init = window.initCMS
const config = {
  load_config_file: false,
  backend,
  public_folder: '/images/uploads',
  logo_url: 'https://ucarecdn.com/0a28215f-a3f0-40e2-ac7e-d7dc93288d16/-/resize/150/-/progressive/yes/',
  show_preview_links: true,
  collections
}

if (getBranch() === 'staging') config.publish_mode = 'editorial_workflow'

console.log('CMS config', config)

init({ config })

```

Uploaded images in Netlify will be stored at `static/images/uploads`.

## Client side routing

Optionally you can implement client side routing through the configuration on `routes`. This will enable client only routes for your application. For example you have thousands of data points which change often and dynamically, you may want to create a client side route as it could perform better than SSR. The main issue with client only routes on statically generated sites is letting the server know the client handles specific "glob" paths. This is taken care of for Netlify hosting, the `netlify.toml` file is generated on build using the `routes` configuration as well as the static `.netlify.toml` file for custom Netlify toml configuration.

When a client side route is requested the server will rewrite the URL to the "static" part of the path, for example `/my-data/:id/` would have a rewrite to `/my-data/` with a corresponding static file which uses the `src/routes/Fallback.js` component. The `Fallback` component determines whether or not the URL matches the path of the client side route and displays the 404 page when the route does not match. Of course the drawback here is the server responds with a 200 status regardless of whether or not there is any content present, there's no way of getting around this.

Using the above example for `/my-data/:id/` the expected build output would be to create a static file under `public/my-data/index.html` using the `Fallback` component. In `netlify.toml` we'd expect to see something like this: (note each available language is supported when configured to do so)

```
[[redirects]]
  from = "/my-data/*"
  to = "/my-data/index.html"
  status = 200

[[redirects]]
  from = "/en/my-data/*"
  to = "/en/my-data/index.html"
  status = 200
```

This means when navigating to:

* `/my-data/` you will be served with the `Fallback` component rendering a 404 page with a 200 status code. Client side routing will not match the route and only the 404 page will be visible.
* `/my-data/123/` you will be served with the `Fallback` component rendering nothing, at which point client side routing will render the corresponding component for the route and the `:id` parameter can be handled there.

Server behaviour cannot be easily tested through `gatsby serve` or `gatsby develop`, there is a script `npm run serve` which will spin up an [express](https://www.npmjs.com/package/express) server which will replicate the hosting configuration on Netlify to assist with testing server behaviour locally.
