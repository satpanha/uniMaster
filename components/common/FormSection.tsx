import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface FormSectionProps {
  icon: LucideIcon
  title: string
  children: ReactNode
}

export function FormSection({ icon: Icon, title, children }: FormSectionProps) {
  return (
    <fieldset className="form-section">
      <legend className="w-full">
        <div className="form-section-header">
          <div className="form-section-icon">
            <Icon />
          </div>
          <h3 className="form-section-title">{title}</h3>
        </div>
      </legend>
      <div className="form-grid">
        {children}
      </div>
    </fieldset>
  )
}

