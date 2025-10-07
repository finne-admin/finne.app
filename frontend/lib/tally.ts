export function tenantFromHost(host: string): string {
  const sub = (host || '').split('.')[0] || 'piloto'
  return ['piloto', 'stn', 'anestudio'].includes(sub) ? sub : 'piloto'
}

type OpenArgs = {
  formId: string
  userId?: string | null
  email?: string | null
  onSubmit?: (submissionId: string) => void
}

export function openTallyPopup({ formId, userId, email, onSubmit }: OpenArgs) {
  if (!window.Tally) return
  const tenant = tenantFromHost(window.location.hostname)

  window.Tally.openPopup(formId, {
    layout: 'modal',
    width: 740,
    overlay: true,
    hiddenFields: {
      userId: userId ?? undefined,
      appEmail: email ?? undefined,
      tenant, // 👈 clave
    },
    onSubmit: (payload: any) => onSubmit?.(payload?.id),
  })
}
