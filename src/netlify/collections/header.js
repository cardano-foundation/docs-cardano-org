export default {
  name: 'header',
  label: 'Header',
  folder: 'resources/content/header',
  create: false,
  delete: false,
  fields: [
    {
      label: 'Title',
      name: 'title',
      widget: 'string'
    },
    {
      label: 'Select language',
      name: 'select_language',
      widget: 'string'
    },
    {
      label: 'Navigation',
      name: 'navigation',
      widget: 'object',
      fields: [
        {
          label: 'Labels',
          name: 'labels',
          widget: 'object',
          fields: [
            {
              label: 'Home',
              name: 'home',
              widget: 'string'
            },
            {
              label: 'Features',
              name: 'features',
              widget: 'string'
            },
            {
              label: 'Documentation',
              name: 'documentation',
              widget: 'string'
            },
            {
              label: 'Components',
              name: 'components',
              widget: 'string'
            }
          ]
        }
      ]
    }
  ]
}
