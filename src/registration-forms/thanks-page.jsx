import React, { Fragment, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

function ThanksPage({ closeModal, nhsFormValue }) {

  return (
    <Fragment>
      <div className="checkmail-contents">
        <div className="confirmation-form">
          <div className="checkmail-title mb-50">
            ネスレ会員登録完了
          </div>
          <div className="complete-short-info mb-50">登録完了いたしました。<br />引き続きサイトをお楽しみください</div>
          <div className="checkmail-content mb-50">
            <span>
              <div className="email-message mb-50">
                <p>「会員情報登録」で1,000コインが加算されました。 「メールマガジン受信登録（ネスレお知らせメール）」100コインが加算されました。</p>
              </div>
            </span>
            <div className="form-actions">
              <div className="key-display">点をご確認 <b>{nhsFormValue.allow_email_magazine? '1,100' : '1000'}</b>ください</div>
            </div>
            <span>
              <div className="email-message mb-50">
                <p>各種キャンペーンにご参加いただく場合やネスレ通販でお買い物いただく場合は、ご連絡先（住所・電話番号）をご登録いただくことが必要となります。 引き続き登録される場合は、下記より登録画面にお進みください。</p>
              </div>
            </span>
            <div className="form-actions">
              <button className="btn btn-confirm btn__submit mt-20 min-200 button js-form-submit form-submit" data-drupal-selector="edit-submit" type="button" id="edit-submit" name="op" value="登録完了" onClick={closeModal}>登録完了</button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default ThanksPage
