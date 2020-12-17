import React from "react";
import Product from "../../Product";
import LoginBlock from "../../LoginBlock";
import NhsForm from "../forms/NhsForm/NhsForm";

function ProductLandingPage() {
  return (
    <>
      <Product />
      <LoginBlock />
      <NhsForm />
    </>
  );
}
export default ProductLandingPage;
