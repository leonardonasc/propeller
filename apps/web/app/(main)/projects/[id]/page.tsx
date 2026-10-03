

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectOverviewPage({ params }: PageProps) {
  const { slug } = await params

  return (
    <div>slug: {slug}</div>
  )
}