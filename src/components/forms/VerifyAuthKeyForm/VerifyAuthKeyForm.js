import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import MagentoMutations from "../../../mutation";
import AuthService from "../../../services/AuthService";
import { getCartIdSelector } from "../../../store/selectors";
import ApiService from "../../../services/ApiService.js";

function VerifyAuthKeyForm({
  registerFormValue,
  afterRegesterSuccess,
  cartId,
}) {
  const [auth_key, setAuthKey] = useState("");
  const [authError, setAuthError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data: authRespose } = await ApiService.mutate(MagentoMutations.POST_AUTH_KEY_VARIFICATION, {
        variables: { authKey: auth_key, ...registerFormValue },
      });
      if (authRespose.registerCustomerAccount.customer_id) {
        setAuthError(false);
        const { data: loginResponse } = await ApiService.mutate(MagentoMutations.POST_LOGIN, {
          variables: {
            email: registerFormValue.email,
            pwd: registerFormValue.password,
          },
        })

        if (loginResponse.generateCustomerToken.token) {
          AuthService.setBearerToken(loginResponse.generateCustomerToken.token);
          await AuthService.mapCartIdForCurrentUser(cartId);
          await afterRegesterSuccess();
        }
      }
    } catch (error) {
      setAuthError(true);
    }
  }
  return (
    <Fragment>
      <div className="checkmail-contents">
        <div className="confirmation-form">
          <div className="checkmail-title mb-50">認証キーの入力</div>
          <div className="checkmail-content mb-50">
            <span>
              <div className="email-message mb-50">
                <p>ネスレ会員への登録はまだ完了しておりません。</p>
                <p>
                  ご入力いただいたメールアドレス[{registerFormValue.email}
                  ]宛に、認証キーを送信しました。
                </p>
                <p>
                  認証キーをご入力いただき、「登録完了」ボタンを押すと、会員登録が完了します。
                </p>
              </div>
            </span>
            <div className="checkmail-notification mb-50">
              <div className="text-red">
                <p>
                  ※本画面を閉じないでください。閉じた場合は、登録内容を最初から入力する必要があります。
                </p>
                <p>
                  ※認証キー入力の有効時間は20分間となっております。お早めに入力してください。
                </p>
              </div>
            </div>
            {authError && (
              <div className="text-red">
                <p>Please enter a valid authentication key</p>
              </div>
            )}
            <div className="js-form-item form-item js-form-type-textfield form-item-auth-key js-form-item-auth-key form-no-label form-group col-auto">
              <input
                placeholder="認証キーを入力する"
                className="form-control max-130 form-text form-control"
                data-drupal-selector="edit-auth-key"
                type="text"
                name="auth_key"
                size="60"
                maxLength="4"
                onChange={(e) => setAuthKey(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button
                className="btn btn-confirm btn__submit mt-20 min-200 button js-form-submit form-submit"
                data-drupal-selector="edit-submit"
                type="button"
                id="edit-submit"
                name="op"
                value="登録完了"
                onClick={handleSubmit}
              >
                次へ
              </button>
            </div>
            <div className="checkmail-details mb-50">
              <p className="details-title">
                メールが届かない場合は以下の点をご確認ください。
              </p>
              <p>(1) 入力したメールアドレスに誤りがある</p>
              <p>(2) 迷惑メールフォルダに振り分けられている</p>
              <p>
                (3)
                お客様のメールボックスの容量がオーバーし、メールを受信できない状態にある
              </p>
              <p>(4) 通信状況でメール受信が遅れている</p>
            </div>
          </div>
        </div>
      </div>
      {/* TODO: Display thanks popup */}
    </Fragment>
  );
}

const mapStateToProps = (state) => ({
  cartId: getCartIdSelector(state),
});

export default connect(mapStateToProps)(VerifyAuthKeyForm);
