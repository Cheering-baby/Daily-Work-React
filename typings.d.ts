declare module '*.css';
declare module '*.less';
declare module "*.png";
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement
  const url: string
  export default url
}
declare module '@/utils/screen';
declare module 'umi/locale';
interface Window {
  previewWindow: any;
}
