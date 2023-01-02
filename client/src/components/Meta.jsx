import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({title,description,keywords}) => {
  return (
    <Helmet>
    <title>{title}</title>
    <meta name='description' content={description}/>
    <meta name='keywords' content={keywords}/>
  </Helmet>
  )
}

Meta.defaultProps ={
    title:'Welcome to TechShop',
    description:`The best products for sale`,
    keywords: 'eletronics'
}

export default Meta