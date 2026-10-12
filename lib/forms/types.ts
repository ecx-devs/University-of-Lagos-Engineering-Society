

export type FormValues = Record<string, string>;

export type FieldName<TValues extends FormValues> = keyof TValues & string;

export type FieldErrors<TValues extends FormValues> = Partial<
  Record<FieldName<TValues>, string>
>;
