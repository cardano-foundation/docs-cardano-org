export default {
  name: 'footer',
  label: 'Footer',
  folder: 'resources/content/footer',
  create: false,
  delete: false,
  fields: [
    {
      label: 'Title',
      name: 'title',
      widget: 'string'
    },
    {
      name: 'product_info',
      label: 'Product info heading',
      widget: 'string'
    },
    {
      name: 'community_info',
      label: 'Community info heading',
      widget: 'string'
    },
    {
      name: 'community_email',
      label: 'Community Email',
      widget: 'string'
    },
    {
      label: 'Cardano informational links',
      label_singular: 'Cardano informational link',
      name: 'product_links',
      widget: 'list',
      fields: [
        {
          label: 'URL',
          name: 'href',
          widget: 'string'
        },
        {
          label: 'Label',
          name: 'label',
          widget: 'string'
        }
      ]
    },
    {
      label: 'Cardano community links',
      label_singular: 'Cardano community link',
      name: 'community_links',
      widget: 'list',
      fields: [
        {
          label: 'URL',
          name: 'href',
          widget: 'string'
        },
        {
          label: 'Label',
          name: 'label',
          widget: 'string'
        }
      ]
    },
    {
      label: 'Footer text',
      name: 'content_body',
      description: 'Text blob in footer, parsed as markdown',
      widget: 'markdown'
    }
  ]
}
