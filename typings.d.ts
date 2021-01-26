declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}
type formatValues = { [key: string]: string | number };

declare module 'umi/locale' {
  export const formatMessage: ({ id }: { id: string }, values?: formatValues) => string;
  export class FormattedMessage extends React.Component<
    {
      id: string;
      values?: formatValues;
    },
    any
  > {
    render(): JSX.Element;
  }
}

interface Window {
  previewWindow: string;
}
