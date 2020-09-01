type Unsubscribe = () => void;
type Listener = (...args: any[]) => void;

interface AppRuntime {
  send(channel: string, data: any): void;
  subscribe(channel: string, listener: Listener): Unsubscribe;
}

const appRuntime = (window as any).appRuntime as AppRuntime;
export default appRuntime;
