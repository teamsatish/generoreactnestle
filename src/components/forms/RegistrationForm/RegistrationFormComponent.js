import React from 'react';
import { range } from 'lodash'
import { Field, useField } from 'formik';

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

function RegFormComponent({ form, values, onOpenMagazineModal }) {
  return (
    <>
      <div className="form-group row">
        <label htmlFor="gender" className="col-md-3 form-col req-after col-form-label">メールアドレス<sub className="red-star">*</sub></label>
        <div className="col-md-9 form-col form-email">
          <div className="js-form-item form-item js-form-type-email form-item-email js-form-item-email form-no-label form-group col-auto">
            <NestInput
              placeholder="メールアドレス"
              type="email"
              name="customer.email"
              className="form-email form-control"
              maxLength={100}
              onChange={e => { form.setFieldValue('customer.email', e.target.value.toLowerCase()) }}
            />
          </div>
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="gender" className="col-md-3 form-col req-after col-form-label">お名前<sub className="red-star">*</sub></label>
        <div className="col-md-9 form-col">
          <div className="row name-kanji">
            <div className="col-6 name-last">
              <div className="js-form-item form-item js-form-type-textfield form-item-last-name js-form-item-last-name form-group col-auto">
                <NestInput
                  haslabel="true"
                  labelClass="js-form-required form-required"
                  placeholder="お名前 (姓)"
                  type="text"
                  name="customer.lastname"
                  maxLength={25}
                  className="form-text required form-control"
                  onChange={e => { form.setFieldValue('customer.lastname', e.target.value.toLowerCase()) }}
                />
              </div>
            </div>
            <div className="col-6 name-first">
              <div className="js-form-item form-item js-form-type-textfield form-item-first-name js-form-item-first-name form-group col-auto">
                <NestInput
                  haslabel="true"
                  labelClass="js-form-required form-required"
                  placeholder="お名前 (名)"
                  type="text"
                  name="customer.firstname"
                  maxLength={25}
                  className="form-text required form-control"
                />
              </div>
            </div>
          </div>
          <div className="row name-kana">
            <div className="col-6 name-last">
              <div className="js-form-item form-item js-form-type-textfield form-item-last-name-kana js-form-item-last-name-kana form-group col-auto">
                <NestInput
                  haslabel="true"
                  labelClass="js-form-required form-required"
                  placeholder="お名前カナ (姓)"
                  type="text"
                  name="customer.lastnamekana"
                  maxLength={40}
                  className="form-text required form-control"
                />
              </div>
            </div>
            <div className="col-6 name-first">
              <div className="js-form-item form-item js-form-type-textfield form-item-first-name-kana js-form-item-first-name-kana form-group col-auto">
                <NestInput
                  haslabel="true"
                  labelClass="js-form-required form-required"
                  placeholder="お名前カナ (姓)"
                  type="text"
                  name="customer.firstnamekana"
                  maxLength={40}
                  className="form-text required form-control"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="form-group gender row">
        <label htmlFor="gender" className="col-md-3 form-col req-after col-form-label">性別<sub className="red-star">*</sub></label>
        <div className="col-md-9 form-col">
          <fieldset className="fieldgroup form-composite required js-form-item form-item js-form-wrapper form-wrapper" >
            <legend>
              <span className="fieldset-legend js-form-required form-required"></span>
            </legend>
            <div className="fieldset-wrapper">
              <div id="edit-sex">
                <div className="js-form-item form-item js-form-type-radio form-item-sex js-form-item-sex form-group col-auto">
                  <Field type="radio" name="customer.gender" value="0" className="form-radio form-control" />
                  <label htmlFor="edit-sex-1" className="option">
                    女性
                                </label>
                </div>
                <div className="js-form-item form-item js-form-type-radio form-item-sex js-form-item-sex form-group col-auto">
                  <Field type="radio" name="customer.gender" value="1" className="form-radio form-control" />
                  <label htmlFor="edit-sex-2" className="option">
                    男性
                                </label>
                </div>
                <div className="js-form-item form-item js-form-type-radio form-item-sex js-form-item-sex form-group col-auto">
                  <Field type="radio" name="customer.gender" value="2" className="form-radio form-control" />
                  <label htmlFor="edit-sex-3" className="option">
                    登録しない
                                </label>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="dob" className="col-md-3 form-col req-after col-form-label">生年月日<sub className="red-star">*</sub></label>
        <div className="col-md-9 form-col">
          <div className="birth-details">
            <div className="birth-col birth-year">
              <div className="birth-value">
                <div className="js-form-item form-item js-form-type-select form-item-dob-year js-form-item-dob-year form-no-label form-group col-auto">
                  <Field id="dobyear" className="form-control form-select" name="customer.dob_year" component="select"
                    onChange={e => { form.setFieldValue('customer.dob_year', e.target.value) }}>
                    <option defaultValue="selected">選択</option>
                    {range((new Date()).getFullYear() - 13, 1910).map((yr) => (<option key={yr} value={yr.toString()} >{yr}</option>))}
                  </Field>
                </div>
              </div>
              <div className="birth-text">年</div>
            </div>
            <div className="birth-col birth-month">
              <div className="birth-value">
                <div className="js-form-item form-item js-form-type-select form-item-dob-month js-form-item-dob-month form-no-label form-group col-auto">
                  <Field id="dobmonth" className="form-control form-select" name="customer.dob_month" component="select"
                    onChange={e => { form.setFieldValue('customer.dob_month', e.target.value) }}>
                    <option defaultValue="selected">選択</option>
                    {range(1, 13).map((mn) => (<option key={mn} value={mn.toString()} >{mn}</option>))}
                  </Field>
                </div>
              </div>
              <div className="birth-text">月</div>
            </div>
            <div className="birth-col birth-day">
              <div className="birth-value">
                <div className="js-form-item form-item js-form-type-select form-item-dob-date js-form-item-dob-date form-no-label form-group col-auto">
                  <Field id="dobdate" className="form-control form-select" name="customer.dob_date" component="select"
                    onChange={e => { form.setFieldValue('customer.dob_date', e.target.value) }}>
                    <option defaultValue="selected">選択</option>
                    {range(1, 32).map(v => <option key={v} value={v.toString()}>{v}</option>)}
                  </Field>
                </div>
              </div>
              <div className="birth-text">日</div>
            </div>
          </div>
        </div>
      </div>
      <div className="form-group password row">
        <label htmlFor="password" className="col-md-3 form-col req-after col-form-label">パスワード<sub className="red-star">*</sub></label>
        <div className="col-md-9 form-col">
          <div className="js-form-item form-item js-form-type-password form-item-password js-form-item-password form-group col-auto">
            <NestInput
              haslabel="true"
              labelClass="js-form-required form-required"
              placeholder="英字と数字、記号を組み合わせた8～16文字"
              type="password"
              name="customer.password"
              className="form-text required form-control"
            />
          </div>
        </div>
      </div>
      <div className="form-group re-password row">
        <label htmlFor="re-password" className="col-md-3 form-col req-after col-form-label">
          パスワード<sub className="red-star">*</sub>
          <span>(再入力)</span>
        </label>
        <div className="col-md-9 form-col">
          <div className="js-form-item form-item js-form-type-password form-item-password-confirm js-form-item-password-confirm form-group col-auto">
            <NestInput
              haslabel="true"
              labelClass="js-form-required form-required"
              placeholder="誤入力防止のため、パスワードを再入力してください"
              type="password"
              name="customer.confirmPassword"
              className="form-text required form-control"
            />
          </div>
        </div>
      </div>
      <div className="form-group mail-magazine row">
        <label htmlFor="mail-magazine" className="col-md-3 form-col col-form-label">メールマガジン</label>
        <div className="col-md-9 form-col">
          <div className="form-check">
            <div className="js-form-item form-item js-form-type-checkbox form-item-mail-magazine js-form-item-mail-magazine form-group col-auto">
              <Field
                type="checkbox"
                name="allow_email_magazine"
                id="magazinetext"
                className="form-checkbox form-check-input mail_magazine-checkbox"
              />
              <label htmlFor="magazinetext" className="option">メールマガジンによる情報を希望する(<a className="modal-link" data-toggle="modal" onClick={onOpenMagazineModal}>詳細</a>)</label>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="form-group row">
                <div className="col-md-12 form-col">
                    <div className="submit-control text-center">
                        <div className="form-actions js-form-wrapper form-wrapper">
                            <div className="form-actions">
                                <button className="btn btn-res-form btn__submit button js-form-submit form-submit" type="submit" name="op" >
                                    {false ? 'Submitting...' : '新規登録'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
    </>
  )
}

export default RegFormComponent;
