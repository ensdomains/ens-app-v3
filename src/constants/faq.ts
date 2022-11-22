import FAQSVG from '@app/assets/FAQ.svg'
import PersonPlusSVG from '@app/assets/PersonPlus.svg'
import SOSSVG from '@app/assets/SOS.svg'
import SpannerSVG from '@app/assets/Spanner.svg'

export const faqOptions = [
  {
    title: 'general',
    slug: 'general',
    icon: FAQSVG,
  },
  {
    title: 'register',
    slug: 'registering-a-name',
    icon: PersonPlusSVG,
  },
  {
    title: 'manage',
    slug: 'managing-a-name',
    icon: SpannerSVG,
  },
  {
    title: 'troubleshoot',
    slug: 'troubleshooting',
    icon: SOSSVG,
  },
]
