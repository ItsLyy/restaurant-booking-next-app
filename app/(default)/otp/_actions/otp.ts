import { FormState } from "@types";

export async function verifyOTPAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const otp = formData.get("otp") as string;
  console.log(otp);
  return { success: true, message: `OTP verified: ${otp}` };
}
