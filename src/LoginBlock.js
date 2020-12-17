import React from 'react';

function LoginBlock({ bearerToken }) {
  const pathName = window.location.pathname

  return (
    <> {
      bearerToken && (
        <section id="block-loginlinkblock" className="clearfix">
          <div className="loginlink-note">
            <h4>会員のお客様</h4>
            <p>メールアドレスとパスワードを入力し、ログインをお願いします。</p>
          </div>
          <div className="login-link">
            <a
              href={'/front/app/common/login/?URL=' + pathName} title="Redirect to Login Page."
              className="login-link-block"
            >
              ログイン
          </a>
          </div>
        </section>
      )
    }
    </>
  )
}

export default LoginBlock
