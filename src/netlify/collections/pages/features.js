export default {
  name: 'features_page',
  label: 'Features page',
  folder: 'resources/content/pages/features',
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
      label: 'Features page content',
      widget: 'object',
      fields: [
        {
          name: 'title',
          label: 'Title',
          widget: 'string'
        },
        {
          name: 'content_body',
          label: 'Body',
          widget: 'markdown'
        }
      ]
    }
  ]
}
