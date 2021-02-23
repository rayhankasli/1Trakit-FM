/** 
 * toFormData
 * @author Nitesh Sharma 
 */
export function toFormData<T>(formValue: T): FormData {
  const formData: FormData = new FormData();

  for (const key of Object.keys(formValue)) {
    const value: string = formValue[key];
    formData.append(key, value);
  }

  return formData;
}