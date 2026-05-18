export interface FormState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export type FormAction = (
  state: FormState,
  payload: FormData,
) => Promise<FormState>;
