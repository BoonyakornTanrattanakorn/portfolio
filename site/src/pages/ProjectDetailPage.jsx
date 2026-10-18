import ProjectLayout from '../components/ProjectLayout.jsx';

export default function ProjectDetailPage({
  slug,
  title,
  summary,
  date,
  organization,
  role,
  tags = [],
  thumbnail,
  base = '/',
}) {
  return (
    <ProjectLayout
      title={title || slug}
      summary={summary}
      date={date}
      organization={organization}
      role={role}
      tags={tags}
      thumbnail={thumbnail}
      base={base}
    >
      <p>Project details for {slug}. Full narrative will be populated.</p>
    </ProjectLayout>
  );
}
