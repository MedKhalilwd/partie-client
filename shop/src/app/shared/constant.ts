

export const breadcrumbsMenu=[
    {
        label:'Categories',
        path:'/categories',
        children:[
            {
                path:':category'
            },
            {
                path:'/product/:id'
            }
        ]
    }
];

export const MENU:{
    title:string;
    path:string;
}[]
=[
   
    {
        title:'Épicerie',
        path:'/categories/Men'
    },
    {
        title:'boisson',
        path:'/categories/Women'
    },
    {
        title:'Nuttela',
        path:'/categories/Groceries'
    },
    {
        title:'Nuttela',
        path:'/categories/Packaged Foods'
    }
]

