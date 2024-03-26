import type { Schema, Attribute } from '@strapi/strapi';

export interface SetProductUnit extends Schema.Component {
  collectionName: 'components_set_product_units';
  info: {
    displayName: 'Product Unit';
    icon: 'priceTag';
  };
  attributes: {
    a: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'set.product-unit': SetProductUnit;
    }
  }
}
