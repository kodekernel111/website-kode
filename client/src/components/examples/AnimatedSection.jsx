import AnimatedSection from '../AnimatedSection'
import { Card } from '@/components/ui/card'

export default function AnimatedSectionExample() {
  return (
    <div className="p-8 space-y-8">
      <AnimatedSection>
        <Card className="p-8">
          <h3 className="text-2xl font-bold mb-4">First Section</h3>
          <p className="text-muted-foreground">This section animates when scrolled into view.</p>
        </Card>
      </AnimatedSection>
      <AnimatedSection delay={200}>
        <Card className="p-8">
          <h3 className="text-2xl font-bold mb-4">Second Section</h3>
          <p className="text-muted-foreground">This section has a delay.</p>
        </Card>
      </AnimatedSection>
    </div>
  )
}
