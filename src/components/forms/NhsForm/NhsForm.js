import React, { useEffect, useState, useCallback, useRef } from "react";
import { Formik } from "formik";
import { cloneDeep } from "lodash";
import { connect } from "react-redux";
import registationFormSchema from "../../../schemas/registrationFormSchema";
import billingFormSchema from "../../../schemas/billingFormSchema";
import shippingFormSchema from "../../../schemas/shippingFormSchema";
import Recaptcha from "../../../registration-forms/recaptcha.jsx";
import VerifyAuthKeyForm from "../../../components/forms/VerifyAuthKeyForm/VerifyAuthKeyForm";
import Modal from "../../../registration-forms/modal.jsx";
import { isLoggedIn, showNestleBlockContent } from "../../../utils";
import NhsFormComponent from "./NhsFormComponent";
import { defaultAddress, developmentDefaultAddress } from "./initialDeliveryAddressValues";
import {
  getCartIdSelector,
  getBearerTokenSelector,
  getCustomerDetailsSelector,
  getBillingAddressSelector,
} from "../../../store/selectors";
import PaymentForm from "../PaymentForm/PaymentForm";
import AuthService from "../../../services/AuthService";
import { appConfig } from "../../../config";
import ThanksPage from "../../../registration-forms/thanks-page";
import AddressService from "../../../services/AddressService";
import { setPaymentFormConfig } from "../../../store/appStore/payment";
import { store } from "../../../store/store";


const SITE_KEY = "6Le6sN8ZAAAAAJK_vHEMFfZ2Ociqlcw-_JogM3J8";

//TODO: fix variable name
const customerDefaultValue = appConfig.isLocalDevelopment ?
  {
    firstname: "satish",
    lastname: "gupta",
    lastnamekana: "lastnamekana",
    firstnamekana: "firstnamekana",
    email: "satishkumr001+nestle@gmail.com",
    gender: "0",
    password: "P@ssw0rd",
    confirmPassword: "P@ssw0rd",
    dob_year: "2007",
    dob_month: "1",
    dob_date: "1",
  } : {
    firstname: "",
    lastname: "",
    lastnamekana: "",
    firstnamekana: "",
    confirmPassword: "",
    dob_year: "",
    dob_month: "",
    dob_date: "",
    email: "",
    gender: "0",
    password: "",
  };

const initialValueRegistration = {
  customer: customerDefaultValue,
  allow_email_magazine: true,
  delivery_selection: "add_new_shipping_address",
  // deliver_to: "other_address",
  deliver_to: "my_address",
  billing_address: appConfig.isLocalDevelopment ? developmentDefaultAddress : cloneDeep(defaultAddress),
  shipping_address: { ...cloneDeep(defaultAddress), riki_nickname: "" },
};

function isUserLoggedInAndHaveValueInCart() {
  return localStorage.getItem('BEARER_TOKEN') && Number(localStorage.getItem('cart_quantity') || 0) > 0 ? false : true
}

