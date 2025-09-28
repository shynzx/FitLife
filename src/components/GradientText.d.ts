declare module '../../components/GradientText.jsx' {
  interface GradientTextProps {
    children: React.ReactNode;
    className?: string;
    colors?: string[];
    animationSpeed?: number;
    showBorder?: boolean;
  }

  const GradientText: React.ComponentType<GradientTextProps>;
  export default GradientText;
}