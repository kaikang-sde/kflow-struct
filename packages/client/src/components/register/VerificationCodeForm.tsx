import { useVerificationCode } from "../../hooks";


type Props = {
    type: string;
};

function VerificationCodeForm({ type }: Props) {
    const { verificationCodeTemplate } = useVerificationCode(type);
    return verificationCodeTemplate;
}

export default VerificationCodeForm;