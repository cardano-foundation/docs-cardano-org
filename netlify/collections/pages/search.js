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
          name: 'title',
          label: 'Search page title',
          widget: 'string'
        },
        {
          name: 'showing_results',
          label: 'Showing results template label',
          hint: '{{ from }} is replaced with pagination start index, {{ to }} is replaced with pagination end index, {{ total }} is replaced with total results, {{ query }} is replaced with the search query.\n\nAn example search of "cardano" returning 48 results with a template label of:\n"Showing {{ from }} - {{ to }} of {{ total }} results for {{ query }}"\nOn page 1 would read:\n"Showing 1 - 10 of 48 results for cardano"',
          widget: 'string'
        },
        {
          name: 'no_results',
          label: 'No results template label',
          hint: '{{ query }} is replaced with the search query.\n\nAn example search of "cardano" returning 0 results with a template label of:\n"No matching results for {{ query }}"\nWould read:\n"No matching results for cardano"',
          widget: 'string'
        },
        {
          label: 'Previous page label',
          name: 'previous',
          widget: 'string'
        },
        {
          label: 'Next page label',
          name: 'next',
          widget: 'string'
        }
      ]
    }
  ]
}
