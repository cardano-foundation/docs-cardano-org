export default {
  name: 'documentation_page',
  label: 'Documentation page',
  folder: 'resources/content/pages/documentation',
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
      label: 'Documentation page content',
      widget: 'object',
      fields: [
        {
          name: 'title',
          label: 'Title',
          widget: 'string'
        }
      ]
    }
  ]
}
