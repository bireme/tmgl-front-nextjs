export interface EventInterface {
  title: string;
  description: string;
  location: string;
  date: string;
  links: EventLink[];
}

export interface EventLink {
  label: string;
  url: string;
}
