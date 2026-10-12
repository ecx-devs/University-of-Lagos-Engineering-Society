
export function HoneypotField({ id, name = 'company_website' }: { id: string; name?: string }) {
  return (
    <div aria-hidden="true" className="absolute top-0 left-[-9999px] h-0 w-0 overflow-hidden">
      <label htmlFor={id}>Company website</label>
      <input id={id} name={name} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}
