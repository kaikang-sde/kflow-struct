import { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { useFormContext } from "react-hook-form";

export function useVerificationCode(type: string) {
  const { register, trigger, getValues, formState: { errors } } = useFormContext();

  // captcha image source
  const [captchaSrc, setCaptchaSrc] = useState<string>("");

  // timer
  let [countDown, setCountDown] = useState(60);
  const [startedCountDown, setStartedCountDown] = useState<boolean>(false);

  // button disable if startedCountDown is true or phone is empty or phone is not a valid phone number
  const [isDisable, setIsDisable] = useState(false);


  async function getCode() {
    const valid = await trigger(["phone", "captcha"]);
    if (!valid) return;
    const { phone, captcha } = getValues();
    if (!phone || !captcha) return;

    // Captcha API request

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
          onClick={() => { }}
          alt="captcha"
          className="w-24 h-12 rounded-md border cursor-pointer"
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
          disabled={isDisable}
          onClick={getCode}
        >
          {startedCountDown ? `${countDown}s` : "Send Code"}
        </Button>
      </div>
    </>
  );

  return {
    verificationCodeTemplate,
  }
}

