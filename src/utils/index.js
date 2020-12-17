import { get } from "lodash";
import AuthService from "../services/AuthService";

export function getFormFieldValue(form, nestedFieldName) {
  const formInstance = form.getFieldMeta();
  const values = formInstance.value;

  return get(values, nestedFieldName);
}

export const hideNestleBlockContent = () => {
  const blockNestleContentElm = document.getElementById('block-nestle-content');
  if (blockNestleContentElm) {
    blockNestleContentElm.style.display = "none";
  }
};

export const showNestleBlockContent = () => {
  const blockNestleContentElm = document.getElementById('block-nestle-content');
  if (blockNestleContentElm) {
    blockNestleContentElm.style.display = "block";
  }
};

export function isLoggedIn() {
  return AuthService.isUserLoggedIn()
}
