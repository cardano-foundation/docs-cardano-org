export default {
  name: 'home_page',
  label: 'home page',
  folder: 'resources/content/index',
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
      label: 'home page content',
      widget: 'object',
      fields: [
        {
          name: 'title',
          label: 'Page title',
          widget: 'string'
        },
        {
          name: 'hero',
          label: 'Hero section',
          widget: 'object',
          fields: [
            {
              name: 'hero_title',
              label: 'Hero title',
              widget: 'string'
            },
            {
              name: 'hero_subtitle',
              label: 'Hero subtitle',
              widget: 'string'
            },
            {
              name: 'hero_body',
              label: 'Hero body',
              widget: 'string'
            },
            {
              name: 'hero_cta',
              label: 'Hero CTA label',
              widget: 'string'
            },
            {
              name: 'hero_cta_link',
              label: 'Hero CTA link',
              hint: 'Relative link without a language prefix. e.g. /about-cardano/',
              widget: 'string'
            }
          ]
        },
        {
          name: 'ouroboros',
          label: 'Ouroboros section',
          widget: 'object',
          fields: [
            {
              name: 'ouroboros_lead',
              label: 'Ouroboros primary text',
              widget: 'markdown'
            },
            {
              name: 'ouroboros_body',
              label: 'Ouroboros secondary text',
              widget: 'markdown'
            },
            {
              name: 'ouroboros_resilient',
              label: 'Ouroboros first label',
              widget: 'string'
            },
            {
              name: 'ouroboros_scalable',
              label: 'Ouroboros second label',
              widget: 'string'
            }
          ]
        },
        {
          name: 'cardano_topic',
          label: 'Cardano topic',
          widget: 'object',
          fields: [
            {
              name: 'topic_title',
              label: 'Title',
              widget: 'string'
            },
            {
              name: 'topic_body',
              label: 'Body',
              widget: 'string'
            },
            {
              name: 'topic_link',
              label: 'Link',
              widget: 'string',
              hint: 'Relative link without a language prefix. e.g. /about-cardano/'
            }
          ]
        },
        {
          name: 'stake_pool_topic',
          label: 'Stake pool topic',
          widget: 'object',
          fields: [
            {
              name: 'topic_title',
              label: 'Title',
              widget: 'string'
            },
            {
              name: 'topic_body',
              label: 'Body',
              widget: 'string'
            },
            {
              name: 'topic_link',
              label: 'Link',
              widget: 'string',
              hint: 'Relative link without a language prefix. e.g. /about-cardano/'
            }
          ]
        },
        {
          name: 'exchange_topic',
          label: 'Exchange topic',
          widget: 'object',
          fields: [
            {
              name: 'topic_title',
              label: 'Title',
              widget: 'string'
            },
            {
              name: 'topic_body',
              label: 'Body',
              widget: 'string'
            },
            {
              name: 'topic_link',
              label: 'Link',
              widget: 'string',
              hint: 'Relative link without a language prefix. e.g. /about-cardano/'
            }
          ]
        }
      ]
    }
  ]
}
