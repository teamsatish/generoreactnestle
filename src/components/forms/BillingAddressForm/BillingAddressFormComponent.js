import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { NestInput } from "../../core/Elements";
import { removeSpecialChars, sanitizeAddressString } from "../../core/utils";
import { useMutation } from "@apollo/client";
import MagentoMutations from "../../../mutation";
import { isLoggedIn, getFormFieldValue } from "../../../utils";
import { getBillingAddressSelector } from "../../../store/selectors";
import ApiService from "../../../services/ApiService";

function ContactInfoForm({ form, billingAddress }) {
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    if (isLoggedIn && billingAddress && billingAddress.postcode) {
      getZipCodeInfo(billingAddress.postcode);
    }
  }, [billingAddress]);


  function resetAutoFill() {
    form.setFieldValue("billing_address.prefecture", "");
    form.setFieldValue("billing_address.city", "");
  }

  async function getZipCodeInfo(zipcode) {
    if (zipcode) {
      form.setFieldValue("billing_address.postcode", zipcode.trim());
    } else {
      form.setFieldValue("billing_address.postcode", "");
    }
    if (zipcode && zipcode.length >= 7) {
      try {

        const zipCodeResponse = await ApiService.mutate(MagentoMutations.POST_ZIP_CODE, { variables: { code: zipcode.replaceAll("-", "") } });

        form.setFieldValue(
          "billing_address.prefecture",
          zipCodeResponse.data.getPostcodeInfo.prefecture_name
        );
        form.setFieldValue(
          "billing_address.region",
          zipCodeResponse.data.getPostcodeInfo.prefecture_code
        );

        // Developers Note: getCitiesListFromPostCode return dummy value for post code : 6510087
        const citiesList = await ApiService.getCitiesListFromPostCode(zipcode);
        setCityOptions(citiesList);
        form.setFieldValue("billing_address.city", citiesList[0] || "");
      } catch (error) {
        resetAutoFill()
      }
    }
  }

  // Create options for Muncipality Method.
  function MuncipalityOptions() {
    let unique_keys = new Set(cityOptions);
    const options = Array.from(unique_keys).map((data, index) => (
      <option key={index} value={data}>
        {data}
      </option>
    ));
    return (
      <select
        name="billing_address.city"
        className="form-control form-select select-manage"
        onChange={(e) => {
          form.setFieldValue("billing_address.city", e.target.value);
        }}
        value={getFormFieldValue(form, "billing_address.city")}
      >
        {options}
      </select>
    );
  }
  return (
    <>
      <div className="form-group row">
        <label
          htmlFor="gender"
          className="col-md-3 form-col req-after col-form-label"
        >
          電話番号<sub className="red-star">*</sub>
          <br />
          <span>【半角数字｜ハイフン不要】</span>
        </label>
        <div className="col-md-9 form-col form-email">
          <div className="js-form-item form-item js-form-type-email form-item-email js-form-item-email form-no-label form-group col-auto">
            <NestInput
              label="電話番号"
              name="billing_address.telephone"
              type="text"
              placeholder="090011112222"
              className="form-email form-control"
              disabled={isLoggedIn()}
              maxLength={11}
              onChange={(e) => {
                form.setFieldValue(
                  "billing_address.telephone",
                  removeSpecialChars(e.target.value)
                );
              }}
            />
          </div>
        </div>
      </div>
      <div className="form-group row">
        <label
          htmlFor="zipcode"
          className="col-md-3 form-col req-after col-form-label"
        >
          郵便番号<sub className="red-star">*</sub> <br />
          <span>【半角数字｜ハイフン不要】</span>
        </label>
        <div className="col-md-9 form-col">
          <div className="row name-kanji">
            <div className="col-6 name-last">
              <div className="js-form-item form-item js-form-type-textfield form-item-last-name js-form-item-last-name col-auto">
                <label
                  htmlFor="edit-last-name"
                  className="js-form-required form-required"
                ></label>
                <NestInput
                  label="郵便番号"
                  name="billing_address.postcode"
                  type="text"
                  placeholder="6510087"
                  haslabel="true"
                  disabled={isLoggedIn()}
                  className="form-email form-control"
                  maxLength={8}
                  onChange={(e) => {
                    form.setFieldValue("billing_address.postcode");
                    getZipCodeInfo(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-6 name-last zip-code window-icon">
              <a href="https://www.post.japanpost.jp/zipcode/" target="_blank">
                郵便番号を調べる（日本郵便へ）
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="form-group row">
        <label
          htmlFor="prefecture"
          className="col-md-3 form-col req-after col-form-label"
        >
          都道府県<sub className="red-star">*</sub>{" "}
        </label>
        <div className="col-md-9 form-col">
          <div className="row name-kanji">
            <div className="col-6 name-last">
              <div className="js-form-item form-item js-form-type-textfield form-item-last-name js-form-item-last-name col-auto">
                <label
                  htmlFor="edit-last-name"
                  className="js-form-required form-required"
                ></label>
                <NestInput
                  label="都道府県"
                  name="billing_address.prefecture"
                  type="text"
                  disabled={true}
                  className="form-email form-control"
                  placeholder="兵庫県"
                  onChange={(e) =>
                    form.setFieldValue("billing_address.prefecture")
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="form-group row">
        <label
          htmlFor="municipality"
          className="col-md-3 form-col req-after col-form-label"
        >
          市区町村<sub className="red-star">*</sub>{" "}
        </label>
        <div className="col-md-9 form-col form-email">
          <div className="js-form-item form-item js-form-type-email form-item-email js-form-item-email form-no-label form-group col-auto">
            {cityOptions.length > 1 ? (
              <MuncipalityOptions />
            ) : (
                <NestInput
                  label="市区町村"
                  name="billing_address.city"
                  type="text"
                  disabled={true}
                  className="form-text required form-control"
                  placeholder="神戸市中央区御幸通"
                  onChange={(e) => form.setFieldValue("billing_address.city")}
                />
              )}
          </div>
        </div>
      </div>
      <div className="form-group row">
        <label
          htmlFor="address"
          className="col-md-3 form-col req-after col-form-label"
        >
          丁目・番地・
          <br />
          建物等<sub className="red-star">*</sub>{" "}
        </label>
        <div className="col-md-9 form-col form-email">
          <div className="js-form-item form-item js-form-type-email form-item-email js-form-item-email form-no-label form-group col-auto">
            <NestInput
              label="丁目・"
              name="billing_address.street"
              type="text"
              placeholder=""
              disabled={isLoggedIn()}
              maxLength={100}
              className="form-text required form-control"
              onChange={(e) => {
                form.setFieldValue(
                  "billing_address.street",
                  // e.target.value
                  sanitizeAddressString(e.target.value)
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  billingAddress: getBillingAddressSelector(state),
});
export default connect(mapStateToProps)(ContactInfoForm);