function NhsForm({ cartId, billingAddress }) {
  const [showFillOtpForm, setShowFillOtpForm] = useState(false);
  const [showThanksModal, setShowThanksModal] = useState(false);
  const [disablePaymentMethodForm, setDisablePaymentMethodForm] = useState(
    isUserLoggedInAndHaveValueInCart()
  );
  const [isAddressButtonDisabled, setIsAddressButtonDisabled] = useState(
    !isUserLoggedInAndHaveValueInCart()
  );
  const [registrationValue, setRegistrationValue] = useState({});
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [formValue, setFormValue] = useState({});
  const [hasError, setHasError] = useState(false);
  const userStatus = ["new", "duplication"];

  const init = {
    ...initialValueRegistration,
    billing_address: {
      ...initialValueRegistration.billing_address,
      ...billingAddress,
    },
  };
  const [initVal, setInitVal] = useState(init);

  useEffect(() => {
    setInitVal((initVal) => ({
      ...initVal,
      ...formValue,
      billing_address: {
        ...initVal.billing_address,
        ...(formValue.billing_address || {}),
        ...billingAddress,
      },
    }));
  }, [billingAddress, formValue]);

  useEffect(() => {
    showNestleBlockContent();
  }, []);

  useEffect(() => {
    if (Number(localStorage.getItem('cart_quantity') || 0) && localStorage.getItem('BEARER_TOKEN')) {

    }
  }, []);

  function modalClose() {
    setShowFillOtpForm(false);
  }

  async function sendEmail(val) {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(SITE_KEY, { action: "submit" })
        .then(async (token) => {
          const register = {
            ...val.customer,
            register_type: "customer",
            date_of_birth:
              val.customer.dob_year + "/" + val.customer.dob_month + "/" + val.customer.dob_date,
            allow_email_magazine: !!val.customer.allow_email_magazine ? 1 : 0,
          };

          const { data: emailResponse } = await AuthService.requestLoginOtp({
            variables: { token: token, ...register },
          });

          if (userStatus.includes(emailResponse.sendEmailVerification.type)) {
            setRegistrationValue(register);
            setShowFillOtpForm(true);
          }
        });
    });
  }

  function mergeSchema(...schemas) {
    const [first, ...rest] = schemas;

    const merged = rest.reduce(
      (mergedSchemas, schema) => mergedSchemas.concat(schema),
      first
    );

    return merged;
  }

  const userSchema = useCallback(() => {
    let schema = !isLoggedIn()
      ? mergeSchema(
        registationFormSchema,
        billingFormSchema,
        shippingFormSchema
      )
      : billingFormSchema;
    if (!isLoggedIn() && !showShippingForm) {
      schema = mergeSchema(registationFormSchema, billingFormSchema);
    }
    return schema;
  }, [isLoggedIn(), showShippingForm]);

  async function onVerificationSuccess(formValue) {
    setIsAddressButtonDisabled(true);
    await saveAddress(formValue);
    setShowFillOtpForm(false);
    setShowThanksModal(true);
  }

  const saveAddress = useCallback(
    async (formValue) => {
      const values = cloneDeep(formValue);
      let billingAddress = values.billing_address;
      let shippingAddress = values.shipping_address || values.billing_address;

      // register new address
      const customer_address = {
        ...values.shipping_address,
        region: {
          region_code: values.shipping_address.region,
          region: values.shipping_address.prefecture,
        },
      };
      // Remove attributes not required by API.
      delete billingAddress.country;
      delete billingAddress.riki_nickname;
      delete billingAddress.prefecture;
      delete shippingAddress.country;
      delete shippingAddress.riki_nickname;
      delete shippingAddress.prefecture;
      delete shippingAddress.id;
      delete shippingAddress.riki_type_address;
      delete customer_address.prefecture;

      // Get default values.
      billingAddress = {
        ...billingAddress,
        firstname: billingAddress.firstname || values.customer.firstname,
        lastname: billingAddress.lastname || values.customer.lastname,
        lastnamekana:
          billingAddress.lastnamekana || values.customer.lastnamekana,
        firstnamekana:
          billingAddress.firstnamekana || values.customer.firstnamekana,
      };

      const billingValues = {
        variables: {
          cart_id: cartId,
          same_as_shipping: values.deliver_to === "my_address",
          address: billingAddress,
        },
      };

      if (values.deliver_to === "my_address") {
        shippingAddress = billingAddress;
      }

      const shippingValues = {
        variables: { cart_id: cartId, address: shippingAddress },
      };

      await AddressService.saveBillingAddress(
        billingValues
      );

      const {
        data: shippingAddressResponse,
      } = await AddressService.saveShippingAddress(shippingValues);

      if (shippingAddressResponse) {
        setDisablePaymentMethodForm(false);
        setIsAddressButtonDisabled(true);
      }

      AddressService.setPaymentMethodConfigs(shippingAddressResponse.setShippingAddressesOnCart);

      if (
        values.deliver_to === "other_address" &&
        values.delivery_selection === "add_new_shipping_address"
      ) {
        await AddressService.updateCartShippingAddress({
          variables: { cart_id: cartId, customer_address },
        });
        setDisablePaymentMethodForm(false);
      }
    },
    [cartId]
  );

  const onSubmit = useCallback(
    (values, actions) => {
      actions.setStatus({});
      setFormValue(values);
      if (localStorage.getItem("cart_quantity") < 1) {
        setHasError(true);
        return;
      } else {
        setHasError(false);
      }
      try {
        if (isLoggedIn()) {
          !hasError && saveAddress(values);
        } else {
          !hasError && sendEmail(values);
        }
      } catch (err) {
        console.error(err);
        actions.setSubmitting(false);
      }
    },
    [isLoggedIn(), setFormValue]
  );
  return (
    <>
      <Formik
        initialValues={initVal}
        onSubmit={onSubmit}
        enableReinitialize={true}
        // validationSchema={userSchema()}
        component={(formikProps) => (
          <NhsFormComponent
            {...formikProps}
            hasError={hasError}
            setShowShippingForm={setShowShippingForm}
            setIsAddressButtonDisabled={setIsAddressButtonDisabled}
            isAddressButtonDisabled={isAddressButtonDisabled}
          />
        )}
      />

      <PaymentForm
        disablePaymentMethodForm={disablePaymentMethodForm}
      />

      <Recaptcha />
      <Modal
        show={showFillOtpForm}
        handleClose={(e) => modalClose(e)}
        children={
          <VerifyAuthKeyForm
            closeModal={modalClose}
            nhsFormValue={formValue}
            registerFormValue={registrationValue}
            afterRegesterSuccess={() => {
              onVerificationSuccess(formValue);
            }}
          />
        }
      ></Modal>

      <Modal
        show={showThanksModal}
        children={
          <ThanksPage
            closeModal={() => {
              setShowThanksModal(false);
            }}
            nhsFormValue={formValue}
          />
        }
      ></Modal>

    </>
  );
}

const mapStateToProps = (state) => ({
  cartId: getCartIdSelector(state),
  token: getBearerTokenSelector(state),
  customerData: getCustomerDetailsSelector(state),
  billingAddress: getBillingAddressSelector(state),
});

export default connect(mapStateToProps)(NhsForm);
