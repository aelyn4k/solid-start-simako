import type { JSX } from "solid-js";
import OwnerSidebar from "~/components/layout/OwnerSidebar";

export default function DashboardLayout(props: {
  title: string;
  subtitle: string;
  children: JSX.Element;
}) {
  return (
    <OwnerSidebar title={props.title} subtitle={props.subtitle}>
      {props.children}
    </OwnerSidebar>
  );
}
