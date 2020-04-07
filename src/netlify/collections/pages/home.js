export default {
  name: 'home_page',
  label: 'Home page',
  folder: 'resources/content/pages/index',
  create: false,
  delete: false,
  fields: [
    {
      label: 'Title',
      name: 'title',
      widget: 'string'
    },
    {
      name: 'content',
      label: 'Home page content',
      widget: 'object',
      fields: [
        {
          name: 'title',
          label: 'Title',
          widget: 'string'
        },
        {
          name: 'features_cta',
          label: 'Features CTA label',
          widget: 'string'
        },
        {
          name: 'getting_started_cta',
          label: 'Getting started CTA label',
          widget: 'string'
        }
      ]
    }
  ]
}
