// src/utils/otpAndPasswordUtils.js

/**
 * Handles moving focus to the next OTP input.
 * In a React context, you'd typically pass a ref or manage focus
 * via state, but to mimic the original JS, we'll keep the DOM ID approach.
 * @param {Event} e The synthetic React event object.
 * @param {string} nextInputId The ID of the next OTP input element.
 */
export const handleOtpInput = (e, nextInputId) => {
    const currentInput = e.target;
    // This logic is mostly moved to the React component's onChange/onKeyDown for better React integration.
    // However, if you specifically want to use `document.getElementById` from here for next focus:
    if (currentInput.value.length === currentInput.maxLength && nextInputId) {
        document.getElementById(nextInputId)?.focus();
    } else if (currentInput.value.length === 0 && e.key === 'Backspace' && e.target.previousSibling) {
        // Handle backspace: move to previous input
        e.target.previousSibling.focus();
    }
};


/**
 * Validates if two password strings match.
 * In React, we'll return a boolean and let the component manage error messages.
 * @param {string} newPassword The new password.
 * @param {string} confirmPassword The confirmed password.
 * @returns {boolean} True if passwords match, false otherwise.
 */
export const validatePasswordsMatch = (newPassword, confirmPassword) => {
    // Check for empty passwords if needed, but often done in component's required attribute
    if (newPassword === "" || confirmPassword === "") {
        return false; // Or handle as a different validation error
    }
    return newPassword === confirmPassword;
};

/**
 * Handles paste event for OTP inputs to distribute digits.
 * @param {Event} e The paste event.
 * @param {Array<React.RefObject>} otpRefs Array of refs to OTP input elements.
 * @param {number} startIndex The index of the input where paste occurred.
 * @param {Function} setOtpState Function to update the OTP state array.
 */
export const handleOtpPaste = (e, otpRefs, startIndex, setOtpState) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d+$/.test(pasteData) && pasteData.length > 0) {
        const newOtpValues = Array(otpRefs.length).fill('');
        for (let i = 0; i < pasteData.length; i++) {
            if (startIndex + i < otpRefs.length) {
                newOtpValues[startIndex + i] = pasteData[i];
            }
        }
        setOtpState(newOtpValues);


        const nextFocusIndex = Math.min(startIndex + pasteData.length, otpRefs.length - 1);
        otpRefs[nextFocusIndex]?.current?.focus();
    }
};

