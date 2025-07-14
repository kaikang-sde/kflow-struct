import { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { getCaptcha, getSmsCode } from "../api/user";
import { toast } from "../utils/toast";

export function useVerificationCode(type: string) {
  const { register, trigger, getValues, formState: { errors } } = useFormContext();

  // captcha image source
  const [captchaSrc, setCaptchaSrc] = useState<string>("");

  // timer
  let [countDown, setCountDown] = useState(60);
  const [startedCountDown, setStartedCountDown] = useState<boolean>(false);

  // button disable if startedCountDown is true or phone is empty or phone is not a valid phone number
  const [isDisable, setIsDisable] = useState(false);

  /** React Query useMutation define refresh captcha logic */
  const { mutate: refreshCaptcha, isPending: loadingWithGetCaptcha } = useMutation({
    mutationFn: getCaptcha,
    onSuccess: (result) => {
      const svgStr = result.data?.captcha;
      setCaptchaSrc(svgStr)
    },
    onError: (err: any) => {
      toast.error(`${err.response?.data?.message}`);
    }
  });
  // refresh captcha when component mounted
  useEffect(() => {
    refreshCaptcha({ type });
  }, [refreshCaptcha]);


  /**
   * React Query useMutation define send sms code logic
   */
  const { mutate: execSendSmsCode, isPending: loadingWithSendSmsCode } = useMutation({
    mutationFn: getSmsCode,
    onSuccess: () => {
      setStartedCountDown(true); // start the countdown timer after sending sms code successfully
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message;

      if (typeof msg === "string") {
        if (msg.includes("Captcha is incorrect")) {
          toast.error(`${msg}`);
          refreshCaptcha({ type });
          return;
        }
      }
    
      if (Array.isArray(msg) && msg.some(m => m.includes("captcha"))) {
        toast.error(`${msg}`);
        refreshCaptcha({ type });
        return; 
      }
    
      toast.error(`${msg}`);
    }
  });


  async function getCode() {
    const valid = await trigger(["phone", "captcha"]);
    if (!valid) return;
    const { phone, captcha } = getValues();
    if (!phone || !captcha) return;

    execSendSmsCode({ phone, captcha, type: type as "register" | "login" });
  }


  /** Countdown Timer
   * if startedCountDown is false, return
   * disable the button
   * start the countdown (every second)
   * when countdown is 0, reset the countdown, startedCountDown, isDisable(enable the button)
   */
  useEffect(() => {
    if (startedCountDown === false) return;

    setIsDisable(true);
    const timer = setInterval(() => {
      setCountDown(--countDown);
      // when countdown is 0, reset the countdown, startedCountDown, isDisable(enable the button)
      if (countDown <= 0) {
        clearInterval(timer);
        setIsDisable(false);
        setCountDown(60);
        setStartedCountDown(false);
      }
    }, 1000);
  }, [startedCountDown]);


  // return the template of verification code - captcha + smsCode UIs
  const verificationCodeTemplate = (
    <>
      {/* captcha input */}
      <div className="flex items-center gap-2">
        <TextField
          label="Captcha"
          fullWidth
          {...register("captcha", { required: "Captcha is required" })}
          error={!!errors.captcha}
          helperText={typeof errors.captcha?.message === "string" ? errors.captcha.message : ""}
        />
        <img
          src={`data:image/svg+xml;base64,${btoa(captchaSrc)}`}
          onClick={() => {
            if (!loadingWithGetCaptcha) refreshCaptcha({ type });
          }}
          alt="captcha"
          className={`w-24 h-12 rounded-md border cursor-pointer transition-opacity ${loadingWithGetCaptcha ? "opacity-50 pointer-events-none" : ""}`}
        />
      </div>

      {/* sms code input */}
      <div className="flex items-center gap-2">
        <TextField
          label="SMS Code"
          fullWidth
          {...register("smsCode", { required: "SMS code is required" })}
          error={!!errors.smsCode}
          helperText={typeof errors.smsCode?.message === "string" ? errors.smsCode.message : ""}
        />
        <Button
          variant="outlined"
          disabled={isDisable || loadingWithSendSmsCode}
          onClick={getCode}
        >
          {loadingWithSendSmsCode
            ? "Sending..."
            : startedCountDown
              ? `${countDown}s`
              : "Send Code"}
        </Button>
      </div>
    </>
  );

  return {
    verificationCodeTemplate,
    refreshCaptcha
  }
}

