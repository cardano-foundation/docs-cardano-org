export default {
  name: 'search_page',
  label: 'search page',
  folder: 'resources/content/search',
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
      label: 'search page content',
      widget: 'object',
      fields: [
        {
          name: 'default_content',
          label: 'Default content',
          widget: 'string'
        }
      ]
    }
  ]
}
