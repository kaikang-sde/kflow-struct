import { useState } from "react";
import { useTitle } from "react-use";
import AccountLoginForm from "./login/AccountLoginForm";
import CodeLoginForm from "./login/CodeLoginForm";

interface ILoginProps {
    changeState: () => void;
}

export default function Login(props: ILoginProps) {
    useTitle("KFlow Struct - Login");
    const [activeKey, setActiveKey] = useState(1);
    return (
        <div className="h-full flex items-center justify-center">
            <div className="w-[368px] rounded-lg shadow-lg bg-white p-6 space-y-2 border-gray-200">
                <div className="space-y-2 px-12 text-center">
                    <span className="font-bold cursor-pointer">KFlow Struct Login</span>
                </div>
                <div className="space-y-2 px-12 text-center">
                    <span
                        onClick={() => setActiveKey(1)}
                        className={[
                            "mr-[10px] cursor-pointer",
                            activeKey ? "font-bold" : "text-[#aaaaaa]",
                        ].join(" ")}
                    >
                        Account Login
                    </span>
                    <span
                        onClick={() => setActiveKey(0)}
                        className={[
                            !activeKey ? "font-bold" : "text-[#aaaaaa]",
                            "cursor-pointer",
                        ].join(" ")}
                    >
                        Code Login
                    </span>
                    <p className="text-zinc-500 text-xs">Log in to start exploring KFlow Struct</p>
                </div>

                {/* activeKey - 1 - true - Account login */}
                {!!activeKey && <AccountLoginForm />}

                {/* activeKey - 0 - false - Code login */}
                {!activeKey && <CodeLoginForm />}

                <div className="flex items-center space-x-2">
                    <hr className="flex-grow border-zinc-200" />
                    <span
                        className="text-zinc-400 dark:text-zinc-300 text-sm"
                        data-id="14"
                    >
                        or
                    </span>
                    <hr className="flex-grow border-zinc-200" />
                </div>
                {/* wechat login */}

                <div className="text-sm flex justify-center text-[#aaaaaa]">
                    <span>
                        Don't have an account?
                        <span
                            onClick={props.changeState}
                            className="text-blue-500 cursor-pointer"
                        >
                            Go to register
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}