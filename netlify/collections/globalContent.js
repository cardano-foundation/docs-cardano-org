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
        },
        {
          name: 'last_updated',
          label: 'Last updated label',
          widget: 'string'
        },
        {
          name: 'report_an_issue',
          label: 'Report an issue label',
          widget: 'string'
        },
        {
          name: 'search',
          label: 'Search label',
          widget: 'string'
        }
      ]
    }
  ]
}
