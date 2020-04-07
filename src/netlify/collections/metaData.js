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
      label: 'Head data (<head />)',
      name: 'head',
      widget: 'object',
      fields: [
        {
          name: 'meta',
          label: 'Meta tags',
          label_singular: 'Meta tag',
          widget: 'list',
          fields: [
            {
              name: 'name',
              label: 'name attribute',
              widget: 'string'
            },
            {
              name: 'content',
              label: 'content attribute, if no value is given then value will be taken from "File"',
              widget: 'string',
              required: false,
              default: ''
            },
            {
              name: 'file',
              label: 'Used instead of content where the meta tag is a URL to a file such as image etc.',
              widget: 'file',
              required: false,
              default: '',
              allow_multiple: false
            }
          ]
        }
      ]
    }
  ]
}
