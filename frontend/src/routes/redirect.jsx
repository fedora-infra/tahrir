import { Navigate, useParams } from "react-router";

export function RedirectParam({ base }) {
  const { slugdata } = useParams();
  return <Navigate to={`${base}${slugdata}`} replace />;
}

export function RedirectContrast() {
  const { id_b } = useParams();
  return <Navigate to={`/contrast/${id_b}`} replace />;
}

export function RedirectRankingsYear() {
  const { year } = useParams();
  return <Navigate to={`/rankings/y/${year}`} replace />;
}

export function RedirectRankingsMonth() {
  const { year, month } = useParams();
  return <Navigate to={`/rankings/y/${year}/m/${month}`} replace />;
}

export function RedirectRankingsDay() {
  const { year, month, day } = useParams();
  return <Navigate to={`/rankings/y/${year}/m/${month}/d/${day}`} replace />;
}
