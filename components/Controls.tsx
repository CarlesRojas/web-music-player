import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';

interface ControlsProps {
  bindVerticalDrag: (...args: any[]) => ReactDOMAttributes;
}

export default function Controls({ bindVerticalDrag }: ControlsProps) {
  return (
    <main {...bindVerticalDrag()} className="w-full h-full bg-slate-300 flex items-center justify-center">
      Controls
    </main>
  );
}
