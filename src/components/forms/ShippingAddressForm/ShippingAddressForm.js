import React, { useMemo, useState, useCallback } from 'react';
import { useField } from 'formik';
import { connect } from "react-redux";
import { useMutation } from '@apollo/client'
import { get as getProperty } from "lodash";
import MagentoMutations from './../../../mutation'
import { isLoggedIn, getFormFieldValue } from '../../../utils'
import { defaultAddress } from '../NhsForm/initialDeliveryAddressValues'
import { getCustomerDetailsSelector, getCartIdSelector, getCartDataSelector } from "../../../store/selectors";

export const NestInput = ({ label, labelClass, ...props }) => {
	const [field, meta] = useField(props);
	return (
		<>
			{props.haslabel && <label htmlFor={props.id || props.name} className={labelClass}></label>}
			<input {...field} {...props} />
			{meta.touched && meta.error ? (
				<div className="text-danger">{meta.error}</div>
			) : null}
		</>
	);
};

// Get shipping profiles.
function ShippingProfiles({ customerData = {} }) {
	return [
		<option key="add_new_shipping_address" value="add_new_shipping_address">
			新しいお届け先を登録する
    </option>,
		...customerData.addresses.map((address) => (
			<option key={address.id} value={address.id}>
				{address.riki_nickname}
			</option>
		)),
	];
}

