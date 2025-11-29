export type loginDataType = {
  loginEmail: string;
  loginPassword: string;
  expected: string;
};

export type registerDataType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: number | string;
  occupation: string;
  gender: string;
  password?: string | number;
  confirmPassword?: string | number;
  expected: string;
};

export type mainDataType = {
  loginEmail: string;
  loginPassword: string;
  stateFile: string;
  country: string;
  products: {
    productName: string;
    productAmount: string;
    productId: string;
  }[];
};

export type ordersDataType = {
  "S.No": string;
  "Invoice Number": string;
  "Product Name": string;
  "Product Description": string;
  "Product Price": string;
  Address: string;
  "Ordered By": string;
};
