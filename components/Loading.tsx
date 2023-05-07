import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { RiLoader4Fill } from 'react-icons/ri';

export type LoadingProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const Loading = ({ ...props }: LoadingProps) => {
  return (
    <div {...props} className="relative w-full h-full flex items-center justify-center">
      <RiLoader4Fill className="text-slate-400 relative p-2 h-16 w-16 animate-spin" />
    </div>
  );
};

export default Loading;
