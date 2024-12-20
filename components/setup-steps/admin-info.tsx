import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AdminInfo({ updateFormData, formData }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Admin Information</h2>
      <div>
        <Label htmlFor="adminName">Full Name</Label>
        <Input
          id="adminName"
          value={formData.adminName || ''}
          onChange={(e) => updateFormData({ adminName: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="adminEmail">Email</Label>
        <Input
          id="adminEmail"
          type="email"
          value={formData.adminEmail || ''}
          onChange={(e) => updateFormData({ adminEmail: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="adminPassword">Password</Label>
        <Input
          id="adminPassword"
          type="password"
          value={formData.adminPassword || ''}
          onChange={(e) => updateFormData({ adminPassword: e.target.value })}
          required
        />
      </div>
    </div>
  )
}

