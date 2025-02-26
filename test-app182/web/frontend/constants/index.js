export const DATA_TRANSLATIONS = [
    {
      id: 0,
      locale: "English",
      translate: {
        placeholder_text: "",
        button_text: "",
      },
    },
    {
      id: 1,
      locale: "China",
      translate: {
        placeholder_text: "",
        button_text: "",
      },
    },
  ];
  
  export const DATA_BORDER_TYPE = [
    {
      value:"dotted",
      title:"Dotted"
    },
    {
      value:"dashed",
      title:"Dashed"
    },
    {
      value:"solid",
      title:"Solid"
    },
    {
      value:"double",
      title:"Double"
    },
    {
      value:"groove",
      title:"Groove"
    },
    {
      value:"ridge",
      title:"Ridge"
    },
    {
      value:"inset",
      title:"Inset"
    },
    {
      value:"outset",
      title:"Outset"
    },
    {
      value:"none",
      title:"None"
    },
    {
      value:"hidden",
      title:"Hidden"
    },
  ];
  
  export const DATA_BUTTON_TYPE = [
      {
          title:'Plain',
          value:'plain'
      },
      {
          title:'Primary',
          value:'primary'
      },
      {
          title:'Secondary',
          value:'secondary'
      },
      {
          title:'Tertiary',
          value:'tertiary'
      },
      {
          title:'MonochromePlain',
          value:'monochromePlain'
      },
  
  ]
  
  export const DEFAULT_CUSTOMIZE = {
    input_width: 333,
    input_height: 52,
    input_border: 'solid',
    input_border_radius: 0,
    input_background_color: '#fff',
    button_variant: 'plain',
    border_width: 0,
    border_color: '#1773b0',
    button_width: 57,
    button_height: 39,
    button_border: 'dotted',
    button_background_color: '#1773b0',
    button_text_color: '#fff',
    direction: 'horizontal',
    css:''
  }
  export const DEFAULT_TRANSLATION = {
    locale:'English',
    translate : {
      placeholder_text:'Discount code',
      button_text:'Apply'
    }
  }
  