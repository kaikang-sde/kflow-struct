import { useTitle } from "react-use";
import RegisterForm from "./register/RegisterForm";

interface IRegisterProps {
    changeState: () => void; // click register/login button to switch component
}

export default function Register(props: IRegisterProps) {
    // auto set page title - react-use
    useTitle("KFlow Struct - Register");
    return (
        <div className="h-full flex items-center justify-center">
            <div className="w-[368px] rounded-lg shadow-lg bg-white p-6 space-y-2 border-gray-200">
                <div className="space-y-2 px-12 text-center">
                    <span className="font-bold cursor-pointer">KFlow Struct</span>
                </div>

                <RegisterForm />

                <div className="flex items-center space-x-2">
                    <hr className="flex-grow border-zinc-200" />
                    <span
                        className="text-zinc-400 dark:text-zinc-300 text-sm"
                        data-id="14"
                    >
                        Or
                    </span>
                    <hr className="flex-grow border-zinc-200" />
                </div>
                {/* WeChat Login */}
                <div className="text-sm flex justify-center text-[#aaaaaa]">
                    <span>
                        Already have an account?
                        <span
                            onClick={props.changeState}
                            className="text-blue-500 cursor-pointer"
                        >
                            Login
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}