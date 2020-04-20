export default {
  name: 'meta_data',
  label: 'Meta data',
  folder: 'resources/content/meta',
  create: false,
  delete: false,
  fields: [
    {
      label: 'Title',
      name: 'title',
      widget: 'string'
    },
    {
      label: 'Global content',
      name: 'content',
      widget: 'object',
      fields: [
        {
          name: 'main_title',
          label: 'Main title',
          widget: 'string'
        },
        {
          name: 'select_language',
          label: 'Select language label',
          widget: 'string'
        },
        {
          name: 'select_theme',
          label: 'Select theme label',
          widget: 'string'
        }
      ]
    }
  ]
}
