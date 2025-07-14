import { useVerificationCode } from "../../hooks/useVerificationCode";

type Props = {
  type: string;
  setRefreshCaptchaRef?: React.RefObject<((params: { type: string }) => void) | null>;
};

function VerificationCodeForm({ type, setRefreshCaptchaRef }: Props) {
  // refreshCaptcha is the actual "refresh captcha" function returned by useVerificationCode hook
  // verificationCodeTemplate is the UI template of verification fields - captcha + smsCode
  const { refreshCaptcha, verificationCodeTemplate } = useVerificationCode(type);

  // set the refreshCaptcha function to the ref.current so that parent component can invoke it by ref.current
  if (setRefreshCaptchaRef) {
    setRefreshCaptchaRef.current = refreshCaptcha;
  }

  return verificationCodeTemplate;
}

export default VerificationCodeForm;