export default {
  name: 'components_page',
  label: 'Components page',
  folder: 'resources/content/pages/components',
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
      label: 'Components page content',
      widget: 'object',
      fields: [
        {
          name: 'title',
          label: 'Title',
          widget: 'string'
        },
        {
          name: 'primary',
          label: 'Primary button label',
          widget: 'string'
        },
        {
          name: 'secondary',
          label: 'Secondary button label',
          widget: 'string'
        },
        {
          name: 'open_modal',
          label: 'Open modal label',
          widget: 'string'
        },
        {
          name: 'open_alert',
          label: 'Open alert label',
          widget: 'string'
        },
        {
          name: 'alert_dialog',
          label: 'Alert dialog',
          widget: 'object',
          fields: [
            {
              name: 'buttons',
              label: 'Buttons',
              widget: 'object',
              fields: [
                {
                  name: 'yes',
                  label: 'Yes',
                  widget: 'string'
                },
                {
                  name: 'no',
                  label: 'No',
                  widget: 'string'
                }
              ]
            },
            {
              name: 'title',
              label: 'Title',
              widget: 'string'
            },
            {
              name: 'alert_body',
              label: 'Body',
              widget: 'text'
            }
          ]
        },
        {
          name: 'components',
          label: 'Components',
          widget: 'object',
          fields: [
            {
              name: 'arrow',
              label: 'Arrow',
              widget: 'string'
            },
            {
              name: 'button',
              label: 'Button',
              widget: 'string'
            },
            {
              name: 'select_input',
              label: 'Select input',
              widget: 'string'
            },
            {
              name: 'loader',
              label: 'Loader',
              widget: 'string'
            },
            {
              name: 'modal',
              label: 'Modal',
              widget: 'string'
            },
            {
              name: 'alert',
              label: 'Alert',
              widget: 'string'
            },
            {
              name: 'grid',
              label: 'Grid',
              widget: 'string'
            },
            {
              name: 'carousel',
              label: 'Carousel',
              widget: 'string'
            }
          ]
        },
        {
          name: 'modal_content',
          label: 'Modal content',
          widget: 'object',
          fields: [
            {
              name: 'title',
              label: 'Title',
              widget: 'string'
            },
            {
              name: 'modal_body',
              label: 'Body',
              widget: 'markdown'
            }
          ]
        }
      ]
    }
  ]
}
