// import { useVerificationCode } from "../../hooks";


// type Props = {
//     type: string;
// };

// function VerificationCodeForm({ type }: Props) {
//     const { verificationCodeTemplate } = useVerificationCode(type);
//     return verificationCodeTemplate;
// }

// export default VerificationCodeForm;


import { useVerificationCode } from "../../hooks/useVerificationCode";

type Props = {
  type: string;
  setRefreshCaptchaRef?: React.RefObject<(params: { type: string }) => void>;
};

function VerificationCodeForm({ type, setRefreshCaptchaRef }: Props) {
  const { refreshCaptcha, verificationCodeTemplate } = useVerificationCode(type);

  // 将 refreshCaptcha 暴露给父组件
  if (setRefreshCaptchaRef) {
    setRefreshCaptchaRef.current = refreshCaptcha;
  }

  return verificationCodeTemplate;
}

export default VerificationCodeForm;