function ShippingAddressForm({ cartId, customerData, values, setShowDeliveryForm, form, setIsAddressButtonDisabled, setShowShippingForm }) {

	const addressMap = useMemo(() =>
		new Map(getProperty(customerData, "addresses", [])
			.map(address => [address.id, address]), [customerData])
	);

	const resetDeliveryAddress = useCallback((selectedAddressId, form) => {
		const addressValues = addressMap.get(parseInt(selectedAddressId));
		if (addressValues) {
			Reflect.ownKeys(addressValues).forEach((key) => {
				form.setFieldValue(`shipping_address.${key}`, addressValues[key])
				setShippingFormDisabled(true)
			})
			getZipCodeInfo(addressValues['postcode']);
		}
		else {
			Reflect.ownKeys(defaultAddress).forEach((key) => {
				form.setFieldValue(`shipping_address.${key}`, '')
				setShippingFormDisabled(false)
			})
		}
	}, [addressMap, defaultAddress]);

	function setDeliverySelection(e, form) {
		form.setFieldValue('delivery_selection', e.target.value)
		resetDeliveryAddress(e.target.value, form)
	}

	// const [showDeliveryForm, setShowShippingFormval] = useState(true)
	const [shippingFormDisabled, setShippingFormDisabled] = useState(false);
	const [cityOptions, setCityOptions] = useState([]);

	const [getZipCodeMutation] = useMutation(MagentoMutations.POST_ZIP_CODE, {
		onCompleted: (data) => {
			if (data) {
				form.setFieldValue('shipping_address.prefecture', data.getPostcodeInfo.prefecture_name)
				form.setFieldValue('shipping_address.region', data.getPostcodeInfo.prefecture_code)
				// form.setFieldValue('shipping_address.city', data.getPostcodeInfo.town_name)
			}
		}, onError: (error) => { console.log(error) }
	});

	function resetAutoFill() {
		form.setFieldValue('shipping_address.prefecture', '')
		form.setFieldValue('shipping_address.city', '')
	}

	function getZipCodeInfo(postcode) {
		if (postcode) {
			form.setFieldValue('shipping_address.postcode', postcode.trim());
		} else {
			form.setFieldValue('shipping_address.postcode', '');
		}
		if (postcode && postcode.length >= 7) {
			getZipCodeMutation({ variables: { code: postcode.replaceAll('-', '') } })
			getPostalDetail(postcode.replaceAll('-', ''));
		} else {
			resetAutoFill();
		}
	}

	// get Postal Code Details.
	function getPostalDetail(code) {
		if (code.length >= 7) {
			fetch('/postal-detail/' + code)
				.then(res => res.json())
				.then(
					(result) => {
						setCityOptions(result.city)
						form.setFieldValue('shipping_address.city', result.city[0])
					},
					(error) => {
						setCityOptions([])
						resetAutoFill()
					}
				)
		}
	}
	// Create options for Muncipality Method.
	function MuncipalityOptions() {
		let unique_keys = new Set(cityOptions)
		const options = Array.from(unique_keys).map((data, index) => (<option key={index} value={data}>{data}</option>));
		return <select name="shipping_address.city" className="form-control form-select select-manage" onChange={e => { form.setFieldValue("shipping_address.city", e.target.value) }} value={getFormFieldValue(form, "shipping_address.city")} >
			{options}
		</select>;
	}
	function getCheck(name, key) {
		const formInstance = form.getFieldMeta()
		const values = formInstance.value;
		// setShowShippingFormval(values.shipping_address.deliver_to === 'other_address')
		return key === values[name];
	}

	return <>
		(
				<div className="short-registration-page">
			<div className="container short-registration-content react-registration-container">
				<div className="form-timeline">
					<div className="form-timeline-inner">
						<div className="short-registration-form">
							<div className="form-content">
								<div className="form-header">商品お届け先<sub className="red-star">*</sub></div>
								<div className="form-group row large-radio">
									<input
										type="radio" className="radio_input"
										value="my_address" name="deliver_to"
										checked={getCheck('deliver_to', 'my_address')}
										onChange={e => { form.setFieldValue('deliver_to', 'my_address'); setShowShippingForm(false); setIsAddressButtonDisabled(false) }}
									/>
									<div className="form-col form-email">
										<span className="radio_input_light">会員住所</span>に配送する
                                    </div>
								</div>
								<div className="form-group row large-radio">
									<input
										type="radio" className="radio_input"
										value="other_address" name="deliver_to"
										onChange={e => { form.setFieldValue('deliver_to', 'other_address'); setShowShippingForm(true); setIsAddressButtonDisabled(false) }}
										checked={getCheck('deliver_to', 'other_address')}
									/>
									<div className="form-col form-email">
										<span className="radio_input_light">会員住所以外</span>に配送する
                                    </div>
								</div>

								{
									values.deliver_to !== 'my_address' &&
									(<div>
										{isLoggedIn() && customerData && customerData.addresses &&
											< div className="form-group row">
												<label htmlFor="gender" className="col-md-3 form-col col-form-label  color-label-black">お届け先の選択</label>
												<div className="col-md-9 form-col form-email">
													<div
														className="js-form-item form-item js-form-type-email form-item-email js-form-item-email form-no-label form-group col-auto select-wrapper">
														<select name="delivery_selection"
															className="form-control form-select select-manage"
															onChange={e => setDeliverySelection(e, form)}>
															<ShippingProfiles customerData={customerData} />
														</select>
													</div>
												</div>
											</div>
										}
										<div className="form-group row">
											<label htmlFor="gender" className="col-md-3 form-col req-after col-form-label">お届け先の<br /> 登録名<sub
												className="red-star">*</sub> <span>【全角】</span></label>
											<div className="col-md-9 form-col form-email">
												<div
													className="js-form-item form-item js-form-type-email form-item-email js-form-item-email form-no-label form-group col-auto">
													<NestInput
														placeholder="例: 実家"
														type="text"
														onChange={e => { form.setFieldValue('shipping_address.riki_nickname', e.target.value) }}
														name="shipping_address.riki_nickname"
														disabled={shippingFormDisabled}
														className="form-email form-control"
													/>
													<span className="input_sub_text">※ご注文時のお届け設定での選択項目になりますのでご注意ください。</span>
												</div>
											</div>
										</div>
										<div className="form-group row">
											<label htmlFor="gender" className="col-md-3 form-col req-after col-form-label">お名前<sub
												className="red-star">*</sub> </label>
											<div className="col-md-9 form-col">
												<div className="row name-kanji">
													<div className="col-6 name-last">
														<div
															className="js-form-item form-item js-form-type-textfield form-item-last-name js-form-item-last-name form-group col-auto">
															<label htmlFor="edit-last-name" className="js-form-required form-required"></label>

															<NestInput
																placeholder="お名前（姓）"
																type="text"
																name="shipping_address.lastname"
																className="form-text required form-control"
																disabled={shippingFormDisabled}
															/>
														</div>
													</div>
													<div className="col-6 name-first">
														<div
															className="js-form-item form-item js-form-type-textfield form-item-first-name js-form-item-first-name form-group col-auto">
															<label htmlFor="edit-first-name" className="js-form-required form-required"></label>

															<NestInput
																placeholder="お名前（名"
																type="text"
																className="form-text required form-control"
																name="shipping_address.firstname"
																disabled={shippingFormDisabled}
															/>
														</div>
													</div>
												</div>
												<div className="row name-kana">
													<div className="col-6 name-last">
														<div
															className="js-form-item form-item js-form-type-textfield form-item-last-name-kana js-form-item-last-name-kana form-group col-auto">
															<label htmlFor="edit-last-name-kana" className="js-form-required form-required"></label>

															<NestInput
																placeholder="お名前カナ（姓）"
																className="form-text required form-control"
																type="text"
																name="shipping_address.lastnamekana"
																disabled={shippingFormDisabled}
															/>

														</div>
													</div>
													<div className="col-6 name-first">
														<div
															className="js-form-item form-item js-form-type-textfield form-item-first-name-kana js-form-item-first-name-kana form-group col-auto">
															<label htmlFor="edit-first-name-kana" className="js-form-required form-required"></label>

															<NestInput
																placeholder="お名前カナ（姓）"
																className="form-text required form-control"
																type="text"
																name="shipping_address.firstnamekana"
																disabled={shippingFormDisabled}
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="form-group row">
											<label htmlFor="gender" className="col-md-3 form-col req-after col-form-label">電話番号<sub
												className="red-star">*</sub><br /> <span>【半角数字｜ハイフン不要】</span></label>
											<div className="col-md-9 form-col form-email">
												<div
													className="js-form-item form-item js-form-type-email form-item-email js-form-item-email form-no-label form-group col-auto">

													<NestInput
														placeholder="090011112222"
														className="form-text required form-control"
														type="text"
														name="shipping_address.telephone"
														disabled={shippingFormDisabled}
													/>
												</div>
											</div>
										</div>
										<div className="form-group row">
											<label htmlFor="gender" className="col-md-3 form-col req-after col-form-label">郵便番号<sub
												className="red-star">*</sub><br /><span>【半角数字｜ハイフン不要】</span></label>
											<div className="col-md-9 form-col">
												<div className="row name-kanji">
													<div className="col-6 name-last">
														<div
															className="js-form-item form-item js-form-type-textfield form-item-last-name js-form-item-last-name col-auto">
															<label htmlFor="edit-last-name" className="js-form-required form-required"></label>

															<NestInput
																placeholder="6510087"
																className="form-text required form-control"
																type="text"
																name="shipping_address.postcode"
																onChange={(e) => getZipCodeInfo(e.target.value)}
																maxLength={8}
																disabled={shippingFormDisabled}
															/>
														</div>
													</div>
													<div className="col-6 name-last zip-code window-icon">
														<a
															href="https://www.post.japanpost.jp/zipcode/"
															target="_blank"
														>
															郵便番号を調べる（日本郵便へ）
                                                    </a>
													</div>
												</div>
											</div>
										</div>
										<div className="form-group row">
											<label htmlFor="gender" className="col-md-3 form-col req-after col-form-label">都道府県<sub
												className="red-star">*</sub> </label>
											<div className="col-md-9 form-col">
												<div className="row name-kanji">
													<div className="col-6 name-last">
														<div
															className="js-form-item form-item js-form-type-textfield form-item-last-name js-form-item-last-name col-auto">
															<label htmlFor="edit-last-name" className="js-form-required form-required"></label>

															<NestInput
																placeholder="兵庫県"
																className="form-text required form-control"
																type="text"
																name="shipping_address.prefecture"
																disabled={true}
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="form-group row">
											<label htmlFor="gender" className="col-md-3 form-col req-after col-form-label">市区町村<sub
												className="red-star">*</sub> </label>
											<div className="col-md-9 form-col form-email">
												<div
													className="js-form-item form-item js-form-type-email form-item-email js-form-item-email form-no-label form-group col-auto">
													{
														cityOptions.length > 1 ? <MuncipalityOptions /> : <NestInput
															placeholder="神戸市中央区御幸通"
															className="form-text required form-control"
															type="text"
															name="shipping_address.city"
															disabled={true}
														/>
													}

												</div>
											</div>
										</div>
										<div className="form-group row">
											<label htmlFor="gender" className="col-md-3 form-col req-after col-form-label">丁目・番地・<br />建物等<sub
												className="red-star">*</sub></label>
											<div className="col-md-9 form-col form-email">
												<div
													className="js-form-item form-item js-form-type-email form-item-email js-form-item-email form-no-label form-group col-auto">

													<NestInput
														placeholder="神戸市中央区御幸通"
														className="form-text required form-control"
														type="text"
														name="shipping_address.street"
														disabled={shippingFormDisabled}
													/>
												</div>
											</div>
										</div>
									</div>


									)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div >
		)
	</>

}

const mapStateToProps = (state) => ({
	customerData: getCustomerDetailsSelector(state),
	cartId: getCartIdSelector(state),
	cartData: getCartDataSelector(state)
});
export default connect(mapStateToProps)(ShippingAddressForm);
