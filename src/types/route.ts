export interface Route {
  path: string;
  component: React.ComponentType<unknown>;
  exact?: boolean;
  requireLogin: boolean;
}
