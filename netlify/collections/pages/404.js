export default {
  name: '404_page',
  label: '404 page',
  folder: 'resources/content/pages/404',
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
      label: '404 page content',
      widget: 'object',
      fields: [
        {
          name: 'title',
          label: 'Title',
          widget: 'string'
        },
        {
          name: 'body_content',
          label: 'Content',
          widget: 'markdown'
        }
      ]
    }
  ]
}
