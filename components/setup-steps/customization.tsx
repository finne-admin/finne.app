import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import Image from "next/image";

export function Customization({ updateFormData, formData }: any) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
        updateFormData({ logo: file })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Customization</h2>
      <div>
        <Label htmlFor="primaryColor">Primary Color</Label>
        <Input
          id="primaryColor"
          type="color"
          value={formData.primaryColor || '#8BC5B5'}
          onChange={(e) => updateFormData({ primaryColor: e.target.value })}
          className="h-10 p-1"
        />
      </div>
      <div>
        <Label htmlFor="logo">Company Logo</Label>
        <Input
          id="logo"
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="mt-1"
        />
        {logoPreview && (
            <Image src={logoPreview} alt={"Logo Preview"} className="mt-2 max-w-xs" />
        )}
      </div>
    </div>
  )
}

