import React, { useState } from "react";
import Recaptcha from "../../../registration-forms/recaptcha.jsx";
import Modal from "../../../registration-forms/modal.jsx";
import RegistrationFormComponent from "./RegistrationFormComponent";

function RegistrationForm({ form, values }) {
  const [mailMagazineModal, setMailMagazineModal] = useState(false);

  function mailMagazineHandle(e) {
    e.preventDefault();
    setMailMagazineModal(true);
  }

  return (
    <div className="short-registration-page">
      <div className="container short-registration-content react-registration-container">
        <div className="form-timeline">
          <div className="form-timeline-inner">
            <div className="short-registration-form">
              <div className="form-content">
                <div>
                  <div className="form-group terms-use row">
                    <div className="col-md-12 form-col">
                      ネスレ通販オンラインショップを初めてご利用される方は、利用規約に同意の上、下記の情報をご入力ください。
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-12 form-col">
                      <p className="form-row fields-label req-before clearfix">
                        <sub className="red-star">*</sub>入力必須項目
                      </p>
                    </div>
                  </div>
                  <RegistrationFormComponent
                    form={form}
                    onOpenMagazineModal={mailMagazineHandle}
                    values={values}
                  />
                  <Recaptcha />
                  <Modal
                    show={mailMagazineModal}
                    className="mail-magazine-modal"
                    handleClose={(e) => {
                      e.preventDefault();
                      setMailMagazineModal(false);
                    }}
                  >
                    ※最新のコンテンツやお得なキャンペーン、ネスレ製品の情報などをお届けします。
                    <br />
                    ※各種キャンペーンの応募にはメールマガジンの受信が必要となります。
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
