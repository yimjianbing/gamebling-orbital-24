export function validatePassword(password) {
  // check if password is above 6 chars
  if (password < 6) {
    // alert("no!")
    return false;
  } else {
    return true;
  }
}

export function validateField(field) {
  if (field == null) {
    return false;
  }

  if (field.length <= 0) {
    return false;
  }

  return true;
}
