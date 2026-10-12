export interface NavItem {
  trigger: string;
  href?: string;
  items?: { label: string; href: string }[];
}
