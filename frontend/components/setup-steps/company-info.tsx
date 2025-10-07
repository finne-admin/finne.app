import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function CompanyInfo({ updateFormData, formData }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Company Information</h2>
      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={formData.companyName || ''}
          onChange={(e) => updateFormData({ companyName: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="companyDescription">Company Description</Label>
        <Textarea
          id="companyDescription"
          value={formData.companyDescription || ''}
          onChange={(e) => updateFormData({ companyDescription: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="companyWebsite">Company Website</Label>
        <Input
          id="companyWebsite"
          type="url"
          value={formData.companyWebsite || ''}
          onChange={(e) => updateFormData({ companyWebsite: e.target.value })}
        />
      </div>
    </div>
  )
}

