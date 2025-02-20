export interface Product {
    id?: string;
    title:string;
    image:string;
    price: number;
    description: string;
    category: string;
};

export interface Cart {
    id?:string; // could the id be the userId? 
    products: {[id:string]: number}; // id:quantity
    totalItems: number;
};

export interface User {
    id?: string; // id is optional, as it will only be available after data is fetched
    name: string;
    email: string;
    phone: string;
    address: string;
};