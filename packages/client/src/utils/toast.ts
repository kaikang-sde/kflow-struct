import { enqueueSnackbar } from "notistack";

/**
 * toast is a function that shows a toast message
 * @param msg - the message to show
 * @param variant - the variant of the toast message
 */
export const toast = {
  success: (msg: string) => enqueueSnackbar(msg, { variant: "success" }),
  error: (msg: string) => enqueueSnackbar(msg, { variant: "error" }),
};